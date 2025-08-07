import React from 'react';
import { CheckCircle, AlertTriangle, Wifi, WifiOff, Database, Globe } from 'lucide-react';

const DataSourceIndicator = ({ dataSource, realData, lastUpdated }) => {
  const getDataQuality = () => {
    if (realData?.climate?.dataQuality === 'real-time') {
      return {
        level: 'excellent',
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        label: 'Real-Time Data',
        description: 'Using live climate and environmental data'
      };
    }
    
    if (dataSource === 'real-financial-data' || realData?.carbon || realData?.regulatory) {
      return {
        level: 'good',
        icon: Database,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        label: 'Real Data Sources',
        description: 'Using actual financial and regulatory data'
      };
    }
    
    if (dataSource === 'simulated') {
      return {
        level: 'simulated',
        icon: AlertTriangle,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        label: 'Simulated Data',
        description: 'Using high-quality simulated data for demonstration'
      };
    }
    
    return {
      level: 'mixed',
      icon: Globe,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      label: 'Mixed Data Sources',
      description: 'Combining real and simulated data sources'
    };
  };

  const quality = getDataQuality();
  const IconComponent = quality.icon;

  const getDataSources = () => {
    const sources = [];
    
    if (realData?.climate?.dataQuality === 'real-time') {
      sources.push({
        name: 'OpenWeatherMap API',
        type: 'Climate Data',
        status: 'active',
        icon: Wifi
      });
    }
    
    if (realData?.carbon) {
      sources.push({
        name: 'EPA/IPCC Guidelines',
        type: 'Carbon Emissions',
        status: 'active',
        icon: Database
      });
    }
    
    if (realData?.regulatory) {
      sources.push({
        name: 'Government Databases',
        type: 'Regulatory Data',
        status: 'active',
        icon: Globe
      });
    }
    
    if (sources.length === 0) {
      sources.push({
        name: 'AI Simulation Engine',
        type: 'Simulated Data',
        status: 'fallback',
        icon: WifiOff
      });
    }
    
    return sources;
  };

  const sources = getDataSources();

  return (
    <div className={`rounded-lg border ${quality.borderColor} ${quality.bgColor} p-4 mb-6`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <IconComponent className={`h-5 w-5 ${quality.color}`} />
          <span className={`font-semibold ${quality.color}`}>{quality.label}</span>
        </div>
        {lastUpdated && (
          <span className="text-sm text-gray-500">
            Updated: {new Date(lastUpdated).toLocaleTimeString()}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3">{quality.description}</p>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Active Data Sources:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sources.map((source, index) => {
            const SourceIcon = source.icon;
            return (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <SourceIcon className={`h-4 w-4 ${
                  source.status === 'active' ? 'text-green-500' : 'text-gray-400'
                }`} />
                <span className="font-medium">{source.name}</span>
                <span className="text-gray-500">({source.type})</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {quality.level === 'excellent' && (
        <div className="mt-3 p-2 bg-green-100 rounded text-sm text-green-800">
          <strong>Real-Time Intelligence:</strong> This analysis uses live data from multiple APIs 
          including weather stations, air quality monitors, and government databases for maximum accuracy.
        </div>
      )}
      
      {quality.level === 'simulated' && (
        <div className="mt-3 p-2 bg-amber-100 rounded text-sm text-amber-800">
          <strong>Demo Mode:</strong> To access real-time data, configure API keys in your environment. 
          Current analysis uses high-quality simulated data based on real-world patterns.
        </div>
      )}
    </div>
  );
};

export default DataSourceIndicator;