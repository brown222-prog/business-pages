import React from 'react';
import { Phone, MapPin, Clock } from 'lucide-react';
import { Business } from '@/types/templates';

export default function MinimalTemplate({ business }: { business: Business }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Minimalist Header */}
      <div className="border-b-2" style={{ borderColor: business.primaryColor }}>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-light mb-8 tracking-wide text-gray-900">{business.name}</h1>
          <a
            href={`tel:${business.phone}`}
            className="inline-flex items-center text-2xl font-light tracking-wide hover:opacity-75 transition-opacity"
            style={{ color: business.primaryColor }}
          >
            <Phone className="mr-3" size={24} strokeWidth={1.5} />
            {business.phone}
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        {/* Services */}
        <section>
          <h2 className="text-sm uppercase tracking-widest mb-4 font-medium" style={{ color: business.primaryColor }}>
            Services
          </h2>
          <p className="text-gray-700 text-lg leading-relaxed font-light">{business.services}</p>
        </section>

        {/* Hours */}
        <section>
          <h3 className="text-sm uppercase tracking-widest mb-4 font-medium flex items-center" style={{ color: business.primaryColor }}>
            <Clock className="mr-2" size={16} strokeWidth={2} />
            Hours
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed font-light whitespace-pre-line">{business.hours}</p>
        </section>

        {/* Custom Sections */}
        {business.customSections && business.customSections.length > 0 && (
          business.customSections.map((section, idx) => (
            <section key={idx}>
              <h3 className="text-sm uppercase tracking-widest mb-4 font-medium" style={{ color: business.primaryColor }}>
                {section.title}
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed font-light whitespace-pre-wrap">{section.content}</p>
            </section>
          ))
        )}

        {/* Photos */}
        {business.photos.length > 0 && (
          <section>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: business.primaryColor }}>
              Portfolio
            </h3>
            <div className="space-y-8">
              {business.photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`Work ${idx + 1}`}
                  className="w-full h-auto object-cover"
                />
              ))}
            </div>
          </section>
        )}

        {/* Testimonials */}
        {business.testimonials && business.testimonials.length > 0 && (
          <section>
            <h3 className="text-sm uppercase tracking-widest mb-6 font-medium" style={{ color: business.primaryColor }}>
              Testimonials
            </h3>
            <div className="space-y-8">
              {business.testimonials.map((testimonial, idx) => (
                <div key={idx} className="border-l pl-6" style={{ borderColor: business.primaryColor }}>
                  <div className="flex items-center mb-3">
                    <div className="flex text-gray-400 text-sm">
                      {'★'.repeat(testimonial.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 text-lg font-light italic mb-3">"{testimonial.text}"</p>
                  <p className="text-sm text-gray-500 font-medium">— {testimonial.author}</p>
                </div>
              ))}
            </div>
            {business.googleMapsUrl && (
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-6 text-sm uppercase tracking-widest hover:opacity-75 transition-opacity"
                style={{ color: business.primaryColor }}
              >
                More Reviews →
              </a>
            )}
          </section>
        )}

        {/* Service Area */}
        <section>
          <h3 className="text-sm uppercase tracking-widest mb-4 font-medium flex items-center" style={{ color: business.primaryColor }}>
            <MapPin className="mr-2" size={16} strokeWidth={2} />
            Service Area
          </h3>
          <p className="text-gray-700 text-lg font-light mb-6">{business.address}</p>
          {business.mapEmbedUrl && (
            <iframe
              src={business.mapEmbedUrl}
              className="w-full h-96 border-0"
              loading="lazy"
            />
          )}
        </section>
      </div>

      {/* Footer */}
      <div className="border-t mt-16 py-8 text-center">
        <p className="text-xs uppercase tracking-widest text-gray-500">
          © {new Date().getFullYear()} {business.name}
        </p>
      </div>
    </div>
  );
}
