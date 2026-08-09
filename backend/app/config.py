import os
import tempfile
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config.env'))

def get_db_uri():
    db_url = os.getenv('DATABASE_URL')
    
    # On Vercel / Serverless / Linux, current working directory is read-only.
    # Always use /tmp directory for writable SQLite database.
    is_serverless = (
        os.getenv('VERCEL') is not None or
        os.getenv('VERCEL_ENV') is not None or
        os.getenv('AWS_LAMBDA_FUNCTION_NAME') is not None or
        os.name != 'nt'
    )
    
    if db_url:
        if db_url.startswith('postgres://'):
            return db_url.replace('postgres://', 'postgresql://', 1)
        if is_serverless and 'sqlite' in db_url and '/tmp/' not in db_url:
            tmp_dir = tempfile.gettempdir()
            db_path = os.path.join(tmp_dir, 'gymkhana.db').replace('\\', '/')
            return f'sqlite:///{db_path}'
        return db_url
    
    if is_serverless:
        tmp_dir = tempfile.gettempdir()
        db_path = os.path.join(tmp_dir, 'gymkhana.db').replace('\\', '/')
        return f'sqlite:///{db_path}'
    else:
        return 'sqlite:///gymkhana.db'

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'gymkhana_default_secret_key_2026')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'gymkhana_default_jwt_key_2026')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_EXPIRES_HOURS', 24)))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_EXPIRES_DAYS', 30)))
    
    SQLALCHEMY_DATABASE_URI = get_db_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    CORS_HEADERS = 'Content-Type'

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = get_db_uri()

config_by_name = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
