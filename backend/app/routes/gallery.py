import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.models import Gallery
from app import db
from app.utils.auth import admin_required

bp = Blueprint('gallery', __name__, url_prefix='/api/gallery')

# Allowed file types for gallery images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------
# Public Endpoints
# ---------------------------

# Get all gallery images
@bp.route('/', methods=['GET'])
def get_all_images():
    images = Gallery.query.order_by(Gallery.uploaded_at.desc()).all()
    return jsonify([
        {
            "id": img.id,
            "title": img.title,
            "image_url": img.image_url,
            "uploaded_at": img.uploaded_at.strftime("%Y-%m-%d %H:%M:%S")
        } for img in images
    ])


# Get single gallery image
@bp.route('/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image = Gallery.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    return jsonify({
        "id": image.id,
        "title": image.title,
        "image_url": image.image_url,
        "uploaded_at": image.uploaded_at.strftime("%Y-%m-%d %H:%M:%S")
    })


# ---------------------------
# Admin Endpoints
# ---------------------------

# Upload new image
@bp.route('/', methods=['POST'])
@admin_required
def upload_image():
    title = request.form.get('title')
    file = request.files.get('file')

    if not file or not allowed_file(file.filename):
        return jsonify({"error": "A valid image file is required"}), 400

    filename = secure_filename(file.filename)
    upload_path = os.path.join(current_app.root_path, 'static', 'gallery')
    os.makedirs(upload_path, exist_ok=True)
    file.save(os.path.join(upload_path, filename))
    image_url = f"/static/gallery/{filename}"

    new_image = Gallery(title=title, image_url=image_url)
    db.session.add(new_image)
    db.session.commit()

    return jsonify({"message": "Image uploaded successfully", "image_id": new_image.id}), 201


# Update image (title or replace image file)
@bp.route('/<int:image_id>', methods=['PUT'])
@admin_required
def update_image(image_id):
    image = Gallery.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    title = request.form.get('title', image.title)
    file = request.files.get('file')

    # If a new image file is uploaded, replace the old one
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'gallery')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        image.image_url = f"/static/gallery/{filename}"

    image.title = title
    db.session.commit()

    return jsonify({"message": "Image updated successfully"})


# Delete image
@bp.route('/<int:image_id>', methods=['DELETE'])
@admin_required
def delete_image(image_id):
    image = Gallery.query.get(image_id)
    if not image:
        return jsonify({"error": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()
    return jsonify({"message": "Image deleted successfully"})
