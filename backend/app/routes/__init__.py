from app.routes.auth_routes import auth_bp
from app.routes.admin_routes import admin_bp
from app.routes.trainer_routes import trainer_bp
from app.routes.member_routes import member_bp
from app.routes.plan_routes import plan_bp
from app.routes.workout_routes import workout_bp
from app.routes.diet_routes import diet_bp
from app.routes.progress_routes import progress_bp

__all__ = [
    'auth_bp',
    'admin_bp',
    'trainer_bp',
    'member_bp',
    'plan_bp',
    'workout_bp',
    'diet_bp',
    'progress_bp'
]
