from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app import db
from app.models import ContactMessage
from app.utils.auth import admin_required

bp = Blueprint('contact', __name__, url_prefix='/api/contact')


# ---------------------------
# Public Endpoint: Send a message
# ---------------------------
@bp.route('/', methods=['POST'])
def send_message():
    """
    Public endpoint to send a message to the school.
    Anyone can submit a contact message.
    """
    data = request.get_json() or {}

    name = data.get('name')
    email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    if not name or not email or not message:
        return jsonify({"error": "Name, email, and message are required"}), 400

    new_message = ContactMessage(
        name=name,
        email=email,
        subject=subject,
        message=message
    )
    db.session.add(new_message)
    db.session.commit()

    return jsonify({"message": "Your message has been sent successfully!"}), 201


# ---------------------------
# Admin Endpoints: View messages
# ---------------------------
@bp.route('/', methods=['GET'])
@jwt_required()
@admin_required
def get_messages():
    """
    Admin endpoint to view all contact messages.
    Supports optional pagination via ?page=1&limit=10
    """
    page = request.args.get('page', 1, type=int)
    limit = request.args.get('limit', 10, type=int)

    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).paginate(page=page, per_page=limit, error_out=False)

    return jsonify({
        "messages": [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "subject": m.subject,
                "message": m.message,
                "created_at": m.created_at.strftime("%Y-%m-%d %H:%M:%S")
            } for m in messages.items
        ],
        "total": messages.total,
        "page": messages.page,
        "pages": messages.pages
    })


# ---------------------------
# Admin Endpoint: Delete message
# ---------------------------
@bp.route('/<int:msg_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_message(msg_id):
    """
    Admin endpoint to delete a specific contact message by ID.
    """
    message = ContactMessage.query.get(msg_id)
    if not message:
        return jsonify({"error": "Message not found"}), 404

    db.session.delete(message)
    db.session.commit()
    return jsonify({"message": "Message deleted successfully"}), 200
