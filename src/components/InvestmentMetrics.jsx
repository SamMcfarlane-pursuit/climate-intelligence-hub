import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Target, Leaf, Shield, Award, AlertTriangle } from 'lucide-react';

const InvestmentMetrics = ({ industry, industryData, analysis }) => {
  if (!industryData?.investmentProfile) {
    return null;
  }

  const { investmentProfile } = industryData;
  
  // Calculate ESG Score based on carbon intensity and opportunity score
  const calculateESGScore = () => {
    const carbonScore = {
      'negative': 100,
      'low': 85,
      'medium': 65,
      'high': 40,
      'neutral': 75
    }[investmentProfile.carbonIntensity] || 50;
    
    const opportunityWeight = investmentProfile.opportunityScore * 8;
    return Math.round((carbonScore + opportunityWeight) / 2);
  };

  const esgScore = calculateESGScore();
  
  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    return '#dc2626';
  };

  const getCarbonIntensityColor = (intensity) => {
    const colors = {
      'negative': '#16a34a',
      'low': '#65a30d',
      'medium': '#ca8a04',
      'high': '#dc2626',
      'neutral': '#6b7280'
    };
    return colors[intensity] || '#6b7280';
  };

  const getTransitionRiskColor = (risk) => {
    const colors = {
      'low': '#16a34a',
      'medium': '#ca8a04',
      'high': '#dc2626'
    };
    return colors[risk] || '#6b7280';
  };

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
        <TrendingUp size={24} style={{ marginRight: '0.5rem', color: '#16a34a' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Investment Analysis
        </h2>
      </div>

      <div className="grid grid-4">
        {/* ESG Score */}
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Award size={40} color={getScoreColor(esgScore)} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>ESG Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: getScoreColor(esgScore) }}>
            {esgScore}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            {esgScore >= 80 ? 'Excellent' : esgScore >= 60 ? 'Good' : 'Needs Improvement'}
          </p>
        </div>

        {/* Carbon Intensity */}
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Leaf size={40} color={getCarbonIntensityColor(investmentProfile.carbonIntensity)} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Carbon Impact</h3>
          <p style={{ 
            fontSize: '1.2rem', 
            fontWeight: '700', 
            color: getCarbonIntensityColor(investmentProfile.carbonIntensity),
            textTransform: 'capitalize'
          }}>
            {investmentProfile.carbonIntensity}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            {investmentProfile.carbonIntensity === 'negative' ? 'Carbon Negative' : 'Intensity Level'}
          </p>
        </div>

        {/* Transition Risk */}
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Shield size={40} color={getTransitionRiskColor(investmentProfile.transitionRisk)} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Transition Risk</h3>
          <p style={{ 
            fontSize: '1.2rem', 
            fontWeight: '700', 
            color: getTransitionRiskColor(investmentProfile.transitionRisk),
            textTransform: 'capitalize'
          }}>
            {investmentProfile.transitionRisk}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Climate transition exposure
          </p>
        </div>

        {/* Investment Opportunity */}
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Target size={40} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Opportunity Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>
            {investmentProfile.opportunityScore}/10
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            Climate opportunity potential
          </p>
        </div>
      </div>

      {/* Investment Insights */}
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
          <DollarSign size={20} style={{ marginRight: '0.5rem' }} />
          Investment Thesis
        </h3>
        
        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              Key Investment Drivers
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151' }}>
              {industryData.opportunities.map((opportunity, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  {opportunity}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              Risk Considerations
            </h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#374151' }}>
              {industryData.risks.map((risk, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Investment Recommendation */}
        <div style={{ 
          marginTop: '1.5rem', 
          padding: '1rem',
          background: esgScore >= 70 ? '#dcfce7' : '#fef3c7',
          borderRadius: '8px',
          border: `1px solid ${esgScore >= 70 ? '#16a34a' : '#ca8a04'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
            {esgScore >= 70 ? (
              <TrendingUp size={18} color="#16a34a" style={{ marginRight: '0.5rem' }} />
            ) : (
              <AlertTriangle size={18} color="#ca8a04" style={{ marginRight: '0.5rem' }} />
            )}
            <span style={{ 
              fontWeight: '600', 
              color: esgScore >= 70 ? '#16a34a' : '#ca8a04'
            }}>
              Investment Recommendation: {esgScore >= 70 ? 'FAVORABLE' : 'CAUTIOUS'}
            </span>
          </div>
          <p style={{ 
            margin: 0, 
            fontSize: '0.95rem', 
            color: '#374151',
            lineHeight: '1.5'
          }}>
            {esgScore >= 70 
              ? `Strong ESG profile with ${investmentProfile.carbonIntensity} carbon intensity and ${investmentProfile.transitionRisk} transition risk. High opportunity score of ${investmentProfile.opportunityScore}/10 indicates significant climate-aligned growth potential.`
              : `Moderate ESG profile requires careful due diligence. Consider transition risk mitigation strategies and monitor regulatory developments in this sector.`
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvestmentMetrics;