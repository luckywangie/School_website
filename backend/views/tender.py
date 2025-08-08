# views/tender.py
import os
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Tender

ALLOWED_PDF = {"pdf"}

tender_bp = Blueprint("tender", __name__, url_prefix="/api/tenders")

def allowed_file(filename, allowed):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed

def admin_only():
    ident = get_jwt_identity()
    return ident and ident.get("role") == "admin"

@tender_bp.route("/", methods=["GET"])
def list_tenders():
    items = Tender.query.order_by(Tender.date_posted.desc()).all()
    return jsonify([{"id": t.id, "title": t.title, "description": t.description, "image_url": t.image_url, "document_url": t.document_url, "deadline": t.deadline.isoformat() if t.deadline else None} for t in items])

@tender_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_tender():
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    # multipart form: file + title + description + deadline (optional)
    file = request.files.get("file")
    title = request.form.get("title") or "Untitled"
    description = request.form.get("description")
    deadline = request.form.get("deadline")  # optional ISO string

    if not file or file.filename == "":
        return jsonify({"error": "No file uploaded"}), 400

    if not allowed_file(file.filename, ALLOWED_PDF):
        return jsonify({"error": "Only PDFs allowed"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(current_app.config["PDF_UPLOAD_FOLDER"], filename)
    file.save(save_path)
    rel_path = f"/uploads/pdfs/{filename}"

    t = Tender(title=title, description=description, document_url=rel_path, image_url=request.form.get("image_url", "/static/images/placeholder.png"))
    if deadline:
        try:
            from datetime import datetime
            t.deadline = datetime.fromisoformat(deadline)
        except Exception:
            pass
    db.session.add(t)
    db.session.commit()
    return jsonify({"message": "Tender uploaded", "id": t.id, "document_url": rel_path}), 201

@tender_bp.route("/pdfs/<path:filename>", methods=["GET"])
def serve_pdf(filename):
    return send_from_directory(current_app.config["PDF_UPLOAD_FOLDER"], filename)
