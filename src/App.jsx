import React, { useState, useEffect } from 'react';
import { Volume2, MapPin, Users, BarChart3, FileText } from 'lucide-react';
import LandingPage from './components/LandingPage';
import NoiseReportForm from './components/NoiseReportForm';
import NoiseMap from './components/NoiseMap';
import TestMap from './components/TestMap';
import SimpleMap from './components/SimpleMap';
import WorkingMap from './components/WorkingMap';
import DataInspector from './components/DataInspector';
import { realtimeManager } from './utils/realtimeManager';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  // Initialize real-time manager when app starts
  useEffect(() => {
    realtimeManager.start();
    
    return () => {
      realtimeManager.stop();
    };
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentView} />;
      case 'report':
        return <NoiseReportForm onBack={() => setCurrentView('landing')} />;
      case 'map':
        return <WorkingMap onBack={() => setCurrentView('landing')} />;
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
            <h1>NoiseNet</h1>
          </div>
          
          <nav className="nav-menu">
            <button 
              className={`nav-button ${currentView === 'landing' ? 'active' : ''}`}
              onClick={() => setCurrentView('landing')}
            >
              <Users className="nav-icon" />
              Home
            </button>
            <button 
              className={`nav-button ${currentView === 'report' ? 'active' : ''}`}
              onClick={() => setCurrentView('report')}
            >
              <MapPin className="nav-icon" />
              Report Noise
            </button>
            <button 
              className={`nav-button ${currentView === 'map' ? 'active' : ''}`}
              onClick={() => setCurrentView('map')}
            >
              <BarChart3 className="nav-icon" />
              Noise Map
            </button>
            <button 
              className={`nav-button ${currentView === 'data' ? 'active' : ''}`}
              onClick={() => setCurrentView('data')}
            >
              <FileText className="nav-icon" />
              Data Inspector
            </button>
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

export default App;
