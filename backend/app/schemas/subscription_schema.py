from marshmallow import Schema, fields, validate

class SubscriptionPlanSchema(Schema):
    id = fields.Int(dump_only=True)
    title = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    duration_months = fields.Int(required=True, validate=validate.Range(min=1, max=36))
    price = fields.Float(required=True, validate=validate.Range(min=0))
    features = fields.List(fields.Str(), required=True)
    is_active = fields.Bool(load_default=True)
    created_at = fields.DateTime(dump_only=True)

class MemberSubscriptionSchema(Schema):
    id = fields.Int(dump_only=True)
    member_id = fields.Int(required=True)
    plan_id = fields.Int(required=True)
    start_date = fields.Date(allow_none=True)
    payment_status = fields.Str(load_default='PAID', validate=validate.OneOf(['PAID', 'PENDING', 'FAILED']))
