from marshmallow import Schema, fields, validate

class WorkoutExerciseSchema(Schema):
    id = fields.Int(dump_only=True)
    workout_plan_id = fields.Int(dump_only=True)
    day_of_week = fields.Str(required=True, validate=validate.OneOf(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']))
    exercise_name = fields.Str(required=True, validate=validate.Length(min=2, max=120))
    target_muscle = fields.Str(required=True, validate=validate.Length(min=2, max=80))
    sets = fields.Int(load_default=3, validate=validate.Range(min=1, max=20))
    reps = fields.Str(load_default='10-12')
    rest_seconds = fields.Int(load_default=60, validate=validate.Range(min=0, max=600))
    notes = fields.Str(allow_none=True)

class WorkoutPlanSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=2, max=150))
    description = fields.Str(allow_none=True)
    member_id = fields.Int(allow_none=True)
    is_template = fields.Bool(load_default=False)
    exercises = fields.List(fields.Nested(WorkoutExerciseSchema), load_default=[])
