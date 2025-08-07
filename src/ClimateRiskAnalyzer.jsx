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

const ClimateRiskAnalyzer = () => {
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [businessProfile, setBusinessProfile] = useState(null);
  const [aiData, setAiData] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('profile'); // 'profile', 'location', 'analysis'

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
    setBusinessProfile(profile);
    setCurrentStep('location');
  };

  const analyzeClimateRisk = async () => {
    if (!location || !industry || !businessProfile) return;
    
    setLoading(true);
    setAiLoading(true);
    
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
      
    } catch (error) {
      console.error('Analysis failed:', error);
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
      alignItems: 'center', 
      marginBottom: '2rem',
      padding: '1rem',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px'
    }}>
      {[
        { id: 'profile', label: 'Business Profile', icon: Brain },
        { id: 'location', label: 'Location & Industry', icon: MapPin },
        { id: 'analysis', label: 'AI Analysis', icon: Sparkles }
      ].map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = 
          (step.id === 'profile' && businessProfile) ||
          (step.id === 'location' && businessProfile && location && industry) ||
          (step.id === 'analysis' && analysis);
        
        return (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: isCompleted ? '#16a34a' : isActive ? '#3b82f6' : '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCompleted || isActive ? 'white' : '#6b7280',
              transition: 'all 0.3s ease'
            }}>
              <Icon size={24} />
            </div>
            <div style={{ 
              marginLeft: '0.75rem',
              marginRight: index < 2 ? '2rem' : 0
            }}>
              <div style={{ 
                fontWeight: '600', 
                color: isCompleted ? '#16a34a' : isActive ? '#3b82f6' : '#6b7280',
                fontSize: '0.9rem'
              }}>
                {step.label}
              </div>
            </div>
            {index < 2 && (
              <div style={{
                width: '40px',
                height: '2px',
                background: isCompleted ? '#16a34a' : '#e5e7eb',
                marginLeft: '1rem'
              }} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="container">
      <div className="card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
            <Leaf size={48} style={{ color: '#10b981' }} />
            <h1 className="gradient-text" style={{ fontSize: '3.2rem', fontWeight: '800', marginBottom: '0', lineHeight: '1.1' }}>
              🌍 Climate Intelligence Hub
            </h1>
            <Wind size={48} style={{ color: '#059669' }} />
          </div>
          <p style={{ fontSize: '1.3rem', color: '#047857', maxWidth: '700px', margin: '0 auto 1rem', fontWeight: '500' }}>
            AI-Powered Environmental Risk Assessment & Sustainability Intelligence Platform
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.95rem', color: '#065f46', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Thermometer size={16} />
              Climate Analysis
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={16} />
              AI Predictions
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} />
              Risk Mitigation
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={16} />
              Action Plans
            </span>
          </div>
        </div>

        {renderStepIndicator()}

        {currentStep === 'profile' && (
          <>
            <BusinessProfileForm 
              onSubmit={handleBusinessProfileSubmit}
              loading={loading}
            />
            
            {/* Data Validation Test */}
            <div style={{ marginTop: '2rem' }}>
              <DataValidationTest />
            </div>
          </>
        )}

        {currentStep === 'location' && (
          <>
            <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Location
                </label>
                <select
                  className="select"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Select a location</option>
                  <option value="New York">New York</option>
                  <option value="Miami">Miami</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>
                  <BarChart3 size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  Industry
                </label>
                <select
                  className="select"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option value="">Select an industry</option>
                  
                  <optgroup label="🏭 Traditional Industries">
                    <option value="manufacturing">Manufacturing</option>
                    <option value="logistics">Logistics & Transportation</option>
                    <option value="retail">Retail & Consumer</option>
                    <option value="technology">Technology & Software</option>
                  </optgroup>
                  
                  <optgroup label="🌱 Climate Investment Sectors">
                    <option value="renewable-energy">Renewable Energy</option>
                    <option value="carbon-removal">Carbon Removal & Credits</option>
                    <option value="clean-transportation">Clean Transportation</option>
                    <option value="sustainable-agriculture">Sustainable Agriculture</option>
                    <option value="green-buildings">Green Buildings & Infrastructure</option>
                    <option value="circular-economy">Circular Economy & Waste</option>
                    <option value="climate-adaptation">Climate Adaptation & Resilience</option>
                    <option value="water-management">Water Management & Tech</option>
                  </optgroup>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                className="btn"
                onClick={() => setCurrentStep('profile')}
                style={{ 
                  flex: 1, 
                  background: '#6b7280',
                  fontSize: '1rem', 
                  padding: '0.75rem' 
                }}
              >
                ← Back to Profile
              </button>
              
              <button
                className="btn"
                onClick={analyzeClimateRisk}
                disabled={!location || !industry || loading}
                style={{ 
                  flex: 2, 
                  fontSize: '1.1rem', 
                  padding: '1rem' 
                }}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner" style={{ marginRight: '0.5rem' }}></span>
                    AI is analyzing your climate risks...
                  </>
                ) : (
                  <>
                    <Brain size={20} style={{ marginRight: '0.5rem' }} />
                    Generate AI Analysis
                  </>
                )}
              </button>
            </div>
          </>
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

          {/* Risk Overview */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center', margin: 0 }}>
                <Sparkles size={24} style={{ marginRight: '0.5rem', color: '#8b5cf6' }} />
                Traditional Risk Analysis - {analysis.location}
              </h2>
              <button
                className="btn"
                onClick={() => setCurrentStep('location')}
                style={{ 
                  background: '#6b7280',
                  fontSize: '0.9rem', 
                  padding: '0.5rem 1rem' 
                }}
              >
                ← New Analysis
              </button>
            </div>
            
            <div className="grid grid-4">
              <div className="metric-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={40} color={getRiskColor(analysis.overall_risk)} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Overall Risk</h3>
                <span className={`risk-badge risk-${analysis.overall_risk}`}>
                  {analysis.overall_risk.toUpperCase()}
                </span>
              </div>

              <div className="metric-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  <Thermometer size={40} color={getRiskColor(analysis.climate.temperature.risk)} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Temperature</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  {analysis.climate.temperature.current}°F
                </p>
                <p style={{ fontSize: '0.9rem', color: analysis.climate.temperature.trend > 0 ? '#dc2626' : '#16a34a' }}>
                  {analysis.climate.temperature.trend > 0 ? '+' : ''}{analysis.climate.temperature.trend}°F trend
                </p>
              </div>

              <div className="metric-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  <Droplets size={40} color={getRiskColor(analysis.climate.precipitation.risk)} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Precipitation</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1f2937' }}>
                  {analysis.climate.precipitation.current}"
                </p>
                <p style={{ fontSize: '0.9rem', color: analysis.climate.precipitation.trend > 0 ? '#16a34a' : '#dc2626' }}>
                  {analysis.climate.precipitation.trend > 0 ? '+' : ''}{analysis.climate.precipitation.trend}" trend
                </p>
              </div>

              <div className="metric-card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                  <DollarSign size={40} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Financial Impact</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#dc2626' }}>
                  ${analysis.financial_impact.toLocaleString()}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Annual risk exposure</p>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Climate Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analysis.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="temperature" stroke="#dc2626" strokeWidth={3} name="Temperature (°F)" />
                  <Line type="monotone" dataKey="precipitation" stroke="#3b82f6" strokeWidth={3} name="Precipitation (in)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Risk Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analysis.riskBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analysis.riskBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Industry Impacts */}
          <div className="card">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              Industry-Specific Impacts - {analysis.industry.charAt(0).toUpperCase() + analysis.industry.slice(1)}
            </h3>
            
            <div className="grid grid-3">
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#dc2626', display: 'flex', alignItems: 'center' }}>
                  <AlertTriangle size={18} style={{ marginRight: '0.5rem' }} />
                  Key Risks
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {analysis.impacts.risks.map((risk, index) => (
                    <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#16a34a', display: 'flex', alignItems: 'center' }}>
                  <Leaf size={18} style={{ marginRight: '0.5rem' }} />
                  Opportunities
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {analysis.impacts.opportunities.map((opportunity, index) => (
                    <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                  <Target size={18} style={{ marginRight: '0.5rem' }} />
                  Priority Actions
                </h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {analysis.impacts.priority_actions.map((action, index) => (
                    <li key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.5rem' }}>
              AI-Generated Recommendations
            </h3>
            
            <div className="grid" style={{ gap: '1rem' }}>
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="metric-card" style={{ borderLeft: `4px solid ${getRiskColor(rec.priority)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span className={`risk-badge risk-${rec.priority}`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>{rec.timeline}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    {rec.action}
                  </h4>
                  <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                    Expected Impact: {rec.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Incentives */}
          <div className="card">
            <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
              <Zap size={20} style={{ marginRight: '0.5rem' }} />
              Available Incentives & Programs
            </h3>
            
            <div className="grid grid-3">
              {analysis.incentives.map((incentive, index) => (
                <div key={index} className="metric-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#1f2937' }}>
                    {incentive}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClimateRiskAnalyzer;