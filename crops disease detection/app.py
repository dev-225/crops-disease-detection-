# app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import random
import time
from data import DISEASE_INFO # data.py se database import hua

app = Flask(__name__)

CORS(app) 


def simulate_ai_prediction():
    """Simulates AI prediction logic."""
    
    time.sleep(2) 
    
    disease_keys = list(DISEASE_INFO.keys())
    
    predicted_key = random.choice(disease_keys)

    # Confidence score (70% se 95% ke beech)
    confidence = round(0.70 + random.random() * 0.25, 4) 
    
    result_data = DISEASE_INFO[predicted_key]
    
    # Return the data structure the frontend expects
    return {
        'disease_key': predicted_key,
        'confidence': confidence,
        'info': result_data
    }

def calculate_environmental_risk(temperature, humidity, rainfall):
    """Calculates the environmental risk score."""
    risk_score = 0
    
    # Simple Risk Logic (jo frontend code mein tha)
    if temperature > 30 or temperature < 15: risk_score += 30
    elif temperature > 28 or temperature < 18: risk_score += 15
        
    if humidity > 80: risk_score += 35
    elif humidity > 70: risk_score += 20
    elif humidity < 40: risk_score += 10
        
    if rainfall > 10: risk_score += 35
    elif rainfall > 5: risk_score += 15
        
    return min(risk_score, 100)

# --- API Endpoints ---

@app.route('/api/predict_disease', methods=['POST'])
def predict_disease():
    """API endpoint for disease prediction based on image upload."""
    # Frontend se aane waale image file ko yahan handle kiya jaayega.
    # Hum sirf simulation chalaayenge.
    
    try:
        # request.files se image milegi, lekin hum skip kar rahe hain
        # image_file = request.files['image'] 
        
        prediction_result = simulate_ai_prediction()
        return jsonify(prediction_result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/calculate_risk', methods=['POST'])
def get_risk_score():
    """API endpoint for calculating environmental risk."""
    data = request.get_json()
    
    if not all(k in data for k in ('temperature', 'humidity', 'rainfall')):
        return jsonify({"error": "Missing environmental data"}), 400
        
    temp = int(data['temperature'])
    humidity = int(data['humidity'])
    rainfall = int(data['rainfall'])

    risk_score = calculate_environmental_risk(temp, humidity, rainfall)
    
    return jsonify({"risk_score": risk_score}), 200

# Server run karna
if __name__ == '__main__':
    print("🚀 Flask API Server running at http://127.0.0.1:5000")
    app.run(debug=True) # debug=True development ke liye