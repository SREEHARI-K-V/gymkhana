from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('ADMIN', 'TRAINER', 'MEMBER', name='user_roles'), nullable=False, default='MEMBER', index=True)
    phone = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    trainer_profile = db.relationship('Trainer', backref='user', uselist=False, cascade='all, delete-orphan')
    member_profile = db.relationship('Member', backref='user', uselist=False, cascade='all, delete-orphan')
    created_workouts = db.relationship('WorkoutPlan', backref='creator', lazy='dynamic', cascade='all, delete-orphan')
    created_diets = db.relationship('DietPlan', backref='creator', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'full_name': self.full_name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
