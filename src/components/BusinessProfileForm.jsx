import React, { useState } from 'react';
import { Building, Users, DollarSign, MapPin, FileText, Zap } from 'lucide-react';

const BusinessProfileForm = ({ onSubmit, loading }) => {
  const [profile, setProfile] = useState({
    businessDescription: '',
    revenue: '',
    employees: '',
    budget: '',
    priorities: []
  });

  const priorityOptions = [
    { id: 'cost-reduction', label: 'Cost Reduction', icon: DollarSign },
    { id: 'sustainability', label: 'Sustainability Goals', icon: Zap },
    { id: 'compliance', label: 'Regulatory Compliance', icon: FileText },
    { id: 'resilience', label: 'Business Resilience', icon: Building }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(profile);
  };

  const handlePriorityToggle = (priorityId) => {
    setProfile(prev => ({
      ...prev,
      priorities: prev.priorities.includes(priorityId)
        ? prev.priorities.filter(p => p !== priorityId)
        : [...prev.priorities, priorityId]
    }));
  };

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Building size={48} color="#3b82f6" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          Business Profile Setup
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          Help our AI understand your business for personalized climate risk analysis
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '1rem'
          }}>
            <FileText size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Business Description
          </label>
          <textarea
            className="input"
            value={profile.businessDescription}
            onChange={(e) => setProfile(prev => ({ ...prev, businessDescription: e.target.value }))}
            placeholder="Describe your business operations, key activities, and climate concerns..."
            rows={4}
            style={{ resize: 'vertical', minHeight: '100px' }}
          />
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.25rem' }}>
            Our AI will analyze this to identify climate-specific risks and opportunities
          </p>
        </div>

        <div className="grid grid-2" style={{ marginBottom: '1.5rem' }}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#374151'
            }}>
              <DollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Annual Revenue
            </label>
            <select
              className="select"
              value={profile.revenue}
              onChange={(e) => setProfile(prev => ({ ...prev, revenue: e.target.value }))}
            >
              <option value="">Select revenue range</option>
              <option value="500000">Under $500K</option>
              <option value="1000000">$500K - $1M</option>
              <option value="5000000">$1M - $5M</option>
              <option value="10000000">$5M - $10M</option>
              <option value="50000000">$10M - $50M</option>
              <option value="100000000">$50M+</option>
            </select>
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600', 
              color: '#374151'
            }}>
              <Users size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
              Number of Employees
            </label>
            <select
              className="select"
              value={profile.employees}
              onChange={(e) => setProfile(prev => ({ ...prev, employees: e.target.value }))}
            >
              <option value="">Select employee count</option>
              <option value="10">1-10</option>
              <option value="50">11-50</option>
              <option value="200">51-200</option>
              <option value="500">201-500</option>
              <option value="1000">501-1000</option>
              <option value="5000">1000+</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600', 
            color: '#374151'
          }}>
            <DollarSign size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Climate Investment Budget
          </label>
          <select
            className="select"
            value={profile.budget}
            onChange={(e) => setProfile(prev => ({ ...prev, budget: e.target.value }))}
          >
            <option value="">Select budget range</option>
            <option value="25000">Under $25K</option>
            <option value="50000">$25K - $50K</option>
            <option value="100000">$50K - $100K</option>
            <option value="250000">$100K - $250K</option>
            <option value="500000">$250K - $500K</option>
            <option value="1000000">$500K+</option>
          </select>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '1rem'
          }}>
            Business Priorities (Select all that apply)
          </label>
          <div className="grid grid-2">
            {priorityOptions.map((priority) => {
              const Icon = priority.icon;
              const isSelected = profile.priorities.includes(priority.id);
              
              return (
                <div
                  key={priority.id}
                  onClick={() => handlePriorityToggle(priority.id)}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: isSelected ? '#eff6ff' : 'white',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Icon 
                    size={20} 
                    color={isSelected ? '#3b82f6' : '#6b7280'} 
                    style={{ marginRight: '0.75rem' }} 
                  />
                  <span style={{ 
                    fontWeight: isSelected ? '600' : '400',
                    color: isSelected ? '#3b82f6' : '#374151'
                  }}>
                    {priority.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          className="btn"
          disabled={!profile.businessDescription || !profile.revenue || loading}
          style={{ 
            width: '100%', 
            fontSize: '1.1rem', 
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {loading ? (
            <>
              <span className="loading-spinner" style={{ marginRight: '0.5rem' }}></span>
              AI is analyzing your business profile...
            </>
          ) : (
            <>
              <Zap size={20} style={{ marginRight: '0.5rem' }} />
              Generate AI-Powered Analysis
            </>
          )}
        </button>
      </form>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f0f9ff', 
        borderRadius: '8px',
        border: '1px solid #bae6fd'
      }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#0369a1' }}>
          🤖 AI-Enhanced Analysis Includes:
        </h4>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          fontSize: '0.9rem', 
          color: '#0c4a6e' 
        }}>
          <li style={{ marginBottom: '0.25rem' }}>• Natural language processing of your business description</li>
          <li style={{ marginBottom: '0.25rem' }}>• Predictive risk modeling based on your industry and size</li>
          <li style={{ marginBottom: '0.25rem' }}>• Personalized recommendations within your budget</li>
          <li style={{ marginBottom: '0.25rem' }}>• Real-time climate data integration and forecasting</li>
          <li>• Financial impact modeling with ROI calculations</li>
        </ul>
      </div>
    </div>
  );
};

export default BusinessProfileForm;