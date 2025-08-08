# views/staff.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Staff, Department  # noqa: F401

staff_bp = Blueprint("staff", __name__, url_prefix="/api/staff")

def admin_only():
    ident = get_jwt_identity()
    return ident and ident.get("role") == "admin"

@staff_bp.route("/", methods=["GET"])
def list_staff():
    items = Staff.query.all()
    return jsonify([{"id": s.id, "name": s.name, "title": s.title, "bio": s.bio, "photo_url": s.photo_url, "department_id": s.department_id} for s in items])

@staff_bp.route("/<int:id>", methods=["GET"])
def get_staff(id):
    s = Staff.query.get_or_404(id)
    return jsonify({"id": s.id, "name": s.name, "title": s.title, "bio": s.bio, "photo_url": s.photo_url, "department_id": s.department_id})

@staff_bp.route("/", methods=["POST"])
@jwt_required()
def create_staff():
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    data = request.get_json() or {}
    s = Staff(name=data.get("name"), title=data.get("title"), bio=data.get("bio"), photo_url=data.get("photo_url", "/static/images/placeholder.png"), department_id=data.get("department_id"))
    db.session.add(s)
    db.session.commit()
    return jsonify({"message": "Created", "id": s.id}), 201

@staff_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_staff(id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    s = Staff.query.get_or_404(id)
    data = request.get_json() or {}
    s.name = data.get("name", s.name)
    s.title = data.get("title", s.title)
    s.bio = data.get("bio", s.bio)
    s.photo_url = data.get("photo_url", s.photo_url)
    s.department_id = data.get("department_id", s.department_id)
    db.session.commit()
    return jsonify({"message": "Updated"})

@staff_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_staff(id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    s = Staff.query.get_or_404(id)
    db.session.delete(s)
    db.session.commit()
    return jsonify({"message": "Deleted"})
