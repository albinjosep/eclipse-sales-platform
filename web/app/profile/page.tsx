'use client';

import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut();
    setIsLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
                <h1 className="text-2xl font-bold text-black">User Profile</h1>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="px-4 py-2 bg-black hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  {isLoading ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-black">Account Information</h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-black font-medium mt-1">{user?.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600">User Name</p>
                      <p className="text-black font-medium mt-1 truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-black">Email Verification</h2>
                  <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div>
                      <p className="text-black font-medium">
                        {user?.email ? 'Email provided' : 'No email provided'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {user?.email 
                          ? 'Email verification status managed by authentication provider' 
                          : 'Please add an email to your account'}
                      </p>
                    </div>
                    <div>
                      {user?.email ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900/50 text-green-400">
                          <span className="h-2 w-2 rounded-full bg-green-400 mr-1"></span>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/50 text-yellow-400">
                          <span className="h-2 w-2 rounded-full bg-yellow-400 mr-1"></span>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-lg font-medium text-black">Account Settings</h2>
                  <div className="mt-4 space-y-4">
                    <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black text-sm font-medium rounded-lg transition-colors duration-200 text-left border border-gray-200">
                      Change Password
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 text-black text-sm font-medium rounded-lg transition-colors duration-200 text-left border border-gray-200">
                      Update Profile Information
                    </button>
                    <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors duration-200 text-left border border-red-200">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}