# Database Models

## 🗄️ Database Schema Overview

FormCraft uses MongoDB with Mongoose ODM for data persistence. All models are located in `src/backend/models/` and define the core data structures for the application.

## 📋 Form Model (`src/backend/models/form.ts`)

The main form configuration model that stores form definitions and metadata.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';
import { FormConfig } from '@/types/form-config';

const formSchema = new Schema<FormConfig>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  },
  createdBy: {
    type: String,
    required: true,
    index: true,
  },
  settings: {
    allowAnonymous: {
      type: Boolean,
      default: true,
    },
    showProgressBar: {
      type: Boolean,
      default: true,
    },
    allowGoingBack: {
      type: Boolean,
      default: true,
    },
    redirectUrl: String,
    confirmationMessage: {
      type: String,
      default: 'Thank you for your submission!',
    },
    emailNotifications: {
      enabled: {
        type: Boolean,
        default: false,
      },
      recipients: [String],
    },
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#3b82f6',
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
    fontFamily: {
      type: String,
      default: 'Inter',
    },
    borderRadius: {
      type: String,
      default: '6px',
    },
    customCss: String,
  },
  fieldEntities: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  pageOrder: {
    type: [String],
    default: [],
  },
  conditionalLogic: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  validationRules: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'forms',
});

// Indexes for performance
formSchema.index({ createdBy: 1, status: 1 });
formSchema.index({ status: 1, updatedAt: -1 });

export const Form = models.Form || model<FormConfig>('Form', formSchema);
```

### Model Methods

```typescript
// Instance methods
formSchema.methods.getPublicFields = function() {
  return {
    id: this.id,
    name: this.name,
    description: this.description,
    fieldEntities: this.fieldEntities,
    pageOrder: this.pageOrder,
    theme: this.theme,
    settings: this.settings,
    conditionalLogic: this.conditionalLogic,
    validationRules: this.validationRules,
  };
};

formSchema.methods.isOwner = function(userId: string) {
  return this.createdBy === userId;
};

// Static methods
formSchema.statics.getByUser = function(userId: string) {
  return this.find({ 
    createdBy: userId, 
    status: { $ne: 'archived' } 
  }).sort({ updatedAt: -1 });
};

formSchema.statics.getPublished = function(formId: string) {
  return this.findOne({ 
    id: formId, 
    status: 'published' 
  });
};
```

## 📝 Form Submission Model (`src/backend/models/formSubmission.ts`)

Stores form submission data and tracks submission state.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';

export interface FormSubmissionData {
  id: string;
  formId: string;
  data: Record<string, any>;
  status: 'draft' | 'completed' | 'abandoned';
  submittedAt?: Date;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  currentPage?: number;
  metadata?: Record<string, any>;
}

const formSubmissionSchema = new Schema<FormSubmissionData>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  formId: {
    type: String,
    required: true,
    index: true,
  },
  data: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    enum: ['draft', 'completed', 'abandoned'],
    default: 'draft',
    index: true,
  },
  submittedAt: {
    type: Date,
    index: true,
  },
  ipAddress: String,
  userAgent: String,
  sessionId: {
    type: String,
    index: true,
  },
  currentPage: {
    type: Number,
    default: 0,
  },
  metadata: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'formsubmissions',
});

// Compound indexes for analytics queries
formSubmissionSchema.index({ formId: 1, status: 1 });
formSubmissionSchema.index({ formId: 1, createdAt: -1 });
formSubmissionSchema.index({ status: 1, submittedAt: -1 });

export const FormSubmission = models.FormSubmission || model<FormSubmissionData>('FormSubmission', formSubmissionSchema);
```

### Model Methods

```typescript
// Mark submission as completed
formSubmissionSchema.methods.complete = function() {
  this.status = 'completed';
  this.submittedAt = new Date();
  return this.save();
};

// Get completion percentage for draft submissions
formSubmissionSchema.methods.getCompletionPercentage = function(totalFields: number) {
  if (this.status === 'completed') return 100;
  
  const filledFields = Object.keys(this.data).filter(key => {
    const value = this.data[key];
    return value !== null && value !== undefined && value !== '';
  }).length;
  
  return Math.round((filledFields / totalFields) * 100);
};

// Static methods
formSubmissionSchema.statics.getCompletedByForm = function(formId: string) {
  return this.find({ 
    formId, 
    status: 'completed' 
  }).sort({ submittedAt: -1 });
};

formSubmissionSchema.statics.getAnalytics = function(formIds: string[], startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        formId: { $in: formIds },
        status: 'completed',
        submittedAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$formId',
        count: { $sum: 1 },
        avgCompletionTime: { $avg: '$completionTime' },
      },
    },
  ]);
};
```

## 🔗 Form Integration Model (`src/backend/models/formIntegration.ts`)

Manages third-party integrations for form submissions.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';

export interface FormIntegrationType {
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

const formIntegrationSchema = new Schema<FormIntegrationType>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  formId: {
    type: String,
    required: true,
    index: true,
  },
  provider: {
    type: String,
    enum: ['google', 'airtable', 'webhook'],
    required: true,
  },
  connectedAccountId: {
    type: String,
    index: true,
  },
  config: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
  },
  fieldMappings: {
    type: Map,
    of: String,
    default: {},
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  lastSyncAt: Date,
  syncStatus: {
    type: String,
    enum: ['success', 'error', 'pending'],
  },
  errorMessage: String,
}, {
  timestamps: true,
  collection: 'formintegrations',
});

// Compound indexes
formIntegrationSchema.index({ formId: 1, provider: 1 });
formIntegrationSchema.index({ formId: 1, isActive: 1 });

export const FormIntegration = models.FormIntegration || model<FormIntegrationType>('FormIntegration', formIntegrationSchema);
```

### Model Methods

```typescript
// Update sync status
formIntegrationSchema.methods.updateSyncStatus = function(status: 'success' | 'error', errorMessage?: string) {
  this.syncStatus = status;
  this.lastSyncAt = new Date();
  if (errorMessage) {
    this.errorMessage = errorMessage;
  } else {
    this.errorMessage = undefined;
  }
  return this.save();
};

// Test integration configuration
formIntegrationSchema.methods.testConnection = async function() {
  // Implementation varies by provider
  switch (this.provider) {
    case 'google':
      return await testGoogleSheetsConnection(this);
    case 'airtable':
      return await testAirtableConnection(this);
    case 'webhook':
      return await testWebhookConnection(this);
    default:
      throw new Error(`Unknown provider: ${this.provider}`);
  }
};
```

## 👤 Connected Account Model (`src/backend/models/connectedAccount.ts`)

Stores OAuth tokens and account information for integrations.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';

export interface ConnectedAccountType {
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
  lastUsedAt?: Date;
}

const connectedAccountSchema = new Schema<ConnectedAccountType>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  provider: {
    type: String,
    enum: ['google', 'airtable'],
    required: true,
  },
  accountId: {
    type: String,
    required: true,
  },
  accountName: {
    type: String,
    required: true,
  },
  accountEmail: String,
  accessToken: {
    type: String,
    required: true,
    select: false, // Don't include in queries by default
  },
  refreshToken: {
    type: String,
    select: false,
  },
  tokenExpiresAt: Date,
  scope: [String],
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  lastUsedAt: Date,
}, {
  timestamps: true,
  collection: 'connectedaccounts',
});

// Compound indexes
connectedAccountSchema.index({ userId: 1, provider: 1 });
connectedAccountSchema.index({ userId: 1, isActive: 1 });

export const ConnectedAccount = models.ConnectedAccount || model<ConnectedAccountType>('ConnectedAccount', connectedAccountSchema);
```

### Model Methods

```typescript
// Check if token needs refresh
connectedAccountSchema.methods.needsTokenRefresh = function() {
  if (!this.tokenExpiresAt) return false;
  return new Date() >= new Date(this.tokenExpiresAt.getTime() - 5 * 60 * 1000); // 5 minutes buffer
};

// Update last used timestamp
connectedAccountSchema.methods.markAsUsed = function() {
  this.lastUsedAt = new Date();
  return this.save();
};

// Revoke access and deactivate
connectedAccountSchema.methods.revoke = function() {
  this.isActive = false;
  this.accessToken = '';
  this.refreshToken = '';
  return this.save();
};
```

## 📊 Activity Model (`src/backend/models/activity.ts`)

Tracks user actions and system events for analytics.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';

export interface ActivityModelType {
  id: string;
  type: 'created' | 'updated' | 'published' | 'archived' | 'view' | 'submission' | 'integration_error';
  formId: string;
  formName: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

const activitySchema = new Schema<ActivityModelType>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['created', 'updated', 'published', 'archived', 'view', 'submission', 'integration_error'],
    required: true,
    index: true,
  },
  formId: {
    type: String,
    required: true,
    index: true,
  },
  formName: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    index: true,
  },
  ipAddress: String,
  userAgent: String,
  details: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
  collection: 'activities',
});

// Compound indexes for analytics
activitySchema.index({ formId: 1, type: 1 });
activitySchema.index({ formId: 1, createdAt: -1 });
activitySchema.index({ type: 1, createdAt: -1 });

export const Activity = models.Activity || model<ActivityModelType>('Activity', activitySchema);
```

### Model Methods

```typescript
// Get activity summary for a form
activitySchema.statics.getFormSummary = function(formId: string, startDate: Date, endDate: Date) {
  return this.aggregate([
    {
      $match: {
        formId,
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
      },
    },
  ]);
};

// Get recent activity for dashboard
activitySchema.statics.getRecentActivity = function(formIds: string[], limit: number = 10) {
  return this.find({
    formId: { $in: formIds },
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('type formName createdAt details');
};
```

## 📋 Template Model (`src/backend/models/template.ts`)

Stores pre-built form templates for quick form creation.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';

export interface TemplateModelType {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail?: string;
  formConfig: Record<string, any>;
  tags: string[];
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
  rating: number;
  ratingCount: number;
}

const templateSchema = new Schema<TemplateModelType>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    index: true,
  },
  thumbnail: String,
  formConfig: {
    type: Map,
    of: Schema.Types.Mixed,
    required: true,
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false,
    index: true,
  },
  createdBy: {
    type: String,
    required: true,
    index: true,
  },
  usageCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  ratingCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  collection: 'templates',
});

// Text search index
templateSchema.index({
  name: 'text',
  description: 'text',
  tags: 'text',
});

// Compound indexes
templateSchema.index({ category: 1, isPublic: 1 });
templateSchema.index({ isPublic: 1, usageCount: -1 });

export const Template = models.Template || model<TemplateModelType>('Template', templateSchema);
```

### Model Methods

```typescript
// Increment usage count
templateSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  return this.save();
};

// Add rating
templateSchema.methods.addRating = function(newRating: number) {
  const totalRating = (this.rating * this.ratingCount) + newRating;
  this.ratingCount += 1;
  this.rating = totalRating / this.ratingCount;
  return this.save();
};

// Get popular templates
templateSchema.statics.getPopular = function(limit: number = 10) {
  return this.find({ isPublic: true })
    .sort({ usageCount: -1, rating: -1 })
    .limit(limit);
};

// Search templates
templateSchema.statics.search = function(query: string, category?: string) {
  const searchCriteria: any = {
    isPublic: true,
    $text: { $search: query },
  };
  
  if (category) {
    searchCriteria.category = category;
  }
  
  return this.find(searchCriteria, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};
```

## 🗂️ Template Category Model (`src/backend/models/templateCategory.ts`)

Organizes templates into categories for better navigation.

### Schema Definition

```typescript
import { Schema, model, models } from 'mongoose';

export interface TemplateCategoryType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  templateCount: number;
}

const templateCategorySchema = new Schema<TemplateCategoryType>({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  icon: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  templateCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
  collection: 'templatecategories',
});

// Index for ordering
templateCategorySchema.index({ isActive: 1, order: 1 });

export const TemplateCategory = models.TemplateCategory || model<TemplateCategoryType>('TemplateCategory', templateCategorySchema);
```

## 🔧 Database Utilities

### Connection Management

```typescript
// src/backend/db/connection.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
```

### Model Indexes Summary

| Model | Primary Indexes | Compound Indexes | Text Indexes |
|-------|----------------|------------------|--------------|
| Form | id, createdBy, status | createdBy+status, status+updatedAt | - |
| FormSubmission | id, formId, status, sessionId | formId+status, formId+createdAt, status+submittedAt | - |
| FormIntegration | id, formId, connectedAccountId | formId+provider, formId+isActive | - |
| ConnectedAccount | id, userId | userId+provider, userId+isActive | - |
| Activity | id, type, formId, userId | formId+type, formId+createdAt, type+createdAt | - |
| Template | id, category, isPublic, createdBy | category+isPublic, isPublic+usageCount | name+description+tags |
| TemplateCategory | id, name, isActive | isActive+order | - |

This database schema provides a robust foundation for FormCraft's data persistence needs while maintaining performance through strategic indexing and proper data modeling.
