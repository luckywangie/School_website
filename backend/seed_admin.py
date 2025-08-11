#!/usr/bin/env python3
"""
Script to create initial admin users
Usage: python seed_admin.py
"""

import os
import sys
from app import create_app, db
from models import Admin

def create_admin():
    """Create initial admin users"""
    
    # Check if admin already exists
    existing_admin = Admin.query.filter_by(email="admin@school.com").first()
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create super admin
    super_admin = Admin(
        name="Super Admin",
        email="admin@school.com",
        role="super_admin"
    )
    super_admin.set_password("admin123")
    
    # Create regular admin
    regular_admin = Admin(
        name="School Admin",
        email="school@admin.com",
        role="admin"
    )
    regular_admin.set_password("admin123")
    
    db.session.add(super_admin)
    db.session.add(regular_admin)
    db.session.commit()
    
    print("✅ Admin users created successfully!")
    print("Super Admin: admin@school.com / admin123")
    print("Regular Admin: school@admin.com / admin123")

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        create_admin()
