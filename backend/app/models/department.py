from app.extensions import db
from datetime import datetime

class Department(db.Model):
    __tablename__ = 'departments'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    code = db.Column(db.String(20), unique=True, nullable=False)
    
    description = db.Column(db.Text)
    floor = db.Column(db.String(10))
    phone = db.Column(db.String(15))
    email = db.Column(db.String(100))
    
    head_doctor_id = db.Column(
    db.Integer,
    db.ForeignKey('doctors.id', use_alter=True, name='fk_department_head_doctor')
)

    
    # Capacity
    total_beds = db.Column(db.Integer, default=0)
    available_beds = db.Column(db.Integer, default=0)
    
    # Status
    status = db.Column(db.Enum('Active', 'Inactive', 'Under Maintenance'), default='Active')
    
    # System fields
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    doctors = db.relationship('Doctor', backref='department', lazy='dynamic', foreign_keys='Doctor.department_id')
    
    def __repr__(self):
        return f'<Department {self.code}: {self.name}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description,
            'floor': self.floor,
            'phone': self.phone,
            'email': self.email,
            'head_doctor_id': self.head_doctor_id,
            'total_beds': self.total_beds,
            'available_beds': self.available_beds,
            'occupancy_rate': round((self.total_beds - self.available_beds) / self.total_beds * 100, 2) if self.total_beds > 0 else 0,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
