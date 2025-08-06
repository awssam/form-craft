import React, { useMemo, useState } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import TextField from './TextField';
import { cn } from '@/lib/utils';

/**
 * NumberField component with constraints, formatting, and step validation
 */
export interface NumberFieldProps extends BaseFieldProps {
  /** Minimum allowed value */
  min?: number;
  
  /** Maximum allowed value */
  max?: number;
  
  /** Step increment for number input */
  step?: number;
  
  /** Number of decimal places */
  decimalPlaces?: number;
  
  /** Whether to format as currency */
  currency?: {
    code: string;
    symbol: string;
    position: 'before' | 'after';
  };
  
  /** Whether to show thousands separator */
  thousandsSeparator?: boolean;
  
  /** Custom number formatter */
  formatter?: (value: number) => string;
}

const NumberField: React.FC<NumberFieldProps> = ({
  config,
  min,
  max,
  step = 1,
  decimalPlaces,
  currency,
  thousandsSeparator = false,
  formatter,
  onChange,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(config.defaultValue?.toString() || '');
  const [isFocused, setIsFocused] = useState(false);

  // Parse numeric value from input
  const numericValue = useMemo(() => {
    const cleanValue = inputValue.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanValue);
    return isNaN(parsed) ? null : parsed;
  }, [inputValue]);

  // Validate number constraints
  const validation = useMemo(() => {
    if (numericValue === null && inputValue !== '') {
      return { isValid: false, message: 'Please enter a valid number' };
    }
    
    if (numericValue !== null) {
      if (min !== undefined && numericValue < min) {
        return { isValid: false, message: `Value must be at least ${min}` };
      }
      
      if (max !== undefined && numericValue > max) {
        return { isValid: false, message: `Value must be at most ${max}` };
      }
      
      if (step !== undefined && (numericValue % step) !== 0) {
        return { isValid: false, message: `Value must be a multiple of ${step}` };
      }
      
      if (decimalPlaces !== undefined) {
        const decimals = (numericValue.toString().split('.')[1] || '').length;
        if (decimals > decimalPlaces) {
          return { isValid: false, message: `Value can have at most ${decimalPlaces} decimal places` };
        }
      }
    }
    
    return { isValid: true, message: '' };
  }, [numericValue, min, max, step, decimalPlaces, inputValue]);

  // Format number for display
  const formatNumber = (value: number): string => {
    if (formatter) {
      return formatter(value);
    }
    
    let formatted = value.toFixed(decimalPlaces || 0);
    
    // Add thousands separator
    if (thousandsSeparator) {
      const parts = formatted.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      formatted = parts.join('.');
    }
    
    // Add currency formatting
    if (currency) {
      if (currency.position === 'before') {
        formatted = `${currency.symbol}${formatted}`;
      } else {
        formatted = `${formatted} ${currency.symbol}`;
      }
    }
    
    return formatted;
  };

  // Handle input change
  const handleChange = (value: string) => {
    setInputValue(value);
    
    // Parse and validate number
    const cleanValue = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleanValue);
    
    if (!isNaN(parsed)) {
      onChange?.(parsed);
    } else if (value === '') {
      onChange?.(null);
    }
  };

  // Handle focus events for formatting
  const handleFocus = () => {
    setIsFocused(true);
    // Show raw number when focused
    if (numericValue !== null) {
      setInputValue(numericValue.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format number when not focused
    if (numericValue !== null && validation.isValid) {
      setInputValue(formatNumber(numericValue));
    }
  };

  // Enhanced config with number-specific validation
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'number' as const,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        number: {
          value: true,
          message: 'Please enter a valid number',
          type: 'binary' as const,
        },
        ...(min !== undefined && {
          min: {
            value: min,
            message: `Value must be at least ${min}`,
            type: 'withValue' as const,
          },
        }),
        ...(max !== undefined && {
          max: {
            value: max,
            message: `Value must be at most ${max}`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, min, max]);

  // Display value (formatted when not focused, raw when focused)
  const displayValue = isFocused ? inputValue : (numericValue !== null ? formatNumber(numericValue) : inputValue);

  return (
    <div className={cn('number-field-container', className)}>
      <TextField
        {...props}
        config={enhancedConfig}
        variant="number"
        onChange={handleChange}
        inputProps={{
          inputMode: 'decimal',
          min,
          max,
          step,
          onFocus: handleFocus,
          onBlur: handleBlur,
          value: displayValue,
          className: cn({
            'border-red-500': !validation.isValid,
            'border-green-500': validation.isValid && inputValue && numericValue !== null,
          }),
        }}
      />
      
      {/* Constraints Display */}
      {(min !== undefined || max !== undefined) && (
        <div className="mt-1 text-xs text-gray-500">
          {min !== undefined && max !== undefined 
            ? `Range: ${min} - ${max}`
            : min !== undefined 
            ? `Minimum: ${min}`
            : `Maximum: ${max}`
          }
          {step !== undefined && step !== 1 && ` (Step: ${step})`}
        </div>
      )}
      
      {/* Validation Messages */}
      {!validation.isValid && (
        <div className="mt-1 text-xs text-red-600">
          {validation.message}
        </div>
      )}
      
      {validation.isValid && inputValue && numericValue !== null && (
        <div className="mt-1 text-xs text-green-600">
          Valid number
          {currency && ` (${currency.code})`}
        </div>
      )}
    </div>
  );
};

export default NumberField;
