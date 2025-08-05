# Backend Actions

## 🔧 Backend Architecture Overview

FormCraft's backend actions are server-side functions that handle data operations, external integrations, and business logic. Located in `src/backend/actions/`, these functions are called by API routes and React Server Components.

## 📊 Form Actions (`src/backend/actions/form.ts`)

Handles all form-related database operations.

### Get All Forms

```typescript
export const getAllForms = async (userId: string): Promise<BackendResponse<FormConfigWithMeta[]>> => {
  try {
    await connectDB();

    const forms = await Form.aggregate([
      {
        $match: {
          createdBy: userId,
          status: { $ne: 'archived' },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $lookup: {
          from: 'formsubmissions',
          localField: 'id',
          foreignField: 'formId',
          as: 'submissions',
        },
      },
      {
        $addFields: {
          meta: {
            title: '$name',
            description: '$description',
            status: '$status',
            submissions: {
              $sum: {
                $map: {
                  input: '$submissions',
                  as: 'submission',
                  in: { $cond: [{ $eq: ['$$submission.status', 'completed'] }, 1, 0] },
                },
              },
            },
            lastModified: '$updatedAt',
          },
        },
      },
      { $unset: ['submissions'] },
    ]);

    return {
      success: true,
      data: convertToPlainObject(forms),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Create Form

```typescript
export const createForm = async (formConfig: FormConfig): Promise<BackendResponse<FormConfig>> => {
  try {
    await connectDB();

    const newForm = new Form(formConfig);
    const savedForm = await newForm.save();

    // Create initial activity
    await createActivity({
      type: 'created',
      formId: savedForm.id,
      formName: savedForm.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return {
      success: true,
      data: convertToPlainObject(savedForm),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Update Form

```typescript
export const updateForm = async (
  formId: string,
  updates: Partial<FormConfig>,
  userId: string
): Promise<BackendResponse<FormConfig>> => {
  try {
    await connectDB();

    const updatedForm = await Form.findOneAndUpdate(
      { id: formId, createdBy: userId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!updatedForm) {
      return {
        success: false,
        error: 'Form not found or unauthorized',
      };
    }

    return {
      success: true,
      data: convertToPlainObject(updatedForm),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Delete Form

```typescript
export const deleteForm = async (formId: string, userId: string): Promise<BackendResponse<boolean>> => {
  try {
    await connectDB();

    // Soft delete by setting status to archived
    const form = await Form.findOneAndUpdate(
      { id: formId, createdBy: userId },
      { status: 'archived', updatedAt: new Date() },
      { new: true }
    );

    if (!form) {
      return {
        success: false,
        error: 'Form not found or unauthorized',
      };
    }

    // Clean up related data
    await Promise.all([
      FormIntegration.deleteMany({ formId }),
      Activity.create({
        type: 'archived',
        formId: form.id,
        formName: form.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ]);

    return {
      success: true,
      data: true,
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Get Form by ID (Public)

```typescript
export const getFormById = async (formId: string): Promise<BackendResponse<FormConfig>> => {
  try {
    await connectDB();

    const form = await Form.findOne({
      id: formId,
      status: 'published',
    });

    if (!form) {
      return {
        success: false,
        error: 'Form not found or not published',
      };
    }

    return {
      success: true,
      data: convertToPlainObject(form),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

## 📝 Form Submission Actions (`src/backend/actions/formSubmission.ts`)

Handles form submissions and integrations processing.

### Create Form Submission

```typescript
export const createFormSubmission = async (
  submissionData: FormSubmissionData
): Promise<BackendResponse<FormSubmissionModel>> => {
  try {
    await connectDB();

    // Create submission record
    const submission = new FormSubmission(submissionData);
    const savedSubmission = await submission.save();

    // Process integrations if submission is completed
    if (submissionData.status === 'completed') {
      await processFormIntegrations(submissionData.formId, submissionData.data);
    }

    return {
      success: true,
      data: convertToPlainObject(savedSubmission),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Process Form Integrations

```typescript
const processFormIntegrations = async (formId: string, submissionData: Record<string, any>) => {
  try {
    const [form, integrations] = await Promise.all([
      Form.findOne({ id: formId }),
      FormIntegration.find({ formId }),
    ]);

    if (!form) return;

    // Process each integration
    const integrationPromises = integrations.map(async (integration) => {
      try {
        switch (integration.provider) {
          case 'google':
            return await saveToGoogleSheets(form, integration, submissionData);
          case 'airtable':
            return await saveToAirtable(form, integration, submissionData);
          case 'webhook':
            return await saveToWebhook(form, integration, submissionData);
          default:
            console.warn(`Unknown integration provider: ${integration.provider}`);
        }
      } catch (error) {
        console.error(`Integration error for ${integration.provider}:`, error);
        
        // Log integration error
        await createActivity({
          type: 'integration_error',
          formId: form.id,
          formName: form.name,
          details: {
            provider: integration.provider,
            error: error instanceof Error ? error.message : String(error),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    });

    await Promise.allSettled(integrationPromises);
  } catch (error) {
    console.error('Error processing integrations:', error);
  }
};
```

### Google Sheets Integration

```typescript
const saveToGoogleSheets = async (
  form: FormConfig,
  integration: FormIntegrationType,
  data: Record<string, any>
) => {
  const connectedAccount = await ConnectedAccount.findById(integration.connectedAccountId);
  if (!connectedAccount) {
    throw new Error('Connected account not found');
  }

  // Refresh token if needed
  const accessToken = await ensureValidToken(connectedAccount);

  // Prepare row data based on field mappings
  const fieldEntities = Object.values(form.fieldEntities);
  const rowData = fieldEntities.map((field) => {
    const value = data[field.name];
    return formatValueForSheets(value, field.type);
  });

  // Append to Google Sheet
  const sheets = google.sheets({ version: 'v4', auth: accessToken });
  await sheets.spreadsheets.values.append({
    spreadsheetId: integration.config.spreadsheetId,
    range: integration.config.range || 'Sheet1!A:Z',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [rowData],
    },
  });

  console.info('Data saved to Google Sheets successfully');
  return { success: true };
};
```

### Airtable Integration

```typescript
const saveToAirtable = async (
  form: FormConfig,
  integration: FormIntegrationType,
  data: Record<string, any>
) => {
  const connectedAccount = await ConnectedAccount.findById(integration.connectedAccountId);
  if (!connectedAccount) {
    throw new Error('Connected account not found');
  }

  // Prepare fields based on mapping
  const fields: Record<string, any> = {};
  Object.values(form.fieldEntities).forEach((field) => {
    const airtableFieldName = integration.fieldMappings?.[field.id] || field.label;
    const value = data[field.name];
    fields[airtableFieldName] = formatValueForAirtable(value, field.type);
  });

  // Create record in Airtable
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
    throw new Error(`Airtable API error: ${response.status} - ${response.statusText}`);
  }

  console.info('Data saved to Airtable successfully');
  return { success: true };
};
```

### Webhook Integration

```typescript
const saveToWebhook = async (
  form: FormConfig,
  integration: FormIntegrationType,
  data: Record<string, any>
) => {
  const webhookUrl = integration.config?.url;
  if (!webhookUrl) {
    throw new Error('Webhook URL not configured');
  }

  // Prepare headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  integration.config?.headers?.forEach((header: any) => {
    headers[header.key] = header.value;
  });

  // Prepare webhook body with field labels
  const webhookBody = Object.values(form.fieldEntities).reduce((acc, field) => {
    acc[field.label] = data[field.name];
    return acc;
  }, {} as Record<string, unknown>);

  // Send webhook
  const response = await fetch(webhookUrl, {
    method: integration.config?.httpMethod || 'POST',
    headers,
    body: JSON.stringify(webhookBody),
  });

  if (response.status >= 400) {
    throw new Error(`Webhook error: ${response.status} - ${response.statusText}`);
  }

  console.info('Data sent to webhook successfully');
  return { success: true };
};
```

## 📈 Analytics Actions (`src/backend/actions/analytics.ts`)

Provides analytics data for the dashboard.

### Get Total Submissions

```typescript
export const getTotalSubmissions = async (userId: string): Promise<BackendResponse<number>> => {
  try {
    await connectDB();

    // Get user's form IDs
    const userForms = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();
    const formIds = userForms.map((form) => form.id);

    // Count completed submissions
    const totalSubmissions = await FormSubmission.countDocuments({
      formId: { $in: formIds },
      status: 'completed',
    });

    return {
      success: true,
      data: totalSubmissions,
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Get Submissions Overtime

```typescript
export const getSubmissionsOvertime = async (
  userId: string,
  timeframe: 'week' | 'month' | 'year' = 'month'
): Promise<BackendResponse<TimeSeriesData[]>> => {
  try {
    await connectDB();

    const userForms = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();
    const formIds = userForms.map((form) => form.id);

    // Define aggregation pipeline based on timeframe
    const groupBy = getTimeGrouping(timeframe);
    
    const submissionsOvertime = await FormSubmission.aggregate([
      {
        $match: {
          formId: { $in: formIds },
          status: 'completed',
          createdAt: { $gte: getTimeframeStart(timeframe) },
        },
      },
      {
        $group: {
          _id: groupBy,
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill in missing time periods with zero values
    const filledData = fillTimeGaps(submissionsOvertime, timeframe);

    return {
      success: true,
      data: filledData,
    };
  } catch (error) {
    return handleError(error);
  }
};
```

### Get Form Completion Rates

```typescript
export const getFormCompletionRates = async (
  userId: string
): Promise<BackendResponse<FormCompletionData[]>> => {
  try {
    await connectDB();

    const completionRates = await Form.aggregate([
      {
        $match: {
          createdBy: userId,
          status: { $ne: 'archived' },
        },
      },
      {
        $lookup: {
          from: 'formsubmissions',
          localField: 'id',
          foreignField: 'formId',
          as: 'submissions',
        },
      },
      {
        $lookup: {
          from: 'activities',
          let: { formId: '$id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$formId', '$$formId'] },
                    { $eq: ['$type', 'view'] },
                  ],
                },
              },
            },
          ],
          as: 'views',
        },
      },
      {
        $addFields: {
          completedSubmissions: {
            $size: {
              $filter: {
                input: '$submissions',
                as: 'submission',
                cond: { $eq: ['$$submission.status', 'completed'] },
              },
            },
          },
          totalViews: { $size: '$views' },
        },
      },
      {
        $addFields: {
          completionRate: {
            $cond: [
              { $eq: ['$totalViews', 0] },
              0,
              { $multiply: [{ $divide: ['$completedSubmissions', '$totalViews'] }, 100] },
            ],
          },
        },
      },
      {
        $project: {
          name: 1,
          completionRate: 1,
          completedSubmissions: 1,
          totalViews: 1,
        },
      },
    ]);

    return {
      success: true,
      data: convertToPlainObject(completionRates),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

## 🔗 Integration Actions

### Google Sheets (`src/backend/actions/google.ts`)

```typescript
export const getAuthorizationUrl = async (): Promise<string> => {
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

export const exchangeCodeForTokens = async (code: string): Promise<TokenInfo> => {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  const { tokens } = await oauth2Client.getAccessToken(code);
  
  // Get user info
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

export const createSpreadsheet = async (
  accessToken: string,
  name: string,
  headers: string[]
): Promise<string> => {
  const sheets = google.sheets({ version: 'v4' });
  
  const response = await sheets.spreadsheets.create({
    auth: accessToken,
    requestBody: {
      properties: { title: name },
      sheets: [{
        properties: { title: 'Form Responses' },
        data: [{
          rowData: [{
            values: headers.map(header => ({ userEnteredValue: { stringValue: header } }))
          }]
        }]
      }]
    },
  });

  return response.data.spreadsheetId!;
};
```

### Airtable (`src/backend/actions/airtable.ts`)

```typescript
export const getAuthorizationUrl = async (): Promise<string> => {
  const params = new URLSearchParams({
    client_id: process.env.AIRTABLE_CLIENT_ID!,
    redirect_uri: process.env.AIRTABLE_REDIRECT_URI!,
    response_type: 'code',
    scope: 'data.records:read data.records:write',
    state: generateStateParameter(),
  });

  return `https://airtable.com/oauth2/v1/authorize?${params.toString()}`;
};

export const exchangeCodeForTokens = async (code: string): Promise<AirtableTokenInfo> => {
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

export const getBases = async (accessToken: string): Promise<AirtableBase[]> => {
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
```

## 🎯 Activity Tracking (`src/backend/actions/activity.ts`)

```typescript
export const createActivity = async (activityData: Partial<ActivityModelType>): Promise<BackendResponse<ActivityModelType>> => {
  try {
    await connectDB();

    const activity = new Activity(activityData);
    const savedActivity = await activity.save();

    return {
      success: true,
      data: convertToPlainObject(savedActivity),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getRecentActivity = async (
  userId: string,
  limit: number = 10
): Promise<BackendResponse<ActivityModelType[]>> => {
  try {
    await connectDB();

    // Get user's form IDs
    const userForms = await Form.find({ createdBy: userId }, { id: 1, _id: 0 }).lean();
    const formIds = userForms.map((form) => form.id);

    const activities = await Activity.find({
      formId: { $in: formIds },
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return {
      success: true,
      data: convertToPlainObject(activities),
    };
  } catch (error) {
    return handleError(error);
  }
};
```

## 🛡️ Utility Functions

### Error Handling

```typescript
interface BackendResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const handleError = (error: unknown): BackendResponse<never> => {
  console.error('Backend action error:', error);
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }
  
  return {
    success: false,
    error: 'Unknown error occurred',
  };
};
```

### Data Conversion

```typescript
const convertToPlainObject = (mongooseDoc: any): any => {
  if (!mongooseDoc) return mongooseDoc;
  
  if (Array.isArray(mongooseDoc)) {
    return mongooseDoc.map(convertToPlainObject);
  }
  
  if (mongooseDoc.toObject) {
    return mongooseDoc.toObject();
  }
  
  return mongooseDoc;
};
```

This backend architecture provides robust, scalable server-side functionality for FormCraft while maintaining clean separation of concerns and proper error handling.
