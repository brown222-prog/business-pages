import React from 'react';
import { Phone, MapPin, Clock, Star } from 'lucide-react';
import { Business } from '@/types/templates';

export default function ModernTemplate({ business }: { business: Business }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section with overlay */}
      <div className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${business.primaryColor}dd 0%, ${business.primaryColor} 100%)` }}>
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 text-white">
          <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">{business.name}</h1>
          <a
            href={`tel:${business.phone}`}
            className="inline-flex items-center justify-center bg-white px-8 py-4 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
            style={{ color: business.primaryColor }}
          >
            <Phone className="mr-3" size={28} />
            {business.phone}
          </a>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Services Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-4 flex items-center" style={{ color: business.primaryColor }}>
            Our Services
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed">{business.services}</p>
        </div>

        {/* Hours Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start">
            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${business.primaryColor}20` }}>
              <Clock style={{ color: business.primaryColor }} size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Business Hours</h3>
              <p className="text-gray-700 text-lg whitespace-pre-line">{business.hours}</p>
            </div>
          </div>
        </div>

        {/* Custom Sections */}
        {business.customSections && business.customSections.length > 0 && (
          business.customSections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: business.primaryColor }}>{section.title}</h3>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{section.content}</p>
            </div>
          ))
        )}

        {/* Photos Grid */}
        {business.photos.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6" style={{ color: business.primaryColor }}>Our Work</h3>
            <div className="grid grid-cols-2 gap-6">
              {business.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Work ${idx + 1}`}
                  className="w-full h-56 object-cover rounded-xl shadow-lg hover:shadow-2xl transition-shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Testimonials */}
        {business.testimonials && business.testimonials.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold mb-6" style={{ color: business.primaryColor }}>Client Reviews</h3>
            <div className="space-y-6">
              {business.testimonials.map((testimonial, idx) => (
                <div key={idx} className="border-l-4 pl-6 py-2" style={{ borderColor: business.primaryColor }}>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-gray-600">{testimonial.rating}/5</span>
                  </div>
                  <p className="text-gray-700 text-lg italic mb-2">"{testimonial.text}"</p>
                  <p className="text-sm font-semibold text-gray-600">— {testimonial.author}</p>
                </div>
              ))}
            </div>
            {business.googleMapsUrl && (
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 font-semibold hover:underline"
                style={{ color: business.primaryColor }}
              >
                Read more reviews on Google Maps →
              </a>
            )}
          </div>
        )}

        {/* Service Area & Map */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-start mb-6">
            <div className="p-3 rounded-full mr-4" style={{ backgroundColor: `${business.primaryColor}20` }}>
              <MapPin style={{ color: business.primaryColor }} size={32} />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2 text-gray-800">Service Area</h3>
              <p className="text-gray-700 text-lg">{business.address}</p>
            </div>
          </div>
          {business.mapEmbedUrl && (
            <iframe
              src={business.mapEmbedUrl}
              className="w-full h-80 rounded-xl border-0 shadow-lg"
              loading="lazy"
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 py-8 text-center" style={{ backgroundColor: business.primaryColor }}>
        <p className="text-white text-sm font-medium">© {new Date().getFullYear()} {business.name}</p>
      </div>
    </div>
  );
}
