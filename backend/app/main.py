from flask import Flask
from flask_cors import CORS
from app.extensions import db, jwt
from app.config import Config



def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import blueprints inside factory (prevents circular imports)
    from app.routes.auth import auth_bp
    from app.routes.patients import patients_bp
    from app.routes.doctors import doctors_bp
    from app.routes.appointments import appointments_bp
    from app.routes.analytics import analytics_bp
   
    from app.routes.departments import departments_bp
    from app.routes.medical_records import medical_records_bp
    from app.routes.ml_predictions import ml_bp
    from app.routes.medicines import medicines_bp

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patients_bp, url_prefix='/api/patients')
    app.register_blueprint(doctors_bp, url_prefix='/api/doctors')
    app.register_blueprint(appointments_bp, url_prefix='/api/appointments')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    
    app.register_blueprint(departments_bp, url_prefix='/api/departments')
    app.register_blueprint(medical_records_bp, url_prefix='/api/medical-records')
    app.register_blueprint(ml_bp, url_prefix='/api/ml')
    app.register_blueprint(medicines_bp, url_prefix='/api/medicines')

    @app.route('/')
    def home():
        return {
            'message': 'Smart Hospital Management System API',
            'version': '1.0.0',
            'status': 'running'
        }

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app


app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
