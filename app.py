from flask import Flask,render_template, jsonify, json, request
import requests
import os
import csv
from datetime import datetime
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
url = 'https://api.freeapi.app/api/v1/public/books?page=1&limit=10&inc=kind%2Cid%2Cetag%2CvolumeInfo&query=tech'
url2 = "https://dashboard.elering.ee/api/nps/price/EE/current"
url3 = "https://official-joke-api.appspot.com/random_joke"

linear_regression_data = []


all_nasdaq_dict = {}

def average_model(data, total):
    next_set = []
    next_point = 0
    for i in range(total):
        average = 0
        for point in data:
            average += point
        print(average)
        print(len(data))
        next_point = round(average / len(data), 2)
        next_set.append(next_point)
        data.append(next_point)
    
    return next_set

def linear_regression_model(data, total):
   

    sumX = 0
    sumY = 0
    sumXY = 0
    sumX2 = 0
    n = len(data)

    for i in range(len(data)):
        x = i
        y = data[i]

        sumX += x
        sumY += y 
        sumXY += x * y
        sumX2 += x * x
    
    denom = (n * sumX2 - sumX ** 2)
    if denom == 0:
        raise ValueError("Cannot compute, all x values are the same")

    m = (n * sumXY - sumX * sumY) / denom
    b = (sumY - m * sumX) / n

    predictions = []

    for k in range(1, total+1):
        result = round(m * (n + k) + b, 2)
        predictions.append(result)
    return predictions

with open(".gitignore/nasdaq_data.json", "r") as f:
    all_nasdaq_dict = json.load(f)

@app.route("/financial_data")
def get_finance_data():
    return jsonify(dict(list(all_nasdaq_dict.items())[:4]))

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


@app.route("/predict", methods=["POST"])
def compute():
    print("posting data")
    range_data = request.get_json()
    global linear_regression_data
    linear_regression_data = linear_regression_model(range_data["data"], range_data["periods"])
    
    return jsonify({"status": "ok"})

@app.route("/prediction_data")
def return_data():
    
    return jsonify(linear_regression_data)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
   