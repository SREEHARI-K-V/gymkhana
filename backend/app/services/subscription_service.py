from datetime import date, datetime
from dateutil.relativedelta import relativedelta
from app.extensions import db
from app.models.subscription import SubscriptionPlan, MemberSubscription
from app.models.member import Member

class SubscriptionService:
    @staticmethod
    def create_plan(data):
        plan = SubscriptionPlan(
            title=data.get('title'),
            duration_months=int(data.get('duration_months', 1)),
            price=float(data.get('price')),
            features=data.get('features', []),
            is_active=data.get('is_active', True)
        )
        db.session.add(plan)
        db.session.commit()
        return plan

    @staticmethod
    def assign_subscription(member_id, plan_id, start_date=None, payment_status='PAID'):
        member = Member.query.get(member_id)
        if not member:
            raise ValueError("Member not found")

        plan = SubscriptionPlan.query.get(plan_id)
        if not plan or not plan.is_active:
            raise ValueError("Invalid or inactive subscription plan")

        if isinstance(start_date, str):
            start = datetime.strptime(start_date, '%Y-%m-%d').date()
        elif isinstance(start_date, date):
            start = start_date
        else:
            start = date.today()

        # Automatic calculation of end_date based on duration_months
        end = start + relativedelta(months=plan.duration_months)

        sub = MemberSubscription(
            member_id=member.id,
            plan_id=plan.id,
            start_date=start,
            end_date=end,
            status='ACTIVE',
            payment_status=payment_status,
            payment_amount=plan.price
        )

        db.session.add(sub)
        db.session.commit()
        return sub

    @staticmethod
    def update_subscription_statuses():
        """Batch update statuses based on current date"""
        subs = MemberSubscription.query.all()
        updated_count = 0
        for sub in subs:
            new_status = sub.computed_status
            if sub.status != new_status:
                sub.status = new_status
                updated_count += 1
        if updated_count > 0:
            db.session.commit()
        return updated_count
