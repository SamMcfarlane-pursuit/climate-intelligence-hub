import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  BarChart3, 
  PieChart, 
  Target, 
  Shield, 
  Leaf, 
  DollarSign,
  AlertTriangle,
  Award,
  Building2,
  MapPin,
  Users,
  Briefcase
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart as RechartsPieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

const PortfolioAnalysis = ({ industryImpacts }) => {
  const [portfolioCompanies, setPortfolioCompanies] = useState([
    {
      id: 1,
      name: "SolarTech Solutions",
      industry: "renewable-energy",
      location: "Los Angeles",
      investmentAmount: 2500000,
      esgScore: 92,
      carbonIntensity: "negative",
      transitionRisk: "low",
      opportunityScore: 10
    },
    {
      id: 2,
      name: "GreenLogistics Corp",
      industry: "clean-transportation",
      location: "Chicago",
      investmentAmount: 1800000,
      esgScore: 78,
      carbonIntensity: "low",
      transitionRisk: "low",
      opportunityScore: 9
    },
    {
      id: 3,
      name: "CarbonCapture Inc",
      industry: "carbon-removal",
      location: "New York",
      investmentAmount: 3200000,
      esgScore: 88,
      carbonIntensity: "negative",
      transitionRisk: "low",
      opportunityScore: 9
    }
  ]);

  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: '',
    location: '',
    investmentAmount: '',
    esgScore: '',
    carbonIntensity: 'medium',
    transitionRisk: 'medium',
    opportunityScore: 5
  });

  // Portfolio calculations
  const totalInvestment = portfolioCompanies.reduce((sum, company) => sum + company.investmentAmount, 0);
  const averageESG = Math.round(portfolioCompanies.reduce((sum, company) => sum + company.esgScore, 0) / portfolioCompanies.length);
  const averageOpportunity = Math.round(portfolioCompanies.reduce((sum, company) => sum + company.opportunityScore, 0) / portfolioCompanies.length);

  // Sector diversification data
  const sectorData = portfolioCompanies.reduce((acc, company) => {
    const sector = company.industry;
    if (!acc[sector]) {
      acc[sector] = { 
        sector, 
        count: 0, 
        investment: 0,
        avgESG: 0,
        companies: []
      };
    }
    acc[sector].count += 1;
    acc[sector].investment += company.investmentAmount;
    acc[sector].companies.push(company);
    return acc;
  }, {});

  // Calculate average ESG per sector
  Object.keys(sectorData).forEach(sector => {
    const companies = sectorData[sector].companies;
    sectorData[sector].avgESG = Math.round(
      companies.reduce((sum, company) => sum + company.esgScore, 0) / companies.length
    );
  });

  const sectorChartData = Object.values(sectorData).map(sector => ({
    name: sector.sector.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: sector.investment,
    count: sector.count,
    avgESG: sector.avgESG
  }));

  // Risk distribution data
  const riskData = [
    { name: 'Low Risk', value: portfolioCompanies.filter(c => c.transitionRisk === 'low').length, color: '#16a34a' },
    { name: 'Medium Risk', value: portfolioCompanies.filter(c => c.transitionRisk === 'medium').length, color: '#ca8a04' },
    { name: 'High Risk', value: portfolioCompanies.filter(c => c.transitionRisk === 'high').length, color: '#dc2626' }
  ].filter(item => item.value > 0);

  // Carbon intensity distribution
  const carbonData = [
    { name: 'Carbon Negative', value: portfolioCompanies.filter(c => c.carbonIntensity === 'negative').length, color: '#16a34a' },
    { name: 'Low Carbon', value: portfolioCompanies.filter(c => c.carbonIntensity === 'low').length, color: '#65a30d' },
    { name: 'Medium Carbon', value: portfolioCompanies.filter(c => c.carbonIntensity === 'medium').length, color: '#ca8a04' },
    { name: 'High Carbon', value: portfolioCompanies.filter(c => c.carbonIntensity === 'high').length, color: '#dc2626' }
  ].filter(item => item.value > 0);

  // Performance comparison data
  const comparisonData = portfolioCompanies.map(company => ({
    name: company.name.split(' ')[0], // Short name
    ESG: company.esgScore,
    Opportunity: company.opportunityScore * 10, // Scale to 100
    Investment: company.investmentAmount / 1000000 // In millions
  }));

  const addCompany = () => {
    if (newCompany.name && newCompany.industry && newCompany.location) {
      const company = {
        ...newCompany,
        id: Date.now(),
        investmentAmount: parseInt(newCompany.investmentAmount) || 0,
        esgScore: parseInt(newCompany.esgScore) || 50,
        opportunityScore: parseInt(newCompany.opportunityScore) || 5
      };
      setPortfolioCompanies([...portfolioCompanies, company]);
      setNewCompany({
        name: '',
        industry: '',
        location: '',
        investmentAmount: '',
        esgScore: '',
        carbonIntensity: 'medium',
        transitionRisk: 'medium',
        opportunityScore: 5
      });
      setShowAddCompany(false);
    }
  };

  const removeCompany = (id) => {
    setPortfolioCompanies(portfolioCompanies.filter(company => company.id !== id));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#ca8a04';
    return '#dc2626';
  };

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Briefcase size={24} style={{ marginRight: '0.5rem', color: '#8b5cf6' }} />
          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Portfolio Analysis
          </h2>
        </div>
        <button
          className="btn"
          onClick={() => setShowAddCompany(true)}
          style={{ 
            background: '#8b5cf6',
            fontSize: '0.9rem', 
            padding: '0.5rem 1rem',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add Company
        </button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Building2 size={40} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Portfolio Size</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>
            {portfolioCompanies.length}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Companies</p>
        </div>

        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <DollarSign size={40} color="#16a34a" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Total Investment</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#16a34a' }}>
            ${(totalInvestment / 1000000).toFixed(1)}M
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Deployed capital</p>
        </div>

        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Award size={40} color={getScoreColor(averageESG)} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Avg ESG Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: getScoreColor(averageESG) }}>
            {averageESG}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Portfolio average</p>
        </div>

        <div className="metric-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            <Target size={40} color="#8b5cf6" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>Opportunity Score</h3>
          <p style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6' }}>
            {averageOpportunity}/10
          </p>
          <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>Climate potential</p>
        </div>
      </div>

      {/* Portfolio Companies Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '1rem' }}>Portfolio Companies</h3>
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1rem',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 0.5fr',
            gap: '1rem',
            padding: '0.75rem',
            background: '#e2e8f0',
            borderRadius: '8px',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: '#475569'
          }}>
            <div>Company</div>
            <div>Industry</div>
            <div>Location</div>
            <div>Investment</div>
            <div>ESG Score</div>
            <div>Carbon</div>
            <div>Opportunity</div>
            <div></div>
          </div>
          
          {portfolioCompanies.map((company) => (
            <div key={company.id} style={{ 
              display: 'grid', 
              gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 1fr 0.5fr',
              gap: '1rem',
              padding: '0.75rem',
              background: 'white',
              borderRadius: '8px',
              marginBottom: '0.5rem',
              border: '1px solid #e2e8f0',
              alignItems: 'center'
            }}>
              <div style={{ fontWeight: '600', color: '#1f2937' }}>{company.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', textTransform: 'capitalize' }}>
                {company.industry.replace('-', ' ')}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{company.location}</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#16a34a' }}>
                ${(company.investmentAmount / 1000000).toFixed(1)}M
              </div>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: '600', 
                color: getScoreColor(company.esgScore) 
              }}>
                {company.esgScore}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                padding: '0.25rem 0.5rem',
                borderRadius: '12px',
                background: company.carbonIntensity === 'negative' ? '#dcfce7' : 
                           company.carbonIntensity === 'low' ? '#fef3c7' : 
                           company.carbonIntensity === 'medium' ? '#fed7aa' : '#fecaca',
                color: company.carbonIntensity === 'negative' ? '#16a34a' : 
                       company.carbonIntensity === 'low' ? '#ca8a04' : 
                       company.carbonIntensity === 'medium' ? '#ea580c' : '#dc2626',
                textAlign: 'center',
                textTransform: 'capitalize'
              }}>
                {company.carbonIntensity}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#8b5cf6' }}>
                {company.opportunityScore}/10
              </div>
              <button
                onClick={() => removeCompany(company.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        {/* Sector Diversification */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Sector Diversification</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={sectorChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sectorChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${(value / 1000000).toFixed(1)}M`, 'Investment']} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Comparison */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ESG" fill="#8b5cf6" name="ESG Score" />
              <Bar dataKey="Opportunity" fill="#06b6d4" name="Opportunity %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="grid grid-2">
        {/* Transition Risk Distribution */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Transition Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Carbon Intensity Distribution */}
        <div style={{ 
          background: '#f8fafc', 
          borderRadius: '12px', 
          padding: '1.5rem',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1rem' }}>Carbon Intensity Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={carbonData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {carbonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Add Company Modal */}
      {showAddCompany && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            width: '500px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: 0 }}>Add New Company</h3>
              <button
                onClick={() => setShowAddCompany(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Company Name</label>
                <input
                  type="text"
                  className="select"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                  placeholder="Enter company name"
                />
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Industry</label>
                  <select
                    className="select"
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                  >
                    <option value="">Select industry</option>
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

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Location</label>
                  <select
                    className="select"
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({...newCompany, location: e.target.value})}
                  >
                    <option value="">Select location</option>
                    <option value="New York">New York</option>
                    <option value="Los Angeles">Los Angeles</option>
                    <option value="Chicago">Chicago</option>
                    <option value="Miami">Miami</option>
                    <option value="San Francisco">San Francisco</option>
                    <option value="Boston">Boston</option>
                    <option value="Austin">Austin</option>
                    <option value="Seattle">Seattle</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Investment Amount ($)</label>
                  <input
                    type="number"
                    className="select"
                    value={newCompany.investmentAmount}
                    onChange={(e) => setNewCompany({...newCompany, investmentAmount: e.target.value})}
                    placeholder="e.g., 1000000"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>ESG Score (0-100)</label>
                  <input
                    type="number"
                    className="select"
                    value={newCompany.esgScore}
                    onChange={(e) => setNewCompany({...newCompany, esgScore: e.target.value})}
                    placeholder="e.g., 75"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="grid grid-2" style={{ gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Carbon Intensity</label>
                  <select
                    className="select"
                    value={newCompany.carbonIntensity}
                    onChange={(e) => setNewCompany({...newCompany, carbonIntensity: e.target.value})}
                  >
                    <option value="negative">Carbon Negative</option>
                    <option value="low">Low Carbon</option>
                    <option value="medium">Medium Carbon</option>
                    <option value="high">High Carbon</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Opportunity Score (1-10)</label>
                  <input
                    type="number"
                    className="select"
                    value={newCompany.opportunityScore}
                    onChange={(e) => setNewCompany({...newCompany, opportunityScore: e.target.value})}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button
                  className="btn"
                  onClick={() => setShowAddCompany(false)}
                  style={{ 
                    flex: 1, 
                    background: '#6b7280',
                    fontSize: '1rem', 
                    padding: '0.75rem' 
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn"
                  onClick={addCompany}
                  style={{ 
                    flex: 1, 
                    background: '#8b5cf6',
                    fontSize: '1rem', 
                    padding: '0.75rem' 
                  }}
                >
                  Add Company
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioAnalysis;