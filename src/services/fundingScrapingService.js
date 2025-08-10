// Climate Tech Funding Scraping Service
// This service handles web scraping, NLP analysis, and data processing for funding events

class FundingScrapingService {
  constructor() {
    this.sources = [
      {
        name: 'Crunchbase',
        url: 'https://www.crunchbase.com',
        selectors: {
          company: '.cb-card-title',
          amount: '.funding-amount',
          date: '.funding-date',
          investors: '.investor-list'
        }
      },
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com',
        selectors: {
          title: '.post-title',
          content: '.entry-content',
          date: '.post-date'
        }
      },
      {
        name: 'PitchBook',
        url: 'https://pitchbook.com',
        selectors: {
          deal: '.deal-row',
          company: '.company-name',
          amount: '.deal-amount'
        }
      }
    ];

    this.climateKeywords = [
      'climate tech', 'clean energy', 'renewable energy', 'solar', 'wind',
      'carbon capture', 'carbon removal', 'electric vehicle', 'EV', 'battery',
      'energy storage', 'green hydrogen', 'sustainable agriculture', 'agtech',
      'circular economy', 'waste management', 'water technology', 'cleantech',
      'decarbonization', 'net zero', 'ESG', 'sustainability', 'green building',
      'smart grid', 'energy efficiency', 'biofuel', 'geothermal'
    ];

    this.fundingStages = [
      'pre-seed', 'seed', 'series a', 'series b', 'series c', 'series d',
      'growth', 'late stage', 'ipo', 'acquisition', 'merger'
    ];
  }

  // Main scraping orchestrator
  async scrapeFundingData(options = {}) {
    const {
      sources = ['all'],
      dateRange = 30, // days
      sectors = ['all'],
      minAmount = 0
    } = options;

    try {
      console.log('🚀 Starting funding data scraping...');
      
      const scrapingResults = await Promise.allSettled([
        this.scrapeCrunchbase(dateRange),
        this.scrapeTechCrunch(dateRange),
        this.scrapeVentureCapitalNews(dateRange),
        this.scrapeClimateVCBlogs(dateRange)
      ]);

      const rawData = scrapingResults
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);

      console.log(`📊 Scraped ${rawData.length} raw funding events`);

      // Process and clean data
      const processedData = await this.processRawData(rawData);
      
      // Apply NLP analysis
      const enrichedData = await this.applyNLPAnalysis(processedData);
      
      // Filter and validate
      const finalData = this.filterAndValidate(enrichedData, { sectors, minAmount });

      console.log(`✅ Final dataset: ${finalData.length} validated funding events`);
      
      return {
        success: true,
        data: finalData,
        metadata: {
          totalScraped: rawData.length,
          processed: processedData.length,
          final: finalData.length,
          sources: scrapingResults.length,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('❌ Scraping failed:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  // Crunchbase scraping (simulated - would use actual API in production)
  async scrapeCrunchbase(dateRange) {
    console.log('🔍 Scraping Crunchbase...');
    
    // Simulated API call - in production, use Crunchbase API
    const mockCrunchbaseData = [
      {
        source: 'Crunchbase',
        company: 'SolarTech Innovations',
        description: 'AI-powered solar panel optimization technology for residential and commercial applications',
        amount: '$45M',
        stage: 'Series B',
        date: '2024-01-15',
        investors: ['Breakthrough Energy Ventures', 'Climate Capital', 'Green Tech Fund'],
        location: 'San Francisco, CA',
        url: 'https://crunchbase.com/organization/solartech-innovations',
        rawText: 'SolarTech Innovations raises $45M Series B led by Breakthrough Energy Ventures to scale AI-powered solar optimization platform'
      },
      {
        source: 'Crunchbase',
        company: 'CarbonCapture Pro',
        description: 'Direct air capture technology for industrial carbon removal applications',
        amount: '$25M',
        stage: 'Series A',
        date: '2024-01-12',
        investors: ['Climate Investment Fund', 'Carbon Ventures', 'Impact Capital'],
        location: 'Austin, TX',
        url: 'https://crunchbase.com/organization/carboncapture-pro',
        rawText: 'CarbonCapture Pro secures $25M Series A to commercialize direct air capture technology for industrial clients'
      }
    ];

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockCrunchbaseData;
  }

  // TechCrunch scraping
  async scrapeTechCrunch(dateRange) {
    console.log('📰 Scraping TechCrunch...');
    
    // Simulated scraping - would use actual web scraping in production
    const mockTechCrunchData = [
      {
        source: 'TechCrunch',
        company: 'EV Fleet Solutions',
        description: 'Fleet electrification platform helping logistics companies transition to electric vehicles',
        amount: '$8M',
        stage: 'Seed',
        date: '2024-01-10',
        investors: ['Mobility Ventures', 'Green Fleet Capital'],
        location: 'Detroit, MI',
        url: 'https://techcrunch.com/2024/01/10/ev-fleet-solutions-funding',
        rawText: 'EV Fleet Solutions raises $8M seed round to help logistics companies electrify their vehicle fleets'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 800));
    return mockTechCrunchData;
  }

  // Venture Capital news scraping
  async scrapeVentureCapitalNews(dateRange) {
    console.log('💰 Scraping VC news sources...');
    
    const mockVCData = [
      {
        source: 'VentureBeat',
        company: 'AgriClimate Tech',
        description: 'Precision agriculture platform using satellite data and AI for climate-resilient farming',
        amount: '$18M',
        stage: 'Series A',
        date: '2024-01-08',
        investors: ['AgTech Ventures', 'Climate Solutions Fund', 'Farm Innovation Capital'],
        location: 'Iowa City, IA',
        url: 'https://venturebeat.com/2024/01/08/agriclimate-tech-funding',
        rawText: 'AgriClimate Tech closes $18M Series A to expand precision agriculture platform for climate adaptation'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 600));
    return mockVCData;
  }

  // Climate VC blog scraping
  async scrapeClimateVCBlogs(dateRange) {
    console.log('🌱 Scraping climate VC blogs...');
    
    const mockClimateVCData = [
      {
        source: 'Climate VC Blog',
        company: 'Green Building AI',
        description: 'AI-driven building energy management systems for commercial real estate',
        amount: '$35M',
        stage: 'Series B',
        date: '2024-01-05',
        investors: ['PropTech Capital', 'Sustainable Real Estate Fund', 'Energy Innovation Ventures'],
        location: 'New York, NY',
        url: 'https://climatevc.com/2024/01/05/green-building-ai-funding',
        rawText: 'Green Building AI raises $35M Series B to deploy AI-powered energy management across commercial buildings'
      }
    ];

    await new Promise(resolve => setTimeout(resolve, 500));
    return mockClimateVCData;
  }

  // Process and clean raw scraped data
  async processRawData(rawData) {
    console.log('🧹 Processing raw data...');
    
    return rawData.map(item => {
      // Standardize amount format
      const amount = this.parseAmount(item.amount);
      
      // Standardize date format
      const date = this.parseDate(item.date);
      
      // Extract and clean company name
      const company = this.cleanCompanyName(item.company);
      
      // Standardize funding stage
      const stage = this.standardizeFundingStage(item.stage);
      
      // Extract location
      const location = this.parseLocation(item.location);
      
      return {
        ...item,
        company,
        amount,
        date,
        stage,
        location,
        processed: true,
        processingTimestamp: new Date().toISOString()
      };
    });
  }

  // Apply NLP analysis to extract insights
  async applyNLPAnalysis(data) {
    console.log('🧠 Applying NLP analysis...');
    
    return data.map(item => {
      // Sentiment analysis
      const sentiment = this.analyzeSentiment(item.rawText || item.description);
      
      // Extract key terms
      const keyTerms = this.extractKeyTerms(item.description + ' ' + (item.rawText || ''));
      
      // Classify climate sector
      const climateSector = this.classifyClimateSector(item.description, keyTerms);
      
      // Extract technology focus
      const technologyFocus = this.extractTechnologyFocus(item.description, keyTerms);
      
      // Calculate relevance score
      const relevanceScore = this.calculateRelevanceScore(item, keyTerms);
      
      return {
        ...item,
        nlpAnalysis: {
          sentiment,
          keyTerms,
          climateSector,
          technologyFocus,
          relevanceScore
        }
      };
    });
  }

  // Sentiment analysis (simplified)
  analyzeSentiment(text) {
    const positiveWords = ['raises', 'secures', 'closes', 'successful', 'growth', 'expansion', 'breakthrough'];
    const negativeWords = ['struggles', 'challenges', 'delays', 'concerns', 'risks'];
    
    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Extract key terms using simple keyword matching
  extractKeyTerms(text) {
    const words = text.toLowerCase().split(/\s+/);
    const keyTerms = [];
    
    // Technology terms
    const techTerms = ['AI', 'machine learning', 'IoT', 'blockchain', 'automation', 'optimization', 'platform', 'SaaS'];
    techTerms.forEach(term => {
      if (text.toLowerCase().includes(term.toLowerCase())) {
        keyTerms.push(term);
      }
    });
    
    // Climate terms
    this.climateKeywords.forEach(keyword => {
      if (text.toLowerCase().includes(keyword)) {
        keyTerms.push(keyword);
      }
    });
    
    return [...new Set(keyTerms)]; // Remove duplicates
  }

  // Classify climate sector based on description
  classifyClimateSector(description, keyTerms) {
    const sectorKeywords = {
      'Solar Energy': ['solar', 'photovoltaic', 'PV'],
      'Wind Energy': ['wind', 'turbine', 'offshore wind'],
      'Energy Storage': ['battery', 'storage', 'grid storage'],
      'Carbon Removal': ['carbon capture', 'DAC', 'carbon removal', 'CCUS'],
      'Clean Transportation': ['electric vehicle', 'EV', 'mobility', 'fleet'],
      'Sustainable Agriculture': ['agriculture', 'farming', 'agtech', 'precision agriculture'],
      'Green Buildings': ['building', 'construction', 'real estate', 'energy efficiency'],
      'Circular Economy': ['waste', 'recycling', 'circular', 'materials'],
      'Water Management': ['water', 'wastewater', 'desalination'],
      'Climate Adaptation': ['adaptation', 'resilience', 'climate risk']
    };
    
    const text = description.toLowerCase();
    
    for (const [sector, keywords] of Object.entries(sectorKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return sector;
      }
    }
    
    return 'Other Climate Tech';
  }

  // Extract technology focus
  extractTechnologyFocus(description, keyTerms) {
    const techFocus = [];
    
    if (keyTerms.some(term => ['AI', 'machine learning'].includes(term))) {
      techFocus.push('Artificial Intelligence');
    }
    if (keyTerms.some(term => ['IoT', 'sensors'].includes(term))) {
      techFocus.push('Internet of Things');
    }
    if (keyTerms.some(term => ['platform', 'SaaS'].includes(term))) {
      techFocus.push('Software Platform');
    }
    if (keyTerms.some(term => ['hardware', 'manufacturing'].includes(term))) {
      techFocus.push('Hardware');
    }
    
    return techFocus.length > 0 ? techFocus : ['General Technology'];
  }

  // Calculate relevance score for climate tech
  calculateRelevanceScore(item, keyTerms) {
    let score = 0;
    
    // Base score for climate keywords
    const climateTermCount = keyTerms.filter(term => 
      this.climateKeywords.includes(term.toLowerCase())
    ).length;
    score += climateTermCount * 10;
    
    // Bonus for funding amount (larger deals get higher scores)
    if (item.amount >= 50000000) score += 20;
    else if (item.amount >= 10000000) score += 15;
    else if (item.amount >= 1000000) score += 10;
    
    // Bonus for recent dates
    const daysSinceDate = (new Date() - new Date(item.date)) / (1000 * 60 * 60 * 24);
    if (daysSinceDate <= 7) score += 15;
    else if (daysSinceDate <= 30) score += 10;
    
    return Math.min(score, 100); // Cap at 100
  }

  // Filter and validate final dataset
  filterAndValidate(data, filters) {
    console.log('🔍 Filtering and validating data...');
    
    return data.filter(item => {
      // Minimum amount filter
      if (item.amount < filters.minAmount) return false;
      
      // Sector filter
      if (filters.sectors.length > 0 && !filters.sectors.includes('all')) {
        if (!filters.sectors.includes(item.nlpAnalysis?.climateSector)) return false;
      }
      
      // Relevance score filter (minimum 20)
      if (item.nlpAnalysis?.relevanceScore < 20) return false;
      
      // Required fields validation
      if (!item.company || !item.amount || !item.date) return false;
      
      return true;
    });
  }

  // Utility functions
  parseAmount(amountStr) {
    if (!amountStr) return 0;
    
    const cleanAmount = amountStr.replace(/[$,\s]/g, '');
    const multiplier = cleanAmount.toLowerCase().includes('b') ? 1000000000 :
                     cleanAmount.toLowerCase().includes('m') ? 1000000 :
                     cleanAmount.toLowerCase().includes('k') ? 1000 : 1;
    
    const number = parseFloat(cleanAmount.replace(/[^\d.]/g, ''));
    return number * multiplier;
  }

  parseDate(dateStr) {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    
    // Handle various date formats
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  }

  cleanCompanyName(name) {
    if (!name) return '';
    
    // Remove common suffixes and clean up
    return name
      .replace(/\s+(Inc|LLC|Corp|Ltd|Co)\.?$/i, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  standardizeFundingStage(stage) {
    if (!stage) return 'Unknown';
    
    const stageMap = {
      'pre-seed': 'Pre-Seed',
      'seed': 'Seed',
      'series a': 'Series A',
      'series b': 'Series B',
      'series c': 'Series C',
      'series d': 'Series D',
      'growth': 'Growth',
      'late stage': 'Late Stage'
    };
    
    return stageMap[stage.toLowerCase()] || stage;
  }

  parseLocation(location) {
    if (!location) return '';
    
    // Extract city, state format
    const parts = location.split(',');
    if (parts.length >= 2) {
      return `${parts[0].trim()}, ${parts[1].trim()}`;
    }
    
    return location.trim();
  }

  // Export data in various formats
  async exportData(data, format = 'json') {
    switch (format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      
      case 'csv':
        return this.convertToCSV(data);
      
      case 'excel':
        return this.convertToExcel(data);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = [
      'Company', 'Sector', 'Stage', 'Amount', 'Date', 'Location', 
      'Investors', 'Description', 'Source', 'Relevance Score'
    ];
    
    const rows = data.map(item => [
      item.company,
      item.nlpAnalysis?.climateSector || '',
      item.stage,
      item.amount,
      item.date,
      item.location,
      Array.isArray(item.investors) ? item.investors.join('; ') : item.investors,
      item.description,
      item.source,
      item.nlpAnalysis?.relevanceScore || 0
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  }

  // Real-time monitoring setup
  setupRealTimeMonitoring(callback, interval = 3600000) { // 1 hour default
    console.log('⏰ Setting up real-time monitoring...');
    
    return setInterval(async () => {
      try {
        const newData = await this.scrapeFundingData();
        if (newData.success && newData.data.length > 0) {
          callback(newData);
        }
      } catch (error) {
        console.error('Real-time monitoring error:', error);
      }
    }, interval);
  }
}

// Export singleton instance
export const fundingScrapingService = new FundingScrapingService();
export default fundingScrapingService;