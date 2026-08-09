from app.extensions import db
from app.models.workout import WorkoutPlan, WorkoutExercise
from app.models.member import Member

class WorkoutService:
    @staticmethod
    def create_workout_plan(data, creator_id):
        plan = WorkoutPlan(
            title=data.get('title'),
            description=data.get('description'),
            member_id=data.get('member_id'),
            created_by=creator_id,
            is_template=data.get('is_template', False)
        )
        db.session.add(plan)
        db.session.flush()

        exercises_data = data.get('exercises', [])
        for ex in exercises_data:
            exercise = WorkoutExercise(
                workout_plan_id=plan.id,
                day_of_week=ex.get('day_of_week', 'MONDAY'),
                exercise_name=ex.get('exercise_name'),
                target_muscle=ex.get('target_muscle', 'General'),
                sets=int(ex.get('sets', 3)),
                reps=str(ex.get('reps', '10-12')),
                rest_seconds=int(ex.get('rest_seconds', 60)),
                notes=ex.get('notes')
            )
            db.session.add(exercise)

        db.session.commit()
        return plan

    @staticmethod
    def duplicate_template_to_member(template_id, member_id, creator_id):
        template = WorkoutPlan.query.get(template_id)
        if not template or not template.is_template:
            raise ValueError("Template workout plan not found")

        member = Member.query.get(member_id)
        if not member:
            raise ValueError("Target member not found")

        new_plan = WorkoutPlan(
            title=f"{template.title} (Assigned to {member.user.full_name})",
            description=template.description,
            member_id=member.id,
            created_by=creator_id,
            is_template=False
        )
        db.session.add(new_plan)
        db.session.flush()

        for ex in template.exercises.all():
            new_ex = WorkoutExercise(
                workout_plan_id=new_plan.id,
                day_of_week=ex.day_of_week,
                exercise_name=ex.exercise_name,
                target_muscle=ex.target_muscle,
                sets=ex.sets,
                reps=ex.reps,
                rest_seconds=ex.rest_seconds,
                notes=ex.notes
            )
            db.session.add(new_ex)

        db.session.commit()
        return new_plan
