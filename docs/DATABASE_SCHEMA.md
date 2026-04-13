# Database Schema Documentation

## Overview
The Smart Hospital Management System uses a relational database (MySQL) with the following main entities:

## Tables

### 1. Patients
Stores patient information and medical history.

**Fields:**
- `id` (PK): Auto-increment primary key
- `patient_id`: Unique patient identifier (e.g., P000001)
- `first_name`, `last_name`: Patient name
- `date_of_birth`: Date of birth
- `gender`: Male/Female/Other
- `blood_group`: Blood type (A+, O-, etc.)
- `phone`, `email`: Contact information
- `address`, `city`, `state`, `pincode`: Location details
- `emergency_contact_name`, `emergency_contact_phone`, `emergency_contact_relation`
- `allergies`: Known allergies
- `chronic_conditions`: Ongoing health conditions
- `current_medications`: Current medications
- `insurance_provider`, `insurance_number`: Insurance details
- `status`: Active/Inactive/Deceased
- `registered_date`, `last_visit`: Timestamps
- `created_at`, `updated_at`: System timestamps

**Relationships:**
- One-to-Many with Appointments
- One-to-Many with Medical Records

---

### 2. Doctors
Stores doctor/physician information.

**Fields:**
- `id` (PK): Auto-increment primary key
- `doctor_id`: Unique doctor identifier (e.g., D00001)
- `first_name`, `last_name`: Doctor name
- `gender`: Male/Female/Other
- `date_of_birth`: Date of birth
- `phone`, `email`: Contact information
- `address`: Residential address
- `specialization`: Medical specialization
- `qualification`: Medical qualifications
- `experience_years`: Years of experience
- `license_number`: Medical license number
- `department_id` (FK): Reference to department
- `consultation_fee`: Consultation charges
- `available_days`: JSON string of available days
- `available_time_start`, `available_time_end`: Working hours
- `status`: Active/On Leave/Inactive
- `joined_date`: Date joined hospital
- `rating`: Doctor rating (0-5)
- `total_patients_treated`: Total patients count
- `created_at`, `updated_at`: System timestamps

**Relationships:**
- Many-to-One with Department
- One-to-Many with Appointments
- One-to-Many with Medical Records

---

### 3. Appointments
Stores appointment scheduling information.

**Fields:**
- `id` (PK): Auto-increment primary key
- `appointment_id`: Unique appointment identifier (e.g., APT000001)
- `patient_id` (FK): Reference to patient
- `doctor_id` (FK): Reference to doctor
- `appointment_date`: Date of appointment
- `appointment_time`: Time of appointment
- `appointment_type`: Consultation/Follow-up/Emergency/Surgery/Checkup
- `status`: Scheduled/Confirmed/In Progress/Completed/Cancelled/No Show
- `reason`: Reason for visit
- `notes`: Additional notes
- `duration_minutes`: Expected duration
- `checked_in_at`, `checked_out_at`: Actual check-in/out times
- `cancelled_at`, `cancellation_reason`: Cancellation details
- `consultation_fee`: Fee for this appointment
- `payment_status`: Pending/Paid/Refunded
- `created_at`, `updated_at`: System timestamps

**Relationships:**
- Many-to-One with Patient
- Many-to-One with Doctor
- One-to-One with Medical Record (optional)

---

### 4. Departments
Stores hospital department information.

**Fields:**
- `id` (PK): Auto-increment primary key
- `name`: Department name
- `code`: Unique department code (e.g., CARD, NEUR)
- `description`: Department description
- `floor`: Floor location
- `phone`, `email`: Contact information
- `head_doctor_id` (FK): Reference to head doctor
- `total_beds`: Total bed capacity
- `available_beds`: Currently available beds
- `status`: Active/Inactive/Under Maintenance
- `created_at`, `updated_at`: System timestamps

**Relationships:**
- One-to-Many with Doctors
- One-to-One with Doctor (head doctor)

---

### 5. Medical Records
Stores medical visit records and diagnoses.

**Fields:**
- `id` (PK): Auto-increment primary key
- `record_id`: Unique record identifier (e.g., MR000001)
- `patient_id` (FK): Reference to patient
- `doctor_id` (FK): Reference to doctor
- `appointment_id` (FK): Reference to appointment (optional)
- `visit_date`: Date and time of visit
- `visit_type`: OPD/IPD/Emergency/Surgery
- `chief_complaint`: Main complaint
- `symptoms`: List of symptoms
- `diagnosis`: Diagnosis given
- `treatment`: Treatment prescribed
- `prescription`: Medication prescription
- `blood_pressure`, `temperature`, `pulse_rate`, `respiratory_rate`: Vital signs
- `weight`, `height`: Physical measurements
- `lab_tests_ordered`: Lab tests requested
- `lab_results`: Lab test results
- `follow_up_required`: Boolean flag
- `follow_up_date`, `follow_up_notes`: Follow-up details
- `attachments`: JSON string of file paths
- `created_at`, `updated_at`: System timestamps

**Relationships:**
- Many-to-One with Patient
- Many-to-One with Doctor
- Many-to-One with Appointment (optional)

---

### 6. Users
Stores system user accounts for authentication.

**Fields:**
- `id` (PK): Auto-increment primary key
- `username`: Unique username
- `email`: Unique email
- `password_hash`: Hashed password
- `first_name`, `last_name`: User name
- `phone`: Contact number
- `role`: Admin/Doctor/Nurse/Receptionist/Pharmacist/Lab Technician
- `doctor_id` (FK): Reference to doctor (if user is a doctor)
- `is_active`: Boolean flag
- `is_verified`: Boolean flag
- `last_login`: Last login timestamp
- `login_count`: Total login count
- `created_at`, `updated_at`: System timestamps

**Relationships:**
- One-to-One with Doctor (optional)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────┐         ┌─────────────┐
│  Patients   │────┬───>│Appointments │
└─────────────┘    │    └─────────────┘
                   │           │
                   │           │
                   │    ┌──────┴──────┐
                   │    │             │
                   ├───>│   Medical   │
                   │    │   Records   │
                   │    │             │
                   │    └──────┬──────┘
                   │           │
                   │           │
┌─────────────┐    │    ┌─────▼───────┐
│ Departments │<───┼────│   Doctors   │
└─────────────┘    │    └─────────────┘
       │           │           │
       │           │           │
       └───────────┴───────────┘
                   
                   
       ┌─────────────┐
       │    Users    │
       └─────────────┘
```

## Indexes

For optimal performance, the following indexes are recommended:

**Patients:**
- Index on `patient_id`
- Index on `email`
- Index on `phone`
- Index on `status`

**Doctors:**
- Index on `doctor_id`
- Index on `email`
- Index on `specialization`
- Index on `department_id`

**Appointments:**
- Index on `appointment_id`
- Index on `patient_id, appointment_date`
- Index on `doctor_id, appointment_date`
- Index on `status`

**Medical Records:**
- Index on `record_id`
- Index on `patient_id, visit_date`
- Index on `doctor_id`

## Data Types

- **String fields**: VARCHAR with appropriate lengths
- **Text fields**: TEXT for longer content
- **Dates**: DATE for dates, TIME for times, DATETIME for timestamps
- **Numbers**: INTEGER for counts, FLOAT for measurements
- **Enums**: ENUM for fixed choice fields
- **Booleans**: BOOLEAN or TINYINT(1)

## Constraints

- **Primary Keys**: Auto-incrementing integers
- **Foreign Keys**: ON DELETE CASCADE for dependent records
- **Unique Constraints**: On email, patient_id, doctor_id, etc.
- **NOT NULL**: On required fields
- **Default Values**: Timestamps default to current time

## Sample Queries

**Get patient with appointments:**
```sql
SELECT p.*, a.appointment_date, a.status
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
WHERE p.patient_id = 'P000001';
```

**Get doctor's upcoming appointments:**
```sql
SELECT a.*, p.first_name, p.last_name
FROM appointments a
JOIN patients p ON a.patient_id = p.id
WHERE a.doctor_id = 1 
  AND a.appointment_date >= CURDATE()
ORDER BY a.appointment_date, a.appointment_time;
```

**Department occupancy rate:**
```sql
SELECT 
  name,
  total_beds,
  available_beds,
  (total_beds - available_beds) as occupied,
  ROUND((total_beds - available_beds) / total_beds * 100, 2) as occupancy_rate
FROM departments
WHERE total_beds > 0;
```
