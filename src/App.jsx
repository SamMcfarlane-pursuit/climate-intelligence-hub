import React, { useState } from 'react'
import ClimateRiskAnalyzer from './ClimateRiskAnalyzer'
import FundingTracker from './components/FundingTracker'

function App() {
  const [currentView, setCurrentView] = useState('analyzer')

  const renderNavigation = () => (
    <div style={{
      background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
      padding: '1rem 2rem',
      marginBottom: '2rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ 
          color: 'white', 
          fontSize: '1.5rem', 
          fontWeight: '700', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🌍 Climate Tech Dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setCurrentView('analyzer')}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentView === 'analyzer' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              if (currentView !== 'analyzer') {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (currentView !== 'analyzer') {
                e.target.style.background = 'transparent';
              }
            }}
          >
            📊 Risk Analyzer
          </button>
          
          <button
            onClick={() => setCurrentView('funding')}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentView === 'funding' ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backdropFilter: 'blur(10px)'
            }}
            onMouseOver={(e) => {
              if (currentView !== 'funding') {
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }
            }}
            onMouseOut={(e) => {
              if (currentView !== 'funding') {
                e.target.style.background = 'transparent';
              }
            }}
          >
            🚀 Funding Tracker
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="App" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {renderNavigation()}
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        {currentView === 'analyzer' && <ClimateRiskAnalyzer onNavigateToFunding={() => setCurrentView('funding')} />}
        {currentView === 'funding' && <FundingTracker />}
      </div>
    </div>
  )
}

export default App