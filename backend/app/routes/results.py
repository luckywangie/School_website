import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.models import Result
from app import db
from app.utils.auth import admin_required

bp = Blueprint('results', __name__, url_prefix='/api/results')

# Allowed file types for result PDFs
ALLOWED_PDF_EXTENSIONS = {'pdf'}

def allowed_pdf(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_PDF_EXTENSIONS


# ---------------------------
# Public Endpoints
# ---------------------------

# Get all results or filter by year/class
@bp.route('/', methods=['GET'])
def get_results():
    year = request.args.get('year')
    class_name = request.args.get('class')

    query = Result.query
    if year:
        query = query.filter_by(year=year)
    if class_name:
        query = query.filter_by(class_name=class_name)

    results = query.order_by(Result.year.desc()).all()
    return jsonify([
        {
            "id": r.id,
            "student_name": r.student_name,
            "class_name": r.class_name,
            "year": r.year,
            "score": r.score,
            "pdf_url": r.pdf_url
        } for r in results
    ])


# Get single result by ID
@bp.route('/<int:result_id>', methods=['GET'])
def get_result(result_id):
    result = Result.query.get(result_id)
    if not result:
        return jsonify({"error": "Result not found"}), 404

    return jsonify({
        "id": result.id,
        "student_name": result.student_name,
        "class_name": result.class_name,
        "year": result.year,
        "score": result.score,
        "pdf_url": result.pdf_url
    })


# ---------------------------
# Admin Endpoints
# ---------------------------

# Create result
@bp.route('/', methods=['POST'])
@admin_required
def create_result():
    student_name = request.form.get('student_name')
    class_name = request.form.get('class_name')
    year = request.form.get('year')
    score = request.form.get('score')

    file = request.files.get('pdf')
    pdf_url = None

    if file and allowed_pdf(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'results')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        pdf_url = f"/static/results/{filename}"

    new_result = Result(
        student_name=student_name,
        class_name=class_name,
        year=year,
        score=score,
        pdf_url=pdf_url
    )
    db.session.add(new_result)
    db.session.commit()

    return jsonify({"message": "Result created successfully", "result_id": new_result.id}), 201


# Update result
@bp.route('/<int:result_id>', methods=['PUT'])
@admin_required
def update_result(result_id):
    result = Result.query.get(result_id)
    if not result:
        return jsonify({"error": "Result not found"}), 404

    student_name = request.form.get('student_name', result.student_name)
    class_name = request.form.get('class_name', result.class_name)
    year = request.form.get('year', result.year)
    score = request.form.get('score', result.score)

    file = request.files.get('pdf')
    if file and allowed_pdf(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'results')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        result.pdf_url = f"/static/results/{filename}"

    result.student_name = student_name
    result.class_name = class_name
    result.year = year
    result.score = score

    db.session.commit()
    return jsonify({"message": "Result updated successfully"})


# Delete result
@bp.route('/<int:result_id>', methods=['DELETE'])
@admin_required
def delete_result(result_id):
    result = Result.query.get(result_id)
    if not result:
        return jsonify({"error": "Result not found"}), 404

    db.session.delete(result)
    db.session.commit()
    return jsonify({"message": "Result deleted successfully"})


# Bulk update PDFs by year or class_name
@bp.route('/bulk-update', methods=['PUT'])
@admin_required
def bulk_update_pdfs():
    year = request.form.get('year')
    class_name = request.form.get('class_name')
    file = request.files.get('pdf')

    if not file or not allowed_pdf(file.filename):
        return jsonify({"error": "A valid PDF file is required"}), 400

    if not year and not class_name:
        return jsonify({"error": "Please provide at least year or class_name for filtering"}), 400

    # Build query dynamically
    query = Result.query
    if year:
        query = query.filter_by(year=year)
    if class_name:
        query = query.filter_by(class_name=class_name)

    results = query.all()

    if not results:
        return jsonify({"error": "No matching results found"}), 404

    # Save the new PDF file once
    filename = secure_filename(file.filename)
    upload_path = os.path.join(current_app.root_path, 'static', 'results')
    os.makedirs(upload_path, exist_ok=True)
    file_path = os.path.join(upload_path, filename)
    file.save(file_path)
    pdf_url = f"/static/results/{filename}"

    # Update all matching results
    for result in results:
        result.pdf_url = pdf_url

    db.session.commit()
    return jsonify({
        "message": f"PDF updated for {len(results)} result(s)",
        "pdf_url": pdf_url
    })
