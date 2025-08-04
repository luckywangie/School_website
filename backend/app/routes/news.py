import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.models import News
from app import db
from app.utils.auth import admin_required

bp = Blueprint('news', __name__, url_prefix='/api/news')

# Allowed file types for news images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# ---------------------------
# Public Endpoints
# ---------------------------

# Get all news (latest first)
@bp.route('/', methods=['GET'])
def get_all_news():
    news_list = News.query.order_by(News.created_at.desc()).all()
    return jsonify([
        {
            "id": n.id,
            "title": n.title,
            "content": n.content,
            "image_url": n.image_url,
            "created_at": n.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } for n in news_list
    ])


# Get single news by ID
@bp.route('/<int:news_id>', methods=['GET'])
def get_news(news_id):
    news_item = News.query.get(news_id)
    if not news_item:
        return jsonify({"error": "News not found"}), 404

    return jsonify({
        "id": news_item.id,
        "title": news_item.title,
        "content": news_item.content,
        "image_url": news_item.image_url,
        "created_at": news_item.created_at.strftime("%Y-%m-%d %H:%M:%S")
    })


# ---------------------------
# Admin Endpoints
# ---------------------------

# Create news
@bp.route('/', methods=['POST'])
@admin_required
def create_news():
    title = request.form.get('title')
    content = request.form.get('content')
    file = request.files.get('image')

    if not title or not content:
        return jsonify({"error": "Title and content are required"}), 400

    image_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'news')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        image_url = f"/static/news/{filename}"

    new_news = News(title=title, content=content, image_url=image_url)
    db.session.add(new_news)
    db.session.commit()

    return jsonify({"message": "News created successfully", "news_id": new_news.id}), 201


# Update news
@bp.route('/<int:news_id>', methods=['PUT'])
@admin_required
def update_news(news_id):
    news_item = News.query.get(news_id)
    if not news_item:
        return jsonify({"error": "News not found"}), 404

    title = request.form.get('title', news_item.title)
    content = request.form.get('content', news_item.content)
    file = request.files.get('image')

    # Update image if a new one is uploaded
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'news')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        news_item.image_url = f"/static/news/{filename}"

    news_item.title = title
    news_item.content = content
    db.session.commit()

    return jsonify({"message": "News updated successfully"})


# Delete news
@bp.route('/<int:news_id>', methods=['DELETE'])
@admin_required
def delete_news(news_id):
    news_item = News.query.get(news_id)
    if not news_item:
        return jsonify({"error": "News not found"}), 404

    db.session.delete(news_item)
    db.session.commit()
    return jsonify({"message": "News deleted successfully"})
