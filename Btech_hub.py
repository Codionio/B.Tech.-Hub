import os
import requests
from flask import Flask, render_template, request, redirect, flash
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message 
from flask import jsonify, session
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Print environment variables for debugging
print("GEMINI_API_KEY:", os.environ.get('GEMINI_API_KEY'))

app = Flask(__name__ , static_folder='static')
CORS(app)  # Enable CORS for all routes


# --- Mail Config ---
app.config['SECRET_KEY'] = '963cc51af6cf31cc7878b02add4c6ac9'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'codion.io.in@gmail.com'
app.config['MAIL_PASSWORD'] = 'odgn tgyy gbur srsn' 
app.config['MAIL_DEFAULT_SENDER'] = 'codion.io.in@gmail.com'

mail = Mail(app)

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

@app.route("/cgpa")
def cgpa_calculator():
    return render_template("cgpa.html")

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

# @app.route("/contact", methods=["GET", "POST"])
# def contact():
#     if request.method == "POST":
#         name = request.form.get("name")
#         email = request.form.get("email")
#         message = request.form.get("message")
#         # TODO: Store or email the message
#         flash("Your message has been sent successfully!", "success")
#         return redirect("/contact")
#     return render_template("contact.html")

@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
    
        try:
            # Email send karein
            msg = Message(
                subject=f"New Contact Form Submission - {name}",
                recipients=["codion.io.in@gmail.com"],  # jaha receive karna hai
                body=f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}",
                sender=app.config['MAIL_USERNAME'] 
            )
            mail.send(msg)
            print(name,email,message,"name")

            flash("Your message has been sent successfully!", "success")
        except Exception as e:
            print("Error sending email:", e)  # Debugging ke liye console me print hoga
            flash("There was an error sending your message. Please try again later.", "danger")

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

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/get-flash-messages")
def get_flash_messages():
    # Get the messages from the session
    messages = session.get('_flashes', [])
    
    # Clear the messages from the session so they don't appear again
    session.pop('_flashes', None)
    
    # Return the messages as JSON
    return jsonify(messages)

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

@app.route("/api/get_messages")
def get_messages():
    """
    This provides any flashed messages as JSON data.
    """
    # Get the messages that were 'flashed' in the session
    messages = session.get('_flashes', [])
    
    # IMPORTANT: Clear the messages from the session so they don't show up again
    session.pop('_flashes', None)
    
    # Return the data in a format JavaScript can understand
    return jsonify(messages=messages)

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

# --- NEW: Secure Gemini API endpoint ---

    # --- NEW: Secure Gemini API endpoint ---
@app.route("/api/chat", methods=["POST"])
def chat_endpoint():
    try:
        data = request.get_json()
        user_input = data.get('input', '')
        
        if not user_input:
            return jsonify({"error": "No input provided"}), 400
        
        gemini_api_key = os.environ.get('GEMINI_API_KEY', None)
        if not gemini_api_key:
            return jsonify({"error": "API key not configured"}), 500
        
        api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
        
        # --- THIS IS THE UPDATED PART ---
        train_data = """
Your name is Vac 🔥. You are a helpful and highly structured AI assistant for the B.tech hub application. Your creator is Sahil Sharma. The meaning of your name is the Vedic goddess of speech.

## Core Instructions ##
1.  **Prioritize B.Tech Hub Information**: If the user's question is about the B.Tech Hub website, its features (Syllabus, SGPA, CGPA), or its creators, you MUST prioritize the information provided below under "B.Tech Hub Website Information."
2.  **Use General Knowledge for Other Topics**: For all other general questions (e.g., "what is the capital of France?", "explain quantum computing," math problems), answer them using your own extensive knowledge.
3.  **MANDATORY: Use Markdown for Formatting**: Always structure your answers for clarity using Markdown. This is crucial.
    * Use headings (`## Title`) for main topics.
    * Use bold text (`**important**`) for emphasis and keywords.
    * Use bullet points (`* item`) or numbered lists (`1. item`) for lists.
    * Use code blocks (```python\nprint("hello")\n```) for any code snippets.
    * Be helpful, professional, and clear in your responses.
4.  **Ensure Readability & Spacing**: This is critical. Use generous whitespace to make your answers easy to read.
    * **ALWAYS** add a blank line between paragraphs, headings, lists, and other distinct elements.
    * Break down long, dense blocks of text into smaller, more digestible paragraphs.

## B.Tech Hub Website Information ##

### Home Page (Welcome Mat) ###
Link: https://b-tech-hub.onrender.com/
The homepage is the front door. It has a welcome message and buttons that lead to other sections like "Syllabus" and "SGPA Calculator."

### Syllabus (Treasure Map) ###
Link: https://b-tech-hub.onrender.com/Syllabus
This section shows a list of all subjects and topics for each school term (semester). You find your grade or year to see the subjects you'll be studying.

### SGPA Calculator (Report Card Helper) ###
Link: https://b-tech-hub.onrender.com/sgpa
This tool calculates your score for one term (SGPA). You enter the grade you got for each subject, and it instantly shows your final score for that term.

### CGPA Calculator (All-Time High Score) ###
Link: https://b-tech-hub.onrender.com/cgpa
This calculates your all-time high score (CGPA) by adding up scores from all the terms you've finished so far.

### University Info (Rulebook Room) ###
Link: https://b-tech-hub.onrender.com/links
This section contains important university rules and information, like the credit system. It specifically mentions AKTU regulations.

### Resources (Secret Toolkit) ###
Link: https://b-tech-hub.onrender.com/resources
This is a digital library with helpful notes, guides, and tools to make learning easier.

### About (Meet the Builders) ###
Link: https://codionio.github.io/Devs-Codion/
This link leads to a page about the development team that built the website, called "Codion."
"""

        request_body = {
            "contents": [{"parts": [{"text": user_input}]}],
            "systemInstruction": {
                "parts": [{
                    "text": train_data
                }]
            }
        }

        response = requests.post(
            f"{api_url}?key={gemini_api_key}",
            headers={'Content-Type': 'application/json'},
            json=request_body
        )
        
        if response.status_code != 200:
            print("Gemini API Error:", response.text) # Added for better debugging
            return jsonify({"error": "Failed to get response from Gemini API"}), 500
        
        response_data = response.json()
        bot_response = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Sorry, I could not generate a response.')
        
        return jsonify({"response": bot_response})
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True)
