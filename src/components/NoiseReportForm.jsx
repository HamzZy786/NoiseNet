import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mic, MapPin, Volume2, Car, Plane, Hammer, Music } from 'lucide-react';

const NoiseReportForm = ({ onBack }) => {
  const [formData, setFormData] = useState({
    noiseLevel: '',
    noiseType: '',
    description: '',
    location: '',
    latitude: null,
    longitude: null,
    isRecording: false
  });

  const [locationStatus, setLocationStatus] = useState('idle'); // idle, loading, success, error

  const noiseTypes = [
    { id: 'traffic', label: 'Traffic', icon: Car },
    { id: 'aircraft', label: 'Aircraft', icon: Plane },
    { id: 'construction', label: 'Construction', icon: Hammer },
    { id: 'social', label: 'Social/Music', icon: Music },
    { id: 'other', label: 'Other', icon: Volume2 }
  ];

  // Get user's current location
  const getCurrentLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`
        }));
        setLocationStatus('success');
      },
      () => {
        setLocationStatus('error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Simulate noise level measurement (in a real app, this would use Web Audio API)
  const measureNoiseLevel = () => {
    setFormData(prev => ({ ...prev, isRecording: true }));
    
    // Simulate measurement
    setTimeout(() => {
      const simulatedLevel = Math.floor(Math.random() * 60) + 30; // 30-90 dB range
      setFormData(prev => ({ 
        ...prev, 
        noiseLevel: simulatedLevel.toString(),
        isRecording: false 
      }));
    }, 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Submitting noise report:', formData);
    
    // For now, just show success and go back
    alert('Noise report submitted successfully! Thank you for contributing to NoiseNet.');
    onBack();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="noise-report-form">
      <div className="form-container">
        {/* Header */}
        <div className="form-header">
          <button className="back-button" onClick={onBack}>
            <ArrowLeft className="back-icon" />
            Back
          </button>
          <h1 className="form-title">Report Noise</h1>
          <p className="form-subtitle">Help map noise pollution in your area</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="report-form">
          {/* Location Section */}
          <div className="form-section">
            <h3 className="section-title">Location</h3>
            <div className="location-input-group">
              <input
                type="text"
                placeholder="Enter address or coordinates"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="location-input"
                required
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                className={`location-button ${locationStatus === 'loading' ? 'loading' : ''}`}
                disabled={locationStatus === 'loading'}
              >
                <MapPin className="location-icon" />
                {locationStatus === 'loading' ? 'Getting Location...' : 'Use Current Location'}
              </button>
            </div>
            {locationStatus === 'error' && (
              <p className="error-message">Unable to get location. Please enter manually.</p>
            )}
          </div>

          {/* Noise Level Section */}
          <div className="form-section">
            <h3 className="section-title">Noise Level (dB)</h3>
            <div className="noise-level-group">
              <input
                type="number"
                placeholder="Enter decibel level"
                value={formData.noiseLevel}
                onChange={(e) => handleInputChange('noiseLevel', e.target.value)}
                className="noise-level-input"
                min="0"
                max="140"
                required
              />
              <button
                type="button"
                onClick={measureNoiseLevel}
                className={`measure-button ${formData.isRecording ? 'recording' : ''}`}
                disabled={formData.isRecording}
              >
                <Mic className={`mic-icon ${formData.isRecording ? 'pulse' : ''}`} />
                {formData.isRecording ? 'Measuring...' : 'Measure Now'}
              </button>
            </div>
            <div className="noise-level-guide">
              <span className="guide-item quiet">30-50 dB: Quiet</span>
              <span className="guide-item moderate">50-70 dB: Moderate</span>
              <span className="guide-item loud">70-90 dB: Loud</span>
              <span className="guide-item very-loud">90+ dB: Very Loud</span>
            </div>
          </div>

          {/* Noise Type Section */}
          <div className="form-section">
            <h3 className="section-title">Noise Type</h3>
            <div className="noise-type-grid">
              {noiseTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('noiseType', type.id)}
                    className={`noise-type-button ${formData.noiseType === type.id ? 'selected' : ''}`}
                  >
                    <IconComponent className="noise-type-icon" />
                    <span className="noise-type-label">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description Section */}
          <div className="form-section">
            <h3 className="section-title">Description (Optional)</h3>
            <textarea
              placeholder="Describe the noise issue (e.g., 'Construction work starts at 6am every day')"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="description-textarea"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            <Volume2 className="submit-icon" />
            Submit Noise Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default NoiseReportForm;
