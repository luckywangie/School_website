# views/department.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Department, Staff  # noqa: F401

department_bp = Blueprint("department", __name__, url_prefix="/api/departments")

def admin_only():
    ident = get_jwt_identity()
    return ident and ident.get("role") == "admin"

@department_bp.route("/", methods=["GET"])
def list_departments():
    deps = Department.query.all()
    out = []
    for d in deps:
        out.append({
            "id": d.id, "name": d.name, "description": d.description,
            "image_url": d.image_url,
            "staff_count": len(d.staff_members)
        })
    return jsonify(out)

@department_bp.route("/<int:id>", methods=["GET"])
def get_department(id):
    d = Department.query.get_or_404(id)
    staff = [{"id": s.id, "name": s.name, "title": s.title, "photo_url": s.photo_url} for s in d.staff_members]
    return jsonify({"id": d.id, "name": d.name, "description": d.description, "image_url": d.image_url, "staff": staff})

@department_bp.route("/", methods=["POST"])
@jwt_required()
def create_department():
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    data = request.get_json() or {}
    d = Department(name=data.get("name"), description=data.get("description"), image_url=data.get("image_url", "/static/images/placeholder.png"))
    db.session.add(d)
    db.session.commit()
    return jsonify({"message": "Created", "id": d.id}), 201

@department_bp.route("/<int:id>", methods=["PUT"])
@jwt_required()
def update_department(id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    d = Department.query.get_or_404(id)
    data = request.get_json() or {}
    d.name = data.get("name", d.name)
    d.description = data.get("description", d.description)
    d.image_url = data.get("image_url", d.image_url)
    d.head_id = data.get("head_id", d.head_id)
    db.session.commit()
    return jsonify({"message": "Updated"})

@department_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_department(id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    d = Department.query.get_or_404(id)
    db.session.delete(d)
    db.session.commit()
    return jsonify({"message": "Deleted"})
