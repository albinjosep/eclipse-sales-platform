import Link from 'next/link'
import { ArrowRightIcon, SparklesIcon, ChartBarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Alpha Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500 to-teal-600 text-white mb-8">
              <SparklesIcon className="w-4 h-4 mr-2" />
              Public Pre-Launch
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">Eclipse</span>
              <span className="block text-gray-600">
                AI-Native Enterprise Software
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              The next generation of enterprise software where AI is the worker, not the assistant.
              Just as cloud computing revolutionized enterprise software 25 years ago, AI is the new paradigm shift.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/demo" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all duration-200 transform hover:scale-105"
              >
                Try Alpha Demo
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Link>
              <Link 
                href="/vision" 
                className="inline-flex items-center px-8 py-4 border-2 border-cyan-500 text-cyan-600 font-semibold rounded-lg hover:bg-cyan-500 hover:text-white transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main AI Enterprise Platform Interface - Full Width Focus */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">
            The AI-Native Advantage
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Just as Salesforce and ServiceNow built cloud-native platforms that revolutionized CRM and ITSM, Eclipse is building AI-native enterprise software that will define the next generation of business tools.
          </p>
        </div>
        
        {/* AI-Native Enterprise Platform Demo */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
            <h3 className="text-2xl font-semibold text-black">AI-Native Enterprise Platform</h3>
          </div>
          
          <p className="text-gray-700 text-center mb-8 max-w-2xl mx-auto">
            Experience the future where AI is the worker, not the assistant. Just as Cursor revolutionized coding, Eclipse is transforming enterprise software.
          </p>
          
          {/* Example Conversation Preview */}
          <div className="space-y-4 mb-8 max-w-2xl mx-auto">
            <div className="flex justify-end">
              <div className="bg-black text-white px-4 py-3 rounded-lg max-w-xs">
                "Analyze our Q2 pipeline and identify at-risk deals"
              </div>
            </div>
            <div className="flex justify-start">
              <div className="bg-gray-200 text-black px-4 py-3 rounded-lg max-w-xs">
                "I've identified 3 at-risk deals worth $420K. Initiating autonomous recovery sequences..."
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-black text-white px-4 py-3 rounded-lg max-w-xs">
                "How does this compare to our cloud-native competitors?"
              </div>
            </div>
          </div>
          
          {/* Interactive Input Area */}
          <div className="flex items-center space-x-3 max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Experience the AI-native revolution..."
              className="flex-1 bg-white text-black px-6 py-4 rounded-lg border border-gray-300 focus:outline-none focus:border-black text-lg"
            />
            <button className="bg-black text-white px-6 py-4 rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              Join the AI-native revolution that will redefine enterprise software
            </p>
          </div>
        </div>
      </div>

      {/* How History Rhymes - Cloud to AI Transition */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            History Doesn't Repeat, But It Rhymes
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            The transition from on-premise to cloud-native created $200B+ companies. Now, the shift from cloud-native to AI-native presents the same opportunity.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">25 Years Ago: Cloud Revolution</h3>
            <p className="text-gray-600">Salesforce, ServiceNow, and others built cloud-native platforms that disrupted on-premise incumbents.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Today: AI Revolution</h3>
            <p className="text-gray-600">AI-native platforms like Eclipse are being built from the ground up to redefine enterprise software.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">The Opportunity</h3>
            <p className="text-gray-600">Today's cloud-native incumbents will struggle to adapt to AI, creating space for new market leaders to emerge.</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black mb-4">
            The Once-in-a-Generation Opportunity
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Just as cloud computing created a $200B+ market opportunity for companies like Salesforce and ServiceNow, AI-native enterprise software represents the next major paradigm shift.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">AI as the Worker</h3>
            <p className="text-gray-600">Not just an assistant feature, but the core engine that drives business processes and decision-making.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">Incumbent Disruption</h3>
            <p className="text-gray-600">Today's enterprise software giants will struggle to adapt, creating the perfect opportunity for AI-native startups to win.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-black mb-2">10x Better Products</h3>
            <p className="text-gray-600">AI-native architecture enables fundamentally better products that help employees work faster and more accurately than ever before.</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        <h2 className="text-3xl font-bold text-black mb-4">
          Ready to Join the AI-Native Revolution?
        </h2>
        <p className="text-xl text-gray-700 mb-8">
          History is rhyming. Just as SaaS disrupted on-premise software 25 years ago, AI-native platforms will redefine enterprise software today. Be part of this transformation.
        </p>
        <Link 
          href="/demo" 
          className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
        >
          Experience the Future
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  )
}

