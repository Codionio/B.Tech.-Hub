import os
import requests
import json
import re
import google.generativeai as genai
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
        
        api_url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-latest:generateContent'
        
        # --- THIS IS THE UPDATED PART ---
        train_data = """
I am Vac 🔥, a concise AI assistant for B.Tech Hub. Created by Sahil Sharma.

Everthing about Sahil Sharma:{
Sahil Sharma is a B.Tech Computer Science (AI & Machine Learning) student working in building something that will impact the lifes of many people and he is the feature founder and vac is one his creations he is passionate web developer and a current 2 year student at jssaten . He builds intelligent systems to solve real-world problems and is one of the pillar of Codion team. Connect with him on LinkedIn, GitHub, Twitter (X), and Instagram:

LinkedIn: https://www.linkedin.com/in/sahil-sharma-1a024b330?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app

GitHub: https://github.com/Sahil-coder-30

Twitter (X): https://x.com/SahilSharma_30?t=6e0SJFuJZcF1tASjjwUgHg&s=09

Instagram: https://www.instagram.com/sahil_sharma__30?igsh=MWVlNG9xYjZpY3hzYw==​
}

Instructions:
1. Keep responses short and direct
2. Use bullet points for lists
3. Avoid unnecessary explanations
4. Focus on providing immediate answers
5. Use simple language

Key Features:
• Syllabus: https://b-tech-hub.onrender.com/Syllabus
• SGPA Calculator: https://b-tech-hub.onrender.com/sgpa
• CGPA Calculator: https://b-tech-hub.onrender.com/cgpa
• Resources: https://b-tech-hub.onrender.com/resources
• University Info: https://b-tech-hub.onrender.com/links

When asked about general topics (math, science, etc.), provide brief, clear answers without lengthy explanations.
"""

        request_body = {
            "contents": [{
                "role": "user",
                "parts": [{"text": train_data}]
            }, {
                "role": "user",
                "parts": [{"text": user_input}]
            }]
        }

        response = requests.post(
            f"{api_url}?key={gemini_api_key}",
            headers={'Content-Type': 'application/json'},
            json=request_body
        )
        
        if response.status_code != 200:
            print("Gemini API Error Status Code:", response.status_code)
            print("Gemini API Error Response:", response.text)
            return jsonify({"error": f"Gemini API Error: {response.text}"}), response.status_code
        
        response_data = response.json()
        bot_response = response_data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'Sorry, I could not generate a response.')
        if not bot_response:
            print("Empty response from Gemini API")
            return jsonify({"error": "Empty response from API"}), 500
        
        return jsonify({"response": bot_response})
        
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500
    

# Configure the Gemini API client with the key from environment variables
try:
    genai.configure(api_key=os.environ["GOOGLE_API_KEY"])
except KeyError:
    raise RuntimeError("GOOGLE_API_KEY environment variable not set.")


@app.route('/quiz')
def quiz_page():
    # This route just serves the HTML page.
    # The page will then call the /api/generate-quiz endpoint.
    return render_template('quiz.html')


@app.route('/api/generate-quiz')
def generate_quiz():
    """
    API endpoint to generate questions from the AI and return as JSON.
    """
    try:
        # Initialize the model
        model = genai.GenerativeModel('gemini-1.5-flash-latest')

        # This is the crucial part: the prompt.
        # We tell the AI exactly what we want, including the JSON structure.
        prompt = """
        Generate a challenging 10-question multiple-choice quiz about advanced JavaScript.
        Topics should include closures, prototypes, async/await, the 'this' keyword, and ES6+ features.
        
        Please provide the output ONLY in a valid JSON array format. Each object in the array
        should have the following structure:
        {
          "question": "Your question here",
          "answers": [
            { "text": "Answer option 1", "correct": false },
            { "text": "Answer option 2", "correct": false },
            { "text": "The correct answer", "correct": true },
            { "text": "Answer option 4", "correct": false }
          ]
        }
        Ensure that exactly one answer has "correct": true for each question.
        Do not include any text, explanation, or markdown formatting before or after the JSON array.
        """

        # Make the API call
        response = model.generate_content(prompt)
        
        # Clean up the response from the AI. Sometimes it wraps it in ```json ... ```
        # This regex finds the content between the first '[' and the last ']'
        match = re.search(r'\[.*\]', response.text, re.DOTALL)
        if not match:
            raise ValueError("AI did not return valid JSON in the expected format.")
            
        json_text = match.group(0)
        
        # Parse the cleaned text into a Python list
        questions = json.loads(json_text)
        
        # Return the data as a JSON response
        return jsonify(questions)

    except Exception as e:
        print(f"An error occurred: {e}")
        # Return a server error response
        return jsonify({"error": "Failed to generate quiz questions."}), 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True)
