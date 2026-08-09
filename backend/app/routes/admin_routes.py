import csv
from io import StringIO
from flask import Blueprint, request, jsonify, Response
from app.middleware.auth_middleware import role_required
from app.services.analytics_service import AnalyticsService
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.user import User
from app.models.subscription import SubscriptionPlan, MemberSubscription
from app.services.subscription_service import SubscriptionService
from app.extensions import db

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

@admin_bp.route('/dashboard', methods=['GET'])
@role_required(['ADMIN'])
def admin_dashboard(current_user):
    stats = AnalyticsService.get_admin_dashboard_stats()
    return jsonify({'success': True, 'stats': stats}), 200

@admin_bp.route('/members', methods=['GET'])
@role_required(['ADMIN'])
def list_members(current_user):
    search = request.args.get('search', '').strip()
    status_filter = request.args.get('status', '').strip()
    trainer_filter = request.args.get('trainer_id', type=int)

    query = Member.query.join(User)
    
    if search:
        query = query.filter((User.full_name.ilike(f'%{search}%')) | (User.email.ilike(f'%{search}%')))
    if trainer_filter:
        query = query.filter(Member.trainer_id == trainer_filter)

    members = query.all()
    res = []
    for m in members:
        m_dict = m.to_dict()
        if status_filter and m_dict.get('subscription_status') != status_filter:
            continue
        res.append(m_dict)

    return jsonify({'success': True, 'count': len(res), 'members': res}), 200

@admin_bp.route('/members/<int:member_id>/assign-trainer', methods=['PUT'])
@role_required(['ADMIN'])
def assign_trainer_to_member(current_user, member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({'success': False, 'message': 'Member not found'}), 404

    trainer_id = request.json.get('trainer_id')
    if trainer_id:
        trainer = Trainer.query.get(trainer_id)
        if not trainer:
            return jsonify({'success': False, 'message': 'Trainer not found'}), 404
        member.trainer_id = trainer.id
    else:
        member.trainer_id = None

    db.session.commit()
    return jsonify({'success': True, 'message': 'Trainer assigned successfully', 'member': member.to_dict()}), 200

@admin_bp.route('/trainers', methods=['GET'])
@role_required(['ADMIN', 'TRAINER', 'MEMBER'])
def list_trainers(current_user):
    trainers = Trainer.query.all()
    return jsonify({'success': True, 'trainers': [t.to_dict() for t in trainers]}), 200

@admin_bp.route('/members/<int:member_id>/subscription', methods=['POST'])
@role_required(['ADMIN'])
def assign_member_subscription(current_user, member_id):
    plan_id = request.json.get('plan_id')
    start_date = request.json.get('start_date')
    payment_status = request.json.get('payment_status', 'PAID')

    try:
        sub = SubscriptionService.assign_subscription(member_id, plan_id, start_date, payment_status)
        return jsonify({'success': True, 'message': 'Subscription assigned successfully', 'subscription': sub.to_dict()}), 201
    except ValueError as e:
        return jsonify({'success': False, 'message': str(e)}), 400

@admin_bp.route('/export-csv', methods=['GET'])
@role_required(['ADMIN'])
def export_members_csv(current_user):
    si = StringIO()
    cw = csv.writer(si)
    cw.writerow(['Member ID', 'Full Name', 'Email', 'Phone', 'Trainer Name', 'Gender', 'Subscription Status', 'Plan Title', 'Height (cm)'])

    members = Member.query.all()
    for m in members:
        m_dict = m.to_dict()
        cw.writerow([
            m.id,
            m_dict.get('full_name'),
            m_dict.get('email'),
            m_dict.get('phone') or 'N/A',
            m_dict.get('trainer_name') or 'Unassigned',
            m_dict.get('gender') or 'N/A',
            m_dict.get('subscription_status'),
            m_dict.get('plan_title'),
            m_dict.get('height_cm')
        ])

    output = si.getvalue()
    return Response(
        output,
        mimetype='text/csv',
        headers={'Content-Disposition': 'attachment; filename=gymkhana_members_report.csv'}
    )
