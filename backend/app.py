# app.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
IMAGE_UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, "images")
PDF_UPLOAD_FOLDER = os.path.join(UPLOAD_FOLDER, "pdfs")

os.makedirs(IMAGE_UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PDF_UPLOAD_FOLDER, exist_ok=True)

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI", "sqlite:///" + os.path.join(BASE_DIR, "app.db"))
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
    app.config["IMAGE_UPLOAD_FOLDER"] = IMAGE_UPLOAD_FOLDER
    app.config["PDF_UPLOAD_FOLDER"] = PDF_UPLOAD_FOLDER
    app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # CORS fix: allow only your React frontend origin, support credentials
    CORS(app,
         resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
         supports_credentials=True)

    # Import models to register
    from models import Admin, News, Gallery, Department, Staff, Tender, Result, ContactMessage  # noqa

    # Register blueprints
    from views import register_blueprints
    register_blueprints(app)

    @app.route("/")
    def index():
        return {"message": "School website API running"}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
