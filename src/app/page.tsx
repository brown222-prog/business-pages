'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Plus, Edit2, Save, X, Lock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CustomSection {
  title: string;
  content: string;
}

interface Testimonial {
  rating: number;
  text: string;
  author: string;
}

interface Business {
  id: string;
  slug: string;
  name: string;
  phone: string;
  hours: string;
  services: string;
  address: string;
  mapEmbedUrl: string;
  googleMapsUrl: string;
  testimonials: Testimonial[];
  photos: string[];
  customSections: CustomSection[];
  primaryColor: string;
  active: boolean;
}

interface FormData {
  name: string;
  phone: string;
  hours: string;
  services: string;
  address: string;
  mapEmbedUrl: string;
  googleMapsUrl: string;
  testimonials: Testimonial[];
  photos: string[];
  customSections: CustomSection[];
  primaryColor: string;
}

function App() {
  const [view, setView] = useState<'admin' | 'preview'>('admin');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    hours: '',
    services: '',
    address: '',
    mapEmbedUrl: '',
    googleMapsUrl: '',
    testimonials: [],
    photos: [],
    customSections: [],
    primaryColor: '#2563eb'
  });

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadBusinesses();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_PASSWORD = 'admin123';
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      loadBusinesses();
      setPasswordError('');
    } else {
      setPasswordError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          photos(file_url, display_order),
          testimonials(rating, text, author, display_order),
          custom_sections(title, content, display_order)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedBusinesses: Business[] = (data || []).map((b: any) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        phone: b.phone,
        hours: b.hours,
        services: b.services,
        address: b.address,
        mapEmbedUrl: b.map_embed_url || '',
        googleMapsUrl: b.google_maps_url || '',
        primaryColor: b.primary_color || '#2563eb',
        active: b.active,
        photos: (b.photos || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((p: any) => p.file_url),
        testimonials: (b.testimonials || [])
          .sort((a: any, b: any) => a.display_order - b.display_order),
        customSections: (b.custom_sections || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
      }));

      setBusinesses(transformedBusinesses);
    } catch (error) {
      console.error('Error loading businesses:', error);
      alert('Failed to load businesses. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditMode(true);
    setSelectedBusiness(null);
    setFormData({
      name: '',
      phone: '',
      hours: '',
      services: '',
      address: '',
      mapEmbedUrl: '',
      googleMapsUrl: '',
      testimonials: [],
      photos: [],
      customSections: [],
      primaryColor: '#2563eb'
    });
  };

  const handleEdit = (business: Business) => {
    setEditMode(true);
    setSelectedBusiness(business);
    setFormData({
      name: business.name,
      phone: business.phone,
      hours: business.hours,
      services: business.services,
      address: business.address,
      mapEmbedUrl: business.mapEmbedUrl,
      googleMapsUrl: business.googleMapsUrl,
      testimonials: business.testimonials,
      photos: business.photos,
      customSections: business.customSections,
      primaryColor: business.primaryColor
    });
  };

  const handleSave = async () => {
    try {
      const slug = selectedBusiness?.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const businessData = {
        slug,
        name: formData.name,
        phone: formData.phone,
        hours: formData.hours,
        services: formData.services,
        address: formData.address,
        map_embed_url: formData.mapEmbedUrl,
        google_maps_url: formData.googleMapsUrl,
        primary_color: formData.primaryColor,
        active: true
      };

      let businessId: string;

      if (selectedBusiness) {
        const { error } = await supabase
          .from('businesses')
          .update(businessData)
          .eq('id', selectedBusiness.id);

        if (error) throw error;
        businessId = selectedBusiness.id;

        await supabase.from('photos').delete().eq('business_id', businessId);
        await supabase.from('testimonials').delete().eq('business_id', businessId);
        await supabase.from('custom_sections').delete().eq('business_id', businessId);
      } else {
        const { data, error } = await supabase
          .from('businesses')
          .insert(businessData)
          .select()
          .single();

        if (error) throw error;
        businessId = data.id;
      }

      if (formData.photos.length > 0) {
        const photosData = formData.photos.map((url, idx) => ({
          business_id: businessId,
          file_url: url,
          display_order: idx
        }));
        await supabase.from('photos').insert(photosData);
      }

      if (formData.testimonials.length > 0) {
        const testimonialsData = formData.testimonials.map((t, idx) => ({
          business_id: businessId,
          rating: t.rating,
          text: t.text,
          author: t.author,
          display_order: idx
        }));
        await supabase.from('testimonials').insert(testimonialsData);
      }

      if (formData.customSections.length > 0) {
        const sectionsData = formData.customSections.map((s, idx) => ({
          business_id: businessId,
          title: s.title,
          content: s.content,
          display_order: idx
        }));
        await supabase.from('custom_sections').insert(sectionsData);
      }

      await loadBusinesses();
      
      setEditMode(false);
      setSelectedBusiness(null);
      alert('Business saved successfully!');
    } catch (error) {
      console.error('Error saving business:', error);
      alert('Failed to save business. Check console for details.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this business? This cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadBusinesses();
      alert('Business deleted successfully!');
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business. Check console for details.');
    }
  };

  const handlePreview = (business: Business) => {
    setSelectedBusiness(business);
    setView('preview');
  };

  const addCustomSection = () => {
    setFormData({
      ...formData,
      customSections: [...formData.customSections, { title: '', content: '' }]
    });
  };

  const removeCustomSection = (index: number) => {
    setFormData({
      ...formData,
      customSections: formData.customSections.filter((_, i) => i !== index)
    });
  };

  const updateCustomSection = (index: number, field: keyof CustomSection, value: string) => {
    const updated = [...formData.customSections];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, customSections: updated });
  };

  const BusinessPage = ({ business }: { business: Business }) => (
    <div className="min-h-screen bg-white">
      <div className="text-white p-6" style={{ background: `linear-gradient(to right, ${business.primaryColor || '#2563eb'}, ${business.primaryColor || '#2563eb'}dd)` }}>
        <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
        <a 
          href={`tel:${business.phone}`}
          className="block w-full bg-white text-center py-4 px-6 rounded-lg text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
          style={{ color: business.primaryColor || '#2563eb' }}
        >
          <Phone className="inline mr-2" size={24} />
          CALL NOW: {business.phone}
        </a>
      </div>

      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Services</h2>
        <p className="text-gray-600 leading-relaxed">{business.services}</p>
      </div>

      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-start">
          <Clock className="flex-shrink-0 mr-3 mt-1" style={{ color: business.primaryColor || '#2563eb' }} size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1 text-gray-800">Hours</h3>
            <p className="text-gray-600">{business.hours}</p>
          </div>
        </div>
      </div>

      {business.customSections && business.customSections.length > 0 && (
        business.customSections.map((section, idx) => (
          <div key={idx} className={`p-6 border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <h3 className="font-bold text-lg mb-3 text-gray-800">{section.title}</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
          </div>
        ))
      )}

      <div className="p-6 border-b">
        <div className="flex items-start mb-4">
          <MapPin className="flex-shrink-0 mr-3 mt-1" style={{ color: business.primaryColor || '#2563eb' }} size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1 text-gray-800">Service Area</h3>
            <p className="text-gray-600">{business.address}</p>
          </div>
        </div>
        {business.mapEmbedUrl && (
          <iframe 
            src={business.mapEmbedUrl}
            className="w-full h-64 rounded-lg border-0"
            loading="lazy"
          />
        )}
      </div>

      {business.photos.length > 0 && (
        <div className="p-6 border-b">
          <h3 className="font-bold text-lg mb-4 text-gray-800">Our Work</h3>
          <div className="grid grid-cols-2 gap-4">
            {business.photos.map((photo, idx) => (
              <img 
                key={idx}
                src={photo}
                alt={`Work ${idx + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {business.testimonials && business.testimonials.length > 0 && (
        <div className="p-6 bg-gray-50">
          <h3 className="font-bold text-lg mb-4 text-gray-800">What Our Customers Say</h3>
          <div className="space-y-4">
            {business.testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400 mr-2">
                    {'★★★★★'.slice(0, testimonial.rating)}
                  </div>
                  <span className="text-sm text-gray-600">{testimonial.rating}/5</span>
                </div>
                <p className="text-gray-700 mb-2">{testimonial.text}</p>
                <p className="text-sm text-gray-500">— {testimonial.author}</p>
              </div>
            ))}
          </div>
          <a 
            href={business.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 hover:underline text-sm font-medium"
            style={{ color: business.primaryColor || '#2563eb' }}
          >
            See all reviews on Google Maps →
          </a>
        </div>
      )}

      <div className="bg-gray-800 text-white p-6 text-center">
        <p className="text-sm opacity-75">© {new Date().getFullYear()} {business.name}</p>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Lock className="text-blue-600" size={40} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">Admin Login</h1>
          <p className="text-center text-gray-600 mb-8">Enter password to access admin panel</p>
          
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2 text-gray-900">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter password"
                autoFocus
              />
              {passwordError && (
                <p className="text-red-600 text-sm mt-2">{passwordError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Default password:</strong> admin123
              <br />
              Change this in the code before deploying!
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700"
                >
                  <Plus size={20} className="mr-2" />
                  New Business
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading businesses...</p>
              </div>
            ) : editMode ? (
              <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">
                    {selectedBusiness ? 'Edit Business' : 'Create Business'}
                  </h2>
                  <button
                    onClick={() => setEditMode(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Brand Color</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={formData.primaryColor || '#2563eb'}
                        onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                        className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">{formData.primaryColor || '#2563eb'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Business Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      placeholder="Johnson's Plumbing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Hours</label>
                    <input
                      type="text"
                      value={formData.hours}
                      onChange={(e) => setFormData({...formData, hours: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      placeholder="Mon-Fri: 7am-6pm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Services</label>
                    <textarea
                      value={formData.services}
                      onChange={(e) => setFormData({...formData, services: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      rows={3}
                      placeholder="Emergency repairs, Water heaters, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      placeholder="123 Main St, Yourtown, USA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Google Maps Embed URL</label>
                    <input
                      type="text"
                      value={formData.mapEmbedUrl}
                      onChange={(e) => setFormData({...formData, mapEmbedUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      placeholder="https://www.google.com/maps/embed?pb=..."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Get from Google Maps → Share → Embed a map
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Google Maps Search URL</label>
                    <input
                      type="text"
                      value={formData.googleMapsUrl}
                      onChange={(e) => setFormData({...formData, googleMapsUrl: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      placeholder="https://www.google.com/maps/search/..."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Link to Google Maps reviews
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-900">Photo URLs (one per line)</label>
                    <textarea
                      value={formData.photos.join('\n')}
                      onChange={(e) => setFormData({...formData, photos: e.target.value.split('\n').filter(Boolean)})}
                      className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                      rows={3}
                      placeholder="https://example.com/photo1.jpg"
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-semibold text-gray-900">Custom Sections</label>
                      <button
                        type="button"
                        onClick={addCustomSection}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center hover:bg-green-200"
                      >
                        <Plus size={16} className="mr-1" />
                        Add Section
                      </button>
                    </div>
                    {formData.customSections.map((section, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-3 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium text-gray-700">Section {idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeCustomSection(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 mb-2 text-gray-900"
                          placeholder="Section Title (e.g., 'Warranty Information')"
                        />
                        <textarea
                          value={section.content}
                          onChange={(e) => updateCustomSection(idx, 'content', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                          rows={3}
                          placeholder="Section content..."
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-green-700"
                  >
                    <Save size={20} className="mr-2" />
                    Save Business
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {businesses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No businesses yet. Click "New Business" to create one!</p>
                  </div>
                ) : (
                  businesses.map(business => {
                    const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}/${business.slug}` : `/${business.slug}`;
                    return (
                      <div key={business.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{business.name}</h3>
                            <p className="text-sm text-gray-700">{business.phone}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePreview(business)}
                              className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 text-sm"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleEdit(business)}
                              className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(business.id)}
                              className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1 font-semibold">📤 Public URL (share with client):</p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={publicUrl}
                              readOnly
                              className="flex-1 text-sm bg-white border border-gray-300 rounded px-2 py-1 text-gray-800"
                            />
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(publicUrl);
                                alert('URL copied!');
                              }}
                              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 whitespace-nowrap"
                            >
                              Copy
                            </button>
                            <a
                              href={publicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 whitespace-nowrap"
                            >
                              Open
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <span className="text-sm">Preview Mode</span>
        <button
          onClick={() => setView('admin')}
          className="bg-white text-gray-800 px-4 py-2 rounded text-sm"
        >
          Back to Admin
        </button>
      </div>
      {selectedBusiness && <BusinessPage business={selectedBusiness} />}
    </div>
  );
}

export default App;