from flask import Flask
from app.config import config_by_name
from app.extensions import db, jwt, cors, migrate, ma
from app.middleware.error_handler import register_error_handlers
import os

def create_app(config_name=None):
    if not config_name:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config_by_name.get(config_name, config_by_name['default']))

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    migrate.init_app(app, db)
    ma.init_app(app)

    # Register Error Handlers
    register_error_handlers(app)

    # Register Blueprints
    from app.routes import (
        auth_bp, admin_bp, trainer_bp, member_bp,
        plan_bp, workout_bp, diet_bp, progress_bp
    )

    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(trainer_bp)
    app.register_blueprint(member_bp)
    app.register_blueprint(plan_bp)
    app.register_blueprint(workout_bp)
    app.register_blueprint(diet_bp)
    app.register_blueprint(progress_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return {'status': 'healthy', 'system': 'Gymkhana API v1.0'}, 200

    return app
