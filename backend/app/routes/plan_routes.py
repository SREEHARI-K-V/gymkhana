from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import role_required, jwt_required_custom
from app.models.subscription import SubscriptionPlan
from app.services.subscription_service import SubscriptionService
from app.schemas.subscription_schema import SubscriptionPlanSchema
from app.extensions import db

plan_bp = Blueprint('plans', __name__, url_prefix='/api/plans')

@plan_bp.route('', methods=['GET'])
def get_plans():
    plans = SubscriptionPlan.query.filter_by(is_active=True).all()
    return jsonify({'success': True, 'plans': [p.to_dict() for p in plans]}), 200

@plan_bp.route('/all', methods=['GET'])
@role_required(['ADMIN'])
def get_all_plans_admin(current_user):
    plans = SubscriptionPlan.query.all()
    return jsonify({'success': True, 'plans': [p.to_dict() for p in plans]}), 200

@plan_bp.route('', methods=['POST'])
@role_required(['ADMIN'])
def create_plan(current_user):
    schema = SubscriptionPlanSchema()
    errors = schema.validate(request.json or {})
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400

    try:
        plan = SubscriptionService.create_plan(request.json)
        return jsonify({'success': True, 'message': 'Subscription plan created', 'plan': plan.to_dict()}), 201
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@plan_bp.route('/<int:plan_id>', methods=['PUT'])
@role_required(['ADMIN'])
def update_plan(current_user, plan_id):
    plan = SubscriptionPlan.query.get(plan_id)
    if not plan:
        return jsonify({'success': False, 'message': 'Plan not found'}), 404

    data = request.json or {}
    plan.title = data.get('title', plan.title)
    plan.duration_months = int(data.get('duration_months', plan.duration_months))
    plan.price = float(data.get('price', plan.price))
    plan.features = data.get('features', plan.features)
    plan.is_active = data.get('is_active', plan.is_active)

    db.session.commit()
    return jsonify({'success': True, 'message': 'Plan updated successfully', 'plan': plan.to_dict()}), 200
