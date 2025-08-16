import os
from flask import Flask, render_template, request, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__ , static_folder='static')

# ---Database Configuration---
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL','sqlite:///visitors.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ---Database Model---
class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    count = db.Column(db.Integer, default=0)

@app.route("/")
def home():
    return render_template ("index.html")
    
@app.route("/sgpa")
def services():
    return render_template("Sgpa.html")

@app.route("/Syllabus")
def syllabus():
    return render_template("Syllabus.html")

@app.route("/resources")
def resource():
    return render_template("Resources.html")

@app.route("/links")
def link():
    return render_template("links.html")

@app.route("/overview")
def overview():
    return render_template("overview.html")

@app.route("/solution")
def solution():
    return render_template("solution.html")

@app.route("/pricing")
def pricing():
    return render_template("pricing.html")

@app.route("/customer")
def customer():
    return render_template("customer.html")

@app.route("/investor-relations")
def investor_relations():
    return render_template("investor_relations.html")

@app.route("/press")
def press():
    return render_template("press.html")

@app.route("/blogs")
def blogs():
    return render_template("blogs.html")

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        # TODO: Store or email the message
        flash("Your message has been sent successfully!", "success")
        return redirect("/contact")
    return render_template("contact.html")

@app.route("/documentation")
def documentation():
    return render_template("documentation.html")

@app.route("/chat")
def chat():
    return render_template("chat.html")

@app.route("/faq")
def faq():
    return render_template("faq.html")

@app.route("/terms-of-service")
def terms_of_service():
    return render_template("terms_of_service.html")

@app.route("/privacy-policy")
def privacy_policy():
    return render_template("privacy_policy.html")

@app.route("/cookie-settings")
def cookie_settings():
    return render_template("cookie_settings.html")

# --- THIS IS THE NEW, SECRET ROUTE FOR DATABASE SETUP ---
@app.route("/init-database-first-time-only")
def init_db():
    with app.app_context():
        db.create_all()
        # Check if the counter record exists, if not, create it.
        visitor_record = db.session.get(Visitor, 1)
        if not visitor_record:
            visitor_record = Visitor(id=1, count=0)
            db.session.add(visitor_record)
            db.session.commit()
    return "Database has been initialized successfully!"

# ---API Route for visitor Count---

@app.route("/api/visitor_count")
def visitor_count():
    visitor_record = db.session.get(Visitor, 1)
    if not visitor_record:
        # If the table exists but the record is missing, this is a fallback.
        return {"count": "N/A - DB not initialized"}

    if os.environ.get('FLASK_ENV') == 'production':
        visitor_record.count += 1
        db.session.commit()
    
    return {"count": visitor_record.count}


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
