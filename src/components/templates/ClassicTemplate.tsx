import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { Business } from '@/types/templates';

export default function ClassicTemplate({ business }: { business: Business }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header with gradient */}
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

      {/* Services */}
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Services</h2>
        <p className="text-gray-600 leading-relaxed">{business.services}</p>
      </div>

      {/* Hours */}
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-start">
          <Clock className="flex-shrink-0 mr-3 mt-1" style={{ color: business.primaryColor }} size={24} />
          <div>
            <h3 className="font-bold text-lg mb-1 text-gray-800">Hours</h3>
            <p className="text-gray-600">{business.hours}</p>
          </div>
        </div>
      </div>

      {/* Custom Sections */}
      {business.customSections && business.customSections.length > 0 && (
        business.customSections.map((section, idx) => (
          <div key={idx} className={`p-6 border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <h3 className="font-bold text-lg mb-3 text-gray-800">{section.title}</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{section.content}</p>
          </div>
        ))
      )}

      {/* Service Area & Map */}
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

      {/* Photos */}
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

      {/* Testimonials */}
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

      {/* Footer */}
      <div className="bg-gray-800 text-white p-6 text-center">
        <p className="text-sm opacity-75">© {new Date().getFullYear()} {business.name}</p>
      </div>
    </div>
  );
}
