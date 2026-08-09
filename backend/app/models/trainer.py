from app.extensions import db

class Trainer(db.Model):
    __tablename__ = 'trainers'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False)
    specialization = db.Column(db.String(150), nullable=False)
    bio = db.Column(db.Text, nullable=True)
    experience_years = db.Column(db.Integer, default=1)

    # Relationships
    assigned_members = db.relationship('Member', backref='assigned_trainer', foreign_keys='Member.trainer_id', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'full_name': self.user.full_name if self.user else None,
            'email': self.user.email if self.user else None,
            'phone': self.user.phone if self.user else None,
            'specialization': self.specialization,
            'bio': self.bio,
            'experience_years': self.experience_years,
            'member_count': self.assigned_members.count()
        }
