# Custom Hooks

## 🪝 Custom Hooks Overview

FormCraft uses a comprehensive set of custom React hooks to manage complex form behaviors, state synchronization, and user interactions. These hooks encapsulate business logic and provide reusable functionality across components.

## 📁 Hooks Directory Structure

```
src/hooks/
├── useCopyInfo.tsx              # Copy to clipboard functionality
├── useDebounceEffect.tsx        # Debounced effects for performance
├── useDynamicFontLoader.tsx     # Dynamic font loading for themes
├── useFeatureAnnouncer.tsx      # Feature announcements system
├── useFieldConditionalLogicCheck.tsx # Conditional field visibility
├── useFieldUnregister.tsx       # Form field cleanup
├── useFormSectionDisplay.tsx    # Multi-page form navigation
├── useFormSubmissionId.tsx      # Submission session management
├── useMediaQuery.tsx            # Responsive design helpers
├── usePopulateFieldValidation.tsx # Dynamic validation rules
```

## 🔄 Form Management Hooks

### useFormSectionDisplay (`src/hooks/useFormSectionDisplay.tsx`)

Manages multi-page form navigation and section visibility.

```typescript
import { useState, useCallback, useMemo } from 'react';
import { useFormState } from '@/zustand/store';
import { FormField } from '@/types/form-config';

interface UseFormSectionDisplayProps {
  fields: FormField[];
  conditionalLogic?: Record<string, any>;
  allowGoingBack?: boolean;
}

interface UseFormSectionDisplayReturn {
  currentPage: number;
  totalPages: number;
  currentFields: FormField[];
  canGoNext: boolean;
  canGoPrevious: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  goToPage: (page: number) => void;
  isFieldVisible: (field: FormField) => boolean;
  getPageProgress: () => number;
  isLastPage: boolean;
  isFirstPage: boolean;
}

export const useFormSectionDisplay = ({
  fields,
  conditionalLogic = {},
  allowGoingBack = true,
}: UseFormSectionDisplayProps): UseFormSectionDisplayReturn => {
  const [currentPage, setCurrentPage] = useState(0);
  const { formData } = useFormState();

  // Group fields by page
  const pageGroups = useMemo(() => {
    const groups: FormField[][] = [];
    let currentGroup: FormField[] = [];

    fields.forEach((field) => {
      if (field.type === 'page_break') {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      } else {
        currentGroup.push(field);
      }
    });

    // Add the last group if it has fields
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups.length > 0 ? groups : [fields];
  }, [fields]);

  // Check if field should be visible based on conditional logic
  const isFieldVisible = useCallback((field: FormField): boolean => {
    const logic = conditionalLogic[field.id];
    if (!logic) return true;

    const { conditions, operator = 'and' } = logic;
    if (!conditions || conditions.length === 0) return true;

    const results = conditions.map((condition: any) => {
      const fieldValue = formData[condition.fieldId];
      const expectedValue = condition.value;

      switch (condition.operator) {
        case 'equals':
          return fieldValue === expectedValue;
        case 'not_equals':
          return fieldValue !== expectedValue;
        case 'contains':
          return String(fieldValue).toLowerCase().includes(String(expectedValue).toLowerCase());
        case 'not_empty':
          return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
        case 'empty':
          return fieldValue === null || fieldValue === undefined || fieldValue === '';
        case 'greater_than':
          return Number(fieldValue) > Number(expectedValue);
        case 'less_than':
          return Number(fieldValue) < Number(expectedValue);
        case 'in_array':
          return Array.isArray(fieldValue) && fieldValue.includes(expectedValue);
        default:
          return true;
      }
    });

    return operator === 'and' 
      ? results.every(Boolean) 
      : results.some(Boolean);
  }, [formData, conditionalLogic]);

  // Get visible fields for current page
  const currentFields = useMemo(() => {
    if (currentPage >= pageGroups.length) return [];
    return pageGroups[currentPage].filter(isFieldVisible);
  }, [currentPage, pageGroups, isFieldVisible]);

  // Calculate total pages (only count pages with visible fields)
  const totalPages = useMemo(() => {
    return pageGroups.filter(group => 
      group.some(field => isFieldVisible(field))
    ).length;
  }, [pageGroups, isFieldVisible]);

  // Navigation functions
  const goToNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const goToPrevious = useCallback(() => {
    if (allowGoingBack && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  }, [allowGoingBack, currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  // Check navigation availability
  const canGoNext = currentPage < totalPages - 1;
  const canGoPrevious = allowGoingBack && currentPage > 0;
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;

  // Calculate progress percentage
  const getPageProgress = useCallback(() => {
    if (totalPages === 0) return 0;
    return Math.round(((currentPage + 1) / totalPages) * 100);
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    currentFields,
    canGoNext,
    canGoPrevious,
    goToNext,
    goToPrevious,
    goToPage,
    isFieldVisible,
    getPageProgress,
    isLastPage,
    isFirstPage,
  };
};
```

### useFieldConditionalLogicCheck (`src/hooks/useFieldConditionalLogicCheck.tsx`)

Handles conditional field visibility and validation.

```typescript
import { useCallback, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { FormField, ConditionalLogic } from '@/types/form-config';

interface UseFieldConditionalLogicCheckProps {
  field: FormField;
  conditionalLogic: Record<string, ConditionalLogic>;
  control: any; // React Hook Form control
}

interface UseFieldConditionalLogicCheckReturn {
  isVisible: boolean;
  isRequired: boolean;
  isDisabled: boolean;
  dependentFields: string[];
  shouldValidate: boolean;
}

export const useFieldConditionalLogicCheck = ({
  field,
  conditionalLogic,
  control,
}: UseFieldConditionalLogicCheckProps): UseFieldConditionalLogicCheckReturn => {
  const logic = conditionalLogic[field.id];
  
  // Watch all dependent field values
  const dependentFields = useMemo(() => {
    if (!logic?.conditions) return [];
    return logic.conditions.map((condition: any) => condition.fieldId);
  }, [logic]);

  const watchedValues = useWatch({
    control,
    name: dependentFields,
  });

  // Evaluate conditional logic
  const evaluateCondition = useCallback((condition: any, value: any) => {
    const { operator, value: expectedValue } = condition;

    switch (operator) {
      case 'equals':
        return value === expectedValue;
      case 'not_equals':
        return value !== expectedValue;
      case 'contains':
        return String(value || '').toLowerCase().includes(String(expectedValue).toLowerCase());
      case 'not_contains':
        return !String(value || '').toLowerCase().includes(String(expectedValue).toLowerCase());
      case 'starts_with':
        return String(value || '').toLowerCase().startsWith(String(expectedValue).toLowerCase());
      case 'ends_with':
        return String(value || '').toLowerCase().endsWith(String(expectedValue).toLowerCase());
      case 'not_empty':
        return value !== null && value !== undefined && value !== '';
      case 'empty':
        return value === null || value === undefined || value === '';
      case 'greater_than':
        return Number(value) > Number(expectedValue);
      case 'greater_than_or_equal':
        return Number(value) >= Number(expectedValue);
      case 'less_than':
        return Number(value) < Number(expectedValue);
      case 'less_than_or_equal':
        return Number(value) <= Number(expectedValue);
      case 'in_array':
        return Array.isArray(value) && value.includes(expectedValue);
      case 'not_in_array':
        return !Array.isArray(value) || !value.includes(expectedValue);
      case 'array_contains':
        return Array.isArray(expectedValue) && expectedValue.includes(value);
      case 'array_not_contains':
        return !Array.isArray(expectedValue) || !expectedValue.includes(value);
      case 'regex_match':
        try {
          const regex = new RegExp(expectedValue);
          return regex.test(String(value || ''));
        } catch {
          return false;
        }
      default:
        return true;
    }
  }, []);

  // Calculate visibility
  const isVisible = useMemo(() => {
    if (!logic?.conditions || logic.conditions.length === 0) {
      return true;
    }

    const results = logic.conditions.map((condition: any, index: number) => {
      const fieldValue = Array.isArray(watchedValues) ? watchedValues[index] : watchedValues;
      return evaluateCondition(condition, fieldValue);
    });

    return logic.operator === 'and' 
      ? results.every(Boolean) 
      : results.some(Boolean);
  }, [logic, watchedValues, evaluateCondition]);

  // Calculate if field should be required
  const isRequired = useMemo(() => {
    if (!isVisible) return false;
    
    // Check for dynamic required logic
    const requiredLogic = logic?.actions?.required;
    if (requiredLogic) {
      return requiredLogic.enabled;
    }
    
    return field.required || false;
  }, [isVisible, logic, field.required]);

  // Calculate if field should be disabled
  const isDisabled = useMemo(() => {
    if (!isVisible) return true;
    
    const disabledLogic = logic?.actions?.disabled;
    if (disabledLogic) {
      return disabledLogic.enabled;
    }
    
    return field.disabled || false;
  }, [isVisible, logic, field.disabled]);

  // Determine if field should be validated
  const shouldValidate = isVisible && !isDisabled;

  return {
    isVisible,
    isRequired,
    isDisabled,
    dependentFields,
    shouldValidate,
  };
};
```

### usePopulateFieldValidation (`src/hooks/usePopulateFieldValidation.tsx`)

Dynamically generates validation rules for form fields.

```typescript
import { useMemo } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { FormField, ValidationRule } from '@/types/form-config';

interface UsePopulateFieldValidationProps {
  field: FormField;
  isRequired: boolean;
  isVisible: boolean;
  customValidation?: ValidationRule[];
}

interface UsePopulateFieldValidationReturn {
  validationRules: RegisterOptions;
  errorMessages: Record<string, string>;
}

export const usePopulateFieldValidation = ({
  field,
  isRequired,
  isVisible,
  customValidation = [],
}: UsePopulateFieldValidationProps): UsePopulateFieldValidationReturn => {
  const validationRules = useMemo((): RegisterOptions => {
    if (!isVisible) {
      return { required: false };
    }

    const rules: RegisterOptions = {};

    // Required validation
    if (isRequired) {
      rules.required = `${field.label} is required`;
    }

    // Type-specific validation
    switch (field.type) {
      case 'email':
        rules.pattern = {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Please enter a valid email address',
        };
        break;

      case 'url':
        rules.pattern = {
          value: /^https?:\/\/.+/i,
          message: 'Please enter a valid URL',
        };
        break;

      case 'phone':
        rules.pattern = {
          value: /^[\+]?[1-9][\d]{0,15}$/,
          message: 'Please enter a valid phone number',
        };
        break;

      case 'number':
        rules.valueAsNumber = true;
        
        if (field.validation?.min !== undefined) {
          rules.min = {
            value: field.validation.min,
            message: `Minimum value is ${field.validation.min}`,
          };
        }
        
        if (field.validation?.max !== undefined) {
          rules.max = {
            value: field.validation.max,
            message: `Maximum value is ${field.validation.max}`,
          };
        }
        break;

      case 'text':
      case 'textarea':
        if (field.validation?.minLength) {
          rules.minLength = {
            value: field.validation.minLength,
            message: `Minimum length is ${field.validation.minLength} characters`,
          };
        }
        
        if (field.validation?.maxLength) {
          rules.maxLength = {
            value: field.validation.maxLength,
            message: `Maximum length is ${field.validation.maxLength} characters`,
          };
        }
        break;

      case 'file':
        rules.validate = {
          fileSize: (files: FileList) => {
            if (!files || files.length === 0) return true;
            
            const maxSize = field.validation?.maxFileSize || 10 * 1024 * 1024; // 10MB default
            const file = files[0];
            
            if (file.size > maxSize) {
              return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
            }
            return true;
          },
          fileType: (files: FileList) => {
            if (!files || files.length === 0) return true;
            
            const allowedTypes = field.validation?.allowedFileTypes || [];
            if (allowedTypes.length === 0) return true;
            
            const file = files[0];
            const fileExtension = file.name.split('.').pop()?.toLowerCase();
            
            if (!fileExtension || !allowedTypes.includes(fileExtension)) {
              return `File type must be one of: ${allowedTypes.join(', ')}`;
            }
            return true;
          },
        };
        break;

      case 'checkbox':
        if (field.validation?.minChecked) {
          rules.validate = (value: string[]) => {
            if (!Array.isArray(value)) return true;
            if (value.length < field.validation!.minChecked!) {
              return `Please select at least ${field.validation!.minChecked} options`;
            }
            return true;
          };
        }
        
        if (field.validation?.maxChecked) {
          rules.validate = {
            ...rules.validate,
            maxChecked: (value: string[]) => {
              if (!Array.isArray(value)) return true;
              if (value.length > field.validation!.maxChecked!) {
                return `Please select no more than ${field.validation!.maxChecked} options`;
              }
              return true;
            },
          };
        }
        break;
    }

    // Custom validation rules
    if (customValidation.length > 0) {
      const customValidators = customValidation.reduce((acc, rule) => {
        acc[rule.name] = (value: any) => {
          try {
            // Execute custom validation function
            const isValid = new Function('value', 'field', rule.function)(value, field);
            return isValid || rule.message;
          } catch (error) {
            console.error('Custom validation error:', error);
            return rule.message;
          }
        };
        return acc;
      }, {} as Record<string, (value: any) => boolean | string>);

      rules.validate = {
        ...rules.validate,
        ...customValidators,
      };
    }

    // Pattern validation
    if (field.validation?.pattern) {
      rules.pattern = {
        value: new RegExp(field.validation.pattern),
        message: field.validation.patternMessage || 'Invalid format',
      };
    }

    return rules;
  }, [field, isRequired, isVisible, customValidation]);

  // Error messages mapping
  const errorMessages = useMemo(() => {
    const messages: Record<string, string> = {
      required: `${field.label} is required`,
      pattern: 'Invalid format',
      minLength: `Minimum length is ${field.validation?.minLength} characters`,
      maxLength: `Maximum length is ${field.validation?.maxLength} characters`,
      min: `Minimum value is ${field.validation?.min}`,
      max: `Maximum value is ${field.validation?.max}`,
    };

    // Add custom validation messages
    customValidation.forEach(rule => {
      messages[rule.name] = rule.message;
    });

    return messages;
  }, [field, customValidation]);

  return {
    validationRules,
    errorMessages,
  };
};
```

## 🎨 UI and Interaction Hooks

### useDynamicFontLoader (`src/hooks/useDynamicFontLoader.tsx`)

Dynamically loads Google Fonts for form themes.

```typescript
import { useEffect, useState } from 'react';

interface UseDynamicFontLoaderProps {
  fontFamily: string;
  fontWeights?: number[];
}

interface UseDynamicFontLoaderReturn {
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useDynamicFontLoader = ({
  fontFamily,
  fontWeights = [400, 500, 600, 700],
}: UseDynamicFontLoaderProps): UseDynamicFontLoaderReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip loading for system fonts
    const systemFonts = [
      'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 
      'Verdana', 'Courier New', 'monospace', 'serif', 'sans-serif'
    ];
    
    if (systemFonts.includes(fontFamily)) {
      setIsLoaded(true);
      return;
    }

    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href*="${fontFamily.replace(' ', '+')}"]`);
    if (existingLink) {
      setIsLoaded(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create Google Fonts URL
    const weightsString = fontWeights.join(',');
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@${weightsString}&display=swap`;

    // Create and load font link
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;

    const handleLoad = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    const handleError = () => {
      setError(`Failed to load font: ${fontFamily}`);
      setIsLoading(false);
    };

    link.addEventListener('load', handleLoad);
    link.addEventListener('error', handleError);

    document.head.appendChild(link);

    // Cleanup function
    return () => {
      link.removeEventListener('load', handleLoad);
      link.removeEventListener('error', handleError);
      // Don't remove the link on cleanup to avoid re-loading
    };
  }, [fontFamily, fontWeights]);

  return {
    isLoaded,
    isLoading,
    error,
  };
};
```

### useMediaQuery (`src/hooks/useMediaQuery.tsx`)

Responsive design helper for media queries.

```typescript
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener (using both methods for compatibility)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [query]);

  return matches;
};

// Predefined breakpoint hooks
export const useIsMobile = () => useMediaQuery('(max-width: 768px)');
export const useIsTablet = () => useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 1025px)');
export const useIsLargeScreen = () => useMediaQuery('(min-width: 1440px)');

// Orientation hooks
export const useIsPortrait = () => useMediaQuery('(orientation: portrait)');
export const useIsLandscape = () => useMediaQuery('(orientation: landscape)');

// Preference hooks
export const usePrefersReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');
export const usePrefersDarkMode = () => useMediaQuery('(prefers-color-scheme: dark)');
export const usePrefersHighContrast = () => useMediaQuery('(prefers-contrast: high)');
```

## 🔧 Utility Hooks

### useDebounceEffect (`src/hooks/useDebounceEffect.tsx`)

Debounced effect hook for performance optimization.

```typescript
import { useEffect, useRef } from 'react';

export const useDebounceEffect = (
  effect: () => void,
  dependencies: React.DependencyList,
  delay: number = 300
): void => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      effect();
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [...dependencies, delay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};

// Debounced value hook
export const useDebounceValue = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};
```

### useCopyInfo (`src/hooks/useCopyInfo.tsx`)

Copy to clipboard functionality with feedback.

```typescript
import { useState, useCallback } from 'react';

interface UseCopyInfoReturn {
  copied: boolean;
  copyToClipboard: (text: string) => Promise<boolean>;
  resetCopied: () => void;
}

export const useCopyInfo = (resetDelay: number = 2000): UseCopyInfoReturn => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      // Modern Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        
        // Auto-reset after delay
        setTimeout(() => setCopied(false), resetDelay);
        return true;
      }
      
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      textArea.remove();
      
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), resetDelay);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, [resetDelay]);

  const resetCopied = useCallback(() => {
    setCopied(false);
  }, []);

  return {
    copied,
    copyToClipboard,
    resetCopied,
  };
};
```

### useFormSubmissionId (`src/hooks/useFormSubmissionId.tsx`)

Manages form submission session tracking.

```typescript
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface UseFormSubmissionIdProps {
  formId: string;
  userId?: string;
}

interface UseFormSubmissionIdReturn {
  submissionId: string;
  sessionId: string;
  regenerateSubmissionId: () => void;
  resetSession: () => void;
}

export const useFormSubmissionId = ({
  formId,
  userId,
}: UseFormSubmissionIdProps): UseFormSubmissionIdReturn => {
  const [submissionId, setSubmissionId] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  // Generate session ID on mount
  useEffect(() => {
    const session = sessionStorage.getItem(`form-session-${formId}`) || uuidv4();
    sessionStorage.setItem(`form-session-${formId}`, session);
    setSessionId(session);
  }, [formId]);

  // Generate submission ID
  useEffect(() => {
    const newSubmissionId = uuidv4();
    setSubmissionId(newSubmissionId);
  }, [formId, userId]);

  const regenerateSubmissionId = useCallback(() => {
    const newSubmissionId = uuidv4();
    setSubmissionId(newSubmissionId);
  }, []);

  const resetSession = useCallback(() => {
    const newSession = uuidv4();
    sessionStorage.setItem(`form-session-${formId}`, newSession);
    setSessionId(newSession);
    regenerateSubmissionId();
  }, [formId, regenerateSubmissionId]);

  return {
    submissionId,
    sessionId,
    regenerateSubmissionId,
    resetSession,
  };
};
```

### useFieldUnregister (`src/hooks/useFieldUnregister.tsx`)

Handles cleanup of form fields when they become invisible.

```typescript
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface UseFieldUnregisterProps {
  fieldName: string;
  isVisible: boolean;
  form: UseFormReturn<any>;
  shouldClearValue?: boolean;
}

export const useFieldUnregister = ({
  fieldName,
  isVisible,
  form,
  shouldClearValue = true,
}: UseFieldUnregisterProps): void => {
  const { unregister, setValue } = form;

  useEffect(() => {
    if (!isVisible) {
      // Clear field value if specified
      if (shouldClearValue) {
        setValue(fieldName, null);
      }
      
      // Unregister field from form validation
      unregister(fieldName);
    }
  }, [fieldName, isVisible, unregister, setValue, shouldClearValue]);
};
```

### useFeatureAnnouncer (`src/hooks/useFeatureAnnouncer.tsx`)

Manages feature announcements and notifications.

```typescript
import { useState, useEffect, useCallback } from 'react';

interface FeatureAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'feature';
  isNew: boolean;
  dismissible: boolean;
  expiresAt?: Date;
}

interface UseFeatureAnnouncerReturn {
  announcements: FeatureAnnouncement[];
  dismissAnnouncement: (id: string) => void;
  markAsRead: (id: string) => void;
  hasNewAnnouncements: boolean;
}

export const useFeatureAnnouncer = (): UseFeatureAnnouncerReturn => {
  const [announcements, setAnnouncements] = useState<FeatureAnnouncement[]>([]);

  // Load announcements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('feature-announcements');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAnnouncements(parsed.filter((a: FeatureAnnouncement) => 
          !a.expiresAt || new Date(a.expiresAt) > new Date()
        ));
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    }

    // Load new announcements from API
    fetchNewAnnouncements();
  }, []);

  const fetchNewAnnouncements = async () => {
    try {
      const response = await fetch('/api/announcements');
      const newAnnouncements = await response.json();
      
      setAnnouncements(prev => {
        const combined = [...prev];
        
        newAnnouncements.forEach((newAnn: FeatureAnnouncement) => {
          if (!combined.find(existing => existing.id === newAnn.id)) {
            combined.push({ ...newAnn, isNew: true });
          }
        });
        
        return combined;
      });
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Save to localStorage when announcements change
  useEffect(() => {
    localStorage.setItem('feature-announcements', JSON.stringify(announcements));
  }, [announcements]);

  const dismissAnnouncement = useCallback((id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setAnnouncements(prev => 
      prev.map(ann => 
        ann.id === id ? { ...ann, isNew: false } : ann
      )
    );
  }, []);

  const hasNewAnnouncements = announcements.some(ann => ann.isNew);

  return {
    announcements,
    dismissAnnouncement,
    markAsRead,
    hasNewAnnouncements,
  };
};
```

This comprehensive set of custom hooks provides the foundation for FormCraft's complex form behaviors, user interactions, and state management while maintaining clean, reusable, and testable code patterns.
