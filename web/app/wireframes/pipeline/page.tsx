'use client';

import React, { useState } from 'react';
import { DollarSign, Calendar, User, Building, Phone, Mail, AlertTriangle, TrendingUp, Clock, Filter, Plus, MoreHorizontal, Search, ChevronDown } from 'lucide-react';

interface Deal {
  id: number;
  company: string;
  contact: string;
  value: number;
  probability: number;
  closeDate: string;
  aiHealth: string;
  lastActivity: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  count: number;
}

const PipelineWireframe = () => {
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [filterStage, setFilterStage] = useState('all');

  const stages: Stage[] = [
    { id: 'prospecting', name: 'Prospecting', color: 'gray', count: 12 },
    { id: 'qualification', name: 'Qualification', color: 'blue', count: 8 },
    { id: 'proposal', name: 'Proposal', color: 'yellow', count: 5 },
    { id: 'negotiation', name: 'Negotiation', color: 'orange', count: 3 },
    { id: 'closing', name: 'Closing', color: 'green', count: 2 }
  ];

  const deals: Record<string, Deal[]> = {
    prospecting: [
      { id: 1, company: 'TechCorp Inc', contact: 'Sarah Johnson', value: 50000, probability: 20, closeDate: '2024-03-15', aiHealth: 'hot', lastActivity: '2 hours ago' },
      { id: 2, company: 'StartupXYZ', contact: 'Mike Chen', value: 25000, probability: 15, closeDate: '2024-03-20', aiHealth: 'warm', lastActivity: '1 day ago' },
      { id: 3, company: 'Global Solutions', contact: 'Emma Davis', value: 75000, probability: 25, closeDate: '2024-03-25', aiHealth: 'at-risk', lastActivity: '3 days ago' }
    ],
    qualification: [
      { id: 4, company: 'Enterprise Corp', contact: 'John Smith', value: 120000, probability: 40, closeDate: '2024-02-28', aiHealth: 'hot', lastActivity: '30 min ago' },
      { id: 5, company: 'Innovation Labs', contact: 'Lisa Wang', value: 80000, probability: 35, closeDate: '2024-03-10', aiHealth: 'warm', lastActivity: '4 hours ago' }
    ],
    proposal: [
      { id: 6, company: 'MegaCorp', contact: 'David Brown', value: 200000, probability: 60, closeDate: '2024-02-25', aiHealth: 'hot', lastActivity: '1 hour ago' },
      { id: 7, company: 'TechStart', contact: 'Anna Lee', value: 45000, probability: 55, closeDate: '2024-03-05', aiHealth: 'warm', lastActivity: '6 hours ago' }
    ],
    negotiation: [
      { id: 8, company: 'BigTech Inc', contact: 'Robert Wilson', value: 300000, probability: 80, closeDate: '2024-02-20', aiHealth: 'at-risk', lastActivity: '2 days ago' }
    ],
    closing: [
      { id: 9, company: 'FutureCorp', contact: 'Maria Garcia', value: 150000, probability: 90, closeDate: '2024-02-15', aiHealth: 'hot', lastActivity: '15 min ago' }
    ]
  };

  const getHealthBadge = (health: any) => {
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

  const getStageColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'bg-gray-100 border-gray-300',
      blue: 'bg-blue-100 border-blue-300',
      yellow: 'bg-yellow-100 border-yellow-300',
      orange: 'bg-orange-100 border-orange-300',
      green: 'bg-green-100 border-green-300'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="h-screen bg-white flex" style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      {/* Main Pipeline View */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">Pipeline</h1>
              <p className="text-sm text-gray-600">Manage your sales opportunities</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search opportunities"
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={filterStage} 
                  onChange={(e) => setFilterStage(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All stages</option>
                  {stages.map(stage => (
                    <option key={stage.id} value={stage.id}>{stage.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
          <div className="grid grid-cols-5 gap-4">
            {stages.map((stage: Stage) => {
              const stageDeals = deals[stage.id] || [];
              const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
              return (
                <div key={stage.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-semibold text-gray-900 mb-1">
                      ${(totalValue / 1000).toFixed(0)}K
                    </div>
                    <div className="text-sm font-medium text-gray-700 mb-1">{stage.name}</div>
                    <div className="text-xs text-gray-500">{stage.count} opportunities</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto px-6 py-4">
          <div className="flex space-x-6 h-full min-w-max">
            {stages.map((stage: any) => {
              const stageDeals = deals[stage.id] || [];
              return (
                <div key={stage.id} className="w-80 bg-gray-50 rounded-lg border border-gray-200 p-4">
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{stage.name}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                        {stageDeals.length}
                      </span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </div>

                  {/* Deal Cards */}
                  <div className="space-y-3 max-h-full overflow-y-auto">
                    {stageDeals.map((deal: any) => {
                      const healthBadge = getHealthBadge(deal.aiHealth);
                      return (
                        <div 
                          key={deal.id} 
                          className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all ${
                            selectedDeal?.id === deal.id ? 'border-blue-500 shadow-sm' : ''
                          }`}
                          onClick={() => setSelectedDeal(deal)}
                        >
                          {/* Header with Health Badge and Probability */}
                          <div className="flex items-center justify-between mb-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${healthBadge.color}`}>
                              <span className="mr-1">{healthBadge.emoji}</span>
                              {healthBadge.text}
                            </span>
                            <span className="text-xs font-medium text-gray-600">{deal.probability}%</span>
                          </div>

                          {/* Company Name */}
                          <div className="mb-3">
                            <h4 className="font-semibold text-gray-900 text-sm mb-1">{deal.company}</h4>
                            <p className="text-xs text-gray-600 flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {deal.contact}
                            </p>
                          </div>

                          {/* Deal Value */}
                          <div className="mb-3">
                            <div className="text-lg font-semibold text-gray-900">
                              ${(deal.value / 1000).toFixed(0)}K
                            </div>
                          </div>

                          {/* Close Date */}
                          <div className="mb-3">
                            <div className="flex items-center text-xs text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(deal.closeDate).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Last Activity */}
                          <div className="flex items-center justify-between">
                            <span className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {deal.lastActivity}
                            </span>
                            <div className="flex space-x-1">
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <Mail className="w-3 h-3 text-gray-400" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                                <Phone className="w-3 h-3 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Add Deal Button */}
                    <button className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                      <Plus className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-xs font-medium">Add opportunity</div>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Panel - Context & AI Insights */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {selectedDeal ? (
          <>
            {/* Deal Details Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold text-gray-900">{selectedDeal.company}</h2>
                <button 
                  onClick={() => setSelectedDeal(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">{selectedDeal.contact}</p>
              <div>
                {(() => {
                  const healthBadge = getHealthBadge(selectedDeal.aiHealth);
                  return (
                    <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${healthBadge.color}`}>
                      <span className="mr-1">{healthBadge.emoji}</span>
                      {healthBadge.text}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Deal Metrics */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-gray-900">
                    ${(selectedDeal.value / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-600">Deal value</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-blue-600">
                    {selectedDeal.probability}%
                  </div>
                  <div className="text-xs text-gray-600">Win probability</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-600 mb-1">Expected close date</div>
                <div className="font-medium text-sm">{new Date(selectedDeal.closeDate).toLocaleDateString()}</div>
              </div>
            </div>

            {/* AI Insights */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                AI insights
              </h3>
              <div className="space-y-3">
                {selectedDeal.aiHealth === 'hot' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-red-800 mb-1">🔥 High intent detected</div>
                    <div className="text-xs text-red-700">Contact visited pricing page 3x this week. Strong buying signals.</div>
                  </div>
                )}
                {selectedDeal.aiHealth === 'at-risk' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="text-xs font-semibold text-orange-800 mb-1">⚠️ Needs attention</div>
                    <div className="text-xs text-orange-700">No activity for 3+ days. Competitor may be involved.</div>
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-xs font-semibold text-blue-800 mb-1">💡 Recommended action</div>
                  <div className="text-xs text-blue-700">
                    {selectedDeal.aiHealth === 'hot' ? 'Schedule demo call within 24 hours' :
                     selectedDeal.aiHealth === 'at-risk' ? 'Send personalized follow-up email' :
                     'Continue nurturing with valuable content'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">Quick actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Send follow-up</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule meeting</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Log call</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center px-6 py-4">
            <div className="text-center text-gray-500">
              <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium mb-2 text-gray-900">Select an opportunity</h3>
              <p className="text-sm text-gray-600">Choose an opportunity to view details and AI insights</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineWireframe;