from datetime import date, timedelta
from sqlalchemy import func
from app.extensions import db
from app.models.member import Member
from app.models.trainer import Trainer
from app.models.subscription import MemberSubscription, SubscriptionPlan
from app.models.user import User

class AnalyticsService:
    @staticmethod
    def get_admin_dashboard_stats():
        today = date.today()
        seven_days_later = today + timedelta(days=7)
        
        # Ensure status flags are fresh
        subs = MemberSubscription.query.all()
        for s in subs:
            s.status = s.computed_status
        db.session.commit()

        total_members = Member.query.count()
        total_trainers = Trainer.query.count()
        
        active_subscriptions = MemberSubscription.query.filter(MemberSubscription.end_date >= today).count()
        expiring_subscriptions = MemberSubscription.query.filter(
            MemberSubscription.end_date >= today,
            MemberSubscription.end_date <= seven_days_later
        ).count()
        
        # Expiring count fallback calculation for cross-db compatibility
        expiring_count = 0
        for s in subs:
            if s.computed_status == 'EXPIRING_SOON':
                expiring_count += 1
        
        active_count = 0
        for s in subs:
            if s.computed_status in ['ACTIVE', 'EXPIRING_SOON']:
                active_count += 1

        total_revenue = db.session.query(func.sum(MemberSubscription.payment_amount)).filter(MemberSubscription.payment_status == 'PAID').scalar() or 0.0

        # Trainer load
        trainers = Trainer.query.all()
        trainer_load = []
        for t in trainers:
            trainer_load.append({
                'trainer_id': t.id,
                'trainer_name': t.user.full_name if t.user else 'Unknown',
                'specialization': t.specialization,
                'assigned_members_count': t.assigned_members.count()
            })

        # Membership breakdown by plan
        plan_breakdown = []
        plans = SubscriptionPlan.query.all()
        for p in plans:
            count = MemberSubscription.query.filter_by(plan_id=p.id).count()
            plan_breakdown.append({
                'plan_id': p.id,
                'title': p.title,
                'subscriber_count': count
            })

        # Monthly Revenue Trend (Mock/calculated)
        revenue_trend = {
            'months': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
            'revenue': [4200, 5100, 6800, 7500, 8900, 9400, 11200, float(total_revenue)]
        }

        return {
            'total_members': total_members,
            'total_trainers': total_trainers,
            'active_subscriptions': active_count,
            'expiring_subscriptions': expiring_count,
            'total_revenue': float(total_revenue),
            'trainer_load': trainer_load,
            'plan_breakdown': plan_breakdown,
            'revenue_trend': revenue_trend
        }
