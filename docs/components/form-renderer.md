# Form Renderer Components

## 🎯 Form Rendering Architecture

The form renderer is responsible for displaying live forms to end users. It handles form submission, validation, multi-page navigation, conditional logic, and integrations. Located in `src/app/form/[formId]/_components/`.

## 📋 Core Components

### Main Form Component (`Form.tsx`)

The root component that orchestrates the entire form rendering experience.

```typescript
interface FormProps {
  formConfig: FormConfig;
}

const Form = ({ formConfig: config }: FormProps) => {
  const [formValuesByPage, setFormValuesByPage] = useState<FormValueByPageMap>({});
  const [formConfig, setFormConfig] = useState(config);
  const [activePageId, setActivePageId] = useState(formConfig?.pages?.[0]);
  const [fieldEntities, setFieldEntities] = useState(config?.fieldEntities);
  const [isSubmissionSuccess, setIsSubmissionSuccess] = useState(false);
  const [fieldVisibilityMap, setFieldVisibiltyMap] = useState<Record<string, boolean>>({});
  
  const fontFamily = config?.styles?.fontFamily || "Poppins";
  const formSubmissionId = useFormSubmissionId();
  
  // Form submission handling
  const { mutateAsync: createFormSubmission, isPending: isSubmitting } = 
    useCreateFormSubmissionMutation({
      onError: (error) => {
        toast.error('Error', {
          description: (error as Error).message,
          duration: 3000,
        });
      },
    });
    
  const { mutateAsync: createActivity } = useCreateActivityMutation({});
  
  return (
    <section className={classes} style={{ fontFamily }}>
      <FormHeader formConfig={formConfig} currentPageNumber={currentPageNumber} />
      <FormBlobStorageProvider>
        <FormContent
          key={activePageId}
          formConfig={formConfig}
          formValuesByPageMap={formValuesByPage}
          fieldVisibilityMap={fieldVisibilityMap}
          activePageId={activePageId}
          onActivePageIdChange={handleActivePageIdChange}
          onFormSubmit={handleFormSubmit}
          onPageFieldChange={setFieldEntities}
          onFormValueChange={setFormValuesByPage}
          isFormSubmitting={isSubmitting}
        />
      </FormBlobStorageProvider>
    </section>
  );
};
```

#### Key Features:
- **Multi-page state management**: Tracks values across form pages
- **Conditional logic**: Shows/hides fields based on user input
- **Real-time validation**: Validates fields as users type
- **Submission handling**: Processes form data and integrations
- **Progress tracking**: Shows completion progress for multi-page forms
- **Theme application**: Applies custom styling and fonts

### Form Content Component (`FormContent.tsx`)

Manages the active page content and handles page navigation.

```typescript
interface FormContentProps {
  formConfig: FormConfig;
  formValuesByPageMap: FormValueByPageMap;
  fieldVisibilityMap: Record<string, boolean>;
  activePageId: string;
  onActivePageIdChange: (pageId: string) => void;
  onFormSubmit: (data: FieldValues) => void;
  onPageFieldChange?: (fields: Record<string, FieldEntity>) => void;
  onFormValueChange?: (values: FormValueByPageMap) => void;
  isFormSubmitting: boolean;
}

const FormContent = ({
  formConfig,
  activePageId,
  onFormSubmit,
  isFormSubmitting,
  // ... other props
}: FormContentProps) => {
  const form = useForm({
    mode: 'onTouched',
    defaultValues: getDefaultValues(currentPageFields),
  });
  
  const formValues = form.watch();
  
  // Debounced field value updates
  const debouncedFieldUpdate = useCallback(
    debounce(() => {
      onPageFieldChange?.((prev) => {
        const newFields = { ...prev };
        Object.entries(formValues).forEach(([key, value]) => {
          const field = fieldEntitiesWithNameKeys?.[key];
          const fieldId = field?.id;
          newFields[fieldId] = { ...newFields[fieldId], value };
        });
        return newFields;
      });
    }, 2000),
    [fieldEntitiesWithNameKeys, formValues, onPageFieldChange],
  );
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="form-fields">
          {currentPageFields.map((field) => (
            <FieldRenderer
              key={field.id}
              field={field}
              control={form.control}
              formValuesByPageMap={formValuesByPageMap}
              pageId={activePageId}
              fieldVisibilityMap={fieldVisibilityMap}
            />
          ))}
        </div>
        <FormNavigation
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onPreviousPage={handlePreviousPage}
          onNextPage={handleNextPage}
          isSubmitting={isFormSubmitting}
        />
      </form>
    </Form>
  );
};
```

### Form Header Component (`FormHeader.tsx`)

Displays form title, description, and progress information.

```typescript
interface FormHeaderProps {
  formConfig: FormConfig;
  currentPageNumber: number;
}

const FormHeader = ({ formConfig, currentPageNumber }: FormHeaderProps) => {
  const totalPages = formConfig.pages?.length || 1;
  const progressPercentage = (currentPageNumber / totalPages) * 100;
  
  return (
    <div className="form-header">
      {formConfig.image && (
        <img src={formConfig.image} alt="Form cover" className="form-cover" />
      )}
      
      <h1 className="form-title">{formConfig.name}</h1>
      
      {formConfig.description && (
        <p className="form-description">{formConfig.description}</p>
      )}
      
      {formConfig.multiPage && totalPages > 1 && (
        <div className="progress-container">
          <div className="progress-text">
            Page {currentPageNumber} of {totalPages}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
```

### Form Blob Storage Provider (`FormBlobStorage.tsx`)

Provides file upload context and manages file storage.

```typescript
interface BlobStorageContextType {
  uploadFile: (file: File) => Promise<string>;
  deleteFile: (url: string) => Promise<void>;
  isUploading: boolean;
}

const FormBlobStorageProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  const uploadFile = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/form/cloudinary', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      return result.urls[0];
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <BlobStorageContext.Provider value={{ uploadFile, isUploading }}>
      {children}
    </BlobStorageContext.Provider>
  );
};
```

## 🎨 Field Renderer Components

### Main Field Renderer (`fields/FieldRenderer.tsx`)

Routes field rendering to appropriate components based on field type.

```typescript
interface FieldRendererProps {
  field: FieldEntity;
  control: Control;
  formValuesByPageMap: FormValueByPageMap;
  pageId: string;
  fieldVisibilityMap: Record<string, boolean>;
}

const FieldRenderer = ({ field, control, fieldVisibilityMap }: FieldRendererProps) => {
  // Skip rendering if field is hidden by conditional logic
  if (fieldVisibilityMap[field.id] === false) {
    return null;
  }
  
  const commonProps = { field, control };
  
  switch (field.type) {
    case 'text':
      return withSetDefaultValueInForm(Text)(commonProps);
    case 'textarea':
      return withSetDefaultValueInForm(Textarea)(commonProps);
    case 'checkbox':
      return withSetDefaultValueInForm(Checkbox)(commonProps);
    case 'radio':
      return withSetDefaultValueInForm(Radio)(commonProps);
    case 'dropdown':
      return withSetDefaultValueInForm(Dropdown)(commonProps);
    case 'date':
      return withSetDefaultValueInForm(Date)(commonProps);
    case 'file':
      return File(commonProps);
    default:
      return null;
  }
};
```

### Individual Field Components

#### Text Input (`fields/Text.tsx`)

```typescript
const Text = ({ field, control }: FieldProps) => {
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-2">
          <Label htmlFor={field.id} className="text-sm font-semibold">
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <FormControl>
            <Input
              {...rhFormField}
              id={field.id}
              placeholder={field.placeholder}
              disabled={field.readonly}
              className="w-full"
            />
          </FormControl>
          {field.helperText && (
            <FormDescription className="text-xs">
              {field.helperText}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

#### Textarea Input (`fields/Textarea.tsx`)

Multi-line text input with auto-resize functionality.

```typescript
const Textarea = ({ field, control }: FieldProps) => {
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <FormControl>
            <TextareaComponent
              {...rhFormField}
              id={field.id}
              placeholder={field.placeholder}
              disabled={field.readonly}
              rows={4}
              className="resize-none"
            />
          </FormControl>
          {field.helperText && (
            <FormDescription>{field.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

#### Checkbox Input (`fields/Checkbox.tsx`)

Multiple checkbox options with validation.

```typescript
const Checkbox = ({ field, control }: FieldProps) => {
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-3">
          <Label className="text-sm font-semibold">
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <CheckboxComponent
                  id={`${field.id}-${option.value}`}
                  checked={rhFormField.value?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = rhFormField.value || [];
                    if (checked) {
                      rhFormField.onChange([...currentValues, option.value]);
                    } else {
                      rhFormField.onChange(
                        currentValues.filter((v: any) => v !== option.value)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`${field.id}-${option.value}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
          {field.helperText && (
            <FormDescription>{field.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

#### Radio Input (`fields/Radio.tsx`)

Single-select radio button groups.

```typescript
const Radio = ({ field, control }: FieldProps) => {
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-3">
          <Label className="text-sm font-semibold">
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <FormControl>
            <RadioGroup
              onValueChange={rhFormField.onChange}
              value={rhFormField.value}
              className="space-y-2"
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option.value as string}
                    id={`${field.id}-${option.value}`}
                  />
                  <Label
                    htmlFor={`${field.id}-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {field.helperText && (
            <FormDescription>{field.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

#### Dropdown Input (`fields/Dropdown.tsx`)

Select dropdown with single or multi-select capability.

```typescript
const Dropdown = ({ field, control, formValuesByPageMap, pageId }: FieldProps) => {
  const [values, setValues] = useState<Option[]>([]);
  const { setValue } = useFormContext();
  
  const fieldDefaultValueString = useMemo(
    () => JSON.stringify(field?.defaultValue),
    [field?.defaultValue]
  );
  
  const fieldUserFilledValueString = useMemo(
    () => JSON.stringify(formValuesByPageMap?.[pageId]?.[field?.name]),
    [field?.name, formValuesByPageMap, pageId]
  );
  
  const fieldWatcher = useWatch({ control, name: field.name });
  
  const handleChange = (values: Option[]) => {
    setValue(
      field.name,
      Array.from(new Set(values.map((d) => d.value))),
      { shouldValidate: true }
    );
  };
  
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <FormControl>
            <Combobox
              options={field.options as Option[]}
              selectedValues={values}
              handleChange={handleChange}
              allowMultiple={field.allowMultiSelect}
              placeholder={field.placeholder}
            />
          </FormControl>
          {field.helperText && (
            <FormDescription>{field.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

#### Date Input (`fields/Date.tsx`)

Date picker with validation and formatting.

```typescript
const Date = ({ field, control }: FieldProps) => {
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <FormControl>
            <DateTimePicker
              value={rhFormField.value}
              onChange={rhFormField.onChange}
              placeholder={field.placeholder}
              disabled={field.readonly}
            />
          </FormControl>
          {field.helperText && (
            <FormDescription>{field.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

#### File Upload (`fields/File.tsx`)

File upload with drag-and-drop and progress tracking.

```typescript
const File = ({ field, control }: FieldProps) => {
  const { uploadFile, isUploading } = useBlobStorage();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  const handleFileUpload = async (files: FileList) => {
    const newFiles: UploadedFile[] = [];
    
    for (const file of Array.from(files)) {
      try {
        const url = await uploadFile(file);
        newFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          url,
        });
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }
    
    setUploadedFiles((prev) => [...prev, ...newFiles]);
  };
  
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={({ field: rhFormField }) => (
        <FormItem className="space-y-2">
          <Label htmlFor={field.id}>
            {field.label}
            {field.validation?.custom?.required?.value && (
              <span className="text-red-500 ml-1">*</span>
            )}
          </Label>
          <FormControl>
            <FileUpload
              onFilesSelected={handleFileUpload}
              allowMultiple={field.allowMultiSelect}
              accept="*/*"
              maxSize={parseFileSize(field.validation?.fileSize)}
              disabled={isUploading}
            />
          </FormControl>
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              {uploadedFiles.map((file, index) => (
                <FilePreview key={index} file={file} />
              ))}
            </div>
          )}
          {field.helperText && (
            <FormDescription>{field.helperText}</FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
```

## 🔧 Higher-Order Components

### Default Value Handler (`fields/withSetDefaultValueInForm.tsx`)

HOC that manages default value population for form fields.

```typescript
const withSetDefaultValueInForm = (Component: React.FC<FieldProps>) => {
  const NewComponent = (props: FieldProps) => {
    const { setValue } = useFormContext();
    const fieldWatcher = useFormContext().watch(props.field.name);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    useEffect(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        if (props?.field?.defaultValue) {
          const val = fieldWatcher && fieldWatcher?.trim()?.length > 0 
            ? fieldWatcher 
            : props.field.defaultValue;
          setValue(props.field.name, val);
        }
      }, 1000);
    }, [fieldWatcher, props.control, props.field.defaultValue, props.field.name, setValue]);
    
    return <Component {...props} />;
  };
  
  return NewComponent;
};
```

## 🎯 Form Logic and Validation

### Conditional Logic Implementation

The form renderer implements real-time conditional logic using the `useFieldConditionalLogicCheckGeneric` hook:

```typescript
const useFieldConditionalLogicCheckGeneric = (
  fields: string[],
  fieldEntities: Record<string, FieldEntity> | null,
  onFieldVisibilityChange: (fieldId: string, isVisible: boolean) => void,
) => {
  useEffect(() => {
    fields?.forEach((fieldId) => {
      const field = fieldEntities?.[fieldId] as FieldEntity;
      
      if (field?.conditionalLogic) {
        const { showWhen, operator } = field.conditionalLogic;
        const conditions: boolean[] = [];
        
        showWhen?.forEach((condition) => {
          const targetField = fieldEntities?.[condition.fieldId];
          const targetValue = targetField?.value as string;
          
          // Evaluate condition based on operator
          const conditionMet = evaluateCondition(
            targetValue,
            condition.operator,
            condition.value
          );
          
          conditions.push(conditionMet);
        });
        
        // Apply AND/OR logic
        const shouldShow = operator === 'AND' 
          ? conditions.every(Boolean)
          : conditions.some(Boolean);
          
        onFieldVisibilityChange(fieldId, shouldShow);
      }
    });
  }, [fields, fieldEntities, onFieldVisibilityChange]);
};
```

### Dynamic Validation Setup

Validation rules are populated dynamically based on field configuration:

```typescript
const setupFieldValidation = (field: FieldEntity) => {
  const validationRules: any = {};
  
  // Required validation
  if (field.validation?.custom?.required?.value) {
    validationRules.required = {
      value: true,
      message: field.validation.custom.required.message,
    };
  }
  
  // Custom validations
  Object.entries(field.validation?.custom || {}).forEach(([key, validation]) => {
    if (key !== 'required') {
      validationRules[key] = createValidationFunction(validation);
    }
  });
  
  return validationRules;
};
```

## 🚀 Performance Optimizations

### Debounced Updates
- Field value changes are debounced to prevent excessive re-renders
- Form state updates are batched for better performance

### Conditional Rendering
- Hidden fields are not rendered in the DOM
- Lazy loading for complex field components

### Memory Management
- Cleanup of event listeners and timeouts
- Proper disposal of file upload resources

This form renderer architecture provides a robust, performant, and user-friendly form experience while handling complex validation, conditional logic, and multi-page workflows.
