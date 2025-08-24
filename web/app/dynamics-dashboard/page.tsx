'use client';

import React, { useState } from 'react';
import { 
  Home, Users, Target, BarChart3, Calendar, Settings, Search, Bell, 
  MessageSquare, TrendingUp, DollarSign, Clock, ChevronRight, 
  Plus, Filter, MoreHorizontal, Star, Phone, Mail, Video,
  FileText, CheckCircle, AlertCircle, User, Building2,
  Briefcase, PieChart, Activity, Zap, Brain, Bot
} from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

const DynamicsDashboardContent = () => {
  const [selectedSection, setSelectedSection] = useState('copilot');
  const [searchQuery, setSearchQuery] = useState('');

  const navigationSections = [
    {
      title: 'My work',
      items: [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'recent', label: 'Recent', icon: Clock },
        { id: 'pinned', label: 'Pinned', icon: Star }
      ]
    },
    {
      title: 'Sales',
      items: [
        { id: 'copilot', label: 'Copilot', icon: Bot },
        { id: 'sales-accelerator', label: 'Sales accelerator', icon: Zap },
        { id: 'dashboards', label: 'Dashboards', icon: BarChart3 },
        { id: 'activities', label: 'Activities', icon: Activity },
        { id: 'deal-manager', label: 'Deal manager', icon: Briefcase }
      ]
    },
    {
      title: 'Customers',
      items: [
        { id: 'accounts', label: 'Accounts', icon: Building2 },
        { id: 'contacts', label: 'Contacts', icon: Users },
        { id: 'contact-suggestions', label: 'Contact suggestions', icon: User }
      ]
    },
    {
      title: 'Sales',
      items: [
        { id: 'leads', label: 'Leads', icon: Target },
        { id: 'opportunities', label: 'Opportunities', icon: TrendingUp },
        { id: 'competitors', label: 'Competitors', icon: BarChart3 }
      ]
    },
    {
      title: 'Collateral',
      items: [
        { id: 'quotes', label: 'Quotes', icon: FileText },
        { id: 'orders', label: 'Orders', icon: CheckCircle },
        { id: 'sales', label: 'Sales', icon: DollarSign }
      ]
    }
  ];

  const copilotSuggestions = [
    {
      icon: FileText,
      title: 'Get info',
      subtitle: 'Get latest news for accounts',
      description: 'Stay updated with the latest information about your key accounts'
    },
    {
      icon: MessageSquare,
      title: 'Ask questions',
      subtitle: "What's newly assigned to me",
      description: 'Get insights about your recent assignments and priorities'
    },
    {
      icon: TrendingUp,
      title: 'Stay ahead',
      subtitle: 'Prepare for sales appointments',
      description: 'Get AI-powered preparation for your upcoming meetings'
    },
    {
      icon: BarChart3,
      title: 'Show my pipeline',
      subtitle: 'View your sales pipeline',
      description: 'Analyze your deals and opportunities'
    },
    {
      icon: Users,
      title: "What's new with my accounts",
      subtitle: 'Account activity updates',
      description: 'See recent activities and changes in your accounts'
    },
    {
      icon: Mail,
      title: 'Show emails that need follow up',
      subtitle: 'Email follow-up reminders',
      description: 'Never miss important email responses'
    }
  ];

  const recentAssignments = [
    {
      id: 1,
      name: 'Regina Murphy',
      type: 'Lead',
      timeAgo: 'Created 4 days ago',
      source: 'Source: a marketing campaign',
      avatar: 'RM'
    },
    {
      id: 2,
      name: '15 Coffee machines for Alpine Ski House',
      type: 'Opportunity',
      timeAgo: 'Contact • Est revenue $17,000',
      source: '',
      avatar: '15'
    },
    {
      id: 3,
      name: '20 Coffee machines for Fabrikam',
      type: 'Opportunity',
      timeAgo: 'Contact • Est revenue $28,000',
      source: '',
      avatar: '20'
    },
    {
      id: 4,
      name: '10 Coffee machines for Fourth Coffee',
      type: 'Opportunity',
      timeAgo: 'Contact • Est revenue $12,000',
      source: '',
      avatar: '10'
    },
    {
      id: 5,
      name: 'Laurence Gilbertson',
      type: 'Lead',
      timeAgo: 'Created 4 days ago',
      source: 'Source: a marketing campaign',
      avatar: 'LG'
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Navigation Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* App Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sales Hub</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = selectedSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelectedSection(item.id)}
                      className={`w-full flex items-center px-4 py-2 text-sm font-medium text-left ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`mr-3 h-4 w-4 ${
                        isActive ? 'text-blue-700' : 'text-gray-400'
                      }`} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bot className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">Copilot</h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Preview
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">DJ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Welcome Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Hi Daisy,</h2>
              <p className="text-gray-600">Welcome to Copilot. Select one of the suggestions below to get started.</p>
            </div>

            {/* Copilot Suggestions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {copilotSuggestions.map((suggestion, index) => {
                const Icon = suggestion.icon;
                return (
                  <button
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.subtitle}</p>
                        <p className="text-xs text-gray-500">{suggestion.description}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Additional Actions */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">
                Use the "% menu for more suggestions.
              </p>
            </div>

            {/* Recently Assigned Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">What's newly assigned to me</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Show more
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Here are your newly assigned leads and opportunities in the last 15 days.
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {recentAssignments.map((item) => (
                  <div key={item.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 text-sm font-medium">{item.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span className="bg-gray-100 px-2 py-1 rounded text-xs">{item.type}</span>
                          <span>{item.timeAgo}</span>
                        </div>
                        {item.source && (
                          <p className="text-sm text-gray-500 mt-1">{item.source}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {item.type === 'Opportunity' && (
                          <button className="text-blue-600 hover:text-blue-700 text-sm">
                            Summarize
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                    <CheckCircle className="w-4 h-4" />
                    <span>All assigned opportunities</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800">
                    <CheckCircle className="w-4 h-4" />
                    <span>All assigned leads</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Chat Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask a sales question or type / to mention a record"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="p-1 text-blue-600 hover:text-blue-700">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Make sure AI-generated content is accurate and appropriate before using. 
              <button className="text-blue-600 hover:text-blue-700">See terms</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DynamicsDashboard() {
  return (
    <ProtectedRoute>
      <DynamicsDashboardContent />
    </ProtectedRoute>
  );
}