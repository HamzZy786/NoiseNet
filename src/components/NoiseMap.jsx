import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { ArrowLeft, Filter, Clock, Car, Plane, Hammer, Music, Volume2, RefreshCw } from 'lucide-react';
import { loadNoiseDataFromExcel, getNoiseColor, getNoiseRadius } from '../utils/excelLoader';
import 'leaflet/dist/leaflet.css';

const NoiseMap = ({ onBack }) => {
  const [allNoiseData, setAllNoiseData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    noiseType: 'all',
    timeRange: '24h',
    minNoiseLevel: 0,
    maxNoiseLevel: 140
  });
  const [showFilters, setShowFilters] = useState(false);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]); // Default to London

  // Load Excel data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loadNoiseDataFromExcel('/noise-data.xlsx');
        
        if (data && data.length > 0) {
          setAllNoiseData(data);
          
          // Calculate map center based on data
          const avgLat = data.reduce((sum, point) => sum + point.latitude, 0) / data.length;
          const avgLng = data.reduce((sum, point) => sum + point.longitude, 0) / data.length;
          setMapCenter([avgLat, avgLng]);
          
          console.log(`Loaded ${data.length} noise data points`);
          console.log('Map centered at:', [avgLat, avgLng]);
        } else {
          setError('No valid noise data found in Excel file');
        }
      } catch (err) {
        console.error('Error loading noise data:', err);
        setError('Failed to load noise data from Excel file');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    let filtered = allNoiseData;

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
  }, [filters, allNoiseData]);

  // Get color based on noise level (moved to utility)
  // Get size based on noise level (moved to utility)

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getNoiseTypeIcon = (type) => {
    const typeConfig = noiseTypes.find(t => t.id === type);
    return typeConfig ? typeConfig.icon : Volume2;
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await loadNoiseDataFromExcel('/noise-data.xlsx');
      setAllNoiseData(data);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="noise-map">
        <div className="map-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="back-icon" />
            Back
          </button>
          <h1 className="map-title">Loading Noise Data...</h1>
        </div>
        <div className="loading-container">
          <RefreshCw className="loading-icon spinning" />
          <p>Loading noise pollution data from Excel file...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="noise-map">
        <div className="map-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="back-icon" />
            Back
          </button>
          <h1 className="map-title">Error Loading Data</h1>
          <button className="filter-button" onClick={refreshData}>
            <RefreshCw className="filter-icon" />
            Retry
          </button>
        </div>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={refreshData} className="retry-button">
            <RefreshCw className="filter-icon" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="noise-map">
      {/* Header */}
      <div className="map-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft className="back-icon" />
          Back
        </button>
        <h1 className="map-title">Noise Pollution Map ({allNoiseData.length} data points)</h1>
        <div className="header-actions">
          <button 
            className="filter-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="filter-icon" />
            Filters
          </button>
          <button className="refresh-button" onClick={refreshData}>
            <RefreshCw className="filter-icon" />
            Refresh
          </button>
        </div>
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
          center={mapCenter}
          zoom={10}
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
