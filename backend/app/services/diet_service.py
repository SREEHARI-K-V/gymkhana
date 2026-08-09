from app.extensions import db
from app.models.diet import DietPlan, DietMeal
from app.models.member import Member

class DietService:
    @staticmethod
    def create_diet_plan(data, creator_id):
        plan = DietPlan(
            title=data.get('title'),
            description=data.get('description'),
            daily_calorie_target=int(data.get('daily_calorie_target', 2000)),
            protein_target_g=int(data.get('protein_target_g', 150)),
            carbs_target_g=int(data.get('carbs_target_g', 200)),
            fat_target_g=int(data.get('fat_target_g', 65)),
            member_id=data.get('member_id'),
            created_by=creator_id,
            is_template=data.get('is_template', False)
        )
        db.session.add(plan)
        db.session.flush()

        meals_data = data.get('meals', [])
        for m in meals_data:
            meal = DietMeal(
                diet_plan_id=plan.id,
                day_of_week=m.get('day_of_week', 'MONDAY'),
                meal_time=m.get('meal_time', 'Breakfast'),
                meal_name=m.get('meal_name'),
                calories=int(m.get('calories', 0)),
                protein=int(m.get('protein', 0)),
                carbs=int(m.get('carbs', 0)),
                fat=int(m.get('fat', 0))
            )
            db.session.add(meal)

        db.session.commit()
        return plan

    @staticmethod
    def duplicate_template_to_member(template_id, member_id, creator_id):
        template = DietPlan.query.get(template_id)
        if not template or not template.is_template:
            raise ValueError("Template diet plan not found")

        member = Member.query.get(member_id)
        if not member:
            raise ValueError("Target member not found")

        new_plan = DietPlan(
            title=f"{template.title} (Assigned to {member.user.full_name})",
            description=template.description,
            daily_calorie_target=template.daily_calorie_target,
            protein_target_g=template.protein_target_g,
            carbs_target_g=template.carbs_target_g,
            fat_target_g=template.fat_target_g,
            member_id=member.id,
            created_by=creator_id,
            is_template=False
        )
        db.session.add(new_plan)
        db.session.flush()

        for m in template.meals.all():
            new_meal = DietMeal(
                diet_plan_id=new_plan.id,
                day_of_week=m.day_of_week,
                meal_time=m.meal_time,
                meal_name=m.meal_name,
                calories=m.calories,
                protein=m.protein,
                carbs=m.carbs,
                fat=m.fat
            )
            db.session.add(new_meal)

        db.session.commit()
        return new_plan
