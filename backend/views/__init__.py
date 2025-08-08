# views/__init__.py
def register_blueprints(app):
    from .auth import auth_bp
    from .news import news_bp
    from .gallery import gallery_bp
    from .department import department_bp
    from .staff import staff_bp
    from .tender import tender_bp
    from .result import result_bp
    from .contact import contact_bp
    from .public import public_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(news_bp)
    app.register_blueprint(gallery_bp)
    app.register_blueprint(department_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(tender_bp)
    app.register_blueprint(result_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(public_bp)
