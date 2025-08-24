'use client';

import React, { useState } from 'react';
import { Calendar, Clock, Mail, Phone, Video, CheckCircle, XCircle, Edit, Send, Users, MapPin, FileText, AlertCircle, Star, Filter, Search, MoreHorizontal, Play, Pause, ArrowRight, Zap, Brain, Target } from 'lucide-react';

const ActivityCenterWireframe = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [showAIPlan, setShowAIPlan] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const activities = [
    {
      id: 1,
      type: 'email',
      title: 'Follow-up with TechCorp Inc',
      contact: 'Sarah Johnson',
      company: 'TechCorp Inc',
      time: '9:15 AM',
      status: 'sent',
      priority: 'high',
      aiGenerated: true,
      content: 'Sent pricing proposal and technical documentation as requested',
      value: '$120K',
      nextAction: 'Schedule demo call',
      tags: ['proposal', 'pricing', 'demo']
    },
    {
      id: 2,
      type: 'call',
      title: 'Discovery Call - StartupXYZ',
      contact: 'Mike Chen',
      company: 'StartupXYZ',
      time: '10:30 AM',
      status: 'completed',
      priority: 'medium',
      aiGenerated: false,
      content: 'Discussed technical requirements and integration needs',
      value: '$45K',
      nextAction: 'Send technical documentation',
      tags: ['discovery', 'technical', 'integration'],
      duration: '45 min',
      outcome: 'positive'
    },
    {
      id: 3,
      type: 'meeting',
      title: 'Product Demo - Global Solutions',
      contact: 'Emma Davis',
      company: 'Global Solutions',
      time: '2:00 PM',
      status: 'scheduled',
      priority: 'high',
      aiGenerated: false,
      content: 'Product demonstration and Q&A session',
      value: '$200K',
      nextAction: 'Prepare demo environment',
      tags: ['demo', 'presentation', 'enterprise'],
      attendees: 4,
      location: 'Zoom'
    },
    {
      id: 4,
      type: 'email',
      title: 'Contract Review - BigTech Inc',
      contact: 'John Smith',
      company: 'BigTech Inc',
      time: '3:30 PM',
      status: 'draft',
      priority: 'high',
      aiGenerated: true,
      content: 'Contract terms discussion and pricing negotiation',
      value: '$300K',
      nextAction: 'Legal review required',
      tags: ['contract', 'legal', 'negotiation']
    },
    {
      id: 5,
      type: 'call',
      title: 'Check-in Call - Existing Client',
      contact: 'Lisa Wang',
      company: 'InnovateCorp',
      time: '4:15 PM',
      status: 'scheduled',
      priority: 'medium',
      aiGenerated: false,
      content: 'Quarterly business review and expansion opportunities',
      value: '$75K',
      nextAction: 'Prepare QBR materials',
      tags: ['qbr', 'expansion', 'retention'],
      duration: '30 min',
      type_detail: 'customer_success'
    }
  ];

  const aiPlan = {
    summary: "You have 5 activities today with 3 high-priority items. Focus on BigTech Inc contract and TechCorp demo prep.",
    priorities: [
      {
        id: 1,
        task: 'Prepare demo environment for Global Solutions',
        urgency: 'high',
        time: '1:30 PM',
        estimated_duration: '30 min',
        reason: 'Demo at 2 PM, technical setup required'
      },
      {
        id: 2,
        task: 'Review BigTech Inc contract terms',
        urgency: 'high',
        time: '3:00 PM',
        estimated_duration: '45 min',
        reason: 'Legal review needed before 4 PM deadline'
      },
      {
        id: 3,
        task: 'Follow up on TechCorp proposal',
        urgency: 'medium',
        time: '5:00 PM',
        estimated_duration: '15 min',
        reason: 'Check if they received pricing, schedule next steps'
      }
    ],
    insights: [
      'BigTech Inc deal is at risk - no response for 5 days',
      'TechCorp showing high engagement - 3 website visits today',
      'Global Solutions demo is make-or-break for Q1 target'
    ]
  };

  const pendingApprovals = [
    {
      id: 1,
      type: 'email_draft',
      title: 'Contract negotiation email to BigTech Inc',
      content: 'AI-generated email addressing their pricing concerns and proposing alternative terms',
      urgency: 'high',
      value: '$300K',
      ai_confidence: 92
    },
    {
      id: 2,
      type: 'meeting_reschedule',
      title: 'Reschedule demo with StartupXYZ',
      content: 'Move Thursday 3 PM demo to Friday 10 AM due to their team availability',
      urgency: 'medium',
      value: '$45K',
      ai_confidence: 87
    },
    {
      id: 3,
      type: 'follow_up',
      title: 'Send technical documentation to InnovateCorp',
      content: 'AI-curated technical docs based on their specific integration requirements',
      urgency: 'low',
      value: '$75K',
      ai_confidence: 95
    }
  ];

  const getActivityIcon = (type: any) => {
    switch (type) {
      case 'email': return <Mail className="w-5 h-5" />;
      case 'call': return <Phone className="w-5 h-5" />;
      case 'meeting': return <Video className="w-5 h-5" />;
      default: return <Calendar className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'sent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: any) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const getUrgencyColor = (urgency: any) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredActivities = activities.filter(activity => {
    if (selectedFilter === 'all') return true;
    return activity.type === selectedFilter;
  });

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Activity Timeline */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-blue-600" />
                Activity Center
              </h1>
              <p className="text-gray-600">Your timeline of emails, calls, and meetings</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-64"
                />
              </div>
              <select 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Plan Overlay */}
        {showAIPlan && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Your AI Plan for Today</h3>
                </div>
                <p className="text-blue-800 mb-3">{aiPlan.summary}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiPlan.priorities.map((priority) => (
                    <div key={priority.id} className="bg-white rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(priority.urgency)}`}>
                          {priority.urgency.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">{priority.time}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{priority.task}</h4>
                      <p className="text-sm text-gray-600 mb-2">{priority.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{priority.estimated_duration}</span>
                        <button className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700">
                          Start
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => setShowAIPlan(false)}
                className="text-blue-600 hover:text-blue-800 ml-4"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Activity Filters */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            {[
              { id: 'all', name: 'All Activities', icon: Calendar },
              { id: 'email', name: 'Emails', icon: Mail },
              { id: 'call', name: 'Calls', icon: Phone },
              { id: 'meeting', name: 'Meetings', icon: Video }
            ].map((filter: any) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    selectedFilter === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className={`bg-white rounded-lg border-l-4 ${getPriorityColor(activity.priority)} shadow-sm`}>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'email' ? 'bg-purple-100 text-purple-600' :
                        activity.type === 'call' ? 'bg-green-100 text-green-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{activity.title}</h3>
                          {activity.aiGenerated && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Zap className="w-3 h-3 mr-1" />
                              AI
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{activity.contact} • {activity.company}</span>
                          <span>{activity.time}</span>
                          {activity.duration && <span>{activity.duration}</span>}
                          {activity.attendees && <span>{activity.attendees} attendees</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                        {activity.status.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-green-600">{activity.value}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{activity.content}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-wrap gap-2">
                        {activity.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      {activity.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mr-1" />
                          {activity.location}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Next: {activity.nextAction}</span>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center space-x-1">
                        <span>Take Action</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Quick Approvals */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
        <div className="border-b border-gray-200 p-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
            Quick Approvals
          </h3>
          <p className="text-sm text-gray-600">AI-generated actions waiting for your approval</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{approval.title}</h4>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(approval.urgency)}`}>
                      {approval.urgency.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-green-600">{approval.value}</span>
                </div>
                
                <p className="text-sm text-gray-700 mb-3">{approval.content}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">AI Confidence:</span>
                    <span className="text-sm font-medium text-blue-600">{approval.ai_confidence}%</span>
                  </div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${approval.ai_confidence}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 flex items-center justify-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                  <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 flex items-center justify-center space-x-1">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50">
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Insights */}
        <div className="border-t border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
            <Target className="w-4 h-4 mr-2 text-blue-600" />
            AI Insights
          </h4>
          <div className="space-y-2">
            {aiPlan.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCenterWireframe;