import { FieldCategory } from './base/FieldTypes';
import { FormInputIcon, Mail, Calendar, Upload, Hash, ToggleLeft } from 'lucide-react';

/**
 * Default field categories for organizing fields in the UI
 */
export const DEFAULT_FIELD_CATEGORIES: FieldCategory[] = [
  {
    id: 'basic',
    name: 'Basic Fields',
    description: 'Essential form fields for common data collection',
    icon: FormInputIcon({ className: 'w-4 h-4' }),
    order: 1,
  },
  {
    id: 'contact',
    name: 'Contact Information',
    description: 'Fields for collecting contact details',
    icon: Mail({ className: 'w-4 h-4' }),
    order: 2,
  },
  {
    id: 'selection',
    name: 'Selection Fields',
    description: 'Fields for choosing from predefined options',
    icon: ToggleLeft({ className: 'w-4 h-4' }),
    order: 3,
  },
  {
    id: 'numeric',
    name: 'Numeric Fields',
    description: 'Fields for numerical data input',
    icon: Hash({ className: 'w-4 h-4' }),
    order: 4,
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    description: 'Fields for date and time selection',
    icon: Calendar({ className: 'w-4 h-4' }),
    order: 5,
  },
  {
    id: 'file',
    name: 'File Upload',
    description: 'Fields for file and media uploads',
    icon: Upload({ className: 'w-4 h-4' }),
    order: 6,
  },
];

import FieldRegistry from './FieldRegistry';

/**
 * Initialize default categories in the registry
 */
export const initializeDefaultCategories = () => {
  DEFAULT_FIELD_CATEGORIES.forEach(category => {
    FieldRegistry.registerCategory(category);
  });
  
  console.debug('Initialized default field categories');
};
