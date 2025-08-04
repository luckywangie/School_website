import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.models import Tender
from app import db
from app.utils.auth import admin_required

bp = Blueprint('tenders', __name__, url_prefix='/api/tenders')

# Allowed file types for tender documents
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------
# Public Endpoints
# ---------------------------

# Get all tenders (latest first)
@bp.route('/', methods=['GET'])
def get_all_tenders():
    tenders = Tender.query.order_by(Tender.date_posted.desc()).all()
    return jsonify([
        {
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "deadline": t.deadline.strftime("%Y-%m-%d %H:%M:%S") if t.deadline else None,
            "document_url": t.document_url,
            "date_posted": t.date_posted.strftime("%Y-%m-%d %H:%M:%S")
        } for t in tenders
    ])


# Get single tender by ID
@bp.route('/<int:tender_id>', methods=['GET'])
def get_tender(tender_id):
    tender = Tender.query.get(tender_id)
    if not tender:
        return jsonify({"error": "Tender not found"}), 404

    return jsonify({
        "id": tender.id,
        "title": tender.title,
        "description": tender.description,
        "deadline": tender.deadline.strftime("%Y-%m-%d %H:%M:%S") if tender.deadline else None,
        "document_url": tender.document_url,
        "date_posted": tender.date_posted.strftime("%Y-%m-%d %H:%M:%S")
    })


# ---------------------------
# Admin Endpoints
# ---------------------------

# Create tender (supports file upload)
@bp.route('/', methods=['POST'])
@admin_required
def create_tender():
    title = request.form.get('title')
    description = request.form.get('description')
    deadline = request.form.get('deadline')  # Expecting YYYY-MM-DD format
    file = request.files.get('document')

    if not title or not description:
        return jsonify({"error": "Title and description are required"}), 400

    # Handle file upload if provided
    document_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'tenders')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        document_url = f"/static/tenders/{filename}"

    new_tender = Tender(
        title=title,
        description=description,
        deadline=datetime.strptime(deadline, "%Y-%m-%d") if deadline else None,
        document_url=document_url
    )
    db.session.add(new_tender)
    db.session.commit()

    return jsonify({
        "message": "Tender created successfully",
        "tender": {
            "id": new_tender.id,
            "title": new_tender.title,
            "description": new_tender.description,
            "deadline": new_tender.deadline.strftime("%Y-%m-%d %H:%M:%S") if new_tender.deadline else None,
            "document_url": new_tender.document_url,
            "date_posted": new_tender.date_posted.strftime("%Y-%m-%d %H:%M:%S")
        }
    }), 201


# Update tender
@bp.route('/<int:tender_id>', methods=['PUT'])
@admin_required
def update_tender(tender_id):
    tender = Tender.query.get(tender_id)
    if not tender:
        return jsonify({"error": "Tender not found"}), 404

    title = request.form.get('title', tender.title)
    description = request.form.get('description', tender.description)
    deadline = request.form.get('deadline', tender.deadline.strftime("%Y-%m-%d") if tender.deadline else None)
    file = request.files.get('document')

    # Handle file update if new file uploaded
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'tenders')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        tender.document_url = f"/static/tenders/{filename}"

    tender.title = title
    tender.description = description
    tender.deadline = datetime.strptime(deadline, "%Y-%m-%d") if deadline else None
    db.session.commit()

    return jsonify({"message": "Tender updated successfully"})


# Delete tender
@bp.route('/<int:tender_id>', methods=['DELETE'])
@admin_required
def delete_tender(tender_id):
    tender = Tender.query.get(tender_id)
    if not tender:
        return jsonify({"error": "Tender not found"}), 404

    db.session.delete(tender)
    db.session.commit()
    return jsonify({"message": "Tender deleted successfully"})
