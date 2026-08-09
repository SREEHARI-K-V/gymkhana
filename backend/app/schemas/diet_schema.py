from marshmallow import Schema, fields, validate

class DietMealSchema(Schema):
    id = fields.Int(dump_only=True)
    diet_plan_id = fields.Int(dump_only=True)
    day_of_week = fields.Str(required=True, validate=validate.OneOf(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']))
    meal_time = fields.Str(required=True)
    meal_name = fields.Str(required=True)
    calories = fields.Int(load_default=0)
    protein = fields.Int(load_default=0)
    carbs = fields.Int(load_default=0)
    fat = fields.Int(load_default=0)

class DietPlanSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=2, max=150))
    description = fields.Str(allow_none=True)
    daily_calorie_target = fields.Int(load_default=2000)
    protein_target_g = fields.Int(load_default=150)
    carbs_target_g = fields.Int(load_default=200)
    fat_target_g = fields.Int(load_default=65)
    member_id = fields.Int(allow_none=True)
    is_template = fields.Bool(load_default=False)
    meals = fields.List(fields.Nested(DietMealSchema), load_default=[])
