# views/public.py
from flask import Blueprint, jsonify
from models import News, Gallery, Department, Tender, Staff, Result

public_bp = Blueprint("public", __name__, url_prefix="/api/public")

@public_bp.route("/highlights", methods=["GET"])
def highlights():
    return jsonify({
        "news": [{"id": n.id, "title": n.title, "image_url": n.image_url} for n in News.query.order_by(News.created_at.desc()).limit(5)],
        "gallery": [{"id": g.id, "title": g.title, "image_url": g.image_url} for g in Gallery.query.order_by(Gallery.uploaded_at.desc()).limit(8)],
        "departments": [{"id": d.id, "name": d.name, "image_url": d.image_url} for d in Department.query.order_by(Department.updated_at.desc()).limit(6)],
        "tenders": [{"id": t.id, "title": t.title, "image_url": t.image_url, "document_url": t.document_url} for t in Tender.query.order_by(Tender.date_posted.desc()).limit(5)],
        "staff": [{"id": s.id, "name": s.name, "photo_url": s.photo_url} for s in Staff.query.order_by(Staff.updated_at.desc()).limit(6)],
        "results": [{"id": r.id, "student_name": r.student_name, "pdf_url": r.pdf_url} for r in Result.query.order_by(Result.uploaded_at.desc()).limit(6)]
    })
