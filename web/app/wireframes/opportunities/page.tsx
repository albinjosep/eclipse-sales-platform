'use client';

import React, { useState } from 'react';
import { DollarSign, Calendar, User, Building, TrendingUp, AlertTriangle, Target, Clock, Filter, Search, Plus, MoreHorizontal, Mail, Phone, FileText, CheckCircle, XCircle, ArrowRight, Zap, Shield, Users } from 'lucide-react';

interface Opportunity {
  id: number;
  name: string;
  company: string;
  contact: string;
  value: number;
  stage: string;
  probability: number;
  closeDate: string;
  createdDate: string;
  lastActivity: string;
  healthScore: string;
  source: string;
  competitors: string[];
  nextSteps: string[];
  riskFactors: string[];
  keyEvents: Array<{
    date: string;
    event: string;
    type: string;
  }>;
}

const OpportunitiesWireframe = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');
  const [filterHealth, setFilterHealth] = useState('all');

  const opportunities = [
    {
      id: 1,
      name: 'Enterprise License - TechCorp',
      company: 'TechCorp Inc',
      contact: 'Sarah Johnson',
      value: 120000,
      stage: 'Proposal',
      probability: 75,
      closeDate: '2024-02-28',
      createdDate: '2024-01-15',
      lastActivity: '2 hours ago',
      healthScore: 'hot',
      source: 'Inbound',
      competitors: ['Salesforce', 'HubSpot'],
      nextSteps: ['Schedule demo', 'Send proposal', 'Follow up on pricing'],
      riskFactors: ['Budget concerns', 'Decision timeline'],
      keyEvents: [
        { date: '2024-01-20', event: 'Demo completed', type: 'positive' },
        { date: '2024-01-18', event: 'Pricing discussion', type: 'neutral' },
        { date: '2024-01-15', event: 'Initial contact', type: 'positive' }
      ]
    },
    {
      id: 2,
      name: 'Starter Package - StartupXYZ',
      company: 'StartupXYZ',
      contact: 'David Brown',
      value: 25000,
      stage: 'Qualification',
      probability: 45,
      closeDate: '2024-03-15',
      createdDate: '2024-01-10',
      lastActivity: '1 day ago',
      healthScore: 'warm',
      source: 'Outbound',
      competitors: ['Pipedrive', 'Zoho'],
      nextSteps: ['Qualify budget', 'Identify decision makers'],
      riskFactors: ['Limited budget', 'Multiple vendors'],
      keyEvents: [
        { date: '2024-01-12', event: 'Discovery call', type: 'positive' },
        { date: '2024-01-10', event: 'Cold outreach', type: 'neutral' }
      ]
    },
    {
      id: 3,
      name: 'Global Rollout - Global Solutions',
      company: 'Global Solutions',
      contact: 'Robert Wilson',
      value: 300000,
      stage: 'Negotiation',
      probability: 85,
      closeDate: '2024-02-20',
      createdDate: '2023-12-01',
      lastActivity: '3 days ago',
      healthScore: 'at-risk',
      source: 'Referral',
      competitors: ['Microsoft', 'Oracle'],
      nextSteps: ['Address security concerns', 'Finalize contract terms'],
      riskFactors: ['Security requirements', 'Legal review delays'],
      keyEvents: [
        { date: '2024-01-10', event: 'Security review', type: 'negative' },
        { date: '2024-01-05', event: 'Contract negotiation', type: 'neutral' },
        { date: '2023-12-15', event: 'Proposal submitted', type: 'positive' }
      ]
    }
  ];

  const aiSuggestions: Record<number, Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    timeframe: string;
  }>> = {
    1: [
      { type: 'action', priority: 'high', title: 'Send follow-up email', description: 'Sarah hasn\'t responded to your proposal. Send a gentle follow-up.', timeframe: 'Today' },
      { type: 'insight', priority: 'medium', title: 'Competitor analysis', description: 'TechCorp is also evaluating Salesforce. Highlight your unique advantages.', timeframe: 'This week' },
      { type: 'opportunity', priority: 'high', title: 'Upsell potential', description: 'Based on company size, they might need additional modules worth $50K.', timeframe: 'Next meeting' }
    ],
    2: [
      { type: 'action', priority: 'high', title: 'Qualify budget', description: 'David mentioned budget constraints. Schedule a call to understand their range.', timeframe: 'This week' },
      { type: 'risk', priority: 'medium', title: 'Decision timeline', description: 'Startup funding round might affect purchase timing. Monitor closely.', timeframe: 'Ongoing' }
    ],
    3: [
      { type: 'action', priority: 'urgent', title: 'Address security concerns', description: 'Legal team raised security questions. Schedule technical review ASAP.', timeframe: 'Today' },
      { type: 'risk', priority: 'high', title: 'Deal at risk', description: 'No activity for 3 days. Competitor may be gaining ground.', timeframe: 'Immediate' }
    ]
  };

  const competitorInsights: Record<number, {
    primary: string;
    analysis: string;
    advantages: string[];
    risks: string[];
  }> = {
    1: {
      primary: 'Salesforce',
      analysis: 'TechCorp is comparing enterprise features. Salesforce is stronger in customization but weaker in pricing.',
      advantages: ['Better pricing', 'Faster implementation', 'Superior support'],
      risks: ['Feature gaps in reporting', 'Brand recognition']
    },
    2: {
      primary: 'Pipedrive',
      analysis: 'StartupXYZ values simplicity. Pipedrive has simpler UI but lacks advanced features.',
      advantages: ['More features for the price', 'Better scalability', 'API integrations'],
      risks: ['Steeper learning curve', 'Overkill for current needs']
    },
    3: {
      primary: 'Microsoft',
      analysis: 'Global Solutions has existing Microsoft infrastructure. Integration is their key concern.',
      advantages: ['Specialized industry features', 'Better security', 'Competitive pricing'],
      risks: ['Integration complexity', 'Microsoft ecosystem lock-in']
    }
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case 'hot':
        return { emoji: '🔥', text: 'Hot', color: 'bg-red-100 text-red-800' };
      case 'warm':
        return { emoji: '📈', text: 'Warm', color: 'bg-yellow-100 text-yellow-800' };
      case 'at-risk':
        return { emoji: '⚠️', text: 'At Risk', color: 'bg-orange-100 text-orange-800' };
      default:
        return { emoji: '📊', text: 'Normal', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      'Prospecting': 'bg-gray-100 text-gray-800',
      'Qualification': 'bg-blue-100 text-blue-800',
      'Proposal': 'bg-yellow-100 text-yellow-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Closing': 'bg-green-100 text-green-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityIcon = (priority: any) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'medium': return <Target className="w-4 h-4 text-yellow-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         opp.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || opp.stage === filterStage;
    const matchesHealth = filterHealth === 'all' || opp.healthScore === filterHealth;
    return matchesSearch && matchesStage && matchesHealth;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Opportunities List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Opportunities</h1>
              <p className="text-sm text-gray-600 mt-1">Track and manage your sales opportunities</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New opportunity</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterStage} 
                onChange={(e) => setFilterStage(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="all">All stages</option>
                <option value="Prospecting">Prospecting</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closing">Closing</option>
              </select>
              <select 
                value={filterHealth} 
                onChange={(e) => setFilterHealth(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
              >
                <option value="all">All health</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="at-risk">At risk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {filteredOpportunities.map((opportunity: any) => {
              const healthBadge = getHealthBadge(opportunity.healthScore);
              return (
                <div 
                  key={opportunity.id} 
                  className={`bg-white px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                    selectedOpportunity?.id === opportunity.id ? 'bg-blue-50 border-blue-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedOpportunity(opportunity)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Opportunity Header */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900">{opportunity.name}</h3>
                          <div className="flex items-center space-x-2 text-xs text-gray-600 mt-1">
                            <Building className="w-3 h-3" />
                            <span>{opportunity.company}</span>
                            <span>•</span>
                            <User className="w-3 h-3" />
                            <span>{opportunity.contact}</span>
                          </div>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-4 gap-4 mb-3">
                        <div>
                          <div className="text-lg font-semibold text-gray-900">
                            ${(opportunity.value / 1000).toFixed(0)}K
                          </div>
                          <div className="text-xs text-gray-600">Value</div>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-blue-600">
                            {opportunity.probability}%
                          </div>
                          <div className="text-xs text-gray-600">Probability</div>
                        </div>
                        <div>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStageColor(opportunity.stage)}`}>
                            {opportunity.stage}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">Stage</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {new Date(opportunity.closeDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-600">Close date</div>
                        </div>
                      </div>

                      {/* Health Score and Last Activity */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${healthBadge.color}`}>
                            <span className="mr-1">{healthBadge.emoji}</span>
                            {healthBadge.text}
                          </span>
                          <span className="text-xs text-gray-600">Source: {opportunity.source}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-xs text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {opportunity.lastActivity}
                          </span>
                          <div className="flex space-x-1">
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Mail className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <Phone className="w-4 h-4 text-gray-500" />
                            </button>
                            <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {selectedOpportunity ? (
          <>
            {/* Opportunity Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-900">{selectedOpportunity.name}</h2>
                <button 
                  onClick={() => setSelectedOpportunity(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-gray-600">{selectedOpportunity.company} • {selectedOpportunity.contact}</p>
              <div className="mt-3">
                {(() => {
                  const healthBadge = getHealthBadge(selectedOpportunity.healthScore);
                  return (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${healthBadge.color}`}>
                      <span className="mr-1">{healthBadge.emoji}</span>
                      {healthBadge.text}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex px-6">
                {[
                  { id: 'suggestions', name: 'AI insights', icon: Zap },
                  { id: 'competitors', name: 'Competitors', icon: Shield },
                  { id: 'health', name: 'Health', icon: TrendingUp }
                ].map((tab: any) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-3 px-4 text-xs font-medium border-b-2 ${
                        activeTab === tab.id
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

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {activeTab === 'suggestions' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">AI recommendations</h3>
                  <div className="space-y-3">
                    {(aiSuggestions[selectedOpportunity.id] || []).map((suggestion, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(suggestion.priority)}
                            <span className={`text-xs font-semibold uppercase tracking-wide ${
                              suggestion.priority === 'urgent' ? 'text-red-600' :
                              suggestion.priority === 'high' ? 'text-orange-600' :
                              suggestion.priority === 'medium' ? 'text-yellow-600' :
                              'text-gray-600'
                            }`}>
                              {suggestion.priority}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">{suggestion.timeframe}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1 text-sm">{suggestion.title}</h4>
                        <p className="text-xs text-gray-600 mb-3">{suggestion.description}</p>
                        <button className="bg-blue-600 text-white px-3 py-2 rounded text-xs font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1">
                          <span>Take action</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'competitors' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">Competitor analysis</h3>
                  {competitorInsights[selectedOpportunity.id] && (
                    <div className="space-y-3">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-900 mb-2 text-xs">Primary competitor</h4>
                        <p className="text-sm font-semibold text-blue-800">{competitorInsights[selectedOpportunity.id].primary}</p>
                        <p className="text-xs text-blue-700 mt-2">{competitorInsights[selectedOpportunity.id].analysis}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <h4 className="font-medium text-green-900 mb-2 flex items-center text-xs">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Your advantages
                          </h4>
                          <ul className="space-y-1">
                            {competitorInsights[selectedOpportunity.id].advantages.map((advantage, index) => (
                              <li key={index} className="text-xs text-green-700 flex items-center">
                                <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                                {advantage}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h4 className="font-medium text-red-900 mb-2 flex items-center text-xs">
                            <XCircle className="w-4 h-4 mr-2" />
                            Risk areas
                          </h4>
                          <ul className="space-y-1">
                            {competitorInsights[selectedOpportunity.id].risks.map((risk, index) => (
                              <li key={index} className="text-xs text-red-700 flex items-center">
                                <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'health' && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-sm">Health score analysis</h3>
                  <div className="space-y-4">
                    {/* Overall Score */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-700">Overall health</span>
                        <span className="text-lg font-semibold text-blue-600">{selectedOpportunity.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${selectedOpportunity.probability}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Key Events */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 text-xs">Recent activity</h4>
                      <div className="space-y-3">
                        {selectedOpportunity.keyEvents.map((event, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-1 ${
                              event.type === 'positive' ? 'bg-green-500' :
                              event.type === 'negative' ? 'bg-red-500' :
                              'bg-yellow-500'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-900">{event.event}</p>
                              <p className="text-xs text-gray-500">{event.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 text-xs">Next steps</h4>
                      <div className="space-y-2">
                        {selectedOpportunity.nextSteps.map((step, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-xs text-gray-700">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Risk Factors */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3 text-xs">Risk factors</h4>
                      <div className="space-y-2">
                        {selectedOpportunity.riskFactors.map((risk, index) => (
                          <div key={index} className="bg-orange-50 border border-orange-200 rounded p-2">
                            <span className="text-xs text-orange-800">{risk}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-6 py-4">
            <div className="text-center text-gray-500">
              <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium mb-2 text-gray-900">Select an opportunity</h3>
              <p className="text-sm text-gray-600">Choose an opportunity to view AI insights, competitor analysis, and health score details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunitiesWireframe;