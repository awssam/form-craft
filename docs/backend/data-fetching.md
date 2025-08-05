# Data Fetching

## 🔄 Data Fetching Architecture

FormCraft implements a comprehensive data fetching strategy using both client-side and server-side approaches, with React Query for caching and Next.js App Router for server components.

## 📁 Directory Structure

```
src/data-fetching/
├── client/           # Client-side React Query hooks
│   ├── analytics.ts  # Analytics data fetching
│   ├── forms.ts      # Form CRUD operations
│   ├── integrations.ts # Integration management
│   ├── submissions.ts # Form submissions
│   └── templates.ts  # Template operations
├── functions/        # Shared utility functions
│   ├── api.ts        # API client configuration
│   ├── cache.ts      # Cache management
│   └── utils.ts      # Common utilities
└── server/           # Server-side data fetching
    ├── analytics.ts  # Server analytics queries
    ├── forms.ts      # Server form operations
    ├── integrations.ts # Server integration queries
    ├── submissions.ts # Server submission queries
    └── templates.ts  # Server template queries
```

## 🖥️ Server-Side Data Fetching (`src/data-fetching/server/`)

Server-side functions for React Server Components and API routes.

### Forms Server Functions (`src/data-fetching/server/forms.ts`)

```typescript
import { auth } from '@clerk/nextjs';
import { getAllForms, getFormById } from '@/backend/actions/form';
import { FormConfig, FormConfigWithMeta } from '@/types/form-config';
import { notFound } from 'next/navigation';

/**
 * Get all forms for the authenticated user
 * Used in dashboard and forms listing pages
 */
export async function getFormsServer(): Promise<FormConfigWithMeta[]> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const response = await getAllForms(userId);
  
  if (!response.success) {
    throw new Error(response.error || 'Failed to fetch forms');
  }

  return response.data || [];
}

/**
 * Get a specific form by ID (public endpoint)
 * Used in form rendering pages
 */
export async function getFormServer(formId: string): Promise<FormConfig> {
  const response = await getFormById(formId);
  
  if (!response.success || !response.data) {
    notFound();
  }

  return response.data;
}

/**
 * Get form for editing (requires ownership)
 * Used in form builder pages
 */
export async function getFormForEditingServer(formId: string): Promise<FormConfig> {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const response = await getFormById(formId);
  
  if (!response.success || !response.data) {
    notFound();
  }

  // Check ownership
  if (response.data.createdBy !== userId) {
    throw new Error('Forbidden');
  }

  return response.data;
}

/**
 * Get recent forms for quick access
 * Used in dashboard widgets
 */
export async function getRecentFormsServer(limit: number = 5): Promise<FormConfigWithMeta[]> {
  const forms = await getFormsServer();
  return forms.slice(0, limit);
}
```

### Analytics Server Functions (`src/data-fetching/server/analytics.ts`)

```typescript
import { auth } from '@clerk/nextjs';
import { 
  getTotalSubmissions, 
  getSubmissionsOvertime, 
  getFormCompletionRates,
  getTopPerformingForms 
} from '@/backend/actions/analytics';

/**
 * Get dashboard analytics data
 * Used in analytics dashboard
 */
export async function getDashboardAnalyticsServer() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const [
    totalSubmissions,
    submissionsOvertime,
    completionRates,
    topForms,
  ] = await Promise.all([
    getTotalSubmissions(userId),
    getSubmissionsOvertime(userId, 'month'),
    getFormCompletionRates(userId),
    getTopPerformingForms(userId, 5),
  ]);

  return {
    totalSubmissions: totalSubmissions.success ? totalSubmissions.data : 0,
    submissionsOvertime: submissionsOvertime.success ? submissionsOvertime.data : [],
    completionRates: completionRates.success ? completionRates.data : [],
    topForms: topForms.success ? topForms.data : [],
  };
}

/**
 * Get analytics for a specific form
 * Used in form analytics pages
 */
export async function getFormAnalyticsServer(formId: string) {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error('Unauthorized');
  }

  // Verify form ownership
  const form = await getFormForEditingServer(formId);
  
  const [
    submissionStats,
    completionFunnel,
    fieldAnalytics,
    timeAnalytics,
  ] = await Promise.all([
    getFormSubmissionStats(formId),
    getFormCompletionFunnel(formId),
    getFormFieldAnalytics(formId),
    getFormTimeAnalytics(formId),
  ]);

  return {
    form,
    submissionStats,
    completionFunnel,
    fieldAnalytics,
    timeAnalytics,
  };
}
```

### Templates Server Functions (`src/data-fetching/server/templates.ts`)

```typescript
import { 
  getAllTemplates, 
  getTemplateById, 
  getTemplateCategories,
  getFeaturedTemplates 
} from '@/backend/actions/template';

/**
 * Get all public templates
 * Used in template gallery
 */
export async function getTemplatesServer() {
  const [templates, categories] = await Promise.all([
    getAllTemplates(),
    getTemplateCategories(),
  ]);

  return {
    templates: templates.success ? templates.data : [],
    categories: categories.success ? categories.data : [],
  };
}

/**
 * Get featured templates for homepage
 */
export async function getFeaturedTemplatesServer() {
  const response = await getFeaturedTemplates(6);
  return response.success ? response.data : [];
}

/**
 * Get template by ID with usage tracking
 */
export async function getTemplateServer(templateId: string) {
  const response = await getTemplateById(templateId);
  
  if (!response.success || !response.data) {
    notFound();
  }

  return response.data;
}
```

## 🔄 Client-Side Data Fetching (`src/data-fetching/client/`)

React Query hooks for client-side data management.

### Forms Client Hooks (`src/data-fetching/client/forms.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormConfig, CreateFormData, UpdateFormData } from '@/types/form-config';
import { apiClient } from '../functions/api';

// Query keys for cache management
export const formKeys = {
  all: ['forms'] as const,
  lists: () => [...formKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...formKeys.lists(), { filters }] as const,
  details: () => [...formKeys.all, 'detail'] as const,
  detail: (id: string) => [...formKeys.details(), id] as const,
};

/**
 * Get all forms for the current user
 */
export function useForms() {
  return useQuery({
    queryKey: formKeys.lists(),
    queryFn: async () => {
      const response = await apiClient.get('/api/forms');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get a specific form by ID
 */
export function useForm(formId: string) {
  return useQuery({
    queryKey: formKeys.detail(formId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/forms/${formId}`);
      return response.data;
    },
    enabled: !!formId,
    staleTime: 10 * 60 * 1000, // 10 minutes for form details
  });
}

/**
 * Create a new form
 */
export function useCreateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFormData) => {
      const response = await apiClient.post('/api/forms', data);
      return response.data;
    },
    onSuccess: (newForm) => {
      // Invalidate and refetch forms list
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
      
      // Add the new form to the cache
      queryClient.setQueryData(formKeys.detail(newForm.id), newForm);
    },
  });
}

/**
 * Update an existing form
 */
export function useUpdateForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, data }: { formId: string; data: UpdateFormData }) => {
      const response = await apiClient.patch(`/api/forms/${formId}`, data);
      return response.data;
    },
    onSuccess: (updatedForm, { formId }) => {
      // Update the specific form in cache
      queryClient.setQueryData(formKeys.detail(formId), updatedForm);
      
      // Update the form in the list cache
      queryClient.setQueryData(formKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((form: any) => 
          form.id === formId ? updatedForm : form
        );
      });
    },
  });
}

/**
 * Delete a form
 */
export function useDeleteForm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formId: string) => {
      await apiClient.delete(`/api/forms/${formId}`);
      return formId;
    },
    onSuccess: (deletedFormId) => {
      // Remove from lists
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
      
      // Remove from individual cache
      queryClient.removeQueries({ queryKey: formKeys.detail(deletedFormId) });
    },
  });
}

/**
 * Publish/unpublish a form
 */
export function useToggleFormStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, status }: { formId: string; status: 'published' | 'draft' }) => {
      const response = await apiClient.patch(`/api/forms/${formId}/status`, { status });
      return response.data;
    },
    onSuccess: (updatedForm, { formId }) => {
      queryClient.setQueryData(formKeys.detail(formId), updatedForm);
      queryClient.invalidateQueries({ queryKey: formKeys.lists() });
    },
  });
}
```

### Submissions Client Hooks (`src/data-fetching/client/submissions.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../functions/api';

export const submissionKeys = {
  all: ['submissions'] as const,
  lists: () => [...submissionKeys.all, 'list'] as const,
  list: (formId: string) => [...submissionKeys.lists(), formId] as const,
  details: () => [...submissionKeys.all, 'detail'] as const,
  detail: (id: string) => [...submissionKeys.details(), id] as const,
};

/**
 * Get submissions for a specific form
 */
export function useFormSubmissions(formId: string) {
  return useQuery({
    queryKey: submissionKeys.list(formId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/forms/${formId}/submissions`);
      return response.data;
    },
    enabled: !!formId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get a specific submission
 */
export function useSubmission(submissionId: string) {
  return useQuery({
    queryKey: submissionKeys.detail(submissionId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/submissions/${submissionId}`);
      return response.data;
    },
    enabled: !!submissionId,
  });
}

/**
 * Submit form data (public endpoint)
 */
export function useSubmitForm() {
  return useMutation({
    mutationFn: async ({ formId, data }: { formId: string; data: Record<string, any> }) => {
      const response = await apiClient.post(`/api/form/${formId}/submit`, { data });
      return response.data;
    },
  });
}

/**
 * Save draft submission
 */
export function useSaveDraft() {
  return useMutation({
    mutationFn: async ({ 
      formId, 
      sessionId, 
      data, 
      currentPage 
    }: { 
      formId: string; 
      sessionId: string; 
      data: Record<string, any>; 
      currentPage: number; 
    }) => {
      const response = await apiClient.post(`/api/form/${formId}/draft`, {
        sessionId,
        data,
        currentPage,
      });
      return response.data;
    },
  });
}

/**
 * Export submissions to CSV
 */
export function useExportSubmissions() {
  return useMutation({
    mutationFn: async (formId: string) => {
      const response = await apiClient.get(`/api/forms/${formId}/submissions/export`, {
        responseType: 'blob',
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `submissions-${formId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    },
  });
}
```

### Analytics Client Hooks (`src/data-fetching/client/analytics.ts`)

```typescript
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../functions/api';

export const analyticsKeys = {
  all: ['analytics'] as const,
  dashboard: () => [...analyticsKeys.all, 'dashboard'] as const,
  form: (formId: string) => [...analyticsKeys.all, 'form', formId] as const,
  timeframe: (timeframe: string) => [...analyticsKeys.all, 'timeframe', timeframe] as const,
};

/**
 * Get dashboard analytics overview
 */
export function useDashboardAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.dashboard(),
    queryFn: async () => {
      const response = await apiClient.get('/api/analytics/dashboard');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });
}

/**
 * Get analytics for a specific form
 */
export function useFormAnalytics(formId: string) {
  return useQuery({
    queryKey: analyticsKeys.form(formId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/forms/${formId}`);
      return response.data;
    },
    enabled: !!formId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Get submissions over time with timeframe
 */
export function useSubmissionsOvertime(timeframe: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: [...analyticsKeys.timeframe(timeframe), 'submissions-overtime'],
    queryFn: async () => {
      const response = await apiClient.get(`/api/analytics/submissions-overtime?timeframe=${timeframe}`);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get real-time analytics (shorter cache time)
 */
export function useRealTimeAnalytics(formId?: string) {
  return useQuery({
    queryKey: formId 
      ? [...analyticsKeys.form(formId), 'realtime'] 
      : [...analyticsKeys.dashboard(), 'realtime'],
    queryFn: async () => {
      const endpoint = formId 
        ? `/api/analytics/forms/${formId}/realtime` 
        : '/api/analytics/realtime';
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}
```

### Integrations Client Hooks (`src/data-fetching/client/integrations.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../functions/api';

export const integrationKeys = {
  all: ['integrations'] as const,
  lists: () => [...integrationKeys.all, 'list'] as const,
  list: (formId: string) => [...integrationKeys.lists(), formId] as const,
  connectedAccounts: () => [...integrationKeys.all, 'connected-accounts'] as const,
};

/**
 * Get connected accounts for current user
 */
export function useConnectedAccounts() {
  return useQuery({
    queryKey: integrationKeys.connectedAccounts(),
    queryFn: async () => {
      const response = await apiClient.get('/api/integrations/accounts');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Get integrations for a specific form
 */
export function useFormIntegrations(formId: string) {
  return useQuery({
    queryKey: integrationKeys.list(formId),
    queryFn: async () => {
      const response = await apiClient.get(`/api/forms/${formId}/integrations`);
      return response.data;
    },
    enabled: !!formId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Create a new integration
 */
export function useCreateIntegration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/api/integrations', data);
      return response.data;
    },
    onSuccess: (newIntegration) => {
      queryClient.invalidateQueries({ 
        queryKey: integrationKeys.list(newIntegration.formId) 
      });
    },
  });
}

/**
 * Test integration connection
 */
export function useTestIntegration() {
  return useMutation({
    mutationFn: async (integrationId: string) => {
      const response = await apiClient.post(`/api/integrations/${integrationId}/test`);
      return response.data;
    },
  });
}

/**
 * Connect to Google Sheets
 */
export function useConnectGoogleSheets() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiClient.post('/api/integrations/google/connect', { code });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.connectedAccounts() });
    },
  });
}

/**
 * Connect to Airtable
 */
export function useConnectAirtable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await apiClient.post('/api/integrations/airtable/connect', { code });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: integrationKeys.connectedAccounts() });
    },
  });
}
```

## 🛠️ Utility Functions (`src/data-fetching/functions/`)

### API Client Configuration (`src/data-fetching/functions/api.ts`)

```typescript
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://formcraft.app' 
    : 'http://localhost:3000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (Clerk handles this automatically in most cases)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - Clerk will redirect to sign-in
      window.location.href = '/sign-in';
    }
    
    return Promise.reject(error);
  }
);
```

### Cache Management (`src/data-fetching/functions/cache.ts`)

```typescript
import { QueryClient } from '@tanstack/react-query';

/**
 * Global query client configuration
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

/**
 * Prefetch forms for faster navigation
 */
export async function prefetchForms() {
  await queryClient.prefetchQuery({
    queryKey: ['forms', 'list'],
    queryFn: async () => {
      const response = await apiClient.get('/api/forms');
      return response.data;
    },
  });
}

/**
 * Clear all form-related cache
 */
export function clearFormCache() {
  queryClient.removeQueries({ queryKey: ['forms'] });
}

/**
 * Optimistically update form in cache
 */
export function optimisticFormUpdate(formId: string, updates: Partial<any>) {
  queryClient.setQueryData(['forms', 'detail', formId], (old: any) => {
    if (!old) return old;
    return { ...old, ...updates };
  });
}
```

### Common Utilities (`src/data-fetching/functions/utils.ts`)

```typescript
/**
 * Transform form data for API submission
 */
export function transformFormDataForAPI(formData: Record<string, any>) {
  const transformed: Record<string, any> = {};
  
  Object.entries(formData).forEach(([key, value]) => {
    // Handle file uploads
    if (value instanceof File || value instanceof FileList) {
      transformed[key] = value;
      return;
    }
    
    // Handle arrays (multi-select, checkboxes)
    if (Array.isArray(value)) {
      transformed[key] = value;
      return;
    }
    
    // Handle empty strings
    if (value === '') {
      transformed[key] = null;
      return;
    }
    
    transformed[key] = value;
  });
  
  return transformed;
}

/**
 * Generate query key with parameters
 */
export function generateQueryKey(base: string[], params?: Record<string, any>) {
  if (!params) return base;
  
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => {
      acc[key] = params[key];
      return acc;
    }, {} as Record<string, any>);
  
  return [...base, sortedParams];
}

/**
 * Handle API errors consistently
 */
export function handleAPIError(error: any) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}
```

## 📊 Performance Optimization

### Query Key Patterns

```typescript
// Hierarchical query keys for efficient invalidation
const queryKeys = {
  forms: {
    all: ['forms'] as const,
    lists: () => [...queryKeys.forms.all, 'list'] as const,
    list: (filters: any) => [...queryKeys.forms.lists(), { filters }] as const,
    details: () => [...queryKeys.forms.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.forms.details(), id] as const,
  },
  submissions: {
    all: ['submissions'] as const,
    byForm: (formId: string) => [...queryKeys.submissions.all, 'form', formId] as const,
  },
};
```

### Optimistic Updates

```typescript
// Example of optimistic update for form status
const useOptimisticFormStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateFormStatus,
    onMutate: async ({ formId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: formKeys.detail(formId) });
      
      // Snapshot previous value
      const previousForm = queryClient.getQueryData(formKeys.detail(formId));
      
      // Optimistically update
      queryClient.setQueryData(formKeys.detail(formId), (old: any) => ({
        ...old,
        status,
      }));
      
      return { previousForm };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousForm) {
        queryClient.setQueryData(formKeys.detail(variables.formId), context.previousForm);
      }
    },
    onSettled: (data, error, { formId }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: formKeys.detail(formId) });
    },
  });
};
```

This data fetching architecture provides efficient, type-safe data management with proper caching, error handling, and performance optimizations throughout FormCraft.
