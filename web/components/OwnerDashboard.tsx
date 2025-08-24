'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  Calendar,
  Target,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  stage: string;
  lastContact: string;
  notes: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  source: string;
  createdAt?: string;
}

interface WeeklyMetrics {
  newLeads: number;
  totalPipelineValue: number;
  atRiskDeals: number;
  closedDeals: number;
  conversionRate: number;
  averageDealSize: number;
  activitiesCompleted: number;
  followUpsDue: number;
}

interface OwnerDashboardProps {
  leads: Lead[];
  timeframe?: 'week' | 'month' | 'quarter';
}

const OwnerDashboard: React.FC<OwnerDashboardProps> = ({ leads, timeframe = 'week' }) => {
  const [metrics, setMetrics] = useState<WeeklyMetrics>({
    newLeads: 0,
    totalPipelineValue: 0,
    atRiskDeals: 0,
    closedDeals: 0,
    conversionRate: 0,
    averageDealSize: 0,
    activitiesCompleted: 0,
    followUpsDue: 0
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);

  useEffect(() => {
    const calculateMetrics = () => {
      const now = new Date();
      const timeframeDays = selectedTimeframe === 'week' ? 7 : selectedTimeframe === 'month' ? 30 : 90;
      const startDate = new Date(now.getTime() - (timeframeDays * 24 * 60 * 60 * 1000));

      // Filter leads based on timeframe
      const recentLeads = leads.filter(lead => {
        const createdDate = lead.createdAt ? new Date(lead.createdAt) : new Date(lead.lastContact);
        return createdDate >= startDate;
      });

      // Calculate new leads
      const newLeads = recentLeads.length;

      // Calculate total pipeline value (excluding closed-lost)
      const activePipelineLeads = leads.filter(lead => 
        !['closed-won', 'closed-lost'].includes(lead.stage)
      );
      const totalPipelineValue = activePipelineLeads.reduce((sum, lead) => sum + lead.value, 0);

      // Calculate at-risk deals (no contact in 7+ days and high value)
      const atRiskDeals = leads.filter(lead => {
        const lastContactDate = new Date(lead.lastContact);
        const daysSinceContact = Math.floor((now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceContact >= 7 && lead.value >= 25000 && !['closed-won', 'closed-lost'].includes(lead.stage);
      }).length;

      // Calculate closed deals in timeframe
      const closedDeals = leads.filter(lead => {
        const lastContactDate = new Date(lead.lastContact);
        return lead.stage === 'closed-won' && lastContactDate >= startDate;
      }).length;

      // Calculate conversion rate
      const totalLeadsInPeriod = leads.filter(lead => {
        const createdDate = lead.createdAt ? new Date(lead.createdAt) : new Date(lead.lastContact);
        return createdDate >= startDate;
      }).length;
      const conversionRate = totalLeadsInPeriod > 0 ? (closedDeals / totalLeadsInPeriod) * 100 : 0;

      // Calculate average deal size
      const wonDeals = leads.filter(lead => lead.stage === 'closed-won');
      const averageDealSize = wonDeals.length > 0 
        ? wonDeals.reduce((sum, lead) => sum + lead.value, 0) / wonDeals.length 
        : 0;

      // Calculate activities completed (mock data)
      const activitiesCompleted = Math.floor(Math.random() * 50) + 20;

      // Calculate follow-ups due
      const followUpsDue = leads.filter(lead => {
        const lastContactDate = new Date(lead.lastContact);
        const daysSinceContact = Math.floor((now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceContact >= 3 && !['closed-won', 'closed-lost'].includes(lead.stage);
      }).length;

      setMetrics({
        newLeads,
        totalPipelineValue,
        atRiskDeals,
        closedDeals,
        conversionRate,
        averageDealSize,
        activitiesCompleted,
        followUpsDue
      });
    };

    calculateMetrics();
  }, [leads, selectedTimeframe]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'quarter': return 'This Quarter';
      default: return 'This Week';
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue',
    subtitle 
  }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple';
    subtitle?: string;
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      red: 'text-red-600 bg-red-50',
      orange: 'text-orange-600 bg-orange-50',
      purple: 'text-purple-600 bg-purple-50'
    };

    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
            <div className={`p-3 rounded-full ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {trend && trendValue && (
            <div className="mt-4 flex items-center">
              {trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
              {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-600 mr-1" />}
              <span className={`text-sm font-medium ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trendValue}
              </span>
              <span className="text-sm text-gray-600 ml-1">vs last {selectedTimeframe}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Dashboard</h2>
          <p className="text-gray-600">Performance overview for {getTimeframeLabel().toLowerCase()}</p>
        </div>
        <div className="flex gap-2">
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="New Leads"
          value={metrics.newLeads}
          icon={Users}
          trend="up"
          trendValue="+12%"
          color="blue"
        />
        
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(metrics.totalPipelineValue)}
          icon={DollarSign}
          trend="up"
          trendValue="+8%"
          color="green"
        />
        
        <MetricCard
          title="At-Risk Deals"
          value={metrics.atRiskDeals}
          icon={AlertTriangle}
          trend="down"
          trendValue="-3%"
          color="red"
        />
        
        <MetricCard
          title="Closed Deals"
          value={metrics.closedDeals}
          icon={Award}
          trend="up"
          trendValue="+15%"
          color="purple"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Conversion Rate"
          value={formatPercentage(metrics.conversionRate)}
          icon={Target}
          color="green"
          subtitle="Leads to closed deals"
        />
        
        <MetricCard
          title="Avg Deal Size"
          value={formatCurrency(metrics.averageDealSize)}
          icon={BarChart3}
          color="blue"
          subtitle="Per closed deal"
        />
        
        <MetricCard
          title="Activities Done"
          value={metrics.activitiesCompleted}
          icon={Calendar}
          color="orange"
          subtitle="Calls, emails, meetings"
        />
        
        <MetricCard
          title="Follow-ups Due"
          value={metrics.followUpsDue}
          icon={Clock}
          color="red"
          subtitle="Requires attention"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center gap-2" variant="outline">
              <Users className="h-4 w-4" />
              View All Leads
            </Button>
            <Button className="flex items-center gap-2" variant="outline">
              <AlertTriangle className="h-4 w-4" />
              Review At-Risk Deals
            </Button>
            <Button className="flex items-center gap-2" variant="outline">
              <Calendar className="h-4 w-4" />
              Schedule Follow-ups
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OwnerDashboard;