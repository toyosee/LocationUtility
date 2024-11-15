import React, { useState } from 'react';
import axios from 'axios';
import MapComponent from './MapComponent';
import './App.css';

function App() {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState([51.505, -0.09]);
  const [locationInfo, setLocationInfo] = useState({});
  const [weather, setWeather] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get-location`, {
        params: { location },
      });

      if (response.data.latitude && response.data.longitude) {
        setCoordinates([parseFloat(response.data.latitude), parseFloat(response.data.longitude)]);
        setLocationInfo(response.data);
        setWeather(null);
        setResults([]);
        setError(null);
      } else {
        alert(response.data.error || 'Location not found');
      }
    } catch (error) {
      console.error('Error fetching location:', error);
      setError('Location not found.');
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/get-weather`, {
        params: {
          latitude: coordinates[0],
          longitude: coordinates[1],
        },
      });
      setWeather(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setError('Could not fetch weather information.');
    }
  };

  const fetchNearbyPlaces = async (placeType) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/nearby-places`, {
        params: {
          latitude: coordinates[0],
          longitude: coordinates[1],
          place_type: placeType,
        },
      });
      console.log('Nearby Places:', response.data); // Log the response
      setResults(response.data.places || []); // Ensure the data is an array
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${placeType}:`, error);
      setError(`Could not fetch ${placeType}.`);
    }
  };
  

  return (
    <div className="app-container bg-light py-4">
      <div className="container">
        <h2 className="text-center text-secondary mb-4">Location Finder</h2>

        <div className="search-box mb-4 d-flex justify-content-center">
          <input
            type="text"
            className="form-control me-2"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location, zip code, country, or state"
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="action-buttons mb-4 d-flex justify-content-center flex-wrap gap-2">
          <button className="btn btn-info" onClick={fetchWeather}>Get Weather</button>
          <button className="btn btn-info" onClick={() => fetchNearbyPlaces('hospital')}>Nearby Hospitals</button>
          <button className="btn btn-info" onClick={() => fetchNearbyPlaces('police')}>Police Stations</button>
          <button className="btn btn-info" onClick={() => fetchNearbyPlaces('gas_station')}>Gas Stations</button>
          <button className="btn btn-info" onClick={() => fetchNearbyPlaces('bank')}>Banks/ATMs</button>
        </div>

        <div className="map-container mb-4">
          <MapComponent coordinates={coordinates} />
        </div>

        {locationInfo && Object.keys(locationInfo).length > 0 && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Location Details</h5>
              <div className="row">
                <div className="col-md-6">
                  <p><strong>Country:</strong> {locationInfo.country}</p>
                  <p><strong>State:</strong> {locationInfo.state}</p>
                  <p><strong>City:</strong> {locationInfo.city}</p>
                </div>
                <div className="col-md-6">
                  <p><strong>LGA:</strong> {locationInfo.local_government_area}</p>
                  <p><strong>Latitude:</strong> {locationInfo.latitude}</p>
                  <p><strong>Longitude:</strong> {locationInfo.longitude}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {weather && (
          <div className="card mb-4 shadow">
            <div className="card-body">
              <h5 className="card-title text-center">Weather Information - <strong>{new Date(weather.current_date).toLocaleDateString()}</strong></h5>
              <div className="text-center mb-3">
                <img
                  src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                  className="img-fluid"
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
              <div className="row text-center">
                <div className="col-md-4 mb-3">
                  <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
                  <p><strong>Feels Like:</strong> {weather.main.feels_like}°C</p>
                  <p><strong>Conditions:</strong> {weather.weather[0].description}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
                  <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
                  <p><strong>Cloudiness:</strong> {weather.clouds.all}%</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
                  <p><strong>Sunrise:</strong> {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
                  <p><strong>Sunset:</strong> {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}


        {results.length > 0 && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Nearby Places</h5>
              <ul className="list-group">
                {results.map((place, index) => (
                  <li key={index} className="list-group-item">
                    <div><strong>Name:</strong> {place.name || 'N/A'}</div>
                    {place.vicinity && <div><strong>Address:</strong> {place.vicinity}</div>}
                    {place.rating && <div><strong>Rating:</strong> {place.rating}</div>}
                    {place.types && <div><strong>Types:</strong> {place.types.join(', ')}</div>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}


        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
