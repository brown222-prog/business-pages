export type TemplateType = 'classic' | 'modern' | 'minimal';

export interface CustomSection {
  title: string;
  content: string;
}

export interface Testimonial {
  rating: number;
  text: string;
  author: string;
}

export interface Business {
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
