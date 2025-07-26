import React from 'react';
import { ArrowLeft } from 'lucide-react';

const TestMap = ({ onBack }) => {
  return (
    <div className="noise-map">
      {/* Header */}
      <div className="map-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back
        </button>
        <h1 className="map-title">Test Map (Debug)</h1>
      </div>

      {/* Test Content */}
      <div className="map-container">
        <div style={{ 
          background: 'lightblue', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          Map Container Test - If you see this, the container works!
        </div>
      </div>
    </div>
  );
};

export default TestMap;
