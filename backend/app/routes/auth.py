from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models import Admin
from app import db
from app.utils.auth import admin_required, super_admin_required

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Health check
@bp.route('/ping')
def ping():
    return {"message": "Auth blueprint is alive!"}


# ---------------------------
# Admin Login
# ---------------------------
@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    admin = Admin.query.filter_by(email=email).first()
    if not admin or not check_password_hash(admin.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = create_access_token(identity={
        "id": admin.id,
        "email": admin.email,
        "role": admin.role
    })

    return jsonify({
        "message": "Login successful",
        "token": token,
        "admin": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": admin.role
        }
    })


# ---------------------------
# Get Current Admin (Protected)
# ---------------------------
@bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_admin():
    identity = get_jwt_identity()
    return jsonify({
        "message": "Token is valid",
        "admin": identity
    })


# ---------------------------
# Create New Admin (Super Admin Only)
# ---------------------------
@bp.route('/create-admin', methods=['POST'])
@super_admin_required
def create_admin():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if email exists
    if Admin.query.filter_by(email=email).first():
        return jsonify({"error": "Admin with this email already exists"}), 400

    # Create new admin
    hashed_password = generate_password_hash(password)
    new_admin = Admin(
        name=name,
        email=email,
        password_hash=hashed_password,
        role='admin'
    )
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({
        "message": "Admin created successfully",
        "admin": {
            "id": new_admin.id,
            "name": new_admin.name,
            "email": new_admin.email,
            "role": new_admin.role
        }
    })
