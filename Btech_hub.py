# https://codionio.github.io/B.Tech.-Hub/index.html

from flask import Flask , render_template

app = Flask(__name__ , static_folder='static')

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




if __name__ == "__main__":
    app.run()
