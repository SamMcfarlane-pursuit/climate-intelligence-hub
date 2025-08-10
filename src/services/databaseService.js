// Simple Database Service for Climate Tech Funding Tracker
// Simulates database operations with localStorage and in-memory storage

class DatabaseService {
  constructor() {
    this.storageKey = 'climate_funding_data';
    this.cache = new Map();
    this.initialized = false;
    
    // Initialize with sample data
    this.initializeDatabase();
  }

  // Initialize database with sample funding data
  async initializeDatabase() {
    if (this.initialized) return;

    try {
      // Try to load existing data from localStorage
      const existingData = localStorage.getItem(this.storageKey);
      
      if (existingData) {
        const parsed = JSON.parse(existingData);
        this.cache.set('funding_events', parsed.funding_events || []);
        this.cache.set('companies', parsed.companies || []);
        this.cache.set('investors', parsed.investors || []);
        console.log('📊 Loaded existing funding data from storage');
      } else {
        // Initialize with sample data
        await this.seedDatabase();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      await this.seedDatabase();
    }
  }

  // Seed database with sample climate tech funding data
  async seedDatabase() {
    const sampleFundingEvents = [
      {
        id: 'fund_001',
        company: 'SolarTech Innovations',
        amount: 25000000,
        stage: 'Series A',
        date: '2024-01-15',
        sector: 'Solar Energy',
        location: 'San Francisco, CA',
        investors: ['Green Ventures', 'Climate Capital', 'Energy Fund'],
        description: 'Next-generation solar panel technology with 40% higher efficiency',
        valuation: 100000000,
        employeeCount: 85,
        foundedYear: 2020,
        nlpAnalysis: {
          sentiment: 0.8,
          keyTerms: ['solar', 'efficiency', 'renewable', 'technology'],
          climateSector: 'Solar Energy',
          technologyFocus: 'Hardware',
          relevanceScore: 0.95
        }
      },
      {
        id: 'fund_002',
        company: 'CarbonCapture Pro',
        amount: 50000000,
        stage: 'Series B',
        date: '2024-01-20',
        sector: 'Carbon Removal',
        location: 'Austin, TX',
        investors: ['Climate Ventures', 'Carbon Fund', 'Tech Accelerator'],
        description: 'Direct air capture technology for industrial-scale carbon removal',
        valuation: 200000000,
        employeeCount: 120,
        foundedYear: 2019,
        nlpAnalysis: {
          sentiment: 0.9,
          keyTerms: ['carbon', 'capture', 'removal', 'industrial'],
          climateSector: 'Carbon Removal',
          technologyFocus: 'Industrial',
          relevanceScore: 0.98
        }
      },
      {
        id: 'fund_003',
        company: 'WindFlow Dynamics',
        amount: 15000000,
        stage: 'Seed',
        date: '2024-02-01',
        sector: 'Wind Energy',
        location: 'Denver, CO',
        investors: ['Wind Capital', 'Energy Ventures'],
        description: 'Advanced wind turbine design for urban environments',
        valuation: 60000000,
        employeeCount: 45,
        foundedYear: 2021,
        nlpAnalysis: {
          sentiment: 0.75,
          keyTerms: ['wind', 'turbine', 'urban', 'design'],
          climateSector: 'Wind Energy',
          technologyFocus: 'Hardware',
          relevanceScore: 0.88
        }
      },
      {
        id: 'fund_004',
        company: 'BatteryNext',
        amount: 75000000,
        stage: 'Series C',
        date: '2024-02-10',
        sector: 'Energy Storage',
        location: 'Boston, MA',
        investors: ['Battery Ventures', 'Energy Storage Fund', 'Tech Capital'],
        description: 'Solid-state battery technology for grid-scale energy storage',
        valuation: 500000000,
        employeeCount: 200,
        foundedYear: 2018,
        nlpAnalysis: {
          sentiment: 0.85,
          keyTerms: ['battery', 'storage', 'grid', 'solid-state'],
          climateSector: 'Energy Storage',
          technologyFocus: 'Hardware',
          relevanceScore: 0.92
        }
      },
      {
        id: 'fund_005',
        company: 'GreenLogistics AI',
        amount: 12000000,
        stage: 'Series A',
        date: '2024-02-15',
        sector: 'Clean Transportation',
        location: 'Seattle, WA',
        investors: ['Logistics Ventures', 'AI Fund'],
        description: 'AI-powered route optimization for electric vehicle fleets',
        valuation: 80000000,
        employeeCount: 60,
        foundedYear: 2020,
        nlpAnalysis: {
          sentiment: 0.82,
          keyTerms: ['logistics', 'AI', 'electric', 'optimization'],
          climateSector: 'Clean Transportation',
          technologyFocus: 'Software',
          relevanceScore: 0.90
        }
      },
      {
        id: 'fund_006',
        company: 'AgroClimate Solutions',
        amount: 8000000,
        stage: 'Seed',
        date: '2024-02-20',
        sector: 'Sustainable Agriculture',
        location: 'Portland, OR',
        investors: ['Agri Ventures', 'Climate Fund'],
        description: 'Precision agriculture platform for climate-resilient farming',
        valuation: 40000000,
        employeeCount: 35,
        foundedYear: 2021,
        nlpAnalysis: {
          sentiment: 0.78,
          keyTerms: ['agriculture', 'precision', 'climate', 'farming'],
          climateSector: 'Sustainable Agriculture',
          technologyFocus: 'Software',
          relevanceScore: 0.85
        }
      }
    ];

    const sampleCompanies = sampleFundingEvents.map(event => ({
      id: event.id.replace('fund_', 'comp_'),
      name: event.company,
      sector: event.sector,
      location: event.location,
      foundedYear: event.foundedYear,
      employeeCount: event.employeeCount,
      totalFunding: event.amount,
      lastFundingDate: event.date,
      stage: event.stage
    }));

    const sampleInvestors = [
      { id: 'inv_001', name: 'Green Ventures', type: 'VC', focus: 'Early Stage', totalInvestments: 45 },
      { id: 'inv_002', name: 'Climate Capital', type: 'VC', focus: 'Growth', totalInvestments: 32 },
      { id: 'inv_003', name: 'Energy Fund', type: 'Corporate VC', focus: 'Energy', totalInvestments: 28 },
      { id: 'inv_004', name: 'Carbon Fund', type: 'Impact Fund', focus: 'Carbon Tech', totalInvestments: 15 },
      { id: 'inv_005', name: 'Tech Accelerator', type: 'Accelerator', focus: 'Deep Tech', totalInvestments: 67 }
    ];

    // Store in cache and localStorage
    this.cache.set('funding_events', sampleFundingEvents);
    this.cache.set('companies', sampleCompanies);
    this.cache.set('investors', sampleInvestors);
    
    await this.persistToStorage();
    
    console.log('🌱 Seeded database with sample climate tech funding data');
  }

  // Persist data to localStorage
  async persistToStorage() {
    try {
      const data = {
        funding_events: this.cache.get('funding_events') || [],
        companies: this.cache.get('companies') || [],
        investors: this.cache.get('investors') || [],
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to persist data to storage:', error);
    }
  }

  // Get all funding events with optional filters
  async getFundingEvents(filters = {}) {
    await this.initializeDatabase();
    
    let events = this.cache.get('funding_events') || [];
    
    // Apply filters
    if (filters.sector) {
      events = events.filter(event => 
        event.sector.toLowerCase().includes(filters.sector.toLowerCase())
      );
    }
    
    if (filters.stage) {
      events = events.filter(event => 
        event.stage.toLowerCase() === filters.stage.toLowerCase()
      );
    }
    
    if (filters.minAmount) {
      events = events.filter(event => event.amount >= filters.minAmount);
    }
    
    if (filters.maxAmount) {
      events = events.filter(event => event.amount <= filters.maxAmount);
    }
    
    if (filters.startDate) {
      events = events.filter(event => new Date(event.date) >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      events = events.filter(event => new Date(event.date) <= new Date(filters.endDate));
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      events = events.filter(event =>
        event.company.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm) ||
        event.sector.toLowerCase().includes(searchTerm) ||
        event.investors.some(inv => inv.toLowerCase().includes(searchTerm))
      );
    }
    
    // Sort by date (newest first)
    events.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return events;
  }

  // Add new funding event
  async addFundingEvent(eventData) {
    await this.initializeDatabase();
    
    const events = this.cache.get('funding_events') || [];
    const newEvent = {
      id: `fund_${Date.now()}`,
      ...eventData,
      createdAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    this.cache.set('funding_events', events);
    
    await this.persistToStorage();
    
    return newEvent;
  }

  // Get funding analytics
  async getFundingAnalytics() {
    await this.initializeDatabase();
    
    const events = this.cache.get('funding_events') || [];
    
    // Calculate total funding
    const totalFunding = events.reduce((sum, event) => sum + event.amount, 0);
    
    // Calculate average deal size
    const avgDealSize = events.length > 0 ? totalFunding / events.length : 0;
    
    // Sector breakdown
    const sectorBreakdown = {};
    events.forEach(event => {
      sectorBreakdown[event.sector] = (sectorBreakdown[event.sector] || 0) + event.amount;
    });
    
    // Stage distribution
    const stageDistribution = {};
    events.forEach(event => {
      stageDistribution[event.stage] = (stageDistribution[event.stage] || 0) + 1;
    });
    
    // Monthly trends (last 6 months)
    const monthlyTrends = this.calculateMonthlyTrends(events);
    
    // Top investors
    const investorStats = {};
    events.forEach(event => {
      event.investors.forEach(investor => {
        if (!investorStats[investor]) {
          investorStats[investor] = { deals: 0, totalInvested: 0 };
        }
        investorStats[investor].deals++;
        investorStats[investor].totalInvested += event.amount;
      });
    });
    
    const topInvestors = Object.entries(investorStats)
      .sort(([,a], [,b]) => b.deals - a.deals)
      .slice(0, 10)
      .map(([name, stats]) => ({ name, ...stats }));
    
    return {
      totalFunding,
      avgDealSize,
      dealCount: events.length,
      sectorBreakdown,
      stageDistribution,
      monthlyTrends,
      topInvestors,
      generatedAt: new Date().toISOString()
    };
  }

  // Calculate monthly funding trends
  calculateMonthlyTrends(events) {
    const monthlyData = {};
    
    events.forEach(event => {
      const month = new Date(event.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { funding: 0, deals: 0 };
      }
      monthlyData[month].funding += event.amount;
      monthlyData[month].deals++;
    });
    
    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([month, data]) => ({
        month,
        funding: data.funding,
        deals: data.deals,
        avgDealSize: data.funding / data.deals
      }));
  }

  // Search funding events
  async searchFundingEvents(query, options = {}) {
    const events = await this.getFundingEvents({ search: query });
    
    // Calculate relevance scores
    const scoredEvents = events.map(event => {
      let score = 0;
      const queryTerms = query.toLowerCase().split(/\s+/);
      
      queryTerms.forEach(term => {
        // Company name match (highest weight)
        if (event.company.toLowerCase().includes(term)) score += 10;
        
        // Sector match
        if (event.sector.toLowerCase().includes(term)) score += 5;
        
        // Description match
        if (event.description.toLowerCase().includes(term)) score += 3;
        
        // Investor match
        if (event.investors.some(inv => inv.toLowerCase().includes(term))) score += 2;
        
        // NLP key terms match
        if (event.nlpAnalysis?.keyTerms?.some(keyword => 
          keyword.toLowerCase().includes(term))) score += 1;
      });
      
      return { ...event, relevanceScore: score };
    });
    
    // Sort by relevance and limit results
    return scoredEvents
      .filter(event => event.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, options.limit || 20);
  }

  // Export data
  async exportData(format = 'json') {
    await this.initializeDatabase();
    
    const data = {
      funding_events: this.cache.get('funding_events') || [],
      companies: this.cache.get('companies') || [],
      investors: this.cache.get('investors') || [],
      analytics: await this.getFundingAnalytics(),
      exportedAt: new Date().toISOString()
    };
    
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      
      case 'csv':
        return this.convertToCSV(data.funding_events);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Convert funding events to CSV
  convertToCSV(events) {
    if (events.length === 0) return '';
    
    const headers = ['Company', 'Amount', 'Stage', 'Date', 'Sector', 'Location', 'Investors', 'Description'];
    const csvRows = [headers.join(',')];
    
    events.forEach(event => {
      const row = [
        `"${event.company}"`,
        event.amount,
        `"${event.stage}"`,
        event.date,
        `"${event.sector}"`,
        `"${event.location}"`,
        `"${event.investors.join('; ')}"`,
        `"${event.description.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
  }

  // Clear all data (for testing)
  async clearData() {
    this.cache.clear();
    localStorage.removeItem(this.storageKey);
    this.initialized = false;
    console.log('🗑️ Cleared all funding data');
  }

  // Get database statistics
  async getStats() {
    await this.initializeDatabase();
    
    return {
      fundingEvents: (this.cache.get('funding_events') || []).length,
      companies: (this.cache.get('companies') || []).length,
      investors: (this.cache.get('investors') || []).length,
      lastUpdated: JSON.parse(localStorage.getItem(this.storageKey) || '{}').lastUpdated,
      storageSize: new Blob([localStorage.getItem(this.storageKey) || '']).size
    };
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
export default databaseService;