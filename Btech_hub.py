# https://codionio.github.io/B.Tech.-Hub/index.html

# from flask import Flask , render_template
from flask import Flask, render_template, request, redirect, flash

app = Flask(__name__ , static_folder='static')

app.secret_key = "your_secret_key"

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





if __name__ == "__main__":
    app.run()
