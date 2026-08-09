from datetime import datetime, date
from app.extensions import db
from app.models.progress import ProgressRecord
from app.models.member import Member

class ProgressService:
    @staticmethod
    def log_progress(member_id, data):
        member = Member.query.get(member_id)
        if not member:
            raise ValueError("Member not found")

        rec_date = data.get('record_date')
        if isinstance(rec_date, str):
            rec_date = datetime.strptime(rec_date, '%Y-%m-%d').date()
        elif not rec_date:
            rec_date = date.today()

        progress = ProgressRecord(
            member_id=member_id,
            record_date=rec_date,
            weight=float(data.get('weight')),
            body_fat_pct=float(data.get('body_fat_pct')) if data.get('body_fat_pct') is not None else None,
            chest_in=float(data.get('chest_in')) if data.get('chest_in') is not None else None,
            waist_in=float(data.get('waist_in')) if data.get('waist_in') is not None else None,
            arms_in=float(data.get('arms_in')) if data.get('arms_in') is not None else None,
            notes=data.get('notes')
        )
        
        # Calculate BMI automatically based on member height
        progress.calculate_bmi(height_cm=member.height_cm or 170.0)

        db.session.add(progress)
        db.session.commit()
        return progress

    @staticmethod
    def get_member_analytics(member_id):
        records = ProgressRecord.query.filter_by(member_id=member_id).order_by(ProgressRecord.record_date.asc()).all()
        if not records:
            return {
                'labels': [],
                'weight_trend': [],
                'body_fat_trend': [],
                'bmi_trend': [],
                'latest': None
            }

        labels = [r.record_date.strftime('%b %d') for r in records]
        weight_trend = [float(r.weight) for r in records]
        body_fat_trend = [float(r.body_fat_pct) if r.body_fat_pct else None for r in records]
        bmi_trend = [float(r.bmi) if r.bmi else None for r in records]
        latest = records[-1].to_dict()

        return {
            'labels': labels,
            'weight_trend': weight_trend,
            'body_fat_trend': body_fat_trend,
            'bmi_trend': bmi_trend,
            'latest': latest,
            'total_logs': len(records)
        }
