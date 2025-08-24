'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth.tsx';
import ProtectedRoute from '../../components/ProtectedRoute';
import Pipeline from '../../components/Pipeline';
import OwnerDashboard from '../../components/OwnerDashboard';


function DashboardContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const [leads, setLeads] = useState([]);
  const { user } = useAuth();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Active Leads</h3>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">24</span>
                <span className="text-sm text-green-600">+12% ↑</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">12 new leads this week</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Conversion Rate</h3>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">18.5%</span>
                <span className="text-sm text-green-600">+3.2% ↑</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Industry avg: 12.3%</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Revenue</h3>
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900">$42.5k</span>
                <span className="text-sm text-red-600">-2.4% ↓</span>
              </div>
              <p className="text-gray-600 text-sm mt-2">Monthly projection: $58k</p>
            </div>
            
            <div className="md:col-span-3 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: 'Lead qualified', target: 'Acme Corp', time: '2 hours ago', status: 'success' },
                  { action: 'Meeting scheduled', target: 'TechStart Inc', time: '5 hours ago', status: 'info' },
                  { action: 'Follow-up email sent', target: 'Global Systems', time: '1 day ago', status: 'info' },
                  { action: 'Deal closed', target: 'Innovate Solutions', time: '2 days ago', status: 'success' },
                  { action: 'Lead disqualified', target: 'Small Business LLC', time: '3 days ago', status: 'error' },
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 mt-2 rounded-full ${
                      item.status === 'success' ? 'bg-green-500' : 
                      item.status === 'error' ? 'bg-red-500' : 'bg-blue-600'
                    }`}></div>
                    <div>
                      <p className="text-gray-900 font-medium">{item.action}</p>
                      <p className="text-gray-600 text-sm">{item.target} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'leads':
        return (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Active Leads</h3>
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-medium rounded-md hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 shadow-md">
                  Add New Lead
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { name: 'John Smith', company: 'Acme Corp', status: 'Qualified', value: '$12,000', lastContact: '2 hours ago' },
                      { name: 'Sarah Johnson', company: 'TechStart Inc', status: 'Meeting Scheduled', value: '$8,500', lastContact: '1 day ago' },
                      { name: 'Michael Brown', company: 'Global Systems', status: 'Follow-up', value: '$15,000', lastContact: '3 days ago' },
                      { name: 'Emily Davis', company: 'Innovate Solutions', status: 'Proposal', value: '$22,000', lastContact: '1 week ago' },
                      { name: 'Robert Wilson', company: 'Enterprise Co', status: 'Negotiation', value: '$45,000', lastContact: '2 days ago' },
                    ].map((lead, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.company}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'Qualified' ? 'bg-green-100 text-green-800' :
                            lead.status === 'Meeting Scheduled' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'Follow-up' ? 'bg-yellow-100 text-yellow-800' :
                            lead.status === 'Proposal' ? 'bg-purple-100 text-purple-800' :
                            'bg-pink-100 text-pink-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.lastContact}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <button className="text-cyan-600 hover:text-cyan-700 transition-colors mr-3">View</button>
                          <button className="text-cyan-600 hover:text-cyan-700 transition-colors">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Sales Analytics</h3>
              <div className="h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50 mb-6">
                <p className="text-gray-600">Sales performance chart will be displayed here</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Conversion Funnel</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Leads</span>
                      <span className="text-sm text-gray-900">120</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Qualified</span>
                      <span className="text-sm text-gray-900">68</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full" style={{ width: '56%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Proposals</span>
                      <span className="text-sm text-gray-900">42</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Closed</span>
                      <span className="text-sm text-gray-900">22</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Top Performing Products</h4>
                  <div className="space-y-3">
                    {[
                      { product: 'Enterprise Suite', revenue: '$125,000', growth: '+18%' },
                      { product: 'Business Analytics', revenue: '$86,500', growth: '+12%' },
                      { product: 'Cloud Services', revenue: '$65,200', growth: '+8%' },
                      { product: 'Security Package', revenue: '$42,800', growth: '+15%' },
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-gray-900">{item.product}</span>
                        <div className="text-right">
                          <span className="text-sm text-gray-900 block">{item.revenue}</span>
                          <span className="text-xs text-green-600 block">{item.growth}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pipeline':
          return <Pipeline />;
        case 'metrics':
          return <OwnerDashboard leads={leads} />;

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.email?.split('@')[0] || 'User'}</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200">
              Export Data
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-sm font-medium rounded-md hover:from-cyan-600 hover:to-teal-600 transition-all duration-200 shadow-md">
              New Campaign
            </button>
          </div>
        </div>
        
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'pipeline', name: 'Pipeline' },
              { id: 'leads', name: 'Leads' },
              { id: 'analytics', name: 'Analytics' },
              { id: 'metrics', name: 'Metrics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                } transition-colors duration-200`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {renderTabContent()}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}