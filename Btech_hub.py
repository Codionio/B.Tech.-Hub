# https://codionio.github.io/B.Tech.-Hub/index.html

from flask import Flask , render_template

app = Flask(__name__)

@app.route("/")
def hello_world():
    return render_template ("index.html")
@app.route("/sgpa")
def services():
    return render_template("Sgpa.html")

@app.route("/Syllabus")
def contact():
    return render_template("Syllabus.html")

@app.route("/resources")
def about():
    return render_template("Resources.html")

app.run(debug = True)