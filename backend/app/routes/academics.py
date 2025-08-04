import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app.models import Department, Staff
from app import db
from app.utils.auth import admin_required

bp = Blueprint('academics', __name__, url_prefix='/api/academics')

# Allowed image types
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------------------
# Public Endpoints
# ---------------------------

# Get all departments with staff
@bp.route('/departments', methods=['GET'])
def get_departments():
    departments = Department.query.all()
    return jsonify([
        {
            "id": d.id,
            "name": d.name,
            "description": d.description,
            "image_url": d.image_url,
            "head_id": d.head_id,
            "staff": [
                {
                    "id": s.id,
                    "name": s.name,
                    "title": s.title,
                    "bio": s.bio,
                    "photo_url": s.photo_url
                } for s in Staff.query.filter_by(department_id=d.id).all()
            ]
        } for d in departments
    ])


# Get single department with staff
@bp.route('/departments/<int:dept_id>', methods=['GET'])
def get_department(dept_id):
    department = Department.query.get(dept_id)
    if not department:
        return jsonify({"error": "Department not found"}), 404

    staff_members = Staff.query.filter_by(department_id=dept_id).all()
    return jsonify({
        "id": department.id,
        "name": department.name,
        "description": department.description,
        "image_url": department.image_url,
        "head_id": department.head_id,
        "staff": [
            {
                "id": s.id,
                "name": s.name,
                "title": s.title,
                "bio": s.bio,
                "photo_url": s.photo_url
            } for s in staff_members
        ]
    })


# ---------------------------
# Admin Endpoints (Departments)
# ---------------------------

# Create department
@bp.route('/departments', methods=['POST'])
@admin_required
def create_department():
    name = request.form.get('name')
    description = request.form.get('description')
    head_id = request.form.get('head_id')

    file = request.files.get('image')
    image_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'departments')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        image_url = f"/static/departments/{filename}"

    new_department = Department(name=name, description=description, image_url=image_url, head_id=head_id)
    db.session.add(new_department)
    db.session.commit()

    return jsonify({"message": "Department created successfully", "department_id": new_department.id}), 201


# Update department
@bp.route('/departments/<int:dept_id>', methods=['PUT'])
@admin_required
def update_department(dept_id):
    department = Department.query.get(dept_id)
    if not department:
        return jsonify({"error": "Department not found"}), 404

    name = request.form.get('name', department.name)
    description = request.form.get('description', department.description)
    head_id = request.form.get('head_id', department.head_id)

    file = request.files.get('image')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'departments')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        department.image_url = f"/static/departments/{filename}"

    department.name = name
    department.description = description
    department.head_id = head_id

    db.session.commit()
    return jsonify({"message": "Department updated successfully"})


# Delete department
@bp.route('/departments/<int:dept_id>', methods=['DELETE'])
@admin_required
def delete_department(dept_id):
    department = Department.query.get(dept_id)
    if not department:
        return jsonify({"error": "Department not found"}), 404

    db.session.delete(department)
    db.session.commit()
    return jsonify({"message": "Department deleted successfully"})


# ---------------------------
# Admin Endpoints (Staff)
# ---------------------------

# Create staff
@bp.route('/staff', methods=['POST'])
@admin_required
def create_staff():
    name = request.form.get('name')
    title = request.form.get('title')
    bio = request.form.get('bio')
    department_id = request.form.get('department_id')

    file = request.files.get('photo')
    photo_url = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'staff')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        photo_url = f"/static/staff/{filename}"

    new_staff = Staff(name=name, title=title, bio=bio, photo_url=photo_url, department_id=department_id)
    db.session.add(new_staff)
    db.session.commit()

    return jsonify({"message": "Staff member created successfully", "staff_id": new_staff.id}), 201


# Update staff
@bp.route('/staff/<int:staff_id>', methods=['PUT'])
@admin_required
def update_staff(staff_id):
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Staff member not found"}), 404

    name = request.form.get('name', staff.name)
    title = request.form.get('title', staff.title)
    bio = request.form.get('bio', staff.bio)
    department_id = request.form.get('department_id', staff.department_id)

    file = request.files.get('photo')
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(current_app.root_path, 'static', 'staff')
        os.makedirs(upload_path, exist_ok=True)
        file.save(os.path.join(upload_path, filename))
        staff.photo_url = f"/static/staff/{filename}"

    staff.name = name
    staff.title = title
    staff.bio = bio
    staff.department_id = department_id

    db.session.commit()
    return jsonify({"message": "Staff member updated successfully"})


# Delete staff
@bp.route('/staff/<int:staff_id>', methods=['DELETE'])
@admin_required
def delete_staff(staff_id):
    staff = Staff.query.get(staff_id)
    if not staff:
        return jsonify({"error": "Staff member not found"}), 404

    db.session.delete(staff)
    db.session.commit()
    return jsonify({"message": "Staff member deleted successfully"})
