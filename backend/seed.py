from datetime import date, timedelta
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.trainer import Trainer
from app.models.member import Member
from app.models.subscription import SubscriptionPlan, MemberSubscription
from app.models.workout import WorkoutPlan, WorkoutExercise
from app.models.diet import DietPlan, DietMeal
from app.models.progress import ProgressRecord

def seed_database():
    app = create_app('development')
    with app.app_context():
        print("Clearing database tables...")
        db.drop_all()
        db.create_all()

        print("Seeding Subscription Plans...")
        plans_data = [
            {
                'title': 'Basic Fitness Plan',
                'duration_months': 1,
                'price': 49.99,
                'features': ['Access to Gym Equipment', 'Locker Room Access', '1 Free Fitness Assessment']
            },
            {
                'title': 'Pro Performance Plan',
                'duration_months': 3,
                'price': 129.99,
                'features': ['All Basic Features', 'Personal Trainer Assignment', 'Customized Workout Plan', 'Sauna Access']
            },
            {
                'title': 'Elite Athlete Plan',
                'duration_months': 6,
                'price': 229.99,
                'features': ['All Pro Features', 'Dedicated Nutrition & Diet Plan', 'Weekly Body Comp Analysis', 'Priority Support']
            },
            {
                'title': 'VIP Platinum Lifetime',
                'duration_months': 12,
                'price': 399.99,
                'features': ['All Elite Features', 'Unlimited Guest Passes', 'Free Supplements Pack', 'VIP Lounge Access']
            }
        ]

        plans = []
        for p in plans_data:
            plan = SubscriptionPlan(
                title=p['title'],
                duration_months=p['duration_months'],
                price=p['price'],
                features=p['features']
            )
            db.session.add(plan)
            plans.append(plan)
        db.session.flush()

        print("Seeding Admin Account...")
        admin_user = User(
            full_name='System Admin',
            email='admin@gymkhana.com',
            role='ADMIN',
            phone='+1-800-555-0100'
        )
        admin_user.set_password('admin123')
        db.session.add(admin_user)
        db.session.flush()

        print("Seeding 3 Trainers...")
        trainers_info = [
            ('Alex Vance', 'alex.trainer@gymkhana.com', 'Bodybuilding & Strength Training', '10+ years coaching champion athletes.', 10),
            ('Sara Connor', 'sara.trainer@gymkhana.com', 'HIIT, Fat Loss & Functional Fitness', 'Specialist in rapid fat loss and endurance transformation.', 7),
            ('Marcus Steel', 'marcus.trainer@gymkhana.com', 'Powerlifting & Mobility', 'Master of squat/bench/deadlift form and injury prevention.', 5)
        ]

        trainers = []
        for name, email, spec, bio, exp in trainers_info:
            u = User(full_name=name, email=email, role='TRAINER', phone='+1-800-555-010' + str(len(trainers)+1))
            u.set_password('trainer123')
            db.session.add(u)
            db.session.flush()

            t = Trainer(user_id=u.id, specialization=spec, bio=bio, experience_years=exp)
            db.session.add(t)
            trainers.append(t)
        db.session.flush()

        print("Seeding Master Templates for Workouts & Diets...")
        # Workout Master Template 1
        w_temp1 = WorkoutPlan(
            title='5-Day Hypertrophy Split (Master Template)',
            description='Complete 5-day muscle building program targeting all major muscle groups.',
            created_by=admin_user.id,
            is_template=True
        )
        db.session.add(w_temp1)
        db.session.flush()

        exercises_t1 = [
            ('MONDAY', 'Barbell Bench Press', 'Chest', 4, '8-10', 90),
            ('MONDAY', 'Incline Dumbbell Press', 'Chest', 3, '10-12', 60),
            ('TUESDAY', 'Barbell Deadlift', 'Back', 4, '6-8', 120),
            ('TUESDAY', 'Lat Pulldown', 'Back', 3, '10-12', 60),
            ('WEDNESDAY', 'Barbell Back Squat', 'Legs', 4, '8-10', 120),
            ('WEDNESDAY', 'Leg Press', 'Legs', 3, '12-15', 60),
            ('THURSDAY', 'Overhead Military Press', 'Shoulders', 4, '8-10', 90),
            ('THURSDAY', 'Lateral Raises', 'Shoulders', 4, '12-15', 45),
            ('FRIDAY', 'Barbell Bicep Curl', 'Arms', 3, '10-12', 60),
            ('FRIDAY', 'Tricep Rope Pushdown', 'Arms', 3, '12-15', 45),
        ]
        for day, ex_name, target, sets, reps, rest in exercises_t1:
            e = WorkoutExercise(
                workout_plan_id=w_temp1.id,
                day_of_week=day,
                exercise_name=ex_name,
                target_muscle=target,
                sets=sets,
                reps=reps,
                rest_seconds=rest
            )
            db.session.add(e)

        # Diet Master Template 1
        d_temp1 = DietPlan(
            title='Clean Bulking High-Protein Diet (Master Template)',
            description='Calorie surplus meal plan optimized for clean lean muscle gains.',
            daily_calorie_target=2800,
            protein_target_g=190,
            carbs_target_g=320,
            fat_target_g=75,
            created_by=admin_user.id,
            is_template=True
        )
        db.session.add(d_temp1)
        db.session.flush()

        meals_t1 = [
            ('MONDAY', 'Breakfast', 'Oatmeal with Whole Milk, 4 Egg Whites & Banana', 650, 45, 80, 15),
            ('MONDAY', 'Lunch', 'Grilled Chicken Breast with Brown Rice & Broccoli', 750, 55, 85, 18),
            ('MONDAY', 'Snack', 'Whey Protein Shake & Almonds', 350, 35, 15, 12),
            ('MONDAY', 'Dinner', 'Salmon Steak with Sweet Potato & Asparagus', 650, 45, 60, 22),
            ('TUESDAY', 'Breakfast', '4 Scrambled Eggs with Avocado & Whole Wheat Toast', 600, 35, 40, 30),
            ('TUESDAY', 'Lunch', 'Lean Ground Beef Bowl with Jasmine Rice', 800, 50, 90, 20),
            ('TUESDAY', 'Dinner', 'Turkey Breast Tenderloin with Quinoa', 650, 45, 65, 15),
        ]
        for day, m_time, m_name, cal, prot, carb, fat in meals_t1:
            m = DietMeal(
                diet_plan_id=d_temp1.id,
                day_of_week=day,
                meal_time=m_time,
                meal_name=m_name,
                calories=cal,
                protein=prot,
                carbs=carb,
                fat=fat
            )
            db.session.add(m)

        print("Seeding 15 Members, Subscriptions, Assigned Plans, and Progress Logs...")
        members_data = [
            ("John Doe", "john@gmail.com", "MALE", "1995-04-12", "+1-555-0101", 178.0, 0),
            ("Emily Watson", "emily@gmail.com", "FEMALE", "1998-09-22", "+1-555-0102", 165.0, 1),
            ("Michael Brown", "michael@gmail.com", "MALE", "1992-11-05", "+1-555-0103", 182.0, 2),
            ("Sophia Taylor", "sophia@gmail.com", "FEMALE", "2000-01-15", "+1-555-0104", 168.0, 0),
            ("James Wilson", "james@gmail.com", "MALE", "1989-07-30", "+1-555-0105", 175.0, 1),
            ("Olivia Davis", "olivia@gmail.com", "FEMALE", "1996-03-18", "+1-555-0106", 162.0, 2),
            ("Daniel Miller", "daniel@gmail.com", "MALE", "1994-08-25", "+1-555-0107", 180.0, 0),
            ("Ava Anderson", "ava@gmail.com", "FEMALE", "1999-12-04", "+1-555-0108", 170.0, 1),
            ("David Thomas", "david@gmail.com", "MALE", "1991-05-19", "+1-555-0109", 176.0, 2),
            ("Mia Jackson", "mia@gmail.com", "FEMALE", "1997-10-10", "+1-555-0110", 164.0, 0),
            ("Robert White", "robert@gmail.com", "MALE", "1993-02-14", "+1-555-0111", 185.0, 1),
            ("Charlotte Harris", "charlotte@gmail.com", "FEMALE", "2001-06-08", "+1-555-0112", 167.0, 2),
            ("William Martin", "william@gmail.com", "MALE", "1990-09-01", "+1-555-0113", 179.0, 0),
            ("Amelia Thompson", "amelia@gmail.com", "FEMALE", "1998-11-28", "+1-555-0114", 169.0, 1),
            ("Joseph Garcia", "joseph@gmail.com", "MALE", "1995-12-19", "+1-555-0115", 177.0, 2),
        ]

        today = date.today()

        for idx, (name, email, gender, dob, phone, height, trainer_idx) in enumerate(members_data):
            u = User(full_name=name, email=email, role='MEMBER', phone=phone)
            u.set_password('member123')
            db.session.add(u)
            db.session.flush()

            m = Member(
                user_id=u.id,
                trainer_id=trainers[trainer_idx].id,
                date_of_birth=date.fromisoformat(dob),
                gender=gender,
                emergency_contact=f"Emergency Contact ({name})",
                height_cm=height
            )
            db.session.add(m)
            db.session.flush()

            # Assign Subscription Plan (mix of active, expiring soon, expired)
            plan_obj = plans[idx % len(plans)]
            if idx == 0: # Expiring soon
                start_d = today - timedelta(days=25)
                end_d = today + timedelta(days=5)
            elif idx == 1: # Expired
                start_d = today - timedelta(days=60)
                end_d = today - timedelta(days=2)
            else: # Active
                start_d = today - timedelta(days=10)
                end_d = today + timedelta(days=30 * plan_obj.duration_months)

            sub = MemberSubscription(
                member_id=m.id,
                plan_id=plan_obj.id,
                start_date=start_d,
                end_date=end_d,
                status='ACTIVE', # computed status handles exact text
                payment_status='PAID',
                payment_amount=plan_obj.price
            )
            db.session.add(sub)

            # Assign Individual Workout & Diet
            wp = WorkoutPlan(
                title=f"{name}'s Personal Workout Routine",
                description="Customized daily training plan.",
                member_id=m.id,
                created_by=trainers[trainer_idx].user_id,
                is_template=False
            )
            db.session.add(wp)
            db.session.flush()

            db.session.add(WorkoutExercise(workout_plan_id=wp.id, day_of_week='MONDAY', exercise_name='Bench Press', target_muscle='Chest', sets=3, reps='10', rest_seconds=60))
            db.session.add(WorkoutExercise(workout_plan_id=wp.id, day_of_week='MONDAY', exercise_name='Push Ups', target_muscle='Chest', sets=3, reps='15', rest_seconds=45))
            db.session.add(WorkoutExercise(workout_plan_id=wp.id, day_of_week='TUESDAY', exercise_name='Deadlift', target_muscle='Back', sets=4, reps='8', rest_seconds=90))
            db.session.add(WorkoutExercise(workout_plan_id=wp.id, day_of_week='WEDNESDAY', exercise_name='Squat', target_muscle='Legs', sets=4, reps='10', rest_seconds=90))

            dp = DietPlan(
                title=f"{name}'s Daily Diet Plan",
                description="Target macros for fitness goals.",
                daily_calorie_target=2200,
                protein_target_g=160,
                carbs_target_g=220,
                fat_target_g=60,
                member_id=m.id,
                created_by=trainers[trainer_idx].user_id,
                is_template=False
            )
            db.session.add(dp)
            db.session.flush()

            db.session.add(DietMeal(diet_plan_id=dp.id, day_of_week='MONDAY', meal_time='Breakfast', meal_name='Oatmeal & Eggs', calories=500, protein=35, carbs=50, fat=12))
            db.session.add(DietMeal(diet_plan_id=dp.id, day_of_week='MONDAY', meal_time='Lunch', meal_name='Chicken Salad', calories=600, protein=45, carbs=40, fat=18))
            db.session.add(DietMeal(diet_plan_id=dp.id, day_of_week='MONDAY', meal_time='Dinner', meal_name='Grilled Salmon & Vegetables', calories=650, protein=40, carbs=35, fat=22))

            # Progress Logs (3 historical entries per member for charts)
            base_w = 75.0 + (idx * 1.5)
            for p_step in range(3):
                p_date = today - timedelta(days=(2 - p_step) * 7)
                w_val = round(base_w - (p_step * 0.8), 1)
                bf_val = round(20.0 - (p_step * 0.5), 1)
                
                pr = ProgressRecord(
                    member_id=m.id,
                    record_date=p_date,
                    weight=w_val,
                    body_fat_pct=bf_val,
                    chest_in=38.5 + (p_step * 0.2),
                    waist_in=32.0 - (p_step * 0.3),
                    arms_in=14.0 + (p_step * 0.1),
                    notes=f"Week {p_step + 1} progress check-in."
                )
                pr.calculate_bmi(height)
                db.session.add(pr)

        db.session.commit()
        print("Database Seeding Completed Successfully!")

if __name__ == '__main__':
    seed_database()
