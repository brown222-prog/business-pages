'use client';

import React, { useState, useEffect } from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
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

export default function BusinessPage({ params }: { params: { slug: string } }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select(`
          *,
          photos(file_url, display_order),
          testimonials(rating, text, author, display_order),
          custom_sections(title, content, display_order)
        `)
        .eq('slug', params.slug)
        .eq('active', true)
        .single();

      if (error) throw error;

      if (!data) {
        setError(true);
        return;
      }

      const transformedBusiness: Business = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        phone: data.phone,
        hours: data.hours,
        services: data.services,
        address: data.address,
        mapEmbedUrl: data.map_embed_url || '',
        googleMapsUrl: data.google_maps_url || '',
        primaryColor: data.primary_color || '#2563eb',
        active: data.active,
        photos: (data.photos || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((p: any) => p.file_url),
        testimonials: (data.testimonials || [])
          .sort((a: any, b: any) => a.display_order - b.display_order),
        customSections: (data.custom_sections || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
      };

      setBusiness(transformedBusiness);
    } catch (err) {
      console.error('Error loading business:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Business Not Found</h1>
          <p className="text-gray-600">This business page doesn't exist or has been deactivated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="text-white p-6" style={{ background: `linear-gradient(to right, ${business.primaryColor}, ${business.primaryColor}dd)` }}>
        <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
        <a 
          href={`tel:${business.phone}`}
          className="block w-full bg-white text-center py-4 px-6 rounded-lg text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
          style={{ color: business.primaryColor }}
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
          <Clock className="flex-shrink-0 mr-3 mt-1" style={{ color: business.primaryColor }} size={24} />
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
          <MapPin className="flex-shrink-0 mr-3 mt-1" style={{ color: business.primaryColor }} size={24} />
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
          {business.googleMapsUrl && (
            <a 
              href={business.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 hover:underline text-sm font-medium"
              style={{ color: business.primaryColor }}
            >
              See all reviews on Google Maps →
            </a>
          )}
        </div>
      )}

      <div className="bg-gray-800 text-white p-6 text-center">
        <p className="text-sm opacity-75">© {new Date().getFullYear()} {business.name}</p>
      </div>
    </div>
  );
}