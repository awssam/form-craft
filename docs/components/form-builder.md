# Form Builder Components

## 🏗️ Form Builder Architecture

The form builder is the core feature of FormCraft, allowing users to visually create forms through a drag-and-drop interface. It's organized into three main panes with specialized functionality.

## 📐 Layout Structure

### Three-Pane Layout

```
┌─────────────┬─────────────────┬─────────────┐
│             │                 │             │
│  Left Pane  │   Center Pane   │ Right Pane  │
│             │                 │             │
│ Form Config │  Form Preview   │ Field Tools │
│             │                 │             │
└─────────────┴─────────────────┴─────────────┘
```

## 🎨 Left Pane Components

**Location**: `src/app/builder/_components/left-pane/`

The left pane contains form configuration, structure management, customization, and integrations.

### Main Container (`LeftPane.tsx`)

```typescript
const LeftPane = () => {
  const { section } = useFormSectionDisplay();
  
  return (
    <div className="w-80 border-r bg-background">
      <Header />
      <BreadCrumbs />
      {section === FORMSECTIONS.Info && <FormInfo />}
      {section === FORMSECTIONS.Structure && <FormStructure />}
      {section === FORMSECTIONS.Customization && <FormCustomization />}
      {section === FORMSECTIONS.Integrations && <FormIntegrations />}
    </div>
  );
};
```

### Header Navigation (`Header.tsx`)

Provides navigation between different form configuration sections.

```typescript
interface HeaderProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'info', label: 'Form Info', icon: Info },
  { id: 'structure', label: 'Structure', icon: List },
  { id: 'customization', label: 'Customize', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];
```

### Form Information Section (`form-info/`)

#### FormInfo.tsx
Main container for basic form settings.

#### Fields Components (`form-info/fields.tsx`)

**FormName**: Editable form title
```typescript
const FormName = () => {
  const name = useFormProperty('name');
  const updateFormConfig = useFormActionProperty('updateFormConfig');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ name: e.target.value });
  };
  
  return <Input value={name} onChange={handleChange} />;
};
```

**FormDescription**: Form description editor
**FormTags**: Tag management for categorization
**FormCover**: Cover image upload (coming soon)
**FormStatus**: Draft/Published status toggle

### Form Structure Section (`form-structure/`)

#### FormStructure.tsx
Main container with drag-and-drop functionality using `@dnd-kit`.

```typescript
const FormStructure = () => {
  const [activeField, setActiveField] = useState<FieldEntity | null>(null);
  
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={fieldIds} strategy={verticalListSortingStrategy}>
        {pages.map((pageId) => (
          <DroppablePageArea key={pageId} pageId={pageId}>
            {fields.map((fieldId) => (
              <DraggableField key={fieldId} id={fieldId} />
            ))}
          </DroppablePageArea>
        ))}
      </SortableContext>
      <DragOverlay>
        {activeField && <DraggableField id={activeField.id} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
};
```

#### DraggableField.tsx
Individual draggable field component.

```typescript
interface DraggableFieldProps {
  id: string;
  label: string;
  activeField?: FieldEntity | null;
  isOverlay?: boolean;
  onFieldSettingsClick: (id: string) => void;
}

const DraggableField = ({ id, label, isOverlay, onFieldSettingsClick }: DraggableFieldProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useSortable({ id });
  
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn('field-item', { 'is-dragging': isDragging })}
      {...attributes}
    >
      <div {...listeners}>
        <Grip className="drag-handle" />
      </div>
      <span>{label}</span>
      <Button onClick={() => onFieldSettingsClick(id)}>
        <Settings />
      </Button>
    </div>
  );
};
```

#### DroppablePageArea.tsx
Drop zone for form pages.

#### PageDivider.tsx
Visual separator between form pages with page controls.

### Form Customization Section (`form-customization/`)

#### FormCustomization.tsx
Main container for theme and styling options.

#### Customization Fields (`form-customization/fields.tsx`)

**FormTheme**: Theme selection component
```typescript
const FormTheme = () => {
  const theme = useFormProperty('theme');
  const updateFormTheme = useFormActionProperty('updateFormTheme');
  
  const formThemeOptions = Object.entries(formThemes).map(([key, value]) => ({
    label: value.name,
    value: key,
  }));
  
  return (
    <Combobox
      options={formThemeOptions}
      selectedValues={[currentTheme]}
      handleChange={handleThemeChange}
    />
  );
};
```

**FormFontPicker**: Dynamic font loading and selection
**FormFontPrimaryColor**: Primary text color picker
**FormFontSecondaryColor**: Secondary text color picker

### Form Integrations Section (`form-integrations/`)

#### FormIntegrations.tsx
Main container for external service integrations.

#### Google Sheets Integration (`google-sheets/`)

**GoogleSheetIntegrationModal.tsx**: Complete Google Sheets setup flow
```typescript
const GoogleSheetIntegrationModal = ({ open, onOpenChange }: ModalProps) => {
  const [step, setStep] = useState<'connect' | 'configure' | 'mapping'>('connect');
  const { data: connectedAccount } = useConnectedGoogleAccount({ enabled: open });
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === 'connect' && <ConnectAccountStep />}
        {step === 'configure' && <ConfigureSheetStep />}
        {step === 'mapping' && <FieldMappingStep />}
      </DialogContent>
    </Dialog>
  );
};
```

**useGoogleSheetIntegrationUtils.tsx**: Custom hooks for Google Sheets operations
- `useConnectedGoogleAccount`: Manage connected accounts
- `useGoogleSheets`: Fetch available spreadsheets
- `useCreateGoogleSheet`: Create new spreadsheets

#### Airtable Integration (`airtable/`)

**AirtableIntegrationModal.tsx**: Airtable database integration setup
**useAirtableIntegrationUtils.tsx**: Airtable-specific hooks
- `useAirtableAuthUrl`: Generate OAuth URLs
- `useConnectedAirtableAccount`: Account management
- `useAirtableBases`: Fetch available bases
- `useAirtableTables`: Fetch base tables

#### Webhook Integration (`webhook/`)

**WebhookIntegrationModal.tsx**: Custom webhook configuration
```typescript
interface WebhookConfig {
  url: string;
  httpMethod: 'POST' | 'PUT';
  headers: Array<{
    key: string;
    value: string;
    editable: boolean;
  }>;
}
```

**useWebhookIntegration.tsx**: Webhook-specific functionality

## 🎯 Center Pane Components

**Location**: `src/app/builder/_components/center-pane/`

The center pane displays a live preview of the form being built.

### Main Container (`CenterPane.tsx`)

```typescript
const CenterPane = () => {
  const formConfig = useFormConfigStore((s) => s.formConfig);
  
  return (
    <div className="flex-1 p-4 overflow-auto">
      <FormContent formConfig={formConfig} />
    </div>
  );
};
```

### Form Components (`form/`)

#### FormContent.tsx
Main form preview container with drag-and-drop support.

#### FormHeader.tsx
Displays form title, description, and progress indicator.

```typescript
const FormHeader = ({ formConfig, currentPageNumber }: FormHeaderProps) => {
  const totalPages = formConfig.pages?.length || 1;
  
  return (
    <div className="form-header">
      <h1>{formConfig.name}</h1>
      <p>{formConfig.description}</p>
      {formConfig.multiPage && (
        <div className="progress">
          Page {currentPageNumber} of {totalPages}
        </div>
      )}
    </div>
  );
};
```

#### FieldRenderer.tsx
Routes field rendering to appropriate components based on field type.

```typescript
const FieldRenderer = ({ field, control, isOverlay }: FieldRendererProps) => {
  const commonProps = { field, control, isOverlay };
  
  switch (field.type) {
    case 'text':
      return <TextInput {...commonProps} />;
    case 'textarea':
      return <TextareaInput {...commonProps} />;
    case 'checkbox':
      return <CheckboxInput {...commonProps} />;
    case 'radio':
      return <RadioInput {...commonProps} />;
    case 'dropdown':
      return <DropdownInput {...commonProps} />;
    case 'date':
      return <DateInput {...commonProps} />;
    case 'file':
      return <FileInput {...commonProps} />;
    default:
      return null;
  }
};
```

#### SortableFormFieldContainer.tsx
Manages drag-and-drop for form fields within pages.

#### DroppableFormPage.tsx
Drop zone for individual form pages.

#### NewPagePlaceholder.tsx
UI for adding new pages to multi-page forms.

### Field Components (`form/fields/`)

#### Base Components

**FormFieldWrapper.tsx**: Common wrapper for all field types
```typescript
const FormFieldWrapper = ({ control, field, render }: FormFieldWrapperProps) => {
  const { setValue } = useFormContext();
  const updateFormField = useFormConfigStore((s) => s.updateFormField);
  
  // Handle default values and field updates
  useEffect(() => {
    if (field.defaultValue) {
      setValue(field.name, field.defaultValue);
    }
  }, [field.defaultValue, field.name, setValue]);
  
  return (
    <FormField
      control={control}
      name={field.name}
      rules={field.validation}
      render={render}
    />
  );
};
```

**FormFieldLabelAndControls.tsx**: Field labels with inline controls
**DraggableFieldWrapper.tsx**: Drag-and-drop wrapper for fields
**FormLabel.tsx**: Styled form labels
**EditableHelperText.tsx**: Inline editable help text

#### Field Type Components

**TextInput.tsx**: Single-line text input
```typescript
const TextInput = ({ field, control, isOverlay }: FormFieldProps) => {
  return (
    <FormFieldWrapper
      control={control}
      field={field}
      render={(rhFormField) => (
        <DraggableFieldWrapper id={field.id} isOverlay={isOverlay}>
          {({ style, listeners, attributes, setActivatorNodeRef, setNodeRef }) => (
            <div ref={setNodeRef} style={style}>
              <FormFieldLabelAndControls
                field={field}
                listeners={listeners}
                attributes={attributes}
                setActivatorNodeRef={setActivatorNodeRef}
              />
              <Input
                {...rhFormField}
                placeholder={field.placeholder}
                disabled={field.readonly}
                className={getFieldClasses(field)}
              />
              <EditableHelperText field={field} />
            </div>
          )}
        </DraggableFieldWrapper>
      )}
    />
  );
};
```

**TextareaInput.tsx**: Multi-line text input
**CheckboxInput.tsx**: Checkbox with multiple options
**RadioInput.tsx**: Radio button groups
**DropdownInput.tsx**: Select dropdown with multi-select support
**DateInput.tsx**: Date picker component
**FileInput.tsx**: File upload with drag-and-drop

#### Higher-Order Components

**withResponsiveWidthClasses.tsx**: Adds responsive width styling
```typescript
const withResponsiveWidthClasses = (Component: React.FC<any>) => {
  return (props: any) => {
    const widthClasses = getResponsiveClasses(props.field.width);
    return <Component {...props} className={cn(props.className, widthClasses)} />;
  };
};
```

## 🛠️ Right Pane Components

**Location**: `src/app/builder/_components/right-pane/`

The right pane provides field selection and configuration tools.

### Main Container (`RightPane.tsx`)

```typescript
const RightPane = () => {
  const { section } = useFormSectionDisplay();
  const selectedField = useSelectedFieldStore((s) => s.selectedField);
  
  return (
    <div className="w-80 border-l bg-background">
      {selectedField ? <FieldConfigMenu /> : <FieldListMenu />}
    </div>
  );
};
```

### Field List Menu (`field-list-menu/`)

#### FieldListMenu.tsx
Displays available field types for adding to forms.

#### FieldCard.tsx
Individual field type cards with drag-and-drop.

```typescript
const FieldCard = ({ field }: FieldCardProps) => {
  const addField = useFormActionProperty('addField');
  
  const handleAddField = () => {
    const newField = createNewFormField({
      type: field.type,
      name: generateId(),
      label: field.name,
    });
    
    addField(currentPageId, newField);
  };
  
  return (
    <Card className="field-card" onClick={handleAddField}>
      <field.icon />
      <span>{field.name}</span>
      <p>{field.description}</p>
    </Card>
  );
};
```

#### Configuration (`config.tsx`)
Defines available field types and their properties.

### Field Configuration Menu (`field-config-menu/`)

#### FieldConfigMenu.tsx
Main container for selected field configuration.

#### Configuration Section (`config-section/`)

**FieldConfigSection.tsx**: Basic field properties
**Fields.tsx**: Individual configuration components
- `FieldName`: Field identifier (read-only)
- `FieldType`: Field type selector with conversion
- `FieldLabel`: Display label editor
- `FieldPlaceholder`: Placeholder text editor
- `FieldHelperText`: Help text editor
- `FieldDefaultValue`: Default value configuration
- `FieldWidth`: Field width selector (25%, 50%, 75%, 100%)
- `FieldOptionsForm`: Options editor for select fields
- `FieldAllowMultiSelect`: Multi-select toggle

```typescript
const FieldLabel = memo(() => {
  const { handlePropertyChange } = useSelectedFieldUpdate();
  const selectedField = useSelectedField();
  
  return (
    <FormFieldWrapper
      id="label"
      label="Field Label"
      required
      helperText="This is what users will see"
    >
      <Input
        defaultValue={selectedField?.label}
        onChange={handlePropertyChange('label')}
        placeholder="Enter field label"
      />
    </FormFieldWrapper>
  );
});
```

#### Validation Section (`validation-section/`)

**FieldValidationSection.tsx**: Validation rules configuration
**Fields.tsx**: Validation-specific components
- Required field validation
- Custom validation rules
- Regex pattern validation
- Length constraints
- Number range validation

#### Conditional Logic Section (`conditional-logic-section/`)

**ConditionalLogicSection.tsx**: Show/hide field logic
- Field dependency setup
- Condition operators
- Multiple condition handling
- AND/OR logic combinations

#### Action Section (`action-section/`)

**FieldActionSection.tsx**: Field-level actions
- Duplicate field
- Delete field confirmation
- Field conversion options

## 🔧 Shared Components

### Modal Components

**AddFieldModal.tsx**: Modal for adding new fields
**DeleteFieldModal.tsx**: Confirmation modal for field deletion
**DeletePageModal.tsx**: Confirmation modal for page deletion

### Display Components

**SectionDisplay.tsx**: Responsive section navigation for mobile
**BreadCrumbs.tsx**: Navigation breadcrumb trail

## 🎨 Styling and Theming

### Responsive Design
- Mobile-first approach
- Collapsible panes on smaller screens
- Touch-friendly drag handles
- Optimized for tablet use

### Theme Integration
- Real-time theme preview
- Custom color picker integration
- Font family loading and preview
- Theme property inheritance

### Animation and Interactions
- Smooth drag-and-drop animations
- Hover states and feedback
- Loading states for async operations
- Micro-interactions for better UX

This form builder architecture provides a comprehensive, user-friendly interface for creating complex forms while maintaining code organization and reusability.
