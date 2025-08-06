import React, { useMemo, useState } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import TextField from './TextField';
import { cn } from '@/lib/utils';

/**
 * PhoneField component with international formatting and validation
 */
export interface PhoneFieldProps extends BaseFieldProps {
  /** Country code for phone formatting */
  countryCode?: string;
  
  /** Custom phone format pattern */
  format?: string;
  
  /** Whether to show country code selector */
  showCountrySelector?: boolean;
  
  /** Allowed country codes */
  allowedCountries?: string[];
}

// Common country codes and formats
const COUNTRY_FORMATS: Record<string, { format: string; example: string; regex: RegExp }> = {
  'US': {
    format: '(XXX) XXX-XXXX',
    example: '(123) 456-7890',
    regex: /^\(\d{3}\) \d{3}-\d{4}$/,
  },
  'UK': {
    format: 'XXXX XXX XXXX',
    example: '0123 456 7890',
    regex: /^\d{4} \d{3} \d{4}$/,
  },
  'CA': {
    format: '(XXX) XXX-XXXX',
    example: '(123) 456-7890',
    regex: /^\(\d{3}\) \d{3}-\d{4}$/,
  },
  'AU': {
    format: 'XXXX XXX XXX',
    example: '0412 345 678',
    regex: /^\d{4} \d{3} \d{3}$/,
  },
  'DE': {
    format: 'XXX XXXXXXXX',
    example: '030 12345678',
    regex: /^\d{3} \d{8}$/,
  },
  'FR': {
    format: 'XX XX XX XX XX',
    example: '01 23 45 67 89',
    regex: /^\d{2} \d{2} \d{2} \d{2} \d{2}$/,
  },
  'IN': {
    format: 'XXXXX XXXXX',
    example: '98765 43210',
    regex: /^\d{5} \d{5}$/,
  },
};

const DEFAULT_COUNTRIES = Object.keys(COUNTRY_FORMATS);

const PhoneField: React.FC<PhoneFieldProps> = ({
  config,
  countryCode = 'US',
  format,
  showCountrySelector = false,
  allowedCountries = DEFAULT_COUNTRIES,
  onChange,
  className,
  ...props
}) => {
  const [selectedCountry, setSelectedCountry] = useState(countryCode);
  const [inputValue, setInputValue] = useState(config.defaultValue as string || '');

  // Get current country format
  const currentFormat = useMemo(() => {
    return format ? { format, example: '', regex: /.*/ } : COUNTRY_FORMATS[selectedCountry];
  }, [selectedCountry, format]);

  // Format phone number according to country format
  const formatPhoneNumber = (value: string): string => {
    if (!currentFormat) return value;
    
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Apply format pattern
    let formatted = '';
    let digitIndex = 0;
    
    for (const char of currentFormat.format) {
      if (char === 'X' && digitIndex < digits.length) {
        formatted += digits[digitIndex];
        digitIndex++;
      } else if (char !== 'X') {
        formatted += char;
      } else {
        break;
      }
    }
    
    return formatted;
  };

  // Validate phone number format
  const isValidPhone = useMemo(() => {
    if (!inputValue) return true;
    if (!currentFormat?.regex) return true;
    return currentFormat.regex.test(inputValue);
  }, [inputValue, currentFormat]);

  // Handle input change with formatting
  const handleChange = (value: string) => {
    const formattedValue = formatPhoneNumber(value);
    setInputValue(formattedValue);
    onChange?.(formattedValue);
  };

  // Handle country change
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    // Reformat current value with new country format
    if (inputValue) {
      const formattedValue = formatPhoneNumber(inputValue);
      setInputValue(formattedValue);
      onChange?.(formattedValue);
    }
  };

  // Enhanced config with phone-specific validation
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'phone' as const,
    placeholder: config.placeholder || currentFormat?.example || 'Enter phone number',
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        phone: {
          value: true,
          message: `Please enter a valid phone number in format: ${currentFormat?.example}`,
          type: 'binary' as const,
        },
      },
    },
  }), [config, currentFormat]);

  return (
    <div className={cn('phone-field-container', className)}>
      {/* Country Selector */}
      {showCountrySelector && (
        <div className="flex gap-2 mb-2">
          <label className="text-sm font-medium text-gray-700">Country:</label>
          <select
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allowedCountries.map((country) => (
              <option key={country} value={country}>
                {country} - {COUNTRY_FORMATS[country]?.example}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <TextField
        {...props}
        config={enhancedConfig}
        variant="phone"
        onChange={handleChange}
        formatters={{
          phone: formatPhoneNumber,
        }}
        inputProps={{
          autoComplete: 'tel',
          inputMode: 'tel',
          className: cn({
            'border-red-500': !isValidPhone,
            'border-green-500': isValidPhone && inputValue,
          }),
        }}
      />
      
      {/* Format Helper */}
      {currentFormat && (
        <div className="mt-1 text-xs text-gray-500">
          Format: {currentFormat.example}
        </div>
      )}
      
      {/* Validation Messages */}
      {inputValue && !isValidPhone && (
        <div className="mt-1 text-xs text-red-600">
          Please enter a valid phone number in format: {currentFormat?.example}
        </div>
      )}
      
      {inputValue && isValidPhone && (
        <div className="mt-1 text-xs text-green-600">
          Valid phone number
        </div>
      )}
    </div>
  );
};

export default PhoneField;
