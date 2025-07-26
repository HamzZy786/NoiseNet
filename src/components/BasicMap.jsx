import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { ArrowLeft, Filter, Car, Plane, Hammer, Music, Volume2 } from 'lucide-react';
import { globalNoiseData } from '../data/globalNoiseData';
import 'leaflet/dist/leaflet.css';

const BasicMap = ({ onBack }) => {
  const [filteredData, setFilteredData] = useState(globalNoiseData);

  // Get color based on noise level
  const getNoiseColor = (noiseLevel) => {
    if (noiseLevel < 50) return '#4ade80'; // Green - quiet
    if (noiseLevel < 70) return '#fbbf24'; // Yellow - moderate
    if (noiseLevel < 90) return '#f97316'; // Orange - loud
    return '#ef4444'; // Red - very loud
  };

  // Get size based on noise level
  const getNoiseRadius = (noiseLevel) => {
    return Math.max(8, (noiseLevel / 140) * 30);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="noise-map">
      {/* Header */}
      <div className="map-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back
        </button>
        <h1 className="map-title">Basic Noise Map ({filteredData.length} points)</h1>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredData.map((point) => (
            <CircleMarker
              key={point.id}
              center={[point.latitude, point.longitude]}
              radius={getNoiseRadius(point.noiseLevel)}
              fillColor={getNoiseColor(point.noiseLevel)}
              color="#ffffff"
              weight={2}
              opacity={0.8}
              fillOpacity={0.6}
            >
              <Popup>
                <div className="popup-content">
                  <div className="popup-header">
                    <Volume2 className="popup-icon" />
                    <div className="popup-noise-level">
                      <span className="noise-level-number">{point.noiseLevel}</span>
                      <span className="noise-level-unit">dB</span>
                    </div>
                  </div>
                  <div className="popup-body">
                    <p className="popup-description">{point.description}</p>
                    <div className="popup-meta">
                      <span className="popup-timestamp">{formatTimestamp(point.timestamp)}</span>
                      <span className="popup-votes">{point.votes} votes</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="map-legend">
        <h4 className="legend-title">Noise Levels</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#4ade80' }}></div>
            <span>Quiet (0-50 dB)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#fbbf24' }}></div>
            <span>Moderate (50-70 dB)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f97316' }}></div>
            <span>Loud (70-90 dB)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
            <span>Very Loud (90+ dB)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicMap;
