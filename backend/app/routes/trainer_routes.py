from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import role_required
from app.models.trainer import Trainer
from app.models.member import Member
from app.models.progress import ProgressRecord
from app.models.workout import WorkoutPlan
from app.models.diet import DietPlan

trainer_bp = Blueprint('trainer', __name__, url_prefix='/api/trainer')

@trainer_bp.route('/dashboard', methods=['GET'])
@role_required(['TRAINER'])
def trainer_dashboard(current_user):
    trainer = current_user.trainer_profile
    if not trainer:
        return jsonify({'success': False, 'message': 'Trainer profile not found'}), 404

    assigned_members = trainer.assigned_members.all()
    member_list = [m.to_dict() for m in assigned_members]

    # Recent workout and diet templates
    workout_templates = WorkoutPlan.query.filter_by(is_template=True).all()
    diet_templates = DietPlan.query.filter_by(is_template=True).all()

    return jsonify({
        'success': True,
        'trainer': trainer.to_dict(),
        'assigned_members_count': len(assigned_members),
        'members': member_list,
        'workout_templates_count': len(workout_templates),
        'diet_templates_count': len(diet_templates)
    }), 200

@trainer_bp.route('/members', methods=['GET'])
@role_required(['TRAINER'])
def list_assigned_members(current_user):
    trainer = current_user.trainer_profile
    if not trainer:
        return jsonify({'success': False, 'message': 'Trainer profile not found'}), 404

    members = trainer.assigned_members.all()
    return jsonify({'success': True, 'members': [m.to_dict() for m in members]}), 200

@trainer_bp.route('/member/<int:member_id>/progress', methods=['GET'])
@role_required(['TRAINER', 'ADMIN'])
def get_member_progress(current_user, member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({'success': False, 'message': 'Member not found'}), 404

    # Security check: Trainer can only view their assigned member unless ADMIN
    if current_user.role == 'TRAINER' and (not current_user.trainer_profile or member.trainer_id != current_user.trainer_profile.id):
        return jsonify({'success': False, 'message': 'Access denied to unassigned member'}), 403

    records = ProgressRecord.query.filter_by(member_id=member.id).order_by(ProgressRecord.record_date.asc()).all()
    active_workout = member.workout_plans.order_by(WorkoutPlan.created_at.desc()).first()
    active_diet = member.diet_plans.order_by(DietPlan.created_at.desc()).first()

    return jsonify({
        'success': True,
        'member': member.to_dict(),
        'progress_records': [r.to_dict() for r in records],
        'active_workout': active_workout.to_dict() if active_workout else None,
        'active_diet': active_diet.to_dict() if active_diet else None
    }), 200
