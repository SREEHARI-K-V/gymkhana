import os
from datetime import timedelta
from dotenv import load_dotenv

import tempfile

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config.env'))

# SQLite fallback path (use /tmp on Vercel/serverless environments)
if os.getenv('VERCEL') == '1' or os.getenv('VERCEL_ENV'):
    default_db_path = os.path.join(tempfile.gettempdir(), 'gymkhana.db').replace('\\', '/')
    default_sqlite_uri = f'sqlite:///{default_db_path}'
else:
    default_sqlite_uri = 'sqlite:///gymkhana.db'

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'gymkhana_default_secret_key_2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'gymkhana_default_jwt_key_2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 24)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES_DAYS', 30)))
    
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', default_sqlite_uri)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    CORS_HEADERS = 'Content-Type'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    DEBUG = False

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
