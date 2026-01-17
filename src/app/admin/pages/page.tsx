'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Plus, Edit, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Business {
  id: string;
  slug: string;
  name: string;
  phone: string;
  active: boolean;
  created_at: string;
}

export default function AdminPagesPage() {
  const router = useRouter();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  async function fetchBusinesses() {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, slug, name, phone, active, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBusinesses(data || []);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      fetchBusinesses();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to update status');
    }
  }

  async function deleteBusiness(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchBusinesses();
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Business Pages</h1>
            <p className="text-gray-600 mt-1">Manage your business pages</p>
          </div>
          <button
            onClick={() => router.push('/admin/pages/new')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            New Page
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {businesses.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">No business pages yet</p>
              <button
                onClick={() => router.push('/admin/pages/new')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Page
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Slug</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-800">{business.name}</td>
                    <td className="p-4 text-gray-600">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                        /{business.slug}
                      </code>
                    </td>
                    <td className="p-4 text-gray-600">{business.phone}</td>
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          business.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {business.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`/${business.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="View page"
                        >
                          <ExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => toggleActive(business.id, business.active)}
                          className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                          title={business.active ? 'Deactivate' : 'Activate'}
                        >
                          {business.active ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => router.push(`/admin/pages/${business.id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteBusiness(business.id, business.name)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
