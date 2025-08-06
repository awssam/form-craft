import React, { useState, useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, parse, isValid, isBefore, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';

/**
 * DateField component with calendar picker and validation
 */
export interface DateFieldProps extends BaseFieldProps {
  /** Date format for display */
  dateFormat?: string;
  
  /** Minimum allowed date */
  minDate?: Date | string;
  
  /** Maximum allowed date */
  maxDate?: Date | string;
  
  /** Whether to show calendar popup */
  showCalendar?: boolean;
  
  /** Whether to allow manual date input */
  allowManualInput?: boolean;
  
  /** Disabled dates */
  disabledDates?: Date[];
  
  /** Disabled days of week (0 = Sunday, 6 = Saturday) */
  disabledDaysOfWeek?: number[];
  
  /** Whether to highlight today */
  highlightToday?: boolean;
  
  /** Custom date validator */
  dateValidator?: (date: Date) => boolean | string;
}

const DateField: React.FC<DateFieldProps> = ({
  config,
  mode,
  dateFormat = 'yyyy-MM-dd',
  minDate,
  maxDate,
  showCalendar = true,
  allowManualInput = true,
  disabledDates = [],
  disabledDaysOfWeek = [],
  highlightToday = true,
  dateValidator,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    const defaultValue = config.defaultValue;
    if (typeof defaultValue === 'string' && defaultValue) {
      const parsed = parse(defaultValue, dateFormat, new Date());
      return isValid(parsed) ? parsed : undefined;
    }
    if (defaultValue instanceof Date) {
      return defaultValue;
    }
    return undefined;
  });
  
  const [inputValue, setInputValue] = useState<string>(() => {
    return selectedDate ? format(selectedDate, dateFormat) : '';
  });
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [customValidationError, setCustomValidationError] = useState<string>('');

  // Parse min/max dates
  const parsedMinDate = useMemo(() => {
    if (!minDate) return undefined;
    if (minDate instanceof Date) return minDate;
    const parsed = parse(minDate, dateFormat, new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [minDate, dateFormat]);

  const parsedMaxDate = useMemo(() => {
    if (!maxDate) return undefined;
    if (maxDate instanceof Date) return maxDate;
    const parsed = parse(maxDate, dateFormat, new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [maxDate, dateFormat]);

  // Validation
  const isRequired = config.validation?.custom?.required?.value;
  const hasRequiredError = isRequired && !selectedDate;
  const hasMinDateError = selectedDate && parsedMinDate && isBefore(selectedDate, parsedMinDate);
  const hasMaxDateError = selectedDate && parsedMaxDate && isAfter(selectedDate, parsedMaxDate);
  const hasFormatError = inputValue && !selectedDate && inputValue !== '';
  const hasCustomError = customValidationError !== '';
  const hasError = hasRequiredError || hasMinDateError || hasMaxDateError || hasFormatError || hasCustomError;

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      setInputValue('');
      onChange?.(undefined);
      setIsCalendarOpen(false);
      return;
    }

    // Run custom validation
    if (dateValidator) {
      const validationResult = dateValidator(date);
      if (typeof validationResult === 'string') {
        setCustomValidationError(validationResult);
        return;
      }
      if (validationResult === false) {
        setCustomValidationError('Invalid date selection');
        return;
      }
    }

    setCustomValidationError('');
    setSelectedDate(date);
    setInputValue(format(date, dateFormat));
    onChange?.(format(date, dateFormat));
    setIsCalendarOpen(false);
  };

  // Handle manual input
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (!allowManualInput) return;
    
    if (value === '') {
      setSelectedDate(undefined);
      onChange?.(undefined);
      setCustomValidationError('');
      return;
    }

    try {
      const parsed = parse(value, dateFormat, new Date());
      if (isValid(parsed)) {
        // Run custom validation
        if (dateValidator) {
          const validationResult = dateValidator(parsed);
          if (typeof validationResult === 'string') {
            setCustomValidationError(validationResult);
            return;
          }
          if (validationResult === false) {
            setCustomValidationError('Invalid date');
            return;
          }
        }

        setCustomValidationError('');
        setSelectedDate(parsed);
        onChange?.(format(parsed, dateFormat));
      } else {
        setSelectedDate(undefined);
        setCustomValidationError('');
      }
    } catch {
      setSelectedDate(undefined);
      setCustomValidationError('');
    }
  };

  // Check if date should be disabled
  const isDateDisabled = (date: Date) => {
    // Check disabled dates
    if (disabledDates.some(disabledDate => 
      format(disabledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    )) {
      return true;
    }

    // Check disabled days of week
    if (disabledDaysOfWeek.includes(date.getDay())) {
      return true;
    }

    // Check min/max dates
    if (parsedMinDate && isBefore(date, parsedMinDate)) {
      return true;
    }

    if (parsedMaxDate && isAfter(date, parsedMaxDate)) {
      return true;
    }

    return false;
  };

  // Enhanced config
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'date' as const,
    dateFormat,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        ...(parsedMinDate && {
          minDate: {
            value: format(parsedMinDate, dateFormat),
            message: `Date must be on or after ${format(parsedMinDate, dateFormat)}`,
            type: 'withValue' as const,
          },
        }),
        ...(parsedMaxDate && {
          maxDate: {
            value: format(parsedMaxDate, dateFormat),
            message: `Date must be on or before ${format(parsedMaxDate, dateFormat)}`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, dateFormat, parsedMinDate, parsedMaxDate]);

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
        <div className="flex space-x-2">
          {/* Date Input */}
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={config.placeholder || `Enter date (${dateFormat})`}
            disabled={mode === 'builder' || !allowManualInput}
            className={cn(
              'flex-1',
              {
                'border-red-500': hasError,
                'border-green-500': !hasError && selectedDate,
              }
            )}
          />

          {/* Calendar Trigger */}
          {showCalendar && (
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={mode === 'builder'}
                  className={cn({
                    'border-red-500': hasError,
                    'border-green-500': !hasError && selectedDate,
                  })}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={isDateDisabled}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Date Information */}
        <div className="mt-2 text-xs space-y-1">
          {selectedDate && (
            <div className="text-green-600">
              Selected: {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
          )}

          {/* Validation Messages */}
          {hasRequiredError && (
            <div className="text-red-600">Please select a date</div>
          )}

          {hasFormatError && (
            <div className="text-red-600">
              Please enter a valid date in {dateFormat} format
            </div>
          )}

          {hasMinDateError && parsedMinDate && (
            <div className="text-red-600">
              Date must be on or after {format(parsedMinDate, dateFormat)}
            </div>
          )}

          {hasMaxDateError && parsedMaxDate && (
            <div className="text-red-600">
              Date must be on or before {format(parsedMaxDate, dateFormat)}
            </div>
          )}

          {hasCustomError && (
            <div className="text-red-600">{customValidationError}</div>
          )}

          {/* Helper Information */}
          {parsedMinDate && parsedMaxDate && (
            <div className="text-gray-500">
              Valid range: {format(parsedMinDate, dateFormat)} to {format(parsedMaxDate, dateFormat)}
            </div>
          )}

          {disabledDaysOfWeek.length > 0 && (
            <div className="text-gray-500">
              Disabled days: {disabledDaysOfWeek.map(day => 
                ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
              ).join(', ')}
            </div>
          )}

          {highlightToday && (
            <div className="text-blue-600">
              Today: {format(new Date(), dateFormat)}
            </div>
          )}

          {mode === 'builder' && (
            <div className="text-gray-500">
              Date format: {dateFormat}
            </div>
          )}
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default DateField;
