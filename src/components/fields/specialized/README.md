# Specialized Field Components Migration Pattern

This directory contains specialized field components that wrap legacy components with enhanced functionality while maintaining all existing features like draggability, validation, theming, etc.

## Pattern Overview

The migration strategy follows this pattern:
1. **Wrap, don't replace**: Use existing legacy fields as the core component
2. **Enhance with specialized logic**: Add field-specific functionality on top
3. **Maintain compatibility**: All existing features (drag/drop, validation, theming) continue to work
4. **Customize configuration**: Limit and customize config options for specific use cases

## Example: EmailField

The `EmailField` demonstrates this pattern by:
- Using `TextField` as the core component
- Adding email-specific validation and domain suggestions
- Enhancing the config with email-specific properties
- Maintaining all TextField functionality (dragging, theming, validation)

## Creating New Specialized Fields

Follow this template for creating new specialized fields:

```tsx
import React, { useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { FieldEntity } from '@/types/form-config';
import TextField from './TextField'; // or other base component
import { cn } from '@/lib/utils';

/**
 * [FieldName] - A specialized wrapper around [BaseComponent] with [specific] enhancements
 */
export interface [FieldName]Props extends BaseFieldProps {
  // Add field-specific props here
  customProp?: string;
}

const [FieldName]: React.FC<[FieldName]Props> = ({
  config,
  customProp,
  className,
  onChange,
  ...props
}) => {
  // 1. Create enhanced config with field-specific modifications
  const enhancedConfig = useMemo((): FieldEntity => {
    const baseConfig = { ...config };
    
    // Customize field type and properties
    baseConfig.type = 'your-type';
    baseConfig.placeholder = baseConfig.placeholder || 'Default placeholder';
    
    // Add field-specific validation
    const customValidation = { ...baseConfig.validation?.custom };
    
    customValidation.yourValidation = {
      value: true,
      message: 'Your validation message',
      type: 'binary' as const,
    };
    
    baseConfig.validation = {
      ...baseConfig.validation,
      custom: customValidation,
    };
    
    return baseConfig;
  }, [config, customProp]);

  // 2. Add field-specific logic
  const handleChange = (value: string) => {
    // Add any field-specific processing here
    const processedValue = value; // your processing logic
    onChange?.(processedValue);
  };

  return (
    <div className={cn('your-field-wrapper', className)}>
      {/* 3. Use base component with enhanced config */}
      <TextField
        {...props}
        config={enhancedConfig}
        variant="your-variant"
        onChange={handleChange}
        inputProps={{
          // Add field-specific input props
        }}
      />
      
      {/* 4. Add field-specific UI enhancements */}
      {/* Your additional UI components here */}
    </div>
  );
};

export default [FieldName];
```

## Common Use Cases

### 1. FirstNameField
```tsx
const FirstNameField: React.FC<FirstNameFieldProps> = ({ config, ...props }) => {
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'text',
    placeholder: 'Enter your first name',
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        minLength: { value: 2, message: 'First name must be at least 2 characters', type: 'withValue' },
        maxLength: { value: 50, message: 'First name cannot exceed 50 characters', type: 'withValue' },
        pattern: { 
          value: /^[a-zA-Z\s'-]+$/, 
          message: 'First name can only contain letters, spaces, hyphens, and apostrophes', 
          type: 'withValue' 
        },
      },
    },
  }), [config]);

  return <TextField {...props} config={enhancedConfig} variant="text" />;
};
```

### 2. PhoneField
```tsx
const PhoneField: React.FC<PhoneFieldProps> = ({ config, countryCode = '+1', ...props }) => {
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'phone',
    placeholder: '(555) 123-4567',
    defaultValue: countryCode,
  }), [config, countryCode]);

  const formatPhone = (value: string) => {
    // Phone formatting logic
    return value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };

  return (
    <TextField
      {...props}
      config={enhancedConfig}
      variant="phone"
      formatters={{ phone: formatPhone }}
    />
  );
};
```

## Benefits of This Pattern

1. **Gradual Migration**: Migrate one field at a time without breaking existing functionality
2. **Code Reuse**: Leverage all existing TextField logic and features
3. **Maintainability**: Changes to TextField automatically benefit all specialized fields
4. **Flexibility**: Each specialized field can add its own specific logic and UI
5. **Backward Compatibility**: Existing forms continue to work unchanged

## Integration

To use specialized fields in your form builder, update the field registry to include these components while keeping the legacy TextField available for other use cases.
