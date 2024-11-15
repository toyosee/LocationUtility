import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom icons
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ coordinates, liveCoordinates }) => {
  const [zoom, setZoom] = useState(13);

  // Custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'), // Use the default marker icon
    iconSize: [25, 41], // Icon size
    iconAnchor: [12, 41], // Anchor point of the icon
    popupAnchor: [1, -34], // Popup anchor position
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'), // Optional shadow
    shadowSize: [41, 41], // Shadow size
  });

  return (
    <MapContainer
      key={coordinates.toString()}
      center={coordinates}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={coordinates} icon={markerIcon}>
        <Popup>Searched Location</Popup>
      </Marker>
      <Circle center={coordinates} radius={500} />
      
      {liveCoordinates && (
        <Marker position={liveCoordinates} icon={markerIcon}>
          <Popup>Your Live Location</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default MapComponent;
