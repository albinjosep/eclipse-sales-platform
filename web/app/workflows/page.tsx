'use client';

import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, PlayIcon, ChartBarIcon, ClockIcon, CheckCircleIcon, BoltIcon, RocketLaunchIcon, CpuChipIcon } from '@heroicons/react/24/outline'
import ProtectedRoute from '../../components/ProtectedRoute';

function WorkflowsContent() {
  const workflows = [
    {
      id: 'new-lead',
      name: 'New Lead Processing',
      description: 'Automatically processes and qualifies new leads, assigns scores, and initiates follow-up sequences.',
      icon: RocketLaunchIcon,
      steps: ['Lead ingestion', 'Data enrichment', 'Qualification scoring', 'Follow-up initiation'],
      status: 'active',
      avgExecutionTime: '2.3 min',
      successRate: '96%',
      color: 'from-cyan-500 to-teal-500'
    },
    {
      id: 'deal-progression',
      name: 'Deal Progression',
      description: 'Intelligently manages deal progression through stages with automated actions and risk assessment.',
      icon: ChartBarIcon,
      steps: ['Stage analysis', 'Risk assessment', 'Action planning', 'Progress tracking'],
      status: 'active',
      avgExecutionTime: '5.1 min',
      successRate: '89%',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'follow-up-sequence',
      name: 'Follow-up Sequence',
      description: 'Manages complex follow-up sequences with optimal timing and personalized messaging.',
      icon: ClockIcon,
      steps: ['Timing optimization', 'Message personalization', 'Response tracking', 'Sequence adjustment'],
      status: 'active',
      avgExecutionTime: '1.8 min',
      successRate: '92%',
      color: 'from-cyan-400 to-teal-400'
    },
    {
      id: 'pricing-optimization',
      name: 'Pricing Optimization',
      description: 'Continuously optimizes pricing strategies based on market data and customer behavior.',
      icon: CpuChipIcon,
      steps: ['Market analysis', 'Customer segmentation', 'Pricing strategy', 'ROI calculation'],
      status: 'beta',
      avgExecutionTime: '8.5 min',
      successRate: '78%',
      color: 'from-teal-400 to-cyan-400'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-teal-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-r from-cyan-600 to-teal-600 text-white mb-8 shadow-lg">
              <BoltIcon className="w-5 h-5 mr-2" />
              Public Launch Ready - AI Workflows
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Intelligent
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600">
                Sales Automation
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your sales process with AI workflows that think, adapt, and execute autonomously. 
              Experience the future of sales automation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Start Free Trial
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200">
                Watch Demo
                <PlayIcon className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Workflows Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful AI Workflows
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our suite of intelligent workflows designed to automate every aspect of your sales process.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${workflow.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <workflow.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{workflow.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        workflow.status === 'active' ? 'bg-green-500' : 'bg-orange-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-600 capitalize">{workflow.status}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-500">Success Rate</div>
                  <div className="text-2xl font-bold text-gray-900">{workflow.successRate}</div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">{workflow.description}</p>
              
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Workflow Steps:</h4>
                <div className="space-y-3">
                  {workflow.steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-6 h-6 bg-gradient-to-r ${workflow.color} rounded-full flex items-center justify-center`}>
                        <span className="text-xs font-bold text-white">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Avg. Execution:</span> {workflow.avgExecutionTime}
                </div>
                <button className={`px-6 py-3 bg-gradient-to-r ${workflow.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 transform hover:scale-105`}>
                  Launch Workflow
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Execution Example */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              See AI in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Watch how our intelligent workflows process leads in real-time with complete autonomy.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-10">
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">New Lead Processing Workflow</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircleIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-lg">Lead Ingestion</div>
                      <div className="text-gray-600">AI receives lead data from multiple sources</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-lg">Data Enrichment</div>
                      <div className="text-gray-600">AI enriches lead data with market insights</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-lg">Qualification Scoring</div>
                      <div className="text-gray-600">AI scores lead from 1-10 based on multiple factors</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <div className="text-gray-900 font-bold text-lg">Follow-up Initiation</div>
                      <div className="text-gray-600">AI starts personalized follow-up sequence</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-6">Real-time Execution Log</h4>
                <div className="space-y-4 text-sm font-mono">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400">[10:23:15] Lead received from website form</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    <span className="text-blue-400">[10:23:18] Enriching company data...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    <span className="text-purple-400">[10:23:22] Qualification score: 8.7/10</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                    <span className="text-orange-400">[10:23:25] Follow-up sequence initiated</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-green-400">[10:23:26] ✓ Workflow completed successfully</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose AI Workflows?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your sales process from manual to autonomous with intelligent automation.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ClockIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Execution</h3>
              <p className="text-gray-600 leading-relaxed">Workflows run continuously, ensuring no lead or opportunity is missed, even outside business hours.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Consistent Performance</h3>
              <p className="text-gray-600 leading-relaxed">AI eliminates human error and maintains consistent execution quality across all processes.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Continuous Learning</h3>
              <p className="text-gray-600 leading-relaxed">Workflows improve over time based on outcomes and feedback, becoming more effective daily.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Automate Your Sales?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Experience the power of autonomous AI workflows. Start your free trial today and see immediate results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/demo" 
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Free Trial
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/" 
              className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WorkflowsPage() {
  return (
    <ProtectedRoute>
      <WorkflowsContent />
    </ProtectedRoute>
  );
}

