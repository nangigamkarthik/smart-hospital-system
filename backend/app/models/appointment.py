from app.extensions import db
from datetime import datetime

class Appointment(db.Model):
    __tablename__ = 'appointments'
    
    id = db.Column(db.Integer, primary_key=True)
    appointment_id = db.Column(db.String(20), unique=True, nullable=False)
    
    # References
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    
    # Appointment Details
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    appointment_type = db.Column(db.Enum('Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup'), default='Consultation')
    
    # Status
    status = db.Column(db.Enum('Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show'), default='Scheduled')
    
    # Details
    reason = db.Column(db.Text)
    notes = db.Column(db.Text)
    duration_minutes = db.Column(db.Integer, default=30)
    
    # Tracking
    checked_in_at = db.Column(db.DateTime)
    checked_out_at = db.Column(db.DateTime)
    cancelled_at = db.Column(db.DateTime)
    cancellation_reason = db.Column(db.Text)
    
    # Payment
    consultation_fee = db.Column(db.Float, default=0.0)
    payment_status = db.Column(db.Enum('Pending', 'Paid', 'Refunded'), default='Pending')
    
    # System fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Appointment {self.appointment_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'appointment_id': self.appointment_id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'appointment_date': self.appointment_date.isoformat() if self.appointment_date else None,
            'appointment_time': self.appointment_time.isoformat() if self.appointment_time else None,
            'appointment_type': self.appointment_type,
            'status': self.status,
            'reason': self.reason,
            'notes': self.notes,
            'duration_minutes': self.duration_minutes,
            'checked_in_at': self.checked_in_at.isoformat() if self.checked_in_at else None,
            'checked_out_at': self.checked_out_at.isoformat() if self.checked_out_at else None,
            'cancelled_at': self.cancelled_at.isoformat() if self.cancelled_at else None,
            'cancellation_reason': self.cancellation_reason,
            'consultation_fee': self.consultation_fee,
            'payment_status': self.payment_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
