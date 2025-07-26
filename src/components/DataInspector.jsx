import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, EyeOff } from 'lucide-react';

// Import the same global data used in the map
const globalNoiseData = [
  // Major Cities - Traffic Noise
  { id: 1, latitude: 40.7128, longitude: -74.0060, noiseLevel: 78, noiseType: 'traffic', description: 'Heavy traffic in Manhattan', location: 'New York City, USA', timestamp: '2024-01-26T09:30:00Z', votes: 42 },
  { id: 2, latitude: 51.5074, longitude: -0.1278, noiseLevel: 72, noiseType: 'traffic', description: 'London rush hour traffic', location: 'London, UK', timestamp: '2024-01-26T08:15:00Z', votes: 35 },
  { id: 3, latitude: 35.6762, longitude: 139.6503, noiseLevel: 75, noiseType: 'traffic', description: 'Shibuya crossing traffic', location: 'Tokyo, Japan', timestamp: '2024-01-26T18:45:00Z', votes: 28 },
  { id: 4, latitude: 48.8566, longitude: 2.3522, noiseLevel: 69, noiseType: 'traffic', description: 'Champs-Élysées traffic', location: 'Paris, France', timestamp: '2024-01-26T17:20:00Z', votes: 23 },
  { id: 5, latitude: 55.7558, longitude: 37.6173, noiseLevel: 73, noiseType: 'traffic', description: 'Red Square area traffic', location: 'Moscow, Russia', timestamp: '2024-01-26T14:30:00Z', votes: 19 },

  // Airport Noise
  { id: 6, latitude: 40.6413, longitude: -73.7781, noiseLevel: 85, noiseType: 'aircraft', description: 'JFK Airport aircraft noise', location: 'New York, USA', timestamp: '2024-01-26T12:15:00Z', votes: 67 },
  { id: 7, latitude: 51.4700, longitude: -0.4543, noiseLevel: 82, noiseType: 'aircraft', description: 'Heathrow flight path', location: 'London, UK', timestamp: '2024-01-26T11:30:00Z', votes: 54 },
  { id: 8, latitude: 35.5494, longitude: 139.7798, noiseLevel: 80, noiseType: 'aircraft', description: 'Haneda Airport takeoffs', location: 'Tokyo, Japan', timestamp: '2024-01-26T16:45:00Z', votes: 41 },
  { id: 9, latitude: 49.0097, longitude: 2.5479, noiseLevel: 79, noiseType: 'aircraft', description: 'Charles de Gaulle departures', location: 'Paris, France', timestamp: '2024-01-26T13:20:00Z', votes: 38 },
  { id: 10, latitude: -33.9399, longitude: 151.1753, noiseLevel: 77, noiseType: 'aircraft', description: 'Sydney Airport noise', location: 'Sydney, Australia', timestamp: '2024-01-26T22:10:00Z', votes: 29 },

  // Construction Sites
  { id: 11, latitude: 40.7589, longitude: -73.9851, noiseLevel: 88, noiseType: 'construction', description: 'Central Park construction', location: 'New York, USA', timestamp: '2024-01-26T10:00:00Z', votes: 156 },
  { id: 12, latitude: 52.5200, longitude: 13.4050, noiseLevel: 84, noiseType: 'construction', description: 'Berlin infrastructure project', location: 'Berlin, Germany', timestamp: '2024-01-26T09:45:00Z', votes: 92 },
  { id: 13, latitude: 39.9042, longitude: 116.4074, noiseLevel: 86, noiseType: 'construction', description: 'Beijing development site', location: 'Beijing, China', timestamp: '2024-01-26T14:15:00Z', votes: 78 },
  { id: 14, latitude: 19.4326, longitude: -99.1332, noiseLevel: 81, noiseType: 'construction', description: 'Mexico City metro construction', location: 'Mexico City, Mexico', timestamp: '2024-01-26T15:30:00Z', votes: 63 },
  { id: 15, latitude: -23.5558, longitude: -46.6396, noiseLevel: 83, noiseType: 'construction', description: 'São Paulo building project', location: 'São Paulo, Brazil', timestamp: '2024-01-26T11:20:00Z', votes: 47 },

  // Entertainment Districts
  { id: 16, latitude: 40.7505, longitude: -73.9934, noiseLevel: 76, noiseType: 'social', description: 'Times Square street performers', location: 'New York, USA', timestamp: '2024-01-26T20:30:00Z', votes: 85 },
  { id: 17, latitude: 51.5142, longitude: -0.0931, noiseLevel: 74, noiseType: 'social', description: 'Borough Market crowds', location: 'London, UK', timestamp: '2024-01-26T19:15:00Z', votes: 52 },
  { id: 18, latitude: 35.6895, longitude: 139.6917, noiseLevel: 71, noiseType: 'social', description: 'Harajuku street music', location: 'Tokyo, Japan', timestamp: '2024-01-26T21:45:00Z', votes: 34 },
  { id: 19, latitude: 48.8606, longitude: 2.3376, noiseLevel: 68, noiseType: 'social', description: 'Latin Quarter nightlife', location: 'Paris, France', timestamp: '2024-01-26T23:00:00Z', votes: 28 },
  { id: 20, latitude: 52.3676, longitude: 4.9041, noiseLevel: 70, noiseType: 'social', description: 'Amsterdam nightlife district', location: 'Amsterdam, Netherlands', timestamp: '2024-01-26T22:30:00Z', votes: 41 },

  // Industrial Areas
  { id: 21, latitude: 42.3601, longitude: -71.0589, noiseLevel: 79, noiseType: 'other', description: 'Boston harbor industrial', location: 'Boston, USA', timestamp: '2024-01-26T07:30:00Z', votes: 23 },
  { id: 22, latitude: 53.4808, longitude: -2.2426, noiseLevel: 77, noiseType: 'other', description: 'Manchester industrial zone', location: 'Manchester, UK', timestamp: '2024-01-26T08:45:00Z', votes: 31 },
  { id: 23, latitude: 50.1109, longitude: 8.6821, noiseLevel: 75, noiseType: 'other', description: 'Frankfurt industrial district', location: 'Frankfurt, Germany', timestamp: '2024-01-26T12:00:00Z', votes: 18 },
  { id: 24, latitude: 45.4642, longitude: 9.1900, noiseLevel: 73, noiseType: 'other', description: 'Milan manufacturing area', location: 'Milan, Italy', timestamp: '2024-01-26T13:45:00Z', votes: 25 },
  { id: 25, latitude: 31.2304, longitude: 121.4737, noiseLevel: 80, noiseType: 'other', description: 'Shanghai port activities', location: 'Shanghai, China', timestamp: '2024-01-26T16:20:00Z', votes: 44 },

  // More Global Coverage
  { id: 26, latitude: -34.6037, longitude: -58.3816, noiseLevel: 72, noiseType: 'traffic', description: 'Buenos Aires traffic', location: 'Buenos Aires, Argentina', timestamp: '2024-01-26T14:15:00Z', votes: 33 },
  { id: 27, latitude: 28.6139, longitude: 77.2090, noiseLevel: 81, noiseType: 'traffic', description: 'Delhi traffic congestion', location: 'New Delhi, India', timestamp: '2024-01-26T17:30:00Z', votes: 76 },
  { id: 28, latitude: 30.0444, longitude: 31.2357, noiseLevel: 74, noiseType: 'social', description: 'Cairo market noise', location: 'Cairo, Egypt', timestamp: '2024-01-26T15:45:00Z', votes: 42 },
  { id: 29, latitude: -26.2041, longitude: 28.0473, noiseLevel: 69, noiseType: 'other', description: 'Johannesburg mining activity', location: 'Johannesburg, South Africa', timestamp: '2024-01-26T11:00:00Z', votes: 27 },
  { id: 30, latitude: 1.3521, longitude: 103.8198, noiseLevel: 70, noiseType: 'traffic', description: 'Singapore city traffic', location: 'Singapore', timestamp: '2024-01-26T19:20:00Z', votes: 35 },

  // Additional Points for Better Coverage
  { id: 31, latitude: 59.9311, longitude: 30.3609, noiseLevel: 67, noiseType: 'traffic', description: 'St. Petersburg traffic', location: 'St. Petersburg, Russia', timestamp: '2024-01-26T13:15:00Z', votes: 21 },
  { id: 32, latitude: 41.9028, longitude: 12.4964, noiseLevel: 71, noiseType: 'social', description: 'Rome tourist areas', location: 'Rome, Italy', timestamp: '2024-01-26T18:00:00Z', votes: 38 },
  { id: 33, latitude: 25.2048, longitude: 55.2708, noiseLevel: 76, noiseType: 'construction', description: 'Dubai construction boom', location: 'Dubai, UAE', timestamp: '2024-01-26T12:30:00Z', votes: 54 },
  { id: 34, latitude: -37.8136, longitude: 144.9631, noiseLevel: 65, noiseType: 'traffic', description: 'Melbourne city center', location: 'Melbourne, Australia', timestamp: '2024-01-26T21:45:00Z', votes: 29 },
  { id: 35, latitude: 49.2827, longitude: -123.1207, noiseLevel: 63, noiseType: 'other', description: 'Vancouver harbor activity', location: 'Vancouver, Canada', timestamp: '2024-01-26T16:15:00Z', votes: 22 }
];

const DataInspector = () => {
  const [parsedData] = useState(globalNoiseData);
  const [showRaw, setShowRaw] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Calculate statistics from the global data
    if (parsedData.length > 0) {
      const noiseStats = {
        totalPoints: parsedData.length,
        avgNoiseLevel: (parsedData.reduce((sum, p) => sum + p.noiseLevel, 0) / parsedData.length).toFixed(1),
        minNoiseLevel: Math.min(...parsedData.map(p => p.noiseLevel)),
        maxNoiseLevel: Math.max(...parsedData.map(p => p.noiseLevel)),
        noiseLevelRanges: {
          quiet: parsedData.filter(p => p.noiseLevel < 50).length,
          moderate: parsedData.filter(p => p.noiseLevel >= 50 && p.noiseLevel < 70).length,
          loud: parsedData.filter(p => p.noiseLevel >= 70 && p.noiseLevel < 90).length,
          veryLoud: parsedData.filter(p => p.noiseLevel >= 90).length
        },
        noiseTypes: parsedData.reduce((acc, p) => {
          acc[p.noiseType] = (acc[p.noiseType] || 0) + 1;
          return acc;
        }, {}),
        coordinateRanges: {
          latMin: Math.min(...parsedData.map(p => p.latitude)),
          latMax: Math.max(...parsedData.map(p => p.latitude)),
          lngMin: Math.min(...parsedData.map(p => p.longitude)),
          lngMax: Math.max(...parsedData.map(p => p.longitude))
        }
      };
      setStats(noiseStats);
    }
  }, [parsedData]);

  const exportData = () => {
    const dataStr = JSON.stringify(parsedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'noise-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="data-inspector">
      <div className="inspector-header">
        <h2 className="inspector-title">
          <FileText className="title-icon" />
          Global Noise Data Inspector
        </h2>
        <div className="inspector-actions">
          <button onClick={() => setShowRaw(!showRaw)} className="toggle-button">
            {showRaw ? <EyeOff className="button-icon" /> : <Eye className="button-icon" />}
            {showRaw ? 'Hide' : 'Show'} Sample Data
          </button>
          <button onClick={exportData} className="export-button" disabled={!parsedData.length}>
            <Download className="button-icon" />
            Export JSON
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Total Data Points</h3>
              <p className="stat-number">{stats.totalPoints}</p>
            </div>
            
            <div className="stat-card">
              <h3>Average Noise Level</h3>
              <p className="stat-number">{stats.avgNoiseLevel} dB</p>
            </div>
            
            <div className="stat-card">
              <h3>Noise Level Range</h3>
              <p className="stat-number">{stats.minNoiseLevel} - {stats.maxNoiseLevel} dB</p>
            </div>
            
            <div className="stat-card">
              <h3>Geographic Coverage</h3>
              <p className="stat-small">
                Lat: {stats.coordinateRanges.latMin.toFixed(4)} to {stats.coordinateRanges.latMax.toFixed(4)}
              </p>
              <p className="stat-small">
                Lng: {stats.coordinateRanges.lngMin.toFixed(4)} to {stats.coordinateRanges.lngMax.toFixed(4)}
              </p>
            </div>
          </div>

          <div className="noise-distribution">
            <h3>Noise Level Distribution</h3>
            <div className="distribution-grid">
              <div className="distribution-item quiet">
                <span className="distribution-label">Quiet (&lt;50 dB)</span>
                <span className="distribution-value">{stats.noiseLevelRanges.quiet}</span>
              </div>
              <div className="distribution-item moderate">
                <span className="distribution-label">Moderate (50-70 dB)</span>
                <span className="distribution-value">{stats.noiseLevelRanges.moderate}</span>
              </div>
              <div className="distribution-item loud">
                <span className="distribution-label">Loud (70-90 dB)</span>
                <span className="distribution-value">{stats.noiseLevelRanges.loud}</span>
              </div>
              <div className="distribution-item very-loud">
                <span className="distribution-label">Very Loud (90+ dB)</span>
                <span className="distribution-value">{stats.noiseLevelRanges.veryLoud}</span>
              </div>
            </div>
          </div>

          <div className="noise-types">
            <h3>Noise Types</h3>
            <div className="types-grid">
              {Object.entries(stats.noiseTypes).map(([type, count]) => (
                <div key={type} className="type-item">
                  <span className="type-label">{type}</span>
                  <span className="type-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRaw && parsedData.length > 0 && (
        <div className="raw-data-section">
          <h3>Sample Parsed Data (First 5 entries)</h3>
          <pre className="raw-data-display">
            {JSON.stringify(parsedData.slice(0, 5), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default DataInspector;
