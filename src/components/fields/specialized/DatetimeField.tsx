import React, { useState, useMemo } from 'react';
import { BaseFieldProps } from '../base/FieldTypes';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { format, parse, isValid, isBefore, isAfter } from 'date-fns';
import { cn } from '@/lib/utils';
import FieldWrapper from '../base/FieldWrapper';
import BaseField from '../base/BaseField';

/**
 * DatetimeField component with date and time picker
 */
export interface DatetimeFieldProps extends BaseFieldProps {
  /** Datetime format for display */
  datetimeFormat?: string;
  
  /** Whether to show seconds */
  showSeconds?: boolean;
  
  /** Whether to use 24-hour format */
  use24HourFormat?: boolean;
  
  /** Minimum allowed datetime */
  minDatetime?: Date | string;
  
  /** Maximum allowed datetime */
  maxDatetime?: Date | string;
  
  /** Time step in minutes */
  timeStep?: number;
  
  /** Whether to show calendar popup */
  showCalendar?: boolean;
  
  /** Whether to allow manual datetime input */
  allowManualInput?: boolean;
  
  /** Disabled dates */
  disabledDates?: Date[];
  
  /** Disabled hours (0-23) */
  disabledHours?: number[];
  
  /** Custom datetime validator */
  datetimeValidator?: (datetime: Date) => boolean | string;
}

const DatetimeField: React.FC<DatetimeFieldProps> = ({
  config,
  mode,
  datetimeFormat = 'yyyy-MM-dd HH:mm',
  showSeconds = false,
  use24HourFormat = true,
  minDatetime,
  maxDatetime,
  timeStep = 15,
  showCalendar = true,
  allowManualInput = true,
  disabledDates = [],
  disabledHours = [],
  datetimeValidator,
  className,
  onChange,
  onConfigChange,
  theme,
  ...props
}) => {
  const [selectedDatetime, setSelectedDatetime] = useState<Date | undefined>(() => {
    const defaultValue = config.defaultValue;
    if (typeof defaultValue === 'string' && defaultValue) {
      const parsed = parse(defaultValue, datetimeFormat, new Date());
      return isValid(parsed) ? parsed : undefined;
    }
    if (defaultValue instanceof Date) {
      return defaultValue;
    }
    return undefined;
  });
  
  const [inputValue, setInputValue] = useState<string>(() => {
    return selectedDatetime ? format(selectedDatetime, datetimeFormat) : '';
  });
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(selectedDatetime?.getHours() || 0);
  const [selectedMinute, setSelectedMinute] = useState<number>(selectedDatetime?.getMinutes() || 0);
  const [selectedSecond, setSelectedSecond] = useState<number>(selectedDatetime?.getSeconds() || 0);
  const [customValidationError, setCustomValidationError] = useState<string>('');

  // Parse min/max datetimes
  const parsedMinDatetime = useMemo(() => {
    if (!minDatetime) return undefined;
    if (minDatetime instanceof Date) return minDatetime;
    const parsed = parse(minDatetime, datetimeFormat, new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [minDatetime, datetimeFormat]);

  const parsedMaxDatetime = useMemo(() => {
    if (!maxDatetime) return undefined;
    if (maxDatetime instanceof Date) return maxDatetime;
    const parsed = parse(maxDatetime, datetimeFormat, new Date());
    return isValid(parsed) ? parsed : undefined;
  }, [maxDatetime, datetimeFormat]);

  // Validation
  const isRequired = config.validation?.custom?.required?.value;
  const hasRequiredError = isRequired && !selectedDatetime;
  const hasMinDatetimeError = selectedDatetime && parsedMinDatetime && isBefore(selectedDatetime, parsedMinDatetime);
  const hasMaxDatetimeError = selectedDatetime && parsedMaxDatetime && isAfter(selectedDatetime, parsedMaxDatetime);
  const hasFormatError = inputValue && !selectedDatetime && inputValue !== '';
  const hasCustomError = customValidationError !== '';
  const hasError = hasRequiredError || hasMinDatetimeError || hasMaxDatetimeError || hasFormatError || hasCustomError;

  // Create datetime from date and time components
  const createDatetime = (date: Date, hour: number, minute: number, second: number) => {
    const newDatetime = new Date(date);
    newDatetime.setHours(hour, minute, second, 0);
    return newDatetime;
  };

  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDatetime(undefined);
      setInputValue('');
      onChange?.(undefined);
      return;
    }

    const newDatetime = createDatetime(date, selectedHour, selectedMinute, selectedSecond);
    handleDatetimeSelect(newDatetime);
  };

  // Handle time selection
  const handleTimeSelect = (hour: number, minute: number, second: number = 0) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedSecond(second);

    if (selectedDatetime) {
      const newDatetime = createDatetime(selectedDatetime, hour, minute, second);
      handleDatetimeSelect(newDatetime);
    }
  };

  // Handle datetime selection
  const handleDatetimeSelect = (datetime: Date) => {
    // Run custom validation
    if (datetimeValidator) {
      const validationResult = datetimeValidator(datetime);
      if (typeof validationResult === 'string') {
        setCustomValidationError(validationResult);
        return;
      }
      if (validationResult === false) {
        setCustomValidationError('Invalid datetime selection');
        return;
      }
    }

    setCustomValidationError('');
    setSelectedDatetime(datetime);
    setInputValue(format(datetime, datetimeFormat));
    onChange?.(format(datetime, datetimeFormat));
  };

  // Handle manual input
  const handleInputChange = (value: string) => {
    setInputValue(value);
    
    if (!allowManualInput) return;
    
    if (value === '') {
      setSelectedDatetime(undefined);
      onChange?.(undefined);
      setCustomValidationError('');
      return;
    }

    try {
      const parsed = parse(value, datetimeFormat, new Date());
      if (isValid(parsed)) {
        // Run custom validation
        if (datetimeValidator) {
          const validationResult = datetimeValidator(parsed);
          if (typeof validationResult === 'string') {
            setCustomValidationError(validationResult);
            return;
          }
          if (validationResult === false) {
            setCustomValidationError('Invalid datetime');
            return;
          }
        }

        setCustomValidationError('');
        setSelectedDatetime(parsed);
        setSelectedHour(parsed.getHours());
        setSelectedMinute(parsed.getMinutes());
        setSelectedSecond(parsed.getSeconds());
        onChange?.(format(parsed, datetimeFormat));
      } else {
        setSelectedDatetime(undefined);
        setCustomValidationError('');
      }
    } catch {
      setSelectedDatetime(undefined);
      setCustomValidationError('');
    }
  };

  // Check if date should be disabled
  const isDateDisabled = (date: Date) => {
    return disabledDates.some(disabledDate => 
      format(disabledDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  // Format time for display
  const formatTime = (hour: number, minute: number, second: number = 0) => {
    if (use24HourFormat) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      return showSeconds ? `${timeStr}:${second.toString().padStart(2, '0')}` : timeStr;
    } else {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const timeStr = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      return showSeconds ? timeStr.replace(' PM', `:${second.toString().padStart(2, '0')} PM`).replace(' AM', `:${second.toString().padStart(2, '0')} AM`) : timeStr;
    }
  };

  // Enhanced config
  const enhancedConfig = useMemo(() => ({
    ...config,
    type: 'datetime' as const,
    datetimeFormat,
    validation: {
      ...config.validation,
      custom: {
        ...config.validation?.custom,
        ...(parsedMinDatetime && {
          minDatetime: {
            value: parsedMinDatetime.toISOString(),
            message: `Datetime must be on or after ${format(parsedMinDatetime, datetimeFormat)}`,
            type: 'withValue' as const,
          },
        }),
        ...(parsedMaxDatetime && {
          maxDatetime: {
            value: parsedMaxDatetime.toISOString(),
            message: `Datetime must be on or before ${format(parsedMaxDatetime, datetimeFormat)}`,
            type: 'withValue' as const,
          },
        }),
      },
    },
  }), [config, datetimeFormat]);

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
        <div className="space-y-3">
          {/* Datetime Input */}
          <div className="flex space-x-2">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={config.placeholder || `Enter datetime (${datetimeFormat})`}
              disabled={mode === 'builder' || !allowManualInput}
              className={cn(
                'flex-1',
                {
                  'border-red-500': hasError,
                  'border-green-500': !hasError && selectedDatetime,
                }
              )}
            />

            {/* Calendar Trigger */}
            {showCalendar && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                disabled={mode === 'builder'}
                className={cn({
                  'border-red-500': hasError,
                  'border-green-500': !hasError && selectedDatetime,
                })}
              >
                <CalendarIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Calendar and Time Picker */}
          {isCalendarOpen && (
            <div className="border rounded-lg p-4 bg-white shadow-lg">
              <div className="flex space-x-4">
                {/* Calendar */}
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDatetime}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    initialFocus
                  />
                </div>

                {/* Time Picker */}
                <div className="min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-3">
                    <ClockIcon className="h-4 w-4" />
                    <span className="font-medium">Time</span>
                  </div>

                  <div className="space-y-2">
                    {/* Current time display */}
                    <div className="text-center p-2 bg-gray-50 rounded">
                      {formatTime(selectedHour, selectedMinute, selectedSecond)}
                    </div>

                    {/* Hour/Minute/Second inputs */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-600">Hour</label>
                        <Input
                          type="number"
                          min="0"
                          max="23"
                          value={selectedHour}
                          onChange={(e) => {
                            const hour = parseInt(e.target.value);
                            if (!isNaN(hour) && hour >= 0 && hour <= 23) {
                              handleTimeSelect(hour, selectedMinute, selectedSecond);
                            }
                          }}
                          className="h-8"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-gray-600">Minute</label>
                        <Input
                          type="number"
                          min="0"
                          max="59"
                          value={selectedMinute}
                          onChange={(e) => {
                            const minute = parseInt(e.target.value);
                            if (!isNaN(minute) && minute >= 0 && minute <= 59) {
                              handleTimeSelect(selectedHour, minute, selectedSecond);
                            }
                          }}
                          className="h-8"
                        />
                      </div>

                      {showSeconds && (
                        <div className="col-span-2">
                          <label className="text-xs text-gray-600">Second</label>
                          <Input
                            type="number"
                            min="0"
                            max="59"
                            value={selectedSecond}
                            onChange={(e) => {
                              const second = parseInt(e.target.value);
                              if (!isNaN(second) && second >= 0 && second <= 59) {
                                handleTimeSelect(selectedHour, selectedMinute, second);
                              }
                            }}
                            className="h-8"
                          />
                        </div>
                      )}
                    </div>

                    {/* Quick time options */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">Quick select:</div>
                      <div className="grid grid-cols-2 gap-1">
                        {[
                          { label: '9:00 AM', hour: 9, minute: 0 },
                          { label: '12:00 PM', hour: 12, minute: 0 },
                          { label: '1:00 PM', hour: 13, minute: 0 },
                          { label: '5:00 PM', hour: 17, minute: 0 },
                        ].map((time) => (
                          <Button
                            key={time.label}
                            variant="outline"
                            size="sm"
                            onClick={() => handleTimeSelect(time.hour, time.minute, 0)}
                            className="h-6 text-xs"
                          >
                            {time.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Done button */}
              <div className="flex justify-end mt-4">
                <Button
                  onClick={() => setIsCalendarOpen(false)}
                  size="sm"
                >
                  Done
                </Button>
              </div>
            </div>
          )}

          {/* Datetime Information */}
          <div className="text-xs space-y-1">
            {selectedDatetime && (
              <div className="text-green-600">
                Selected: {format(selectedDatetime, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}
              </div>
            )}

            {/* Validation Messages */}
            {hasRequiredError && (
              <div className="text-red-600">Please select a datetime</div>
            )}

            {hasFormatError && (
              <div className="text-red-600">
                Please enter a valid datetime in {datetimeFormat} format
              </div>
            )}

            {hasMinDatetimeError && parsedMinDatetime && (
              <div className="text-red-600">
                Datetime must be on or after {format(parsedMinDatetime, datetimeFormat)}
              </div>
            )}

            {hasMaxDatetimeError && parsedMaxDatetime && (
              <div className="text-red-600">
                Datetime must be on or before {format(parsedMaxDatetime, datetimeFormat)}
              </div>
            )}

            {hasCustomError && (
              <div className="text-red-600">{customValidationError}</div>
            )}

            {/* Helper Information */}
            {mode === 'builder' && (
              <div className="text-gray-500">
                Format: {datetimeFormat} | Step: {timeStep} min
              </div>
            )}
          </div>
        </div>
      </FieldWrapper>
    </BaseField>
  );
};

export default DatetimeField;
