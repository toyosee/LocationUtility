from flask import Flask, request, jsonify
import requests
from datetime import datetime
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Use OpenCage Geocoding API with an API key
GEOCODING_API_KEY = os.getenv("OPENCAGE_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

# Getting Geocoding URLS
GEOCODING_API_URL = "https://api.opencagedata.com/geocode/v1/json"

@app.route('/get-location', methods=['GET'])
def get_location():
    location = request.args.get('location')
    if not location:
        return jsonify({'error': 'No location provided'}), 400

    params = {
        'q': location,
        'key': GEOCODING_API_KEY,
        'limit': 1
    }

    try:
        response = requests.get(GEOCODING_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Request error: {e}")
        return jsonify({'error': 'Error fetching data from the geocoding API'}), 500

    if data and data['results']:
        result = data['results'][0]
        print(result)
        location_info = {
            'latitude': result['geometry']['lat'],
            'longitude': result['geometry']['lng'],
            'country': result['components'].get('country'),
            'state': result['components'].get('state'),
            'city': result['components'].get('city'),
            'local_government_area': result['components'].get('county'),
            'ward': result['components'].get('suburb')
        }
        return jsonify(location_info)
    else:
        return jsonify({'error': 'Location not found'}), 404

    
@app.route('/nearby-places', methods=['GET'])
def get_nearby_places():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    place_type = request.args.get('place_type')  # hospital, police, etc.
    GOOGLE_PLACES_API_URL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    GOOGLE_PLACES_API_KEY = os.getenv("GOOGLE_PLACES_API_KEY")
    params = {
        'location': f"{latitude},{longitude}",
        'radius': 5000,
        'type': place_type,
        'key': GOOGLE_PLACES_API_KEY
    }
    print(f"Latitude: {latitude}, Longitude: {longitude}, Place Type: {place_type}")

    try:
        response = requests.get(GOOGLE_PLACES_API_URL, params=params)
        response.raise_for_status()
        data = response.json()
        print("Response: ", data)
        places = [{'name': place['name']} for place in data.get('results', [])]
        return jsonify({'places': places})
    except requests.exceptions.RequestException as e:
        print(f"Error fetching {place_type} data: {e}")
        return jsonify({'error': f"Unable to fetch {place_type} data"}), 500



@app.route('/get-weather', methods=['GET'])
def get_weather():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    if not latitude or not longitude:
        return jsonify({'error': 'Latitude and longitude are required parameters'}), 400

    try:
        WEATHER_API_URL = "http://api.openweathermap.org/data/2.5/weather"
        params = {
            'lat': latitude,
            'lon': longitude,
            'appid': WEATHER_API_KEY,
            'units': 'metric'
        }

        # Make the API request
        response = requests.get(WEATHER_API_URL, params=params)
        response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)

        # Parse the response and return JSON
        weather_data = response.json()
        # Add current date if not available in the response
        weather_data['current_date'] = datetime.utcnow().isoformat()  # Use ISO 8601 format
        return jsonify(weather_data)

    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
        return jsonify({'error': 'HTTP error while fetching weather data'}), 500
    except requests.exceptions.ConnectionError as conn_err:
        print(f"Connection error occurred: {conn_err}")
        return jsonify({'error': 'Connection error while fetching weather data'}), 500
    except requests.exceptions.Timeout as timeout_err:
        print(f"Timeout error occurred: {timeout_err}")
        return jsonify({'error': 'Request timed out while fetching weather data'}), 500
    except requests.exceptions.RequestException as req_err:
        print(f"An error occurred: {req_err}")
        return jsonify({'error': 'An unexpected error occurred while fetching weather data'}), 500

if __name__ == '__main__':
    app.run(debug=True)
