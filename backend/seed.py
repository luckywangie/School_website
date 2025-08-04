from app import create_app, db
from app.models import Admin, News, Tender, Department, Staff, Page, Gallery, Result, ContactMessage
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    # Drop all tables and recreate if you want a fresh start
    # db.drop_all()
    # db.create_all()

    # -------------------------
    # 1. Create Super Admin
    # -------------------------
    if not Admin.query.filter_by(email='admin@school.com').first():
        super_admin = Admin(
            name='Super Admin',
            email='admin@school.com',
            password_hash=generate_password_hash('admin123'),
            role='super_admin'
        )
        db.session.add(super_admin)
        print("✅ Super admin created: admin@school.com / admin123")
    else:
        print("ℹ️ Super admin already exists")

    # -------------------------
    # 2. Sample Pages
    # -------------------------
    if Page.query.count() == 0:
        pages = [
            Page(page_name="About", content="Welcome to our school."),
            Page(page_name="Admissions", content="Admission details here."),
            Page(page_name="Academics", content="Our academic programs."),
            Page(page_name="Contact", content="Contact us for inquiries.")
        ]
        db.session.add_all(pages)
        print("✅ Sample pages created")

    # -------------------------
    # 3. Sample News
    # -------------------------
    if News.query.count() == 0:
        news_item = News(title="School Opening Ceremony", content="Our school opens on September 1st.", image_url="")
        db.session.add(news_item)
        print("✅ Sample news created")

    # -------------------------
    # 4. Sample Tenders
    # -------------------------
    if Tender.query.count() == 0:
        tender = Tender(
            title="Supply of Textbooks",
            description="We invite suppliers to bid for textbook supply.",
            deadline=datetime.utcnow() + timedelta(days=30),
            document_url=""
        )
        db.session.add(tender)
        print("✅ Sample tender created")

    # -------------------------
    # 5. Sample Department and Staff
    # -------------------------
    if Department.query.count() == 0:
        dept = Department(name="Science Department", description="Handles all science subjects.")
        db.session.add(dept)
        db.session.flush()  # Get department id for FK

        staff_member = Staff(name="Mr. John Doe", title="Head of Science", department_id=dept.id)
        db.session.add(staff_member)
        print("✅ Sample department and staff created")

    # -------------------------
    # 6. Sample Contact Message
    # -------------------------
    if ContactMessage.query.count() == 0:
        contact_msg = ContactMessage(name="Jane Doe", email="jane@example.com", subject="Inquiry", message="When are admissions?")
        db.session.add(contact_msg)
        print("✅ Sample contact message created")

    # -------------------------
    # 7. Commit all changes
    # -------------------------
    db.session.commit()
    print("🎉 Database seeding completed!")
