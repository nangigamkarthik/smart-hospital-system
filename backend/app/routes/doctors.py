from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.doctor import Doctor
import random
import string

doctors_bp = Blueprint('doctors', __name__)

def generate_doctor_id():
    """Generate unique doctor ID"""
    while True:
        doctor_id = 'D' + ''.join(random.choices(string.digits, k=5))
        if not Doctor.query.filter_by(doctor_id=doctor_id).first():
            return doctor_id

@doctors_bp.route('', methods=['GET'])
@jwt_required()
def get_doctors():
    """Get all doctors"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        specialization = request.args.get('specialization', '')
        status = request.args.get('status', '')
        
        query = Doctor.query
        
        if specialization:
            query = query.filter_by(specialization=specialization)
        if status:
            query = query.filter_by(status=status)
        
        pagination = query.order_by(Doctor.rating.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'doctors': [doctor.to_dict() for doctor in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/<int:doctor_id>', methods=['GET'])
@jwt_required()
def get_doctor(doctor_id):
    """Get single doctor"""
    try:
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        return jsonify(doctor.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('', methods=['POST'])
@jwt_required()
def create_doctor():
    """Create new doctor"""
    try:
        data = request.get_json()
        
        doctor = Doctor(
            doctor_id=generate_doctor_id(),
            first_name=data['first_name'],
            last_name=data['last_name'],
            gender=data['gender'],
            phone=data['phone'],
            email=data['email'],
            specialization=data['specialization'],
            qualification=data['qualification'],
            license_number=data['license_number'],
            experience_years=data.get('experience_years', 0),
            consultation_fee=data.get('consultation_fee', 0.0),
            department_id=data.get('department_id')
        )
        
        db.session.add(doctor)
        db.session.commit()
        
        return jsonify({
            'message': 'Doctor created successfully',
            'doctor': doctor.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/<int:doctor_id>', methods=['PUT'])
@jwt_required()
def update_doctor(doctor_id):
    """Update doctor"""
    try:
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404
        
        data = request.get_json()
        for key, value in data.items():
            if hasattr(doctor, key) and key != 'id':
                setattr(doctor, key, value)
        
        db.session.commit()
        return jsonify({
            'message': 'Doctor updated successfully',
            'doctor': doctor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/specializations', methods=['GET'])
@jwt_required()
def get_specializations():
    """Get all unique specializations"""
    try:
        specializations = db.session.query(Doctor.specialization).distinct().all()
        return jsonify({
            'specializations': [s[0] for s in specializations]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@doctors_bp.route('/<int:doctor_id>', methods=['DELETE'])
@jwt_required()
def delete_doctor(doctor_id):
    try:
        doctor = Doctor.query.get(doctor_id)

        if not doctor:
            return jsonify({'error': 'Doctor not found'}), 404

        db.session.delete(doctor)
        db.session.commit()

        return jsonify({'message': 'Doctor deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

