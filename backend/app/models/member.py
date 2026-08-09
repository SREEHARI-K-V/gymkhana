from app.extensions import db

class Member(db.Model):
    __tablename__ = 'members'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    trainer_id = db.Column(db.Integer, db.ForeignKey('trainers.id', ondelete='SET NULL'), nullable=True)
    date_of_birth = db.Column(db.Date, nullable=True)
    gender = db.Column(db.Enum('MALE', 'FEMALE', 'OTHER', name='gender_enum'), nullable=True)
    emergency_contact = db.Column(db.String(100), nullable=True)
    height_cm = db.Column(db.Numeric(5, 2), default=170.00)

    # Relationships
    subscriptions = db.relationship('MemberSubscription', backref='member', lazy='dynamic', cascade='all, delete-orphan')
    workout_plans = db.relationship('WorkoutPlan', backref='member', lazy='dynamic', cascade='all, delete-orphan')
    diet_plans = db.relationship('DietPlan', backref='member', lazy='dynamic', cascade='all, delete-orphan')
    progress_records = db.relationship('ProgressRecord', backref='member', lazy='dynamic', cascade='all, delete-orphan')

    @property
    def current_subscription(self):
        return self.subscriptions.order_by(db.desc('end_date')).first()

    def to_dict(self):
        curr_sub = self.current_subscription
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.user.full_name if self.user else None,
            'email': self.user.email if self.user else None,
            'phone': self.user.phone if self.user else None,
            'trainer_id': self.trainer_id,
            'trainer_name': self.assigned_trainer.user.full_name if self.assigned_trainer and self.assigned_trainer.user else None,
            'date_of_birth': self.date_of_birth.isoformat() if self.date_of_birth else None,
            'gender': self.gender,
            'emergency_contact': self.emergency_contact,
            'height_cm': float(self.height_cm) if self.height_cm else 170.0,
            'subscription_status': curr_sub.computed_status if curr_sub else 'NO_PLAN',
            'plan_title': curr_sub.plan.title if curr_sub and curr_sub.plan else 'N/A'
        }
