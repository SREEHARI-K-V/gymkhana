from datetime import datetime, date
from app.extensions import db

class SubscriptionPlan(db.Model):
    __tablename__ = 'subscription_plans'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(100), nullable=False)
    duration_months = db.Column(db.Integer, nullable=False, default=1)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    features = db.Column(db.JSON, nullable=False)  # list of strings
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    member_subscriptions = db.relationship('MemberSubscription', backref='plan', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'duration_months': self.duration_months,
            'price': float(self.price),
            'features': self.features if isinstance(self.features, list) else [],
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class MemberSubscription(db.Model):
    __tablename__ = 'member_subscriptions'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id', ondelete='CASCADE'), nullable=False)
    plan_id = db.Column(db.Integer, db.ForeignKey('subscription_plans.id', ondelete='RESTRICT'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum('ACTIVE', 'EXPIRING_SOON', 'EXPIRED', name='sub_status_enum'), default='ACTIVE')
    payment_status = db.Column(db.Enum('PAID', 'PENDING', 'FAILED', name='pay_status_enum'), default='PAID')
    payment_amount = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    @property
    def computed_status(self):
        today = date.today()
        if today > self.end_date:
            return 'EXPIRED'
        days_left = (self.end_date - today).days
        if days_left <= 7:
            return 'EXPIRING_SOON'
        return 'ACTIVE'

    def to_dict(self):
        today = date.today()
        days_remaining = max(0, (self.end_date - today).days) if today <= self.end_date else 0
        current_st = self.computed_status
        return {
            'id': self.id,
            'member_id': self.member_id,
            'plan_id': self.plan_id,
            'plan_title': self.plan.title if self.plan else 'N/A',
            'duration_months': self.plan.duration_months if self.plan else 1,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'status': current_st,
            'days_remaining': days_remaining,
            'payment_status': self.payment_status,
            'payment_amount': float(self.payment_amount),
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
