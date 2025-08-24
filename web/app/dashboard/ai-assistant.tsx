'use client';

import { useState } from 'react';

export default function AiAssistant() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock AI responses for demonstration
  const mockResponses = [
    "Based on your sales data, I recommend focusing on Enterprise Suite upsells this quarter.",
    "Your lead conversion rate is 18.5%, which is 6.2% above industry average. Great work!",
    "I've analyzed your pipeline and identified 5 high-value leads that need immediate follow-up.",
    "Your sales cycle has shortened by 12% compared to last quarter. Continue optimizing your qualification process.",
    "The data suggests scheduling demos earlier in the sales process could improve conversion rates by 8-10%."
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Get random response from mock data
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      setResponse(randomResponse);
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">AI Sales Assistant</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about sales data, leads, or get recommendations..."
            className="flex-grow px-4 py-2 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-600"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-r-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Ask</span>
            )}
          </button>
        </div>
      </form>
      
      {response && (
        <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
          <div className="flex items-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-3 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white">{response}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Suggested questions</h4>
        <div className="flex flex-wrap gap-2">
          {[
            "What leads should I focus on today?",
            "Analyze my conversion rates",
            "Recommend sales strategies",
            "Forecast this quarter's revenue",
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion);
                // Auto-submit after a short delay
                setTimeout(() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
                    setResponse(randomResponse);
                    setIsLoading(false);
                  }, 1500);
                }, 100);
              }}
              className="px-3 py-1.5 bg-gray-700 text-sm text-gray-300 rounded-full hover:bg-gray-600 transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}