'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, CheckCircle, Calendar, Database, Bot } from 'lucide-react';

const LoginWireframe = () => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  const onboardingSteps = [
    { id: 1, title: 'Connect Email', icon: Mail, description: 'Link your email for AI insights' },
    { id: 2, title: 'Connect CRM', icon: Database, description: 'Sync your existing CRM data' },
    { id: 3, title: 'Connect Calendar', icon: Calendar, description: 'Schedule meetings seamlessly' },
    { id: 4, title: 'AI Introduction', icon: Bot, description: 'Meet your AI sales copilot' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Login Area */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              AI Sales Copilot
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your intelligent sales assistant
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white py-8 px-6 shadow-lg rounded-lg border border-gray-200">
            <form className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your email"
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your password"
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">New to AI Sales Copilot?</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create new account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Sidebar (First-time users only) */}
      {isFirstTime && (
        <div className="w-80 bg-blue-900 text-white p-6 flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Welcome to AI Sales Copilot!</h3>
            <p className="text-blue-200 text-sm">
              Let's get you set up in just 4 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex-1">
            <div className="space-y-6">
              {onboardingSteps.map((step: any, index: any) => {
                const Icon = step.icon;
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isUpcoming = step.id > currentStep;

                return (
                  <div key={step.id} className="flex items-start space-x-4">
                    {/* Step Icon */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' :
                      isCurrent ? 'bg-blue-500 ring-4 ring-blue-300' :
                      'bg-blue-700'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Icon className={`w-5 h-5 ${
                          isCurrent ? 'text-white' : 'text-blue-300'
                        }`} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium ${
                        isCompleted ? 'text-green-300' :
                        isCurrent ? 'text-white' :
                        'text-blue-300'
                      }`}>
                        Step {step.id}: {step.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        isCompleted ? 'text-green-200' :
                        isCurrent ? 'text-blue-100' :
                        'text-blue-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Connection Line */}
                    {index < onboardingSteps.length - 1 && (
                      <div className="absolute left-11 mt-10 w-0.5 h-6 bg-blue-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 p-4 bg-blue-800 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Ready to get started?</h4>
            <p className="text-xs text-blue-200 mb-3">
              Complete setup to unlock AI-powered sales insights
            </p>
            <button className="w-full bg-white text-blue-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
              Start Setup
            </button>
          </div>

          {/* Skip Option */}
          <div className="mt-4 text-center">
            <button 
              onClick={() => setIsFirstTime(false)}
              className="text-xs text-blue-300 hover:text-white underline"
            >
              Skip setup for now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginWireframe;