from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import role_required, jwt_required_custom
from app.models.workout import WorkoutPlan, WorkoutExercise
from app.services.workout_service import WorkoutService
from app.schemas.workout_schema import WorkoutPlanSchema
from app.extensions import db

workout_bp = Blueprint('workouts', __name__, url_prefix='/api/workouts')

@workout_bp.route('', methods=['GET'])
@jwt_required_custom
def list_workouts(current_user):
    member_id = request.args.get('member_id', type=int)
    is_template = request.args.get('is_template', type=bool)

    query = WorkoutPlan.query

    if is_template:
        query = query.filter_by(is_template=True)
    elif member_id:
        query = query.filter_by(member_id=member_id)
    elif current_user.role == 'MEMBER' and current_user.member_profile:
        query = query.filter_by(member_id=current_user.member_profile.id)

    plans = query.all()
    return jsonify({'success': True, 'workout_plans': [p.to_dict() for p in plans]}), 200

@workout_bp.route('', methods=['POST'])
@role_required(['ADMIN', 'TRAINER'])
def create_workout(current_user):
    schema = WorkoutPlanSchema()
    errors = schema.validate(request.json or {})
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        plan = WorkoutService.create_workout_plan(request.json, current_user.id)
        return jsonify({'success': True, 'message': 'Workout plan created successfully', 'workout_plan': plan.to_dict()}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@workout_bp.route('/duplicate-template', methods=['POST'])
@role_required(['ADMIN', 'TRAINER'])
def duplicate_template(current_user):
    template_id = request.json.get('template_id')
    member_id = request.json.get('member_id')

    try:
        new_plan = WorkoutService.duplicate_template_to_member(template_id, member_id, current_user.id)
        return jsonify({'success': True, 'message': 'Template duplicated and assigned to member', 'workout_plan': new_plan.to_dict()}), 201
    except ValueError as val_err:
        return jsonify({'success': False, 'message': str(val_err)}), 400
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@workout_bp.route('/<int:plan_id>', methods=['DELETE'])
@role_required(['ADMIN', 'TRAINER'])
def delete_workout(current_user, plan_id):
    plan = WorkoutPlan.query.get(plan_id)
    if not plan:
        return jsonify({'success': False, 'message': 'Workout plan not found'}), 404

    db.session.delete(plan)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Workout plan deleted'}), 200
