'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Plus, Edit2, Save, X, Trash2, Eye, Home } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TemplateType } from '@/types/templates';
import { TemplateRenderer } from '@/components/templates';

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
  template?: TemplateType;
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
  template: TemplateType;
}

export default function AdminPanel() {
  const router = useRouter();
  const [view, setView] = useState<'admin' | 'preview'>('admin');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
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
    primaryColor: '#2563eb',
    template: 'classic'
  });

  useEffect(() => {
    loadBusinesses();
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
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
        template: b.template || 'classic',
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
      primaryColor: '#2563eb',
      template: 'classic'
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
      primaryColor: business.primaryColor,
      template: business.template || 'classic'
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
        template: formData.template,
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

  const addTestimonial = () => {
    setFormData({
      ...formData,
      testimonials: [...formData.testimonials, { rating: 5, text: '', author: '' }]
    });
  };

  const removeTestimonial = (index: number) => {
    setFormData({
      ...formData,
      testimonials: formData.testimonials.filter((_, i) => i !== index)
    });
  };

  const updateTestimonial = (index: number, field: keyof Testimonial, value: string | number) => {
    const updated = [...formData.testimonials];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, testimonials: updated });
  };

  const addPhoto = () => {
    const url = prompt('Enter photo URL:');
    if (url) {
      setFormData({
        ...formData,
        photos: [...formData.photos, url]
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((_, i) => i !== index)
    });
  };


  if (view === 'preview' && selectedBusiness) {
    return (
      <div>
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center sticky top-0 z-50">
          <span className="text-sm">Preview Mode - {selectedBusiness.template || 'classic'} template</span>
          <button
            onClick={() => setView('admin')}
            className="bg-white text-gray-800 px-4 py-2 rounded text-sm hover:bg-gray-100"
          >
            Back to Admin
          </button>
        </div>
        <TemplateRenderer business={selectedBusiness} />
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedBusiness ? 'Edit Business' : 'New Business'}
                </h2>
                <button
                  onClick={() => router.push('/admin')}
                  className="text-sm text-gray-600 hover:text-gray-800 mt-1"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <button
                onClick={() => setEditMode(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  placeholder="Joe's Plumbing"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hours</label>
                <textarea
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  rows={3}
                  placeholder="Mon-Fri: 8am-6pm&#10;Sat: 9am-4pm&#10;Sun: Closed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Services</label>
                <textarea
                  value={formData.services}
                  onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  rows={4}
                  placeholder="Describe your services..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Area</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  placeholder="Seattle, WA and surrounding areas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-full h-12 border border-gray-300 rounded-lg p-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Template</label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value as TemplateType })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                >
                  <option value="classic">Classic - Traditional layout with gradient header</option>
                  <option value="modern">Modern - Card-based design with bold styling</option>
                  <option value="minimal">Minimal - Clean and simple typography-focused</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={formData.mapEmbedUrl}
                  onChange={(e) => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Google Maps URL</label>
                <input
                  type="text"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-900"
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Photos</label>
                  <button
                    onClick={addPhoto}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Photo
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={photo}
                        onChange={(e) => {
                          const updated = [...formData.photos];
                          updated[idx] = e.target.value;
                          setFormData({ ...formData, photos: updated });
                        }}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-gray-900"
                        placeholder="Photo URL"
                      />
                      <button
                        onClick={() => removePhoto(idx)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Testimonials</label>
                  <button
                    onClick={addTestimonial}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Testimonial
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.testimonials.map((testimonial, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <select
                          value={testimonial.rating}
                          onChange={(e) => updateTestimonial(idx, 'rating', Number(e.target.value))}
                          className="border border-gray-300 rounded p-2 text-gray-900"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                        <button
                          onClick={() => removeTestimonial(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <textarea
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(idx, 'text', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 mb-2"
                        rows={2}
                        placeholder="Review text"
                      />
                      <input
                        type="text"
                        value={testimonial.author}
                        onChange={(e) => updateTestimonial(idx, 'author', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                        placeholder="Author name"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Custom Sections</label>
                  <button
                    onClick={addCustomSection}
                    className="text-blue-600 hover:text-blue-700 text-sm flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Section
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.customSections.map((section, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-end mb-2">
                        <button
                          onClick={() => removeCustomSection(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={20} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 mb-2"
                        placeholder="Section title"
                      />
                      <textarea
                        value={section.content}
                        onChange={(e) => updateCustomSection(idx, 'content', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-gray-900"
                        rows={3}
                        placeholder="Section content"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center"
                >
                  <Save size={20} className="mr-2" />
                  Save Business
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Business Management</h1>
            <div className="flex gap-2">
              <button
                onClick={() => router.push('/admin')}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center hover:bg-gray-200"
              >
                <Home size={20} className="mr-2" />
                Dashboard
              </button>
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
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No businesses yet</p>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Your First Business
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {businesses.map((business) => (
                <div
                  key={business.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{business.name}</h3>
                      <p className="text-gray-600 text-sm mb-1">{business.phone}</p>
                      <p className="text-gray-500 text-sm">
                        <code className="bg-gray-100 px-2 py-0.5 rounded">/{business.slug}</code>
                      </p>
                      <span
                        className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                          business.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {business.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handlePreview(business)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Preview"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(business)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
