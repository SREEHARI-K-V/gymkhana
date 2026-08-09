from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import db
from app.models.user import User
from app.models.trainer import Trainer
from app.models.member import Member

class AuthService:
    @staticmethod
    def register_user(data):
        email = data.get('email').lower().strip()
        if User.query.filter_by(email=email).first():
            raise ValueError("Email is already registered")

        role = data.get('role', 'MEMBER').upper()
        user = User(
            full_name=data.get('full_name').strip(),
            email=email,
            role=role,
            phone=data.get('phone')
        )
        user.set_password(data.get('password'))
        db.session.add(user)
        db.session.flush()

        if role == 'TRAINER':
            trainer = Trainer(
                user_id=user.id,
                specialization=data.get('specialization', 'General Fitness'),
                bio=data.get('bio', 'Certified Gymkhana Fitness Coach'),
                experience_years=data.get('experience_years', 2)
            )
            db.session.add(trainer)
        elif role == 'MEMBER':
            dob_val = data.get('date_of_birth')
            if dob_val and isinstance(dob_val, str):
                try:
                    from datetime import date
                    dob_val = date.fromisoformat(dob_val)
                except ValueError:
                    dob_val = None

            member = Member(
                user_id=user.id,
                trainer_id=data.get('trainer_id'),
                date_of_birth=dob_val,
                gender=data.get('gender'),
                emergency_contact=data.get('emergency_contact'),
                height_cm=data.get('height_cm', 170.0)
            )
            db.session.add(member)
            db.session.flush()

            weight_val = data.get('weight_kg') or data.get('weight')
            if weight_val:
                from datetime import date
                from app.models.progress import ProgressRecord
                pr = ProgressRecord(
                    member_id=member.id,
                    record_date=date.today(),
                    weight=float(weight_val),
                    notes="Initial registration weight."
                )
                pr.calculate_bmi(member.height_cm)
                db.session.add(pr)

        db.session.commit()
        return user

    @staticmethod
    def login_user(email, password):
        user = User.query.filter_by(email=email.lower().strip()).first()
        if not user or not user.check_password(password):
            raise ValueError("Invalid email or password")

        additional_claims = {
            'role': user.role,
            'full_name': user.full_name,
            'email': user.email
        }

        # Include member_id or trainer_id if applicable
        if user.role == 'MEMBER' and user.member_profile:
            additional_claims['member_id'] = user.member_profile.id
        elif user.role == 'TRAINER' and user.trainer_profile:
            additional_claims['trainer_id'] = user.trainer_profile.id

        access_token = create_access_token(identity=str(user.id), additional_claims=additional_claims)
        refresh_token = create_refresh_token(identity=str(user.id), additional_claims=additional_claims)

        return {
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token,
            'role': user.role,
            'member_id': additional_claims.get('member_id'),
            'trainer_id': additional_claims.get('trainer_id')
        }
