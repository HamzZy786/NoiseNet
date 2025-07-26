import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

const SimpleMap = ({ onBack }) => {
  const [error, setError] = useState(null);

  // Test if we can import Leaflet
  React.useEffect(() => {
    try {
      import('leaflet').then((L) => {
        console.log('Leaflet loaded successfully:', L);
      }).catch((err) => {
        console.error('Failed to load Leaflet:', err);
        setError('Failed to load Leaflet: ' + err.message);
      });
    } catch (err) {
      console.error('Import error:', err);
      setError('Import error: ' + err.message);
    }
  }, []);

  return (
    <div className="noise-map">
      {/* Header */}
      <div className="map-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back
        </button>
        <h1 className="map-title">Simple Map Debug</h1>
      </div>

      {/* Map Container */}
      <div className="map-container">
        <div style={{ 
          background: 'lightgreen', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '18px',
          padding: '20px'
        }}>
          <h3>Map Container Status</h3>
          <p>Container Height: Working ✓</p>
          <p>CSS Styles: Working ✓</p>
          {error ? (
            <div style={{ color: 'red', marginTop: '10px' }}>
              <p>Error: {error}</p>
            </div>
          ) : (
            <p style={{ color: 'green' }}>Leaflet import: Success ✓</p>
          )}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>If you see this green screen, the container is working.</p>
            <p>The issue is likely with the Leaflet MapContainer component.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMap;
