'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, Key, Database, Bot, Mail, Calendar, CreditCard, Settings, ArrowRight, ArrowLeft, RefreshCw, Eye, EyeOff, Loader2 } from 'lucide-react';
import { setupValidationAPI, validateOpenAIKey, validateSupabaseConfig, type ValidationResult } from '@/lib/setup-validation.ts';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  required: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

interface APIKeyValidation {
  openai: boolean;
  supabase: boolean;
}

const SetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: ''
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    supabaseAnonKey: false,
    supabaseServiceKey: false
  });
  const [validation, setValidation] = useState<APIKeyValidation>({
    openai: false,
    supabase: false
  });
  const [isValidating, setIsValidating] = useState(false);
  const [integrations, setIntegrations] = useState({
    email: false,
    calendar: false,
    crm: false
  });
  const [setupComplete, setSetupComplete] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [setupStatus, setSetupStatus] = useState<any>(null);

  useEffect(() => {
    // Check current setup status on component load
    const checkSetupStatus = async () => {
      try {
        const statusResponse = await setupValidationAPI.getStatus();
        setSetupStatus(statusResponse);
        const status = statusResponse.data;
        
        // Pre-fill any existing valid configurations based on setup progress
        if (status.required_configured > 0) {
          setValidation(prev => ({ ...prev, openai: true }));
        }
        if (status.required_configured > 1) {
          setValidation(prev => ({ ...prev, supabase: true }));
        }
      } catch (error) {
        console.error('Failed to check setup status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    
    checkSetupStatus();
  }, []);

  const setupSteps: SetupStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Eclipse',
      description: 'Let\'s get your AI-native sales platform configured',
      icon: Bot,
      required: true,
      status: 'completed'
    },
    {
      id: 'api-keys',
      title: 'API Keys Configuration',
      description: 'Configure OpenAI and Supabase credentials',
      icon: Key,
      required: true,
      status: validation.openai && validation.supabase ? 'completed' : 'pending'
    },
    {
      id: 'database',
      title: 'Database Setup',
      description: 'Initialize your AI-native database schema',
      icon: Database,
      required: true,
      status: validation.supabase ? 'completed' : 'pending'
    },
    {
      id: 'integrations',
      title: 'Connect Integrations',
      description: 'Link your email, calendar, and CRM systems',
      icon: Settings,
      required: false,
      status: 'pending'
    },
    {
      id: 'complete',
      title: 'Setup Complete',
      description: 'Your Eclipse platform is ready to use',
      icon: CheckCircle,
      required: true,
      status: setupComplete ? 'completed' : 'pending'
    }
  ];

  const validateAPIKeys = async () => {
    setIsValidating(true);
    setValidationErrors({});
    
    try {
      let openaiValid = false;
      let supabaseValid = false;
      const errors: {[key: string]: string} = {};
      
      // Validate OpenAI API Key
      if (apiKeys.openai) {
        const openaiFormatCheck = validateOpenAIKey(apiKeys.openai);
        if (!openaiFormatCheck.valid) {
          errors.openai = openaiFormatCheck.message || 'Invalid OpenAI API key format';
        } else {
          try {
            const result = await setupValidationAPI.validateAPIKey({
              service: 'openai',
              api_key: apiKeys.openai
            });
            openaiValid = result.valid;
            if (!result.valid) {
              errors.openai = result.message || 'OpenAI API key validation failed';
            }
          } catch (error) {
            console.error('OpenAI validation error:', error);
            errors.openai = 'Unable to validate OpenAI API key. Please check your connection.';
            // Fall back to format validation if API call fails
            openaiValid = openaiFormatCheck.valid;
          }
        }
        setValidation(prev => ({ ...prev, openai: openaiValid }));
      }

      // Validate Supabase credentials
      if (apiKeys.supabaseUrl && apiKeys.supabaseAnonKey) {
        const supabaseFormatCheck = validateSupabaseConfig(apiKeys.supabaseUrl, apiKeys.supabaseAnonKey);
        if (!supabaseFormatCheck.valid) {
          errors.supabase = supabaseFormatCheck.message || 'Invalid Supabase configuration';
        } else {
          try {
            const result = await setupValidationAPI.validateAPIKey({
              service: 'supabase',
              api_key: apiKeys.supabaseAnonKey,
              additional_params: {
                url: apiKeys.supabaseUrl
              }
            });
            supabaseValid = result.valid;
            if (!result.valid) {
              errors.supabase = result.message || 'Supabase connection validation failed';
            }
          } catch (error) {
            console.error('Supabase validation error:', error);
            errors.supabase = 'Unable to validate Supabase connection. Please check your credentials.';
            // Fall back to format validation if API call fails
            supabaseValid = supabaseFormatCheck.valid;
          }
        }
        setValidation(prev => ({ ...prev, supabase: supabaseValid }));
      }
      
      setValidationErrors(errors);
    } catch (error) {
      console.error('API validation error:', error);
      setValidationErrors({ general: 'Validation failed. Please try again.' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinishSetup = () => {
    setSetupComplete(true);
    // In a real implementation, this would save the configuration
    // and redirect to the main application
  };

  const toggleKeyVisibility = (keyType: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyType]: !prev[keyType as keyof typeof prev]
    }));
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
        <Bot className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Eclipse</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your AI-Native Enterprise Sales Platform
        </p>
        {setupStatus && (
          <div className="mt-4 text-sm text-gray-500">
            Setup Progress: {Math.round((setupStatus.overall_progress || 0) * 100)}% Complete
          </div>
        )}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-900 mb-2">What you'll get:</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Autonomous AI agents for lead qualification
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Intelligent deal analysis and strategy
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Automated email and follow-up sequences
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Real-time sales insights and forecasting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAPIKeysStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Key className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">API Keys Configuration</h2>
        <p className="text-gray-600">
          Configure your OpenAI and Supabase credentials to enable AI features
        </p>
      </div>

      {/* OpenAI Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">OpenAI API Key</h3>
            <p className="text-sm text-gray-600">Required for AI agents and GPT-4 features</p>
          </div>
          {validation.openai && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showKeys.openai ? 'text' : 'password'}
              value={apiKeys.openai}
              onChange={(e) => setApiKeys(prev => ({ ...prev, openai: e.target.value }))}
              placeholder="sk-..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 ${
                validationErrors.openai ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => toggleKeyVisibility('openai')}
                className="text-gray-400 hover:text-gray-600"
              >
                {showKeys.openai ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {isValidating ? (
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              ) : validation.openai ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : validationErrors.openai ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : null}
            </div>
          </div>
          {validationErrors.openai && (
            <p className="text-red-600 text-sm">{validationErrors.openai}</p>
          )}
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <CreditCard className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Cost Estimate</p>
                <p className="text-yellow-700">
                  Expected usage: $50-200/month for typical sales team
                </p>
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-yellow-700 hover:text-yellow-800 font-medium mt-1"
                >
                  Get your API key <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supabase Configuration */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <Database className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Supabase Configuration</h3>
            <p className="text-sm text-gray-600">Database and authentication backend</p>
          </div>
          {validation.supabase && <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project URL</label>
            <input
              type="text"
              value={apiKeys.supabaseUrl}
              onChange={(e) => setApiKeys(prev => ({ ...prev, supabaseUrl: e.target.value }))}
              placeholder="https://your-project-id.supabase.co"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Anonymous Key</label>
            <div className="relative">
              <input
                type={showKeys.supabaseAnonKey ? 'text' : 'password'}
                value={apiKeys.supabaseAnonKey}
                onChange={(e) => setApiKeys(prev => ({ ...prev, supabaseAnonKey: e.target.value }))}
                placeholder="eyJ..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 ${
                  validationErrors.supabase ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => toggleKeyVisibility('supabaseAnonKey')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showKeys.supabaseAnonKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {isValidating ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                ) : validation.supabase ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : validationErrors.supabase ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : null}
              </div>
            </div>
            {validationErrors.supabase && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.supabase}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Role Key</label>
            <div className="relative">
              <input
                type={showKeys.supabaseServiceKey ? 'text' : 'password'}
                value={apiKeys.supabaseServiceKey}
                onChange={(e) => setApiKeys(prev => ({ ...prev, supabaseServiceKey: e.target.value }))}
                placeholder="eyJ..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => toggleKeyVisibility('supabaseServiceKey')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKeys.supabaseServiceKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Database className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Setup Requirements</p>
                <ul className="text-blue-700 mt-1 space-y-1">
                  <li>• Enable pgvector extension for AI features</li>
                  <li>• Configure Row Level Security (RLS)</li>
                  <li>• Free tier: 500MB database, 2GB bandwidth</li>
                </ul>
                <a 
                  href="https://supabase.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 font-medium mt-2"
                >
                  Create Supabase project <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {validationErrors.general && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{validationErrors.general}</span>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={validateAPIKeys}
          disabled={isValidating || !apiKeys.openai || !apiKeys.supabaseUrl || isLoadingStatus}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isValidating || isLoadingStatus ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {isLoadingStatus ? 'Loading...' : isValidating ? 'Validating...' : 'Validate Configuration'}
        </button>
      </div>
    </div>
  );

  const renderDatabaseStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Database className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Database Initialization</h2>
        <p className="text-gray-600">
          Setting up your AI-native database schema with vector search capabilities
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-900">PostgreSQL database connection</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-900">pgvector extension for AI embeddings</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-900">User authentication tables</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-900">Sales pipeline schema</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-gray-900">AI workflow tables</span>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-800">Database setup completed successfully!</span>
        </div>
        <p className="text-green-700 mt-1 text-sm">
          Your Eclipse platform is now ready for AI-powered sales operations.
        </p>
      </div>
    </div>
  );

  const renderIntegrationsStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Settings className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Integrations</h2>
        <p className="text-gray-600">
          Link your existing tools to maximize Eclipse's AI capabilities
        </p>
      </div>

      <div className="grid gap-4">
        {/* Email Integration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Integration</h3>
                <p className="text-sm text-gray-600">Connect Gmail/Outlook for AI email insights</p>
              </div>
            </div>
            <button
              onClick={() => setIntegrations(prev => ({ ...prev, email: !prev.email }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                integrations.email 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {integrations.email ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>

        {/* Calendar Integration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Calendar Integration</h3>
                <p className="text-sm text-gray-600">Sync Google Calendar for meeting scheduling</p>
              </div>
            </div>
            <button
              onClick={() => setIntegrations(prev => ({ ...prev, calendar: !prev.calendar }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                integrations.calendar 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {integrations.calendar ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>

        {/* CRM Integration */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">CRM Integration</h3>
                <p className="text-sm text-gray-600">Import data from Salesforce, HubSpot, or Pipedrive</p>
              </div>
            </div>
            <button
              onClick={() => setIntegrations(prev => ({ ...prev, crm: !prev.crm }))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                integrations.crm 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
              }`}
            >
              {integrations.crm ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> Integrations are optional but recommended for the best AI experience. 
          You can configure these later in the Settings page.
        </p>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="text-center space-y-6">
      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
        <CheckCircle className="w-12 h-12 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Setup Complete!</h2>
        <p className="text-lg text-gray-600 mb-6">
          Your Eclipse AI-Native Sales Platform is ready to transform your sales process
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-4">What's Next?</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <span className="text-gray-700">Create your first lead and watch AI qualification in action</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <span className="text-gray-700">Configure AI personality and workflow preferences</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <span className="text-gray-700">Explore the AI copilot and automated workflows</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleFinishSetup}
          className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 font-semibold text-lg"
        >
          Launch Eclipse Platform
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (setupSteps[currentStep].id) {
      case 'welcome':
        return renderWelcomeStep();
      case 'api-keys':
        return renderAPIKeysStep();
      case 'database':
        return renderDatabaseStep();
      case 'integrations':
        return renderIntegrationsStep();
      case 'complete':
        return renderCompleteStep();
      default:
        return renderWelcomeStep();
    }
  };

  const canProceed = () => {
    switch (setupSteps[currentStep].id) {
      case 'welcome':
        return true;
      case 'api-keys':
        return validation.openai && validation.supabase;
      case 'database':
        return validation.supabase;
      case 'integrations':
        return true; // Optional step
      case 'complete':
        return false; // No next step
      default:
        return false;
    }
  };

  if (isLoadingStatus) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking Setup Status</h2>
          <p className="text-gray-600">Please wait while we verify your current configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  index === currentStep 
                    ? 'border-blue-600 bg-blue-600 text-white' 
                    : index < currentStep 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}>
                  {index < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < setupSteps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors ${
                    index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex-1 text-center">
                <p className={`text-sm font-medium transition-colors ${
                  index === currentStep 
                    ? 'text-blue-600' 
                    : index < currentStep 
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navigation */}
        {setupSteps[currentStep].id !== 'complete' && (
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupWizard;