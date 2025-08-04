from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

# Initialize extensions globally
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    # ----------------------
    # Configuration
    # ----------------------
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///school.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'supersecret')

    # ----------------------
    # Initialize extensions
    # ----------------------
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)

    # Import models so Flask-Migrate can detect them
    from app import models

    # ----------------------
    # Create DB if missing
    # ----------------------
    db_path = app.config['SQLALCHEMY_DATABASE_URI'].replace('sqlite:///', '')
    if not os.path.exists(db_path):
        with app.app_context():
            db.create_all()

    # ----------------------
    # JWT Error Handlers
    # ----------------------
    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return jsonify({"error": "Missing or invalid token"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return jsonify({"error": "Invalid token"}), 401

    # ----------------------
    # Basic root route for testing
    # ----------------------
    @app.route("/")
    def index():
        return {"message": "School Website API is running!"}

    # ----------------------
    # Register Blueprints
    # ----------------------
    from app.routes import (
        auth,
        pages,
        news,
        gallery,
        results,
        tenders,
        academics,
        contact
    )

    app.register_blueprint(auth.bp)
    app.register_blueprint(pages.bp)
    app.register_blueprint(news.bp)
    app.register_blueprint(gallery.bp)
    app.register_blueprint(results.bp)
    app.register_blueprint(tenders.bp)
    app.register_blueprint(academics.bp)
    app.register_blueprint(contact.bp)

    return app
