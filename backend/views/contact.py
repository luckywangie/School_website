# views/contact.py
from flask import Blueprint, request, jsonify
from app import db
from models import ContactMessage

contact_bp = Blueprint("contact", __name__, url_prefix="/api/contact")

@contact_bp.route("/", methods=["POST"])
def submit_contact():
    data = request.get_json() or {}
    name = data.get("name")
    email = data.get("email")
    message = data.get("message")
    subject = data.get("subject")
    if not name or not email or not message:
        return jsonify({"error": "name, email and message are required"}), 400
    cm = ContactMessage(name=name, email=email, subject=subject, message=message)
    db.session.add(cm)
    db.session.commit()
    return jsonify({"message": "Message received"}), 201

@contact_bp.route("/", methods=["GET"])
def list_messages():
    # If you want to restrict, you can protect with jwt_required
    msgs = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    return jsonify([{"id": m.id, "name": m.name, "email": m.email, "subject": m.subject, "message": m.message, "created_at": m.created_at.isoformat()} for m in msgs])
