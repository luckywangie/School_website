# views/news.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from models import News

news_bp = Blueprint("news", __name__, url_prefix="/api/news")

def admin_only():
    ident = get_jwt_identity()
    return ident and ident.get("role") == "admin"

@news_bp.route("/", methods=["GET"])
def list_news():
    items = News.query.order_by(News.created_at.desc()).all()
    return jsonify([{
        "id": n.id,
        "title": n.title,
        "description": n.description,
        "image_url": n.image_url,
        "created_at": n.created_at.isoformat()
    } for n in items])

@news_bp.route("/<int:item_id>", methods=["GET"])
def get_news(item_id):
    n = News.query.get_or_404(item_id)
    return jsonify({
        "id": n.id, "title": n.title, "description": n.description,
        "content": n.content, "image_url": n.image_url,
        "created_at": n.created_at.isoformat()
    })

@news_bp.route("/", methods=["POST"])
@jwt_required()
def create_news():
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    data = request.get_json() or {}
    n = News(
        title=data.get("title", "Untitled"),
        description=data.get("description"),
        content=data.get("content"),
        image_url=data.get("image_url", "/static/images/placeholder.png")
    )
    db.session.add(n)
    db.session.commit()
    return jsonify({"message": "News created", "id": n.id}), 201

@news_bp.route("/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_news(item_id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    n = News.query.get_or_404(item_id)
    data = request.get_json() or {}
    n.title = data.get("title", n.title)
    n.description = data.get("description", n.description)
    n.content = data.get("content", n.content)
    n.image_url = data.get("image_url", n.image_url)
    db.session.commit()
    return jsonify({"message": "News updated"})

@news_bp.route("/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_news(item_id):
    if not admin_only():
        return jsonify({"error": "Admins only"}), 403
    n = News.query.get_or_404(item_id)
    db.session.delete(n)
    db.session.commit()
    return jsonify({"message": "News deleted"})
