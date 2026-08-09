import os
from app import create_app, db
from seed import seed_database

app = create_app(os.getenv('FLASK_ENV', 'development'))

try:
    seed_database(app, force=False)
except Exception as e:
    print(f"Auto-seed warning: {e}")

if __name__ == '__main__':
    print("Gymkhana Backend Server Running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
