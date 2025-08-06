import React, { useMemo, useState } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import TextField from './TextField';
import { cn } from '@/lib/utils';

/**
 * EmailField component with built-in email validation and domain suggestions
 */
export interface EmailFieldProps extends BaseFieldProps {
  /** Allowed email domains for validation */
  allowedDomains?: string[];
  
  /** Whether to show domain suggestions */
  showDomainSuggestions?: boolean;
  
  /** Custom domain suggestions */
  domainSuggestions?: string[];
}

// Common email domain suggestions
const DEFAULT_DOMAIN_SUGGESTIONS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'icloud.com',
  'aol.com',
  'company.com',
];

const EmailField: React.FC<EmailFieldProps> = ({
  config,
  allowedDomains,
  showDomainSuggestions = true,
  domainSuggestions = DEFAULT_DOMAIN_SUGGESTIONS,
  onChange,
  className,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(config.defaultValue as string || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Email validation regex
  const emailRegex = useMemo(() => 
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
    []
  );

  // Validate email format
  const isValidEmail = useMemo(() => {
    if (!inputValue) return true; // Empty is valid (required validation handles this)
    return emailRegex.test(inputValue);
  }, [inputValue, emailRegex]);

  // Check if domain is allowed
  const isDomainAllowed = useMemo(() => {
    if (!allowedDomains || !inputValue.includes('@')) return true;
    const domain = inputValue.split('@')[1];
    return allowedDomains.includes(domain);
  }, [allowedDomains, inputValue]);

  // Get domain suggestions based on current input
  const filteredSuggestions = useMemo(() => {
    if (!showDomainSuggestions || !inputValue.includes('@')) return [];
    
    const [, domainPart = ''] = inputValue.split('@');
    if (!domainPart) return domainSuggestions;
    
    return domainSuggestions.filter(domain => 
      domain.toLowerCase().startsWith(domainPart.toLowerCase())
    );
  }, [inputValue, domainSuggestions, showDomainSuggestions]);

  // Handle input change
  const handleChange = (value: string) => {
    setInputValue(value);
    onChange?.(value);
    
    // Show suggestions when typing domain
    setShowSuggestions(value.includes('@') && showDomainSuggestions);
  };

  // Handle suggestion click
  const handleSuggestionClick = (domain: string) => {
    const localPart = inputValue.split('@')[0];
    const newValue = `${localPart}@${domain}`;
    setInputValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(false);
  };

  // Enhanced config with email-specific validation
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'email' as const,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        email: {
          value: true,
          message: 'Please enter a valid email address',
          type: 'binary' as const,
        },
        ...(allowedDomains && {
          allowedDomain: {
            value: allowedDomains,
            message: `Email must be from one of these domains: ${allowedDomains.join(', ')}`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, allowedDomains]);

  return (
    <div className={cn('email-field-container relative', className)}>
      <TextField
        {...props}
        config={enhancedConfig}
        variant="email"
        onChange={handleChange}
        inputProps={{
          autoComplete: 'email',
          spellCheck: false,
          className: cn({
            'border-red-500': !isValidEmail || !isDomainAllowed,
            'border-green-500': isValidEmail && isDomainAllowed && inputValue,
          }),
        }}
      />
      
      {/* Domain Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((domain) => {
            const localPart = inputValue.split('@')[0];
            
            return (
              <button
                key={domain}
                type="button"
                className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-none bg-transparent"
                onClick={() => handleSuggestionClick(domain)}
              >
                <span className="text-gray-600">{localPart}@</span>
                <span className="font-medium">{domain}</span>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Validation Messages */}
      {inputValue && (
        <div className="mt-1 text-xs">
          {!isValidEmail && (
            <p className="text-red-600">Please enter a valid email address</p>
          )}
          {isValidEmail && !isDomainAllowed && (
            <p className="text-red-600">
              Email domain not allowed. Allowed domains: {allowedDomains?.join(', ')}
            </p>
          )}
          {isValidEmail && isDomainAllowed && (
            <p className="text-green-600">Valid email address</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailField;
