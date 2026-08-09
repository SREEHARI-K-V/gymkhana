from datetime import datetime
from app.extensions import db

class ProgressRecord(db.Model):
    __tablename__ = 'progress_records'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    member_id = db.Column(db.Integer, db.ForeignKey('members.id', ondelete='CASCADE'), nullable=False)
    record_date = db.Column(db.Date, nullable=False)
    weight = db.Column(db.Numeric(5, 2), nullable=False) # kg
    body_fat_pct = db.Column(db.Numeric(4, 1), nullable=True)
    chest_in = db.Column(db.Numeric(4, 1), nullable=True)
    waist_in = db.Column(db.Numeric(4, 1), nullable=True)
    arms_in = db.Column(db.Numeric(4, 1), nullable=True)
    bmi = db.Column(db.Numeric(4, 1), nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def calculate_bmi(self, height_cm=170.0):
        if self.weight and height_cm:
            height_m = float(height_cm) / 100.0
            if height_m > 0:
                self.bmi = round(float(self.weight) / (height_m * height_m), 1)

    def to_dict(self):
        return {
            'id': self.id,
            'member_id': self.member_id,
            'record_date': self.record_date.isoformat(),
            'weight': float(self.weight) if self.weight else 0.0,
            'body_fat_pct': float(self.body_fat_pct) if self.body_fat_pct else None,
            'chest_in': float(self.chest_in) if self.chest_in else None,
            'waist_in': float(self.waist_in) if self.waist_in else None,
            'arms_in': float(self.arms_in) if self.arms_in else None,
            'bmi': float(self.bmi) if self.bmi else None,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
