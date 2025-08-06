import React, { useState, useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';

/**
 * RadioField component with layout options and custom styling
 */
export interface RadioFieldProps extends BaseFieldProps {
  /** Layout direction for radio options */
  layout?: 'vertical' | 'horizontal' | 'grid';
  
  /** Number of columns for grid layout */
  gridColumns?: number;
  
  /** Whether to show option descriptions */
  showOptionDescriptions?: boolean;
  
  /** Whether to allow deselection */
  allowDeselect?: boolean;
  
  /** Whether to randomize option order */
  randomizeOptions?: boolean;
  
  /** Custom option renderer */
  optionRenderer?: (option: { 
    label: string; 
    value: string | number; 
    helperText?: string;
  }) => React.ReactNode;
}

const RadioField: React.FC<RadioFieldProps> = ({
  config,
  mode,
  layout = 'vertical',
  gridColumns = 2,
  showOptionDescriptions = true,
  allowDeselect = false,
  randomizeOptions = false,
  optionRenderer,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(() => {
    const defaultValue = config.defaultValue;
    if (typeof defaultValue === 'string' || typeof defaultValue === 'number') {
      return defaultValue;
    }
    return undefined;
  });

  // Process options (randomize if needed)
  const processedOptions = useMemo(() => {
    const options = config.options || [];
    if (randomizeOptions && mode === 'runtime') {
      return [...options].sort(() => Math.random() - 0.5);
    }
    return options;
  }, [config.options, randomizeOptions, mode]);

  // Validation
  const isRequired = config.validation?.custom?.required?.value;
  const hasError = isRequired && selectedValue === undefined;

  // Handle value change
  const handleValueChange = (value: string) => {
    let newValue: string | number | undefined = value;
    
    // Handle deselection
    if (allowDeselect && selectedValue === value) {
      newValue = undefined;
    }
    
    // Convert to number if option value is number
    const option = processedOptions.find(opt => opt.value.toString() === value);
    if (option && typeof option.value === 'number') {
      newValue = option.value;
    }
    
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  // Enhanced config
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'radio' as const,
    layout,
    allowDeselect,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
      },
    },
  }), [config, layout, allowDeselect]);

  // Get layout classes
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
  const defaultOptionRenderer = (option: typeof processedOptions[0]) => (
    <div className="flex items-start space-x-3">
      <div className="flex-1">
        <div className="font-medium">{option.label}</div>
        {showOptionDescriptions && option.helperText && (
          <div className="text-sm text-gray-500 mt-1">{option.helperText}</div>
        )}
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
        <RadioGroup
          value={selectedValue?.toString() || ''}
          onValueChange={handleValueChange}
          disabled={mode === 'builder'}
          className={cn(
            getLayoutClasses(),
            {
              'opacity-50': mode === 'builder',
            }
          )}
        >
          {processedOptions.map((option) => {
            const isSelected = selectedValue === option.value;
            
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
                  'flex items-start space-x-2 p-3 rounded-lg border transition-all cursor-pointer',
                  {
                    'border-blue-500 bg-blue-50': isSelected && !hasError,
                    'border-red-500 bg-red-50': hasError,
                    'border-gray-200 hover:border-gray-300': !isSelected && !hasError,
                    'pointer-events-none': mode === 'builder',
                  }
                )}>
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`radio-${config.id}-${option.value}`}
                    className={cn(
                      'mt-1',
                      {
                        'border-red-500': hasError,
                      }
                    )}
                  />
                  
                  <Label
                    htmlFor={`radio-${config.id}-${option.value}`}
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
        </RadioGroup>
        
        {/* Additional Information */}
        <div className="mt-2 text-xs space-y-1">
          {hasError && (
            <div className="text-red-600">Please select an option</div>
          )}
          
          {allowDeselect && selectedValue && (
            <div className="text-gray-500">
              Click the selected option again to deselect
            </div>
          )}
          
          {mode === 'builder' && randomizeOptions && (
            <div className="text-blue-600">
              Options will be randomized when the form is rendered
            </div>
          )}
          
          {processedOptions.length === 0 && mode === 'builder' && (
            <div className="text-gray-500">
              Add options to display radio buttons
            </div>
          )}
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default RadioField;
