from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.patient import Patient
from datetime import datetime
import random
import string

patients_bp = Blueprint('patients', __name__)

def generate_patient_id():
    """Generate unique patient ID"""
    while True:
        patient_id = 'P' + ''.join(random.choices(string.digits, k=6))
        if not Patient.query.filter_by(patient_id=patient_id).first():
            return patient_id

@patients_bp.route('', methods=['GET'])
@jwt_required()
def get_patients():
    """Get all patients with pagination and filtering"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')
        
        query = Patient.query
        
        # Apply filters
        if search:
            query = query.filter(
                db.or_(
                    Patient.first_name.like(f'%{search}%'),
                    Patient.last_name.like(f'%{search}%'),
                    Patient.patient_id.like(f'%{search}%'),
                    Patient.phone.like(f'%{search}%'),
                    Patient.email.like(f'%{search}%')
                )
            )
        
        if status:
            query = query.filter_by(status=status)
        
        # Paginate
        pagination = query.order_by(Patient.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'patients': [patient.to_dict() for patient in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['GET'])
@jwt_required()
def get_patient(patient_id):
    """Get single patient by ID"""
    try:
        patient = Patient.query.get(patient_id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        return jsonify(patient.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@patients_bp.route('', methods=['POST'])
@jwt_required()
def create_patient():
    """Create new patient"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'date_of_birth', 'gender', 'phone']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if email already exists
        if data.get('email'):
            existing = Patient.query.filter_by(email=data['email']).first()
            if existing:
                return jsonify({'error': 'Email already registered'}), 400
        
        # Create patient
        patient = Patient(
            patient_id=generate_patient_id(),
            first_name=data['first_name'],
            last_name=data['last_name'],
            date_of_birth=datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date(),
            gender=data['gender'],
            blood_group=data.get('blood_group'),
            phone=data['phone'],
            email=data.get('email'),
            address=data.get('address'),
            city=data.get('city'),
            state=data.get('state'),
            pincode=data.get('pincode'),
            emergency_contact_name=data.get('emergency_contact_name'),
            emergency_contact_phone=data.get('emergency_contact_phone'),
            emergency_contact_relation=data.get('emergency_contact_relation'),
            allergies=data.get('allergies'),
            chronic_conditions=data.get('chronic_conditions'),
            current_medications=data.get('current_medications'),
            insurance_provider=data.get('insurance_provider'),
            insurance_number=data.get('insurance_number')
        )
        
        db.session.add(patient)
        db.session.commit()
        
        return jsonify({
            'message': 'Patient created successfully',
            'patient': patient.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['PUT'])
@jwt_required()
def update_patient(patient_id):
    """Update patient information"""
    try:
        patient = Patient.query.get(patient_id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        updatable_fields = [
            'first_name', 'last_name', 'gender', 'blood_group', 'phone', 'email',
            'address', 'city', 'state', 'pincode', 'emergency_contact_name',
            'emergency_contact_phone', 'emergency_contact_relation', 'allergies',
            'chronic_conditions', 'current_medications', 'insurance_provider',
            'insurance_number', 'status'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(patient, field, data[field])
        
        if 'date_of_birth' in data:
            patient.date_of_birth = datetime.strptime(data['date_of_birth'], '%Y-%m-%d').date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Patient updated successfully',
            'patient': patient.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/<int:patient_id>', methods=['DELETE'])
@jwt_required()
def delete_patient(patient_id):
    """Delete patient"""
    try:
        patient = Patient.query.get(patient_id)
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        
        db.session.delete(patient)
        db.session.commit()
        
        return jsonify({'message': 'Patient deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@patients_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_patient_stats():
    """Get patient statistics"""
    try:
        total_patients = Patient.query.count()
        active_patients = Patient.query.filter_by(status='Active').count()
        inactive_patients = Patient.query.filter_by(status='Inactive').count()
        
        # Gender distribution
        male_count = Patient.query.filter_by(gender='Male').count()
        female_count = Patient.query.filter_by(gender='Female').count()
        other_count = Patient.query.filter_by(gender='Other').count()
        
        # Recent registrations (last 30 days)
        from datetime import timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_registrations = Patient.query.filter(
            Patient.registered_date >= thirty_days_ago
        ).count()
        
        return jsonify({
            'total_patients': total_patients,
            'active_patients': active_patients,
            'inactive_patients': inactive_patients,
            'gender_distribution': {
                'male': male_count,
                'female': female_count,
                'other': other_count
            },
            'recent_registrations': recent_registrations
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
