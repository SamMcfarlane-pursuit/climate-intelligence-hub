import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, DollarSign, Calendar, Filter, Download, Eye, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { databaseService } from '../services/databaseService';
import { fundingScrapingService } from '../services/fundingScrapingService';

const FundingTracker = () => {
  const [fundingData, setFundingData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Simulated funding data (in real implementation, this would come from web scraping)
  const mockFundingData = [
    {
      id: 1,
      company: "SolarTech Innovations",
      sector: "Solar Energy",
      stage: "Series B",
      amount: 45000000,
      date: "2024-01-15",
      investors: ["Breakthrough Energy", "Climate Capital", "Green Ventures"],
      description: "AI-powered solar panel optimization technology",
      location: "San Francisco, CA",
      url: "https://example.com/solartechfunding",
      sentiment: "positive",
      keyTerms: ["AI", "optimization", "efficiency", "grid-scale"]
    },
    {
      id: 2,
      company: "CarbonCapture Pro",
      sector: "Carbon Removal",
      stage: "Series A",
      amount: 25000000,
      date: "2024-01-12",
      investors: ["Climate Fund", "Carbon Ventures", "Impact Capital"],
      description: "Direct air capture technology for industrial applications",
      location: "Austin, TX",
      url: "https://example.com/carboncapturefunding",
      sentiment: "positive",
      keyTerms: ["DAC", "industrial", "scalable", "carbon credits"]
    },
    {
      id: 3,
      company: "EV Fleet Solutions",
      sector: "Clean Transportation",
      stage: "Seed",
      amount: 8000000,
      date: "2024-01-10",
      investors: ["Mobility Ventures", "Green Fleet Capital"],
      description: "Fleet electrification platform for logistics companies",
      location: "Detroit, MI",
      url: "https://example.com/evfleetfunding",
      sentiment: "positive",
      keyTerms: ["fleet", "logistics", "electrification", "SaaS"]
    },
    {
      id: 4,
      company: "AgriClimate Tech",
      sector: "Sustainable Agriculture",
      stage: "Series A",
      amount: 18000000,
      date: "2024-01-08",
      investors: ["AgTech Ventures", "Climate Solutions Fund"],
      description: "Precision agriculture platform using satellite data",
      location: "Iowa City, IA",
      url: "https://example.com/agriclimatefunding",
      sentiment: "positive",
      keyTerms: ["precision agriculture", "satellite", "yield optimization"]
    },
    {
      id: 5,
      company: "Green Building AI",
      sector: "Green Buildings",
      stage: "Series B",
      amount: 35000000,
      date: "2024-01-05",
      investors: ["PropTech Capital", "Sustainable Real Estate Fund"],
      description: "AI-driven building energy management systems",
      location: "New York, NY",
      url: "https://example.com/greenbuildingfunding",
      sentiment: "positive",
      keyTerms: ["building management", "energy efficiency", "IoT", "AI"]
    }
  ];

  const sectors = [
    'Solar Energy', 'Carbon Removal', 'Clean Transportation', 
    'Sustainable Agriculture', 'Green Buildings', 'Wind Energy',
    'Energy Storage', 'Circular Economy', 'Water Management'
  ];

  const stages = ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'];

  useEffect(() => {
    loadFundingData();
  }, []);

  const loadFundingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load data from database service
      const events = await databaseService.getFundingEvents();
      const analyticsData = await databaseService.getFundingAnalytics();
      
      if (events && events.length > 0) {
        setFundingData(events);
        setFilteredData(events);
        setAnalytics(analyticsData);
        generateInsights(events);
        setSuccessMessage(`Successfully loaded ${events.length} funding events`);
        console.log('📊 Loaded funding data:', events.length, 'events');
      } else {
        // Use mock data if no real data available
        setFundingData(mockFundingData);
        setFilteredData(mockFundingData);
        generateInsights(mockFundingData);
        setSuccessMessage(`Loaded ${mockFundingData.length} sample funding events`);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error loading funding data:', error);
      setError('Failed to load funding data. Using sample data instead.');
      
      // Fallback to mock data
      setFundingData(mockFundingData);
      setFilteredData(mockFundingData);
      generateInsights(mockFundingData);
      
      // Clear error after 5 seconds
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterData();
  }, [searchTerm, selectedSector, selectedStage, dateRange, fundingData]);

  const filterData = () => {
    let filtered = [...fundingData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.investors.some(inv => inv.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sector filter
    if (selectedSector !== 'all') {
      filtered = filtered.filter(item => item.sector === selectedSector);
    }

    // Stage filter
    if (selectedStage !== 'all') {
      filtered = filtered.filter(item => item.stage === selectedStage);
    }

    // Date range filter
    const daysAgo = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
    
    filtered = filtered.filter(item => new Date(item.date) >= cutoffDate);

    setFilteredData(filtered);
  };

  const generateInsights = (data) => {
    if (analytics) {
      // Use analytics data if available
      setInsights({
        totalFunding: analytics.totalFunding,
        avgDealSize: analytics.avgDealSize,
        dealCount: analytics.dealCount,
        sectorBreakdown: analytics.sectorBreakdown,
        stageBreakdown: analytics.stageBreakdown,
        topSector: Object.keys(analytics.sectorBreakdown).reduce((a, b) => 
          analytics.sectorBreakdown[a] > analytics.sectorBreakdown[b] ? a : b
        ),
        monthlyTrends: analytics.monthlyTrends,
        topInvestors: analytics.topInvestors
      });
    } else {
      // Fallback to calculating from data
      const totalFunding = data.reduce((sum, item) => sum + item.amount, 0);
      const avgDealSize = totalFunding / data.length;
      
      const sectorBreakdown = data.reduce((acc, item) => {
        acc[item.sector] = (acc[item.sector] || 0) + item.amount;
        return acc;
      }, {});

      const stageBreakdown = data.reduce((acc, item) => {
        acc[item.stage] = (acc[item.stage] || 0) + 1;
        return acc;
      }, {});

      const topInvestors = data.flatMap(item => item.investors)
        .reduce((acc, investor) => {
          acc[investor] = (acc[investor] || 0) + 1;
          return acc;
        }, {});

      setInsights({
        totalFunding,
        avgDealSize,
        dealCount: data.length,
        sectorBreakdown,
        stageBreakdown,
        topInvestors: Object.entries(topInvestors)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
      });
    }
  };

  // Refresh data by scraping new funding events
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate scraping new data
      console.log('🔄 Refreshing funding data...');
      const scrapingResult = await fundingScrapingService.scrapeFundingData();
      
      if (scrapingResult.success && scrapingResult.data.length > 0) {
        // Store new data in database
        for (const event of scrapingResult.data) {
          await databaseService.addFundingEvent(event);
        }
        
        // Reload data
        await loadFundingData();
        setSuccessMessage(`Successfully refreshed data with ${scrapingResult.data.length} new events`);
      } else {
        // Just reload existing data
        await loadFundingData();
        setSuccessMessage('Data refreshed - no new events found');
      }
      
      console.log('✅ Data refresh completed');
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error) {
      console.error('Error refreshing data:', error);
      setError('Failed to refresh data. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const exportData = async () => {
    try {
      setError(null);
      
      const csvData = await databaseService.exportData('csv');
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `climate-tech-funding-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccessMessage(`Successfully exported ${filteredData.length} funding events`);
      setTimeout(() => setSuccessMessage(null), 3000);
      console.log('📁 Data exported successfully');
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setError('Failed to export data. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const COLORS = ['#16a34a', '#059669', '#0d9488', '#0891b2', '#0284c7', '#2563eb', '#7c3aed', '#c026d3'];

  const sectorChartData = insights ? Object.entries(insights.sectorBreakdown).map(([sector, amount]) => ({
    sector,
    amount,
    name: sector
  })) : [];

  const stageChartData = insights ? Object.entries(insights.stageBreakdown).map(([stage, count]) => ({
    stage,
    count,
    name: stage
  })) : [];

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          🚀 Climate Tech Funding Tracker
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>
          Real-time tracking of climate technology investments and funding trends
        </p>
        
        {/* Instructions */}
        <div style={{
          background: '#f0f9ff',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', margin: 0 }}>
            💡 <strong>How to use:</strong> Search companies, filter by sector/stage, view insights, and export data. 
            Click "Refresh Data" to get the latest funding events.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #f87171',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#dc2626', margin: 0 }}>
              ⚠️ {error}
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
            marginBottom: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#16a34a', margin: 0 }}>
              ✅ {successMessage}
            </p>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Search Companies
            </label>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Company, investor, or keyword..."
                style={{
                  width: '100%',
                  padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '0.875rem'
                }}
              />
            </div>
          </div>

          {/* Sector Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Sector
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Sectors</option>
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* Stage Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Stage
            </label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              Time Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      {insights && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #059669 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <DollarSign size={32} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              {formatCurrency(insights.totalFunding)}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Funding</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <TrendingUp size={32} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              {insights.dealCount}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Deals</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <Calendar size={32} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              {formatCurrency(insights.avgDealSize)}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Avg Deal Size</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            borderRadius: '12px',
            padding: '1.5rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <Eye size={32} style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              {insights.topInvestors.length}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Active Investors</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Sector Breakdown */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Funding by Sector
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sectorChartData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {sectorChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Stage Distribution */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Deals by Stage
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stageChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="stage" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Funding List */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
            Recent Funding Events ({filteredData.length})
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={refreshData}
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: loading ? '#9ca3af' : '#0891b2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <TrendingUp size={16} />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button 
              onClick={exportData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              Export Data
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🔄</div>
            <div>Loading funding data...</div>
          </div>
        ) : filteredData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              No funding events found
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              Try adjusting your search criteria or filters to see more results.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSector('all');
                  setSelectedStage('all');
                  setDateRange('365');
                }}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Clear All Filters
              </button>
              <button 
                onClick={refreshData}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0891b2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Refresh Data
              </button>
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Company</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Sector</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Stage</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Amount</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Investors</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>{item.company}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{item.location}</div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#dcfce7',
                        color: '#166534',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {item.sector}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {item.stage}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: '600' }}>
                      {formatCurrency(item.amount)}
                    </td>
                    <td style={{ padding: '0.75rem', color: '#6b7280' }}>
                      {formatDate(item.date)}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.875rem' }}>
                        {item.investors.slice(0, 2).join(', ')}
                        {item.investors.length > 2 && ` +${item.investors.length - 2} more`}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <button style={{
                        padding: '0.25rem 0.5rem',
                        background: 'transparent',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <ExternalLink size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Investors */}
      {insights && (
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginTop: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
            Most Active Investors
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {insights.topInvestors.map(([investor, count], index) => (
              <div key={investor} style={{
                padding: '1rem',
                background: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{investor}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  {count} investment{count !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FundingTracker;