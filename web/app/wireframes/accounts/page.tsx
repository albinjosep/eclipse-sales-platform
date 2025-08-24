'use client';

import React, { useState } from 'react';
import { Building, User, Mail, Phone, Calendar, MessageSquare, Search, Filter, Plus, MoreHorizontal, Users, TrendingUp, Clock, MapPin, Globe, Linkedin, Twitter } from 'lucide-react';

interface Account {
  id: number;
  company: string;
  industry: string;
  size: string;
  location: string;
  website: string;
  revenue: string;
  status: string;
  lastContact: string;
  contacts: Array<{
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
  }>;
  deals: Array<{
    name: string;
    value: number;
    stage: string;
  }>;
  aiScore: number;
}

const AccountsContactsWireframe = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [activeTab, setActiveTab] = useState('relationship');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const accounts = [
    {
      id: 1,
      company: 'TechCorp Inc',
      industry: 'Technology',
      size: '500-1000',
      location: 'San Francisco, CA',
      website: 'techcorp.com',
      revenue: '$50M',
      status: 'active',
      lastContact: '2 days ago',
      contacts: [
        { name: 'Sarah Johnson', title: 'CEO', email: 'sarah@techcorp.com', phone: '+1-555-0123', linkedin: 'sarah-johnson' },
        { name: 'Mike Chen', title: 'CTO', email: 'mike@techcorp.com', phone: '+1-555-0124', linkedin: 'mike-chen' },
        { name: 'Lisa Wang', title: 'VP Sales', email: 'lisa@techcorp.com', phone: '+1-555-0125', linkedin: 'lisa-wang' }
      ],
      deals: [{ name: 'Enterprise License', value: 120000, stage: 'Proposal' }],
      aiScore: 85
    },
    {
      id: 2,
      company: 'StartupXYZ',
      industry: 'Fintech',
      size: '50-100',
      location: 'New York, NY',
      website: 'startupxyz.com',
      revenue: '$5M',
      status: 'prospect',
      lastContact: '1 week ago',
      contacts: [
        { name: 'David Brown', title: 'Founder', email: 'david@startupxyz.com', phone: '+1-555-0126', linkedin: 'david-brown' },
        { name: 'Emma Davis', title: 'Head of Product', email: 'emma@startupxyz.com', phone: '+1-555-0127', linkedin: 'emma-davis' }
      ],
      deals: [{ name: 'Starter Package', value: 25000, stage: 'Qualification' }],
      aiScore: 72
    },
    {
      id: 3,
      company: 'Global Solutions',
      industry: 'Consulting',
      size: '1000+',
      location: 'London, UK',
      website: 'globalsolutions.com',
      revenue: '$200M',
      status: 'active',
      lastContact: '3 hours ago',
      contacts: [
        { name: 'Robert Wilson', title: 'Managing Director', email: 'robert@globalsolutions.com', phone: '+44-20-1234-5678', linkedin: 'robert-wilson' },
        { name: 'Anna Lee', title: 'Operations Manager', email: 'anna@globalsolutions.com', phone: '+44-20-1234-5679', linkedin: 'anna-lee' },
        { name: 'James Taylor', title: 'IT Director', email: 'james@globalsolutions.com', phone: '+44-20-1234-5680', linkedin: 'james-taylor' }
      ],
      deals: [{ name: 'Global Rollout', value: 300000, stage: 'Negotiation' }],
      aiScore: 91
    }
  ];

  const conversationHistory = [
    { date: '2024-01-15', type: 'email', contact: 'Sarah Johnson', subject: 'Re: Enterprise License Discussion', preview: 'Thanks for the detailed proposal. We\'d like to schedule a demo...' },
    { date: '2024-01-12', type: 'call', contact: 'Mike Chen', subject: 'Technical Requirements Call', preview: '45-minute call discussing integration requirements and security...' },
    { date: '2024-01-10', type: 'meeting', contact: 'Lisa Wang', subject: 'Quarterly Business Review', preview: 'Discussed expansion plans and budget allocation for next quarter...' },
    { date: '2024-01-08', type: 'email', contact: 'Sarah Johnson', subject: 'Pricing Inquiry', preview: 'Could you provide pricing for 500+ user licenses?' }
  ];

  const aiNotes = [
    { date: '2024-01-15', type: 'insight', content: 'High buying intent detected - CEO mentioned budget approval in latest email' },
    { date: '2024-01-12', type: 'risk', content: 'Technical concerns about integration complexity may delay decision' },
    { date: '2024-01-10', type: 'opportunity', content: 'Expansion opportunity - mentioned 3 additional departments interested' },
    { date: '2024-01-08', type: 'behavior', content: 'Multiple stakeholders visiting pricing page - decision committee forming' }
  ];

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAIScoreColor = (score: any) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.contacts.some(contact => contact.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterType === 'all' || account.status === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Accounts List */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Accounts</h1>
              <p className="text-sm text-gray-600">Manage your customer relationships and contacts</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New</span>
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
                placeholder="Search accounts and contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              >
                <option value="all">All accounts</option>
                <option value="active">Active</option>
                <option value="prospect">Prospects</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-200">
            {filteredAccounts.map((account) => (
              <div 
                key={account.id} 
                className={`bg-white px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 ${
                  selectedAccount?.id === account.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
                onClick={() => setSelectedAccount(account)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Company Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{account.company}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                          <span>{account.industry}</span>
                          <span>•</span>
                          <span>{account.size} employees</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(account.status)}`}>
                            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="w-3 h-3 mr-2" />
                        {account.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Globe className="w-3 h-3 mr-2" />
                        {account.website}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <TrendingUp className="w-3 h-3 mr-2" />
                        {account.revenue} revenue
                      </div>
                    </div>

                    {/* Key Contacts */}
                    <div className="mb-3">
                      <h4 className="text-xs font-medium text-gray-900 mb-2">Key contacts</h4>
                      <div className="flex flex-wrap gap-2">
                        {account.contacts.slice(0, 3).map((contact, index) => (
                          <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1">
                            <User className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-700">{contact.name}</span>
                            <span className="text-xs text-gray-500">({contact.title})</span>
                          </div>
                        ))}
                        {account.contacts.length > 3 && (
                          <span className="text-xs text-gray-500">+{account.contacts.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Active Deals */}
                    {account.deals.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-900 mb-2">Active opportunities</h4>
                        <div className="flex flex-wrap gap-2">
                          {account.deals.map((deal, index) => (
                            <div key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">
                              {deal.name} - ${(deal.value / 1000).toFixed(0)}K ({deal.stage})
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side Info */}
                  <div className="text-right">
                    <div className="mb-2">
                      <div className={`text-lg font-semibold ${getAIScoreColor(account.aiScore)}`}>
                        {account.aiScore}
                      </div>
                      <div className="text-xs text-gray-500">AI score</div>
                    </div>
                    <div className="text-xs text-gray-600 flex items-center justify-end">
                      <Clock className="w-3 h-3 mr-1" />
                      {account.lastContact}
                    </div>
                    <div className="mt-3 flex space-x-1 justify-end">
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Mail className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Phone className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        {selectedAccount ? (
          <>
            {/* Account Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">{selectedAccount.company}</h2>
                  <p className="text-sm text-gray-600">{selectedAccount.industry}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedAccount.status)}`}>
                      {selectedAccount.status.charAt(0).toUpperCase() + selectedAccount.status.slice(1)}
                    </span>
                    <span className={`text-sm font-semibold ${getAIScoreColor(selectedAccount.aiScore)}`}>
                      AI: {selectedAccount.aiScore}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedAccount(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 px-6">
              <nav className="flex space-x-6">
                {[
                  { id: 'relationship', name: 'Contacts', icon: Users },
                  { id: 'history', name: 'History', icon: MessageSquare },
                  { id: 'notes', name: 'AI Notes', icon: TrendingUp }
                ].map((tab: any) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'relationship' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded">
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Company details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-gray-900">{selectedAccount.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Website:</span>
                        <span className="text-gray-900">{selectedAccount.website}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="text-gray-900">{selectedAccount.revenue}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Employees:</span>
                        <span className="text-gray-900">{selectedAccount.size}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 text-sm">Key contacts</h3>
                    <div className="space-y-3">
                      {selectedAccount.contacts.map((contact, index) => (
                        <div key={index} className="border border-gray-200 rounded p-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{contact.name}</h4>
                              <p className="text-xs text-gray-600">{contact.title}</p>
                              <p className="text-xs text-gray-500">{contact.email}</p>
                            </div>
                            <div className="flex space-x-1">
                              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <Mail className="w-4 h-4 text-gray-500" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                                <Phone className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 text-sm">Recent activity</h3>
                  <div className="space-y-4">
                    {conversationHistory.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-200 pl-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {item.type === 'email' && <Mail className="w-4 h-4 text-blue-500" />}
                            {item.type === 'call' && <Phone className="w-4 h-4 text-green-500" />}
                            {item.type === 'meeting' && <Calendar className="w-4 h-4 text-purple-500" />}
                            <span className="text-xs font-medium text-gray-900">{item.contact}</span>
                          </div>
                          <span className="text-xs text-gray-500">{item.date}</span>
                        </div>
                        <h4 className="text-xs font-medium text-gray-900 mb-1">{item.subject}</h4>
                        <p className="text-xs text-gray-600">{item.preview}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4 text-sm">AI insights</h3>
                  <div className="space-y-3">
                    {aiNotes.map((note: any, index: any) => {
                      const getTypeColor = (type: any) => {
                        switch (type) {
                          case 'insight': return 'bg-blue-50 border-blue-200 text-blue-800';
                          case 'risk': return 'bg-red-50 border-red-200 text-red-800';
                          case 'opportunity': return 'bg-green-50 border-green-200 text-green-800';
                          case 'behavior': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
                          default: return 'bg-gray-50 border-gray-200 text-gray-800';
                        }
                      };
                      
                      return (
                        <div key={index} className={`border rounded p-3 ${getTypeColor(note.type)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium uppercase tracking-wide">
                              {note.type}
                            </span>
                            <span className="text-xs opacity-75">{note.date}</span>
                          </div>
                          <p className="text-xs">{note.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="font-medium mb-1">Select an account</h3>
              <p className="text-sm">Click on any account to view details, contacts, and AI insights</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsContactsWireframe;