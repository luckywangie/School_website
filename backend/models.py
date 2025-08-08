from app import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

# -------------------------
# Admin Model
# -------------------------
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default='admin')  # 'admin', 'super_admin'
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @property
    def is_admin(self):
        return self.role in ['admin', 'super_admin']

    @property
    def is_super_admin(self):
        return self.role == 'super_admin'

    def __repr__(self):
        return f"<Admin {self.email}>"

# -------------------------
# News Model
# -------------------------
class News(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    content = db.Column(db.Text)
    image_url = db.Column(db.String(255), default="/static/images/placeholder.png")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# -------------------------
# Gallery Model
# -------------------------
class Gallery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    image_url = db.Column(db.String(255), default="/static/images/placeholder.png")
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

# -------------------------
# Department Model
# -------------------------
class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255), default="/static/images/placeholder.png")

    # Head of department → staff.id
    head_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=True)

    # Relationship to staff, explicitly tell SQLAlchemy which FK to use
    staff_members = db.relationship(
        'Staff',
        backref='department',
        lazy=True,
        foreign_keys='Staff.department_id'
    )

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# -------------------------
# Staff Model
# -------------------------
class Staff(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    title = db.Column(db.String(100))
    bio = db.Column(db.Text)
    photo_url = db.Column(db.String(255), default="/static/images/placeholder.png")

    # Staff belongs to a department
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=True)

    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# -------------------------
# Tender Model
# -------------------------
class Tender(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    image_url = db.Column(db.String(255), default="/static/images/placeholder.png")
    deadline = db.Column(db.DateTime)
    document_url = db.Column(db.String(255))  # PDF path
    date_posted = db.Column(db.DateTime, default=datetime.utcnow)

# -------------------------
# Results Model
# -------------------------
class Result(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_name = db.Column(db.String(100))
    class_name = db.Column(db.String(50))
    year = db.Column(db.Integer)
    description = db.Column(db.Text)  # About this result
    image_url = db.Column(db.String(255), default="/static/images/placeholder.png")
    pdf_url = db.Column(db.String(255))  # PDF path
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)

# -------------------------
# Contact Messages
# -------------------------
class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
