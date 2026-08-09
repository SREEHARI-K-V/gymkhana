from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, get_jwt
from app.models.user import User

def jwt_required_custom(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
            user_id = get_jwt_identity()
            current_user = User.query.get(user_id)
            if not current_user:
                return jsonify({'success': False, 'message': 'User not found or account deactivated'}), 401
            return fn(*args, current_user=current_user, **kwargs)
        except Exception as e:
            return jsonify({'success': False, 'message': f'Authentication failed: {str(e)}'}), 401
    return wrapper

def role_required(allowed_roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                verify_jwt_in_request()
                claims = get_jwt()
                user_role = claims.get('role')
                if user_role not in allowed_roles:
                    return jsonify({'success': False, 'message': f'Access forbidden: Required role {allowed_roles}'}), 403
                
                user_id = get_jwt_identity()
                current_user = User.query.get(user_id)
                return fn(*args, current_user=current_user, **kwargs)
            except Exception as e:
                return jsonify({'success': False, 'message': str(e)}), 401
        return wrapper
    return decorator
