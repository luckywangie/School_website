# views/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, unset_jwt_cookies
from datetime import timedelta, datetime
from app import db
from models import Admin

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.get_json() or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    admin = Admin.query.filter_by(email=email).first()
    if not admin or not admin.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    if not admin.is_active:
        return jsonify({"error": "Account disabled"}), 403

    admin.last_login = datetime.utcnow()
    db.session.commit()

    token = create_access_token(identity={"id": admin.id, "role": admin.role}, expires_delta=timedelta(hours=8))
    return jsonify({
        "message": "Login successful",
        "access_token": token,
        "admin": {"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}
    }), 200

@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def admin_logout():
    resp = jsonify({"message": "Logout successful"})
    unset_jwt_cookies(resp)
    return resp, 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def admin_profile():
    ident = get_jwt_identity()
    if not ident or "id" not in ident:
        return jsonify({"error": "Invalid token identity"}), 422

    admin = Admin.query.get(ident["id"])
    if not admin:
        return jsonify({"error": "Admin not found"}), 404
    return jsonify({"id": admin.id, "name": admin.name, "email": admin.email, "role": admin.role}), 200
