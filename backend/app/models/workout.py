from datetime import datetime
from app.extensions import db

class WorkoutPlan(db.Model):
    __tablename__ = 'workout_plans'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id', ondelete='CASCADE'), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    is_template = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    exercises = db.relationship('WorkoutExercise', backref='workout_plan', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'member_id': self.member_id,
            'member_name': self.member.user.full_name if self.member and self.member.user else None,
            'created_by': self.created_by,
            'creator_name': self.creator.full_name if self.creator else None,
            'is_template': self.is_template,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'exercises': [ex.to_dict() for ex in self.exercises.all()]
        }

class WorkoutExercise(db.Model):
    __tablename__ = 'workout_exercises'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    workout_plan_id = db.Column(db.Integer, db.ForeignKey('workout_plans.id', ondelete='CASCADE'), nullable=False)
    day_of_week = db.Column(db.Enum('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', name='day_enum'), nullable=False)
    exercise_name = db.Column(db.String(120), nullable=False)
    target_muscle = db.Column(db.String(80), nullable=False)
    sets = db.Column(db.Integer, nullable=False, default=3)
    reps = db.Column(db.String(50), nullable=False, default='10-12')
    rest_seconds = db.Column(db.Integer, nullable=False, default=60)
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'workout_plan_id': self.workout_plan_id,
            'day_of_week': self.day_of_week,
            'exercise_name': self.exercise_name,
            'target_muscle': self.target_muscle,
            'sets': self.sets,
            'reps': self.reps,
            'rest_seconds': self.rest_seconds,
            'notes': self.notes
        }
