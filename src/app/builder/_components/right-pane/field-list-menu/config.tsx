import { useFieldData } from '@/components/fields/context/FieldRegistryContext';
import { fallbackFields } from './fallbackFields';
const generateFieldSections = (fieldData: ReturnType<typeof useFieldData>) => {
  const categories = fieldData.getAllCategories();
  if (categories.length === 0) {
    return [];
  }
  const cats = categories.map(category => {
    const fields = fieldData.getFieldsByCategory(category.id);
    return {
      title: category.name,
      description: (
        <p>
          {category.description} <strong className="text-yellow-200">Click</strong> on a field to add it
          to the form.
        </p>
      ),
      icon: category.icon,
      fields: fields.map(field => ({
        name: field.displayName,
        icon: field.icon,
        description: field.description,
        type: field.type,
        featureTag: field.category === 'media' ? 'fileUpload' : undefined,
      }))
    };
  });
  
  return cats;
};

export const getSections = (fieldData?: ReturnType<typeof useFieldData>) => {
  if (fieldData && fieldData.initialized && fieldData.getAllCategories().length > 0) {
    return generateFieldSections(fieldData);
  }
  return fallbackFields
};

const sections = getSections();

export type Section = (typeof sections)[0];

export type SectionField = Section['fields'][0];

export default sections;
