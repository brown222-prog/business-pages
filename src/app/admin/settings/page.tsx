'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Key, Database, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [showEnvVars, setShowEnvVars] = useState(false);

  const envVars = [
    { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not set', public: true },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'Not set', public: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your application settings</p>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Account Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Password
              </label>
              <p className="text-sm text-gray-600 mb-3">
                To change your password, update the ADMIN_PASSWORD in your .env.local file
              </p>
              <code className="block bg-gray-100 p-3 rounded text-sm text-gray-800">
                ADMIN_PASSWORD=YourNewPassword
              </code>
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Database Configuration */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Database className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Database Configuration</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Your application is connected to Supabase. Database configuration is managed through environment variables.
            </p>

            <button
              onClick={() => setShowEnvVars(!showEnvVars)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showEnvVars ? 'Hide' : 'Show'} Environment Variables
            </button>

            {showEnvVars && (
              <div className="bg-gray-50 p-4 rounded-lg">
                {envVars.map((env) => (
                  <div key={env.key} className="mb-3 last:mb-0">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {env.key}
                    </label>
                    <code className="block bg-white p-2 rounded text-xs text-gray-800 break-all">
                      {env.value.substring(0, 50)}...
                    </code>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Key className="text-blue-600 mr-3" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">NextAuth Configuration</h2>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              NextAuth is configured with credentials provider for admin authentication.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-xs text-gray-700 mb-2">
                <strong>Session Strategy:</strong> JWT
              </p>
              <p className="text-xs text-gray-700 mb-2">
                <strong>Session Max Age:</strong> 24 hours
              </p>
              <p className="text-xs text-gray-700">
                <strong>Login Page:</strong> /admin/login
              </p>
            </div>
          </div>
        </div>

        {/* Application Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Application Information</h3>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>Version:</strong> 1.0.0</p>
            <p><strong>Framework:</strong> Next.js 16.1.2</p>
            <p><strong>Database:</strong> Supabase (PostgreSQL)</p>
            <p><strong>Authentication:</strong> NextAuth v4</p>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push('/admin')}
            className="text-gray-600 hover:text-gray-800"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
