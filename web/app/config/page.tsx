'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Settings, 
  Download, 
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ValidationResult {
  valid: boolean;
  message: string;
  details?: any;
}

interface ConfigStatus {
  environment: string;
  production_ready: boolean;
  readiness_percentage: number;
  summary: {
    total_settings: number;
    valid_settings: number;
    invalid_settings: number;
    missing_required: number;
  };
  missing_required: string[];
  categories: Record<string, {
    settings_count: number;
    description: string;
  }>;
  next_steps: string[];
}

interface CategoryValidation {
  category: string;
  total_settings: number;
  valid_settings: number;
  invalid_settings: number;
  results: Array<{
    setting: string;
    valid: boolean;
    message: string;
    required: boolean;
  }>;
}

export default function ConfigurationPage() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus | null>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [categoryValidations, setCategoryValidations] = useState<Record<string, CategoryValidation>>({});
  const [envTemplate, setEnvTemplate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const fetchConfigStatus = async () => {
    try {
      const response = await fetch('/api/v1/config/status');
      const data = await response.json();
      if (data.success) {
        setConfigStatus(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch config status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch configuration status',
        variant: 'destructive'
      });
    }
  };

  const fetchValidationResults = async () => {
    try {
      const response = await fetch('/api/v1/config/validate');
      const data = await response.json();
      if (data.success) {
        setValidationResults(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch validation results:', error);
    }
  };

  const fetchCategoryValidation = async (category: string) => {
    try {
      const response = await fetch(`/api/v1/config/validate/category/${category}`);
      const data = await response.json();
      if (data.success) {
        setCategoryValidations(prev => ({
          ...prev,
          [category]: data.data
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch ${category} validation:`, error);
    }
  };

  const fetchEnvTemplate = async () => {
    try {
      const response = await fetch('/api/v1/config/template');
      const data = await response.json();
      if (data.success) {
        setEnvTemplate(data.data.template);
      }
    } catch (error) {
      console.error('Failed to fetch environment template:', error);
    }
  };

  const refreshAll = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchConfigStatus(),
      fetchValidationResults(),
      fetchEnvTemplate()
    ]);
    setRefreshing(false);
    toast({
      title: 'Refreshed',
      description: 'Configuration data has been updated'
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy to clipboard',
        variant: 'destructive'
      });
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([envTemplate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '.env.template';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (valid: boolean, required: boolean = false) => {
    if (valid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (required) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (valid: boolean, required: boolean = false) => {
    if (valid) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Valid</Badge>;
    } else if (required) {
      return <Badge variant="destructive">Required</Badge>;
    } else {
      return <Badge variant="secondary">Optional</Badge>;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchConfigStatus(),
        fetchValidationResults(),
        fetchEnvTemplate()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading configuration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Configuration Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and validate your application configuration settings
          </p>
        </div>
        <Button onClick={refreshAll} disabled={refreshing} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {configStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Configuration Status
              <Badge 
                variant={configStatus.production_ready ? "default" : "destructive"}
                className={configStatus.production_ready ? "bg-green-100 text-green-800" : ""}
              >
                {configStatus.production_ready ? 'Production Ready' : 'Needs Configuration'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Environment: {configStatus.environment} • {configStatus.readiness_percentage}% configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Configuration Progress</span>
                  <span>{configStatus.readiness_percentage}%</span>
                </div>
                <Progress value={configStatus.readiness_percentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {configStatus.summary.valid_settings}
                  </div>
                  <div className="text-sm text-muted-foreground">Valid Settings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {configStatus.summary.invalid_settings}
                  </div>
                  <div className="text-sm text-muted-foreground">Invalid Settings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {configStatus.summary.missing_required}
                  </div>
                  <div className="text-sm text-muted-foreground">Missing Required</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {configStatus.summary.total_settings}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Settings</div>
                </div>
              </div>

              {configStatus.missing_required.length > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Missing Required Settings:</strong> {configStatus.missing_required.join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {configStatus && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                  <CardDescription>
                    Recommended actions to improve your configuration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {configStatus.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuration Categories</CardTitle>
                  <CardDescription>
                    Overview of settings organized by category
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(configStatus.categories).map(([category, info]) => (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{category}</h4>
                          <Badge variant="outline">{info.settings_count} settings</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => {
                            setActiveTab('categories');
                            fetchCategoryValidation(category);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          {configStatus && (
            <div className="grid gap-4">
              {Object.keys(configStatus.categories).map((category) => (
                <Card key={category}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="capitalize">{category}</CardTitle>
                        <CardDescription>
                          {configStatus.categories[category].description}
                        </CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => fetchCategoryValidation(category)}
                        disabled={!!categoryValidations[category]}
                      >
                        {categoryValidations[category] ? 'Loaded' : 'Load Details'}
                      </Button>
                    </div>
                  </CardHeader>
                  {categoryValidations[category] && (
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex gap-4 text-sm">
                          <span>Total: {categoryValidations[category].total_settings}</span>
                          <span className="text-green-600">
                            Valid: {categoryValidations[category].valid_settings}
                          </span>
                          <span className="text-red-600">
                            Invalid: {categoryValidations[category].invalid_settings}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {categoryValidations[category].results.map((result, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(result.valid, result.required)}
                                <span className="font-mono text-sm">{result.setting}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">{result.message}</span>
                                {getStatusBadge(result.valid, result.required)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          {validationResults && (
            <Card>
              <CardHeader>
                <CardTitle>Full Configuration Validation</CardTitle>
                <CardDescription>
                  Comprehensive validation results for all settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">
                        {validationResults.summary.valid_settings}
                      </div>
                      <div className="text-sm text-muted-foreground">Valid</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">
                        {validationResults.summary.invalid_settings}
                      </div>
                      <div className="text-sm text-muted-foreground">Invalid</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600">
                        {validationResults.summary.missing_required}
                      </div>
                      <div className="text-sm text-muted-foreground">Missing</div>
                    </div>
                  </div>
                  
                  {validationResults.details && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Validation Details</h4>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96">
                        {JSON.stringify(validationResults.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Environment Template</CardTitle>
                  <CardDescription>
                    Generate and download environment configuration templates
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(envTemplate)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" onClick={downloadTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {envTemplate && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowSensitive(!showSensitive)}
                    >
                      {showSensitive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {showSensitive ? 'Hide' : 'Show'} Sensitive
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
                    {showSensitive ? envTemplate : envTemplate.replace(/=.*/g, '=***')}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}