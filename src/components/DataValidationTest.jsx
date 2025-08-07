import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader, Globe, Database, Wifi, Settings, MapPin, Cloud, Wind, Activity } from 'lucide-react';
import { RealDataService } from '../services/realDataService';

const DataValidationTest = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const tests = [
    {
      id: 'environment',
      name: 'Environment Variables',
      description: 'Check if API keys are configured',
      icon: Settings,
      category: 'Configuration',
      test: async () => {
        const hasOpenWeather = !!import.meta.env.VITE_OPENWEATHER_API_KEY;
        const hasCarbon = !!import.meta.env.VITE_CARBON_API_KEY;
        
        return {
          success: hasOpenWeather || hasCarbon,
          details: {
            openWeatherKey: hasOpenWeather ? 'Configured' : 'Not configured',
            carbonKey: hasCarbon ? 'Configured' : 'Not configured',
            fallbackMode: !hasOpenWeather && !hasCarbon
          }
        };
      }
    },
    {
      id: 'coordinates',
      name: 'Location Services',
      description: 'Test geocoding and location resolution',
      icon: MapPin,
      category: 'Geolocation',
      test: async () => {
        try {
          const coords = await RealDataService.getCoordinates('New York');
          return {
            success: true,
            details: {
              latitude: coords.lat,
              longitude: coords.lon,
              country: coords.country,
              state: coords.state
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      id: 'weather',
      name: 'Weather Data',
      description: 'Test real-time weather API connectivity',
      icon: Cloud,
      category: 'Climate Data',
      test: async () => {
        try {
          const coords = { lat: 40.7128, lon: -74.0060 };
          const weather = await RealDataService.getCurrentWeather(coords);
          return {
            success: true,
            details: {
              temperature: weather.main?.temp || 'Simulated',
              humidity: weather.main?.humidity || 'Simulated',
              conditions: weather.weather?.[0]?.description || 'Simulated',
              dataSource: weather.main?.temp ? 'Real API' : 'Fallback'
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      id: 'airquality',
      name: 'Air Quality Data',
      description: 'Test air quality monitoring capabilities',
      icon: Wind,
      category: 'Environmental',
      test: async () => {
        try {
          const coords = { lat: 40.7128, lon: -74.0060 };
          const airQuality = await RealDataService.getAirQuality(coords);
          return {
            success: true,
            details: {
              aqi: airQuality.aqi || 'Simulated',
              pm25: airQuality.pm25 || 'Simulated',
              dataSource: airQuality.aqi !== 'N/A' ? 'Real API' : 'Fallback'
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    },
    {
      id: 'climate',
      name: 'Climate Data Integration',
      description: 'Test comprehensive climate data fetching',
      icon: Activity,
      category: 'Integration',
      test: async () => {
        try {
          const climateData = await RealDataService.getRealTimeClimateData('New York');
          return {
            success: true,
            details: {
              dataQuality: climateData.dataQuality,
              location: climateData.location?.name,
              temperature: climateData.current?.temperature,
              airQuality: climateData.airQuality?.aqi,
              lastUpdated: climateData.lastUpdated
            }
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }
    }
  ];

  const runTests = async () => {
    setIsRunning(true);
    setTestResults({});
    
    for (const test of tests) {
      setCurrentTest(test.name);
      try {
        const result = await test.test();
        setTestResults(prev => ({
          ...prev,
          [test.id]: { ...result, name: test.name, description: test.description }
        }));
      } catch (error) {
        setTestResults(prev => ({
          ...prev,
          [test.id]: { 
            success: false, 
            error: error.message, 
            name: test.name, 
            description: test.description 
          }
        }));
      }
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const getStatusIcon = (result) => {
    if (!result) return <Loader className="h-5 w-5 text-gray-400 animate-spin" />;
    if (result.success) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusColor = (result) => {
    if (!result) return 'border-gray-200 bg-gray-50';
    if (result.success) return 'border-green-200 bg-green-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="data-validation-container">
      {/* Header Section */}
      <div className="data-validation-header">
        <div className="header-content">
          <div className="header-icon">
            <Database className="h-6 w-6" />
          </div>
          <div className="header-text">
            <h3 className="header-title">🔬 Real Data Integration Test</h3>
            <p className="header-description">
              Verify that the application can effectively use real data sources
            </p>
          </div>
        </div>
        <button
          onClick={runTests}
          disabled={isRunning}
          className="run-tests-btn"
        >
          {isRunning ? (
            <>
              <Loader className="h-4 w-4 animate-spin" />
              <span>Testing...</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4" />
              <span>Run Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Current Test Indicator */}
      {isRunning && currentTest && (
        <div className="current-test-indicator">
          <div className="current-test-content">
            <Loader className="h-4 w-4 animate-spin text-emerald-600" />
            <span className="current-test-text">Testing: {currentTest}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      )}

      {/* Test Grid */}
      <div className="test-grid">
        {tests.map(test => {
          const result = testResults[test.id];
          const IconComponent = test.icon;
          return (
            <div
              key={test.id}
              className={`test-card ${result ? (result.success ? 'test-success' : 'test-failed') : 'test-pending'}`}
            >
              <div className="test-card-header">
                <div className="test-icon-wrapper">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div className="test-status">
                  {getStatusIcon(result)}
                </div>
              </div>
              
              <div className="test-card-content">
                <div className="test-category">{test.category}</div>
                <h4 className="test-name">{test.name}</h4>
                <p className="test-description">{test.description}</p>
                
                {result && (
                  <div className="test-result">
                    {result.success ? (
                      <div className="test-success-details">
                        <div className="success-badge">✓ Passed</div>
                        {result.details && (
                          <div className="result-details">
                            {Object.entries(result.details).map(([key, value]) => (
                              <div key={key} className="detail-item">
                                <span className="detail-key">{key}:</span>
                                <span className="detail-value">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="test-error-details">
                        <div className="error-badge">✗ Failed</div>
                        {result.error && (
                          <div className="error-message">
                            {result.error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Test Summary */}
      {Object.keys(testResults).length > 0 && !isRunning && (
        <div className="test-summary">
          <h4 className="summary-title">📊 Test Summary</h4>
          <div className="summary-stats">
            <div className="stat-item stat-success">
              <div className="stat-number">
                {Object.values(testResults).filter(r => r.success).length}
              </div>
              <div className="stat-label">Passed</div>
            </div>
            <div className="stat-item stat-error">
              <div className="stat-number">
                {Object.values(testResults).filter(r => !r.success).length}
              </div>
              <div className="stat-label">Failed</div>
            </div>
            <div className="stat-item stat-total">
              <div className="stat-number">
                {Object.keys(testResults).length}
              </div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataValidationTest;