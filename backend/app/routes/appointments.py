from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.models.doctor import Doctor
from datetime import datetime
import random
import string

appointments_bp = Blueprint('appointments', __name__)

def generate_appointment_id():
    """Generate unique appointment ID"""
    while True:
        apt_id = 'APT' + ''.join(random.choices(string.digits, k=6))
        if not Appointment.query.filter_by(appointment_id=apt_id).first():
            return apt_id

@appointments_bp.route('', methods=['GET'])
@jwt_required()
def get_appointments():
    """Get all appointments"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status', '')
        doctor_id = request.args.get('doctor_id', type=int)
        patient_id = request.args.get('patient_id', type=int)
        date = request.args.get('date', '')
        
        query = Appointment.query
        
        if status:
            query = query.filter_by(status=status)
        if doctor_id:
            query = query.filter_by(doctor_id=doctor_id)
        if patient_id:
            query = query.filter_by(patient_id=patient_id)
        if date:
            query = query.filter_by(appointment_date=datetime.strptime(date, '%Y-%m-%d').date())
        
        pagination = query.order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        appointments_data = []
        for apt in pagination.items:
            apt_dict = apt.to_dict()
            # Add patient and doctor info
            patient = Patient.query.get(apt.patient_id)
            doctor = Doctor.query.get(apt.doctor_id)
            apt_dict['patient_name'] = f"{patient.first_name} {patient.last_name}" if patient else None
            apt_dict['doctor_name'] = f"Dr. {doctor.first_name} {doctor.last_name}" if doctor else None
            apt_dict['doctor_specialization'] = doctor.specialization if doctor else None
            appointments_data.append(apt_dict)
        
        return jsonify({
            'appointments': appointments_data,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>', methods=['GET'])
@jwt_required()
def get_appointment(appointment_id):
    """Get single appointment"""
    try:
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404
        
        apt_dict = appointment.to_dict()
        patient = Patient.query.get(appointment.patient_id)
        doctor = Doctor.query.get(appointment.doctor_id)
        apt_dict['patient'] = patient.to_dict() if patient else None
        apt_dict['doctor'] = doctor.to_dict() if doctor else None
        
        return jsonify(apt_dict), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('', methods=['POST'])
@jwt_required()
def create_appointment():
    """Create new appointment"""
    try:
        data = request.get_json()
        
        # Validate patient and doctor exist
        patient = Patient.query.get(data['patient_id'])
        doctor = Doctor.query.get(data['doctor_id'])
        
        if not patient:
            return jsonify({'error': 'Patient not found'}), 404
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        
        appointment = Appointment(
            appointment_id=generate_appointment_id(),
            patient_id=data['patient_id'],
            doctor_id=data['doctor_id'],
            appointment_date=datetime.strptime(data['appointment_date'], '%Y-%m-%d').date(),
            appointment_time=datetime.strptime(data['appointment_time'], '%H:%M').time(),
            appointment_type=data.get('appointment_type', 'Consultation'),
            reason=data.get('reason'),
            notes=data.get('notes'),
            duration_minutes=data.get('duration_minutes', 30),
            consultation_fee=data.get('consultation_fee', doctor.consultation_fee)
        )
        
        db.session.add(appointment)
        
        # Update patient's last visit
        patient.last_visit = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Appointment created successfully',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@appointments_bp.route('/<int:appointment_id>/status', methods=['PUT'])
@jwt_required()
def update_appointment_status(appointment_id):
    try:
        appointment = Appointment.query.get(appointment_id)
        if not appointment:
            return jsonify({'error': 'Appointment not found'}), 404

        data = request.get_json()
        new_status = data.get('status')

        if not new_status:
            return jsonify({'error': 'Status is required'}), 400

        # ✅ ADD THIS VALIDATION
        allowed_statuses = [
            'Scheduled',
            'Confirmed',
            'In Progress',
            'Completed',
            'Cancelled',
            'No Show'
        ]

        if new_status not in allowed_statuses:
            return jsonify({'error': 'Invalid status value'}), 400

        appointment.status = new_status

        if new_status == 'Cancelled':
            appointment.cancelled_at = datetime.utcnow()
            appointment.cancellation_reason = data.get('cancellation_reason')

        elif new_status == 'In Progress':
            appointment.checked_in_at = datetime.utcnow()

        elif new_status == 'Completed':
            appointment.checked_out_at = datetime.utcnow()

        db.session.commit()

        return jsonify({
            'message': 'Appointment status updated successfully',
            'appointment': appointment.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500



@appointments_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_appointment_stats():
    """Get appointment statistics"""
    try:
        total = Appointment.query.count()
        scheduled = Appointment.query.filter_by(status='Scheduled').count()
        completed = Appointment.query.filter_by(status='Completed').count()
        cancelled = Appointment.query.filter_by(status='Cancelled').count()
        no_show = Appointment.query.filter_by(status='No Show').count()
        
        # Today's appointments
        today = datetime.utcnow().date()
        today_appointments = Appointment.query.filter_by(appointment_date=today).count()
        
        return jsonify({
            'total_appointments': total,
            'scheduled': scheduled,
            'completed': completed,
            'cancelled': cancelled,
            'no_show': no_show,
            'today_appointments': today_appointments
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
