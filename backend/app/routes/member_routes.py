from datetime import date
from flask import Blueprint, jsonify
from app.middleware.auth_middleware import role_required
from app.models.workout import WorkoutPlan
from app.models.diet import DietPlan
from app.services.progress_service import ProgressService

member_bp = Blueprint('member', __name__, url_prefix='/api/member')

@member_bp.route('/dashboard', methods=['GET'])
@role_required(['MEMBER'])
def member_dashboard(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    curr_sub = member.current_subscription
    workout = member.workout_plans.order_by(WorkoutPlan.created_at.desc()).first()
    diet = member.diet_plans.order_by(DietPlan.created_at.desc()).first()
    analytics = ProgressService.get_member_analytics(member.id)

    today_day_str = date.today().strftime('%A').upper()

    # Filter today's exercises & meals
    todays_exercises = []
    if workout:
        todays_exercises = [ex.to_dict() for ex in workout.exercises.filter_by(day_of_week=today_day_str).all()]

    todays_meals = []
    if diet:
        todays_meals = [m.to_dict() for m in diet.meals.filter_by(day_of_week=today_day_str).all()]

    return jsonify({
        'success': True,
        'member': member.to_dict(),
        'subscription': curr_sub.to_dict() if curr_sub else None,
        'today_day': today_day_str,
        'todays_exercises': todays_exercises,
        'todays_meals': todays_meals,
        'workout_plan': workout.to_dict() if workout else None,
        'diet_plan': diet.to_dict() if diet else None,
        'progress_summary': analytics
    }), 200

@member_bp.route('/subscription', methods=['GET'])
@role_required(['MEMBER'])
def get_member_subscription(current_user):
    member = current_user.member_profile
    if not member:
        return jsonify({'success': False, 'message': 'Member profile not found'}), 404

    curr_sub = member.current_subscription
    history = [s.to_dict() for s in member.subscriptions.order_by(member.subscriptions.model.created_at.desc()).all()]

    return jsonify({
        'success': True,
        'current_subscription': curr_sub.to_dict() if curr_sub else None,
        'history': history
    }), 200
