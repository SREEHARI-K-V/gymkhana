from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, get_jwt
from marshmallow import ValidationError
from app.services.auth_service import AuthService
from app.schemas.user_schema import UserLoginSchema, UserRegisterSchema
from app.middleware.auth_middleware import jwt_required_custom
from app.models.user import User

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    schema = UserRegisterSchema()
    try:
        validated_data = schema.load(request.json or {})
        user = AuthService.register_user(validated_data)
        return jsonify({
            'success': True,
            'message': f'User registered successfully as {user.role}',
            'user': user.to_dict()
        }), 201
    except ValidationError as val_err:
        return jsonify({'success': False, 'errors': val_err.messages}), 400
    except ValueError as val_err:
        return jsonify({'success': False, 'message': str(val_err)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    schema = UserLoginSchema()
    errors = schema.validate(request.json or {})
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        email = request.json.get('email')
        password = request.json.get('password')
        result = AuthService.login_user(email, password)
        return jsonify({
            'success': True,
            'message': 'Login successful',
            **result
        }), 200
    except ValueError as val_err:
        return jsonify({'success': False, 'message': str(val_err)}), 401
    except Exception as e:
        return jsonify({'success': False, 'message': f'Server error: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required_custom
def get_current_user(current_user):
    member_id = current_user.member_profile.id if current_user.member_profile else None
    trainer_id = current_user.trainer_profile.id if current_user.trainer_profile else None
    
    return jsonify({
        'success': True,
        'user': current_user.to_dict(),
        'member_id': member_id,
        'trainer_id': trainer_id
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    claims = get_jwt()
    new_access_token = create_access_token(identity=identity, additional_claims={
        'role': claims.get('role'),
        'full_name': claims.get('full_name'),
        'email': claims.get('email')
    })
    return jsonify({'success': True, 'access_token': new_access_token}), 200
