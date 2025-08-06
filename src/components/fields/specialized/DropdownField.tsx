import React, { useMemo, useState } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

/**
 * DropdownField component with single and multi-select support
 */
export interface DropdownFieldProps extends BaseFieldProps {
  /** Whether to allow multiple selections */
  allowMultiSelect?: boolean;
  
  /** Whether to allow custom options */
  allowCustomOptions?: boolean;
  
  /** Placeholder for search input */
  searchPlaceholder?: string;
  
  /** Whether to show search functionality */
  searchable?: boolean;
  
  /** Maximum number of selections (for multi-select) */
  maxSelections?: number;
  
  /** Custom option renderer */
  optionRenderer?: (option: { label: string; value: string | number; helperText?: string }) => React.ReactNode;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  config,
  mode,
  allowMultiSelect = false,
  allowCustomOptions = false,
  searchable = false,
  searchPlaceholder = 'Search options...',
  maxSelections,
  optionRenderer,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  //@ts-expect-error code dlkhra ma 3mro ysali
  const [selectedValues, setSelectedValues] = useState<(string | number)[]>(() => {
    const defaultValue = config.defaultValue;
    if (Array.isArray(defaultValue)) return defaultValue;
    if (defaultValue !== undefined && defaultValue !== null) return [defaultValue];
    return [];
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [customOptions, setCustomOptions] = useState<Array<{ label: string; value: string }>>([]);

  // Get options from config with custom options
  const allOptions = useMemo(() => {
    const configOptions = config.options || [];
    return [...configOptions, ...customOptions];
  }, [config.options, customOptions]);

  // Filter options based on search query
  const filteredOptions = useMemo(() => {
    if (!searchQuery) return allOptions;
    return allOptions.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allOptions, searchQuery]);

  // Get selected option labels for display
  const selectedLabels = useMemo(() => {
    return selectedValues.map(value => {
      const option = allOptions.find(opt => opt.value === value);
      return option?.label || value.toString();
    });
  }, [selectedValues, allOptions]);

  // Validation
  const isRequired = config.validation?.custom?.required?.value;
  const hasError = isRequired && selectedValues.length === 0;
  const isOverLimit = maxSelections && selectedValues.length > maxSelections;

  // Handle single selection
  const handleSingleSelect = (value: string) => {
    const newValue = value === selectedValues[0] ? [] : [value];
    setSelectedValues(newValue);
    onChange?.(allowMultiSelect ? newValue : newValue[0]);
    // setIsOpen(false);
  };

  // Handle multi-selection
  const handleMultiSelect = (value: string | number, checked: boolean) => {
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
    onChange?.(allowMultiSelect ? newValues : newValues[0]);
  };

  // Handle custom option creation
  const handleCreateCustomOption = (label: string) => {
    if (!allowCustomOptions) return;
    
    const value = `custom_${Date.now()}`;
    const newOption = { label, value };
    setCustomOptions(prev => [...prev, newOption]);
    
    if (allowMultiSelect) {
      handleMultiSelect(value, true);
    } else {
      handleSingleSelect(value);
    }
    
    setSearchQuery('');
  };

  // Remove selected value (for multi-select)
  const removeValue = (valueToRemove: string | number) => {
    const newValues = selectedValues.filter(v => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(allowMultiSelect ? newValues : newValues[0]);
  };

  // Enhanced config
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'dropdown' as const,
    allowMultiSelect,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        ...(maxSelections && {
          maxSelections: {
            value: maxSelections,
            message: `You can select at most ${maxSelections} options`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, allowMultiSelect, maxSelections]);

  // Render single select dropdown
  const renderSingleSelect = () => (
    <Select
      value={selectedValues[0]?.toString() || ''}
      onValueChange={handleSingleSelect}
      disabled={mode === 'builder'}
    >
      <SelectTrigger className={cn(
        'w-full',
        {
          'border-red-500': hasError,
          'border-green-500': !hasError && selectedValues.length > 0,
        }
      )}>
        <SelectValue placeholder={config.placeholder || 'Select an option'} />
      </SelectTrigger>
      <SelectContent>
        {filteredOptions.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {optionRenderer ? optionRenderer(option) : (
              <div>
                <div>{option.label}</div>
                {/* {option.helperText && (
                  <div className="text-xs text-gray-500">{option.helperText}</div>
                )} */}
              </div>
            )}
          </SelectItem>
        ))}
        
        {/* Custom option creation */}
        {allowCustomOptions && searchQuery && !filteredOptions.some(opt => opt.label === searchQuery) && (
          <SelectItem value={`create_${searchQuery}`} onSelect={() => handleCreateCustomOption(searchQuery)}>
            <div className="text-blue-600">+ Create &ldquo;{searchQuery}&rdquo;</div>
          </SelectItem>
        )}
      </SelectContent>
    </Select>
  );

  // Render multi-select dropdown
  const renderMultiSelect = () => (
    <div className="space-y-2">
      {/* Selected values display */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedLabels.map((label, index) => (
            <Badge
              key={selectedValues[index]}
              variant="secondary"
              className="text-xs"
            >
              {label}
              <button
                type="button"
                onClick={() => removeValue(selectedValues[index])}
                className="ml-1 hover:text-red-500"
                disabled={mode === 'builder'}
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
      
      {/* Options list */}
      <div className={cn(
        'border rounded-md p-2 max-h-40 overflow-y-auto',
        {
          'border-red-500': hasError || isOverLimit,
          'border-green-500': !hasError && !isOverLimit && selectedValues.length > 0,
        }
      )}>
        {/* Search input */}
        {searchable && (
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 text-sm border-b mb-2 focus:outline-none"
            disabled={mode === 'builder'}
          />
        )}
        
        {/* Options */}
        <div className="space-y-1">
          {filteredOptions.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            
            return (
              <label
                key={option.value}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => 
                    handleMultiSelect(option.value, checked as boolean)
                  }
                   //@ts-expect-error code dlkhra ma 3mro ysali
                  disabled={mode === 'builder' || (maxSelections && !isSelected && selectedValues.length >= maxSelections)}
                />
                <div className="flex-1">
                  {optionRenderer ? optionRenderer(option) : (
                    <div>
                      <div className="text-sm">{option.label}</div>
                      {/* {option.helperText && (
                        <div className="text-xs text-gray-500">{option.helperText}</div>
                      )} */}
                    </div>
                  )}
                </div>
              </label>
            );
          })}
          
          {/* Custom option creation */}
          {allowCustomOptions && searchQuery && !filteredOptions.some(opt => opt.label === searchQuery) && (
            <button
              type="button"
              onClick={() => handleCreateCustomOption(searchQuery)}
              className="w-full text-left p-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              disabled={mode === 'builder'}
            >
              + Create &ldquo;{searchQuery}&rdquo;
            </button>
          )}
        </div>
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
        {allowMultiSelect ? renderMultiSelect() : renderSingleSelect()}
        
        {/* Validation Messages */}
        <div className="mt-1 text-xs space-y-1">
          {hasError && (
            <div className="text-red-600">Please select an option</div>
          )}
          
          {isOverLimit && (
            <div className="text-red-600">
              You can select at most {maxSelections} options
            </div>
          )}
          
          {maxSelections && allowMultiSelect && (
            <div className="text-gray-500">
              {selectedValues.length}/{maxSelections} selected
            </div>
          )}
          
          {allowCustomOptions && (
            <div className="text-gray-500">
              You can create custom options by typing and selecting
            </div>
          )}
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default DropdownField;
