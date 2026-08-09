from datetime import datetime
from app.extensions import db

class DietPlan(db.Model):
    __tablename__ = 'diet_plans'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=True)
    daily_calorie_target = db.Column(db.Integer, default=2000)
    protein_target_g = db.Column(db.Integer, default=150)
    carbs_target_g = db.Column(db.Integer, default=200)
    fat_target_g = db.Column(db.Integer, default=65)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id', ondelete='CASCADE'), nullable=True)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    is_template = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship
    meals = db.relationship('DietMeal', backref='diet_plan', lazy='dynamic', cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'daily_calorie_target': self.daily_calorie_target,
            'protein_target_g': self.protein_target_g,
            'carbs_target_g': self.carbs_target_g,
            'fat_target_g': self.fat_target_g,
            'member_id': self.member_id,
            'member_name': self.member.user.full_name if self.member and self.member.user else None,
            'created_by': self.created_by,
            'creator_name': self.creator.full_name if self.creator else None,
            'is_template': self.is_template,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'meals': [m.to_dict() for m in self.meals.all()]
        }

class DietMeal(db.Model):
    __tablename__ = 'diet_meals'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    diet_plan_id = db.Column(db.Integer, db.ForeignKey('diet_plans.id', ondelete='CASCADE'), nullable=False)
    day_of_week = db.Column(db.Enum('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', name='day_enum_diet'), nullable=False)
    meal_time = db.Column(db.String(50), nullable=False) # e.g. Breakfast, Lunch, Evening Snack, Dinner
    meal_name = db.Column(db.String(150), nullable=False)
    calories = db.Column(db.Integer, nullable=False, default=0)
    protein = db.Column(db.Integer, nullable=False, default=0)
    carbs = db.Column(db.Integer, nullable=False, default=0)
    fat = db.Column(db.Integer, nullable=False, default=0)

    def to_dict(self):
        return {
            'id': self.id,
            'diet_plan_id': self.diet_plan_id,
            'day_of_week': self.day_of_week,
            'meal_time': self.meal_time,
            'meal_name': self.meal_name,
            'calories': self.calories,
            'protein': self.protein,
            'carbs': self.carbs,
            'fat': self.fat
        }
