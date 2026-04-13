from app.extensions import db
from datetime import datetime

class Doctor(db.Model):
    __tablename__ = 'doctors'
    
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.String(20), unique=True, nullable=False)
    
    # Personal Information
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.Enum('Male', 'Female', 'Other'), nullable=False)
    date_of_birth = db.Column(db.Date)
    
    # Contact Information
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    address = db.Column(db.Text)
    
    # Professional Information
    specialization = db.Column(db.String(100), nullable=False)
    qualification = db.Column(db.String(200), nullable=False)
    experience_years = db.Column(db.Integer)
    license_number = db.Column(db.String(50), unique=True, nullable=False)
    
    # Department
    department_id = db.Column(db.Integer, db.ForeignKey('departments.id'))
    
    # Availability
    consultation_fee = db.Column(db.Float, default=0.0)
    available_days = db.Column(db.String(100))  # JSON string: ["Monday", "Tuesday"]
    available_time_start = db.Column(db.Time)
    available_time_end = db.Column(db.Time)
    
    # System fields
    status = db.Column(db.Enum('Active', 'On Leave', 'Inactive'), default='Active')
    joined_date = db.Column(db.Date)
    rating = db.Column(db.Float, default=0.0)
    total_patients_treated = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    appointments = db.relationship('Appointment', backref='doctor', lazy='dynamic')
    medical_records = db.relationship('MedicalRecord', backref='doctor', lazy='dynamic')
    
    def __repr__(self):
        return f'<Doctor {self.doctor_id}: Dr. {self.first_name} {self.last_name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'doctor_id': self.doctor_id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'full_name': f'Dr. {self.first_name} {self.last_name}',
            'gender': self.gender,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'phone': self.phone,
            'email': self.email,
            'address': self.address,
            'specialization': self.specialization,
            'qualification': self.qualification,
            'experience_years': self.experience_years,
            'license_number': self.license_number,
            'department_id': self.department_id,
            'consultation_fee': self.consultation_fee,
            'available_days': self.available_days,
            'available_time_start': self.available_time_start.isoformat() if self.available_time_start else None,
            'available_time_end': self.available_time_end.isoformat() if self.available_time_end else None,
            'status': self.status,
            'joined_date': self.joined_date.isoformat() if self.joined_date else None,
            'rating': self.rating,
            'total_patients_treated': self.total_patients_treated,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
