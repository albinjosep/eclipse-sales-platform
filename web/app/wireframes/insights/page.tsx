'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Users, DollarSign, Calendar, Clock, Filter, RefreshCw, Download, BarChart3, PieChart, LineChart, Zap, Brain, Eye, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const AIInsightsWireframe = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedInsight, setSelectedInsight] = useState('trends');
  const [activeRightPanel, setActiveRightPanel] = useState('leads');

  const marketTrends = [
    {
      id: 1,
      title: 'Enterprise Software Demand Surge',
      category: 'Market Opportunity',
      trend: 'up',
      impact: 'high',
      confidence: 92,
      description: 'Enterprise software adoption increased 34% this quarter, driven by remote work policies.',
      timeframe: 'Last 30 days',
      actionable: true,
      metrics: { growth: '+34%', value: '$2.4M', timeline: 'Q1 2024' }
    },
    {
      id: 2,
      title: 'SMB Budget Constraints Tightening',
      category: 'Market Risk',
      trend: 'down',
      impact: 'medium',
      confidence: 87,
      description: 'Small-medium businesses showing 23% reduction in software spending due to economic uncertainty.',
      timeframe: 'Last 60 days',
      actionable: true,
      metrics: { growth: '-23%', value: '$890K', timeline: 'Q1 2024' }
    },
    {
      id: 3,
      title: 'AI Integration Becoming Standard',
      category: 'Technology Shift',
      trend: 'up',
      impact: 'high',
      confidence: 95,
      description: 'Companies actively seeking AI-powered solutions, creating new market opportunities.',
      timeframe: 'Last 90 days',
      actionable: true,
      metrics: { growth: '+67%', value: '$1.8M', timeline: 'Q2 2024' }
    }
  ];

  const forecasts = [
    {
      id: 1,
      title: 'Q1 Revenue Forecast',
      type: 'revenue',
      prediction: '$1.2M',
      confidence: 89,
      trend: 'up',
      change: '+12%',
      factors: ['Strong pipeline', 'Seasonal uptick', 'New product launch'],
      risks: ['Economic uncertainty', 'Competitor pricing']
    },
    {
      id: 2,
      title: 'Deal Closure Probability',
      type: 'deals',
      prediction: '67%',
      confidence: 84,
      trend: 'up',
      change: '+5%',
      factors: ['Improved qualification', 'Better follow-up'],
      risks: ['Longer sales cycles', 'Budget delays']
    },
    {
      id: 3,
      title: 'Lead Quality Score',
      type: 'leads',
      prediction: '8.2/10',
      confidence: 91,
      trend: 'stable',
      change: '+0.3',
      factors: ['Better targeting', 'Content optimization'],
      risks: ['Market saturation', 'Competition']
    }
  ];

  const prioritizedLeads = [
    {
      id: 1,
      company: 'TechCorp Inc',
      contact: 'Sarah Johnson',
      score: 95,
      reason: 'Visited pricing page 5x, downloaded whitepaper, CEO title',
      value: '$120K',
      urgency: 'high',
      nextAction: 'Schedule demo call',
      timeframe: 'Today',
      signals: ['High intent', 'Budget confirmed', 'Decision maker']
    },
    {
      id: 2,
      company: 'StartupXYZ',
      contact: 'Mike Chen',
      score: 87,
      reason: 'Multiple stakeholder engagement, technical questions asked',
      value: '$45K',
      urgency: 'medium',
      nextAction: 'Send technical documentation',
      timeframe: 'This week',
      signals: ['Technical interest', 'Team involvement', 'Active research']
    },
    {
      id: 3,
      company: 'Global Solutions',
      contact: 'Emma Davis',
      score: 82,
      reason: 'Competitor comparison research, budget timeline mentioned',
      value: '$200K',
      urgency: 'medium',
      nextAction: 'Competitive analysis call',
      timeframe: 'This week',
      signals: ['Comparison shopping', 'Budget planning', 'Timeline set']
    }
  ];

  const risksToAddress = [
    {
      id: 1,
      title: 'BigTech Inc Deal Stalling',
      type: 'deal_risk',
      severity: 'high',
      value: '$300K',
      description: 'No contact for 5 days, competitor mentioned in last call',
      action: 'Immediate follow-up with decision maker',
      deadline: 'Today',
      probability: '85%'
    },
    {
      id: 2,
      title: 'Q1 Pipeline Gap',
      type: 'pipeline_risk',
      severity: 'medium',
      value: '$150K',
      description: 'Pipeline 23% below target for Q1 close',
      action: 'Accelerate qualification of warm leads',
      deadline: 'This week',
      probability: '67%'
    },
    {
      id: 3,
      title: 'Competitor Price War',
      type: 'market_risk',
      severity: 'medium',
      value: '$500K',
      description: 'Main competitor dropped prices by 15% across enterprise segment',
      action: 'Review pricing strategy and value proposition',
      deadline: 'Next week',
      probability: '72%'
    }
  ];

  const getTrendIcon = (trend: any) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down': return <TrendingDown className="w-5 h-5 text-red-500" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: any) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: any) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency: any) => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main AI Insights Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Brain className="w-8 h-8 mr-3 text-blue-600" />
                AI Insights
              </h1>
              <p className="text-gray-600">Market trends, forecasts, and AI-powered recommendations</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedTimeframe} 
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Insights Navigation */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'trends', name: 'Market Trends', icon: TrendingUp },
              { id: 'forecasts', name: 'AI Forecasts', icon: BarChart3 },
              { id: 'analytics', name: 'Performance Analytics', icon: PieChart }
            ].map((tab: any) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedInsight(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 ${
                    selectedInsight === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedInsight === 'trends' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Market Trends & Opportunities</h2>
                <p className="text-gray-600">AI-detected patterns and emerging opportunities in your market</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {marketTrends.map((trend) => (
                  <div key={trend.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(trend.trend)}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{trend.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(trend.impact)}`}>
                            {trend.impact.toUpperCase()} IMPACT
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Confidence</div>
                        <div className="text-lg font-bold text-blue-600">{trend.confidence}%</div>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{trend.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className={`text-lg font-bold ${
                          trend.trend === 'up' ? 'text-green-600' : 
                          trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {trend.metrics.growth}
                        </div>
                        <div className="text-xs text-gray-500">Growth</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{trend.metrics.value}</div>
                        <div className="text-xs text-gray-500">Impact Value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">{trend.metrics.timeline}</div>
                        <div className="text-xs text-gray-500">Timeline</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{trend.timeframe}</span>
                      {trend.actionable && (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                          View Actions
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedInsight === 'forecasts' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">AI-Generated Forecasts</h2>
                <p className="text-gray-600">Predictive analytics and future performance projections</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {forecasts.map((forecast) => (
                  <div key={forecast.id} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{forecast.title}</h3>
                      {getTrendIcon(forecast.trend)}
                    </div>
                    
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-blue-600 mb-1">{forecast.prediction}</div>
                      <div className={`text-sm font-medium ${
                        forecast.trend === 'up' ? 'text-green-600' : 
                        forecast.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {forecast.change} vs last period
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Confidence</span>
                        <span className="text-sm font-medium text-gray-900">{forecast.confidence}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${forecast.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Key Factors</h4>
                        <ul className="space-y-1">
                          {forecast.factors.slice(0, 2).map((factor, index) => (
                            <li key={index} className="text-sm text-green-700 flex items-center">
                              <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Risk Factors</h4>
                        <ul className="space-y-1">
                          {forecast.risks.slice(0, 2).map((risk, index) => (
                            <li key={index} className="text-sm text-red-700 flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedInsight === 'analytics' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h2>
                <p className="text-gray-600">Deep dive into your sales performance metrics</p>
              </div>
              
              {/* Placeholder for charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <LineChart className="w-16 h-16 text-gray-400" />
                    <span className="ml-3 text-gray-500">Revenue trend chart would go here</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deal Distribution</h3>
                  <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <PieChart className="w-16 h-16 text-gray-400" />
                    <span className="ml-3 text-gray-500">Deal distribution chart would go here</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {/* Panel Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'leads', name: 'Priority Leads', icon: Target },
              { id: 'risks', name: 'Risks', icon: AlertTriangle }
            ].map((tab: any) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveRightPanel(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium border-b-2 ${
                    activeRightPanel === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeRightPanel === 'leads' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Leads to Prioritize Today</h3>
              <div className="space-y-4">
                {prioritizedLeads.map((lead) => (
                  <div key={lead.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{lead.company}</h4>
                        <p className="text-sm text-gray-600">{lead.contact}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{lead.score}</div>
                        <div className="text-xs text-gray-500">AI Score</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Why prioritize:</div>
                      <p className="text-sm text-gray-700">{lead.reason}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <div className="text-sm font-medium text-green-600">{lead.value}</div>
                        <div className="text-xs text-gray-500">Potential Value</div>
                      </div>
                      <div>
                        <div className={`text-sm font-medium ${getUrgencyColor(lead.urgency)}`}>
                          {lead.urgency.toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">Urgency</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Buying Signals:</div>
                      <div className="flex flex-wrap gap-1">
                        {lead.signals.map((signal, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {signal}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{lead.nextAction}</div>
                        <div className="text-xs text-gray-500">{lead.timeframe}</div>
                      </div>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        Take Action
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeRightPanel === 'risks' && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Risks to Address</h3>
              <div className="space-y-4">
                {risksToAddress.map((risk) => (
                  <div key={risk.id} className={`border rounded-lg p-4 ${getSeverityColor(risk.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{risk.title}</h4>
                      <div className="text-right">
                        <div className="text-sm font-bold">{risk.probability}</div>
                        <div className="text-xs text-gray-500">Risk Level</div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(risk.severity)}`}>
                          {risk.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{risk.value}</span>
                      </div>
                      <p className="text-sm text-gray-700">{risk.description}</p>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900 mb-1">Recommended Action:</div>
                      <p className="text-sm text-gray-700">{risk.action}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">Due: {risk.deadline}</span>
                      </div>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        Address Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsWireframe;