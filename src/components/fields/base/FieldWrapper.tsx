import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { FieldWrapperProps } from './FieldTypes';
import { Label } from '@/components/ui/label';

/**
 * Common wrapper component for all fields that handles:
 * - Field labeling and required indicators
 * - Width classes and responsive behavior
 * - Builder mode controls and selection
 * - Drag and drop functionality
 * - Error state display
 * - Helper text display
 */
const FieldWrapper: React.FC<FieldWrapperProps> = ({
  children,
  field,
  mode,
  className,
  showControls = true,
  isSelected = false,
  onSelect,
  isDraggable = false,
  dragHandlers,
}) => {
  // Calculate responsive width classes
  const widthClasses = useMemo(() => {
    const width = field.width || '100%';
    const breakpoints = {
      '25%': 'w-full md:w-1/4',
      '50%': 'w-full md:w-1/2', 
      '75%': 'w-full md:w-3/4',
      '100%': 'w-full',
    };
    return breakpoints[width as keyof typeof breakpoints] || 'w-full';
  }, [field.width]);

  // Get validation state
  const validationState = useMemo(() => {
    const isRequired = field.validation?.custom?.required?.value;
    const hasCustomValidation = field.validation?.custom && 
      Object.keys(field.validation.custom).length > 0;
    
    return {
      isRequired,
      hasValidation: hasCustomValidation,
    };
  }, [field.validation]);

  // Base wrapper classes
  const wrapperClasses = cn(
    'field-wrapper',
    'flex',
    'flex-col',
    'gap-2',
    'transition-all',
    'duration-200',
    widthClasses,
    {
      // Builder mode styles
      'hover:bg-yellow-200/10': mode === 'builder',
      'py-3 px-2 rounded-lg': mode === 'builder',
      'border-2 border-yellow-400': mode === 'builder' && isSelected,
      'cursor-pointer': mode === 'builder' && onSelect,
      'cursor-grab': mode === 'builder' && isDraggable,
      'cursor-grabbing': mode === 'builder' && isDraggable && dragHandlers,
      
      // Runtime mode styles
      'mb-4': mode === 'runtime',
      
      // Validation styles
      'field-required': validationState.isRequired,
      'field-has-validation': validationState.hasValidation,
    },
    className
  );

  // Handle wrapper click for selection
  const handleWrapperClick = (e: React.MouseEvent) => {
    if (mode === 'builder' && onSelect) {
      e.stopPropagation();
      onSelect();
    }
  };

  // Drag event handlers
  const handleDragStart = () => {
    dragHandlers?.onDragStart?.();
  };

  const handleDragEnd = () => {
    dragHandlers?.onDragEnd?.();
  };

  return (
    <div
      className={wrapperClasses}
      onClick={handleWrapperClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={isDraggable}
      data-field-id={field.id}
      data-field-type={field.type}
    >
      {/* Field Label */}
      {field.label && (
        <Label 
          htmlFor={field.id}
          className={cn(
            'flex text-sm font-semibold md:text-[12px]',
            mode === 'runtime' && 'mb-1'
          )}
        >
          <span className="relative">
            {field.label}
            {validationState.isRequired && (
              <sup className="absolute top-[-0.2em] right-[-8px] ml-[1px] font-bold text-red-500 text-sm inline">
                *
              </sup>
            )}
          </span>
        </Label>
      )}

      {/* Field Content */}
      <div className="field-content">
        {children}
      </div>

      {/* Helper Text */}
      {field.helperText && (
        <p className={cn(
          'text-xs text-muted-foreground',
          mode === 'builder' && 'text-gray-500',
          mode === 'runtime' && 'mt-1'
        )}>
          {field.helperText}
        </p>
      )}

      {/* Builder Mode Controls */}
      {mode === 'builder' && showControls && isSelected && (
        <div className="field-controls absolute top-0 right-0 flex gap-1 p-1">
          <button
            type="button"
            className="w-6 h-6 bg-gray-800 text-white rounded-sm text-xs hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle duplicate field
            }}
            title="Duplicate field"
          >
            ⧉
          </button>
          <button
            type="button"
            className="w-6 h-6 bg-red-600 text-white rounded-sm text-xs hover:bg-red-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle delete field
            }}
            title="Delete field"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * Higher-order component that wraps a field component with the FieldWrapper
 */
export const withFieldWrapper = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & Omit<FieldWrapperProps, 'children'>> => {
  const WrappedComponent: React.FC<P & Omit<FieldWrapperProps, 'children'>> = (props) => {
    const { field, mode, className, showControls, isSelected, onSelect, isDraggable, dragHandlers, ...componentProps } = props;
    
    return (
      <FieldWrapper
        field={field}
        mode={mode}
        className={className}
        showControls={showControls}
        isSelected={isSelected}
        onSelect={onSelect}
        isDraggable={isDraggable}
        dragHandlers={dragHandlers}
      >
        <Component {...componentProps as P} />
      </FieldWrapper>
    );
  };
  
  WrappedComponent.displayName = `withFieldWrapper(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default FieldWrapper;
