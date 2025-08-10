import React, { useState } from 'react';
import { Building, Users, DollarSign, MapPin, FileText, Zap } from 'lucide-react';

const BusinessProfileForm = ({ onSubmit, loading }) => {
  const [profile, setProfile] = useState({
    businessDescription: '',
    revenue: '',
    employees: '',
    priorities: []
  });

  const priorityOptions = [
    { id: 'cost-reduction', label: '💰 Save Money', icon: DollarSign },
    { id: 'sustainability', label: '🌱 Go Green', icon: Zap },
    { id: 'compliance', label: '📋 Meet Regulations', icon: FileText },
    { id: 'resilience', label: '🛡️ Reduce Risk', icon: Building }
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem', 
          fontWeight: '600', 
          color: '#374151',
          fontSize: '1rem'
        }}>
          What does your business do?
        </label>
        <textarea
          value={profile.businessDescription}
          onChange={(e) => setProfile({...profile, businessDescription: e.target.value})}
          placeholder="e.g., We make eco-friendly packaging for restaurants"
          rows="3"
          style={{
            width: '100%',
            padding: '1rem',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            fontSize: '1rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          required
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem', 
            fontWeight: '600', 
            color: '#374151',
            fontSize: '1rem'
          }}>
            Annual Revenue
          </label>
          <select
            value={profile.revenue}
            onChange={(e) => setProfile({...profile, revenue: e.target.value})}
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
            <option value="">Choose range</option>
            <option value="100000">💵 Under $100K</option>
            <option value="500000">💰 $100K - $500K</option>
            <option value="1000000">💎 $500K - $1M</option>
            <option value="5000000">🏆 $1M - $5M</option>
            <option value="10000000">🚀 $5M+</option>
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
            Team Size
          </label>
          <select
            value={profile.employees}
            onChange={(e) => setProfile({...profile, employees: e.target.value})}
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
            <option value="">Choose size</option>
            <option value="10">👤 1-10 people</option>
            <option value="50">👥 11-50 people</option>
            <option value="200">🏢 51-200 people</option>
            <option value="500">🏬 201+ people</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: '1rem', 
          fontWeight: '600', 
          color: '#374151',
          fontSize: '1rem'
        }}>
          What are your main goals? (Pick any that apply)
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
          {priorityOptions.map((priority) => {
            const isSelected = profile.priorities.includes(priority.id);
            return (
              <div
                key={priority.id}
                onClick={() => handlePriorityToggle(priority.id)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: isSelected ? '#eff6ff' : 'white',
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  fontWeight: '600'
                }}
              >
                <div style={{ 
                  color: isSelected ? '#3b82f6' : '#374151'
                }}>
                  {priority.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '1.2rem 2rem',
          backgroundColor: loading ? '#9ca3af' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginTop: '1rem',
          boxShadow: loading ? 'none' : '0 4px 12px rgba(59, 130, 246, 0.3)'
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.target.style.backgroundColor = '#2563eb';
            e.target.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
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
            Analyzing your business...
          </>
        ) : (
          <>
            🚀 Get My Climate Analysis
          </>
        )}
      </button>

      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        background: '#f0fdf4', 
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤖</div>
        <div style={{ fontSize: '0.9rem', color: '#166534', fontWeight: '500' }}>
          Our AI will analyze your business and provide personalized climate insights in seconds!
        </div>
      </div>
    </form>
  );
};

export default BusinessProfileForm;