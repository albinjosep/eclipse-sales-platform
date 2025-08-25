'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, Key, Database, Bot, Mail, Calendar, CreditCard, Settings, Users, FileText, Zap, Shield, Monitor, ArrowRight, RefreshCw, Loader2, Info, AlertTriangle } from 'lucide-react';
import { setupValidationAPI } from '@/lib/setup-validation.ts';
import Link from 'next/link';
import ProtectedRoute from '../../components/ProtectedRoute';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'essential' | 'recommended' | 'optional';
  status: 'completed' | 'pending' | 'in_progress' | 'skipped';
  action: string;
  helpUrl?: string;
  estimatedTime?: string;
  dependencies?: string[];
}

interface ChecklistCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

function OnboardingChecklistContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [checklist, setChecklist] = useState<ChecklistCategory[]>([]);
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['platform-setup']));
  const [isValidating, setIsValidating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadChecklistData();
  }, []);

  const loadChecklistData = async () => {
    setIsLoading(true);
    try {
      // Get current setup status
      const statusResponse = await setupValidationAPI.getStatus();
      setSetupStatus(statusResponse);
      const status = statusResponse.data;

      // Initialize checklist with current status
      const checklistData: ChecklistCategory[] = [
        {
          id: 'platform-setup',
          title: 'Platform Setup',
          description: 'Essential configuration for platform functionality',
          icon: <Settings className="w-6 h-6" />,
          items: [
            {
              id: 'env-variables',
              title: 'Environment Variables',
              description: 'Configure .env file with required API keys and settings',
              category: 'essential',
              status: status.setup_complete ? 'completed' : 'pending',
              action: 'Set up .env file with OPENAI_API_KEY, SUPABASE_URL, etc.',
              helpUrl: '/docs/environment-setup',
              estimatedTime: '5 minutes'
            },
            {
              id: 'openai-api',
              title: 'OpenAI API Configuration',
              description: 'Set up OpenAI API key for AI-powered features',
              category: 'essential',
              status: status.required_configured > 0 ? 'completed' : 'pending',
              action: 'Add valid OpenAI API key to environment variables',
              helpUrl: 'https://platform.openai.com/api-keys',
              estimatedTime: '3 minutes'
            },
            {
              id: 'supabase-config',
              title: 'Supabase Database Setup',
              description: 'Configure Supabase for database and authentication',
              category: 'essential',
              status: status.required_configured > 1 ? 'completed' : 'pending',
              action: 'Set SUPABASE_URL and SUPABASE_ANON_KEY in environment',
              helpUrl: 'https://supabase.com/dashboard',
              estimatedTime: '5 minutes'
            },
            {
              id: 'database-connection',
              title: 'Database Connection Test',
              description: 'Verify database connectivity and schema',
              category: 'essential',
              status: status.setup_percentage > 50 ? 'completed' : 'pending',
              action: 'Test database connection and run migrations if needed',
              estimatedTime: '2 minutes',
              dependencies: ['supabase-config']
            },
            {
              id: 'redis-cache',
              title: 'Redis Cache (Optional)',
              description: 'Set up Redis for improved performance',
              category: 'recommended',
              status: status.optional_configured > 0 ? 'completed' : 'pending',
              action: 'Configure REDIS_URL for session management',
              estimatedTime: '3 minutes'
            }
          ]
        },
        {
          id: 'ai-configuration',
          title: 'AI & Automation',
          description: 'Configure AI agents and automation workflows',
          icon: <Bot className="w-6 h-6" />,
          items: [
            {
              id: 'ai-agents-setup',
              title: 'AI Agents Configuration',
              description: 'Set up and customize your AI sales assistants',
              category: 'essential',
              status: 'pending',
              action: 'Configure AI agents in the AI Agents section',
              helpUrl: '/ai-agents',
              estimatedTime: '10 minutes',
              dependencies: ['openai-api']
            },
            {
              id: 'workflow-automation',
              title: 'Workflow Automation',
              description: 'Set up automated sales workflows and triggers',
              category: 'recommended',
              status: 'pending',
              action: 'Create and configure automation workflows',
              helpUrl: '/workflows',
              estimatedTime: '15 minutes',
              dependencies: ['ai-agents-setup']
            },
            {
              id: 'ai-prompts',
              title: 'AI Prompt Customization',
              description: 'Customize AI prompts for your business needs',
              category: 'recommended',
              status: 'pending',
              action: 'Review and customize AI prompts in settings',
              helpUrl: '/settings/ai',
              estimatedTime: '8 minutes'
            }
          ]
        },
        {
          id: 'data-integration',
          title: 'Data & Integrations',
          description: 'Connect external systems and import data',
          icon: <Database className="w-6 h-6" />,
          items: [
            {
              id: 'crm-integration',
              title: 'CRM Integration',
              description: 'Connect your existing CRM system',
              category: 'recommended',
              status: 'pending',
              action: 'Set up CRM integration (Salesforce, HubSpot, etc.)',
              helpUrl: '/integrations',
              estimatedTime: '10 minutes'
            },
            {
              id: 'contact-import',
              title: 'Contact Import',
              description: 'Import existing contacts and leads',
              category: 'recommended',
              status: 'pending',
              action: 'Import contacts from CSV or CRM integration',
              helpUrl: '/contacts/import',
              estimatedTime: '5 minutes',
              dependencies: ['crm-integration']
            },
            {
              id: 'calendar-sync',
              title: 'Calendar Integration',
              description: 'Sync with Google Calendar or Outlook',
              category: 'recommended',
              status: 'pending',
              action: 'Connect calendar for automated scheduling',
              helpUrl: '/integrations/calendar',
              estimatedTime: '5 minutes'
            },
            {
              id: 'email-integration',
              title: 'Email Integration',
              description: 'Connect email for automated communications',
              category: 'recommended',
              status: 'pending',
              action: 'Set up email integration and templates',
              helpUrl: '/integrations/email',
              estimatedTime: '8 minutes'
            }
          ]
        },
        {
          id: 'user-management',
          title: 'User Management',
          description: 'Set up team members and permissions',
          icon: <Users className="w-6 h-6" />,
          items: [
            {
              id: 'team-setup',
              title: 'Team Member Setup',
              description: 'Invite team members and assign roles',
              category: 'recommended',
              status: 'pending',
              action: 'Invite team members in User Management',
              helpUrl: '/users',
              estimatedTime: '5 minutes'
            },
            {
              id: 'role-permissions',
              title: 'Role & Permissions',
              description: 'Configure user roles and access permissions',
              category: 'recommended',
              status: 'pending',
              action: 'Set up roles and permissions for team members',
              helpUrl: '/users/roles',
              estimatedTime: '8 minutes',
              dependencies: ['team-setup']
            },
            {
              id: 'user-profiles',
              title: 'User Profiles',
              description: 'Complete user profiles and preferences',
              category: 'optional',
              status: 'pending',
              action: 'Update user profiles and notification preferences',
              helpUrl: '/profile',
              estimatedTime: '3 minutes'
            }
          ]
        },
        {
          id: 'security-compliance',
          title: 'Security & Compliance',
          description: 'Configure security settings and compliance features',
          icon: <Shield className="w-6 h-6" />,
          items: [
            {
              id: 'security-settings',
              title: 'Security Configuration',
              description: 'Review and configure security settings',
              category: 'essential',
              status: 'pending',
              action: 'Configure password policies and security settings',
              helpUrl: '/settings/security',
              estimatedTime: '5 minutes'
            },
            {
              id: 'data-backup',
              title: 'Data Backup Setup',
              description: 'Configure automated data backups',
              category: 'recommended',
              status: 'pending',
              action: 'Set up automated backup schedules',
              helpUrl: '/settings/backup',
              estimatedTime: '3 minutes'
            },
            {
              id: 'audit-logging',
              title: 'Audit Logging',
              description: 'Enable audit logging for compliance',
              category: 'optional',
              status: 'pending',
              action: 'Enable audit logging in security settings',
              helpUrl: '/settings/audit',
              estimatedTime: '2 minutes'
            }
          ]
        },
        {
          id: 'monitoring-optimization',
          title: 'Monitoring & Optimization',
          description: 'Set up monitoring and performance optimization',
          icon: <Monitor className="w-6 h-6" />,
          items: [
            {
              id: 'cost-monitoring',
              title: 'Cost Monitoring Setup',
              description: 'Configure API usage and cost monitoring',
              category: 'recommended',
              status: 'pending',
              action: 'Set up cost alerts and usage monitoring',
              helpUrl: '/monitoring',
              estimatedTime: '5 minutes',
              dependencies: ['openai-api']
            },
            {
              id: 'performance-alerts',
              title: 'Performance Alerts',
              description: 'Set up alerts for system performance',
              category: 'optional',
              status: 'pending',
              action: 'Configure performance monitoring and alerts',
              helpUrl: '/monitoring/alerts',
              estimatedTime: '3 minutes'
            },
            {
              id: 'analytics-setup',
              title: 'Analytics Configuration',
              description: 'Set up analytics and reporting',
              category: 'optional',
              status: 'pending',
              action: 'Configure analytics tracking and reports',
              helpUrl: '/analytics',
              estimatedTime: '5 minutes'
            }
          ]
        }
      ];

      setChecklist(checklistData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load checklist data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshStatus = async () => {
    setIsValidating(true);
    try {
      await loadChecklistData();
    } catch (error) {
      console.error('Failed to refresh status:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const markItemComplete = (categoryId: string, itemId: string) => {
    setChecklist(prev => prev.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, status: 'completed' } : item
          )
        };
      }
      return category;
    }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'skipped':
        return <div className="w-5 h-5 border-2 border-gray-400 rounded-full bg-gray-100" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      case 'skipped':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getCategoryProgress = (category: ChecklistCategory) => {
    const completed = category.items.filter(item => item.status === 'completed').length;
    return Math.round((completed / category.items.length) * 100);
  };

  const getOverallProgress = () => {
    const allItems = checklist.flatMap(category => category.items);
    const completed = allItems.filter(item => item.status === 'completed').length;
    return Math.round((completed / allItems.length) * 100);
  };

  const getEssentialProgress = () => {
    const essentialItems = checklist.flatMap(category => 
      category.items.filter(item => item.category === 'essential')
    );
    const completed = essentialItems.filter(item => item.status === 'completed').length;
    return Math.round((completed / essentialItems.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Onboarding Checklist</h2>
          <p className="text-gray-600">Checking your current setup progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Onboarding Checklist</h1>
              <p className="text-lg text-gray-600 mt-2">
                Complete these steps to get the most out of your Eclipse Sales Platform
              </p>
            </div>
            <button
              onClick={refreshStatus}
              disabled={isValidating}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:from-cyan-600 hover:to-teal-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh Status
            </button>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Overall Progress</h3>
                <span className="text-2xl font-bold text-cyan-600">{getOverallProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getOverallProgress()}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Essential Items</h3>
                <span className="text-2xl font-bold text-green-600">{getEssentialProgress()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getEssentialProgress()}%` }}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">Last Updated</h3>
                <span className="text-sm text-gray-600">
                  {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {lastUpdated.toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">Quick Start Tips</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Start with Essential items to get your platform functional</li>
                  <li>• Complete Platform Setup before moving to other categories</li>
                  <li>• Use the help links for detailed setup instructions</li>
                  <li>• Check dependencies before starting complex configurations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Categories */}
        <div className="space-y-6">
          {checklist.map((category: any) => {
            const progress = getCategoryProgress(category);
            const isExpanded = expandedCategories.has(category.id);
            
            return (
              <div key={category.id} className="bg-white rounded-lg border border-gray-200 shadow-sm">
                {/* Category Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="text-blue-600 mr-4">
                        {category.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                        <p className="text-gray-600 mt-1">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{progress}%</div>
                        <div className="text-sm text-gray-500">
                          {category.items.filter((item: ChecklistItem) => item.status === 'completed').length} of {category.items.length}
                        </div>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </div>

                {/* Category Items */}
                {isExpanded && (
                  <div className="border-t border-gray-200">
                    <div className="p-6 space-y-4">
                      {category.items.map((item: ChecklistItem) => {
                        const canComplete = !item.dependencies || 
                          item.dependencies.every((depId: string) => 
                            checklist.some(cat => 
                              cat.items.some(i => i.id === depId && i.status === 'completed')
                            )
                          );
                        
                        return (
                          <div key={item.id} className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div className="mt-0.5 mr-3">
                                  {getStatusIcon(item.status)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center mb-2">
                                    <h3 className="font-medium text-gray-900 mr-2">{item.title}</h3>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                      item.category === 'essential' ? 'bg-red-100 text-red-800' :
                                      item.category === 'recommended' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {item.category}
                                    </span>
                                    {item.estimatedTime && (
                                      <span className="ml-2 text-xs text-gray-500">
                                        ~{item.estimatedTime}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                  <p className="text-sm text-gray-700 font-medium">{item.action}</p>
                                  
                                  {item.dependencies && item.dependencies.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500">
                                        Dependencies: {item.dependencies.join(', ')}
                                      </p>
                                    </div>
                                  )}
                                  
                                  {!canComplete && (
                                    <div className="mt-2 flex items-center text-yellow-600">
                                      <AlertTriangle className="w-4 h-4 mr-1" />
                                      <span className="text-xs">Complete dependencies first</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2 ml-4">
                                {item.helpUrl && (
                                  <a
                                    href={item.helpUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                )}
                                
                                {item.status !== 'completed' && canComplete && (
                                  <button
                                    onClick={() => markItemComplete(category.id, item.id)}
                                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                  >
                                    Mark Complete
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
            <div className="flex justify-center space-x-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/first-time-setup"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                Setup Wizard
                <Settings className="w-4 h-4" />
              </Link>
              <Link
                href="/monitoring"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                View Monitoring
                <Monitor className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingChecklist() {
  return (
    <ProtectedRoute>
      <OnboardingChecklistContent />
    </ProtectedRoute>
  );
}