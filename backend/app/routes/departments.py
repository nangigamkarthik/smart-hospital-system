from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.department import Department

departments_bp = Blueprint('departments', __name__)

@departments_bp.route('', methods=['GET'])
@jwt_required()
def get_departments():
    """Get all departments"""
    try:
        departments = Department.query.all()
        
        return jsonify({
            'departments': [dept.to_dict() for dept in departments]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@departments_bp.route('/<int:department_id>', methods=['GET'])
@jwt_required()
def get_department(department_id):
    """Get single department"""
    try:
        department = Department.query.get(department_id)
        
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        
        return jsonify(department.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@departments_bp.route('', methods=['POST'])
@jwt_required()
def create_department():
    """Create new department"""
    try:
        data = request.get_json()
        
        # Check if department code already exists
        existing = Department.query.filter_by(code=data['code']).first()
        if existing:
            return jsonify({'error': 'Department code already exists'}), 400
        
        department = Department(
            name=data['name'],
            code=data['code'],
            description=data.get('description'),
            floor=data.get('floor'),
            phone=data.get('phone'),
            email=data.get('email'),
            total_beds=data.get('total_beds', 0),
            available_beds=data.get('available_beds', 0),
            status=data.get('status', 'Active')
        )
        
        db.session.add(department)
        db.session.commit()
        
        return jsonify({
            'message': 'Department created successfully',
            'department': department.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@departments_bp.route('/<int:department_id>', methods=['PUT'])
@jwt_required()
def update_department(department_id):
    """Update department"""
    try:
        department = Department.query.get(department_id)
        
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        updatable_fields = [
            'name', 'code', 'description', 'floor', 'phone', 'email',
            'total_beds', 'available_beds', 'status'
        ]
        
        for field in updatable_fields:
            if field in data:
                setattr(department, field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Department updated successfully',
            'department': department.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@departments_bp.route('/<int:department_id>', methods=['DELETE'])
@jwt_required()
def delete_department(department_id):
    """Delete department"""
    try:
        department = Department.query.get(department_id)
        
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        
        db.session.delete(department)
        db.session.commit()
        
        return jsonify({'message': 'Department deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
