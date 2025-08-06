import React, { useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';

/**
 * TextField component with support for text, email, phone, and number variants
 */
export interface TextFieldProps extends BaseFieldProps {
  /** Field variant that determines input type and validation */
  variant?: 'text' | 'email' | 'phone' | 'number';
  
  /** Custom formatters for specific field types */
  formatters?: {
    phone?: (value: string) => string;
    number?: (value: string) => string;
  };
  
  /** Input-specific props */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

const TextField: React.FC<TextFieldProps> = ({
  config,
  mode,
  variant,
  formatters,
  inputProps,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  // Determine input type based on variant or field type
  const inputType = useMemo(() => {
    const type = variant || config.type;
    switch (type) {
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
  }, [variant, config.type]);

  // Get theme styles
  const themeStyles = useMemo(() => {
    if (!theme?.properties) return {};
    
    return {
      color: theme.properties.primaryTextColor,
      borderColor: theme.properties.inputBorderColor,
      backgroundColor: 'transparent',
      '--placeholder-color': theme.properties.inputPlaceholderColor,
    } as React.CSSProperties;
  }, [theme]);

  // Handle value change with optional formatting
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Apply formatters
    if (formatters?.phone && (variant === 'phone' || config.type === 'phone')) {
      value = formatters.phone(value);
    } else if (formatters?.number && (variant === 'number' || config.type === 'number')) {
      value = formatters.number(value);
    }
    
    onChange?.(value);
  };

  // Validation state
  const isRequired = config.validation?.custom?.required?.value;
  const hasError = false; // Will be connected to validation system in Phase 4

  // Input classes
  const inputClasses = cn(
    'w-full',
    'transition-all',
    'duration-200',
    'placeholder:opacity-70',
    {
      // Builder mode styles
      'hover:border-blue-400 focus:border-blue-500': mode === 'builder',
      'cursor-text': mode === 'builder',
      
      // Runtime mode styles
      'focus-visible:ring-2 focus-visible:ring-offset-1': mode === 'runtime',
      
      // Validation styles
      'border-red-500 focus:border-red-500': hasError,
      'border-green-500': mode === 'runtime' && !hasError && isRequired,
      
      // Theme-specific styles
      'dark:bg-gray-800': theme?.type?.includes('dark'),
    },
    inputProps?.className
  );

  const inputElement = (
    <Input
      id={config.id}
      name={config.name}
      type={inputType}
      placeholder={config.placeholder}
      defaultValue={config.defaultValue as string}
      className={inputClasses}
      style={themeStyles}
      onChange={handleChange}
      readOnly={config.readonly}
      disabled={mode === 'builder'}
      required={isRequired}
      {...inputProps}
    />
  );

  return (
    <BaseField
      config={config}
      mode={mode}
      className={className}
      onChange={onChange}
      onConfigChange={onConfigChange}
      validation={config.validation}
      theme={theme}
      {...props}
    >
      <FieldWrapper
        field={config}
        mode={mode}
        showControls={mode === 'builder'}
        isDraggable={mode === 'builder'}
      >
        {inputElement}
      </FieldWrapper>
    </BaseField>
  );
};

export default TextField;
