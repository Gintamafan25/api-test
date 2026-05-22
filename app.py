from flask import Flask,render_template, jsonify
import requests

app = Flask(__name__)

url = 'https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=tech'
url2 = "https://dashboard.elering.ee/api/nps/price/EE/current"
url3 = "https://official-joke-api.appspot.com/random_joke"

url_list = [url,url2,url3]
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/books")
def get_books():
   
    response = requests.get(url2)

    if response.status_code != 200:
        print(response.status_code)
        print(response.text)
        return jsonify({"error": "API failed"}), 500
    data = response.json()
    return jsonify(data)

@app.route("/api/list")
def get_list():
    return jsonify(url_list)
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)