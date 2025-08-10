// Climate Tech Funding Analytics Service
// Provides advanced analytics, insights, and trend analysis for funding data

class FundingAnalyticsService {
  constructor() {
    this.dataStore = new Map(); // In-memory storage (would use database in production)
    this.insights = new Map();
    this.trends = new Map();
    
    // Analytics configuration
    this.config = {
      trendAnalysisPeriods: [7, 30, 90, 365], // days
      sectorCategories: [
        'Solar Energy', 'Wind Energy', 'Energy Storage', 'Carbon Removal',
        'Clean Transportation', 'Sustainable Agriculture', 'Green Buildings',
        'Circular Economy', 'Water Management', 'Climate Adaptation'
      ],
      fundingStages: ['Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth'],
      geographicRegions: ['North America', 'Europe', 'Asia Pacific', 'Other']
    };
  }

  // Store and index funding data
  async storeFundingData(data, source = 'unknown') {
    const timestamp = new Date().toISOString();
    const dataId = `${source}_${timestamp}`;
    
    // Add metadata
    const enrichedData = data.map(item => ({
      ...item,
      dataId,
      storedAt: timestamp,
      source,
      indexed: true
    }));

    // Store in memory (would use database in production)
    this.dataStore.set(dataId, enrichedData);
    
    // Update search index
    await this.updateSearchIndex(enrichedData);
    
    // Generate insights
    await this.generateInsights(enrichedData);
    
    console.log(`📊 Stored ${enrichedData.length} funding records from ${source}`);
    
    return {
      success: true,
      dataId,
      recordCount: enrichedData.length,
      timestamp
    };
  }

  // Retrieve all funding data with filters
  async getFundingData(filters = {}) {
    const allData = Array.from(this.dataStore.values()).flat();
    
    return this.applyFilters(allData, filters);
  }

  // Apply various filters to funding data
  applyFilters(data, filters) {
    let filtered = [...data];

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        if (filters.startDate && itemDate < new Date(filters.startDate)) return false;
        if (filters.endDate && itemDate > new Date(filters.endDate)) return false;
        return true;
      });
    }

    // Amount range filter
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(item => item.amount >= filters.minAmount);
    }
    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(item => item.amount <= filters.maxAmount);
    }

    // Sector filter
    if (filters.sectors && filters.sectors.length > 0) {
      filtered = filtered.filter(item => 
        filters.sectors.includes(item.nlpAnalysis?.climateSector)
      );
    }

    // Stage filter
    if (filters.stages && filters.stages.length > 0) {
      filtered = filtered.filter(item => 
        filters.stages.includes(item.stage)
      );
    }

    // Geographic filter
    if (filters.regions && filters.regions.length > 0) {
      filtered = filtered.filter(item => {
        const region = this.getRegionFromLocation(item.location);
        return filters.regions.includes(region);
      });
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.company.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        (item.investors && item.investors.some(inv => 
          inv.toLowerCase().includes(searchTerm)
        ))
      );
    }

    return filtered;
  }

  // Generate comprehensive analytics insights
  async generateInsights(data = null) {
    const dataset = data || await this.getFundingData();
    
    const insights = {
      overview: this.generateOverviewInsights(dataset),
      trends: this.generateTrendInsights(dataset),
      sectors: this.generateSectorInsights(dataset),
      geography: this.generateGeographicInsights(dataset),
      investors: this.generateInvestorInsights(dataset),
      predictions: this.generatePredictions(dataset),
      generatedAt: new Date().toISOString()
    };

    this.insights.set('latest', insights);
    
    return insights;
  }

  // Overview insights
  generateOverviewInsights(data) {
    const totalFunding = data.reduce((sum, item) => sum + item.amount, 0);
    const dealCount = data.length;
    const avgDealSize = dealCount > 0 ? totalFunding / dealCount : 0;
    
    // Calculate growth rates
    const last30Days = this.filterByDateRange(data, 30);
    const previous30Days = this.filterByDateRange(data, 60, 30);
    
    const growthRate = this.calculateGrowthRate(
      last30Days.reduce((sum, item) => sum + item.amount, 0),
      previous30Days.reduce((sum, item) => sum + item.amount, 0)
    );

    return {
      totalFunding,
      dealCount,
      avgDealSize,
      growthRate,
      activeInvestors: new Set(data.flatMap(item => item.investors || [])).size,
      activeSectors: new Set(data.map(item => item.nlpAnalysis?.climateSector)).size
    };
  }

  // Trend analysis
  generateTrendInsights(data) {
    const trends = {};

    // Funding trends by time period
    this.config.trendAnalysisPeriods.forEach(period => {
      const periodData = this.filterByDateRange(data, period);
      trends[`last${period}Days`] = {
        totalFunding: periodData.reduce((sum, item) => sum + item.amount, 0),
        dealCount: periodData.length,
        avgDealSize: periodData.length > 0 ? 
          periodData.reduce((sum, item) => sum + item.amount, 0) / periodData.length : 0
      };
    });

    // Monthly trends
    trends.monthlyTrends = this.generateMonthlyTrends(data);
    
    // Stage progression trends
    trends.stageProgression = this.analyzeStageProgression(data);

    return trends;
  }

  // Sector-specific insights
  generateSectorInsights(data) {
    const sectorData = {};

    this.config.sectorCategories.forEach(sector => {
      const sectorDeals = data.filter(item => 
        item.nlpAnalysis?.climateSector === sector
      );

      if (sectorDeals.length > 0) {
        sectorData[sector] = {
          dealCount: sectorDeals.length,
          totalFunding: sectorDeals.reduce((sum, item) => sum + item.amount, 0),
          avgDealSize: sectorDeals.reduce((sum, item) => sum + item.amount, 0) / sectorDeals.length,
          topCompanies: sectorDeals
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map(item => ({ company: item.company, amount: item.amount })),
          stageDistribution: this.getStageDistribution(sectorDeals),
          growthRate: this.calculateSectorGrowthRate(sectorDeals)
        };
      }
    });

    return sectorData;
  }

  // Geographic insights
  generateGeographicInsights(data) {
    const geoData = {};

    // Group by region
    this.config.geographicRegions.forEach(region => {
      const regionDeals = data.filter(item => 
        this.getRegionFromLocation(item.location) === region
      );

      if (regionDeals.length > 0) {
        geoData[region] = {
          dealCount: regionDeals.length,
          totalFunding: regionDeals.reduce((sum, item) => sum + item.amount, 0),
          avgDealSize: regionDeals.reduce((sum, item) => sum + item.amount, 0) / regionDeals.length,
          topSectors: this.getTopSectors(regionDeals),
          topCities: this.getTopCities(regionDeals)
        };
      }
    });

    return geoData;
  }

  // Investor insights
  generateInvestorInsights(data) {
    const investorStats = {};
    
    // Count investments per investor
    data.forEach(item => {
      if (item.investors) {
        item.investors.forEach(investor => {
          if (!investorStats[investor]) {
            investorStats[investor] = {
              dealCount: 0,
              totalInvested: 0,
              sectors: new Set(),
              stages: new Set(),
              companies: []
            };
          }
          
          investorStats[investor].dealCount++;
          investorStats[investor].totalInvested += item.amount;
          investorStats[investor].sectors.add(item.nlpAnalysis?.climateSector);
          investorStats[investor].stages.add(item.stage);
          investorStats[investor].companies.push(item.company);
        });
      }
    });

    // Convert sets to arrays and sort
    const topInvestors = Object.entries(investorStats)
      .map(([investor, stats]) => ({
        investor,
        dealCount: stats.dealCount,
        totalInvested: stats.totalInvested,
        avgInvestment: stats.totalInvested / stats.dealCount,
        sectors: Array.from(stats.sectors),
        stages: Array.from(stats.stages),
        companies: stats.companies
      }))
      .sort((a, b) => b.dealCount - a.dealCount)
      .slice(0, 20);

    return {
      topInvestors,
      totalActiveInvestors: Object.keys(investorStats).length,
      investorConcentration: this.calculateInvestorConcentration(investorStats)
    };
  }

  // Predictive analytics
  generatePredictions(data) {
    const predictions = {};

    // Funding velocity prediction
    predictions.fundingVelocity = this.predictFundingVelocity(data);
    
    // Sector growth predictions
    predictions.sectorGrowth = this.predictSectorGrowth(data);
    
    // Deal size trends
    predictions.dealSizeTrends = this.predictDealSizeTrends(data);
    
    // Emerging sectors
    predictions.emergingSectors = this.identifyEmergingSectors(data);

    return predictions;
  }

  // Search functionality with ranking
  async searchFunding(query, options = {}) {
    const allData = await this.getFundingData();
    const searchResults = [];

    const queryTerms = query.toLowerCase().split(/\s+/);

    allData.forEach(item => {
      let score = 0;
      const searchableText = [
        item.company,
        item.description,
        item.nlpAnalysis?.climateSector || '',
        ...(item.investors || []),
        ...(item.nlpAnalysis?.keyTerms || [])
      ].join(' ').toLowerCase();

      // Calculate relevance score
      queryTerms.forEach(term => {
        const termCount = (searchableText.match(new RegExp(term, 'g')) || []).length;
        score += termCount;
        
        // Boost score for exact matches in company name
        if (item.company.toLowerCase().includes(term)) {
          score += 5;
        }
      });

      if (score > 0) {
        searchResults.push({
          ...item,
          searchScore: score
        });
      }
    });

    // Sort by relevance score
    searchResults.sort((a, b) => b.searchScore - a.searchScore);

    return searchResults.slice(0, options.limit || 50);
  }

  // Export analytics data
  async exportAnalytics(format = 'json', options = {}) {
    const insights = await this.generateInsights();
    const data = await this.getFundingData(options.filters || {});

    const exportData = {
      insights,
      data: options.includeRawData ? data : null,
      metadata: {
        exportedAt: new Date().toISOString(),
        recordCount: data.length,
        format
      }
    };

    switch (format) {
      case 'json':
        return JSON.stringify(exportData, null, 2);
      
      case 'csv':
        return this.convertInsightsToCSV(insights, data);
      
      case 'summary':
        return this.generateExecutiveSummary(insights);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  // Utility functions
  filterByDateRange(data, days, offset = 0) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - offset);
    
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - days);

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  }

  calculateGrowthRate(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  getRegionFromLocation(location) {
    if (!location) return 'Other';
    
    const usStates = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
    const europeanCountries = ['UK', 'Germany', 'France', 'Netherlands', 'Sweden'];
    const asianCountries = ['China', 'Japan', 'Singapore', 'India', 'South Korea'];

    if (usStates.some(state => location.includes(state))) return 'North America';
    if (europeanCountries.some(country => location.includes(country))) return 'Europe';
    if (asianCountries.some(country => location.includes(country))) return 'Asia Pacific';
    
    return 'Other';
  }

  generateMonthlyTrends(data) {
    const monthlyData = {};
    
    data.forEach(item => {
      const month = new Date(item.date).toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { funding: 0, deals: 0 };
      }
      monthlyData[month].funding += item.amount;
      monthlyData[month].deals++;
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, stats]) => ({
        month,
        funding: stats.funding,
        deals: stats.deals,
        avgDealSize: stats.funding / stats.deals
      }));
  }

  getStageDistribution(data) {
    const distribution = {};
    data.forEach(item => {
      distribution[item.stage] = (distribution[item.stage] || 0) + 1;
    });
    return distribution;
  }

  calculateSectorGrowthRate(sectorDeals) {
    const recent = this.filterByDateRange(sectorDeals, 30);
    const previous = this.filterByDateRange(sectorDeals, 60, 30);
    
    const recentFunding = recent.reduce((sum, item) => sum + item.amount, 0);
    const previousFunding = previous.reduce((sum, item) => sum + item.amount, 0);
    
    return this.calculateGrowthRate(recentFunding, previousFunding);
  }

  getTopSectors(data) {
    const sectorCounts = {};
    data.forEach(item => {
      const sector = item.nlpAnalysis?.climateSector || 'Unknown';
      sectorCounts[sector] = (sectorCounts[sector] || 0) + item.amount;
    });
    
    return Object.entries(sectorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([sector, funding]) => ({ sector, funding }));
  }

  getTopCities(data) {
    const cityCounts = {};
    data.forEach(item => {
      const city = item.location ? item.location.split(',')[0].trim() : 'Unknown';
      cityCounts[city] = (cityCounts[city] || 0) + 1;
    });
    
    return Object.entries(cityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([city, deals]) => ({ city, deals }));
  }

  predictFundingVelocity(data) {
    const monthlyTrends = this.generateMonthlyTrends(data);
    if (monthlyTrends.length < 3) return null;

    // Simple linear regression for prediction
    const recentTrends = monthlyTrends.slice(-6); // Last 6 months
    const avgGrowth = recentTrends.reduce((sum, month, index) => {
      if (index === 0) return 0;
      const growth = this.calculateGrowthRate(month.funding, recentTrends[index - 1].funding);
      return sum + growth;
    }, 0) / (recentTrends.length - 1);

    return {
      predictedMonthlyGrowth: avgGrowth,
      confidence: Math.min(recentTrends.length * 15, 85) // Confidence based on data points
    };
  }

  predictSectorGrowth(data) {
    const sectorPredictions = {};
    
    this.config.sectorCategories.forEach(sector => {
      const sectorData = data.filter(item => 
        item.nlpAnalysis?.climateSector === sector
      );
      
      if (sectorData.length >= 3) {
        const growthRate = this.calculateSectorGrowthRate(sectorData);
        sectorPredictions[sector] = {
          currentGrowthRate: growthRate,
          prediction: growthRate > 20 ? 'High Growth' : 
                     growthRate > 0 ? 'Moderate Growth' : 'Declining'
        };
      }
    });

    return sectorPredictions;
  }

  predictDealSizeTrends(data) {
    const monthlyTrends = this.generateMonthlyTrends(data);
    if (monthlyTrends.length < 3) return null;

    const avgDealSizes = monthlyTrends.map(month => month.avgDealSize);
    const trend = avgDealSizes[avgDealSizes.length - 1] > avgDealSizes[0] ? 'increasing' : 'decreasing';

    return {
      trend,
      currentAvg: avgDealSizes[avgDealSizes.length - 1],
      changeFromStart: this.calculateGrowthRate(
        avgDealSizes[avgDealSizes.length - 1],
        avgDealSizes[0]
      )
    };
  }

  identifyEmergingSectors(data) {
    const recentData = this.filterByDateRange(data, 90);
    const olderData = this.filterByDateRange(data, 180, 90);

    const recentSectors = {};
    const olderSectors = {};

    recentData.forEach(item => {
      const sector = item.nlpAnalysis?.climateSector;
      if (sector) {
        recentSectors[sector] = (recentSectors[sector] || 0) + 1;
      }
    });

    olderData.forEach(item => {
      const sector = item.nlpAnalysis?.climateSector;
      if (sector) {
        olderSectors[sector] = (olderSectors[sector] || 0) + 1;
      }
    });

    const emergingSectors = [];
    Object.entries(recentSectors).forEach(([sector, recentCount]) => {
      const olderCount = olderSectors[sector] || 0;
      const growthRate = this.calculateGrowthRate(recentCount, olderCount);
      
      if (growthRate > 50 && recentCount >= 2) {
        emergingSectors.push({
          sector,
          growthRate,
          recentDeals: recentCount
        });
      }
    });

    return emergingSectors.sort((a, b) => b.growthRate - a.growthRate);
  }

  calculateInvestorConcentration(investorStats) {
    const investments = Object.values(investorStats).map(stat => stat.dealCount);
    const total = investments.reduce((sum, count) => sum + count, 0);
    const top5 = investments.sort((a, b) => b - a).slice(0, 5).reduce((sum, count) => sum + count, 0);
    
    return {
      top5Concentration: (top5 / total) * 100,
      herfindahlIndex: investments.reduce((sum, count) => sum + Math.pow(count / total, 2), 0)
    };
  }

  generateExecutiveSummary(insights) {
    return `
# Climate Tech Funding Analytics - Executive Summary

## Key Metrics
- Total Funding: $${(insights.overview.totalFunding / 1000000).toFixed(1)}M
- Total Deals: ${insights.overview.dealCount}
- Average Deal Size: $${(insights.overview.avgDealSize / 1000000).toFixed(1)}M
- Growth Rate: ${insights.overview.growthRate.toFixed(1)}%

## Top Performing Sectors
${Object.entries(insights.sectors)
  .sort(([,a], [,b]) => b.totalFunding - a.totalFunding)
  .slice(0, 5)
  .map(([sector, data]) => `- ${sector}: $${(data.totalFunding / 1000000).toFixed(1)}M (${data.dealCount} deals)`)
  .join('\n')}

## Geographic Distribution
${Object.entries(insights.geography)
  .sort(([,a], [,b]) => b.totalFunding - a.totalFunding)
  .map(([region, data]) => `- ${region}: $${(data.totalFunding / 1000000).toFixed(1)}M (${data.dealCount} deals)`)
  .join('\n')}

## Investment Trends
- Most Active Investors: ${insights.investors.topInvestors.slice(0, 3).map(inv => inv.investor).join(', ')}
- Emerging Sectors: ${insights.predictions.emergingSectors?.slice(0, 3).map(s => s.sector).join(', ') || 'None identified'}

Generated: ${new Date().toLocaleDateString()}
    `.trim();
  }

  // Update search index for fast searching
  async updateSearchIndex(data) {
    // In production, this would update a search index like Elasticsearch
    console.log(`🔍 Updated search index with ${data.length} records`);
  }
}

// Export singleton instance
export const fundingAnalyticsService = new FundingAnalyticsService();
export default fundingAnalyticsService;