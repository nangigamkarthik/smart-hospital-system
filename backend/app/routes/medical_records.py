from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.medical_record import MedicalRecord
from app.models.patient import Patient
from app.models.doctor import Doctor
from datetime import datetime
import random
import string

medical_records_bp = Blueprint('medical_records', __name__)

def generate_record_id():
    """Generate unique medical record ID"""
    while True:
        record_id = 'MR' + ''.join(random.choices(string.digits, k=6))
        if not MedicalRecord.query.filter_by(record_id=record_id).first():
            return record_id

@medical_records_bp.route('', methods=['GET'])
@jwt_required()
def get_medical_records():
    """Get all medical records with pagination"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        
        query = MedicalRecord.query
        
        # Apply search filter
        if search:
            query = query.join(Patient).filter(
                db.or_(
                    MedicalRecord.record_id.like(f'%{search}%'),
                    Patient.first_name.like(f'%{search}%'),
                    Patient.last_name.like(f'%{search}%')
                )
            )
        
        # Paginate
        pagination = query.order_by(MedicalRecord.visit_date.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        # Enhance records with patient and doctor information
        records_data = []
        for record in pagination.items:
            record_dict = record.to_dict()
            
            # Add patient name
            patient = Patient.query.get(record.patient_id)
            if patient:
                record_dict['patient_name'] = patient.full_name
            
            # Add doctor name
            doctor = Doctor.query.get(record.doctor_id)
            if doctor:
                record_dict['doctor_name'] = doctor.full_name
            
            records_data.append(record_dict)
        
        return jsonify({
            'records': records_data,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        print(f"Error fetching medical records: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@medical_records_bp.route('/<int:record_id>', methods=['GET'])
@jwt_required()
def get_medical_record(record_id):
    """Get single medical record"""
    try:
        record = MedicalRecord.query.get(record_id)
        
        if not record:
            return jsonify({'error': 'Medical record not found'}), 404
        
        record_dict = record.to_dict()
        
        # Add patient and doctor information
        patient = Patient.query.get(record.patient_id)
        doctor = Doctor.query.get(record.doctor_id)
        
        if patient:
            record_dict['patient'] = patient.to_dict()
        if doctor:
            record_dict['doctor'] = doctor.to_dict()
        
        return jsonify(record_dict), 200
        
    except Exception as e:
        print(f"Error fetching medical record: {str(e)}")
        return jsonify({'error': str(e)}), 500

@medical_records_bp.route('', methods=['POST'])
@jwt_required()
def create_medical_record():
    """Create new medical record"""
    try:
        data = request.get_json()
        
        print(f"Received medical record data: {data}")
        
        # Validate required fields
        if not data.get('patient_id'):
            return jsonify({'error': 'Patient ID is required'}), 400
        if not data.get('doctor_id'):
            return jsonify({'error': 'Doctor ID is required'}), 400
        if not data.get('diagnosis'):
            return jsonify({'error': 'Diagnosis is required'}), 400
        
        # Verify patient and doctor exist
        patient = Patient.query.get(data['patient_id'])
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
            
        doctor = Doctor.query.get(data['doctor_id'])
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        
        record = MedicalRecord(
            record_id=generate_record_id(),
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            appointment_id=data.get('appointment_id'),
            visit_date=datetime.strptime(data.get('visit_date', datetime.utcnow().isoformat()), '%Y-%m-%dT%H:%M:%S.%fZ') if 'visit_date' in data else datetime.utcnow(),
            visit_type=data.get('visit_type', 'OPD'),
            chief_complaint=data.get('chief_complaint'),
            symptoms=data.get('symptoms'),
            diagnosis=data['diagnosis'],
            treatment=data.get('treatment'),
            prescription=data.get('prescription'),
            blood_pressure=data.get('blood_pressure'),
            temperature=data.get('temperature'),
            pulse_rate=data.get('pulse_rate'),
            respiratory_rate=data.get('respiratory_rate'),
            weight=data.get('weight'),
            height=data.get('height'),
            lab_tests_ordered=data.get('lab_tests_ordered'),
            lab_results=data.get('lab_results'),
            follow_up_required=data.get('follow_up_required', False),
            follow_up_date=datetime.strptime(data['follow_up_date'], '%Y-%m-%d').date() if data.get('follow_up_date') else None,
            follow_up_notes=data.get('follow_up_notes')
        )
        
        db.session.add(record)
        
        # Update patient's last visit
        patient.last_visit = datetime.utcnow()
        
        db.session.commit()
        
        print(f"Medical record created successfully: {record.id}")
        
        return jsonify({
            'message': 'Medical record created successfully',
            'record': record.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        print(f"Error creating medical record: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@medical_records_bp.route('/<int:record_id>', methods=['PUT'])
@jwt_required()
def update_medical_record(record_id):
    """Update medical record"""
    try:
        record = MedicalRecord.query.get(record_id)
        
        if not record:
            return jsonify({'error': 'Medical record not found'}), 404
        
        data = request.get_json()
        
        print(f"Updating medical record {record_id} with data: {data}")
        
        # Update fields
        updatable_fields = [
            'visit_type', 'chief_complaint', 'symptoms', 'diagnosis', 'treatment',
            'prescription', 'blood_pressure', 'temperature', 'pulse_rate',
            'respiratory_rate', 'weight', 'height', 'lab_tests_ordered',
            'lab_results', 'follow_up_required', 'follow_up_notes'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(record, field, data[field])
        
        if 'visit_date' in data:
            record.visit_date = datetime.strptime(data['visit_date'], '%Y-%m-%dT%H:%M:%S.%fZ')
        
        if 'follow_up_date' in data and data['follow_up_date']:
            record.follow_up_date = datetime.strptime(data['follow_up_date'], '%Y-%m-%d').date()
        
        db.session.commit()
        
        print(f"Medical record {record_id} updated successfully")
        
        return jsonify({
            'message': 'Medical record updated successfully',
            'record': record.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error updating medical record: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@medical_records_bp.route('/<int:record_id>', methods=['DELETE'])
@jwt_required()
def delete_medical_record(record_id):
    """Delete medical record"""
    try:
        record = MedicalRecord.query.get(record_id)
        
        if not record:
            return jsonify({'error': 'Medical record not found'}), 404
        
        print(f"Deleting medical record {record_id}")
        
        db.session.delete(record)
        db.session.commit()
        
        print(f"Medical record {record_id} deleted successfully")
        
        return jsonify({'message': 'Medical record deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"Error deleting medical record: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@medical_records_bp.route('/patient/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient_records(patient_id):
    """Get all medical records for a specific patient"""
    try:
        records = MedicalRecord.query.filter_by(patient_id=patient_id).order_by(
            MedicalRecord.visit_date.desc()
        ).all()
        
        records_data = []
        for record in records:
            record_dict = record.to_dict()
            
            # Add doctor name
            doctor = Doctor.query.get(record.doctor_id)
            if doctor:
                record_dict['doctor_name'] = doctor.full_name
            
            records_data.append(record_dict)
        
        return jsonify({
            'records': records_data,
            'total': len(records_data)
        }), 200
        
    except Exception as e:
        print(f"Error fetching patient records: {str(e)}")
        return jsonify({'error': str(e)}), 500
