from app.extensions import db
from datetime import datetime

class MedicalRecord(db.Model):
    __tablename__ = 'medical_records'
    
    id = db.Column(db.Integer, primary_key=True)
    record_id = db.Column(db.String(20), unique=True, nullable=False)
    
    # References
    patient_id = db.Column(db.Integer, db.ForeignKey('patients.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctors.id'), nullable=False)
    appointment_id = db.Column(db.Integer, db.ForeignKey('appointments.id'))
    
    # Visit Details
    visit_date = db.Column(db.DateTime, nullable=False)
    visit_type = db.Column(db.Enum('OPD', 'IPD', 'Emergency', 'Surgery'), default='OPD')
    
    # Medical Details
    chief_complaint = db.Column(db.Text)
    symptoms = db.Column(db.Text)
    diagnosis = db.Column(db.Text, nullable=False)
    treatment = db.Column(db.Text)
    prescription = db.Column(db.Text)
    
    # Vitals
    blood_pressure = db.Column(db.String(20))
    temperature = db.Column(db.Float)
    pulse_rate = db.Column(db.Integer)
    respiratory_rate = db.Column(db.Integer)
    weight = db.Column(db.Float)
    height = db.Column(db.Float)
    
    # Lab Tests
    lab_tests_ordered = db.Column(db.Text)
    lab_results = db.Column(db.Text)
    
    # Follow-up
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_date = db.Column(db.Date)
    follow_up_notes = db.Column(db.Text)
    
    # Attachments
    attachments = db.Column(db.Text)  # JSON string of file paths
    
    # System fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<MedicalRecord {self.record_id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'record_id': self.record_id,
            'patient_id': self.patient_id,
            'doctor_id': self.doctor_id,
            'appointment_id': self.appointment_id,
            'visit_date': self.visit_date.isoformat() if self.visit_date else None,
            'visit_type': self.visit_type,
            'chief_complaint': self.chief_complaint,
            'symptoms': self.symptoms,
            'diagnosis': self.diagnosis,
            'treatment': self.treatment,
            'prescription': self.prescription,
            'blood_pressure': self.blood_pressure,
            'temperature': self.temperature,
            'pulse_rate': self.pulse_rate,
            'respiratory_rate': self.respiratory_rate,
            'weight': self.weight,
            'height': self.height,
            'lab_tests_ordered': self.lab_tests_ordered,
            'lab_results': self.lab_results,
            'follow_up_required': self.follow_up_required,
            'follow_up_date': self.follow_up_date.isoformat() if self.follow_up_date else None,
            'follow_up_notes': self.follow_up_notes,
            'attachments': self.attachments,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
