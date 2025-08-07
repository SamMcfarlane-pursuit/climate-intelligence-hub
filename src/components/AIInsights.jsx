import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, Target, Lightbulb, BarChart3, Activity, Leaf, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import ClimateActionPlan from './ClimateActionPlan';
import DataSourceIndicator from './DataSourceIndicator';

const AIInsights = ({ aiData, loading }) => {
  const [activeTab, setActiveTab] = useState('predictions');
  const [animatedValues, setAnimatedValues] = useState({});

  useEffect(() => {
    if (aiData?.predictions) {
      // Animate confidence values
      const timer = setTimeout(() => {
        setAnimatedValues({
          confidence: aiData.confidence,
          overallRisk: aiData.predictions[0]?.overallRisk || 0
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [aiData]);

  if (loading) {
    return (
      <div className="card">
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px', marginBottom: '1rem' }}></div>
          <h3 style={{ color: '#6b7280', marginBottom: '0.5rem' }}>AI Analysis in Progress</h3>
          <p style={{ color: '#9ca3af' }}>Processing climate data with machine learning models...</p>
        </div>
      </div>
    );
  }

  if (!aiData) return null;

  const tabs = [
    { id: 'predictions', label: 'AI Predictions', icon: Brain },
    { id: 'recommendations', label: 'Smart Recommendations', icon: Lightbulb },
    { id: 'actions', label: 'Climate Actions', icon: Leaf },
    { id: 'financial', label: 'Financial Impact', icon: DollarSign },
    { id: 'realtime', label: 'Real-time Data', icon: Activity }
  ];

  const renderPredictions = () => (
    <div>
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Brain size={24} color="#3b82f6" style={{ marginRight: '0.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>AI Confidence Score</h4>
          </div>
          <div style={{ position: 'relative', height: '100px' }}>
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: `${(animatedValues.confidence || 0) * 100}%`,
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                borderRadius: '8px',
                transition: 'height 1s ease-out'
              }}
            />
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              color: 'white',
              fontWeight: '700',
              fontSize: '1.5rem'
            }}>
              {Math.round((animatedValues.confidence || 0) * 100)}%
            </div>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
            Model accuracy based on historical data
          </p>
        </div>

        <div className="metric-card">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <AlertCircle size={24} color="#dc2626" style={{ marginRight: '0.5rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600' }}>Risk Probability</h4>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#dc2626',
              marginBottom: '0.5rem'
            }}>
              {Math.round((animatedValues.overallRisk || 0) * 100)}%
            </div>
            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Likelihood of climate impact in next 12 months
            </p>
          </div>
        </div>
      </div>

      <div className="metric-card">
        <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>
          5-Year Risk Projection
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={aiData.predictions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, 1]} tickFormatter={(value) => `${Math.round(value * 100)}%`} />
            <Tooltip formatter={(value) => [`${Math.round(value * 100)}%`, 'Risk Level']} />
            <Area 
              type="monotone" 
              dataKey="overallRisk" 
              stroke="#dc2626" 
              fill="url(#riskGradient)" 
              strokeWidth={3}
            />
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-3">
        {Object.entries(aiData.riskFactors).map(([factor, value]) => (
          <div key={factor} className="metric-card" style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
              {factor.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h5>
            <div style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: value > 0.7 ? '#dc2626' : value > 0.4 ? '#d97706' : '#16a34a'
            }}>
              {Math.round(value * 100)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div>
      {aiData.recommendations?.recommendations?.map((rec, index) => (
        <div key={rec.id} className="metric-card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: rec.priority === 'critical' ? '#dc2626' : rec.priority === 'high' ? '#d97706' : '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1rem'
              }}>
                <Target size={20} color="white" />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                  {rec.action}
                </h4>
                <span className={`risk-badge risk-${rec.priority === 'critical' ? 'high' : rec.priority}`}>
                  {rec.priority.toUpperCase()} PRIORITY
                </span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#16a34a' }}>
                ${rec.cost.toLocaleString()}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                ROI: {rec.roi}
              </div>
            </div>
          </div>
          
          <div style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1rem',
            borderLeft: '4px solid #3b82f6'
          }}>
            <h5 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#3b82f6' }}>
              AI Reasoning:
            </h5>
            <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
              {rec.aiReasoning}
            </p>
          </div>

          <div className="grid grid-3">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#16a34a' }}>
                {rec.carbonImpact}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Carbon Impact</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#3b82f6' }}>
                {Math.round(rec.confidence * 100)}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>AI Confidence</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#d97706' }}>
                {rec.category}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Category</div>
            </div>
          </div>
        </div>
      ))}

      {aiData.recommendations?.aiInsights && (
        <div className="metric-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <Brain size={20} style={{ marginRight: '0.5rem' }} />
            AI Strategic Insights
          </h4>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {aiData.recommendations.aiInsights.map((insight, index) => (
              <li key={index} style={{ 
                padding: '0.75rem 0', 
                borderBottom: index < aiData.recommendations.aiInsights.length - 1 ? '1px solid rgba(255,255,255,0.2)' : 'none',
                display: 'flex',
                alignItems: 'flex-start'
              }}>
                <CheckCircle size={16} style={{ marginRight: '0.5rem', marginTop: '0.25rem', flexShrink: 0 }} />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderFinancial = () => (
    <div>
      {aiData.financialImpact && (
        <>
          <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
            <div className="metric-card" style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Baseline Revenue</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#16a34a' }}>
                ${aiData.financialImpact.baseline.annualRevenue.toLocaleString()}
              </div>
            </div>
            <div className="metric-card" style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Value at Risk (95%)</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#dc2626' }}>
                ${Math.abs(aiData.financialImpact.valueAtRisk.var95).toLocaleString()}
              </div>
            </div>
            <div className="metric-card" style={{ textAlign: 'center' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>Best NPV Action</h4>
              <div style={{ fontSize: '1.8rem', fontWeight: '700', color: '#3b82f6' }}>
                ${aiData.financialImpact.netPresentValue[0]?.npv.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="metric-card">
            <h4 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Risk Scenarios Analysis</h4>
            <div className="grid grid-3">
              {aiData.financialImpact.riskScenarios.map((scenario, index) => (
                <div key={scenario.scenario} style={{ 
                  padding: '1rem', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                    {scenario.scenario.replace('_', ' ')}
                  </h5>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                    Probability: {Math.round(scenario.probability * 100)}%
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#dc2626' }}>
                    ${Math.abs(scenario.revenueImpact).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Revenue Impact</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderRealTime = () => (
    <div>
      {aiData.realTimeData && (
        <>
          <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
            <div className="metric-card">
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Current Conditions</h4>
              <div className="grid grid-2">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc2626' }}>
                    {Math.round(aiData.realTimeData.current.temperature)}°F
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Temperature</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
                    {Math.round(aiData.realTimeData.current.humidity)}%
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Humidity</div>
                </div>
              </div>
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                background: '#f0f9ff', 
                borderRadius: '6px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0369a1' }}>
                  Comfort Index: {Math.round(aiData.realTimeData.current.aiEnhanced.comfortIndex)}%
                </div>
              </div>
            </div>

            <div className="metric-card">
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>AI Forecasts</h4>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>Next 24 Hours</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '600' }}>
                  {Math.round(aiData.realTimeData.forecasts.next24h.temperature)}°F
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16a34a' }}>
                  Confidence: {Math.round(aiData.realTimeData.forecasts.next24h.confidence * 100)}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>7-Day Trend</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '600', textTransform: 'capitalize' }}>
                  {aiData.realTimeData.forecasts.next7days.temperatureTrend}
                </div>
              </div>
            </div>
          </div>

          {aiData.realTimeData.alerts.length > 0 && (
            <div className="metric-card" style={{ borderLeft: '4px solid #dc2626' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#dc2626' }}>
                AI Alerts
              </h4>
              {aiData.realTimeData.alerts.map((alert, index) => (
                <div key={index} style={{ 
                  padding: '1rem', 
                  background: '#fef2f2', 
                  borderRadius: '6px',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <AlertCircle size={16} color="#dc2626" style={{ marginRight: '0.5rem' }} />
                    <span style={{ fontWeight: '600', color: '#dc2626' }}>{alert.type.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{alert.message}</div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Recommended Action: {alert.action}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="metric-card">
            <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>Data Quality Assessment</h4>
            <div className="grid grid-4">
              {Object.entries(aiData.realTimeData.dataQuality).map(([metric, value]) => (
                <div key={metric} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: value > 0.9 ? '#16a34a' : value > 0.7 ? '#d97706' : '#dc2626'
                  }}>
                    {Math.round(value * 100)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'capitalize' }}>
                    {metric}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <Brain size={28} color="#3b82f6" style={{ marginRight: '0.75rem' }} />
        <h2 style={{ fontSize: '1.8rem', fontWeight: '600', margin: 0 }}>
          AI-Powered Climate Intelligence
        </h2>
      </div>

      {/* Data Source Indicator */}
      <DataSourceIndicator 
        dataSource={aiData?.dataSource}
        realData={aiData?.realData}
        lastUpdated={aiData?.timestamp}
      />

      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #e5e7eb', 
        marginBottom: '2rem',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '1rem 1.5rem',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid #3b82f6' : '3px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                fontWeight: activeTab === tab.id ? '600' : '400',
                display: 'flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={18} style={{ marginRight: '0.5rem' }} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div>
        {activeTab === 'predictions' && renderPredictions()}
        {activeTab === 'recommendations' && renderRecommendations()}
        {activeTab === 'actions' && aiData.predictions?.climateActions && (
          <div className="ai-content">
            <ClimateActionPlan 
              actionPlan={aiData.predictions.climateActions}
              businessProfile={businessProfile}
            />
          </div>
        )}
        {activeTab === 'financial' && renderFinancial()}
        {activeTab === 'realtime' && renderRealTime()}
      </div>
    </div>
  );
};

export default AIInsights;