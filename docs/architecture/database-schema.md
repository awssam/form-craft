# Database Schema

## 🗄️ Database Overview

FormCraft uses MongoDB as its primary database with Mongoose for object modeling. The schema is designed to be flexible and scalable, supporting complex form structures and relationships.

## 📊 Core Data Models

### Form Model (`src/backend/models/form.ts`)

The central entity that defines a complete form configuration.

```typescript
interface FormModel {
  id: string;                    // Unique form identifier
  _id?: string;                  // MongoDB ObjectId
  createdBy: string;             // User ID (from Clerk)
  name: string;                  // Form display name
  description: string;           // Form description
  image?: string;                // Form cover image URL
  status: 'draft' | 'published' | 'archived'; // Form status
  tags: string[];                // Categorization tags
  multiPage: boolean;            // Multi-page form flag
  pages: string[];               // Array of page IDs
  pageEntities: Map<string, PageEntity>; // Page configurations
  fieldEntities: Map<string, FieldEntity>; // Field configurations
  settings: FormSettings;        // Form-level settings
  styles: FormStyles;           // Custom styling
  theme: FormTheme;             // Theme configuration
  createdAt: Date;              // Creation timestamp
  updatedAt: Date;              // Last update timestamp
}
```

### Page Entity

Represents a single page in a multi-page form.

```typescript
interface PageEntity {
  id: string;         // Unique page identifier
  name: string;       // Page display name
  fields: string[];   // Ordered array of field IDs
}
```

### Field Entity

Defines individual form fields with validation and logic.

```typescript
interface FieldEntity {
  id: string;                    // Unique field identifier
  name: string;                  // Field name (for form data)
  type: FieldType;               // Field type (text, checkbox, etc.)
  label: string;                 // Display label
  placeholder?: string;          // Input placeholder text
  helperText?: string;           // Help text for users
  defaultValue?: ValueType;      // Pre-filled value
  readonly?: boolean;            // Read-only flag
  validation?: FieldValidation;  // Validation rules
  options?: FieldOption[];       // Options for select fields
  conditionalLogic?: ConditionalLogic; // Show/hide logic
  width: FormFieldWidth;         // Field width (25%, 50%, 75%, 100%)
  value?: ValueType;             // Current field value
  allowMultiSelect?: boolean;    // Multiple selections allowed
}
```

### Field Types

```typescript
type FieldType = 'text' | 'checkbox' | 'radio' | 'dropdown' | 'date' | 'textarea' | 'file';
```

### Field Validation Schema

```typescript
interface FieldValidation {
  validate?: Record<string, Function>; // Runtime validation functions
  required?: {
    value: boolean;
    message: string;
  };
  custom?: Record<string, {
    value: any;           // Validation criteria
    message: string;      // Error message
    type: 'withValue' | 'binary'; // Validation type
  }>;
}
```

### Conditional Logic Schema

```typescript
interface ConditionalLogic {
  showWhen: Array<{
    fieldId: string;      // Target field ID
    operatorType: string; // Operator category
    label: string;        // Human-readable condition
    operator: string;     // Comparison operator
    value: string;        // Comparison value
  }>;
  operator: 'AND' | 'OR'; // Logic operator for multiple conditions
}
```

### Form Settings

```typescript
interface FormSettings {
  submission: {
    emailNotifications: boolean; // Enable email alerts
    redirectURL: string;         // Post-submission redirect
  };
  fileUploadLimit: string;       // File size limit (e.g., "5MB")
}
```

### Form Theme

```typescript
interface FormTheme {
  type: Theme;           // Theme identifier
  id: Theme;             // Theme ID
  properties: {
    formBackgroundColor: string;   // Background color
    primaryTextColor: string;      // Main text color
    secondaryTextColor: string;    // Secondary text color
    inputPlaceholderColor: string; // Placeholder text color
    inputBorderColor: string;      // Input border color
    borderRadius: string;          // Border radius value
  };
}

type Theme = 'midnight-black' | 'deep-space' | 'charcoal-black' | 'deep-violet' | 'night-sky';
```

## 📝 Form Submission Model (`src/backend/models/formSubmission.ts`)

Stores user responses to forms.

```typescript
interface FormSubmissionModel {
  _id?: string;                              // MongoDB ObjectId
  submissionType: 'anonymous' | 'authenticated'; // Submission type
  submittedBy: string;                       // User/session identifier
  formId: string;                           // Reference to form
  data: Map<string, Object>;                // Form field responses
  status: 'pending' | 'completed';         // Submission status
  createdAt: Date;                          // Submission timestamp
  updatedAt: Date;                          // Last update timestamp
}
```

## 🎯 Activity Model (`src/backend/models/activity.ts`)

Tracks form-related activities for analytics.

```typescript
interface ActivityModel {
  _id?: string;                                                    // MongoDB ObjectId
  type: 'submission' | 'published' | 'unpublished' | 'integration_error'; // Activity type
  formId: string;                                                  // Reference to form
  formName: string;                                               // Form name at time of activity
  details?: Object;                                               // Additional activity data
  createdAt: Date;                                                // Activity timestamp
  updatedAt: Date;                                                // Last update timestamp
}
```

## 🔗 Integration Models

### Connected Account Model (`src/backend/models/connectedAccount.ts`)

Stores OAuth connections to external services.

```typescript
interface ConnectedAccountModel {
  _id?: string;           // MongoDB ObjectId
  userId: string;         // User ID from Clerk
  accountId: string;      // External account ID
  accountEmail: string;   // External account email
  accountPicture?: string; // Profile picture URL
  provider: 'google' | 'airtable'; // Service provider
  accessToken: string;    // OAuth access token
  refreshToken?: string;  // OAuth refresh token
  expiryDate?: BigInt;   // Token expiry date
  tokenType?: string;     // Token type (usually "Bearer")
  idToken?: string;       // OpenID Connect ID token
  scope?: string;         // OAuth scope permissions
}
```

### Form Integration Model (`src/backend/models/formIntegration.ts`)

Links forms to external services with configuration.

```typescript
interface FormIntegrationModel {
  _id?: string;                    // MongoDB ObjectId
  formId: string;                  // Reference to form
  userId: string;                  // User ID from Clerk
  connectedAccountId: string;      // Reference to connected account
  provider: string;                // Service provider name
  fieldMappings?: Object;          // Field mapping configuration
  config?: Object;                 // Provider-specific configuration
  createdAt: Date;                 // Creation timestamp
  updatedAt: Date;                 // Last update timestamp
}
```

## 📚 Template Models

### Template Model (`src/backend/models/template.ts`)

Pre-built form configurations for quick setup.

```typescript
interface TemplateModel {
  _id?: string;              // MongoDB ObjectId
  id: string;                // Unique template identifier
  templateConfig: FormModel; // Complete form configuration
  meta: {
    name: string;            // Template display name
    description?: string;    // Template description
    image?: string;          // Template preview image
  };
}
```

### Template Category Model (`src/backend/models/templateCategory.ts`)

Groups templates by category.

```typescript
interface TemplateCategoryModel {
  _id?: string;        // MongoDB ObjectId
  id: string;          // Unique category identifier
  name: string;        // Category display name
  templates: string[]; // Array of template IDs
}
```

## 🔍 Database Indexes

### Performance Indexes

```javascript
// Form collection
db.forms.createIndex({ "createdBy": 1, "updatedAt": -1 })
db.forms.createIndex({ "status": 1 })
db.forms.createIndex({ "name": "text" })

// FormSubmission collection
db.formsubmissions.createIndex({ "formId": 1, "createdAt": -1 })
db.formsubmissions.createIndex({ "submittedBy": 1 })
db.formsubmissions.createIndex({ "status": 1 })

// Activity collection
db.activities.createIndex({ "formId": 1, "createdAt": -1 })
db.activities.createIndex({ "type": 1 })

// ConnectedAccount collection
db.connectedaccounts.createIndex({ "userId": 1, "provider": 1 })

// FormIntegration collection
db.formintegrations.createIndex({ "formId": 1 })
db.formintegrations.createIndex({ "userId": 1, "provider": 1 })
```

## 📊 Data Relationships

### Relationship Diagram

```
User (Clerk) ─┬─ Form ─┬─ FormSubmission
              │        ├─ Activity
              │        └─ FormIntegration ─ ConnectedAccount
              │
              ├─ ConnectedAccount
              │
              └─ Template ─ TemplateCategory
```

### Key Relationships

1. **User → Form**: One-to-many (user can create multiple forms)
2. **Form → FormSubmission**: One-to-many (form can have multiple submissions)
3. **Form → Activity**: One-to-many (form can have multiple activities)
4. **Form → FormIntegration**: One-to-many (form can have multiple integrations)
5. **User → ConnectedAccount**: One-to-many (user can connect multiple accounts)
6. **FormIntegration → ConnectedAccount**: Many-to-one (integrations use connected accounts)
7. **Template → TemplateCategory**: Many-to-one (templates belong to categories)

## 🔒 Data Security

### Access Control
- All data is user-scoped (filtered by `createdBy` or `userId`)
- Authentication required for all operations
- Row-level security through Clerk user context

### Data Validation
- Mongoose schema validation
- Custom validation functions
- Type safety with TypeScript
- Input sanitization

### Privacy Considerations
- Personal data in submissions is encrypted at rest
- Access tokens are encrypted
- Audit trail via Activity model
- GDPR compliance ready

This database schema supports the complex requirements of a form builder while maintaining performance and scalability.
