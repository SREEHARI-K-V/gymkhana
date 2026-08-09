from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import jwt_required_custom, role_required
from app.services.progress_service import ProgressService
from app.schemas.progress_schema import ProgressRecordSchema
from app.models.progress import ProgressRecord
from app.extensions import db

progress_bp = Blueprint('progress', __name__, url_prefix='/api/progress')

@progress_bp.route('', methods=['POST'])
@jwt_required_custom
def log_progress_metric(current_user):
    schema = ProgressRecordSchema()
    errors = schema.validate(request.json or {})
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    member_id = request.json.get('member_id')
    if current_user.role == 'MEMBER':
        if not current_user.member_profile:
            return jsonify({'success': False, 'message': 'Member profile missing'}), 400
        member_id = current_user.member_profile.id
    elif not member_id:
        return jsonify({'success': False, 'message': 'member_id required for admin/trainer'}), 400

    try:
        record = ProgressService.log_progress(member_id, request.json)
        return jsonify({'success': True, 'message': 'Progress logged successfully', 'progress': record.to_dict()}), 201
    except ValueError as val_err:
        return jsonify({'success': False, 'message': str(val_err)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@progress_bp.route('/analytics/<int:member_id>', methods=['GET'])
@jwt_required_custom
def get_progress_analytics(current_user, member_id):
    if current_user.role == 'MEMBER':
        if not current_user.member_profile or current_user.member_profile.id != member_id:
            return jsonify({'success': False, 'message': 'Access denied'}), 403

    analytics = ProgressService.get_member_analytics(member_id)
    return jsonify({'success': True, 'analytics': analytics}), 200
