import React, { useState } from 'react';
import { 
  Leaf, 
  Zap, 
  Recycle, 
  Shield, 
  BarChart3, 
  ChevronRight, 
  Clock, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ClimateActionPlan = ({ actionPlan, businessProfile }) => {
  const [activeCategory, setActiveCategory] = useState('decarbonization');
  const [selectedAction, setSelectedAction] = useState(null);

  const categoryIcons = {
    decarbonization: Leaf,
    energy_transition: Zap,
    resource_optimization: Recycle,
    climate_adaptation: Shield,
    data_intelligence: BarChart3
  };

  const categoryTitles = {
    decarbonization: 'Decarbonization',
    energy_transition: 'Energy Transition',
    resource_optimization: 'Resource Optimization',
    climate_adaptation: 'Climate Adaptation',
    data_intelligence: 'Data & Intelligence'
  };

  const categoryDescriptions = {
    decarbonization: 'Direct removal or reduction of carbon emissions across industries',
    energy_transition: 'Facilitating the shift from fossil fuels to renewable energy systems',
    resource_optimization: 'Improving efficiency of existing systems to reduce environmental impact',
    climate_adaptation: 'Building resilience against climate change impacts',
    data_intelligence: 'Providing measurement, monitoring, and optimization tools for climate action'
  };

  const getImpactColor = (impact) => {
    const colors = {
      'baseline-establishment': '#6b7280',
      'direct-reduction': '#10b981',
      'process-efficiency': '#3b82f6',
      'transport-decarbonization': '#8b5cf6',
      'energy-planning': '#f59e0b',
      'renewable-generation': '#10b981',
      'energy-optimization': '#3b82f6',
      'waste-minimization': '#ef4444',
      'water-conservation': '#06b6d4',
      'resource-circularity': '#8b5cf6',
      'risk-assessment': '#f59e0b',
      'physical-adaptation': '#10b981',
      'risk-mitigation': '#ef4444',
      'data-visibility': '#3b82f6',
      'predictive-insights': '#8b5cf6',
      'compliance-automation': '#10b981'
    };
    return colors[impact] || '#6b7280';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderActionCard = (action, index) => (
    <div 
      key={action.id}
      className="action-card"
      onClick={() => setSelectedAction(action)}
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1rem',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: selectedAction?.id === action.id ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            color: '#1f2937', 
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: getImpactColor(action.impact),
                marginRight: '0.75rem'
              }}
            />
            {action.title}
          </h4>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {action.description}
          </p>
        </div>
        <ChevronRight size={20} style={{ color: '#9ca3af', marginLeft: '1rem' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DollarSign size={16} style={{ color: '#ef4444' }} />
          <span style={{ fontSize: '0.9rem', color: '#374151' }}>{formatCurrency(action.cost)}</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={16} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '0.9rem', color: '#374151' }}>{action.timeframe}</span>
        </div>

        {action.carbonReduction && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={16} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.9rem', color: '#374151' }}>{action.carbonReduction}% CO₂↓</span>
          </div>
        )}

        {action.energySavings && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={16} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.9rem', color: '#374151' }}>{action.energySavings}% Energy↓</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderCategoryOverview = () => (
    <div style={{ marginBottom: '2rem' }}>
      <div className="climate-action-overview" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '16px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
          Climate Action Impact Summary
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {actionPlan.totalImpact.totalCarbonReduction}%
            </div>
            <div style={{ opacity: 0.9 }}>Total Carbon Reduction</div>
          </div>
          
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {formatCurrency(actionPlan.totalImpact.totalCost)}
            </div>
            <div style={{ opacity: 0.9 }}>Total Investment</div>
          </div>
          
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {actionPlan.totalImpact.averageImplementationTime}
            </div>
            <div style={{ opacity: 0.9 }}>Avg. Implementation (months)</div>
          </div>
          
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700' }}>
              {actionPlan.totalImpact.riskReductionPotential}%
            </div>
            <div style={{ opacity: 0.9 }}>Risk Reduction Potential</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="timeline-section" style={{ marginTop: '2rem' }}>
      <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
        Implementation Timeline
      </h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
        {Object.entries(actionPlan.timeline).map(([period, actions]) => (
          <div key={period} className="timeline-card" style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <h5 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              marginBottom: '1rem',
              color: '#1f2937',
              textTransform: 'capitalize'
            }}>
              {period.replace(/([A-Z])/g, ' $1').trim()}
            </h5>
            
            <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
              {actions.length} action{actions.length !== 1 ? 's' : ''}
            </div>
            
            {actions.slice(0, 3).map((action, index) => (
              <div key={action.id} style={{
                padding: '0.5rem',
                background: '#f9fafb',
                borderRadius: '6px',
                marginBottom: '0.5rem',
                fontSize: '0.8rem',
                color: '#374151'
              }}>
                {action.title}
              </div>
            ))}
            
            {actions.length > 3 && (
              <div style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>
                +{actions.length - 3} more actions
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="climate-action-plan">
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          color: '#1f2937',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Leaf size={28} style={{ marginRight: '0.75rem', color: '#10b981' }} />
          AI-Powered Climate Action Plan
        </h2>
        
        <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          Comprehensive climate action strategy tailored to your business profile, industry, and location.
        </p>

        {renderCategoryOverview()}

        {/* Category Navigation */}
        <div className="category-nav" style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {Object.entries(actionPlan.categories).map(([key, actions]) => {
            const Icon = categoryIcons[key];
            const isActive = activeCategory === key;
            
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '25px',
                  background: isActive ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
                  color: isActive ? 'white' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                  fontWeight: '600'
                }}
              >
                <Icon size={16} />
                {categoryTitles[key]}
                <span style={{
                  background: isActive ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                  color: isActive ? 'white' : '#6b7280',
                  padding: '0.2rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {actions.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Category Content */}
        <div className="category-content">
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1.3rem', 
              fontWeight: '600', 
              color: '#1f2937',
              marginBottom: '0.5rem'
            }}>
              {categoryTitles[activeCategory]}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {categoryDescriptions[activeCategory]}
            </p>
          </div>

          <div className="actions-list">
            {actionPlan.categories[activeCategory]?.map((action, index) => 
              renderActionCard(action, index)
            )}
          </div>
        </div>

        {renderTimeline()}
      </div>

      {/* Action Detail Modal */}
      {selectedAction && (
        <div 
          className="action-modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setSelectedAction(null)}
        >
          <div 
            className="action-modal"
            style={{
              background: 'white',
              borderRadius: '16px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                {selectedAction.title}
              </h3>
              <button
                onClick={() => setSelectedAction(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                ×
              </button>
            </div>
            
            <p style={{ color: '#6b7280', fontSize: '1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              {selectedAction.description}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="detail-item" style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Investment</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                  {formatCurrency(selectedAction.cost)}
                </div>
              </div>
              
              <div className="detail-item" style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Timeline</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                  {selectedAction.timeframe}
                </div>
              </div>
              
              <div className="detail-item" style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Impact Type</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                  {selectedAction.impact.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClimateActionPlan;