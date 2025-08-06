import React, { useMemo, useState } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';

/**
 * TextareaField component for multi-line text input
 */
export interface TextareaFieldProps extends BaseFieldProps {
  /** Number of visible rows */
  rows?: number;
  
  /** Maximum number of rows before scrolling */
  maxRows?: number;
  
  /** Whether to auto-resize based on content */
  autoResize?: boolean;
  
  /** Character count limit */
  maxLength?: number;
  
  /** Whether to show character count */
  showCharCount?: boolean;
  
  /** Whether to show word count */
  showWordCount?: boolean;
  
  /** Textarea-specific props */
  textareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  config,
  mode,
  rows = 4,
  maxRows,
  autoResize = true,
  maxLength,
  showCharCount = true,
  showWordCount = false,
  textareaProps,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(config.defaultValue as string || '');
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  // Calculate character and word counts
  const charCount = inputValue.length;
  const wordCount = useMemo(() => {
    return inputValue.trim() === '' ? 0 : inputValue.trim().split(/\s+/).length;
  }, [inputValue]);

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

  // Auto-resize functionality
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    if (!autoResize) return;
    
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    
    if (maxRows) {
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const maxHeight = lineHeight * maxRows;
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
    } else {
      textarea.style.height = `${scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  };

  // Handle value change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Enforce max length
    if (maxLength && value.length > maxLength) {
      return;
    }
    
    setInputValue(value);
    onChange?.(value);
    
    // Auto-resize if enabled
    if (autoResize && textareaRef) {
      autoResizeTextarea(textareaRef);
    }
  };

  // Validation state
  const isRequired = config.validation?.custom?.required?.value;
  const hasError = false; // Will be connected to validation system in Phase 4
  const isOverLimit = maxLength ? charCount > maxLength : false;

  // Textarea classes
  const textareaClasses = cn(
    'w-full',
    'transition-all',
    'duration-200',
    'placeholder:opacity-70',
    'resize-none', // Disable manual resize if auto-resize is enabled
    {
      // Builder mode styles
      'hover:border-blue-400 focus:border-blue-500': mode === 'builder',
      'cursor-text': mode === 'builder',
      
      // Runtime mode styles
      'focus-visible:ring-2 focus-visible:ring-offset-1': mode === 'runtime',
      
      // Validation styles
      'border-red-500 focus:border-red-500': hasError || isOverLimit,
      'border-green-500': mode === 'runtime' && !hasError && isRequired && inputValue,
      
      // Auto-resize
      'resize-y': !autoResize,
      
      // Theme-specific styles
      'dark:bg-gray-800': theme?.type?.includes('dark'),
    },
    textareaProps?.className
  );

  // Enhanced config with textarea-specific validation
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'textarea' as const,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        ...(maxLength && {
          maxLength: {
            value: maxLength,
            message: `Text must not exceed ${maxLength} characters`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, maxLength]);

  const textareaElement = (
    <div className="relative">
      <Textarea
        ref={setTextareaRef}
        id={config.id}
        name={config.name}
        placeholder={config.placeholder}
        value={inputValue}
        rows={rows}
        maxLength={maxLength}
        className={textareaClasses}
        style={themeStyles}
        onChange={handleChange}
        readOnly={config.readonly}
        disabled={mode === 'builder'}
        required={isRequired}
        {...textareaProps}
      />
      
      {/* Character/Word Count Display */}
      {(showCharCount || showWordCount) && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-1 rounded">
          {showCharCount && (
            <span className={cn(isOverLimit && 'text-red-500')}>
              {charCount}
              {maxLength && `/${maxLength}`}
            </span>
          )}
          {showCharCount && showWordCount && ' • '}
          {showWordCount && (
            <span>{wordCount} words</span>
          )}
        </div>
      )}
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
        {textareaElement}
        
        {/* Additional Information */}
        <div className="mt-1 text-xs text-gray-500 space-y-1">
          {maxLength && (
            <div>
              Character limit: {maxLength}
              {isOverLimit && (
                <span className="text-red-500 ml-1">
                  (Exceeded by {charCount - maxLength})
                </span>
              )}
            </div>
          )}
          
          {autoResize && maxRows && (
            <div>Auto-resize enabled (max {maxRows} rows)</div>
          )}
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default TextareaField;
