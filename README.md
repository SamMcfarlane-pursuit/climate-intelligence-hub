# 🌍 Climate Risk Analyzer - AI-Powered Climate Intelligence Platform

A comprehensive climate risk analysis platform that combines real-time environmental data with AI-powered insights to help businesses understand and mitigate climate-related risks.

## 🚀 Features

### 🤖 AI-Powered Analysis
- **Predictive Climate Modeling**: Machine learning algorithms analyze climate trends and predict future risks
- **Business Context Analysis**: Natural language processing to understand your business vulnerabilities
- **Intelligent Recommendations**: AI-generated action plans tailored to your industry and location
- **Financial Impact Modeling**: Real-world cost analysis and ROI calculations

### 🌡️ Real-Time Data Integration
- **Live Weather Data**: Current conditions from OpenWeatherMap API
- **Air Quality Monitoring**: Real-time pollution and air quality indices
- **Climate Projections**: Scientific climate models and future scenarios
- **Regulatory Intelligence**: Up-to-date compliance requirements and deadlines

### 📊 Comprehensive Climate Actions
1. **🌱 Decarbonization**: Carbon reduction strategies and emission tracking
2. **⚡ Energy Transition**: Renewable energy planning and optimization
3. **♻️ Resource Optimization**: Waste reduction and circular economy integration
4. **🛡️ Climate Adaptation**: Resilience building and risk mitigation
5. **📈 Data & Intelligence**: Monitoring, reporting, and analytics tools

## 🔧 Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- Modern web browser
- Internet connection for real-time data

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd climate-dash
   npm install
   ```

2. **Configure Real Data Sources** (Optional but Recommended)
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   VITE_CARBON_API_KEY=your_carbon_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open Application**
   Navigate to `http://localhost:3000`

## 🔑 API Keys Setup (For Real Data)

### 🌤️ OpenWeatherMap API (Recommended)
- **Purpose**: Real-time weather, air quality, and climate data
- **Cost**: Free tier available (1,000 calls/day)
- **Setup**: 
  1. Visit [OpenWeatherMap](https://openweathermap.org/api)
  2. Create free account
  3. Get API key from dashboard
  4.3. Add to `.env` as `VITE_OPENWEATHER_API_KEY`

### 🌿 Carbon Interface API (Optional)
- **Purpose**: Carbon emissions calculations and tracking
- **Cost**: Free tier available
- **Setup**:
  1. Visit [Carbon Interface](https://www.carboninterface.com/)
  2. Sign up for API access
  3. Add key to `.env` as `VITE_CARBON_API_KEY`

### 🌬️ AirNow API (Optional)
- **Purpose**: Enhanced US air quality data
- **Cost**: Free for non-commercial use
- **Setup**:
  1. Visit [AirNow API](https://www.airnowapi.org/)
  2. Request API key
  3. Add to `.env` as `VITE_AIRNOW_API_KEY`

## 📊 Data Sources & Quality

### Real-Time Data Sources
When API keys are configured, the application uses:

- **🌡️ Weather Data**: OpenWeatherMap (current conditions, forecasts)
- **🌬️ Air Quality**: Real-time pollution monitoring
- **📈 Climate Trends**: Historical and projected climate data
- **💰 Financial Data**: Industry-specific risk assessments
- **📋 Regulatory Data**: Government compliance databases

### Fallback Mode
Without API keys, the application uses:
- High-quality simulated data based on real-world patterns
- Industry-standard risk models and calculations
- Realistic financial impact scenarios
- All features remain fully functional

## 🎯 How to Use

### 1. Business Profile Setup
- Enter your company details (industry, size, location)
- Describe your business operations
- Set budget and priorities

### 2. Location & Industry Analysis
- Select your primary business location
- Choose your industry sector
- System automatically gathers relevant data

### 3. AI Analysis Results
- **Predictions**: 5-10 year climate risk forecasts
- **Recommendations**: Prioritized action items
- **Financial Impact**: Cost-benefit analysis
- **Real-Time Data**: Current environmental conditions
- **Climate Actions**: Comprehensive sustainability roadmap

## 🔍 Understanding the Analysis

### Risk Factors
- **Temperature Risk**: Heat-related operational impacts
- **Air Quality Risk**: Pollution effects on business
- **Regulatory Risk**: Compliance requirements and costs
- **Physical Risk**: Infrastructure and property threats

### Data Quality Indicators
- **🟢 Real-Time Data**: Live API connections active
- **🔵 Mixed Sources**: Combination of real and simulated data
- **🟡 Simulated Data**: High-quality fallback mode
- **🔴 Limited Data**: Reduced functionality

### Financial Modeling
- **Physical Risks**: Property damage, business interruption
- **Transition Risks**: Carbon pricing, regulatory compliance
- **Opportunities**: Energy savings, new markets
- **ROI Analysis**: Investment returns and payback periods

## 🛠️ Technical Architecture

### Frontend
- **React 18**: Modern component-based UI
- **Vite**: Fast development and building
- **Recharts**: Interactive data visualizations
- **Lucide React**: Consistent iconography

### Backend Services
- **AI Service**: Machine learning and prediction algorithms
- **Real Data Service**: API integrations and data processing
- **Climate Action Engine**: Sustainability recommendations

### Data Processing
- **Real-time APIs**: Live environmental data
- **AI Enhancement**: Machine learning data processing
- **Fallback Systems**: Robust error handling
- **Data Validation**: Quality assurance and verification

## 🌟 Key Benefits

### For Businesses
- **Risk Assessment**: Understand climate vulnerabilities
- **Cost Planning**: Budget for climate adaptation
- **Compliance**: Stay ahead of regulations
- **Competitive Advantage**: Proactive sustainability

### For Decision Makers
- **Data-Driven Insights**: Evidence-based recommendations
- **Financial Clarity**: Clear ROI and cost projections
- **Action Planning**: Prioritized implementation roadmap
- **Progress Tracking**: Measurable outcomes

## 🔒 Privacy & Security

- **No Personal Data Storage**: Analysis runs locally
- **API Key Security**: Environment variables only
- **Data Encryption**: Secure API communications
- **Privacy First**: No tracking or data collection

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for:
- Code standards and best practices
- Testing requirements
- Documentation updates
- Feature requests and bug reports

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues
- **API Rate Limits**: Use multiple API keys or upgrade plans
- **CORS Errors**: Check API key configuration
- **Slow Loading**: Verify internet connection and API status

### Getting Help
- Check the console for error messages
- Verify API keys in `.env` file
- Review data source indicators in the app
- Contact support for technical assistance

---

**Built with ❤️ for a sustainable future**