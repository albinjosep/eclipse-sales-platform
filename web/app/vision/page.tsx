import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, CpuChipIcon, ChartBarIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-black text-white mb-8">
              <RocketLaunchIcon className="w-4 h-4 mr-2" />
              Alpha Launch Vision
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6">
              The Future of
              <span className="block text-black">
                Sales Software
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
              We're not just adding AI to existing sales tools. We're rebuilding sales software from the ground up 
              where AI is the primary worker, not a bolted-on assistant.
            </p>
          </div>
        </div>
      </div>

      {/* Core Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-black mb-6">
              AI as the Worker, Not the Assistant
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Traditional sales software is built around human workflows with AI features added later. 
              Eclipse is built from the ground up with AI-native workflows where humans supervise and AI executes.
            </p>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <SparklesIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">Autonomous Deal Execution</h3>
                  <p className="text-gray-600">AI agents that qualify leads, manage follow-ups, and optimize pricing strategies without human intervention.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <CpuChipIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">AI-Native Data Architecture</h3>
                  <p className="text-gray-600">Vector embeddings and graph relationships that enable AI to understand context and make intelligent decisions.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <ChartBarIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-black font-semibold">Conversational Intelligence</h3>
                  <p className="text-gray-600">Natural language interface that replaces forms and dashboards with intelligent conversations.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-black mb-6 text-center">The Eclipse Difference</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">0</div>
                <p className="text-gray-600">Forms to fill out</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-gray-600">AI-driven workflows</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black mb-2">∞</div>
                <p className="text-gray-600">Contextual intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interface Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Revolutionary Split-Screen Interface
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of sales with our AI-native copilot interface that combines 
            natural conversation with real-time contextual insights.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Chat */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-black">AI Sales Copilot</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Natural conversation interface where you can ask questions, request actions, and get AI-generated responses.
            </p>
            <div className="space-y-3">
              <div className="text-sm text-black">"Draft a follow-up email for Johnson Corp"</div>
              <div className="text-sm text-black">"What's the current market trend in SaaS?"</div>
              <div className="text-sm text-black">"Qualify this lead and suggest next steps"</div>
            </div>
          </div>
          
          {/* Right Panel - Context */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <h3 className="text-xl font-semibold text-black">Live Context & Insights</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Real-time data, market trends, and sales analytics that update dynamically as you work.
            </p>
            <div className="space-y-3">
              <div className="text-sm text-black">Live market data and trends</div>
              <div className="text-sm text-black">Sales KPIs and performance metrics</div>
              <div className="text-sm text-black">Suggested actions and reminders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Alpha Launch Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            Why Join the Alpha Launch?
          </h2>
          <p className="text-xl text-gray-600">
            Be among the first to experience the future of AI-native enterprise software.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <RocketLaunchIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Early Access</h3>
            <p className="text-gray-600">Get exclusive access to cutting-edge AI-native features before public release.</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Shape the Future</h3>
            <p className="text-gray-600">Your feedback directly influences the development of AI-native sales workflows.</p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <CpuChipIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Competitive Advantage</h3>
            <p className="text-gray-600">Stay ahead of the curve with autonomous AI-powered sales capabilities.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">
          Ready to Experience the Future?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Join the Alpha launch and be part of the AI-native sales revolution.
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

