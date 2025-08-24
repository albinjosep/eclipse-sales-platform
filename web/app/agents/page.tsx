'use client';

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, UserGroupIcon, EnvelopeIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import ProtectedRoute from '../../components/ProtectedRoute';

function AgentsContent() {
  const agents = [
    {
      id: 'lead-qualifier',
      name: 'Lead Qualification Agent',
      description: 'Automatically analyzes and scores leads based on company data, engagement patterns, and market fit.',
      icon: UserGroupIcon,
      capabilities: ['Company analysis', 'Engagement scoring', 'Market fit assessment', 'Priority ranking'],
      status: 'active',
      performance: '94% accuracy'
    },
    {
      id: 'follow-up',
      name: 'Follow-up Management Agent',
      description: 'Intelligently manages follow-up sequences, timing, and personalized communication.',
      icon: EnvelopeIcon,
      capabilities: ['Timing optimization', 'Personalized messaging', 'Sequence management', 'Response tracking'],
      status: 'active',
      performance: '87% response rate'
    },
    {
      id: 'deal-strategy',
      name: 'Deal Strategy Agent',
      description: 'Develops winning strategies by analyzing deal context, competitor positioning, and customer needs.',
      icon: ChartBarIcon,
      capabilities: ['Strategy development', 'Competitor analysis', 'Risk assessment', 'Success probability'],
      status: 'active',
      performance: '+23% win rate'
    },
    {
      id: 'pricing',
      name: 'Pricing Optimization Agent',
      description: 'Optimizes pricing strategies based on market data, customer value, and competitive landscape.',
      icon: CurrencyDollarIcon,
      capabilities: ['Market analysis', 'Value-based pricing', 'Competitive positioning', 'ROI optimization'],
      status: 'beta',
      performance: '+18% deal value'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white mb-8">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Alpha Launch - AI Agents
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6">
              AI Agents
              <span className="block text-black">
                That Work for You
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Meet the specialized AI agents that power Eclipse. Each agent is designed to execute 
              specific sales workflows autonomously, working together to close deals and optimize performance.
            </p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-black transition-colors shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                    <agent.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black">{agent.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        agent.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm text-gray-600 capitalize">{agent.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Performance</div>
                  <div className="text-lg font-bold text-green-400">{agent.performance}</div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{agent.description}</p>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Capabilities:</h4>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded">
                      {capability}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
                  Test Agent
                </button>
                <div className="text-xs text-gray-600">
                  Last updated: 2 hours ago
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            How AI Agents Work Together
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Our AI agents collaborate seamlessly to create autonomous sales workflows 
            that require minimal human supervision.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Input & Context</h3>
            <p className="text-gray-700">Agents receive natural language requests and access real-time context from the data layer.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Autonomous Execution</h3>
            <p className="text-gray-700">AI agents execute complex workflows, make decisions, and take actions based on their specialized knowledge.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Results & Learning</h3>
            <p className="text-gray-700">Agents deliver results, learn from outcomes, and continuously improve their performance.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">
          Experience AI Agents in Action
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          See how our AI agents work together to revolutionize your sales process.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/demo" 
            className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
          >
            Try Alpha Demo
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
          <Link 
            href="/" 
            className="inline-flex items-center px-8 py-4 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AgentsPage() {
  return (
    <ProtectedRoute>
      <AgentsContent />
    </ProtectedRoute>
  );
}

