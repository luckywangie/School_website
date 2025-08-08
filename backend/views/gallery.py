# views/gallery.py
import os
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import Gallery

ALLOWED_IMAGE_EXT = {"png", "jpg", "jpeg", "gif"}

gallery_bp = Blueprint("gallery", __name__, url_prefix="/api/gallery")

def allowed_file(filename, allowed):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed

def admin_only():
    ident = get_jwt_identity()
    return ident and ident.get("role") == "admin"

@gallery_bp.route("/", methods=["GET"])
def list_gallery():
    items = Gallery.query.order_by(Gallery.uploaded_at.desc()).all()
    return jsonify([{"id": g.id, "title": g.title, "image_url": g.image_url, "uploaded_at": g.uploaded_at.isoformat()} for g in items])

@gallery_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_image():
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files["file"]
    title = request.form.get("title", "")
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename, ALLOWED_IMAGE_EXT):
        filename = secure_filename(file.filename)
        save_path = os.path.join(current_app.config["IMAGE_UPLOAD_FOLDER"], filename)
        file.save(save_path)
        rel_path = f"/uploads/images/{filename}"
        g = Gallery(title=title, image_url=rel_path)
        db.session.add(g)
        db.session.commit()
        return jsonify({"message": "Uploaded", "id": g.id, "image_url": rel_path}), 201
    return jsonify({"error": "Invalid file type"}), 400

@gallery_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_image(id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    g = Gallery.query.get_or_404(id)
    # optionally delete file from disk (best-effort)
    try:
        filename = os.path.basename(g.image_url)
        fp = os.path.join(current_app.config["IMAGE_UPLOAD_FOLDER"], filename)
        if os.path.exists(fp):
            os.remove(fp)
    except Exception:
        pass
    db.session.delete(g)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 200

# optional: serve images (if not served by webserver)
@gallery_bp.route("/uploads/images/<path:filename>", methods=["GET"])
def serve_image(filename):
    return send_from_directory(current_app.config["IMAGE_UPLOAD_FOLDER"], filename)
