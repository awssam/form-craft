# Integrations System

## 🔗 Integration Architecture Overview

FormCraft provides a comprehensive integration system that allows form submissions to be automatically sent to external services. The system supports Google Sheets, Airtable, and custom webhooks with a pluggable architecture for future integrations.

## 🏗️ Integration Components

### 1. Core Integration Models

```typescript
// Integration Configuration
interface FormIntegrationType {
  id: string;
  formId: string;
  provider: 'google' | 'airtable' | 'webhook';
  connectedAccountId?: string;
  config: Record<string, any>;
  fieldMappings?: Record<string, string>;
  isActive: boolean;
  lastSyncAt?: Date;
  syncStatus?: 'success' | 'error' | 'pending';
  errorMessage?: string;
}

// Connected Account for OAuth providers
interface ConnectedAccountType {
  id: string;
  userId: string;
  provider: 'google' | 'airtable';
  accountId: string;
  accountName: string;
  accountEmail?: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  scope: string[];
  isActive: boolean;
}
```

### 2. Integration Providers

## 📊 Google Sheets Integration

### OAuth Flow

```typescript
// Step 1: Get authorization URL
export const getGoogleAuthUrl = async (): Promise<string> => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const scopes = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
};

// Step 2: Exchange code for tokens
export const exchangeGoogleCode = async (code: string): Promise<TokenInfo> => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getAccessToken(code);
  
  // Get user profile
  oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const userInfo = await oauth2.userinfo.get();

  return {
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token,
    expiryDate: tokens.expiry_date,
    userInfo: userInfo.data,
  };
};
```

### Spreadsheet Operations

```typescript
/**
 * Create a new spreadsheet for form responses
 */
export const createFormSpreadsheet = async (
  accessToken: string,
  formName: string,
  headers: string[]
): Promise<string> => {
  const sheets = google.sheets({ version: 'v4' });
  
  const response = await sheets.spreadsheets.create({
    auth: accessToken,
    requestBody: {
      properties: { 
        title: `${formName} - Responses`,
      },
      sheets: [{
        properties: { 
          title: 'Form Responses',
          gridProperties: {
            frozenRowCount: 1, // Freeze header row
          },
        },
        data: [{
          rowData: [{
            values: headers.map(header => ({
              userEnteredValue: { stringValue: header },
              userEnteredFormat: {
                backgroundColor: { red: 0.9, green: 0.9, blue: 0.9 },
                textFormat: { bold: true },
              },
            })),
          }],
        }],
      }],
    },
  });

  return response.data.spreadsheetId!;
};

/**
 * Append form submission to spreadsheet
 */
export const appendToGoogleSheet = async (
  connectedAccount: ConnectedAccountType,
  integration: FormIntegrationType,
  formData: Record<string, any>
): Promise<void> => {
  // Ensure valid access token
  const accessToken = await ensureValidGoogleToken(connectedAccount);
  
  const sheets = google.sheets({ version: 'v4', auth: accessToken });
  
  // Prepare row data based on field mappings
  const rowData = Object.entries(integration.fieldMappings || {}).map(([fieldId, columnName]) => {
    const value = formData[fieldId];
    return formatValueForSheets(value);
  });

  // Add timestamp if configured
  if (integration.config.includeTimestamp) {
    rowData.unshift(new Date().toISOString());
  }

  await sheets.spreadsheets.values.append({
    spreadsheetId: integration.config.spreadsheetId,
    range: integration.config.range || 'Form Responses!A:Z',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowData],
    },
  });
};

/**
 * Format values for Google Sheets
 */
function formatValueForSheets(value: any): string {
  if (value === null || value === undefined) return '';
  
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  return String(value);
}
```

### Token Management

```typescript
/**
 * Ensure Google access token is valid, refresh if needed
 */
export const ensureValidGoogleToken = async (
  connectedAccount: ConnectedAccountType
): Promise<string> => {
  // Check if token needs refresh
  if (!connectedAccount.tokenExpiresAt || 
      new Date() >= new Date(connectedAccount.tokenExpiresAt.getTime() - 5 * 60 * 1000)) {
    
    if (!connectedAccount.refreshToken) {
      throw new Error('No refresh token available');
    }

    // Refresh the token
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    oauth2Client.setCredentials({
      refresh_token: connectedAccount.refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    // Update stored credentials
    await ConnectedAccount.findByIdAndUpdate(connectedAccount.id, {
      accessToken: credentials.access_token!,
      tokenExpiresAt: new Date(credentials.expiry_date!),
      lastUsedAt: new Date(),
    });

    return credentials.access_token!;
  }

  // Update last used timestamp
  await ConnectedAccount.findByIdAndUpdate(connectedAccount.id, {
    lastUsedAt: new Date(),
  });

  return connectedAccount.accessToken;
};
```

## 📋 Airtable Integration

### OAuth Flow

```typescript
/**
 * Get Airtable authorization URL
 */
export const getAirtableAuthUrl = async (): Promise<string> => {
  const params = new URLSearchParams({
    client_id: process.env.AIRTABLE_CLIENT_ID!,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'data.records:read data.records:write schema.bases:read',
    state: generateStateParameter(),
  });

  return `https://airtable.com/oauth2/v1/authorize?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeAirtableCode = async (code: string): Promise<AirtableTokenInfo> => {
  const response = await fetch('https://airtable.com/oauth2/v1/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.AIRTABLE_CLIENT_ID!,
      client_secret: process.env.AIRTABLE_CLIENT_SECRET!,
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI!,
      code,
    }),
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.statusText}`);
  }

  return await response.json();
};
```

### Base and Table Operations

```typescript
/**
 * Get available bases for connected account
 */
export const getAirtableBases = async (accessToken: string): Promise<AirtableBase[]> => {
  const response = await fetch('https://api.airtable.com/v0/meta/bases', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bases: ${response.statusText}`);
  }

  const data = await response.json();
  return data.bases;
};

/**
 * Get tables for a specific base
 */
export const getAirtableTables = async (
  accessToken: string, 
  baseId: string
): Promise<AirtableTable[]> => {
  const response = await fetch(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tables: ${response.statusText}`);
  }

  const data = await response.json();
  return data.tables;
};

/**
 * Create record in Airtable
 */
export const createAirtableRecord = async (
  connectedAccount: ConnectedAccountType,
  integration: FormIntegrationType,
  formData: Record<string, any>
): Promise<void> => {
  // Prepare fields based on mapping
  const fields: Record<string, any> = {};
  
  Object.entries(integration.fieldMappings || {}).forEach(([fieldId, airtableFieldName]) => {
    const value = formData[fieldId];
    fields[airtableFieldName] = formatValueForAirtable(value);
  });

  // Add metadata if configured
  if (integration.config.includeMetadata) {
    fields['Submitted At'] = new Date().toISOString();
    fields['Form Name'] = integration.config.formName;
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${integration.config.baseId}/${integration.config.tableId}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${connectedAccount.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Airtable API error: ${errorData.error?.message || response.statusText}`);
  }
};

/**
 * Format values for Airtable fields
 */
function formatValueForAirtable(value: any): any {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  if (Array.isArray(value)) {
    return value; // Airtable handles arrays natively
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (value instanceof Date) {
    return value.toISOString();
  }
  
  return value;
}
```

## 🔗 Webhook Integration

### Webhook Configuration

```typescript
interface WebhookConfig {
  url: string;
  method: 'POST' | 'PUT' | 'PATCH';
  headers: Array<{ key: string; value: string }>;
  authType?: 'none' | 'bearer' | 'basic' | 'api-key';
  authConfig?: {
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    apiKeyHeader?: string;
  };
  payloadFormat: 'form-data' | 'json' | 'xml';
  includeMetadata: boolean;
  retryConfig: {
    maxRetries: number;
    retryDelay: number;
    retryOn: number[]; // HTTP status codes to retry on
  };
}
```

### Webhook Execution

```typescript
/**
 * Send form data to webhook
 */
export const sendWebhook = async (
  integration: FormIntegrationType,
  formData: Record<string, any>,
  formConfig: FormConfig
): Promise<void> => {
  const config = integration.config as WebhookConfig;
  
  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': getContentType(config.payloadFormat),
    'User-Agent': 'FormCraft/1.0',
  };

  // Add custom headers
  config.headers?.forEach(header => {
    headers[header.key] = header.value;
  });

  // Add authentication
  addAuthenticationHeaders(headers, config);

  // Prepare payload
  const payload = prepareWebhookPayload(formData, formConfig, config);

  // Send webhook with retry logic
  await sendWithRetry(config.url, {
    method: config.method,
    headers,
    body: payload,
  }, config.retryConfig);
};

/**
 * Prepare webhook payload based on format
 */
function prepareWebhookPayload(
  formData: Record<string, any>,
  formConfig: FormConfig,
  config: WebhookConfig
): string {
  // Base payload with form data
  const basePayload = Object.entries(formData).reduce((acc, [fieldId, value]) => {
    const field = formConfig.fieldEntities[fieldId];
    const fieldName = field?.label || fieldId;
    acc[fieldName] = value;
    return acc;
  }, {} as Record<string, any>);

  // Add metadata if configured
  if (config.includeMetadata) {
    basePayload._metadata = {
      formId: formConfig.id,
      formName: formConfig.name,
      submittedAt: new Date().toISOString(),
      version: '1.0',
    };
  }

  switch (config.payloadFormat) {
    case 'json':
      return JSON.stringify(basePayload);
    
    case 'form-data':
      const formData = new URLSearchParams();
      Object.entries(basePayload).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
      return formData.toString();
    
    case 'xml':
      return convertToXML(basePayload);
    
    default:
      return JSON.stringify(basePayload);
  }
}

/**
 * Add authentication headers
 */
function addAuthenticationHeaders(headers: Record<string, string>, config: WebhookConfig) {
  if (!config.authType || config.authType === 'none') return;

  switch (config.authType) {
    case 'bearer':
      if (config.authConfig?.token) {
        headers['Authorization'] = `Bearer ${config.authConfig.token}`;
      }
      break;
    
    case 'basic':
      if (config.authConfig?.username && config.authConfig?.password) {
        const credentials = btoa(`${config.authConfig.username}:${config.authConfig.password}`);
        headers['Authorization'] = `Basic ${credentials}`;
      }
      break;
    
    case 'api-key':
      if (config.authConfig?.apiKey && config.authConfig?.apiKeyHeader) {
        headers[config.authConfig.apiKeyHeader] = config.authConfig.apiKey;
      }
      break;
  }
}

/**
 * Send webhook with retry logic
 */
async function sendWithRetry(
  url: string,
  options: RequestInit,
  retryConfig: WebhookConfig['retryConfig']
): Promise<void> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Check if status code indicates success
      if (response.ok) {
        return; // Success
      }
      
      // Check if we should retry this status code
      if (!retryConfig.retryOn.includes(response.status)) {
        throw new Error(`Webhook failed with status ${response.status}: ${response.statusText}`);
      }
      
      lastError = new Error(`Webhook failed with status ${response.status}: ${response.statusText}`);
      
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on network errors on the last attempt
      if (attempt === retryConfig.maxRetries) {
        break;
      }
    }
    
    // Wait before retrying
    if (attempt < retryConfig.maxRetries) {
      await new Promise(resolve => setTimeout(resolve, retryConfig.retryDelay * Math.pow(2, attempt)));
    }
  }
  
  throw lastError!;
}
```

## 🔄 Integration Processing Pipeline

### Main Processing Function

```typescript
/**
 * Process all integrations for a form submission
 */
export const processFormIntegrations = async (
  formId: string,
  submissionData: Record<string, any>
): Promise<void> => {
  try {
    const [form, integrations] = await Promise.all([
      Form.findOne({ id: formId }),
      FormIntegration.find({ formId, isActive: true }),
    ]);

    if (!form || !integrations.length) {
      return;
    }

    // Process integrations in parallel
    const results = await Promise.allSettled(
      integrations.map(integration => processIntegration(form, integration, submissionData))
    );

    // Log results and update integration status
    await Promise.all(
      results.map(async (result, index) => {
        const integration = integrations[index];
        
        if (result.status === 'fulfilled') {
          await integration.updateSyncStatus('success');
          
          // Log successful integration
          await createActivity({
            type: 'integration_success',
            formId: form.id,
            formName: form.name,
            details: {
              provider: integration.provider,
              integrationId: integration.id,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          
        } else {
          const errorMessage = result.reason?.message || 'Unknown error';
          await integration.updateSyncStatus('error', errorMessage);
          
          // Log integration error
          await createActivity({
            type: 'integration_error',
            formId: form.id,
            formName: form.name,
            details: {
              provider: integration.provider,
              integrationId: integration.id,
              error: errorMessage,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      })
    );

  } catch (error) {
    console.error('Error processing form integrations:', error);
  }
};

/**
 * Process individual integration
 */
async function processIntegration(
  form: FormConfig,
  integration: FormIntegrationType,
  submissionData: Record<string, any>
): Promise<void> {
  switch (integration.provider) {
    case 'google':
      await processGoogleSheetsIntegration(form, integration, submissionData);
      break;
    
    case 'airtable':
      await processAirtableIntegration(form, integration, submissionData);
      break;
    
    case 'webhook':
      await processWebhookIntegration(form, integration, submissionData);
      break;
    
    default:
      throw new Error(`Unknown integration provider: ${integration.provider}`);
  }
}
```

### Integration Testing

```typescript
/**
 * Test integration configuration
 */
export const testIntegration = async (integrationId: string): Promise<TestResult> => {
  const integration = await FormIntegration.findById(integrationId);
  if (!integration) {
    throw new Error('Integration not found');
  }

  const form = await Form.findOne({ id: integration.formId });
  if (!form) {
    throw new Error('Form not found');
  }

  // Create test data
  const testData = generateTestData(form);

  try {
    await processIntegration(form, integration, testData);
    
    return {
      success: true,
      message: 'Integration test successful',
      timestamp: new Date(),
    };
    
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Test failed',
      timestamp: new Date(),
    };
  }
};

/**
 * Generate test data for integration testing
 */
function generateTestData(form: FormConfig): Record<string, any> {
  const testData: Record<string, any> = {};
  
  Object.values(form.fieldEntities).forEach(field => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        testData[field.id] = `Test ${field.label}`;
        break;
      case 'email':
        testData[field.id] = 'test@example.com';
        break;
      case 'number':
        testData[field.id] = 42;
        break;
      case 'select':
      case 'radio':
        testData[field.id] = field.options?.[0]?.value || 'Option 1';
        break;
      case 'checkbox':
        testData[field.id] = field.options?.slice(0, 2).map(opt => opt.value) || ['Option 1'];
        break;
      case 'date':
        testData[field.id] = new Date().toISOString().split('T')[0];
        break;
      case 'boolean':
        testData[field.id] = true;
        break;
      default:
        testData[field.id] = 'Test Value';
    }
  });
  
  return testData;
}
```

## 📊 Integration Analytics

```typescript
/**
 * Get integration analytics for a form
 */
export const getIntegrationAnalytics = async (formId: string): Promise<IntegrationAnalytics> => {
  const integrations = await FormIntegration.find({ formId });
  
  const analytics = await Promise.all(
    integrations.map(async integration => {
      const activities = await Activity.find({
        formId,
        type: { $in: ['integration_success', 'integration_error'] },
        'details.integrationId': integration.id,
      }).sort({ createdAt: -1 }).limit(100);

      const successCount = activities.filter(a => a.type === 'integration_success').length;
      const errorCount = activities.filter(a => a.type === 'integration_error').length;
      const totalAttempts = successCount + errorCount;
      
      return {
        integrationId: integration.id,
        provider: integration.provider,
        successRate: totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0,
        totalAttempts,
        lastSync: integration.lastSyncAt,
        status: integration.syncStatus,
        recentErrors: activities
          .filter(a => a.type === 'integration_error')
          .slice(0, 5)
          .map(a => ({
            timestamp: a.createdAt,
            error: a.details?.error,
          })),
      };
    })
  );

  return {
    integrations: analytics,
    overallSuccessRate: analytics.length > 0 
      ? analytics.reduce((sum, i) => sum + i.successRate, 0) / analytics.length 
      : 0,
  };
};
```

This integration system provides a robust, extensible foundation for connecting FormCraft with external services while maintaining reliability through proper error handling, retry logic, and monitoring.
