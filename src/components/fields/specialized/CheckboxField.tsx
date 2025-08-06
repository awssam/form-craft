import React, { useState, useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';
import { Badge } from '@/components/ui/badge';

/**
 * CheckboxField component with single and multi-checkbox support
 */
export interface CheckboxFieldProps extends BaseFieldProps {
  /** Whether this is a single checkbox or multiple checkboxes */
  variant?: 'single' | 'multiple';
  
  /** Layout direction for multiple checkboxes */
  layout?: 'vertical' | 'horizontal' | 'grid';
  
  /** Number of columns for grid layout */
  gridColumns?: number;
  
  /** Whether to show option descriptions */
  showOptionDescriptions?: boolean;
  
  /** Minimum number of selections required */
  minSelections?: number;
  
  /** Maximum number of selections allowed */
  maxSelections?: number;
  
  /** Whether to show selection count */
  showSelectionCount?: boolean;
  
  /** Custom single checkbox label (for single variant) */
  checkboxLabel?: string;
  
  /** Custom option renderer */
  optionRenderer?: (option: { 
    label: string; 
    value: string | number; 
    helperText?: string;
  }) => React.ReactNode;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  config,
  mode,
  variant = 'single',
  layout = 'vertical',
  gridColumns = 2,
  showOptionDescriptions = true,
  minSelections,
  maxSelections,
  showSelectionCount = false,
  checkboxLabel,
  optionRenderer,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  //@ts-expect-error code dlkhra ma 3mro ysali
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(() => {
    if (variant === 'single') {
      return config.defaultValue ? ['checked'] : [];
    }
    const defaultValue = config.defaultValue;
    if (Array.isArray(defaultValue)) {
      // Filter to only include string/number values
      //@ts-expect-error code dlkhra ma 3mro ysali
      return defaultValue.filter((val): val is string | number => 
        typeof val === 'string' || typeof val === 'number'
      );
    }
    if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
      return [defaultValue];
    }
    return [];
  });

  // For single checkbox, we need to check if it's checked
  const isSingleChecked = variant === 'single' && selectedValues.length > 0;

  // Get options (for multiple variant)
  const options = config.options || [];

  // Validation
  const isRequired = config.validation?.custom?.required?.value;
  const hasMinError = minSelections && selectedValues.length < minSelections;
  const hasMaxError = maxSelections && selectedValues.length > maxSelections;
  const hasRequiredError = isRequired && selectedValues.length === 0;
  const hasError = hasMinError || hasMaxError || hasRequiredError;

  // Handle single checkbox change
  const handleSingleChange = (checked: boolean) => {
    const newValues = checked ? ['checked'] : [];
    setSelectedValues(newValues);
    onChange?.(checked);
  };

  // Handle multiple checkbox change
  const handleMultipleChange = (value: string | number, checked: boolean) => {
    let newValues: (string | number)[];
    
    if (checked) {
      if (maxSelections && selectedValues.length >= maxSelections) {
        return; // Don't add if at max limit
      }
      newValues = [...selectedValues, value];
    } else {
      newValues = selectedValues.filter(v => v !== value);
    }
    
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  // Enhanced config
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'checkbox' as const,
    variant,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        ...(minSelections && {
          minSelections: {
            value: minSelections,
            message: `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`,
            type: 'withValue' as const,
          },
        }),
        ...(maxSelections && {
          maxSelections: {
            value: maxSelections,
            message: `You can select at most ${maxSelections} option${maxSelections > 1 ? 's' : ''}`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, variant, minSelections, maxSelections]);

  // Get layout classes for multiple checkboxes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-wrap gap-4';
      case 'grid':
        return `grid gap-3 grid-cols-${gridColumns}`;
      default:
        return 'space-y-2';
    }
  };

  // Default option renderer
  const defaultOptionRenderer = (option: typeof options[0]) => (
    <div className="flex-1">
      <div className="font-medium">{option.label}</div>
      {showOptionDescriptions && option.helperText && (
        <div className="text-sm text-gray-500 mt-1">{option.helperText}</div>
      )}
    </div>
  );

  // Render single checkbox
  const renderSingleCheckbox = () => (
    <div className="flex items-start space-x-2">
      <Checkbox
        id={`checkbox-${config.id}`}
        checked={isSingleChecked}
        onCheckedChange={handleSingleChange}
        disabled={mode === 'builder'}
        className={cn({
          'border-red-500': hasError,
          'border-green-500': !hasError && isSingleChecked,
        })}
      />
      <Label
        htmlFor={`checkbox-${config.id}`}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer',
          {
            'text-red-600': hasError,
          }
        )}
      >
        {checkboxLabel || config.label || 'Check this box'}
      </Label>
    </div>
  );

  // Render multiple checkboxes
  const renderMultipleCheckboxes = () => (
    <div className="space-y-3">
      {/* Selection count and status */}
      {showSelectionCount && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            {selectedValues.length} of {options.length} selected
          </div>
          {maxSelections && (
            <div className="text-gray-500">
              Max: {maxSelections}
            </div>
          )}
        </div>
      )}

      {/* Selected values badges */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            const label = option?.label || value.toString();
            
            return (
              <Badge
                key={value}
                variant="secondary"
                className="text-xs"
              >
                {label}
                <button
                  type="button"
                  onClick={() => handleMultipleChange(value, false)}
                  className="ml-1 hover:text-red-500"
                  disabled={mode === 'builder'}
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Checkboxes */}
      <div className={cn(getLayoutClasses())}>
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          const isDisabled = mode === 'builder' || 
            (!!maxSelections && !isSelected && selectedValues.length >= maxSelections);
          
          return (
            <div
              key={option.value}
              className={cn(
                'relative',
                {
                  'flex items-center space-x-2': layout === 'horizontal',
                }
              )}
            >
              <div className={cn(
                'flex items-start space-x-2 p-3 rounded-lg border transition-all',
                {
                  'border-blue-500 bg-blue-50': isSelected && !hasError,
                  'border-red-500 bg-red-50': hasError,
                  'border-gray-200 hover:border-gray-300': !isSelected && !hasError,
                  'opacity-50': isDisabled,
                  'cursor-pointer': !isDisabled,
                  'pointer-events-none': mode === 'builder',
                }
              )}>
                <Checkbox
                  id={`checkbox-${config.id}-${option.value}`}
                  checked={isSelected}
                  onCheckedChange={(checked) => 
                    handleMultipleChange(option.value, checked as boolean)
                  }
                  disabled={isDisabled}
                  className={cn({
                    'border-red-500': hasError,
                  })}
                />
                
                <Label
                  htmlFor={`checkbox-${config.id}-${option.value}`}
                  className="flex-1 cursor-pointer"
                >
                  {optionRenderer ? optionRenderer(option) : defaultOptionRenderer(option)}
                </Label>
              </div>
              
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <BaseField
      config={enhancedConfig}
      mode={mode}
      className={className}
      onChange={onChange}
      onConfigChange={onConfigChange}
      validation={config.validation}
      theme={theme}
      {...props}
    >
      <FieldWrapper
        field={enhancedConfig}
        mode={mode}
        showControls={mode === 'builder'}
        isDraggable={mode === 'builder'}
      >
        {variant === 'single' ? renderSingleCheckbox() : renderMultipleCheckboxes()}
        
        {/* Validation Messages */}
        <div className="mt-2 text-xs space-y-1">
          {hasRequiredError && (
            <div className="text-red-600">
              {variant === 'single' ? 'This field is required' : 'Please select at least one option'}
            </div>
          )}
          
          {hasMinError && (
            <div className="text-red-600">
              Please select at least {minSelections} option{(minSelections || 0) > 1 ? 's' : ''}
            </div>
          )}
          
          {hasMaxError && (
            <div className="text-red-600">
              You can select at most {maxSelections} option{(maxSelections || 0) > 1 ? 's' : ''}
            </div>
          )}
          
          {variant === 'multiple' && minSelections && maxSelections && (
            <div className="text-gray-500">
              Select between {minSelections} and {maxSelections} options
            </div>
          )}
          
          {variant === 'multiple' && options.length === 0 && mode === 'builder' && (
            <div className="text-gray-500">
              Add options to display checkboxes
            </div>
          )}
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default CheckboxField;
