'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, BarChart3, Settings, RefreshCw, Calendar, Zap } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';

const MonitoringContent = () => {
  const [usageSummary, setUsageSummary] = useState<any>(null);
  const [costAlerts, setCostAlerts] = useState<any>(null);
  const [optimizationTips, setOptimizationTips] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);
  const [monthlyBudget, setMonthlyBudget] = useState(200);

  // Mock data for demonstration
  const mockUsageSummary = {
    period_days: 30,
    total_cost: 45.67,
    total_tokens: 156789,
    operations_count: 234,
    average_cost_per_operation: 0.195,
    estimated_monthly_cost: 45.67,
    service_breakdown: {
      "ai_engine": { cost: 32.45, tokens: 112000, count: 156 },
      "lead_qualification": { cost: 8.90, tokens: 28000, count: 45 },
      "email_generation": { cost: 4.32, tokens: 16789, count: 33 }
    },
    model_breakdown: {
      "gpt-4": { cost: 38.90, tokens: 98000, count: 189 },
      "gpt-3.5-turbo": { cost: 6.77, tokens: 58789, count: 45 }
    }
  };

  const mockCostAlerts = {
    current_cost: 45.67,
    projected_monthly_cost: 45.67,
    budget: 200,
    budget_utilization: 22.8,
    alerts: [
      {
        type: "budget_ok",
        severity: "low",
        message: "Usage is well within budget limits",
        recommendation: "Continue monitoring usage patterns"
      }
    ]
  };

  const mockOptimizationTips = {
    current_monthly_cost: 45.67,
    optimization_tips: [
      {
        category: "Prompt Optimization",
        tip: "Optimize prompts to be more concise and specific",
        potential_savings: "10-20%",
        implementation: "Review and shorten system prompts, use structured outputs"
      },
      {
        category: "Model Selection",
        tip: "Use GPT-3.5-turbo for simpler tasks",
        potential_savings: "60-80%",
        implementation: "Route simple queries to GPT-3.5, complex ones to GPT-4"
      },
      {
        category: "Caching",
        tip: "Implement response caching for frequently asked questions",
        potential_savings: "20-30%",
        implementation: "Add Redis caching layer for AI responses"
      }
    ],
    potential_total_savings: "30-60%"
  };

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      setLoading(true);
      // In real implementation, these would be actual API calls
      setTimeout(() => {
        setUsageSummary(mockUsageSummary);
        setCostAlerts(mockCostAlerts);
        setOptimizationTips(mockOptimizationTips);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [selectedPeriod, monthlyBudget]);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Usage & Cost Monitoring</h1>
            <p className="text-gray-600 mt-2">Track your Eclipse platform usage and optimize costs</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button 
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Cost Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-2xl font-bold text-gray-900">${usageSummary?.total_cost?.toFixed(2)}</p>
                <p className="text-sm text-gray-500">{selectedPeriod} days</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Projection</p>
                <p className="text-2xl font-bold text-gray-900">${usageSummary?.estimated_monthly_cost?.toFixed(2)}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {costAlerts?.budget_utilization?.toFixed(1)}% of budget
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">API Operations</p>
                <p className="text-2xl font-bold text-gray-900">{usageSummary?.operations_count?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Avg: ${usageSummary?.average_cost_per_operation?.toFixed(3)}/op</p>
              </div>
              <Zap className="w-8 h-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tokens Used</p>
                <p className="text-2xl font-bold text-gray-900">{usageSummary?.total_tokens?.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{Math.round(usageSummary?.total_tokens / selectedPeriod)}/day avg</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Budget Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Budget Management</h2>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">$</span>
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Utilization</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      costAlerts?.budget_utilization > 80 ? 'bg-red-500' :
                      costAlerts?.budget_utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(costAlerts?.budget_utilization || 0, 100)}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {costAlerts?.budget_utilization?.toFixed(1)}%
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Remaining Budget</label>
              <p className="text-lg font-semibold text-gray-900">
                ${(monthlyBudget - (costAlerts?.projected_monthly_cost || 0)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage by Service</h2>
            <div className="space-y-4">
              {Object.entries(usageSummary?.service_breakdown || {}).map(([service, data]: [string, any]) => (
                <div key={service} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {service.replace('_', ' ')}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${data.cost?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{data.count} operations</span>
                      <span>{data.tokens?.toLocaleString()} tokens</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{ 
                          width: `${(data.cost / usageSummary.total_cost) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage by Model</h2>
            <div className="space-y-4">
              {Object.entries(usageSummary?.model_breakdown || {}).map(([model, data]: [string, any]) => (
                <div key={model} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{model}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${data.cost?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{data.count} operations</span>
                      <span>{data.tokens?.toLocaleString()} tokens</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ 
                          width: `${(data.cost / usageSummary.total_cost) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Optimization Tips */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cost Optimization Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {optimizationTips?.optimization_tips?.map((tip: any, index: number) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">{tip.category}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{tip.tip}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Save {tip.potential_savings}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">{tip.implementation}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">
                Potential Total Savings: {optimizationTips?.potential_total_savings}
              </span>
            </div>
            <p className="text-sm text-blue-700 mt-1">
              Implementing these optimizations could reduce your monthly costs from 
              ${optimizationTips?.current_monthly_cost?.toFixed(2)} to approximately 
              ${(optimizationTips?.current_monthly_cost * 0.5)?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function MonitoringPage() {
  return (
    <ProtectedRoute>
      <MonitoringContent />
    </ProtectedRoute>
  );
}