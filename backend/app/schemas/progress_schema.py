from marshmallow import Schema, fields, validate

class ProgressRecordSchema(Schema):
    id = fields.Int(dump_only=True)
    member_id = fields.Int(allow_none=True)
    record_date = fields.Date(required=True)
    weight = fields.Float(required=True, validate=validate.Range(min=20.0, max=300.0))
    body_fat_pct = fields.Float(allow_none=True)
    chest_in = fields.Float(allow_none=True)
    waist_in = fields.Float(allow_none=True)
    arms_in = fields.Float(allow_none=True)
    notes = fields.Str(allow_none=True)
