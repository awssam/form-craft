# Development Guide

## 🚀 Getting Started

This guide will help you set up FormCraft for development, understand the development workflow, and contribute to the project effectively.

## 📋 Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **yarn** >= 1.22.0
- **MongoDB** >= 5.0 (local or cloud instance)
- **Git** for version control

## 🛠️ Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/formcraft.git
cd formcraft
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/formcraft

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Google OAuth (for integrations)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/callback/google

# Airtable OAuth
AIRTABLE_CLIENT_ID=your_airtable_client_id
AIRTABLE_CLIENT_SECRET=your_airtable_client_secret
AIRTABLE_REDIRECT_URI=http://localhost:3000/api/callback/airtable

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Next.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# File uploads (optional)
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

### 4. Database Setup

If using local MongoDB:

```bash
# Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod             # Linux
```

Create the database and collections:

```bash
mongosh
use formcraft
db.createCollection("forms")
db.createCollection("formsubmissions")
db.createCollection("formintegrations")
db.createCollection("connectedaccounts")
db.createCollection("activities")
db.createCollection("templates")
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## 🏗️ Project Structure

```
formcraft/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (dashboard)/     # Dashboard layout group
│   │   ├── api/             # API routes
│   │   ├── builder/         # Form builder pages
│   │   ├── form/            # Public form pages
│   │   └── landing/         # Landing page
│   ├── backend/             # Server-side logic
│   │   ├── actions/         # Database operations
│   │   ├── db/              # Database connection
│   │   └── models/          # Mongoose models
│   ├── components/          # React components
│   │   ├── common/          # Shared components
│   │   └── ui/              # UI primitives (shadcn)
│   ├── data-fetching/       # Data fetching logic
│   │   ├── client/          # React Query hooks
│   │   ├── server/          # Server-side fetching
│   │   └── functions/       # Utility functions
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── providers/           # Context providers
│   ├── types/               # TypeScript definitions
│   └── zustand/             # State management
├── public/                  # Static assets
├── docs/                    # Documentation
└── config files             # Configuration files
```

## 🔄 Development Workflow

### 1. Feature Development

```bash
# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ...

# Run tests and linting
npm run test
npm run lint

# Commit changes
git add .
git commit -m "feat: add your feature description"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

### 2. Code Quality Tools

#### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    '@typescript-eslint/recommended',
  ],
  rules: {
    'no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
  },
};
```

#### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2
}
```

#### Run Code Quality Checks

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### 3. Testing Strategy

#### Unit Tests (Jest + React Testing Library)

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

Example test file (`__tests__/components/FormField.test.tsx`):

```typescript
import { render, screen } from '@testing-library/react';
import { FormField } from '@/components/common/FormField';

describe('FormField', () => {
  it('renders text input correctly', () => {
    const field = {
      id: 'test-field',
      type: 'text',
      label: 'Test Field',
      required: true,
    };

    render(<FormField field={field} />);
    
    expect(screen.getByLabelText('Test Field')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeRequired();
  });
});
```

#### Integration Tests

```bash
# Run integration tests
npm run test:integration
```

#### E2E Tests (Playwright)

```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in UI mode
npm run test:e2e:ui
```

## 🗄️ Database Management

### MongoDB Schema Migrations

Create migration files in `migrations/` directory:

```javascript
// migrations/001_create_indexes.js
module.exports = {
  async up(db) {
    // Create indexes
    await db.collection('forms').createIndex({ createdBy: 1, status: 1 });
    await db.collection('formsubmissions').createIndex({ formId: 1, status: 1 });
  },

  async down(db) {
    // Remove indexes
    await db.collection('forms').dropIndex({ createdBy: 1, status: 1 });
    await db.collection('formsubmissions').dropIndex({ formId: 1, status: 1 });
  },
};
```

Run migrations:

```bash
# Run pending migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback
```

### Database Seeding

Seed development data:

```bash
# Seed database with sample data
npm run seed

# Seed specific data
npm run seed:forms
npm run seed:templates
```

Example seed file (`seeds/forms.js`):

```javascript
const { Form } = require('../src/backend/models/form');

const sampleForms = [
  {
    id: 'sample-contact-form',
    name: 'Contact Form',
    description: 'Simple contact form',
    createdBy: 'dev-user',
    status: 'published',
    fieldEntities: {
      'name': {
        id: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
      },
      'email': {
        id: 'email',
        type: 'email',
        label: 'Email Address',
        required: true,
      },
    },
  },
];

module.exports = async function seedForms() {
  for (const formData of sampleForms) {
    await Form.findOneAndUpdate(
      { id: formData.id },
      formData,
      { upsert: true, new: true }
    );
  }
  console.log('Forms seeded successfully');
};
```

## 🎨 UI Development

### Component Development

Follow these patterns when creating components:

```typescript
// components/example/ExampleComponent.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ExampleComponentProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ExampleComponent = forwardRef<
  HTMLDivElement,
  ExampleComponentProps
>(({ children, variant = 'default', size = 'md', className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'base-classes',
        {
          'variant-classes': variant === 'default',
          'size-classes': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

ExampleComponent.displayName = 'ExampleComponent';
```

### Storybook Development

Create stories for components:

```typescript
// components/example/ExampleComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ExampleComponent } from './ExampleComponent';

const meta: Meta<typeof ExampleComponent> = {
  title: 'Components/ExampleComponent',
  component: ExampleComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Example content',
    variant: 'default',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Example content',
    variant: 'secondary',
  },
};
```

Run Storybook:

```bash
npm run storybook
```

## 🔧 Debugging

### Development Tools

#### Debug API Routes

```typescript
// Use the debug logger
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  logger.debug('API route called', { 
    url: request.url,
    method: request.method 
  });
  
  try {
    // ... your code
  } catch (error) {
    logger.error('API error', { error });
    throw error;
  }
}
```

#### Debug React Components

```typescript
import { useEffect } from 'react';

export function MyComponent({ prop1, prop2 }) {
  // Debug prop changes
  useEffect(() => {
    console.log('Props changed:', { prop1, prop2 });
  }, [prop1, prop2]);

  return <div>...</div>;
}
```

#### Debug Zustand Store

```typescript
// Add debugging to store
import { subscribeWithSelector } from 'zustand/middleware';

export const useFormState = create(
  subscribeWithSelector((set, get) => ({
    // ... store state
  }))
);

// Subscribe to specific changes
useFormState.subscribe(
  (state) => state.currentField,
  (currentField) => console.log('Current field changed:', currentField)
);
```

### Performance Monitoring

#### React DevTools Profiler

1. Install React DevTools browser extension
2. Use Profiler tab to analyze component performance
3. Look for unnecessary re-renders

#### Next.js Bundle Analyzer

```bash
# Analyze bundle size
npm run analyze
```

Add to `next.config.mjs`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... your config
});
```

## 🚀 Deployment

### Build Process

```bash
# Build for production
npm run build

# Start production server
npm start

# Export static files (if applicable)
npm run export
```

### Environment Variables for Production

```env
# Production environment variables
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/formcraft
NEXT_PUBLIC_APP_URL=https://your-domain.com

# ... other production configs
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

#### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run Docker container
docker build -t formcraft .
docker run -p 3000:3000 formcraft
```

## 📈 Monitoring and Analytics

### Error Tracking

Set up Sentry for error tracking:

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```typescript
// lib/analytics.ts
export function trackEvent(eventName: string, properties?: any) {
  if (typeof window !== 'undefined') {
    // Track with your analytics provider
    gtag('event', eventName, properties);
  }
}
```

## 🤝 Contributing Guidelines

### Code Style

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Update documentation
6. Submit pull request

### Code Review Checklist

- [ ] Code follows project conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations addressed
- [ ] Accessibility requirements met

This development guide provides the foundation for contributing to FormCraft effectively while maintaining code quality and consistency.
