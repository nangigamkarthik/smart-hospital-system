from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.patient import Patient
from app.models.doctor import Doctor
from app.models.appointment import Appointment
from app.models.department import Department
from datetime import datetime, timedelta
from sqlalchemy import func, extract

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    """Get overall dashboard statistics"""
    try:
        # Basic counts
        total_patients = Patient.query.count()
        total_doctors = Doctor.query.count()
        total_appointments = Appointment.query.count()
        total_departments = Department.query.count()
        
        # Today's stats
        today = datetime.utcnow().date()
        today_appointments = Appointment.query.filter_by(appointment_date=today).count()
        
        # Active stats
        active_patients = Patient.query.filter_by(status='Active').count()
        active_doctors = Doctor.query.filter_by(status='Active').count()
        
        # Appointment status breakdown
        scheduled = Appointment.query.filter_by(status='Scheduled').count()
        completed = Appointment.query.filter_by(status='Completed').count()
        cancelled = Appointment.query.filter_by(status='Cancelled').count()
        
        return jsonify({
            'overview': {
                'total_patients': total_patients,
                'total_doctors': total_doctors,
                'total_appointments': total_appointments,
                'total_departments': total_departments,
                'active_patients': active_patients,
                'active_doctors': active_doctors
            },
            'today': {
                'appointments': today_appointments
            },
            'appointments': {
                'scheduled': scheduled,
                'completed': completed,
                'cancelled': cancelled,
                'total': total_appointments
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/appointments/trends', methods=['GET'])
@jwt_required()
def get_appointment_trends():
    """Get appointment trends over time"""
    try:
        days = request.args.get('days', 30, type=int)
        start_date = datetime.utcnow().date() - timedelta(days=days)
        
        # Group appointments by date
        appointments = db.session.query(
            Appointment.appointment_date,
            func.count(Appointment.id).label('count')
        ).filter(
            Appointment.appointment_date >= start_date
        ).group_by(
            Appointment.appointment_date
        ).order_by(
            Appointment.appointment_date
        ).all()
        
        trends = [
            {
                'date': apt.appointment_date.isoformat(),
                'count': apt.count
            }
            for apt in appointments
        ]
        
        return jsonify({
            'trends': trends,
            'period_days': days
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/patients/demographics', methods=['GET'])
@jwt_required()
def get_patient_demographics():
    """Get patient demographics"""
    try:
        # Gender distribution
        gender_dist = db.session.query(
            Patient.gender,
            func.count(Patient.id).label('count')
        ).group_by(Patient.gender).all()
        
        # Age distribution (calculate from date_of_birth)
        patients = Patient.query.all()
        age_groups = {
            '0-18': 0,
            '19-30': 0,
            '31-50': 0,
            '51-70': 0,
            '70+': 0
        }
        
        for patient in patients:
            if patient.date_of_birth:
                age = (datetime.utcnow().date() - patient.date_of_birth).days // 365
                if age <= 18:
                    age_groups['0-18'] += 1
                elif age <= 30:
                    age_groups['19-30'] += 1
                elif age <= 50:
                    age_groups['31-50'] += 1
                elif age <= 70:
                    age_groups['51-70'] += 1
                else:
                    age_groups['70+'] += 1
        
        # Blood group distribution
        blood_group_dist = db.session.query(
            Patient.blood_group,
            func.count(Patient.id).label('count')
        ).filter(Patient.blood_group.isnot(None)).group_by(Patient.blood_group).all()
        
        return jsonify({
            'gender_distribution': [
                {'gender': g.gender, 'count': g.count}
                for g in gender_dist
            ],
            'age_distribution': [
                {'age_group': k, 'count': v}
                for k, v in age_groups.items()
            ],
            'blood_group_distribution': [
                {'blood_group': bg.blood_group, 'count': bg.count}
                for bg in blood_group_dist
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/doctors/performance', methods=['GET'])
@jwt_required()
def get_doctor_performance():
    """Get doctor performance metrics"""
    try:
        # Top doctors by appointments
        top_doctors = db.session.query(
            Doctor.id,
            Doctor.first_name,
            Doctor.last_name,
            Doctor.specialization,
            Doctor.rating,
            func.count(Appointment.id).label('appointment_count')
        ).join(
            Appointment, Doctor.id == Appointment.doctor_id
        ).group_by(
            Doctor.id
        ).order_by(
            func.count(Appointment.id).desc()
        ).limit(10).all()
        
        performance_data = [
            {
                'doctor_id': doc.id,
                'name': f"Dr. {doc.first_name} {doc.last_name}",
                'specialization': doc.specialization,
                'rating': doc.rating,
                'total_appointments': doc.appointment_count
            }
            for doc in top_doctors
        ]
        
        # Specialization distribution
        spec_dist = db.session.query(
            Doctor.specialization,
            func.count(Doctor.id).label('count')
        ).group_by(Doctor.specialization).all()
        
        return jsonify({
            'top_doctors': performance_data,
            'specialization_distribution': [
                {'specialization': s.specialization, 'count': s.count}
                for s in spec_dist
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/revenue', methods=['GET'])
@jwt_required()
def get_revenue_analytics():
    """Get revenue analytics"""
    try:
        # Total revenue from appointments
        total_revenue = db.session.query(
            func.sum(Appointment.consultation_fee)
        ).filter(
            Appointment.payment_status == 'Paid'
        ).scalar() or 0
        
        # Monthly revenue (last 12 months)
        twelve_months_ago = datetime.utcnow() - timedelta(days=365)
        monthly_revenue = db.session.query(
            extract('year', Appointment.appointment_date).label('year'),
            extract('month', Appointment.appointment_date).label('month'),
            func.sum(Appointment.consultation_fee).label('revenue')
        ).filter(
            Appointment.appointment_date >= twelve_months_ago.date(),
            Appointment.payment_status == 'Paid'
        ).group_by(
            extract('year', Appointment.appointment_date),
            extract('month', Appointment.appointment_date)
        ).order_by(
            extract('year', Appointment.appointment_date),
            extract('month', Appointment.appointment_date)
        ).all()
        
        monthly_data = [
            {
                'year': int(m.year),
                'month': int(m.month),
                'revenue': float(m.revenue)
            }
            for m in monthly_revenue
        ]
        
        return jsonify({
            'total_revenue': float(total_revenue),
            'monthly_revenue': monthly_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@analytics_bp.route('/departments/occupancy', methods=['GET'])
@jwt_required()
def get_department_occupancy():
    """Get department bed occupancy"""
    try:
        departments = Department.query.all()
        
        occupancy_data = [
            {
                'department_id': dept.id,
                'department_name': dept.name,
                'total_beds': dept.total_beds,
                'available_beds': dept.available_beds,
                'occupied_beds': dept.total_beds - dept.available_beds,
                'occupancy_rate': round((dept.total_beds - dept.available_beds) / dept.total_beds * 100, 2) if dept.total_beds > 0 else 0
            }
            for dept in departments
        ]
        
        return jsonify({
            'departments': occupancy_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
