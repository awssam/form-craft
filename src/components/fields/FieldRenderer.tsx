import React, { Suspense } from 'react';
import { FieldRendererProps, BaseFieldProps } from './base/FieldTypes';
import FieldRegistry from './FieldRegistry';
import { cn } from '@/lib/utils';

/**
 * Loading component for lazy-loaded fields
 */
const FieldLoadingSpinner: React.FC<{ fieldType: string }> = ({ fieldType }) => (
  <div className="flex items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
    <div className="text-center">
      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
      <div className="text-sm text-gray-600">Loading {fieldType} field...</div>
    </div>
  </div>
);

/**
 * Fallback component when a field type is not registered
 */
const FallbackField: React.FC<BaseFieldProps> = ({ config, className }) => {
  const registrationStats = FieldRegistry.getEnhancedStats();
  
  return (
    <div className={cn('p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50', className)}>
      <div className="text-center">
        <div className="text-red-600 font-semibold mb-2">
          Unknown Field Type
        </div>
        <div className="text-sm text-red-500 mb-2">
          Field type &ldquo;{config.type}&rdquo; is not registered
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Field ID: {config.id}
        </div>
        <details className="text-xs text-left bg-white p-2 rounded border mt-2">
          <summary className="cursor-pointer font-medium">Available Field Types</summary>
          <div className="mt-2">
            <div className="mb-1">Total registered: {registrationStats.totalFields}</div>
            <div className="grid grid-cols-2 gap-1">
              {FieldRegistry.getAvailableTypes().map(type => (
                <div key={type} className="text-blue-600">{type}</div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

/**
 * Enhanced field renderer with lazy loading and error handling support
 */
const FieldRenderer: React.FC<FieldRendererProps> = ({ 
  fieldConfig, 
  fallback: CustomFallback,
  ...props 
}) => {
  // Ensure registry is initialized
  React.useEffect(() => {
    if (!FieldRegistry.isInitialized()) {
      FieldRegistry.initialize();
    }
  }, []);

  // Get the registered field configuration
  const fieldRegistration = FieldRegistry.getFieldConfig(fieldConfig.type);
  
  // Use custom fallback or default fallback
  const FallbackComponent = CustomFallback || FallbackField;
  
  // If field type is not registered, show fallback
  if (!fieldRegistration) {
    console.warn(`Field type "${fieldConfig.type}" is not registered in FieldRegistry`);
    return <FallbackComponent config={fieldConfig} {...props} />;
  }
  
  // If field type is deprecated, log warning
  if (fieldRegistration.deprecated) {
    console.warn(`Field type "${fieldConfig.type}" is deprecated. Consider migrating to a newer field type.`);
  }
  
  // Get the component for this field type
  const FieldComponent = fieldRegistration.component;
  
  // Handle lazy loading with Suspense
  if (fieldRegistration.isLazy) {
    return (
      <Suspense fallback={<FieldLoadingSpinner fieldType={fieldConfig.type} />}>
        <FieldComponent 
          config={fieldConfig} 
          {...props} 
        />
      </Suspense>
    );
  }
  
  // Render the field component with the config as props
  return (
    <FieldComponent 
      config={fieldConfig} 
      {...props} 
    />
  );
};

/**
 * Helper function to render a field with error boundary
 */
export const FieldRendererWithErrorBoundary: React.FC<FieldRendererProps> = (props) => {
  return (
    <FieldErrorBoundary fieldId={props.fieldConfig.id} fieldType={props.fieldConfig.type}>
      <FieldRenderer {...props} />
    </FieldErrorBoundary>
  );
};

/**
 * Error boundary for field rendering
 */
class FieldErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    fieldId: string; 
    fieldType: string;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fieldId: string; fieldType: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`Field rendering error for ${this.props.fieldType} (${this.props.fieldId}):`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border-2 border-dashed border-red-300 rounded-lg bg-red-50">
          <div className="text-center">
            <div className="text-red-600 font-semibold mb-2">
              Field Rendering Error
            </div>
            <div className="text-sm text-red-500 mb-2">
              Error rendering field type &ldquo;{this.props.fieldType}&rdquo;
            </div>
            <div className="text-xs text-gray-500 mb-2">
              Field ID: {this.props.fieldId}
            </div>
            {this.state.error && (
              <details className="text-xs text-left bg-white p-2 rounded border">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.message}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to get field configuration from registry
 */
export const useFieldConfig = (fieldType: string) => {
  return React.useMemo(() => {
    return FieldRegistry.getFieldConfig(fieldType as import('@/types/form-config').FieldType);
  }, [fieldType]);
};

/**
 * Hook to get all available field types
 */
export const useAvailableFieldTypes = () => {
  const [types, setTypes] = React.useState<import('@/types/form-config').FieldType[]>([]);
  
  React.useEffect(() => {
    const updateTypes = () => {
      setTypes(FieldRegistry.getAvailableTypes());
    };
    
    // Subscribe to registry changes
    const unsubscribe = FieldRegistry.subscribe(updateTypes);
    
    // Initial load
    updateTypes();
    
    return unsubscribe;
  }, []);
  
  return types;
};

/**
 * Hook to get fields by category with real-time updates
 */
export const useFieldsByCategory = (categoryId: string) => {
  const [fields, setFields] = React.useState<import('./FieldRegistry').EnhancedFieldConfiguration[]>([]);
  
  React.useEffect(() => {
    const updateFields = () => {
      setFields(FieldRegistry.getFieldsByCategory(categoryId));
    };
    
    // Subscribe to registry changes
    const unsubscribe = FieldRegistry.subscribe(updateFields);
    
    // Initial load
    updateFields();
    
    return unsubscribe;
  }, [categoryId]);
  
  return fields;
};

/**
 * Hook to search fields with debouncing
 */
export const useSearchFields = (query: string, debounceMs: number = 300) => {
  const [results, setResults] = React.useState<import('./FieldRegistry').EnhancedFieldConfiguration[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  
  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    const timeoutId = setTimeout(() => {
      const searchResults = FieldRegistry.searchFields(query);
      setResults(searchResults);
      setIsSearching(false);
    }, debounceMs);
    
    return () => clearTimeout(timeoutId);
  }, [query, debounceMs]);
  
  return { results, isSearching };
};

/**
 * Hook to get registry statistics
 */
export const useRegistryStats = () => {
  const [stats, setStats] = React.useState(FieldRegistry.getEnhancedStats());
  
  React.useEffect(() => {
    const updateStats = () => {
      setStats(FieldRegistry.getEnhancedStats());
    };
    
    // Subscribe to registry changes
    const unsubscribe = FieldRegistry.subscribe(updateStats);
    
    return unsubscribe;
  }, []);
  
  return stats;
};

/**
 * Hook to check if registry is ready
 */
export const useRegistryReady = () => {
  const [isReady, setIsReady] = React.useState(FieldRegistry.isInitialized());
  
  React.useEffect(() => {
    if (!isReady) {
      const checkReady = () => {
        if (FieldRegistry.isInitialized()) {
          setIsReady(true);
        }
      };
      
      const unsubscribe = FieldRegistry.subscribe(checkReady);
      return unsubscribe;
    }
  }, [isReady]);
  
  return isReady;
};

export default FieldRenderer;
