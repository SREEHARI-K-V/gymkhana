from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    role = fields.Str(validate=validate.OneOf(['ADMIN', 'TRAINER', 'MEMBER']))
    phone = fields.Str(allow_none=True)
    created_at = fields.DateTime(dump_only=True)

class UserRegisterSchema(Schema):
    full_name = fields.Str(required=True, validate=validate.Length(min=2, max=100))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
    role = fields.Str(load_default='MEMBER', validate=validate.OneOf(['ADMIN', 'TRAINER', 'MEMBER']))
    phone = fields.Str(allow_none=True)
    # Extra fields for MEMBER registration
    date_of_birth = fields.Date(allow_none=True)
    gender = fields.Str(allow_none=True, validate=validate.OneOf(['MALE', 'FEMALE', 'OTHER']))
    emergency_contact = fields.Str(allow_none=True)
    height_cm = fields.Float(allow_none=True)
    trainer_id = fields.Int(allow_none=True)
    # Extra fields for TRAINER registration
    specialization = fields.Str(allow_none=True)
    bio = fields.Str(allow_none=True)
    experience_years = fields.Int(allow_none=True)

class UserLoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)
