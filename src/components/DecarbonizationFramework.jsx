import React, { useState } from 'react';
import { 
  Building2, 
  AlertTriangle, 
  Target, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Truck,
  Zap,
  DollarSign,
  Leaf
} from 'lucide-react';

const DecarbonizationFramework = ({ businessProfile, industry, location }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Industry-specific framework data
  const frameworkData = {
    logistics: {
      baseline: {
        activities: "Driving routes, fueling vehicles",
        assets: "A fleet of 20 diesel vans",
        icon: "🚛",
        emissions: "High Scope 1 emissions"
      },
      concern: {
        hotspot: "Scope 1 emissions from diesel fuel combustion",
        risks: "Volatile fuel costs, high maintenance, and city emissions fines",
        icon: "⚠️",
        urgency: "High"
      },
      lever: {
        action: "Fleet Electrification—replacing diesel vans with electric ones",
        impact: "80% reduction in operational emissions",
        icon: "⚡",
        timeline: "2-3 years"
      },
      barrier: {
        obstacle: "Prohibitive upfront capital expenditure (CAPEX) for new electric vehicles and charging infrastructure",
        cost: "$50,000+ per vehicle",
        icon: "💰",
        severity: "High"
      },
      bridge: {
        solution: "Our platform simplifies access to the Commercial Clean Vehicle Tax Credit, directly reducing the upfront CAPEX of each new EV",
        savings: "Up to $40,000 per vehicle",
        icon: "🌉",
        benefit: "Immediate cost reduction"
      }
    },
    manufacturing: {
      baseline: {
        activities: "Production processes, facility operations",
        assets: "Manufacturing equipment, industrial facilities",
        icon: "🏭",
        emissions: "High energy consumption"
      },
      concern: {
        hotspot: "Energy-intensive production processes and facility heating",
        risks: "Rising energy costs, carbon pricing, regulatory compliance",
        icon: "⚠️",
        urgency: "Medium-High"
      },
      lever: {
        action: "Industrial Energy Efficiency & Renewable Energy Integration",
        impact: "40-60% reduction in energy costs",
        icon: "⚡",
        timeline: "1-2 years"
      },
      barrier: {
        obstacle: "High upfront investment in energy-efficient equipment and renewable energy systems",
        cost: "$100,000+ for comprehensive upgrades",
        icon: "💰",
        severity: "High"
      },
      bridge: {
        solution: "Access to energy efficiency tax credits and renewable energy incentives through our platform",
        savings: "30-50% of upgrade costs covered",
        icon: "🌉",
        benefit: "Reduced payback period"
      }
    },
    retail: {
      baseline: {
        activities: "Store operations, inventory management",
        assets: "Retail locations, HVAC systems, lighting",
        icon: "🛍️",
        emissions: "Building energy consumption"
      },
      concern: {
        hotspot: "Store energy consumption for lighting, heating, and cooling",
        risks: "Rising utility costs, customer sustainability expectations",
        icon: "⚠️",
        urgency: "Medium"
      },
      lever: {
        action: "Smart Building Technology & LED Lighting Upgrades",
        impact: "30-50% reduction in energy costs",
        icon: "💡",
        timeline: "6-12 months"
      },
      barrier: {
        obstacle: "Upfront costs for smart systems and LED retrofits across multiple locations",
        cost: "$20,000+ per location",
        icon: "💰",
        severity: "Medium"
      },
      bridge: {
        solution: "Utility rebates and energy efficiency financing programs accessible through our platform",
        savings: "50-70% of upgrade costs covered",
        icon: "🌉",
        benefit: "Fast ROI"
      }
    },
    technology: {
      baseline: {
        activities: "Data center operations, office facilities",
        assets: "Servers, cooling systems, office buildings",
        icon: "💻",
        emissions: "Data center energy consumption"
      },
      concern: {
        hotspot: "Data center cooling and server energy consumption",
        risks: "Increasing energy costs, talent retention, regulatory reporting",
        icon: "⚠️",
        urgency: "Medium"
      },
      lever: {
        action: "Renewable Energy Procurement & Data Center Optimization",
        impact: "Carbon neutral operations",
        icon: "🌱",
        timeline: "1-2 years"
      },
      barrier: {
        obstacle: "Complex renewable energy contracts and data center efficiency investments",
        cost: "Long-term PPA commitments",
        icon: "💰",
        severity: "Medium"
      },
      bridge: {
        solution: "Simplified renewable energy procurement and efficiency financing through our platform",
        savings: "Predictable energy costs",
        icon: "🌉",
        benefit: "Cost certainty"
      }
    }
  };

  const currentFramework = frameworkData[industry] || frameworkData.logistics;

  const steps = [
    {
      number: 1,
      title: "Baseline Operations",
      subtitle: "Your current business activities",
      data: currentFramework.baseline,
      color: "#6b7280"
    },
    {
      number: 2,
      title: "Climate Concern",
      subtitle: "Your biggest emissions risk",
      data: currentFramework.concern,
      color: "#dc2626"
    },
    {
      number: 3,
      title: "Decarbonization Lever",
      subtitle: "Your most impactful action",
      data: currentFramework.lever,
      color: "#16a34a"
    },
    {
      number: 4,
      title: "Barrier to Action",
      subtitle: "What's stopping you",
      data: currentFramework.barrier,
      color: "#f59e0b"
    },
    {
      number: 5,
      title: "Our Bridge",
      subtitle: "How we help you succeed",
      data: currentFramework.bridge,
      color: "#3b82f6"
    }
  ];

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      marginBottom: '2rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
          Your Decarbonization Roadmap
        </h2>
        <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
          A clear 5-step path to reduce emissions and save money
        </p>
      </div>

      {/* Step Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        {steps.map((step, index) => (
          <button
            key={step.number}
            onClick={() => setCurrentStep(step.number)}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: currentStep === step.number ? step.color : '#f3f4f6',
              color: currentStep === step.number ? 'white' : '#6b7280',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}
          >
            {step.number}. {step.title}
          </button>
        ))}
      </div>

      {/* Current Step Display */}
      {steps.map((step) => (
        currentStep === step.number && (
          <div key={step.number} style={{
            background: `linear-gradient(135deg, ${step.color}15, ${step.color}05)`,
            borderRadius: '12px',
            padding: '2rem',
            border: `2px solid ${step.color}30`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                fontSize: '3rem',
                marginRight: '1rem'
              }}>
                {step.data.icon}
              </div>
              <div>
                <h3 style={{ 
                  fontSize: '1.8rem', 
                  fontWeight: '700', 
                  color: step.color,
                  marginBottom: '0.25rem'
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                  {step.subtitle}
                </p>
              </div>
            </div>

            {/* Step Content */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              {step.number === 1 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Building2 size={20} color={step.color} />
                    <div>
                      <strong>Activities:</strong> {step.data.activities}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Truck size={20} color={step.color} />
                    <div>
                      <strong>Assets:</strong> {step.data.assets}
                    </div>
                  </div>
                </>
              )}

              {step.number === 2 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertTriangle size={20} color={step.color} />
                    <div>
                      <strong>Hotspot:</strong> {step.data.hotspot}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Shield size={20} color={step.color} />
                    <div>
                      <strong>Risks:</strong> {step.data.risks}
                    </div>
                  </div>
                </>
              )}

              {step.number === 3 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Target size={20} color={step.color} />
                    <div>
                      <strong>Action:</strong> {step.data.action}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Leaf size={20} color={step.color} />
                    <div>
                      <strong>Impact:</strong> {step.data.impact}
                    </div>
                  </div>
                </>
              )}

              {step.number === 4 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <DollarSign size={20} color={step.color} />
                    <div>
                      <strong>Obstacle:</strong> {step.data.obstacle}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <AlertTriangle size={20} color={step.color} />
                    <div>
                      <strong>Cost:</strong> {step.data.cost}
                    </div>
                  </div>
                </>
              )}

              {step.number === 5 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <CheckCircle size={20} color={step.color} />
                    <div>
                      <strong>Solution:</strong> {step.data.solution}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <DollarSign size={20} color={step.color} />
                    <div>
                      <strong>Savings:</strong> {step.data.savings}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '2rem',
              alignItems: 'center'
            }}>
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: currentStep === 1 ? '#e5e7eb' : '#6b7280',
                  color: 'white',
                  fontWeight: '600',
                  cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                ← Previous
              </button>

              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                {steps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: index + 1 === currentStep ? step.color : '#e5e7eb'
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                disabled={currentStep === 5}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: currentStep === 5 ? '#e5e7eb' : step.color,
                  color: 'white',
                  fontWeight: '600',
                  cursor: currentStep === 5 ? 'not-allowed' : 'pointer'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        )
      ))}

      {/* Call to Action */}
      {currentStep === 5 && (
        <div style={{
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          marginTop: '2rem',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
            Ready to Start Your Decarbonization Journey?
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', opacity: 0.9 }}>
            Get personalized recommendations and access to funding programs
          </p>
          <button
            style={{
              padding: '1rem 2rem',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: 'white',
              color: '#3b82f6',
              fontWeight: '700',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            Get Started Today →
          </button>
        </div>
      )}
    </div>
  );
};

export default DecarbonizationFramework;