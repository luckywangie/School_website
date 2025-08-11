# seed.py
import os
from datetime import datetime, timedelta
from faker import Faker
from app import create_app, db
from models import Admin, News, Gallery, Department, Staff, Tender, Result, ContactMessage

fake = Faker()

app = create_app()

def seed_admins():
    print("Seeding Admins...")
    super_admin = Admin(
        name="Super Admin",
        email="superadmin@example.com",
        role="super_admin",
        is_active=True
    )
    super_admin.set_password("supersecret")
    db.session.add(super_admin)

    admin = Admin(
        name="Regular Admin",
        email="admin@example.com",
        role="admin",
        is_active=True
    )
    admin.set_password("adminpass")
    db.session.add(admin)

def seed_news():
    print("Seeding News...")
    for _ in range(5):
        news = News(
            title=fake.sentence(nb_words=6),
            description=fake.paragraph(),
            content=fake.text(max_nb_chars=500),
            image_url="/static/images/placeholder.png"
        )
        db.session.add(news)

def seed_gallery():
    print("Seeding Gallery...")
    for _ in range(5):
        gallery_item = Gallery(
            title=fake.sentence(nb_words=3),
            image_url="/static/images/placeholder.png"
        )
        db.session.add(gallery_item)

def seed_departments_and_staff():
    print("Seeding Departments and Staff...")

    # Create specific departments for better filtering
    teaching_dept = Department(
        name="Teaching Department",
        description="Handles all academic teaching duties.",
        image_url="/static/images/placeholder.png"
    )
    support_dept = Department(
        name="Support Department",
        description="Provides administrative and operational support.",
        image_url="/static/images/placeholder.png"
    )
    admin_dept = Department(
        name="Administration Department",
        description="Oversees school operations and policies.",
        image_url="/static/images/placeholder.png"
    )

    db.session.add_all([teaching_dept, support_dept, admin_dept])
    db.session.flush()  # Get IDs without committing yet

    # Teaching Staff
    for _ in range(3):
        staff_member = Staff(
            name=fake.name(),
            title="Teacher",
            bio=fake.text(),
            department_id=teaching_dept.id,
            photo_url="/static/images/placeholder.png"
        )
        db.session.add(staff_member)

    # Support Staff
    for _ in range(3):
        staff_member = Staff(
            name=fake.name(),
            title="Support Staff",
            bio=fake.text(),
            department_id=support_dept.id,
            photo_url="/static/images/placeholder.png"
        )
        db.session.add(staff_member)

    # Admin Staff
    for _ in range(3):
        staff_member = Staff(
            name=fake.name(),
            title="Admin Officer",
            bio=fake.text(),
            department_id=admin_dept.id,
            photo_url="/static/images/placeholder.png"
        )
        db.session.add(staff_member)

def seed_tenders():
    print("Seeding Tenders...")
    for _ in range(3):
        tender = Tender(
            title=fake.sentence(nb_words=4),
            description=fake.text(),
            image_url="/static/images/placeholder.png",
            deadline=datetime.utcnow() + timedelta(days=30),
            document_url="/uploads/pdfs/sample.pdf"
        )
        db.session.add(tender)

def seed_results():
    print("Seeding Results...")
    for _ in range(3):
        result = Result(
            student_name=fake.name(),
            class_name=f"Class {fake.random_int(min=1, max=12)}",
            year=2024,
            description=fake.text(),
            image_url="/static/images/placeholder.png",
            pdf_url="/uploads/pdfs/result.pdf"
        )
        db.session.add(result)

def seed_contact_messages():
    print("Seeding Contact Messages...")
    for _ in range(5):
        msg = ContactMessage(
            name=fake.name(),
            email=fake.email(),
            subject=fake.sentence(nb_words=5),
            message=fake.text()
        )
        db.session.add(msg)

if __name__ == "__main__":
    with app.app_context():
        print("Dropping all tables...")
        db.drop_all()
        print("Creating tables...")
        db.create_all()

        seed_admins()
        seed_news()
        seed_gallery()
        seed_departments_and_staff()
        seed_tenders()
        seed_results()
        seed_contact_messages()

        db.session.commit()
        print("✅ Database seeded successfully!")
