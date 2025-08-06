import { useFieldData } from '@/components/fields/FieldRegistryContext';
import { CalendarIcon, CheckboxIcon, TextIcon } from '@radix-ui/react-icons';
import { SelectIcon } from '@radix-ui/react-select';
import { FormInputIcon, Notebook, CircleDot, File } from 'lucide-react';

/**
 * Generate field sections dynamically from the field registry
 */
const generateFieldSections = (fieldData: ReturnType<typeof useFieldData>) => {
  console.log('🔍 FieldRegistry initialized?', fieldData.initialized);
  console.log('🔍 All fields:', fieldData.getAllFields());
  
  const categories = fieldData.getAllCategories();
  console.log('🔍 All categories:', categories);
  console.log('🔍 Categories length:', categories.length);
  
  if (categories.length === 0) {
    console.warn('⚠️ No categories found! Registry might not be properly initialized.');
    return [];
  }
  
  const cats = categories.map(category => {
    const fields = fieldData.getFieldsByCategory(category.id);
    console.log(`🔍 Fields for category "${category.id}":`, fields);
    
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
  
  console.log('🔍 Generated sections:', cats);
  return cats;
};

// Generate sections from registry, fallback to static sections for compatibility
export const getSections = (fieldData?: ReturnType<typeof useFieldData>) => {
  console.log('🔍 getSections called with fieldData:', {
    initialized: fieldData?.initialized,
    categoriesLength: fieldData?.getAllCategories().length,
    fieldsLength: fieldData?.getAllFields().length
  });
  
  if (fieldData && fieldData.initialized && fieldData.getAllCategories().length > 0) {
    console.log('✅ Using registry sections');
    return generateFieldSections(fieldData);
  }
  
  console.log('⚠️ Using fallback static sections');
  // Fallback to static sections
  return [
    {
      title: 'Basic Fields',
      description: (
        <p>
          Choose from the most common field types. <strong className="text-yellow-200">Click</strong> on a field to add it
          to the form.
        </p>
      ),
      icon: <FormInputIcon className="w-4 h-4" />,
      fields: [
        {
          name: 'Text Field',
          icon: <TextIcon className="w-4 h-4" />,
          description: 'A single-line input field for short text entries.',
          type: 'text',
        },
        {
          name: 'Multi-Line Text Field',
          icon: <Notebook className="w-4 h-4" />,
          description: 'A text area for longer text entries or comments.',
          type: 'textarea',
        },
        {
          name: 'Date Picker',
          icon: <CalendarIcon className="w-4 h-4" />,
          description: 'A field for selecting a date from a calendar.',
          type: 'date',
        },
        {
          name: 'File Upload',
          icon: <File className="w-4 h-4" />,
          description: 'A field for uploading files.',
          type: 'file',
          featureTag: 'fileUpload',
        },
        {
          name: 'Dropdown',
          icon: <SelectIcon className="w-4 h-4" />,
          description: 'A field that allows users to select one or more options from a set of options.',
          type: 'dropdown',
        },
        {
          name: 'Radio Button',
          icon: <CircleDot className="w-4 h-4" />,
          description: 'A field that allows users to select one option from a set of options.',
          type: 'radio',
        },
        {
          name: 'Checkbox',
          icon: <CheckboxIcon className="w-4 h-4" />,
          description: 'A field that allows users to select one or more options from a set of options.',
          type: 'checkbox',
        },
      ],
    },
  ];
};

// Legacy export for backward compatibility (will be removed)
const sections = getSections();

export type Section = (typeof sections)[0];

export type SectionField = Section['fields'][0];

export default sections;
