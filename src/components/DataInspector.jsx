import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, EyeOff } from 'lucide-react';
import { loadNoiseDataFromExcel } from '../utils/excelLoader';
import ExcelTest from './ExcelTest';

const DataInspector = () => {
  const [rawData, setRawData] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const [stats, setStats] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load the parsed data
      const parsed = await loadNoiseDataFromExcel('/noise-data.xlsx');
      setParsedData(parsed);
      
      // Calculate statistics
      if (parsed.length > 0) {
        const noiseStats = {
          totalPoints: parsed.length,
          avgNoiseLevel: (parsed.reduce((sum, p) => sum + p.noiseLevel, 0) / parsed.length).toFixed(1),
          minNoiseLevel: Math.min(...parsed.map(p => p.noiseLevel)),
          maxNoiseLevel: Math.max(...parsed.map(p => p.noiseLevel)),
          noiseLevelRanges: {
            quiet: parsed.filter(p => p.noiseLevel < 50).length,
            moderate: parsed.filter(p => p.noiseLevel >= 50 && p.noiseLevel < 70).length,
            loud: parsed.filter(p => p.noiseLevel >= 70 && p.noiseLevel < 90).length,
            veryLoud: parsed.filter(p => p.noiseLevel >= 90).length
          },
          noiseTypes: parsed.reduce((acc, p) => {
            acc[p.noiseType] = (acc[p.noiseType] || 0) + 1;
            return acc;
          }, {}),
          coordinateRanges: {
            latMin: Math.min(...parsed.map(p => p.latitude)),
            latMax: Math.max(...parsed.map(p => p.latitude)),
            lngMin: Math.min(...parsed.map(p => p.longitude)),
            lngMax: Math.max(...parsed.map(p => p.longitude))
          }
        };
        setStats(noiseStats);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
      <ExcelTest />
      
      <div className="inspector-header">
        <h2 className="inspector-title">
          <FileText className="title-icon" />
          Excel Data Inspector
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
          <button onClick={loadData} className="refresh-button" disabled={loading}>
            Refresh Data
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-section">
          <p>Loading Excel data...</p>
        </div>
      )}

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
