import React, { useState } from 'react';
import FormField from '../../../components/common/FormField';
import { Input } from '../../../components/ui/input';
import { Combobox } from '../../../components/ui/combobox';
import { ValidationComponent, ValidationComponentProps, ValidationRuleWithComponent } from '../base/FieldTypes';

/**
 * Required field validation component
 */
const RequiredValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  message = 'This field is required'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'This field is required');
  
  const requiredOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="required" 
      label="Required" 
      helperText="If Yes, this field must be filled out."
    >
      <Combobox
        options={requiredOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'required',
            value: isEnabled,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <Input
          value={currentMessage}
          onChange={(e) => {
            const newMessage = e.target.value;
            setCurrentMessage(newMessage);
            onValidationChange?.({
              key: 'required',
              value: currentEnabled,
              message: newMessage,
              enabled: currentEnabled
            });
          }}
          placeholder="Required field validation message"
          className="mt-2"
        />
      )}
    </FormField>
  );
};

/**
 * Min Length validation component
 */
const MinLengthValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  value = 0,
  message = 'Text must be at least {value} characters'
}: ValidationComponentProps) => {
  const [currentValue, setCurrentValue] = useState<number>(value as number || 0);
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Text must be at least {value} characters');

  return (
    <FormField 
      id="minLength" 
      label="Minimum Length" 
      helperText="Minimum number of characters required."
    >
      <Input
        type="number"
        min="0"
        value={currentValue}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || 0;
          setCurrentValue(newValue);
          onValidationChange?.({
            key: 'minLength',
            value: newValue,
            message: currentMessage,
            enabled: newValue > 0
          });
        }}
        placeholder="Minimum length"
      />
      {currentValue > 0 && (
        <Input
          value={currentMessage}
          onChange={(e) => {
            const newMessage = e.target.value;
            setCurrentMessage(newMessage);
            onValidationChange?.({
              key: 'minLength',
              value: currentValue,
              message: newMessage,
              enabled: currentValue > 0
            });
          }}
          placeholder="Min length validation message"
          className="mt-2"
        />
      )}
    </FormField>
  );
};

/**
 * Max length validation component
 */
const MaxLengthValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  value = 100,
  message = 'Input is too long'
}: ValidationComponentProps) => {
  const [currentValue, setCurrentValue] = useState<number>(value as number || 100);
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Input is too long');

  return (
    <FormField 
      id="maxLength" 
      label="Maximum Length" 
      helperText="Maximum number of characters allowed."
    >
      <Input
        type="number"
        min="1"
        value={currentValue}
        onChange={(e) => {
          const newValue = parseInt(e.target.value) || 100;
          setCurrentValue(newValue);
          onValidationChange?.({
            key: 'maxLength',
            value: newValue,
            message: currentMessage,
            enabled: newValue > 0
          });
        }}
        placeholder="Maximum length"
      />
      {currentValue > 0 && (
        <Input
          value={currentMessage}
          onChange={(e) => {
            const newMessage = e.target.value;
            setCurrentMessage(newMessage);
            onValidationChange?.({
              key: 'maxLength',
              value: currentValue,
              message: newMessage,
              enabled: currentValue > 0
            });
          }}
          placeholder="Max length validation message"
          className="mt-2"
        />
      )}
    </FormField>
  );
};

/**
 * Email validation component
 */
const EmailValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  message = 'Please enter a valid email address'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Please enter a valid email address');
  
  const emailOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="email" 
      label="Email Format" 
      helperText="If Yes, input must be a valid email address."
    >
      <Combobox
        options={emailOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'email',
            value: isEnabled,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <Input
          value={currentMessage}
          onChange={(e) => {
            const newMessage = e.target.value;
            setCurrentMessage(newMessage);
            onValidationChange?.({
              key: 'email',
              value: currentEnabled,
              message: newMessage,
              enabled: currentEnabled
            });
          }}
          placeholder="Email validation message"
          className="mt-2"
        />
      )}
    </FormField>
  );
};

/**
 * Pattern validation component
 */
const PatternValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  value = '',
  message = 'Input does not match required pattern'
}: ValidationComponentProps) => {
  const [currentValue, setCurrentValue] = useState<string>(value as string || '');
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Input does not match required pattern');

  return (
    <FormField 
      id="pattern" 
      label="Pattern (Regex)" 
      helperText="Regular expression pattern that input must match."
    >
      <Input
        value={currentValue}
        onChange={(e) => {
          const newValue = e.target.value;
          setCurrentValue(newValue);
          onValidationChange?.({
            key: 'pattern',
            value: newValue,
            message: currentMessage,
            enabled: newValue.length > 0
          });
        }}
        placeholder="^[a-zA-Z0-9]+$"
      />
      {currentValue.length > 0 && (
        <Input
          value={currentMessage}
          onChange={(e) => {
            const newMessage = e.target.value;
            setCurrentMessage(newMessage);
            onValidationChange?.({
              key: 'pattern',
              value: currentValue,
              message: newMessage,
              enabled: currentValue.length > 0
            });
          }}
          placeholder="Pattern validation message"
          className="mt-2"
        />
      )}
    </FormField>
  );
};

/**
 * Number validation component
 */
const NumberValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  value = { min: 0, max: 100 },
  message = 'Please enter a valid number'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentValue, setCurrentValue] = useState<{min: number, max: number}>(
    value as {min: number, max: number} || { min: 0, max: 100 }
  );
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Please enter a valid number');
  
  const numberOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="number" 
      label="Number Range" 
      helperText="If Yes, input must be within the specified range."
    >
      <Combobox
        options={numberOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'number',
            value: currentValue,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <div className="space-y-2 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={currentValue.min}
              onChange={(e) => {
                const newMin = parseFloat(e.target.value) || 0;
                const newValue = { ...currentValue, min: newMin };
                setCurrentValue(newValue);
                onValidationChange?.({
                  key: 'number',
                  value: newValue,
                  message: currentMessage,
                  enabled: currentEnabled
                });
              }}
              placeholder="Min value"
            />
            <Input
              type="number"
              value={currentValue.max}
              onChange={(e) => {
                const newMax = parseFloat(e.target.value) || 100;
                const newValue = { ...currentValue, max: newMax };
                setCurrentValue(newValue);
                onValidationChange?.({
                  key: 'number',
                  value: newValue,
                  message: currentMessage,
                  enabled: currentEnabled
                });
              }}
              placeholder="Max value"
            />
          </div>
          <Input
            value={currentMessage}
            onChange={(e) => {
              const newMessage = e.target.value;
              setCurrentMessage(newMessage);
              onValidationChange?.({
                key: 'number',
                value: currentValue,
                message: newMessage,
                enabled: currentEnabled
              });
            }}
            placeholder="Number validation message"
          />
        </div>
      )}
    </FormField>
  );
};

/**
 * Date validation component
 */
const DateValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  value = { minDate: '', maxDate: '' },
  message = 'Please enter a valid date'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentValue, setCurrentValue] = useState<{minDate: string, maxDate: string}>(
    value as {minDate: string, maxDate: string} || { minDate: '', maxDate: '' }
  );
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Please enter a valid date');
  
  const dateOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="date" 
      label="Date Range" 
      helperText="If Yes, date must be within the specified range."
    >
      <Combobox
        options={dateOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'date',
            value: currentValue,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <div className="space-y-2 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              value={currentValue.minDate}
              onChange={(e) => {
                const newValue = { ...currentValue, minDate: e.target.value };
                setCurrentValue(newValue);
                onValidationChange?.({
                  key: 'date',
                  value: newValue,
                  message: currentMessage,
                  enabled: currentEnabled
                });
              }}
              placeholder="Min date"
            />
            <Input
              type="date"
              value={currentValue.maxDate}
              onChange={(e) => {
                const newValue = { ...currentValue, maxDate: e.target.value };
                setCurrentValue(newValue);
                onValidationChange?.({
                  key: 'date',
                  value: newValue,
                  message: currentMessage,
                  enabled: currentEnabled
                });
              }}
              placeholder="Max date"
            />
          </div>
          <Input
            value={currentMessage}
            onChange={(e) => {
              const newMessage = e.target.value;
              setCurrentMessage(newMessage);
              onValidationChange?.({
                key: 'date',
                value: currentValue,
                message: newMessage,
                enabled: currentEnabled
              });
            }}
            placeholder="Date validation message"
          />
        </div>
      )}
    </FormField>
  );
};

/**
 * File validation component
 */
const FileValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  value = { maxSize: 10485760, allowedTypes: [] },
  message = 'Please upload a valid file'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentValue, setCurrentValue] = useState<{maxSize: number, allowedTypes: string[]}>(
    value as {maxSize: number, allowedTypes: string[]} || { maxSize: 10485760, allowedTypes: [] }
  );
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Please upload a valid file');
  
  const fileOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="file" 
      label="File Validation" 
      helperText="If Yes, uploaded files must meet the specified criteria."
    >
      <Combobox
        options={fileOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'file',
            value: currentValue,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <div className="space-y-2 mt-2">
          <Input
            type="number"
            value={currentValue.maxSize}
            onChange={(e) => {
              const newMaxSize = parseInt(e.target.value) || 10485760;
              const newValue = { ...currentValue, maxSize: newMaxSize };
              setCurrentValue(newValue);
              onValidationChange?.({
                key: 'file',
                value: newValue,
                message: currentMessage,
                enabled: currentEnabled
              });
            }}
            placeholder="Max file size (bytes)"
          />
          <Input
            value={currentValue.allowedTypes.join(', ')}
            onChange={(e) => {
              const allowedTypes = e.target.value.split(',').map(t => t.trim()).filter(t => t);
              const newValue = { ...currentValue, allowedTypes };
              setCurrentValue(newValue);
              onValidationChange?.({
                key: 'file',
                value: newValue,
                message: currentMessage,
                enabled: currentEnabled
              });
            }}
            placeholder="Allowed file types (e.g., pdf, jpg, png)"
          />
          <Input
            value={currentMessage}
            onChange={(e) => {
              const newMessage = e.target.value;
              setCurrentMessage(newMessage);
              onValidationChange?.({
                key: 'file',
                value: currentValue,
                message: newMessage,
                enabled: currentEnabled
              });
            }}
            placeholder="File validation message"
          />
        </div>
      )}
    </FormField>
  );
};

/**
 * Options validation component
 */
const OptionsValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  value = { minSelections: 1, maxSelections: 1 },
  message = 'Please make a valid selection'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentValue, setCurrentValue] = useState<{minSelections: number, maxSelections: number}>(
    value as {minSelections: number, maxSelections: number} || { minSelections: 1, maxSelections: 1 }
  );
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Please make a valid selection');
  
  const optionsValidationOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="options" 
      label="Selection Validation" 
      helperText="If Yes, selections must meet the specified criteria."
    >
      <Combobox
        options={optionsValidationOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'options',
            value: currentValue,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <div className="space-y-2 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              min="0"
              value={currentValue.minSelections}
              onChange={(e) => {
                const newMin = parseInt(e.target.value) || 0;
                const newValue = { ...currentValue, minSelections: newMin };
                setCurrentValue(newValue);
                onValidationChange?.({
                  key: 'options',
                  value: newValue,
                  message: currentMessage,
                  enabled: currentEnabled
                });
              }}
              placeholder="Min selections"
            />
            <Input
              type="number"
              min="1"
              value={currentValue.maxSelections}
              onChange={(e) => {
                const newMax = parseInt(e.target.value) || 1;
                const newValue = { ...currentValue, maxSelections: newMax };
                setCurrentValue(newValue);
                onValidationChange?.({
                  key: 'options',
                  value: newValue,
                  message: currentMessage,
                  enabled: currentEnabled
                });
              }}
              placeholder="Max selections"
            />
          </div>
          <Input
            value={currentMessage}
            onChange={(e) => {
              const newMessage = e.target.value;
              setCurrentMessage(newMessage);
              onValidationChange?.({
                key: 'options',
                value: currentValue,
                message: newMessage,
                enabled: currentEnabled
              });
            }}
            placeholder="Selection validation message"
          />
        </div>
      )}
    </FormField>
  );
};

/**
 * Phone validation component
 */
const PhoneValidationComponent: ValidationComponent = ({ 
  onValidationChange, 
  enabled = false,
  message = 'Please enter a valid phone number'
}: ValidationComponentProps) => {
  const [currentEnabled, setCurrentEnabled] = useState<boolean>(enabled || false);
  const [currentMessage, setCurrentMessage] = useState<string>(message || 'Please enter a valid phone number');
  
  const phoneOptions = [
    { label: 'Yes', value: 'true' },
    { label: 'No', value: 'false' },
  ];

  return (
    <FormField 
      id="phone" 
      label="Phone Number" 
      helperText="If Yes, input must be a valid phone number."
    >
      <Combobox
        options={phoneOptions}
        selectedValues={[{ label: currentEnabled ? 'Yes' : 'No', value: currentEnabled ? 'true' : 'false' }]}
        handleChange={(values) => {
          const isEnabled = values[0]?.value === 'true';
          setCurrentEnabled(isEnabled);
          onValidationChange?.({
            key: 'phone',
            value: isEnabled,
            message: currentMessage,
            enabled: isEnabled
          });
        }}
      />
      {currentEnabled && (
        <Input
          value={currentMessage}
          onChange={(e) => {
            const newMessage = e.target.value;
            setCurrentMessage(newMessage);
            onValidationChange?.({
              key: 'phone',
              value: currentEnabled,
              message: newMessage,
              enabled: currentEnabled
            });
          }}
          placeholder="Phone validation message"
          className="mt-2"
        />
      )}
    </FormField>
  );
};

// Validation rule definitions
/**
 * Required field validation rule
 */
export const RequiredValidation: ValidationRuleWithComponent = {
  key: 'required',
  label: 'Required',
  description: 'Field must not be empty',
  type: 'binary',
  defaultValue: false,
  defaultMessage: 'This field is required',
  component: RequiredValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    if (!value) return true; // Not required
    return (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') || 'This field is required';
  }
};

/**
 * Min length validation rule
 */
export const MinLengthValidation: ValidationRuleWithComponent = {
  key: 'minLength',
  label: 'Minimum Length',
  description: 'Minimum number of characters required',
  type: 'withValue',
  defaultValue: 0,
  defaultMessage: 'Text must be at least {value} characters',
  component: MinLengthValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    const minLength = value as number;
    const input = fieldValue as string;
    if (!minLength || minLength <= 0) return true;
    return input.length >= minLength || `Text must be at least ${minLength} characters`;
  }
};

/**
 * Max length validation rule
 */
export const MaxLengthValidation: ValidationRuleWithComponent = {
  key: 'maxLength',
  label: 'Maximum Length',
  description: 'Maximum number of characters allowed',
  type: 'withValue',
  defaultValue: 100,
  defaultMessage: 'Input is too long',
  component: MaxLengthValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    const maxLength = value as number;
    const input = fieldValue as string;
    if (!maxLength || maxLength <= 0) return true;
    return input.length <= maxLength || `Text must be no more than ${maxLength} characters`;
  }
};

/**
 * Email validation rule
 */
export const EmailValidation: ValidationRuleWithComponent = {
  key: 'email',
  label: 'Email Format',
  description: 'Must be a valid email address',
  type: 'binary',
  defaultValue: false,
  defaultMessage: 'Please enter a valid email address',
  component: EmailValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    if (!value) return true; // Not required to be email
    const input = fieldValue as string;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input) || 'Please enter a valid email address';
  }
};

/**
 * Pattern validation rule
 */
export const PatternValidation: ValidationRuleWithComponent = {
  key: 'pattern',
  label: 'Pattern (Regex)',
  description: 'Must match a regular expression pattern',
  type: 'withValue',
  defaultValue: '',
  defaultMessage: 'Input does not match required pattern',
  component: PatternValidationComponent,
  category: 'advanced',
  validator: (value: unknown, fieldValue: unknown) => {
    const pattern = value as string;
    const input = fieldValue as string;
    if (!pattern) return true;
    try {
      const regex = new RegExp(pattern);
      return regex.test(input) || 'Input does not match required pattern';
    } catch {
      return 'Invalid pattern';
    }
  }
};

/**
 * Number validation rule
 */
export const NumberValidation: ValidationRuleWithComponent = {
  key: 'number',
  label: 'Number Range',
  description: 'Must be within specified range',
  type: 'withValue',
  defaultValue: { min: 0, max: 100 },
  defaultMessage: 'Please enter a valid number',
  component: NumberValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    const { min, max } = value as { min: number, max: number };
    const num = parseFloat(fieldValue as string);
    if (isNaN(num)) return 'Please enter a valid number';
    if (num < min) return `Number must be at least ${min}`;
    if (num > max) return `Number must be no more than ${max}`;
    return true;
  }
};

/**
 * Date validation rule
 */
export const DateValidation: ValidationRuleWithComponent = {
  key: 'date',
  label: 'Date Range',
  description: 'Must be within specified date range',
  type: 'withValue',
  defaultValue: { minDate: '', maxDate: '' },
  defaultMessage: 'Please enter a valid date',
  component: DateValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    const { minDate, maxDate } = value as { minDate: string, maxDate: string };
    const inputDate = new Date(fieldValue as string);
    if (isNaN(inputDate.getTime())) return 'Please enter a valid date';
    
    if (minDate && inputDate < new Date(minDate)) {
      return `Date must be after ${minDate}`;
    }
    if (maxDate && inputDate > new Date(maxDate)) {
      return `Date must be before ${maxDate}`;
    }
    return true;
  }
};

/**
 * File validation rule
 */
export const FileValidation: ValidationRuleWithComponent = {
  key: 'file',
  label: 'File Validation',
  description: 'Validate file size and type',
  type: 'withValue',
  defaultValue: { maxSize: 10485760, allowedTypes: [] },
  defaultMessage: 'Please upload a valid file',
  component: FileValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    const { maxSize, allowedTypes } = value as { maxSize: number, allowedTypes: string[] };
    const file = fieldValue as File;
    
    if (!file) return true;
    
    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`;
    }
    
    if (allowedTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !allowedTypes.includes(fileExtension)) {
        return `File type must be one of: ${allowedTypes.join(', ')}`;
      }
    }
    
    return true;
  }
};

/**
 * Options validation rule
 */
export const OptionsValidation: ValidationRuleWithComponent = {
  key: 'options',
  label: 'Selection Validation',
  description: 'Validate number of selections',
  type: 'withValue',
  defaultValue: { minSelections: 1, maxSelections: 1 },
  defaultMessage: 'Please make a valid selection',
  component: OptionsValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    const { minSelections, maxSelections } = value as { minSelections: number, maxSelections: number };
    const selections = Array.isArray(fieldValue) ? fieldValue : (fieldValue ? [fieldValue] : []);
    
    if (selections.length < minSelections) {
      return `Please select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`;
    }
    if (selections.length > maxSelections) {
      return `Please select no more than ${maxSelections} option${maxSelections > 1 ? 's' : ''}`;
    }
    
    return true;
  }
};

/**
 * Phone validation rule
 */
export const PhoneValidation: ValidationRuleWithComponent = {
  key: 'phone',
  label: 'Phone Number',
  description: 'Must be a valid phone number',
  type: 'binary',
  defaultValue: false,
  defaultMessage: 'Please enter a valid phone number',
  component: PhoneValidationComponent,
  category: 'basic',
  validator: (value: unknown, fieldValue: unknown) => {
    if (!value) return true;
    const input = fieldValue as string;
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(input) || 'Please enter a valid phone number';
  }
};

// Export all validation rules as an array for easy registration
export const ALL_VALIDATION_RULES = [
  RequiredValidation,
  MinLengthValidation,
  MaxLengthValidation,
  EmailValidation,
  PatternValidation,
  NumberValidation,
  DateValidation,
  FileValidation,
  OptionsValidation,
  PhoneValidation
];
