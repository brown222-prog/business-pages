import ClassicTemplate from './ClassicTemplate';
import ModernTemplate from './ModernTemplate';
import MinimalTemplate from './MinimalTemplate';
import { Business, TemplateType } from '@/types/templates';

export { ClassicTemplate, ModernTemplate, MinimalTemplate };

export function getTemplate(templateType: TemplateType = 'classic') {
  switch (templateType) {
    case 'modern':
      return ModernTemplate;
    case 'minimal':
      return MinimalTemplate;
    case 'classic':
    default:
      return ClassicTemplate;
  }
}

export function TemplateRenderer({ business }: { business: Business }) {
  const Template = getTemplate(business.template);
  return <Template business={business} />;
}
