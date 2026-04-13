"""
Sample Data Generator for Smart Hospital Management System
Generates realistic hospital data for testing and development
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend/app')))

from faker import Faker
from datetime import datetime, timedelta
import random
from main import create_app, db
from models.patient import Patient
from models.doctor import Doctor
from models.appointment import Appointment
from models.department import Department
from models.medical_record import MedicalRecord
from models.user import User

fake = Faker()

def generate_departments():
    """Generate hospital departments"""
    departments_data = [
        {'name': 'Cardiology', 'code': 'CARD', 'floor': '3', 'total_beds': 20},
        {'name': 'Neurology', 'code': 'NEUR', 'floor': '4', 'total_beds': 15},
        {'name': 'Orthopedics', 'code': 'ORTH', 'floor': '2', 'total_beds': 25},
        {'name': 'Pediatrics', 'code': 'PEDI', 'floor': '5', 'total_beds': 30},
        {'name': 'Emergency', 'code': 'EMER', 'floor': '1', 'total_beds': 40},
        {'name': 'General Medicine', 'code': 'GENM', 'floor': '2', 'total_beds': 35},
        {'name': 'Surgery', 'code': 'SURG', 'floor': '3', 'total_beds': 20},
        {'name': 'Obstetrics & Gynecology', 'code': 'OBGY', 'floor': '4', 'total_beds': 25}
    ]
    
    departments = []
    for dept_data in departments_data:
        dept = Department(
            name=dept_data['name'],
            code=dept_data['code'],
            description=f"Department of {dept_data['name']}",
            floor=dept_data['floor'],
            phone=fake.phone_number()[:15],
            email=f"{dept_data['code'].lower()}@hospital.com",
            total_beds=dept_data['total_beds'],
            available_beds=random.randint(5, dept_data['total_beds'] - 5)
        )
        departments.append(dept)
    
    db.session.bulk_save_objects(departments)
    db.session.commit()
    print(f"✓ Generated {len(departments)} departments")
    return Department.query.all()

def generate_doctors(departments, count=50):
    """Generate doctors"""
    specializations = [
        'Cardiologist', 'Neurologist', 'Orthopedic Surgeon', 'Pediatrician',
        'Emergency Medicine', 'General Physician', 'Surgeon', 'Gynecologist',
        'Dermatologist', 'Psychiatrist', 'Radiologist', 'Anesthesiologist'
    ]
    
    qualifications = [
        'MBBS, MD', 'MBBS, MS', 'MBBS, DNB', 'MBBS, DM',
        'MBBS, MD, MRCP', 'MBBS, MS, FICS', 'MBBS, MD, PhD'
    ]
    
    doctors = []
    for i in range(count):
        doctor = Doctor(
            doctor_id=f"D{str(i+1).zfill(5)}",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            gender=random.choice(['Male', 'Female']),
            date_of_birth=fake.date_of_birth(minimum_age=30, maximum_age=65),
            phone=fake.phone_number()[:15],
            email=fake.email(),
            address=fake.address(),
            specialization=random.choice(specializations),
            qualification=random.choice(qualifications),
            experience_years=random.randint(2, 35),
            license_number=f"LIC{fake.random_number(digits=8)}",
            department_id=random.choice(departments).id if departments else None,
            consultation_fee=random.choice([500, 750, 1000, 1500, 2000]),
            available_days='["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]',
            status=random.choice(['Active', 'Active', 'Active', 'Active', 'On Leave']),
            joined_date=fake.date_between(start_date='-10y', end_date='today'),
            rating=round(random.uniform(3.5, 5.0), 1),
            total_patients_treated=random.randint(50, 1000)
        )
        doctors.append(doctor)
    
    db.session.bulk_save_objects(doctors)
    db.session.commit()
    print(f"✓ Generated {count} doctors")
    return Doctor.query.all()

def generate_patients(count=200):
    """Generate patients"""
    blood_groups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    
    patients = []
    for i in range(count):
        dob = fake.date_of_birth(minimum_age=1, maximum_age=90)
        patient = Patient(
            patient_id=f"P{str(i+1).zfill(6)}",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            date_of_birth=dob,
            gender=random.choice(['Male', 'Female', 'Other']),
            blood_group=random.choice(blood_groups),
            phone=fake.phone_number()[:15],
            email=fake.email() if random.random() > 0.2 else None,
            address=fake.address(),
            city=fake.city(),
            state=fake.state(),
            pincode=fake.postcode()[:10],
            emergency_contact_name=fake.name(),
            emergency_contact_phone=fake.phone_number()[:15],
            emergency_contact_relation=random.choice(['Spouse', 'Parent', 'Sibling', 'Child', 'Friend']),
            allergies=random.choice([None, 'Penicillin', 'Peanuts', 'Latex', 'None known']),
            chronic_conditions=random.choice([None, 'Diabetes', 'Hypertension', 'Asthma', 'None']),
            current_medications=random.choice([None, 'Metformin', 'Aspirin', 'Lisinopril', 'None']),
            insurance_provider=random.choice(['HealthCare Plus', 'MediCare', 'WellnessInsure', None]),
            insurance_number=f"INS{fake.random_number(digits=10)}" if random.random() > 0.3 else None,
            status=random.choice(['Active', 'Active', 'Active', 'Active', 'Inactive']),
            registered_date=fake.date_time_between(start_date='-2y', end_date='now'),
            last_visit=fake.date_time_between(start_date='-6m', end_date='now') if random.random() > 0.3 else None
        )
        patients.append(patient)
    
    db.session.bulk_save_objects(patients)
    db.session.commit()
    print(f"✓ Generated {count} patients")
    return Patient.query.all()

def generate_appointments(patients, doctors, count=300):
    """Generate appointments"""
    appointment_types = ['Consultation', 'Follow-up', 'Emergency', 'Surgery', 'Checkup']
    statuses = ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'No Show']
    payment_statuses = ['Pending', 'Paid', 'Refunded']
    
    appointments = []
    for i in range(count):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        
        # Generate dates within last 3 months and next 1 month
        days_offset = random.randint(-90, 30)
        apt_date = datetime.now().date() + timedelta(days=days_offset)
        apt_time = datetime.strptime(f"{random.randint(9, 17)}:{random.choice(['00', '15', '30', '45'])}", '%H:%M').time()
        
        status = random.choice(statuses)
        if days_offset < 0:  # Past appointments
            status = random.choice(['Completed', 'Completed', 'Completed', 'Cancelled', 'No Show'])
        
        appointment = Appointment(
            appointment_id=f"APT{str(i+1).zfill(6)}",
            patient_id=patient.id,
            doctor_id=doctor.id,
            appointment_date=apt_date,
            appointment_time=apt_time,
            appointment_type=random.choice(appointment_types),
            status=status,
            reason=fake.sentence(nb_words=6),
            notes=fake.text(max_nb_chars=100) if random.random() > 0.5 else None,
            duration_minutes=random.choice([15, 30, 45, 60]),
            consultation_fee=doctor.consultation_fee,
            payment_status='Paid' if status == 'Completed' else random.choice(payment_statuses),
            checked_in_at=datetime.now() - timedelta(hours=2) if status in ['In Progress', 'Completed'] else None,
            checked_out_at=datetime.now() - timedelta(hours=1) if status == 'Completed' else None,
            cancelled_at=datetime.now() - timedelta(days=1) if status == 'Cancelled' else None,
            cancellation_reason=fake.sentence() if status == 'Cancelled' else None
        )
        appointments.append(appointment)
    
    db.session.bulk_save_objects(appointments)
    db.session.commit()
    print(f"✓ Generated {count} appointments")
    return Appointment.query.all()

def generate_medical_records(patients, doctors, appointments, count=150):
    """Generate medical records"""
    visit_types = ['OPD', 'IPD', 'Emergency', 'Surgery']
    diagnoses = [
        'Common Cold', 'Flu', 'Gastroenteritis', 'Migraine', 'Hypertension',
        'Type 2 Diabetes', 'Asthma', 'Arthritis', 'Bronchitis', 'UTI'
    ]
    
    records = []
    for i in range(count):
        patient = random.choice(patients)
        doctor = random.choice(doctors)
        appointment = random.choice(appointments) if random.random() > 0.3 else None
        
        record = MedicalRecord(
            record_id=f"MR{str(i+1).zfill(6)}",
            patient_id=patient.id,
            doctor_id=doctor.id,
            appointment_id=appointment.id if appointment else None,
            visit_date=fake.date_time_between(start_date='-1y', end_date='now'),
            visit_type=random.choice(visit_types),
            chief_complaint=fake.sentence(),
            symptoms=', '.join([fake.word() for _ in range(3)]),
            diagnosis=random.choice(diagnoses),
            treatment=fake.text(max_nb_chars=150),
            prescription=f"{fake.word().capitalize()} 500mg, {random.choice(['Once', 'Twice', 'Thrice'])} daily",
            blood_pressure=f"{random.randint(110, 140)}/{random.randint(70, 90)}",
            temperature=round(random.uniform(97.0, 99.5), 1),
            pulse_rate=random.randint(60, 100),
            respiratory_rate=random.randint(12, 20),
            weight=round(random.uniform(50, 100), 1),
            height=round(random.uniform(150, 190), 1),
            lab_tests_ordered='CBC, Blood Sugar' if random.random() > 0.5 else None,
            lab_results='Normal' if random.random() > 0.3 else 'Abnormal',
            follow_up_required=random.choice([True, False]),
            follow_up_date=(datetime.now() + timedelta(days=random.randint(7, 30))).date() if random.random() > 0.5 else None,
            follow_up_notes=fake.sentence() if random.random() > 0.6 else None
        )
        records.append(record)
    
    db.session.bulk_save_objects(records)
    db.session.commit()
    print(f"✓ Generated {count} medical records")

def generate_users(doctors):
    """Generate system users"""
    users = []
    
    # Create admin user
    admin = User(
        username='admin',
        email='admin@hospital.com',
        first_name='System',
        last_name='Administrator',
        phone='1234567890',
        role='Admin',
        is_active=True,
        is_verified=True
    )
    admin.set_password('admin123')
    users.append(admin)
    
    # Create users for some doctors
    for doctor in doctors[:10]:
        user = User(
            username=f"dr.{doctor.last_name.lower()}",
            email=doctor.email,
            first_name=doctor.first_name,
            last_name=doctor.last_name,
            phone=doctor.phone,
            role='Doctor',
            doctor_id=doctor.id,
            is_active=True,
            is_verified=True
        )
        user.set_password('doctor123')
        users.append(user)
    
    # Create receptionist
    receptionist = User(
        username='receptionist',
        email='reception@hospital.com',
        first_name='Sarah',
        last_name='Johnson',
        phone='9876543210',
        role='Receptionist',
        is_active=True,
        is_verified=True
    )
    receptionist.set_password('reception123')
    users.append(receptionist)
    
    db.session.bulk_save_objects(users)
    db.session.commit()
    print(f"✓ Generated {len(users)} users")

def main():
    """Main function to generate all sample data"""
    app = create_app()
    
    with app.app_context():
        print("\n🏥 Smart Hospital Management System - Sample Data Generator\n")
        print("=" * 60)
        
        # Drop and recreate all tables
        print("\n📋 Resetting database...")
        #db.drop_all()
        db.create_all()
        print("✓ Database reset complete")
        
        print("\n📊 Generating sample data...\n")
        
        # Generate data in order (respecting foreign key constraints)
        departments = generate_departments()
        doctors = generate_doctors(departments, count=50)
        patients = generate_patients(count=200)
        appointments = generate_appointments(patients, doctors, count=300)
        generate_medical_records(patients, doctors, appointments, count=150)
        generate_users(doctors)
        
        print("\n" + "=" * 60)
        print("✅ Sample data generation complete!")
        print("\n📝 Login Credentials:")
        print("   Admin: username='admin', password='admin123'")
        print("   Doctor: username='dr.[lastname]', password='doctor123'")
        print("   Receptionist: username='receptionist', password='reception123'")
        print("\n💡 Use these credentials to test the application")
        print("=" * 60 + "\n")

if __name__ == '__main__':
    main()
