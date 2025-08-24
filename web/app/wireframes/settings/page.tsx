'use client';

import React, { useState } from 'react';
import { Settings, Plug, Brain, User, Bell, Shield, Palette, Globe, Zap, CheckCircle, XCircle, AlertTriangle, Sliders, Save, RefreshCw, Eye, EyeOff, Key, Mail, Calendar, Database, Smartphone, Laptop, Monitor, Volume2, VolumeX } from 'lucide-react';

type IntegrationStatus = 'connected' | 'disconnected';

const SettingsWireframe = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [aiPersonality, setAiPersonality] = useState(3); // 1-5 scale (formal to casual)
  const [aiConfidence, setAiConfidence] = useState(4); // 1-5 scale (conservative to aggressive)
  const [aiProactivity, setAiProactivity] = useState(3); // 1-5 scale (reactive to proactive)
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    email: true,
    push: true,
    sms: false,
    desktop: true
  });
  const [integrationStatus, setIntegrationStatus] = useState<Record<string, IntegrationStatus>>({
    email: 'connected',
    crm: 'connected',
    calendar: 'connected',
    slack: 'disconnected',
    zoom: 'connected',
    linkedin: 'disconnected'
  });

  const integrations = [
    {
      id: 'email',
      name: 'Email (Gmail)',
      description: 'Sync emails and enable AI email drafting',
      icon: Mail,
      status: integrationStatus.email,
      features: ['Email sync', 'AI drafting', 'Auto-categorization'],
      lastSync: '2 minutes ago'
    },
    {
      id: 'crm',
      name: 'CRM (Salesforce)',
      description: 'Sync contacts, deals, and activities',
      icon: Database,
      status: integrationStatus.crm,
      features: ['Contact sync', 'Deal tracking', 'Activity logging'],
      lastSync: '5 minutes ago'
    },
    {
      id: 'calendar',
      name: 'Calendar (Google)',
      description: 'Schedule meetings and track availability',
      icon: Calendar,
      status: integrationStatus.calendar,
      features: ['Meeting scheduling', 'Availability tracking', 'AI suggestions'],
      lastSync: '1 minute ago'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Get notifications and quick updates',
      icon: Smartphone,
      status: integrationStatus.slack,
      features: ['Notifications', 'Quick commands', 'Team updates'],
      lastSync: 'Not connected'
    },
    {
      id: 'zoom',
      name: 'Zoom',
      description: 'Auto-schedule video calls and record meetings',
      icon: Monitor,
      status: integrationStatus.zoom,
      features: ['Auto-scheduling', 'Meeting recording', 'AI transcription'],
      lastSync: '10 minutes ago'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Sales Navigator',
      description: 'Import prospects and track engagement',
      icon: Globe,
      status: integrationStatus.linkedin,
      features: ['Prospect import', 'Engagement tracking', 'Social insights'],
      lastSync: 'Not connected'
    }
  ];

  const aiSettings = [
    {
      id: 'personality',
      title: 'AI Personality',
      description: 'How formal or casual should the AI be in communications?',
      type: 'slider',
      value: aiPersonality,
      setter: setAiPersonality,
      min: 1,
      max: 5,
      labels: ['Very Formal', 'Formal', 'Balanced', 'Casual', 'Very Casual']
    },
    {
      id: 'confidence',
      title: 'AI Confidence Level',
      description: 'How assertive should AI recommendations be?',
      type: 'slider',
      value: aiConfidence,
      setter: setAiConfidence,
      min: 1,
      max: 5,
      labels: ['Conservative', 'Cautious', 'Balanced', 'Confident', 'Aggressive']
    },
    {
      id: 'proactivity',
      title: 'AI Proactivity',
      description: 'How often should AI suggest actions without being asked?',
      type: 'slider',
      value: aiProactivity,
      setter: setAiProactivity,
      min: 1,
      max: 5,
      labels: ['Reactive Only', 'Minimal', 'Balanced', 'Proactive', 'Very Proactive']
    }
  ];

  const getStatusColor = (status: any) => {
    switch (status) {
      case 'connected': return 'bg-green-100 text-green-800';
      case 'disconnected': return 'bg-red-100 text-red-800';
      case 'error': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default: return <XCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPersonalityLabel = (value: any) => {
    const labels = ['Very Formal', 'Formal', 'Balanced', 'Casual', 'Very Casual'];
    return labels[value - 1] || 'Balanced';
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrationStatus(prev => ({
      ...prev,
      [integrationId]: prev[integrationId] === 'connected' ? 'disconnected' : 'connected'
    }));
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Main Settings Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-600" />
                Settings
              </h1>
              <p className="text-sm text-gray-600 mt-1">Configure integrations, AI behavior, and preferences</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-1.5">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-1.5">
                <RefreshCw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings Tabs */}
        <div className="bg-white border-b border-gray-200">
          <nav className="flex px-6">
            {[
              { id: 'integrations', name: 'Integrations', icon: Plug },
              { id: 'ai_tuning', name: 'AI Tuning', icon: Brain },
              { id: 'preferences', name: 'Preferences', icon: User },
              { id: 'security', name: 'Security', icon: Shield }
            ].map((tab: any) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'integrations' && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Integrations</h2>
                <p className="text-sm text-gray-600">Connect your tools and services to enable AI-powered automation</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {integrations.map((integration: any) => {
                  const Icon = integration.icon;
                  return (
                    <div key={integration.id} className="bg-white rounded border border-gray-200 p-4 hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-1.5 bg-blue-50 rounded">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{integration.name}</h3>
                            <p className="text-xs text-gray-600 mt-0.5">{integration.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          {getStatusIcon(integration.status)}
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getStatusColor(integration.status)}`}>
                            {integration.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-gray-900 mb-1.5">Features</h4>
                        <ul className="space-y-0.5">
                          {integration.features.map((feature: string, index: number) => (
                            <li key={index} className="text-xs text-gray-700 flex items-center">
                              <span className="w-1 h-1 bg-blue-500 rounded-full mr-1.5"></span>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Last sync: {integration.lastSync}</span>
                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            integration.status === 'connected'
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'ai_tuning' && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">AI Tuning</h2>
                <p className="text-sm text-gray-600">Customize how your AI assistant behaves and communicates</p>
              </div>
              
              <div className="space-y-5">
                {aiSettings.map((setting) => (
                  <div key={setting.id} className="bg-white rounded border border-gray-200 p-4">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">{setting.title}</h3>
                      <p className="text-xs text-gray-600">{setting.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">
                          {setting.labels[0]}
                        </span>
                        <span className="text-xs font-medium text-gray-700">
                          {setting.labels[setting.labels.length - 1]}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min={setting.min}
                          max={setting.max}
                          value={setting.value}
                          onChange={(e) => setting.setter(parseInt(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1.5">
                          {setting.labels.map((label, index) => (
                            <span key={index} className={`${
                              index + 1 === setting.value ? 'font-medium text-blue-600' : ''
                            }`}>
                              {index + 1}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded p-3">
                        <div className="flex items-center space-x-1.5">
                          <Brain className="w-4 h-4 text-blue-600" />
                          <span className="text-xs font-medium text-blue-900">
                            Current Setting: {setting.labels[setting.value - 1]}
                          </span>
                        </div>
                        <p className="text-xs text-blue-800 mt-1.5">
                          {setting.id === 'personality' && (
                            setting.value <= 2 ? 'AI will use formal language and professional tone in all communications.' :
                            setting.value >= 4 ? 'AI will use casual language and friendly tone in communications.' :
                            'AI will balance professional and friendly communication styles.'
                          )}
                          {setting.id === 'confidence' && (
                            setting.value <= 2 ? 'AI will provide conservative recommendations and ask for confirmation frequently.' :
                            setting.value >= 4 ? 'AI will provide assertive recommendations and take more autonomous actions.' :
                            'AI will provide balanced recommendations with moderate autonomy.'
                          )}
                          {setting.id === 'proactivity' && (
                            setting.value <= 2 ? 'AI will only respond when directly asked and avoid unsolicited suggestions.' :
                            setting.value >= 4 ? 'AI will actively suggest actions and opportunities throughout your workflow.' :
                            'AI will provide helpful suggestions at appropriate moments.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* AI Preview */}
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Preview</h3>
                  <div className="bg-gray-50 rounded p-3">
                    <div className="flex items-start space-x-2.5">
                      <div className="p-1.5 bg-blue-50 rounded">
                        <Brain className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800">
                          {aiPersonality <= 2 && aiConfidence <= 2 && 
                            "Good morning. I have identified a high-priority opportunity that requires your attention. Would you like me to prepare a formal proposal for TechCorp Inc?"
                          }
                          {aiPersonality >= 4 && aiConfidence >= 4 && 
                            "Hey! 🚀 Just spotted a hot lead - TechCorp Inc is showing serious buying signals. I'm drafting a proposal now and can send it in 5 minutes. Sound good?"
                          }
                          {aiPersonality === 3 && aiConfidence === 3 && 
                            "Hi there! I noticed TechCorp Inc has been very active on your site. Based on their behavior, I think they're ready for a proposal. Should I prepare one for your review?"
                          }
                        </p>
                        <span className="text-xs text-gray-500 mt-1 block">
                          Personality: {getPersonalityLabel(aiPersonality)} • 
                          Confidence: {aiSettings[1].labels[aiConfidence - 1]} • 
                          Proactivity: {aiSettings[2].labels[aiProactivity - 1]}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Preferences</h2>
                <p className="text-sm text-gray-600">Customize your experience and notification settings</p>
              </div>
              
              <div className="space-y-4">
                {/* Notifications */}
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Bell className="w-4 h-4 mr-1.5 text-blue-600" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Browser and mobile push notifications' },
                      { key: 'sms', label: 'SMS Notifications', description: 'Text message alerts for urgent items' },
                      { key: 'desktop', label: 'Desktop Notifications', description: 'System notifications on your computer' }
                    ].map((notif) => (
                      <div key={notif.key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{notif.label}</h4>
                          <p className="text-xs text-gray-600">{notif.description}</p>
                        </div>
                        <button
                          onClick={() => setNotifications(prev => ({ ...prev, [notif.key]: !prev[notif.key] }))}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            notifications[notif.key] ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              notifications[notif.key] ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Display Settings */}
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Palette className="w-4 h-4 mr-1.5 text-blue-600" />
                    Display Settings
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Dark Mode</h4>
                        <p className="text-xs text-gray-600">Use dark theme for better visibility in low light</p>
                      </div>
                      <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200">
                        <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform translate-x-0.5" />
                      </button>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Time Zone</label>
                      <select className="border border-gray-300 rounded px-2.5 py-1.5 text-xs w-full max-w-xs bg-white">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (Central European Time)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1.5">Language</label>
                      <select className="border border-gray-300 rounded px-2.5 py-1.5 text-xs w-full max-w-xs bg-white">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Security & Privacy</h2>
                <p className="text-sm text-gray-600">Manage your account security and data privacy settings</p>
              </div>
              
              <div className="space-y-4">
                {/* Account Security */}
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Key className="w-4 h-4 mr-1.5 text-blue-600" />
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-xs text-gray-600">Add an extra layer of security to your account</p>
                      </div>
                      <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-xs hover:bg-blue-700 transition-colors">
                        Enable 2FA
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Password</h4>
                        <p className="text-xs text-gray-600">Last changed 30 days ago</p>
                      </div>
                      <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors">
                        Change Password
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Active Sessions</h4>
                        <p className="text-xs text-gray-600">Manage devices signed into your account</p>
                      </div>
                      <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors">
                        View Sessions
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Data Privacy */}
                <div className="bg-white rounded border border-gray-200 p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-1.5 text-blue-600" />
                    Data Privacy
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Data Retention</h4>
                        <p className="text-xs text-gray-600">How long we keep your data</p>
                      </div>
                      <select className="border border-gray-300 rounded px-2.5 py-1.5 text-xs bg-white">
                        <option>1 year</option>
                        <option>2 years</option>
                        <option>5 years</option>
                        <option>Indefinite</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Export Data</h4>
                        <p className="text-xs text-gray-600">Download a copy of your data</p>
                      </div>
                      <button className="border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs hover:bg-gray-50 transition-colors">
                        Request Export
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Delete Account</h4>
                        <p className="text-xs text-gray-600">Permanently delete your account and data</p>
                      </div>
                      <button className="bg-red-600 text-white px-3 py-1.5 rounded text-xs hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsWireframe;