from datetime import datetime
from flask import Blueprint, request, jsonify
from app.models import Page
from app import db
from app.utils.auth import admin_required

bp = Blueprint('pages', __name__, url_prefix='/api/pages')

# ---------------------------
# Public Endpoints
# ---------------------------

# Get all pages
@bp.route('/', methods=['GET'])
def get_all_pages():
    pages = Page.query.order_by(Page.page_name.asc()).all()
    return jsonify([
        {
            "id": p.id,
            "page_name": p.page_name,
            "content": p.content,
            "last_updated": p.last_updated.strftime("%Y-%m-%d %H:%M:%S") if p.last_updated else None
        } for p in pages
    ])


# Get a single page by name (e.g., /api/pages/about)
@bp.route('/<string:page_name>', methods=['GET'])
def get_page(page_name):
    page = Page.query.filter_by(page_name=page_name.lower()).first()
    if not page:
        return jsonify({"error": "Page not found"}), 404

    return jsonify({
        "id": page.id,
        "page_name": page.page_name,
        "content": page.content,
        "last_updated": page.last_updated.strftime("%Y-%m-%d %H:%M:%S") if page.last_updated else None
    })


# ---------------------------
# Admin Endpoints
# ---------------------------

# Create a new page
@bp.route('/', methods=['POST'])
@admin_required
def create_page():
    data = request.get_json()
    page_name = data.get('page_name', '').strip().lower()
    content = data.get('content', '')

    if not page_name:
        return jsonify({"error": "Page name is required"}), 400

    # Ensure page name is unique
    if Page.query.filter_by(page_name=page_name).first():
        return jsonify({"error": "Page with this name already exists"}), 400

    new_page = Page(page_name=page_name, content=content)
    db.session.add(new_page)
    db.session.commit()

    return jsonify({"message": "Page created successfully", "page_id": new_page.id}), 201


# Update page content
@bp.route('/<string:page_name>', methods=['PUT'])
@admin_required
def update_page(page_name):
    page = Page.query.filter_by(page_name=page_name.lower()).first()
    if not page:
        return jsonify({"error": "Page not found"}), 404

    data = request.get_json()
    page.content = data.get('content', page.content)
    page.last_updated = datetime.utcnow()

    db.session.commit()
    return jsonify({"message": "Page updated successfully"})


# Delete a page
@bp.route('/<string:page_name>', methods=['DELETE'])
@admin_required
def delete_page(page_name):
    page = Page.query.filter_by(page_name=page_name.lower()).first()
    if not page:
        return jsonify({"error": "Page not found"}), 404

    db.session.delete(page)
    db.session.commit()
    return jsonify({"message": "Page deleted successfully"})
