import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { ArrowLeft, Filter, Clock, Car, Plane, Hammer, Music, Volume2, RefreshCw, Zap } from 'lucide-react';
import { realtimeManager } from '../utils/realtimeManager';
import NotificationCenter from './NotificationCenter';
import { globalNoiseData } from '../data/globalNoiseData';
import 'leaflet/dist/leaflet.css';

const NoiseMap = ({ onBack }) => {
  const [filteredData, setFilteredData] = useState(globalNoiseData);
  const [liveData, setLiveData] = useState(new Map());
  const [filters, setFilters] = useState({
    noiseType: 'all',
    timeRange: '24h',
    minNoiseLevel: 0,
    maxNoiseLevel: 140
  });
  const [showFilters, setShowFilters] = useState(false);

  // Real-time data subscription
  useEffect(() => {
    const unsubscribe = realtimeManager.subscribe((update) => {
      if (update.type === 'NOISE_LEVEL_UPDATE') {
        setLiveData(new Map(update.liveNoiseData));
      }
    });

    // Initialize live data
    setLiveData(new Map(realtimeManager.getLiveNoiseData()));

    return unsubscribe;
  }, []);

  // Handle notification location clicks
  const handleNotificationLocationClick = (coordinates, notification) => {
    // For now, we'll just log this - can implement map navigation later
    console.log('Navigate to:', coordinates, notification);
  };

  // Get live or static data for a location
  const getDisplayData = (staticPoint) => {
    const livePoint = liveData.get(staticPoint.id);
    if (livePoint) {
      return {
        ...staticPoint,
        noiseLevel: livePoint.noiseLevel,
        isLive: true,
        lastUpdate: livePoint.lastUpdate
      };
    }
    return { ...staticPoint, isLive: false };
  };

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
            const displayPoint = getDisplayData(point);
            const IconComponent = getNoiseTypeIcon(displayPoint.noiseType);
            return (
              <CircleMarker
                key={point.id}
                center={[point.latitude, point.longitude]}
                radius={getNoiseRadius(displayPoint.noiseLevel)}
                fillColor={getNoiseColor(displayPoint.noiseLevel)}
                color={displayPoint.isLive ? "#fbbf24" : "#ffffff"}
                weight={displayPoint.isLive ? 3 : 2}
                opacity={displayPoint.isLive ? 1 : 0.8}
                fillOpacity={displayPoint.isLive ? 0.8 : 0.6}
                className={displayPoint.isLive ? 'live-marker' : ''}
              >
                <Popup>
                  <div className="popup-content">
                    <div className="popup-header">
                      <IconComponent className="popup-icon" />
                      <div className="popup-noise-level">
                        <span className="noise-level-number">{displayPoint.noiseLevel}</span>
                        <span className="noise-level-unit">dB</span>
                        {displayPoint.isLive && (
                          <span className="live-indicator">
                            <Zap className="live-icon" />
                            LIVE
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="popup-body">
                      <p className="popup-description">{displayPoint.description}</p>
                      <div className="popup-meta">
                        <span className="popup-timestamp">
                          {displayPoint.isLive 
                            ? `Updated ${new Date(displayPoint.lastUpdate).toLocaleTimeString()}`
                            : formatTimestamp(displayPoint.timestamp)
                          }
                        </span>
                        <span className="popup-votes">{displayPoint.votes} votes</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        {/* Notification Center */}
        <NotificationCenter onLocationClick={handleNotificationLocationClick} />
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
