<<<<<<< HEAD
# 🏥 Smart Hospital Management System

A comprehensive hospital management system with analytics dashboard and machine learning capabilities built with Flask (Backend) and React (Frontend).

## 📋 Features

### Core Functionality
- **Patient Management**: Registration, medical records, history tracking
- **Doctor Management**: Profiles, schedules, specializations, performance metrics
- **Appointment System**: Scheduling, notifications, queue management
- **Medical Records**: Digital health records, prescriptions, lab results
- **Department Management**: Bed occupancy, resource tracking

### Analytics Dashboard
- Real-time patient admission trends
- Department occupancy rates
- Doctor performance analytics
- Revenue and billing insights
- Patient demographics visualization
- Appointment statistics

### Machine Learning Features
- Disease prediction based on symptoms
- Patient readmission risk assessment
- Appointment no-show prediction
- Hospital length of stay prediction
- Treatment recommendations

## 🛠️ Technology Stack

### Backend
- **Framework**: Flask 3.0
- **Database**: MySQL with SQLAlchemy ORM
- **Authentication**: JWT (Flask-JWT-Extended)
- **ML Libraries**: scikit-learn, pandas, numpy

### Frontend (To be built)
- **Framework**: React.js
- **Charts**: Chart.js / Recharts
- **UI**: Tailwind CSS / Material-UI
- **State Management**: React Query

## 📁 Project Structure

```
smart-hospital-system/
├── backend/
│   ├── app/
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── ml/              # ML models
│   │   ├── config.py        # Configuration
│   │   └── main.py          # Flask app
│   └── requirements.txt     # Python dependencies
├── data/                    # Sample data generation
├── ml_models/              # Trained ML models
└── docs/                   # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

### Installation

1. **Clone the repository**
```bash
cd smart-hospital-system
```

2. **Set up MySQL Database**
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE smart_hospital_db;

# Create user (optional)
CREATE USER 'hospital_admin'@'localhost' IDENTIFIED BY 'hospital_password';
GRANT ALL PRIVILEGES ON smart_hospital_db.* TO 'hospital_admin'@'localhost';
FLUSH PRIVILEGES;
```

3. **Install Python dependencies**
```bash
cd backend
pip install -r requirements.txt
```

4. **Configure environment variables**
```bash
# Copy example env file
cp ../.env.example ../.env

# Edit .env file with your MySQL credentials
# Update MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB as needed
```

5. **Initialize database with sample data**
```bash
cd ../data
python generate_sample_data.py
```

6. **Run the Flask application**
```bash
cd ../backend/app
python main.py
```

The API will be available at `http://localhost:5000`

## 🔑 Default Login Credentials

After running the sample data generator:

- **Admin**: 
  - Username: `admin`
  - Password: `admin123`

- **Doctor**: 
  - Username: `dr.[lastname]` (e.g., `dr.smith`)
  - Password: `doctor123`

- **Receptionist**: 
  - Username: `receptionist`
  - Password: `reception123`

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user details

### Patient Endpoints
- `GET /api/patients` - Get all patients (with pagination)
- `GET /api/patients/{id}` - Get single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient
- `GET /api/patients/stats` - Get patient statistics

### Doctor Endpoints
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get single doctor
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `GET /api/doctors/specializations` - Get all specializations

### Appointment Endpoints
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/{id}/status` - Update appointment status
- `GET /api/appointments/stats` - Get appointment statistics

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Get dashboard overview
- `GET /api/analytics/appointments/trends` - Get appointment trends
- `GET /api/analytics/patients/demographics` - Get patient demographics
- `GET /api/analytics/doctors/performance` - Get doctor performance
- `GET /api/analytics/revenue` - Get revenue analytics
- `GET /api/analytics/departments/occupancy` - Get department occupancy

### ML Prediction Endpoints
- `POST /api/ml/predict/disease` - Predict disease from symptoms
- `POST /api/ml/predict/readmission` - Predict readmission risk
- `POST /api/ml/predict/no-show` - Predict appointment no-show
- `POST /api/ml/predict/length-of-stay` - Predict hospital stay duration
- `POST /api/ml/recommend/treatment` - Get treatment recommendations

## 🧪 Testing the API

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Get Patients (with JWT token):**
```bash
curl -X GET http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman or Insomnia
1. Import the API endpoints
2. Login to get access token
3. Add token to Authorization header for protected routes

## 📊 Sample Data

The system includes a data generator that creates:
- 8 Hospital Departments
- 50 Doctors across specializations
- 200 Patients with complete profiles
- 300 Appointments (past and upcoming)
- 150 Medical Records
- Multiple user accounts for testing

## 🔮 ML Models (Planned)

The current ML endpoints use placeholder logic. To add real ML models:

1. **Collect Training Data**: Use the generated sample data or real hospital data
2. **Train Models**: 
   - Disease prediction (symptoms → diagnosis)
   - Readmission risk (patient history → probability)
   - No-show prediction (appointment features → likelihood)
   - Length of stay (diagnosis + patient → days)
3. **Save Models**: Store trained models in `ml_models/` directory
4. **Update Routes**: Replace placeholder logic in `routes/ml_predictions.py`

## 🎨 Frontend Development (Next Steps)

1. Set up React application in `frontend/` directory
2. Install dependencies (React, React Router, Chart.js, Axios)
3. Create components based on the structure
4. Connect to Flask API
5. Build analytics dashboard with charts
6. Implement patient/doctor/appointment management UIs

## 🔒 Security Considerations

For production deployment:
- Change all default passwords
- Use strong SECRET_KEY and JWT_SECRET_KEY
- Enable HTTPS
- Implement rate limiting
- Add input validation and sanitization
- Set up proper CORS policies
- Use environment variables for sensitive data
- Implement role-based access control (RBAC)

## 📈 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] SMS/Email appointment reminders
- [ ] Inventory management for medicines
- [ ] Billing and insurance management
- [ ] Laboratory test management
- [ ] Pharmacy integration
- [ ] Mobile application
- [ ] Telemedicine features
- [ ] Report generation (PDF/Excel)
- [ ] Multi-language support

## 🐛 Troubleshooting

**Database Connection Error:**
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

**Import Errors:**
- Verify all dependencies are installed: `pip install -r requirements.txt`

**Port Already in Use:**
- Change port in `main.py`: `app.run(port=5001)`

## 📄 License

This project is for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and enhance this project!

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Happy Coding! 🚀**
=======
# smart-hospital-system
ok
>>>>>>> a77d01b9c028aea691a2e37a989ad226f7c6036a
