import React, { useState } from 'react';
import { Volume2, MapPin, Users, BarChart3 } from 'lucide-react';
import LandingPage from './components/LandingPage';
import NoiseReportForm from './components/NoiseReportForm';
import BasicMap from './components/BasicMap';
import DataInspector from './components/DataInspector';
import './App.css';

function SimpleApp() {
  const [currentView, setCurrentView] = useState('landing');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'report':
        return <NoiseReportForm onBack={() => setCurrentView('landing')} />;
      case 'map':
        return <BasicMap onBack={() => setCurrentView('landing')} />;
      case 'data':
        return <DataInspector onBack={() => setCurrentView('landing')} />;
      default:
        return <LandingPage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="app">
      {/* Navigation Header */}
      <header className="app-header">
        <div className="nav-container">
          <div className="logo" onClick={() => setCurrentView('landing')}>
            <Volume2 className="logo-icon" />
            <span className="logo-text">NoiseNet</span>
          </div>
          
          <nav className="nav-menu">
            <ul className="nav-list">
              <li>
                <button 
                  className={`nav-button ${currentView === 'landing' ? 'active' : ''}`}
                  onClick={() => setCurrentView('landing')}
                >
                  <Volume2 className="nav-icon" />
                  Home
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${currentView === 'report' ? 'active' : ''}`}
                  onClick={() => setCurrentView('report')}
                >
                  <MapPin className="nav-icon" />
                  Report
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${currentView === 'map' ? 'active' : ''}`}
                  onClick={() => setCurrentView('map')}
                >
                  <Users className="nav-icon" />
                  Map
                </button>
              </li>
              <li>
                <button 
                  className={`nav-button ${currentView === 'data' ? 'active' : ''}`}
                  onClick={() => setCurrentView('data')}
                >
                  <BarChart3 className="nav-icon" />
                  Data
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default SimpleApp;
