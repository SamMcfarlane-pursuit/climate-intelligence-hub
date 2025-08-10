import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, MapPin, Zap, Droplets, Wind, Thermometer, DollarSign, Target, BarChart3, Leaf, Shield, TrendingDown, Brain, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { AIService } from './services/aiService';
import AIInsights from './components/AIInsights';
import BusinessProfileForm from './components/BusinessProfileForm';
import DataValidationTest from './components/DataValidationTest';
import InvestmentMetrics from './components/InvestmentMetrics';
import PortfolioAnalysis from './components/PortfolioAnalysis';
import ClimateScenarioModeling from './components/ClimateScenarioModeling';
import DecarbonizationFramework from './components/DecarbonizationFramework';
import FundingTracker from './components/FundingTracker';

// Add CSS for animations
const styles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

const ClimateRiskAnalyzer = ({ onNavigateToFunding }) => {
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('profile'); // 'profile', 'location', 'analysis'
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Simulated climate data (in real implementation, this would come from APIs)
  const climateData = {
    'New York': {
      temperature: { current: 72, trend: 2.3, risk: 'medium' },
      precipitation: { current: 42, trend: -5.2, risk: 'low' },
      extreme_events: { hurricanes: 3, heatwaves: 8, flooding: 12 },
      air_quality: { aqi: 89, trend: 'improving' }
    },
    'Miami': {
      temperature: { current: 84, trend: 3.1, risk: 'high' },
      precipitation: { current: 61, trend: 8.7, risk: 'high' },
      extreme_events: { hurricanes: 12, heatwaves: 25, flooding: 18 },
      air_quality: { aqi: 67, trend: 'stable' }
    },
    'Los Angeles': {
      temperature: { current: 75, trend: 2.8, risk: 'medium' },
      precipitation: { current: 15, trend: -12.3, risk: 'high' },
      extreme_events: { hurricanes: 0, heatwaves: 18, flooding: 3 },
      air_quality: { aqi: 112, trend: 'worsening' }
    },
    'Chicago': {
      temperature: { current: 65, trend: 2.1, risk: 'medium' },
      precipitation: { current: 38, trend: 3.2, risk: 'low' },
      extreme_events: { hurricanes: 0, heatwaves: 12, flooding: 8 },
      air_quality: { aqi: 78, trend: 'improving' }
    }
  };

  const industryImpacts = {
    // Traditional Industries
    'manufacturing': {
      risks: ['Supply chain disruption', 'Energy cost volatility', 'Regulatory compliance'],
      opportunities: ['Energy efficiency incentives', 'Green manufacturing tax credits', 'Carbon credit generation'],
      priority_actions: ['Implement energy monitoring', 'Assess renewable energy options', 'Review supplier climate risks'],
      investmentProfile: { carbonIntensity: 'high', transitionRisk: 'medium', opportunityScore: 7 }
    },
    'logistics': {
      risks: ['Fleet transition costs', 'Route disruption from extreme weather', 'Fuel price volatility'],
      opportunities: ['EV fleet incentives', 'Green logistics contracts', 'Carbon footprint reduction services'],
      priority_actions: ['Plan EV fleet transition', 'Optimize routes for efficiency', 'Partner with green suppliers'],
      investmentProfile: { carbonIntensity: 'high', transitionRisk: 'high', opportunityScore: 8 }
    },
    'retail': {
      risks: ['Store climate control costs', 'Supply chain disruption', 'Customer preference shifts'],
      opportunities: ['Sustainable product lines', 'Energy efficiency rebates', 'Green building certifications'],
      priority_actions: ['Audit energy usage', 'Source sustainable products', 'Implement smart building tech'],
      investmentProfile: { carbonIntensity: 'medium', transitionRisk: 'medium', opportunityScore: 6 }
    },
    'technology': {
      risks: ['Data center cooling costs', 'Talent attraction challenges', 'Regulatory reporting'],
      opportunities: ['Renewable energy contracts', 'Carbon removal projects', 'Green tech development'],
      priority_actions: ['Assess data center efficiency', 'Set science-based targets', 'Invest in clean tech R&D'],
      investmentProfile: { carbonIntensity: 'medium', transitionRisk: 'low', opportunityScore: 9 }
    },
    
    // Climate Investment Sectors
    'renewable-energy': {
      risks: ['Policy uncertainty', 'Grid integration challenges', 'Technology obsolescence'],
      opportunities: ['Declining technology costs', 'Corporate renewable PPAs', 'Energy storage integration'],
      priority_actions: ['Secure long-term contracts', 'Invest in grid flexibility', 'Develop energy storage'],
      investmentProfile: { carbonIntensity: 'negative', transitionRisk: 'low', opportunityScore: 10 }
    },
    'carbon-removal': {
      risks: ['Technology scalability', 'Verification challenges', 'Market price volatility'],
      opportunities: ['Growing carbon credit demand', 'Corporate net-zero commitments', 'Government incentives'],
      priority_actions: ['Validate technology efficacy', 'Secure offtake agreements', 'Scale operations'],
      investmentProfile: { carbonIntensity: 'negative', transitionRisk: 'low', opportunityScore: 9 }
    },
    'clean-transportation': {
      risks: ['Battery supply chain', 'Charging infrastructure gaps', 'Regulatory changes'],
      opportunities: ['EV adoption acceleration', 'Fleet electrification', 'Autonomous vehicle integration'],
      priority_actions: ['Secure battery supply', 'Partner with charging networks', 'Develop software capabilities'],
      investmentProfile: { carbonIntensity: 'low', transitionRisk: 'low', opportunityScore: 9 }
    },
    'sustainable-agriculture': {
      risks: ['Weather variability', 'Adoption barriers', 'Supply chain complexity'],
      opportunities: ['Precision farming growth', 'Carbon credit generation', 'Food security demand'],
      priority_actions: ['Develop climate-resilient crops', 'Implement precision tech', 'Build farmer networks'],
      investmentProfile: { carbonIntensity: 'low', transitionRisk: 'medium', opportunityScore: 8 }
    },
    'green-buildings': {
      risks: ['Construction cost premiums', 'Certification complexity', 'Market adoption pace'],
      opportunities: ['Energy cost savings', 'Green financing access', 'Tenant demand growth'],
      priority_actions: ['Optimize building performance', 'Secure green certifications', 'Implement smart systems'],
      investmentProfile: { carbonIntensity: 'low', transitionRisk: 'low', opportunityScore: 7 }
    },
    'circular-economy': {
      risks: ['Collection infrastructure', 'Technology maturity', 'Consumer behavior change'],
      opportunities: ['Waste-to-value creation', 'Resource scarcity solutions', 'Regulatory support'],
      priority_actions: ['Build collection networks', 'Develop processing technology', 'Create market demand'],
      investmentProfile: { carbonIntensity: 'low', transitionRisk: 'medium', opportunityScore: 8 }
    },
    'climate-adaptation': {
      risks: ['Uncertain climate impacts', 'Long payback periods', 'Fragmented markets'],
      opportunities: ['Infrastructure resilience demand', 'Insurance partnerships', 'Government contracts'],
      priority_actions: ['Develop predictive models', 'Build resilient infrastructure', 'Create adaptation plans'],
      investmentProfile: { carbonIntensity: 'neutral', transitionRisk: 'low', opportunityScore: 7 }
    },
    'water-management': {
      risks: ['Regulatory complexity', 'Technology costs', 'Regional variability'],
      opportunities: ['Water scarcity solutions', 'Smart water systems', 'Industrial partnerships'],
      priority_actions: ['Implement smart monitoring', 'Develop treatment technology', 'Secure water rights'],
      investmentProfile: { carbonIntensity: 'low', transitionRisk: 'low', opportunityScore: 8 }
    }
  };

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Simulate location detection for demo
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  const handleBusinessProfileSubmit = async (profile) => {
    try {
      setErrorMessage(null);
      setBusinessProfile(profile);
      setSuccessMessage('Business profile saved! Please select your location and industry.');
      setTimeout(() => setSuccessMessage(null), 3000);
      setCurrentStep('location');
    } catch (error) {
      setErrorMessage('Failed to save business profile. Please try again.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const analyzeClimateRisk = async () => {
    if (!location || !industry || !businessProfile) {
      setErrorMessage('Please complete all required fields before analyzing.');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    
    setLoading(true);
    setAiLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Traditional analysis
      const locationData = climateData[location] || climateData['New York'];
      const industryData = industryImpacts[industry] || industryImpacts['technology'];
      
      const overallRisk = calculateOverallRisk(locationData);
      const financialImpact = calculateFinancialImpact(locationData, industry);
      const incentives = findIncentives(location, industry);
      
      setAnalysis({
        location: location,
        industry: industry,
        climate: locationData,
        impacts: industryData,
        overall_risk: overallRisk,
        financial_impact: financialImpact,
        incentives: incentives,
        recommendations: generateRecommendations(locationData, industryData, overallRisk),
        trends: generateTrendData(locationData),
        riskBreakdown: generateRiskBreakdown(locationData)
      });
      
      // AI-powered analysis
      const [aiPredictions, businessContext, recommendations, realTimeData, financialModeling] = await Promise.all([
        AIService.predictClimateRisk(location, industry),
        AIService.analyzeBusinessContext(businessProfile.businessDescription, location, industry),
        AIService.generateIntelligentRecommendations(
          { predictions: [{ overallRisk: overallRisk === 'high' ? 0.8 : overallRisk === 'medium' ? 0.5 : 0.3 }] },
          { riskKeywords: ['supply-chain', 'energy'] },
          parseInt(businessProfile.budget) || 100000
        ),
        AIService.processRealTimeData(location),
        AIService.calculateFinancialImpact(
          { predictions: [{ overallRisk: 0.6 }] },
          { revenue: parseInt(businessProfile.revenue) || 1000000 }
        )
      ]);

      setAiData({
        ...aiPredictions,
        businessContext,
        recommendations,
        realTimeData,
        financialImpact: financialModeling
      });

      setCurrentStep('analysis');
      setSuccessMessage('Climate risk analysis completed successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setErrorMessage('Analysis failed. Please try again or contact support if the problem persists.');
      setTimeout(() => setErrorMessage(null), 5000);
    } finally {
      setLoading(false);
      setAiLoading(false);
    }
  };

  const calculateOverallRisk = (data) => {
    const tempRisk = data.temperature.risk === 'high' ? 3 : data.temperature.risk === 'medium' ? 2 : 1;
    const precipRisk = data.precipitation.risk === 'high' ? 3 : data.precipitation.risk === 'medium' ? 2 : 1;
    const extremeRisk = (data.extreme_events.hurricanes + data.extreme_events.flooding) > 20 ? 3 : 2;
    
    const avgRisk = (tempRisk + precipRisk + extremeRisk) / 3;
    return avgRisk > 2.5 ? 'high' : avgRisk > 1.5 ? 'medium' : 'low';
  };

  const calculateFinancialImpact = (climateData, industry) => {
    const baseImpact = {
      'manufacturing': 250000,
      'logistics': 180000,
      'retail': 120000,
      'technology': 300000
    };
    
    const riskMultiplier = climateData.temperature.risk === 'high' ? 1.8 : 1.3;
    return Math.round(baseImpact[industry] * riskMultiplier);
  };

  const findIncentives = (location, industry) => {
    const incentiveDatabase = {
      'New York': ['NY Green Building Tax Credit', 'Con Edison Energy Efficiency Programs', 'NYSERDA Clean Energy Fund'],
      'Miami': ['Florida Solar Energy System Incentives', 'Miami-Dade Energy Efficiency Programs', 'FPL Clean Energy Programs'],
      'Los Angeles': ['California Solar Initiative', 'LADWP Energy Efficiency Rebates', 'SGIP Energy Storage Incentives'],
      'Chicago': ['Illinois Solar for All', 'ComEd Energy Efficiency Programs', 'Chicago Climate Action Plan Incentives']
    };
    
    return incentiveDatabase[location] || ['Federal Investment Tax Credit', 'Energy Efficiency Tax Deductions', 'Green Building Incentives'];
  };

  const generateRecommendations = (climateData, industryData, overallRisk) => {
    const recommendations = [];
    
    if (overallRisk === 'high') {
      recommendations.push({
        priority: 'high',
        action: 'Develop comprehensive climate adaptation strategy',
        timeline: 'Immediate (0-3 months)',
        impact: 'Critical business continuity'
      });
    }
    
    if (climateData.temperature.risk === 'high') {
      recommendations.push({
        priority: 'high',
        action: 'Implement advanced cooling systems and energy efficiency measures',
        timeline: '3-6 months',
        impact: 'Reduce operational costs by 15-25%'
      });
    }
    
    recommendations.push({
      priority: 'medium',
      action: 'Establish renewable energy procurement strategy',
      timeline: '6-12 months',
      impact: 'Long-term cost stability and carbon reduction'
    });
    
    return recommendations;
  };

  const generateTrendData = (climateData) => {
    return [
      { year: '2020', temperature: climateData.temperature.current - 2, precipitation: climateData.precipitation.current + 5 },
      { year: '2021', temperature: climateData.temperature.current - 1.5, precipitation: climateData.precipitation.current + 3 },
      { year: '2022', temperature: climateData.temperature.current - 1, precipitation: climateData.precipitation.current + 1 },
      { year: '2023', temperature: climateData.temperature.current - 0.5, precipitation: climateData.precipitation.current },
      { year: '2024', temperature: climateData.temperature.current, precipitation: climateData.precipitation.current - 2 },
      { year: '2025', temperature: climateData.temperature.current + 0.5, precipitation: climateData.precipitation.current - 3 },
      { year: '2026', temperature: climateData.temperature.current + 1, precipitation: climateData.precipitation.current - 4 }
    ];
  };

  const generateRiskBreakdown = (climateData) => {
    return [
      { name: 'Temperature', value: climateData.temperature.risk === 'high' ? 35 : climateData.temperature.risk === 'medium' ? 25 : 15 },
      { name: 'Precipitation', value: climateData.precipitation.risk === 'high' ? 30 : climateData.precipitation.risk === 'medium' ? 20 : 10 },
      { name: 'Extreme Events', value: 25 },
      { name: 'Air Quality', value: 10 }
    ];
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#16a34a';
      default: return '#6b7280';
    }
  };

  const COLORS = ['#dc2626', '#d97706', '#16a34a', '#3b82f6'];

  const renderStepIndicator = () => (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      marginBottom: '2rem',
      gap: '1rem'
    }}>
      {['profile', 'location', 'analysis'].map((step, index) => (
        <div key={step} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          background: currentStep === step ? '#3b82f6' : '#e5e7eb',
          color: currentStep === step ? 'white' : '#6b7280',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <span style={{
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: currentStep === step ? 'white' : '#9ca3af',
            color: currentStep === step ? '#3b82f6' : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.8rem',
            fontWeight: '700'
          }}>
            {index + 1}
          </span>
          {step === 'profile' ? 'Business Profile' : step === 'location' ? 'Location & Industry' : 'Analysis Results'}
        </div>
      ))}
    </div>
  );

  const renderSimpleHeader = () => (
    <div style={{ 
      textAlign: 'center',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: '700', 
        margin: '0 0 0.5rem 0',
        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
      }}>
        🌍 Climate Intelligence Hub
      </h1>
      <p style={{ 
        fontSize: '1.1rem', 
        margin: 0, 
        opacity: 0.9 
      }}>
        Get instant climate insights for your business in 3 simple steps
      </p>
    </div>
  );

  return (
    <div className="container">
      <div className="card">
        {renderSimpleHeader()}
        
        {/* Error Message */}
        {errorMessage && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
              ⚠️ {errorMessage}
            </p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #22c55e',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#16a34a', margin: 0 }}>
              ✅ {successMessage}
            </p>
          </div>
        )}
        
        {/* Quick Status Cards */}
        {analysis && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem', 
            marginBottom: '2rem' 
          }}>
            <div style={{
              padding: '1rem',
              background: analysis.overall_risk === 'low' ? '#dcfce7' : analysis.overall_risk === 'medium' ? '#fef3c7' : '#fee2e2',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {analysis.overall_risk === 'low' ? '🟢' : analysis.overall_risk === 'medium' ? '🟡' : '🔴'}
              </div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Climate Risk</div>
              <div style={{ textTransform: 'uppercase', fontWeight: '700' }}>{analysis.overall_risk}</div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: '#e0f2fe',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>AI Confidence</div>
              <div style={{ fontWeight: '700' }}>94%</div>
            </div>
            
            <div style={{
              padding: '1rem',
              background: '#f0fdf4',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
              <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>Potential Savings</div>
              <div style={{ fontWeight: '700' }}>${analysis.financial_impact?.potential_savings || '50K'}</div>
            </div>
          </div>
        )}

        {/* Step Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          {['profile', 'location', 'analysis'].map((step, index) => (
            <div key={step} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              background: currentStep === step ? '#3b82f6' : '#e5e7eb',
              color: currentStep === step ? 'white' : '#6b7280',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}>
              <span style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                background: currentStep === step ? 'white' : '#9ca3af',
                color: currentStep === step ? '#3b82f6' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: '700'
              }}>
                {index + 1}
              </span>
              {step === 'profile' ? 'Business Profile' : step === 'location' ? 'Location & Industry' : 'Analysis Results'}
            </div>
          ))}
        </div>

        {currentStep === 'profile' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                Tell us about your business
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                Just a few quick details to get started
              </p>
            </div>

            <BusinessProfileForm 
              onSubmit={handleBusinessProfileSubmit}
              loading={loading}
            />
            
            {/* Data Validation Test */}
            <div style={{ marginTop: '2rem' }}>
              <DataValidationTest />
            </div>
          </div>
        )}

        {currentStep === 'location' && (
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📍</div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                Where are you located?
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                We'll check climate risks in your area
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '1rem'
                }}>
                  Choose your location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                  required
                >
                  <option value="">Select your city</option>
                  <option value="New York">🏙️ New York</option>
                  <option value="Miami">🌴 Miami</option>
                  <option value="Los Angeles">☀️ Los Angeles</option>
                  <option value="Chicago">🌆 Chicago</option>
                </select>
              </div>
              
              <div>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '600', 
                  color: '#374151',
                  fontSize: '1rem'
                }}>
                  What industry best describes your business?
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    backgroundColor: 'white',
                  }}
                  required
                >
                  <option value="">Choose your industry</option>
                  <option value="technology">💻 Technology</option>
                  <option value="retail">🛍️ Retail</option>
                  <option value="manufacturing">🏭 Manufacturing</option>
                  <option value="logistics">🚛 Transportation</option>
                  <option value="renewable-energy">⚡ Clean Energy</option>
                  <option value="sustainable-agriculture">🌾 Agriculture</option>
                  <option value="green-buildings">🏢 Construction</option>
                  <option value="other">🏢 Other</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  onClick={() => setCurrentStep('profile')}
                  style={{ 
                    flex: 1,
                    padding: '1rem',
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  ← Back
                </button>
                
                <button
                  onClick={analyzeClimateRisk}
                  disabled={!location || !industry || loading}
                  style={{ 
                    flex: 2,
                    padding: '1.2rem',
                    backgroundColor: (!location || !industry || loading) ? '#9ca3af' : '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    cursor: (!location || !industry || loading) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: (!location || !industry || loading) ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    if (location && industry && !loading) {
                      e.target.style.backgroundColor = '#2563eb';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (location && industry && !loading) {
                      e.target.style.backgroundColor = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ 
                        display: 'inline-block',
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        marginRight: '0.5rem'
                      }}></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      🔍 Analyze My Climate Risk
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {analysis && (
        <>
          {/* AI Insights Section */}
          {aiData && (
            <AIInsights 
              data={aiData}
              businessProfile={businessProfile}
              location={location}
              industry={industry}
              loading={aiLoading}
            />
          )}

          {/* Investment Metrics Section */}
          <InvestmentMetrics 
            industry={industry}
            industryData={industryImpacts[industry]}
            analysis={analysis}
          />

          {/* Portfolio Analysis Section */}
          <PortfolioAnalysis 
            industryImpacts={industryImpacts}
          />

          {/* Climate Scenario Modeling */}
          <ClimateScenarioModeling />

          {/* Simplified Results Display */}
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
              <h2 style={{ fontSize: '2rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                Your Climate Report
              </h2>
              <p style={{ color: '#6b7280', fontSize: '1.1rem', marginBottom: '1rem' }}>
                {location} • {analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1)}
              </p>
              <button
                onClick={() => {
                  setCurrentStep('profile');
                  setAnalysis(null);
                }}
                style={{ 
                  padding: '0.75rem 1.5rem',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                ← Start New Analysis
              </button>
            </div>

            {/* Main Risk Score */}
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '2rem',
              color: 'white'
            }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                {analysis.overall_risk === 'low' ? '🟢' : 
                 analysis.overall_risk === 'medium' ? '🟡' : '🔴'}
              </div>
              <h3 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                {analysis.overall_risk.toUpperCase()} RISK
              </h3>
              <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                Climate risk level for your business
              </p>
            </div>

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌡️</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Temperature
                </h4>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  {analysis.climate.temperature.current}°F
                </p>
                <p style={{ fontSize: '0.9rem', color: analysis.climate.temperature.trend > 0 ? '#dc2626' : '#16a34a' }}>
                  {analysis.climate.temperature.trend > 0 ? '↗️' : '↘️'} {Math.abs(analysis.climate.temperature.trend)}°F
                </p>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Potential Impact
                </h4>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                  ${(analysis.financial_impact / 1000).toFixed(0)}K
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  Annual exposure
                </p>
              </div>
            </div>

            {/* Top 3 Actions */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', textAlign: 'center' }}>
                🎯 Top 3 Actions for You
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analysis.recommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${index === 0 ? '#dc2626' : index === 1 ? '#f59e0b' : '#16a34a'}`
                  }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      marginRight: '1rem',
                      minWidth: '40px',
                      textAlign: 'center'
                    }}>
                      {index === 0 ? '🔥' : index === 1 ? '⚡' : '✅'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        {rec.action}
                      </h4>
                      <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {rec.timeline} • {rec.impact}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Chart */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', textAlign: 'center' }}>
                📈 Climate Trends
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analysis.trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temperature" 
                    stroke="#dc2626" 
                    strokeWidth={3} 
                    name="Temperature (°F)"
                    dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Available Help */}
             <div style={{
               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
               borderRadius: '12px',
               padding: '2rem',
               textAlign: 'center',
               color: 'white'
             }}>
               <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💡</div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                 Available Programs
               </h3>
               <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                 {analysis.incentives.slice(0, 3).map((incentive, index) => (
                   <div key={index} style={{
                     background: 'rgba(255,255,255,0.2)',
                     padding: '0.75rem 1rem',
                     borderRadius: '8px',
                     fontSize: '0.9rem',
                     fontWeight: '500'
                   }}>
                     {incentive}
                   </div>
                 ))}
               </div>
             </div>

             {/* Next Steps Call-to-Action */}
             <div style={{
               background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
               borderRadius: '12px',
               padding: '2rem',
               textAlign: 'center',
               color: 'white',
               marginTop: '2rem'
             }}>
               <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🚀</div>
               <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                 Ready to Take Action?
               </h3>
               <p style={{ fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
                 Explore funding opportunities and investment trends in climate technology
               </p>
               <button
                  onClick={() => {
                    if (onNavigateToFunding) {
                      onNavigateToFunding();
                    } else {
                      // Fallback: show message
                      setSuccessMessage('💡 Tip: Use the navigation above to explore funding opportunities!');
                      setTimeout(() => setSuccessMessage(null), 5000);
                    }
                  }}
                 style={{
                   padding: '1rem 2rem',
                   background: 'rgba(255,255,255,0.2)',
                   color: 'white',
                   border: '2px solid rgba(255,255,255,0.3)',
                   borderRadius: '8px',
                   fontSize: '1rem',
                   fontWeight: '600',
                   cursor: 'pointer',
                   transition: 'all 0.2s',
                   backdropFilter: 'blur(10px)'
                 }}
                 onMouseOver={(e) => {
                   e.target.style.background = 'rgba(255,255,255,0.3)';
                   e.target.style.transform = 'translateY(-2px)';
                 }}
                 onMouseOut={(e) => {
                   e.target.style.background = 'rgba(255,255,255,0.2)';
                   e.target.style.transform = 'translateY(0)';
                 }}
               >
                 🔍 Explore Funding Opportunities
               </button>
             </div>

             {/* Decarbonization Framework */}
             <DecarbonizationFramework 
               businessProfile={businessProfile}
               industry={industry}
               location={location}
             />

             {/* Climate Tech Funding Intelligence */}
             <div style={{ marginTop: '2rem' }}>
               <FundingTracker 
                 industry={industry}
                 location={location}
                 businessProfile={businessProfile}
               />
             </div>
           </div>
        </>
      )}
    </div>
  );
};

export default ClimateRiskAnalyzer;