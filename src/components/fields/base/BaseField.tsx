import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { BaseFieldProps, FieldContext } from './FieldTypes';

/**
 * Base field component that provides common functionality for all field types.
 * This component handles common concerns like theming, validation state, and
 * provides a consistent interface for all field implementations.
 */
const BaseField: React.FC<BaseFieldProps> = ({
  config,
  mode,
  className,
  onConfigChange,
  validation,
  theme,
  children,
  ...props
}) => {
  // Create field context for child components (will be used by child components)
  const fieldContext = useMemo<FieldContext>(() => ({
    field: config,
    theme,
    mode,
    updateField: onConfigChange ? (fieldId: string, updates) => {
      if (fieldId === config.id) {
        onConfigChange(updates);
      }
    } : undefined,
  }), [config, theme, mode, onConfigChange]);

  // Expose field context for potential future use
  React.useEffect(() => {
    // This allows child components to access the context if needed
    if (fieldContext) {
      // Context is available for child components
    }
  }, [fieldContext]);

  // Get theme-specific styles
  const themeStyles = useMemo(() => {
    if (!theme?.properties) return {};
    
    return {
      '--primary-text-color': theme.properties.primaryTextColor,
      '--secondary-text-color': theme.properties.secondaryTextColor,
      '--input-border-color': theme.properties.inputBorderColor,
      '--input-placeholder-color': theme.properties.inputPlaceholderColor,
      '--form-background-color': theme.properties.formBackgroundColor,
      '--border-radius': theme.properties.borderRadius,
    } as React.CSSProperties;
  }, [theme]);

  // Get validation state
  const validationState = useMemo(() => {
    const hasErrors = validation?.custom && Object.keys(validation.custom).length > 0;
    const isRequired = validation?.custom?.required?.value;
    
    return {
      hasErrors,
      isRequired,
      errorMessage: hasErrors ? Object.values(validation?.custom || {})[0]?.message : undefined,
    };
  }, [validation]);

  // Base field classes
  const baseClasses = cn(
    'field-base',
    'relative',
    'transition-all',
    'duration-200',
    {
      'field-builder-mode': mode === 'builder',
      'field-runtime-mode': mode === 'runtime',
      'field-required': validationState.isRequired,
      'field-error': validationState.hasErrors,
    },
    className
  );

  return (
    <div 
      className={baseClasses}
      style={themeStyles}
      data-field-id={config.id}
      data-field-type={config.type}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Hook to access field context in child components
 */
export const useFieldContext = (): FieldContext | null => {
  const context = React.useContext(FieldContextProvider);
  return context;
};

/**
 * Field context provider
 */
const FieldContextProvider = React.createContext<FieldContext | null>(null);

/**
 * Higher-order component to provide field context
 */
export const withFieldContext = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { context: FieldContext }> => {
  const WrappedComponent: React.FC<P & { context: FieldContext }> = ({ context, ...props }) => (
    <FieldContextProvider.Provider value={context}>
      <Component {...props as P} />
    </FieldContextProvider.Provider>
  );
  
  WrappedComponent.displayName = `withFieldContext(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default BaseField;
