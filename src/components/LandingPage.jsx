import React from 'react';
import { Volume2, MapPin, Users, BarChart3, Mic, AlertTriangle } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Track Noise Pollution in 
              <span className="highlight"> Your Community</span>
            </h1>
            <p className="hero-description">
              Join thousands of people worldwide in mapping noise pollution. Report noise levels, 
              submit complaints, and help create a quieter, healthier environment for everyone.
            </p>
            <div className="hero-actions">
              <button 
                className="cta-button primary"
                onClick={() => onNavigate('report')}
              >
                <Mic className="button-icon" />
                Report Noise Now
              </button>
              <button 
                className="cta-button secondary"
                onClick={() => onNavigate('map')}
              >
                <BarChart3 className="button-icon" />
                View Noise Map
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="noise-visualization">
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <div className="sound-wave"></div>
              <Volume2 className="volume-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">How NoiseNet Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <Mic className="feature-icon" />
              </div>
              <h3 className="feature-title">Measure & Report</h3>
              <p className="feature-description">
                Use your phone's microphone to measure decibel levels or manually input noise data. 
                Add location and description details.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <Users className="feature-icon" />
              </div>
              <h3 className="feature-title">Community Voting</h3>
              <p className="feature-description">
                Vote on noise issues in your area. Upvote persistent problems to help 
                prioritize community action and city planning.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-container">
                <MapPin className="feature-icon" />
              </div>
              <h3 className="feature-title">Live Heatmap</h3>
              <p className="feature-description">
                View real-time noise pollution data on an interactive map. Filter by time, 
                noise type, and location radius.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <h2 className="section-title">Making a Difference</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">12,847</div>
              <div className="stat-label">Noise Reports</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">156</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8,492</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">73</div>
              <div className="stat-label">Policy Changes</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <AlertTriangle className="cta-icon" />
          <h2 className="final-cta-title">Ready to Make Your Community Quieter?</h2>
          <p className="final-cta-description">
            Every report matters. Join the movement to reduce noise pollution and create 
            healthier communities for everyone.
          </p>
          <button 
            className="cta-button primary large"
            onClick={() => onNavigate('report')}
          >
            <Mic className="button-icon" />
            Start Reporting
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
