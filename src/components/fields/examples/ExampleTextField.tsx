import React from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Example TextField implementation showing how to create a field component
 * This will be replaced with the actual implementation in Phase 2
 */
const ExampleTextField: React.FC<BaseFieldProps> = ({
  config,
  mode,
  className,
  onChange,
  theme,
  ...props
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange?.(value);
  };

  // Get theme colors
  const themeColors = theme?.properties;

  const inputClasses = cn(
    'w-full',
    'transition-colors',
    'duration-200',
    {
      'border-blue-300 focus:border-blue-500': mode === 'builder',
      'hover:border-blue-400': mode === 'builder',
    },
    className
  );

  const inputStyles = themeColors ? {
    color: themeColors.primaryTextColor,
    borderColor: themeColors.inputBorderColor,
    backgroundColor: themeColors.formBackgroundColor,
  } : {};

  return (
    <div className="example-text-field" {...props}>
      <Input
        id={config.id}
        name={config.name}
        type={getInputType(config.type)}
        placeholder={config.placeholder}
        defaultValue={config.defaultValue as string}
        className={inputClasses}
        style={inputStyles}
        onChange={handleInputChange}
        readOnly={config.readonly}
        disabled={mode === 'builder'}
      />
    </div>
  );
};

/**
 * Helper function to map field types to HTML input types
 */
const getInputType = (fieldType: string): string => {
  switch (fieldType) {
    case 'email':
      return 'email';
    case 'phone':
      return 'tel';
    case 'number':
      return 'number';
    case 'text':
    default:
      return 'text';
  }
};

export default ExampleTextField;
