'use client';

import React, { useState } from 'react';
import { Bot, Send, TrendingUp, Users, DollarSign, Calendar, Mail, Phone, Target, AlertTriangle, CheckCircle, ArrowUp, ArrowDown, MessageSquare, Zap } from 'lucide-react';

const DashboardWireframe = () => {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', content: 'Good morning! You have 3 high-priority leads to follow up with today. Would you like me to draft emails for them?' },
    { id: 2, type: 'user', content: 'Yes, show me the leads' },
    { id: 3, type: 'ai', content: 'Here are your top 3 leads: TechCorp ($50k), StartupXYZ ($25k), and Enterprise Solutions ($75k). I\'ll draft personalized emails based on their recent interactions.' }
  ]);

  const kpiData = [
    { label: 'Revenue This Month', value: '$245K', change: '+12%', trend: 'up', color: 'green' },
    { label: 'Active Deals', value: '23', change: '+3', trend: 'up', color: 'blue' },
    { label: 'Conversion Rate', value: '18%', change: '-2%', trend: 'down', color: 'red' },
    { label: 'Avg Deal Size', value: '$12.5K', change: '+5%', trend: 'up', color: 'green' }
  ];

  const quickActions = [
    { icon: Mail, label: 'Send Follow-up', count: 5, color: 'blue' },
    { icon: Phone, label: 'Schedule Calls', count: 3, color: 'green' },
    { icon: Calendar, label: 'Book Meetings', count: 2, color: 'purple' },
    { icon: Target, label: 'Update Pipeline', count: 7, color: 'orange' }
  ];

  const pipelineStages = [
    { name: 'Prospecting', value: 45, deals: 12 },
    { name: 'Qualification', value: 30, deals: 8 },
    { name: 'Proposal', value: 20, deals: 5 },
    { name: 'Closing', value: 15, deals: 3 }
  ];

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Panel - Chat/Command Interface */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-green-600">● Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI to help with leads, emails, calls..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top AI Summary Box */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 m-4 rounded-lg shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-medium text-blue-100">AI Insight</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">
                You're $80K from your quarterly target
              </h1>
              <p className="text-blue-100 mb-4">
                Based on your current pipeline, here's how to close the gap: Focus on the 3 deals in closing stage ($45K total), 
                accelerate 2 qualified prospects ($35K potential), and I've identified 5 warm leads worth pursuing.
              </p>
              <div className="flex space-x-4">
                <button className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-50">
                  View Action Plan
                </button>
                <button className="border border-white text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-blue-600">
                  Update Target
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">68%</div>
              <div className="text-sm text-blue-200">Target Progress</div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 p-4 grid grid-cols-12 gap-4">
          {/* KPI Cards */}
          <div className="col-span-8 grid grid-cols-4 gap-4">
            {kpiData.map((kpi, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{kpi.label}</span>
                  <div className={`flex items-center space-x-1 text-xs ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-4 space-y-3">
                {quickActions.map((action: any, index: any) => {
                  const Icon = action.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          action.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                          action.color === 'green' ? 'bg-green-100 text-green-600' :
                          action.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{action.label}</span>
                      </div>
                      <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {action.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pipeline Chart */}
          <div className="col-span-8">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Pipeline Overview</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {pipelineStages.map((stage, index) => (
                    <div key={index} className="">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                        <span className="text-sm text-gray-500">{stage.deals} deals</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${stage.value}%` }}
                        />
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs text-gray-500">${stage.value}K</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="col-span-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Deal closed with TechCorp</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Meeting scheduled with StartupXYZ</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">Follow-up email sent to Enterprise Solutions</p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">New lead: Global Industries</p>
                    <p className="text-xs text-gray-500">8 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWireframe;