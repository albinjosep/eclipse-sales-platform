'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, Key, Database, Bot, Mail, Calendar, CreditCard, Settings, ArrowRight, ArrowLeft, RefreshCw, Eye, EyeOff, Loader2, AlertTriangle, Info, X } from 'lucide-react';
import { setupValidationAPI, validateOpenAIKey, validateSupabaseConfig, type ValidationResult } from '@/lib/setup-validation';
import Link from 'next/link';

interface SetupRequirement {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  required: boolean;
  category: 'environment' | 'api' | 'database' | 'integration';
  action?: string;
  helpUrl?: string;
}

interface CostEstimate {
  service: string;
  estimatedMonthlyCost: string;
  freeCredits?: string;
  rateLimit?: string;
}

export default function FirstTimeSetup() {
  const [isLoading, setIsLoading] = useState(true);
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [requirements, setRequirements] = useState<SetupRequirement[]>([]);
  const [costEstimates, setCostEstimates] = useState<CostEstimate[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{[key: string]: ValidationResult}>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setupSteps = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Platform overview and requirements'
    },
    {
      id: 'environment',
      title: 'Environment Setup',
      description: 'Configure environment variables and API keys'
    },
    {
      id: 'validation',
      title: 'Validation',
      description: 'Verify all configurations'
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Setup completed successfully'
    }
  ];

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get current setup status
      const status = await setupValidationAPI.validatePlatform();
      setSetupStatus(status);

      // Get setup requirements
      const reqResponse = await setupValidationAPI.getRequirements();
      
      // Transform requirements into our format
      const transformedRequirements: SetupRequirement[] = [
        {
          id: 'openai_api_key',
          title: 'OpenAI API Key',
          description: 'Required for AI-powered features and automation',
          status: status.data.results.find((r: any) => r.component === 'OPENAI_API_KEY')?.status === 'valid' ? 'completed' : 'pending',
          required: true,
          category: 'api',
          action: 'Configure in environment variables',
          helpUrl: 'https://platform.openai.com/api-keys'
        },
        {
          id: 'supabase_config',
          title: 'Supabase Configuration',
          description: 'Database and authentication backend',
          status: status.data.results.find((r: any) => r.component === 'supabase')?.status === 'valid' ? 'completed' : 'pending',
          required: true,
          category: 'database',
          action: 'Set SUPABASE_URL and SUPABASE_ANON_KEY',
          helpUrl: 'https://supabase.com/dashboard'
        },
        {
          id: 'database_connection',
          title: 'Database Connection',
          description: 'Verify database connectivity and schema',
          status: status.data.results.find((r: any) => r.component === 'database')?.status === 'valid' ? 'completed' : 'pending',
          required: true,
          category: 'database',
          action: 'Test database connection'
        },
        {
          id: 'redis_cache',
          title: 'Redis Cache (Optional)',
          description: 'Improves performance for session management',
          status: status.data.results.find((r: any) => r.component === 'redis')?.status === 'valid' ? 'completed' : 'pending',
          required: false,
          category: 'environment',
          action: 'Configure REDIS_URL if available'
        }
      ];

      setRequirements(transformedRequirements);

      // Set cost estimates
      setCostEstimates([
        {
          service: 'OpenAI API',
          estimatedMonthlyCost: '$20-100',
          freeCredits: '$5 for new accounts',
          rateLimit: '3 requests/minute (free tier)'
        },
        {
          service: 'Supabase',
          estimatedMonthlyCost: '$0-25',
          freeCredits: 'Free tier: 500MB database, 50MB file storage',
          rateLimit: '100 requests/second'
        }
      ]);

      // Determine current step based on setup status
      const progress = status.data.summary.valid / status.data.summary.total_checks;
      if (progress === 1) {
        setCurrentStep(3); // Complete
      } else if (progress > 0.5) {
        setCurrentStep(2); // Validation
      } else if (progress > 0) {
        setCurrentStep(1); // Environment
      } else {
        setCurrentStep(0); // Welcome
      }

    } catch (error) {
      console.error('Failed to check setup status:', error);
      setError(error instanceof Error ? error.message : 'Failed to load setup status. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateSetup = async () => {
    setIsValidating(true);
    try {
      const validation = await setupValidationAPI.validatePlatform();
      // Convert results array to object with component as key
      const resultsObj = validation.data.results.reduce((acc: any, result: any) => {
        acc[result.component] = result;
        return acc;
      }, {});
      setValidationResults(resultsObj);
      
      // Update requirements status based on validation
      setRequirements(prev => prev.map(req => {
        let status = req.status;
        
        switch (req.id) {
          case 'openai_api_key':
            status = validation.data.results.find((r: any) => r.component === 'OPENAI_API_KEY')?.status === 'valid' ? 'completed' : 'failed';
            break;
          case 'supabase_config':
            status = validation.data.results.find((r: any) => r.component === 'supabase')?.status === 'valid' ? 'completed' : 'failed';
            break;
          case 'database_connection':
            status = validation.data.results.find((r: any) => r.component === 'database')?.status === 'valid' ? 'completed' : 'failed';
            break;
          case 'redis_cache':
            status = validation.data.results.find((r: any) => r.component === 'redis')?.status === 'valid' ? 'completed' : 'pending';
            break;
        }
        
        return { ...req, status };
      }));
      
      // Check if all required items are completed
      const allRequired = requirements.filter(r => r.required).every(r => {
        const componentMap: {[key: string]: string} = {
          'openai_api_key': 'OPENAI_API_KEY',
          'supabase_config': 'supabase',
          'database_connection': 'database'
        };
        const component = componentMap[r.id];
        return component && validation.data.results.find((result: any) => result.component === component)?.status === 'valid';
      });
      
      if (allRequired) {
        setCurrentStep(3); // Move to complete step
      }
      
    } catch (error) {
      console.error('Validation failed:', error);
      setError(error instanceof Error ? error.message : 'Validation failed. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'in_progress':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-cyan-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Platform Status</h2>
          <p className="text-gray-600">Analyzing your current setup configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Eclipse Sales Platform Setup
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Complete your platform configuration for optimal performance
          </p>
          {setupStatus && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-cyan-100 text-cyan-800">
              Setup Progress: {Math.round((setupStatus.overall_progress || 0) * 100)}% Complete
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Setup Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index <= currentStep ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    index <= currentStep ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                {index < setupSteps.length - 1 && (
                  <div className={`w-16 h-0.5 ml-4 ${
                    index < currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Eclipse Sales</h2>
                <p className="text-gray-600 mb-6">
                  Your AI-native enterprise sales platform. Let's get you set up with the essential requirements.
                </p>
              </div>

              {/* Cost Estimates */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-2">Cost Estimates</h3>
                    <div className="space-y-2">
                      {costEstimates.map((estimate, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium text-yellow-800">{estimate.service}:</span>
                          <span className="text-yellow-700 ml-2">{estimate.estimatedMonthlyCost}/month</span>
                          {estimate.freeCredits && (
                            <div className="text-yellow-600 ml-4">• {estimate.freeCredits}</div>
                          )}
                          {estimate.rateLimit && (
                            <div className="text-yellow-600 ml-4">• Rate limit: {estimate.rateLimit}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Requirements</h3>
                <div className="space-y-3">
                  {requirements.map((req) => (
                    <div key={req.id} className={`p-4 rounded-lg border ${getStatusColor(req.status)}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          {getStatusIcon(req.status)}
                          <div className="ml-3">
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-900">{req.title}</h4>
                              {req.required && (
                                <span className="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                            {req.action && (
                              <p className="text-xs text-gray-500 mt-1">Action: {req.action}</p>
                            )}
                          </div>
                        </div>
                        {req.helpUrl && (
                          <a
                            href={req.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Start Setup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <Settings className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Environment Configuration</h2>
                <p className="text-gray-600">
                  Configure your environment variables and API keys. Check your .env file or system environment.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-2">Environment Setup Instructions</h3>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Copy the .env.template file to .env</li>
                      <li>Fill in your API keys and configuration values</li>
                      <li>Restart your application to load the new environment variables</li>
                      <li>Return here to validate your configuration</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {requirements.filter(r => r.required).map((req) => (
                  <div key={req.id} className={`p-4 rounded-lg border ${getStatusColor(req.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(req.status)}
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{req.title}</h4>
                          <p className="text-sm text-gray-600">{req.description}</p>
                        </div>
                      </div>
                      {req.helpUrl && (
                        <a
                          href={req.helpUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(0)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Validate Setup
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Validate Configuration</h2>
                <p className="text-gray-600">
                  Let's verify that all your configurations are working correctly.
                </p>
              </div>

              <div className="space-y-4">
                {requirements.map((req) => (
                  <div key={req.id} className={`p-4 rounded-lg border ${getStatusColor(req.status)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {getStatusIcon(req.status)}
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{req.title}</h4>
                          <p className="text-sm text-gray-600">{req.description}</p>
                          {validationResults[req.id] && validationResults[req.id].status !== 'valid' && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationResults[req.id].message}
                            </p>
                          )}
                        </div>
                      </div>
                      {req.required && req.status !== 'completed' && (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={validateSetup}
                  disabled={isValidating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      Run Validation
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Setup
                </button>
                {requirements.filter(r => r.required).every(r => r.status === 'completed') && (
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    Complete Setup
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <div>
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Complete!</h2>
                <p className="text-gray-600 mb-6">
                  Congratulations! Your Eclipse Sales Platform is now configured and ready to use.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-4">What's Next?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start">
                    <Bot className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">Configure AI Agents</h4>
                      <p className="text-sm text-green-700">Set up your AI sales assistants and workflows</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Database className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">Import Data</h4>
                      <p className="text-sm text-green-700">Connect your CRM and import existing contacts</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">Schedule Integration</h4>
                      <p className="text-sm text-green-700">Connect your calendar for automated scheduling</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-medium text-green-800">Email Setup</h4>
                      <p className="text-sm text-green-700">Configure email templates and automation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/monitoring"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  View Monitoring
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/docs/setup"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <ExternalLink className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Setup Documentation</h4>
                <p className="text-sm text-gray-600">Detailed setup instructions</p>
              </div>
            </a>
            <a
              href="/docs/troubleshooting"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Troubleshooting</h4>
                <p className="text-sm text-gray-600">Common issues and solutions</p>
              </div>
            </a>
            <a
              href="/support"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <Mail className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Contact Support</h4>
                <p className="text-sm text-gray-600">Get help from our team</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}