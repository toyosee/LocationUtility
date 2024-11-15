UTILITY LOCATION TOOL

This is a web application that allows users to search for weather information, near by p;llaces like; banks, police stations, gas stations, hhospitals..... based on a location (city, zip code, or coordinates). It fetches real-time weather data from the OpenWeather API and displays key information such as temperature, humidity, wind speed, and more. It also includes nearby places, such as hospitals, police stations, and gas stations.
Features

    Search by location: Enter a location (city, zip code, or coordinates) to map information.
    Weather Details: Displays temperature, feels-like temperature, weather conditions, humidity, wind speed, cloudiness, and pressure.
    Nearby Places: Fetches nearby hospitals, police stations, gas stations, and banks using the location.
    Sunrise and Sunset Times: Shows the time of sunrise and sunset based on the location.
    Current Date: The current date is displayed, either from the API or generated on the backend if not available in the response.

Technologies Used

    Frontend: React.js, Bootstrap 5
    Backend: Flask, Python
    Weather API: OpenWeather API
    Location-based API: Google API for fetching nearby places
    Styling: Modern responsive UI using Bootstrap

Requirements

    Python 3.6+
    Node.js (for React frontend)
    Flask
    Axios (for making HTTP requests)
    OpenWeather API Key (sign up on OpenWeather to get the API key)
    Google API

Setup
Backend (Flask)

    Install dependencies:

pip install -r requirements.txt

Create a .env file in the root directory to store your API keys:

WEATHER_API_KEY=your_api_key_here

Run the Flask app:

    python app.py

    The backend will run on http://127.0.0.1:5000/.

Frontend (React)

    Install Node.js dependencies:

npm install

Run the React development server:

    npm start

    The React frontend will run on http://localhost:3000/.

API Endpoints
/get-location
Fetches location based on country name, location name or zip and updates map


/get-weather

Fetches weather information based on latitude and longitude.

    Request: GET /get-weather?latitude={latitude}&longitude={longitude}
    Response:

    {
      "current_date": "2024-11-14T12:34:56.000000",
      "weather": [
        {
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "main": {
        "temp": 23.5,
        "feels_like": 22.1,
        "humidity": 60,
        "pressure": 1012
      },
      "wind": {
        "speed": 3.1
      },
      "clouds": {
        "all": 0
      },
      "sys": {
        "sunrise": 1605230400,
        "sunset": 1605273600
      }
    }

/nearby-places

Fetches nearby places (hospitals, police stations, gas stations, etc.) based on latitude and longitude.

    Request: GET /nearby-places?latitude={latitude}&longitude={longitude}&place_type={place_type}
    Response:

    {
      "places": [
        {
          "name": "Some Hospital",
          "vicinity": "123 Main Street",
          "rating": 4.5
        },
        {
          "name": "Local Police Station",
          "vicinity": "456 Elm Street",
          "rating": 4.0
        }
      ]
    }

Example Usage

    Enter a Location: You can enter a city name, zip code, or use latitude and longitude.
    View Info: Once the location is found, the app will display the location details on the map.
    Weather Info: The display weather button will display weather of the found location, including temperature, conditions, and other relevant information.
    Get Nearby Places: You can click buttons to fetch nearby places like hospitals, police stations, gas stations, and banks.
    Sunrise & Sunset: The app also shows the time of sunrise and sunset for the given location.


Error Handling

    If the location is invalid or the API call fails, the application will show an error message and request the user to try again with a valid location.
    If there’s an issue fetching weather or nearby places, a generic error message will be displayed.

Future Improvements

    Add a more detailed weather forecast (e.g., hourly forecast).
    Integrate with more APIs to fetch additional place types.
    Allow users to save favorite locations.

License

This project is licensed under the MIT License - see the LICENSE file for details.