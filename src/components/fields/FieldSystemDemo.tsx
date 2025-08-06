import React from 'react';
import { FieldConfiguration } from './base/FieldTypes';
import { FieldType } from '@/types/form-config';
import ExampleTextField from './examples/ExampleTextField';
import { 
  RequiredValidation, 
  MinLengthValidation, 
  MaxLengthValidation, 
  PatternValidation 
} from './validation/ValidationRules';
import BaseField from './base/BaseField';
import FieldWrapper from './base/FieldWrapper';
import { initializeDefaultCategories } from './FieldCategories';
import FieldRegistry from './FieldRegistry';

/**
 * Initialize the field system with default configurations
 * This should be called once when the application starts
 */
export const initializeFieldSystem = () => {
  // Initialize default categories
  initializeDefaultCategories();
  
  // Register example field types for demonstration
  registerExampleFields();
  
  console.log('Field system initialized');
  console.log('Available categories:', FieldRegistry.getAllCategories().map(c => c.name));
  console.log('Registry stats:', FieldRegistry.getStats());
};

/**
 * Register example field configurations to demonstrate the system
 * These will be replaced with actual implementations in Phase 2
 */
const registerExampleFields = () => {
  // Example text field configuration
  const textFieldConfig: FieldConfiguration = {
    type: 'text' as FieldType,
    component: ExampleTextField,
    icon: React.createElement('span', null, '📝'),
    displayName: 'Text Field',
    description: 'Single-line text input for short entries',
    category: 'basic',
    defaultConfig: {
      type: 'text',
      placeholder: 'Enter text...',
      helperText: 'Type your answer here',
      width: '100%',
      validation: {
        custom: {},
      },
    },
    validationRules: [
      RequiredValidation,
      MinLengthValidation,
      MaxLengthValidation,
      PatternValidation,
    ],
    customizations: [
      {
        key: 'placeholder',
        type: 'text',
        label: 'Placeholder Text',
        description: 'Text shown when field is empty',
        defaultValue: 'Enter text...',
      },
      {
        key: 'helperText',
        type: 'text',
        label: 'Helper Text',
        description: 'Additional guidance for users',
        defaultValue: '',
      },
      {
        key: 'width',
        type: 'select',
        label: 'Field Width',
        description: 'How wide the field should be',
        defaultValue: '100%',
        options: [
          { label: '25%', value: '25%' },
          { label: '50%', value: '50%' },
          { label: '75%', value: '75%' },
          { label: '100%', value: '100%' },
        ],
      },
    ],
    tags: ['input', 'text', 'basic'],
    since: '1.0.0',
  };

  // Register the example field
  FieldRegistry.register(textFieldConfig);
};

/**
 * Demonstrate basic field component usage
 */
export const FieldSystemDemo: React.FC = () => {
  const [mode, setMode] = React.useState<'builder' | 'runtime'>('builder');
  const [fieldConfig, ] = React.useState({
    id: 'demo-field-1',
    name: 'demoField',
    type: 'text' as FieldType,
    label: 'Demo Text Field',
    placeholder: 'Enter some text...',
    helperText: 'This is a demonstration of the new field system',
    width: '100%' as const,
  });

  // const handleConfigChange = (updates: Partial<typeof fieldConfig>) => {
  //   setFieldConfig(prev => ({ ...prev, ...updates }));
  // };

  const handleValueChange = (value: string | number | boolean | File[]) => {
    console.log('Field value changed:', value);
  };

  React.useEffect(() => {
    // Initialize the field system when component mounts
    initializeFieldSystem();
  }, []);

  return (
    <div className="field-system-demo p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Field Component Infrastructure Demo</h2>
      
      {/* Mode Toggle */}
      <div className="mb-6">
        <label className="flex items-center gap-2">
          <span>Mode:</span>
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value as 'builder' | 'runtime')}
            className="border rounded px-2 py-1"
          >
            <option value="builder">Builder</option>
            <option value="runtime">Runtime</option>
          </select>
        </label>
      </div>

      {/* Field Configuration Display */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current Field Configuration:</h3>
        <pre className="text-sm overflow-auto">
          {JSON.stringify(fieldConfig, null, 2)}
        </pre>
      </div>

      {/* Field Demonstration */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Field Rendering:</h3>
        <div className="border p-4 rounded">
          <FieldWrapper
            field={fieldConfig}
            mode={mode}
            showControls={mode === 'builder'}
            isSelected={mode === 'builder'}
          >
            <BaseField
              config={fieldConfig}
              mode={mode}
              onChange={handleValueChange}
              // onConfigChange={mode === 'builder' ? handleConfigChange : undefined}
            >
              <ExampleTextField
                config={fieldConfig}
                mode={mode}
                onChange={handleValueChange}
                // onConfigChange={mode === 'builder' ? handleConfigChange : undefined}
              />
            </BaseField>
          </FieldWrapper>
        </div>
      </div>

      {/* Registry Information */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Registry Information:</h3>
        <div className="space-y-2 text-sm">
          <div>
            <strong>Categories:</strong> {FieldRegistry.getAllCategories().map(c => c.name).join(', ')}
          </div>
          <div>
            <strong>Available Field Types:</strong> {FieldRegistry.getAvailableTypes().join(', ')}
          </div>
          <div>
            <strong>Registry Stats:</strong>
            <pre className="ml-4 mt-1">
              {JSON.stringify(FieldRegistry.getStats(), null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Field Configuration Example */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Field Configuration Example:</h3>
        <div className="text-sm">
          <p>Text field configuration from registry:</p>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto">
            {JSON.stringify(FieldRegistry.getFieldConfig('text'), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default FieldSystemDemo;
