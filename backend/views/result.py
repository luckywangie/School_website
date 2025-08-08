# views/result.py
import os
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Result

ALLOWED_PDF = {"pdf"}

result_bp = Blueprint("result", __name__, url_prefix="/api/results")

def allowed_file(filename, allowed):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed

def admin_only():
    ident = get_jwt_identity()
    return ident and ident.get("role") == "admin"

@result_bp.route("/", methods=["GET"])
def list_results():
    items = Result.query.order_by(Result.uploaded_at.desc()).all()
    return jsonify([{"id": r.id, "student_name": r.student_name, "class_name": r.class_name, "year": r.year, "image_url": r.image_url, "pdf_url": r.pdf_url} for r in items])

@result_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_result():
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    file = request.files.get("file")
    student_name = request.form.get("student_name")
    class_name = request.form.get("class_name")
    year = request.form.get("year")

    if not file or file.filename == "":
        return jsonify({"error": "No file uploaded"}), 400
    if not allowed_file(file.filename, ALLOWED_PDF):
        return jsonify({"error": "Only PDFs allowed"}), 400

    filename = secure_filename(file.filename)
    save_path = os.path.join(current_app.config["PDF_UPLOAD_FOLDER"], filename)
    file.save(save_path)
    rel_path = f"/uploads/pdfs/{filename}"

    r = Result(student_name=student_name, class_name=class_name, year=int(year) if year else None, pdf_url=rel_path, image_url=request.form.get("image_url", "/static/images/placeholder.png"))
    db.session.add(r)
    db.session.commit()
    return jsonify({"message": "Result uploaded", "id": r.id, "pdf_url": rel_path}), 201

@result_bp.route("/pdfs/<path:filename>", methods=["GET"])
def serve_result_pdf(filename):
    return send_from_directory(current_app.config["PDF_UPLOAD_FOLDER"], filename)
