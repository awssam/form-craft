# API Routes

## 🛣️ API Architecture Overview

FormCraft uses Next.js 14 App Router API routes located in `src/app/api/`. All routes follow RESTful conventions and include proper error handling, authentication, and validation.

## 🔐 Authentication

All API routes use Clerk for authentication via the `verifyAuth()` utility function:

```typescript
// src/backend/util.ts
const verifyAuth = async (): Promise<string | null> => {
  const { userId } = auth();
  return userId;
};
```

## 📋 API Routes Structure

### Form AI Generation (`/api/form/ai`)

**Location**: `src/app/api/form/ai/route.ts`

Generates AI-powered form configurations using Google Gemini.

```typescript
POST /api/form/ai
```

**Request Body**:
```typescript
{
  prompt: string; // Natural language form description
}
```

**Response**:
```typescript
{
  message: "Success" | "Something went wrong";
  content?: FormConfig; // Generated form configuration
  status?: number;
}
```

**Implementation Details**:
- Uses Google Gemini 2.0 Flash model
- Processes natural language prompts
- Returns structured form configuration
- Includes field validation and conditional logic
- Automatically assigns user ID to generated forms

**Error Handling**:
- 401: Unauthorized (no valid session)
- 500: Internal server error (AI generation failed)

### File Upload (`/api/form/cloudinary`)

**Location**: `src/app/api/form/cloudinary/route.ts`

Handles file uploads to Cloudinary for form submissions.

```typescript
POST /api/form/cloudinary
```

**Request**: Multipart form data with files

**Response**:
```typescript
{
  success: boolean;
  urls?: string[]; // Array of uploaded file URLs
  error?: string;
}
```

**Configuration** (`src/app/api/form/cloudinary/config.ts`):
```typescript
{
  cloud_name: string;
  api_key: string;
  api_secret: string;
  upload_preset: string;
}
```

### OAuth Callbacks

#### Google OAuth Callback (`/api/callback/google`)

**Location**: `src/app/api/callback/google/route.ts`

Handles Google OAuth callback for Sheets integration.

```typescript
GET /api/callback/google?code={auth_code}&state={state}
```

**Query Parameters**:
- `code`: OAuth authorization code
- `state`: CSRF protection state parameter

**Response**: Redirects to dashboard with success/error status

#### Airtable OAuth Callback (`/api/callback/airtable`)

**Location**: `src/app/api/callback/airtable/route.ts`

Handles Airtable OAuth callback for database integration.

```typescript
GET /api/callback/airtable?code={auth_code}&state={state}
```

**Process Flow**:
1. Exchange authorization code for access token
2. Fetch user account information
3. Store connected account in database
4. Redirect to dashboard

### Token Refresh (`/api/refresh`)

**Location**: `src/app/api/refresh/route.ts`

Refreshes expired OAuth tokens for connected services.

```typescript
POST /api/refresh
```

**Request Body**:
```typescript
{
  provider: 'google' | 'airtable';
  accountId: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  token?: string; // New access token
  expiresAt?: number; // Token expiry timestamp
  error?: string;
}
```

### Webhook Endpoint (`/api/webhook`)

**Location**: `src/app/api/webhook/route.ts`

Generic webhook endpoint for receiving external notifications.

```typescript
POST /api/webhook
```

**Request Headers**:
- `Content-Type`: application/json
- `Authorization`: Bearer token (if required)

**Request Body**: JSON payload (varies by webhook source)

**Response**:
```typescript
{
  received: boolean;
  timestamp: string;
  id?: string; // Webhook processing ID
}
```

## 🔧 Backend Actions (Server Functions)

Located in `src/backend/actions/`, these are server-side functions called by API routes and components.

### Form Actions (`src/backend/actions/form.ts`)

#### `getAllForms(userId: string)`
Retrieves all forms for a user with submission metadata.

```typescript
const getAllForms = async (userId: string) => {
  // MongoDB aggregation pipeline
  // Joins with submissions collection
  // Calculates completion rates
  // Returns FormConfigWithMeta[]
}
```

#### `createForm(formConfig: FormConfig)`
Creates a new form in the database.

#### `updateForm(formId: string, updates: Partial<FormConfig>)`
Updates existing form configuration.

#### `deleteForm(formId: string, userId: string)`
Soft deletes a form (sets status to 'archived').

#### `getFormById(formId: string)`
Retrieves a single form by ID for public access.

### Form Submission Actions (`src/backend/actions/formSubmission.ts`)

#### `createFormSubmission(submission: FormSubmissionData)`
Processes new form submissions with integration handling.

```typescript
const createFormSubmission = async (submission: FormSubmissionData) => {
  // 1. Validate submission data
  // 2. Save to database
  // 3. Process integrations (Google Sheets, Airtable, Webhooks)
  // 4. Send notifications
  // 5. Update analytics
}
```

#### `getFormSubmissions(formId: string)`
Retrieves all submissions for a form.

#### `processIntegrations(formId: string, submissionData: any)`
Sends submission data to configured integrations.

### Integration Actions

#### Google Sheets (`src/backend/actions/google.ts`)

```typescript
// OAuth flow management
const getAuthorizationUrl = () => string;
const exchangeCodeForTokens = (code: string) => Promise<TokenSet>;
const refreshAccessToken = (refreshToken: string) => Promise<TokenSet>;

// Sheets operations
const createSpreadsheet = (name: string, headers: string[]) => Promise<string>;
const appendToSheet = (spreadsheetId: string, data: any[]) => Promise<void>;
const getSheets = (spreadsheetId: string) => Promise<SheetInfo[]>;
```

#### Airtable (`src/backend/actions/airtable.ts`)

```typescript
// OAuth and account management
const getAuthorizationUrl = () => string;
const exchangeCodeForTokens = (code: string) => Promise<TokenSet>;

// Airtable operations
const getBases = (accessToken: string) => Promise<BaseInfo[]>;
const getTables = (baseId: string, accessToken: string) => Promise<TableInfo[]>;
const createRecord = (baseId: string, tableId: string, data: any) => Promise<void>;
```

### Analytics Actions (`src/backend/actions/analytics.ts`)

```typescript
// Dashboard metrics
const getTotalSubmissions = (userId: string) => Promise<number>;
const getAverageCompletionRate = (userId: string) => Promise<number>;
const getMostActiveForm = (userId: string) => Promise<FormInfo>;
const getSubmissionsOvertime = (userId: string) => Promise<TimeSeriesData[]>;
const getFormCompletionRates = (userId: string) => Promise<CompletionData[]>;
const getRecentActivity = (userId: string) => Promise<ActivityData[]>;
```

### Activity Tracking (`src/backend/actions/activity.ts`)

```typescript
const createActivity = (activity: ActivityData) => Promise<void>;
const getActivities = (userId: string, filters?: ActivityFilters) => Promise<Activity[]>;
```

### Template Actions (`src/backend/actions/template.ts`)

```typescript
const getAllTemplates = () => Promise<FormTemplate[]>;
const getTemplatesByCategory = (categoryId: string) => Promise<FormTemplate[]>;
const createTemplateFromForm = (formId: string, templateMeta: TemplateMeta) => Promise<void>;
```

## 🔄 Data Flow Patterns

### Form Creation Flow
```
Client Request → API Route → Validation → Database → Response
     ↓              ↓            ↓           ↓          ↓
Form Builder → POST /api/form → verifyAuth → MongoDB → FormConfig
```

### Form Submission Flow
```
Form Submit → POST (internal) → Process → Integrations → Analytics
     ↓              ↓              ↓           ↓           ↓
User Input → createFormSubmission → Database → External APIs → Activity Log
```

### Integration Setup Flow
```
OAuth Redirect → Callback Handler → Token Exchange → Store Account → Success
      ↓                ↓                ↓              ↓          ↓
External Service → /api/callback/* → External API → Database → Dashboard
```

## 🛡️ Security Measures

### Authentication & Authorization
- All routes require valid Clerk session
- User-scoped data access (createdBy filtering)
- CSRF protection on state parameters
- Rate limiting on sensitive endpoints

### Input Validation
- TypeScript type checking
- Mongoose schema validation
- Sanitization of user inputs
- File upload restrictions

### Error Handling
- Consistent error response format
- No sensitive data in error messages
- Proper HTTP status codes
- Logging for debugging

### API Security Headers
```typescript
{
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block'
}
```

## 📊 API Monitoring

### Performance Metrics
- Response time tracking
- Error rate monitoring
- Database query performance
- Integration API latency

### Error Tracking
- Structured error logging
- Integration failure alerts
- Authentication failure tracking
- Rate limit monitoring

This API architecture provides a robust, secure, and scalable backend for FormCraft's functionality while maintaining clean separation of concerns and proper error handling.
