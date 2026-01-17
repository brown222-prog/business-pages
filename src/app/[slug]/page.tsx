import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { TemplateRenderer } from '@/components/templates';
import { Business as BusinessType } from '@/types/templates';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getBusiness(slug: string): Promise<BusinessType | null> {
  try {
    console.log('🔍 Fetching business with slug:', slug);
    console.log('📋 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
    
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        photos(file_url, display_order),
        testimonials(rating, text, author, display_order),
        custom_sections(title, content, display_order)
      `)
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return null;
    }

    if (!data) {
      console.warn('⚠️ No data found for slug:', slug);
      return null;
    }
    
    console.log('✅ Business found:', data.name);

    const business: BusinessType = {
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
      template: data.template || 'classic',
      photos: (data.photos || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((p: any) => p.file_url),
      testimonials: (data.testimonials || [])
        .sort((a: any, b: any) => a.display_order - b.display_order),
      customSections: (data.custom_sections || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
    };

    return business;
  } catch (error) {
    console.error('Error fetching business:', error);
    return null;
  }
}

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  console.log('📄 Page Component Rendered');
  console.log('Raw params:', resolvedParams);
  console.log('Slug received:', slug);

  // ADD THIS CHECK FIRST - before any database calls
  if (slug === 'admin' || slug.startsWith('admin')) {
    return null; // Don't render anything, let the admin route handle it
  }

  const business = await getBusiness(slug);

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">❌ Business Not Found</h1>
          <p className="text-gray-600 mb-4">This business page doesn't exist or has been deactivated.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-4">
            <p className="text-xs text-gray-600 mb-2"><strong>Debugging Info:</strong></p>
            <p className="text-xs text-gray-700 break-all">Slug: <code className="bg-white px-2 py-1 rounded">{slug || '(empty)'}</code></p>
            <p className="text-xs text-gray-600 mt-2">Check the server console for more details.</p>
            <p className="text-xs text-gray-600 mt-2">Available businesses: asdf</p>
          </div>

          <a 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Admin
          </a>
        </div>
      </div>
    );
  }

  return <TemplateRenderer business={business} />;
}