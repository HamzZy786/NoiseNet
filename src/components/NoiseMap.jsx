import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, Filter, Clock, Car, Plane, Hammer, Music, Volume2, RefreshCw } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Global noise pollution sample data
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

const NoiseMap = ({ onBack }) => {
  const [filteredData, setFilteredData] = useState(globalNoiseData);
  const [filters, setFilters] = useState({
    noiseType: 'all',
    timeRange: '24h',
    minNoiseLevel: 0,
    maxNoiseLevel: 140
  });
  const [showFilters, setShowFilters] = useState(false);

  const noiseTypes = [
    { id: 'all', label: 'All Types', icon: Volume2 },
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'aircraft', label: 'Aircraft', icon: Plane },
    { id: 'construction', label: 'Construction', icon: Hammer },
    { id: 'social', label: 'Social/Music', icon: Music }
  ];

  const timeRanges = [
    { id: '1h', label: 'Last Hour' },
    { id: '24h', label: 'Last 24 Hours' },
    { id: '7d', label: 'Last 7 Days' },
    { id: '30d', label: 'Last 30 Days' }
  ];

  // Apply filters to data
  useEffect(() => {
    let filtered = globalNoiseData;

    // Filter by noise type
    if (filters.noiseType !== 'all') {
      filtered = filtered.filter(item => item.noiseType === filters.noiseType);
    }

    // Filter by noise level range
    filtered = filtered.filter(item => 
      item.noiseLevel >= filters.minNoiseLevel && 
      item.noiseLevel <= filters.maxNoiseLevel
    );

    // Filter by time range (simplified - in real app would use actual date comparison)
    // For demo purposes, we'll show all data regardless of time range

    setFilteredData(filtered);
  }, [filters]);

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

  const getNoiseTypeIcon = (type) => {
    const typeConfig = noiseTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : Volume2;
  };

  return (
    <div className="noise-map">
      {/* Header */}
      <div className="map-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back
        </button>
        <h1 className="map-title">Global Noise Pollution Map ({globalNoiseData.length} data points)</h1>
        <button 
          className="filter-button"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="filter-icon" />
          Filters
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="filters-panel">
          <div className="filters-content">
            {/* Noise Type Filter */}
            <div className="filter-group">
              <label className="filter-label">Noise Type</label>
              <div className="filter-options">
                {noiseTypes.map(type => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFilters(prev => ({ ...prev, noiseType: type.id }))}
                      className={`filter-option ${filters.noiseType === type.id ? 'active' : ''}`}
                    >
                      <IconComponent className="filter-option-icon" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Range Filter */}
            <div className="filter-group">
              <label className="filter-label">Time Range</label>
              <div className="filter-options">
                {timeRanges.map(range => (
                  <button
                    key={range.id}
                    onClick={() => setFilters(prev => ({ ...prev, timeRange: range.id }))}
                    className={`filter-option ${filters.timeRange === range.id ? 'active' : ''}`}
                  >
                    <Clock className="filter-option-icon" />
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Noise Level Range */}
            <div className="filter-group">
              <label className="filter-label">Noise Level Range (dB)</label>
              <div className="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minNoiseLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, minNoiseLevel: parseInt(e.target.value) || 0 }))}
                  className="range-input"
                  min="0"
                  max="140"
                />
                <span className="range-separator">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxNoiseLevel}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxNoiseLevel: parseInt(e.target.value) || 140 }))}
                  className="range-input"
                  min="0"
                  max="140"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="map-container">
        <MapContainer
          center={[20, 0]} // Centered to show global coverage
          zoom={2}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredData.map((point) => {
            const IconComponent = getNoiseTypeIcon(point.noiseType);
            return (
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
                      <IconComponent className="popup-icon" />
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
            );
          })}
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

      {/* Stats */}
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredData.length}</span>
          <span className="stat-label">Reports Shown</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {filteredData.length > 0 ? Math.round(filteredData.reduce((sum, point) => sum + point.noiseLevel, 0) / filteredData.length) : 0}
          </span>
          <span className="stat-label">Avg dB Level</span>
        </div>
      </div>
    </div>
  );
};

export default NoiseMap;
