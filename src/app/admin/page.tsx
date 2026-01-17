'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Welcome, {session?.user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button
            onClick={() => router.push('/admin/manage')}
            className="bg-blue-600 text-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h2 className="text-xl font-semibold mb-2">
              Manage Businesses
            </h2>
            <p className="text-blue-100">
              Full admin panel with create, edit, and preview
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/pages')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Pages
            </h2>
            <p className="text-gray-600">
              Quick view and toggle pages
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/settings')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Settings
            </h2>
            <p className="text-gray-600">
              Configure your application
            </p>
          </button>

          <button
            onClick={() => router.push('/admin/users')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-left"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Users
            </h2>
            <p className="text-gray-600">
              Manage user access
            </p>
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={() => router.push('/api/auth/signout')}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
