

import React, { useMemo, useState } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { FieldEntity } from '@/types/form-config';
import TextField from './TextField';
import { cn } from '@/lib/utils';

/**
 * EmailField - A specialized wrapper around TextField with email-specific enhancements
 * This component demonstrates the migration pattern: wrap legacy fields with specialized logic
 * while maintaining all existing functionality (dragging, validation, theming, etc.)
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
  const [currentValue, setCurrentValue] = useState<string>((config.defaultValue as string) || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Create enhanced config specifically for email fields with default validation
  const enhancedConfig = useMemo((): FieldEntity => {
    const baseConfig = { ...config };
    
    // Force email type and add email-specific properties
    baseConfig.type = 'email';
    baseConfig.placeholder = baseConfig.placeholder || 'Enter your email address';
    
    // Apply default email validation rules
    const customValidation = { ...baseConfig.validation?.custom };
    
    // 1. Email format validation (always applied)
    customValidation.email = {
      value: true,
      message: 'Please enter a valid email address',
      type: 'binary' as const,
    };
    
    // 2. Required validation (default for email fields)
    baseConfig.validation = {
      ...baseConfig.validation,
      required: baseConfig.validation?.required !== false, // Default to required unless explicitly set to false
    };
    
    // 3. Minimum length validation for email
    customValidation.minLength = {
      value: 5, // Shortest possible email: a@b.c
      message: 'Email must be at least 5 characters long',
      type: 'withValue' as const,
    };
    
    // 4. Maximum length validation for email
    customValidation.maxLength = {
      value: 254, // RFC 5321 standard
      message: 'Email must not exceed 254 characters',
      type: 'withValue' as const,
    };
    
    // 5. Pattern validation for email format
    customValidation.pattern = {
      value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      message: 'Please enter a valid email address format',
      type: 'withValue' as const,
    };
    
    // 6. No consecutive dots validation
    customValidation.noConsecutiveDots = {
      value: /^(?!.*\.\.)/,
      message: 'Email cannot contain consecutive dots',
      type: 'withValue' as const,
    };
    
    // 7. Domain restriction if provided
    if (allowedDomains && allowedDomains.length > 0) {
      customValidation.allowedDomain = {
        value: allowedDomains,
        message: `Email must be from one of these domains: ${allowedDomains.join(', ')}`,
        type: 'withValue' as const,
      };
    }
    
    // 8. Block common disposable email domains (optional - can be overridden)
    const disposableDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
      'temp-mail.org'
    ];
    
    if (!baseConfig.validation?.allowDisposableEmails) {
      customValidation.noDisposableEmail = {
        value: disposableDomains,
        message: 'Disposable email addresses are not allowed',
        type: 'withValue' as const,
      };
    }
    
    // Apply all email validation rules
    baseConfig.validation = {
      ...baseConfig.validation,
      custom: customValidation,
    };
    
    return baseConfig;
  }, [config, allowedDomains]);

  // Get domain suggestions based on current input
  const filteredSuggestions = useMemo(() => {
    if (!showDomainSuggestions || !currentValue.includes('@')) return [];
    
    const [, domainPart = ''] = currentValue.split('@');
    if (!domainPart) return domainSuggestions;
    
    return domainSuggestions.filter(domain => 
      domain.toLowerCase().startsWith(domainPart.toLowerCase())
    );
  }, [currentValue, domainSuggestions, showDomainSuggestions]);

  // Handle value changes with email-specific logic
  const handleEmailChange = (value: string) => {
    setCurrentValue(value);
    
    // Show suggestions when typing domain
    setShowSuggestions(value.includes('@') && showDomainSuggestions);
    
    // Call parent onChange
    onChange?.(value);
  };

  // Handle suggestion click
  const handleSuggestionClick = (domain: string) => {
    const localPart = currentValue.split('@')[0];
    const newValue = `${localPart}@${domain}`;
    setCurrentValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(false);
  };

  // Email validation logic for visual feedback
  const emailValidation = useMemo(() => {
    if (!currentValue) return { isValid: true, message: '' };
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    const isValidFormat = emailRegex.test(currentValue);
    
    if (!isValidFormat) {
      return { isValid: false, message: 'Please enter a valid email address' };
    }
    
    // Check domain restrictions
    if (allowedDomains && allowedDomains.length > 0) {
      const domain = currentValue.split('@')[1];
      if (!allowedDomains.includes(domain)) {
        return { 
          isValid: false, 
          message: `Email domain not allowed. Allowed domains: ${allowedDomains.join(', ')}` 
        };
      }
    }
    
    return { isValid: true, message: 'Valid email address' };
  }, [currentValue, allowedDomains]);

  return (
    <div className={cn('email-field-wrapper relative', className)}>
      {/* Use TextField as the core component - maintains all existing functionality */}
      <TextField
        {...props}
        config={enhancedConfig}
        variant="email"
        onChange={handleEmailChange}
        inputProps={{
          autoComplete: 'email',
          spellCheck: false,
          className: cn({
            'border-red-500': !emailValidation.isValid && currentValue,
            'border-green-500': emailValidation.isValid && currentValue,
          }),
        }}
      />
      
      {/* Email-specific enhancements */}
      
      {/* Domain Suggestions Dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
          {filteredSuggestions.map((domain) => {
            const localPart = currentValue.split('@')[0];
            
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
      
      {/* Email-specific validation feedback */}
      {currentValue && (
        <div className="mt-1 text-xs">
          {!emailValidation.isValid ? (
            <p className="text-red-600">{emailValidation.message}</p>
          ) : (
            <p className="text-green-600">{emailValidation.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default EmailField;
