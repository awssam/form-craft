I'll explore your codebase to understand the current architecture and then create a comprehensive markdown document for the field component architecture refactoring. Now let me look at the field component structure and existing field rendering patterns: Now let me examine the directory structure and understand the current field configuration patterns: Based on my analysis of the codebase, I can now create a comprehensive markdown document for the Field Type Componentization Architecture. Here's the complete roadmap:

# Field Type Componentization Architecture

## 🎯 Overview

This document outlines the refactoring strategy to transform FormCraft's current field type handling from direct type checks and icon mappings to a dedicated component-based architecture. Each field type will have its own specialized component with specific configuration, customization, and validation capabilities.

## 🏗️ Current Architecture Analysis

### Existing Structure
- **Field Rendering**: Two separate rendering paths
  - **Builder Mode**: fields
  - **Runtime Mode**: fields
- **Type Mapping**: Direct switch statements in FieldRenderer.tsx
- **Validation**: Centralized in FieldValidationSection.tsx with type-specific component arrays
- **Icons**: Hardcoded icon mappings in multiple files (e.g., `FieldMappingSection.tsx`, PreconfiguredFieldsPanel.tsx)

### Current Field Types
```typescript
type FieldType = 'text' | 'email' | 'phone' | 'number' | 'checkbox' | 'radio' | 'dropdown' | 'date' | 'datetime' | 'textarea' | 'file';
```

## 📋 Implementation Roadmap

### Phase 1: Field Component Infrastructure (Week 1) ✅

#### 1.1 Create Base Field Component Structure ✅
```
src/components/fields/
├── base/
│   ├── BaseField.tsx           # Common field interface ✅
│   ├── FieldWrapper.tsx        # Shared wrapper logic ✅
│   └── FieldTypes.ts           # Type definitions ✅
├── specialized/
│   ├── TextField.tsx           # Text input variations (Phase 2)
│   ├── EmailField.tsx          # Email specific validation (Phase 2)
│   ├── PhoneField.tsx          # Phone formatting/validation (Phase 2)
│   ├── NumberField.tsx         # Numeric input with constraints (Phase 2)
│   ├── TextareaField.tsx       # Multi-line text (Phase 2)
│   ├── DropdownField.tsx       # Select with options (Phase 2)
│   ├── RadioField.tsx          # Radio button groups (Phase 2)
│   ├── CheckboxField.tsx       # Checkbox with multi-select (Phase 2)
│   ├── DateField.tsx           # Date picker (Phase 2)
│   ├── DatetimeField.tsx       # Date and time picker (Phase 2)
│   └── FileField.tsx           # File upload with validation (Phase 2)
├── validation/
│   └── ValidationRules.ts      # Common validation rules ✅
├── examples/
│   └── ExampleTextField.tsx    # Example implementation ✅
├── FieldRegistry.ts            # Central field registry ✅
├── FieldRenderer.tsx           # Central field renderer ✅
├── FieldCategories.ts          # Default field categories ✅
├── FieldSystemDemo.tsx         # Demo component ✅
└── index.ts                    # Export barrel ✅
```

#### 1.2 Define Base Field Interface
```typescript
interface BaseFieldProps {
  config: FieldEntity;
  mode: 'builder' | 'runtime';
  className?: string;
  onChange?: (value: any) => void;
  onConfigChange?: (config: Partial<FieldEntity>) => void;
  validation?: FieldValidation;
  theme?: FormTheme;
}

interface FieldConfiguration {
  icon: React.ReactNode;
  displayName: string;
  description: string;
  category: string;
  defaultConfig: Partial<FieldEntity>;
  validationRules: ValidationRule[];
  customizations: CustomizationOption[];
}
```

### Phase 2: Specialized Field Components (Week 2)

#### 2.1 TextField Component
```typescript
// src/components/fields/specialized/TextField.tsx
interface TextFieldProps extends BaseFieldProps {
  variant?: 'text' | 'email' | 'phone' | 'number';
  formatters?: {
    phone?: (value: string) => string;
    number?: (value: string) => string;
  };
}

const TextField: React.FC<TextFieldProps> = ({
  config,
  mode,
  variant = 'text',
  formatters,
  ...props
}) => {
  // Specific logic for text field variations
  // Built-in validation based on variant
  // Custom formatting and input masks
};
```

#### 2.2 Field-Specific Features

**EmailField.tsx**
- Built-in email validation
- Domain suggestions
- Regex pattern matching
- Custom error messages

**PhoneField.tsx**
- International formatting
- Country code detection
- Phone number validation
- Custom input masks

**NumberField.tsx**
- Min/max constraints
- Decimal place control
- Currency formatting
- Step validation

**DateField.tsx**
- Date range restrictions
- Custom date formats
- Timezone handling
- Relative date validation

### Phase 3: Central Field Registry (Week 3) ✅

#### 3.1 Field Registry System
```typescript
// src/components/fields/FieldRegistry.ts
class FieldRegistry {
  private static fields = new Map<FieldType, FieldConfiguration>();
  
  static register(type: FieldType, config: FieldConfiguration) {
    this.fields.set(type, config);
  }
  
  static getFieldConfig(type: FieldType): FieldConfiguration | undefined {
    return this.fields.get(type);
  }
  
  static getAllFields(): FieldConfiguration[] {
    return Array.from(this.fields.values());
  }
  
  static getFieldsByCategory(category: string): FieldConfiguration[] {
    return this.getAllFields().filter(field => field.category === category);
  }
}
```

#### 3.2 Enhanced Field Renderer
```typescript
// src/components/fields/FieldRenderer.tsx
const FieldRenderer: React.FC<FieldRendererProps> = ({ 
  fieldConfig, 
  mode, 
  ...props 
}) => {
  const fieldType = fieldConfig.type;
  const registration = FieldRegistry.getFieldConfig(fieldType);
  
  if (!registration) {
    console.warn(`No field component registered for type: ${fieldType}`);
    return <FallbackField {...props} />;
  }
  
  const Component = registration.component;
  return <Component config={fieldConfig} mode={mode} {...props} />;
};
```

### Phase 4: Validation System Integration (Week 4) ✅

#### 4.1 Field-Specific Validation Components ✅
```typescript
// Each field component exports its validation rules
export const TextFieldValidations = [
  RequiredValidation,
  MinLengthValidation,
  MaxLengthValidation,
  PatternValidation,
  // ... field-specific validations
];

export const EmailFieldValidations = [
  RequiredValidation,
  EmailFormatValidation,
  DomainValidation,
  // ... email-specific validations
];
```

#### 4.2 Dynamic Validation Registry ✅
```typescript
// src/components/fields/validation/ValidationRegistry.ts
class ValidationRegistry {
  static getValidationsForField(fieldType: FieldType): ValidationComponent[] {
    const fieldConfig = FieldRegistry.getFieldConfig(fieldType);
    return fieldConfig?.validationRules || [];
  }
}
```

#### 4.3 Integration with Existing FieldValidationSection ✅
- Updated existing FieldValidationSection component to use ValidationRegistry
- Maintained backward compatibility with legacy validation components
- Added dynamic validation rendering based on field type
- Integrated validation change handlers with existing field state management

#### 4.4 Validation Component Architecture ✅
- Created ValidationRegistry class for centralized validation management
- Implemented ValidationRuleWithComponent interface for typed validation rules
- Built React components for common validations (Required, MinLength, MaxLength, Email, Pattern)
- Added validation hooks for easy integration (useValidationRegistry, useFieldValidations)

#### 4.5 Field Type Specific Validation Mapping ✅
- Registered validation rules for each field type
- Dynamic validation assignment based on field type
- Category-based validation organization (basic, advanced, custom)
- Validation conflict detection and dependency management

### Phase 5: Migration and Refactoring (Week 5)

#### 5.1 Update FieldMappingSection
```typescript
// Before: Direct icon mapping
const getFieldTypeIcon = (type: string) => {
  const icons: Record<string, string> = { ... };
  return icons[type] || '📝';
};

// After: Use field registry
const getFieldTypeIcon = (type: FieldType) => {
  const fieldConfig = FieldRegistry.getFieldConfig(type);
  return fieldConfig?.icon || <DefaultIcon />;
};

const getFieldDisplayName = (type: FieldType) => {
  const fieldConfig = FieldRegistry.getFieldConfig(type);
  return fieldConfig?.displayName || type;
};
```

#### 5.2 Update Field List Menu
```typescript
// src/app/builder/_components/right-pane/field-list-menu/config.tsx
// Replace hardcoded sections with registry-based generation
const generateFieldSections = () => {
  const categories = FieldRegistry.getAllCategories();
  
  return categories.map(category => ({
    title: category.name,
    description: category.description,
    icon: category.icon,
    fields: FieldRegistry.getFieldsByCategory(category.id)
  }));
};
```

#### 5.3 Update Validation Section
```typescript
// src/app/builder/_components/right-pane/field-config-menu/validation-section/FieldValidationSection.tsx
const FieldValidationSection = () => {
  const selectedField = useSelectedFieldStore((s) => s?.selectedField);
  
  const validationComponents = useMemo(() => {
    if (!selectedField) return [];
    return ValidationRegistry.getValidationsForField(selectedField.type);
  }, [selectedField?.type]);
  
  return (
    <FormConfigSection>
      {validationComponents.map((ValidationComponent, idx) => (
        <ValidationComponent key={idx} field={selectedField} />
      ))}
    </FormConfigSection>
  );
};
```

## 🔄 Benefits of New Architecture

### 1. **Maintainability**
- Single source of truth for field configurations
- Easy to add new field types
- Consistent field behavior across the application

### 2. **Extensibility**
- Plugin-like architecture for field types
- Custom field types can be added without modifying core code
- Third-party field components integration

### 3. **Type Safety**
- Strong TypeScript support
- Compile-time validation of field configurations
- Intellisense support for field properties

### 4. **Performance**
- Tree-shaking friendly
- Lazy loading of field components
- Reduced bundle size for unused field types

### 5. **Testing**
- Isolated testing of field components
- Consistent testing patterns
- Mock-friendly architecture

## 🎨 Component Configuration Examples

### TextField Configuration
```typescript
FieldRegistry.register('text', {
  component: TextField,
  icon: <TextIcon />,
  displayName: 'Text Field',
  description: 'Single-line text input for short entries',
  category: 'basic',
  defaultConfig: {
    placeholder: 'Enter text...',
    helperText: 'Type your answer here',
    width: '100%',
  },
  validationRules: [
    RequiredValidation,
    MinLengthValidation,
    MaxLengthValidation,
    PatternValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'width', type: 'select', label: 'Field Width', options: ['25%', '50%', '75%', '100%'] },
  ],
});
```

### EmailField Configuration
```typescript
FieldRegistry.register('email', {
  component: EmailField,
  icon: <MailIcon />,
  displayName: 'Email Field',
  description: 'Email input with validation',
  category: 'contact',
  defaultConfig: {
    placeholder: 'Enter your email...',
    helperText: 'We will send confirmations to this email',
    width: '100%',
    validation: {
      custom: {
        required: { value: true, message: 'Email is required', type: 'binary' },
        email: { value: true, message: 'Enter a valid email', type: 'binary' },
      }
    }
  },
  validationRules: [
    RequiredValidation,
    EmailFormatValidation,
    DomainValidation,
  ],
  customizations: [
    { key: 'placeholder', type: 'text', label: 'Placeholder Text' },
    { key: 'helperText', type: 'text', label: 'Helper Text' },
    { key: 'allowedDomains', type: 'array', label: 'Allowed Domains' },
  ],
});
```

## 🚀 Implementation Timeline

| Phase | Duration | Deliverables | Dependencies | Status |
|-------|----------|-------------|-------------|--------|
| **Phase 1** | Week 1 | Base infrastructure, type definitions | - | ✅ |
| **Phase 2** | Week 2 | All specialized field components | Phase 1 | ✅ |
| **Phase 3** | Week 3 | Registry system, central renderer | Phase 2 | ✅ |
| **Phase 4** | Week 4 | Validation system integration | Phase 3 | ✅ |
| **Phase 5** | Week 5 | Migration of existing components | All previous phases | 🚧 |

## ✅ Success Criteria

- [ ] All existing field types converted to component-based architecture
- [ ] No breaking changes to existing form configurations
- [ ] Performance maintains or improves
- [ ] Test coverage ≥ 90% for new components
- [ ] Documentation updated for new architecture
- [ ] Migration guide created for future field types

## 🧪 Testing Strategy

### Unit Tests
- Individual field component behavior
- Validation rule implementation
- Configuration handling

### Integration Tests
- Field registry functionality
- Form builder integration
- Runtime form rendering

### E2E Tests
- Complete form creation workflow
- Field configuration scenarios
- Form submission validation

---

This architecture transformation will provide a robust, scalable foundation for FormCraft's field system while maintaining backward compatibility and improving developer experience.