import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle,
  Target,
  BarChart3,
  Activity,
  Zap
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const ClimateScenarioModeling = () => {
  const [selectedScenario, setSelectedScenario] = useState('rcp45');
  const [timeHorizon, setTimeHorizon] = useState('2030');

  // Climate scenarios based on IPCC projections
  const scenarios = {
    'rcp26': {
      name: 'RCP 2.6 (Paris Agreement)',
      description: 'Strong mitigation scenario, limiting warming to 1.5°C',
      color: '#16a34a',
      icon: '🌱'
    },
    'rcp45': {
      name: 'RCP 4.5 (Moderate Action)',
      description: 'Moderate mitigation, warming of 2-3°C by 2100',
      color: '#ca8a04',
      icon: '⚖️'
    },
    'rcp85': {
      name: 'RCP 8.5 (Business as Usual)',
      description: 'High emissions scenario, warming of 4-5°C by 2100',
      color: '#dc2626',
      icon: '🔥'
    }
  };

  // Generate scenario data based on selection
  const generateScenarioData = (scenario, horizon) => {
    const baseYear = 2024;
    const targetYear = parseInt(horizon);
    const years = [];
    
    for (let year = baseYear; year <= targetYear; year += 2) {
      years.push(year);
    }

    const multipliers = {
      'rcp26': { temp: 0.8, precip: 1.1, extreme: 1.2 },
      'rcp45': { temp: 1.5, precip: 1.3, extreme: 2.0 },
      'rcp85': { temp: 2.8, precip: 1.6, extreme: 3.5 }
    };

    const mult = multipliers[scenario];
    const yearSpan = targetYear - baseYear;

    return years.map(year => {
      const progress = (year - baseYear) / yearSpan;
      return {
        year,
        temperature: 72 + (mult.temp * progress * 5), // Base temp + warming
        precipitation: 42 * (1 + (mult.precip - 1) * progress), // Base precip with change
        extremeEvents: Math.round(10 * (1 + (mult.extreme - 1) * progress)), // Base events with increase
        seaLevel: progress * mult.temp * 0.3, // Sea level rise in feet
        economicImpact: Math.round(progress * mult.extreme * 50000) // Economic impact in thousands
      };
    });
  };

  const scenarioData = generateScenarioData(selectedScenario, timeHorizon);

  // Risk assessment for different sectors
  const sectorRisks = {
    'renewable-energy': {
      'rcp26': { physical: 'low', transition: 'low', opportunity: 'high' },
      'rcp45': { physical: 'medium', transition: 'medium', opportunity: 'high' },
      'rcp85': { physical: 'high', transition: 'low', opportunity: 'medium' }
    },
    'carbon-removal': {
      'rcp26': { physical: 'low', transition: 'low', opportunity: 'very-high' },
      'rcp45': { physical: 'medium', transition: 'medium', opportunity: 'very-high' },
      'rcp85': { physical: 'high', transition: 'low', opportunity: 'high' }
    },
    'clean-transportation': {
      'rcp26': { physical: 'low', transition: 'low', opportunity: 'high' },
      'rcp45': { physical: 'medium', transition: 'medium', opportunity: 'medium' },
      'rcp85': { physical: 'high', transition: 'low', opportunity: 'low' }
    },
    'manufacturing': {
      'rcp26': { physical: 'medium', transition: 'high', opportunity: 'medium' },
      'rcp45': { physical: 'high', transition: 'high', opportunity: 'low' },
      'rcp85': { physical: 'very-high', transition: 'medium', opportunity: 'very-low' }
    }
  };

  // Portfolio stress test results
  const stressTestData = [
    {
      sector: 'Renewable Energy',
      baseline: 85,
      rcp26: 92,
      rcp45: 88,
      rcp85: 78
    },
    {
      sector: 'Carbon Removal',
      baseline: 88,
      rcp26: 95,
      rcp45: 91,
      rcp85: 85
    },
    {
      sector: 'Clean Transport',
      baseline: 78,
      rcp26: 85,
      rcp45: 80,
      rcp85: 70
    },
    {
      sector: 'Manufacturing',
      baseline: 65,
      rcp26: 70,
      rcp45: 60,
      rcp85: 45
    }
  ];

  const getRiskColor = (risk) => {
    const colors = {
      'very-low': '#16a34a',
      'low': '#65a30d',
      'medium': '#ca8a04',
      'high': '#ea580c',
      'very-high': '#dc2626'
    };
    return colors[risk] || '#6b7280';
  };

  const getRiskLabel = (risk) => {
    const labels = {
      'very-low': 'Very Low',
      'low': 'Low',
      'medium': 'Medium',
      'high': 'High',
      'very-high': 'Very High'
    };
    return labels[risk] || risk;
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Activity size={24} style={{ marginRight: '0.5rem', color: '#8b5cf6' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Climate Scenario Modeling
        </h2>
      </div>

      {/* Scenario Selection */}
      <div style={{ 
        background: '#f8fafc', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Scenario Configuration</h3>
        
        <div className="grid grid-2" style={{ gap: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#374151' }}>
              Climate Scenario
            </label>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {Object.entries(scenarios).map(([key, scenario]) => (
                <div
                  key={key}
                  onClick={() => setSelectedScenario(key)}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: `2px solid ${selectedScenario === key ? scenario.color : '#e2e8f0'}`,
                    background: selectedScenario === key ? `${scenario.color}10` : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>{scenario.icon}</span>
                    <span style={{ fontWeight: '600', color: scenario.color }}>{scenario.name}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#6b7280', margin: 0 }}>
                    {scenario.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '1rem', fontWeight: '600', color: '#374151' }}>
              Time Horizon
            </label>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {['2030', '2040', '2050'].map((year) => (
                <div
                  key={year}
                  onClick={() => setTimeHorizon(year)}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: `2px solid ${timeHorizon === year ? '#8b5cf6' : '#e2e8f0'}`,
                    background: timeHorizon === year ? '#8b5cf610' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: timeHorizon === year ? '#8b5cf6' : '#374151'
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Projections */}
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        {/* Climate Variables */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Climate Projections</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={scenarioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis yAxisId="temp" orientation="left" />
              <YAxis yAxisId="precip" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="temperature" 
                stroke="#dc2626" 
                strokeWidth={3} 
                name="Temperature (°F)" 
              />
              <Line 
                yAxisId="precip"
                type="monotone" 
                dataKey="precipitation" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                name="Precipitation (in)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Economic Impact */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Economic Impact Projection</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scenarioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}K`, 'Economic Impact']} />
              <Bar dataKey="economicImpact" fill={scenarios[selectedScenario].color} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Portfolio Stress Test */}
      <div style={{ 
        background: '#f8fafc', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Portfolio Stress Test Results</h3>
        <p style={{ fontSize: '0.95rem', color: '#6b7280', marginBottom: '1.5rem' }}>
          ESG scores under different climate scenarios (higher is better)
        </p>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stressTestData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sector" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="baseline" fill="#6b7280" name="Baseline" />
            <Bar dataKey="rcp26" fill="#16a34a" name="RCP 2.6" />
            <Bar dataKey="rcp45" fill="#ca8a04" name="RCP 4.5" />
            <Bar dataKey="rcp85" fill="#dc2626" name="RCP 8.5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Risk Matrix */}
      <div style={{ 
        background: '#f8fafc', 
        borderRadius: '12px', 
        padding: '1.5rem',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>
          Sector Risk Assessment - {scenarios[selectedScenario].name}
        </h3>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <div style={{ fontWeight: '600', color: '#374151' }}>Sector</div>
          <div style={{ fontWeight: '600', color: '#374151', textAlign: 'center' }}>Physical Risk</div>
          <div style={{ fontWeight: '600', color: '#374151', textAlign: 'center' }}>Transition Risk</div>
          <div style={{ fontWeight: '600', color: '#374151', textAlign: 'center' }}>Opportunity</div>
        </div>

        {Object.entries(sectorRisks).map(([sector, risks]) => (
          <div key={sector} style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '1rem',
            padding: '1rem',
            background: 'white',
            borderRadius: '8px',
            marginBottom: '0.5rem',
            border: '1px solid #e2e8f0',
            alignItems: 'center'
          }}>
            <div style={{ fontWeight: '600', color: '#1f2937', textTransform: 'capitalize' }}>
              {sector.replace('-', ' ')}
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: `${getRiskColor(risks[selectedScenario].physical)}20`,
                color: getRiskColor(risks[selectedScenario].physical)
              }}>
                {getRiskLabel(risks[selectedScenario].physical)}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: `${getRiskColor(risks[selectedScenario].transition)}20`,
                color: getRiskColor(risks[selectedScenario].transition)
              }}>
                {getRiskLabel(risks[selectedScenario].transition)}
              </span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: `${getRiskColor(risks[selectedScenario].opportunity)}20`,
                color: getRiskColor(risks[selectedScenario].opportunity)
              }}>
                {getRiskLabel(risks[selectedScenario].opportunity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Key Insights */}
      <div style={{ 
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        borderRadius: '12px',
        border: '1px solid #0ea5e9'
      }}>
        <h3 style={{ 
          fontSize: '1.3rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#0c4a6e',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Zap size={20} style={{ marginRight: '0.5rem' }} />
          Key Scenario Insights
        </h3>
        
        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              Climate Impacts by {timeHorizon}
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                Temperature increase: +{(scenarioData[scenarioData.length - 1]?.temperature - 72).toFixed(1)}°F
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Precipitation change: {((scenarioData[scenarioData.length - 1]?.precipitation / 42 - 1) * 100).toFixed(0)}%
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Extreme events: {scenarioData[scenarioData.length - 1]?.extremeEvents} annually
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                Economic impact: ${scenarioData[scenarioData.length - 1]?.economicImpact}K annually
              </li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              Investment Implications
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151' }}>
              {selectedScenario === 'rcp26' && (
                <>
                  <li style={{ marginBottom: '0.5rem' }}>Strong policy support for clean tech</li>
                  <li style={{ marginBottom: '0.5rem' }}>High demand for carbon removal</li>
                  <li style={{ marginBottom: '0.5rem' }}>Rapid renewable energy deployment</li>
                </>
              )}
              {selectedScenario === 'rcp45' && (
                <>
                  <li style={{ marginBottom: '0.5rem' }}>Moderate transition risks</li>
                  <li style={{ marginBottom: '0.5rem' }}>Mixed policy environment</li>
                  <li style={{ marginBottom: '0.5rem' }}>Adaptation investments needed</li>
                </>
              )}
              {selectedScenario === 'rcp85' && (
                <>
                  <li style={{ marginBottom: '0.5rem' }}>High physical climate risks</li>
                  <li style={{ marginBottom: '0.5rem' }}>Stranded asset risks</li>
                  <li style={{ marginBottom: '0.5rem' }}>Emergency adaptation required</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClimateScenarioModeling;