# Project Structure

## 📁 Root Directory Structure

```
form-craft/
├── src/                          # Source code
├── public/                       # Static assets
├── docs/                         # Documentation (this folder)
├── package.json                  # Dependencies and scripts
├── next.config.mjs              # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── components.json              # shadcn/ui configuration
├── postcss.config.mjs           # PostCSS configuration
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── .eslintrc.json              # ESLint configuration
└── README.md                    # Project README
```

## 🏗️ Source Code Structure (`src/`)

### App Directory (`src/app/`)
Following Next.js 14 App Router structure:

```
src/app/
├── layout.tsx                   # Root layout
├── globals.css                  # Global styles
├── favicon.ico                  # Favicon
├── (dashboard)/                 # Dashboard route group
│   ├── layout.tsx              # Dashboard layout
│   ├── (overview)/             # Overview pages
│   ├── analytics/              # Analytics pages
│   ├── forms/                  # Forms management
│   ├── templates/              # Template pages
│   └── _components/            # Dashboard components
├── api/                        # API routes
│   ├── callback/               # OAuth callbacks
│   ├── form/                   # Form-related APIs
│   ├── refresh/                # Token refresh
│   └── webhook/                # Webhook endpoint
├── builder/                    # Form builder pages
│   ├── page.tsx               # Builder main page
│   ├── loading.tsx            # Loading UI
│   └── _components/           # Builder components
├── form/                       # Form rendering
│   └── [formId]/              # Dynamic form pages
├── landing/                    # Landing page
├── sign-in/                    # Authentication pages
└── sign-up/                    # Registration pages
```

### Backend Directory (`src/backend/`)

```
src/backend/
├── actions/                    # Server actions
│   ├── activity.ts            # Activity tracking
│   ├── airtable.ts           # Airtable integration
│   ├── analytics.ts          # Analytics data
│   ├── form.ts               # Form operations
│   ├── formIntegration.ts    # Integration management
│   ├── formSubmission.ts     # Submission handling
│   ├── google.ts             # Google API operations
│   └── template.ts           # Template operations
├── db/
│   └── connection.ts          # Database connection
├── models/                    # Mongoose models
│   ├── activity.ts           # Activity model
│   ├── connectedAccount.ts   # OAuth accounts
│   ├── form.ts               # Form model
│   ├── formIntegration.ts    # Integration model
│   ├── formSubmission.ts     # Submission model
│   ├── template.ts           # Template model
│   └── templateCategory.ts   # Template categories
└── util.ts                   # Backend utilities
```

### Components Directory (`src/components/`)

```
src/components/
├── common/                    # Shared components
│   ├── EditableText.tsx      # Inline text editing
│   ├── FeatureReleaseBadge.tsx # Feature announcements
│   ├── FormConfigSection.tsx  # Form configuration wrapper
│   ├── FormField.tsx         # Form field wrapper
│   ├── MobileSectionDisplayer.tsx # Mobile navigation
│   └── TopHeader.tsx         # Application header
└── ui/                       # shadcn/ui components
    ├── accordion.tsx         # Collapsible content
    ├── badge.tsx            # Status badges
    ├── button.tsx           # Button variations
    ├── card.tsx             # Card layouts
    ├── checkbox.tsx         # Checkbox inputs
    ├── colorpicker.tsx      # Color selection
    ├── combobox.tsx         # Searchable select
    ├── dialog.tsx           # Modal dialogs
    ├── form.tsx             # Form components
    ├── input.tsx            # Text inputs
    ├── label.tsx            # Form labels
    ├── select.tsx           # Select dropdowns
    ├── textarea.tsx         # Multi-line inputs
    └── [other ui components] # Additional UI components
```

### Data Fetching (`src/data-fetching/`)

```
src/data-fetching/
├── client/                   # Client-side data fetching
│   ├── activity.ts          # Activity queries/mutations
│   ├── form.ts              # Form queries/mutations
│   ├── formIntegration.ts   # Integration queries
│   ├── formSubmission.ts    # Submission queries
│   └── template.ts          # Template queries
├── functions/                # Utility functions
│   ├── activity.ts          # Activity helpers
│   ├── airtable.ts          # Airtable functions
│   ├── form.ts              # Form helpers
│   ├── formSubmission.ts    # Submission helpers
│   ├── google.ts            # Google API functions
│   ├── template.ts          # Template helpers
│   └── formIntegration.ts   # Integration helpers
└── server/                  # Server-side data fetching
    ├── form.ts              # Server form operations
    └── template.ts          # Server template operations
```

### Hooks Directory (`src/hooks/`)

```
src/hooks/
├── useCopyInfo.tsx          # Copy to clipboard functionality
├── useDebounceEffect.tsx    # Debounced effect hook
├── useDynamicFontLoader.tsx # Dynamic font loading
├── useFeatureAnnouncer.tsx  # Feature announcement
├── useFieldConditionalLogicCheck.tsx # Conditional logic
├── useFieldUnregister.tsx   # Form field cleanup
├── useFormSectionDisplay.tsx # Section navigation
├── useFormSubmissionId.tsx  # Submission tracking
├── useMediaQuery.tsx        # Responsive hooks
└── usePopulateFieldValidation.tsx # Validation setup
```

### Types Directory (`src/types/`)

```
src/types/
├── common.ts               # Common type definitions
├── form-config.ts          # Form configuration types
├── integration.ts          # Integration types
└── template.ts             # Template types
```

### Utilities (`src/lib/`)

```
src/lib/
├── datetime.ts             # Date/time utilities
├── form.ts                 # Form helper functions
├── utils.ts                # General utilities
└── validation.ts           # Validation schemas
```

### State Management (`src/zustand/`)

```
src/zustand/
├── store.ts                # Main Zustand store
└── data.ts                 # Default data and themes
```

### Configuration (`src/config/`)

```
src/config/
└── clerk.ts                # Clerk authentication config
```

### Providers (`src/providers/`)

```
src/providers/
└── react-query.tsx         # React Query provider
```

## 🎨 Form Builder Component Structure

### Left Pane Components
```
builder/_components/left-pane/
├── Header.tsx              # Pane header
├── LeftPane.tsx           # Main container
├── BreadCrumbs.tsx        # Navigation breadcrumbs
├── form-info/             # Form information section
├── form-structure/        # Form field structure
├── form-customization/    # Theme and styling
└── form-integrations/     # External integrations
```

### Center Pane Components
```
builder/_components/center-pane/
├── CenterPane.tsx         # Main container
└── form/                  # Form preview components
    ├── FormContent.tsx    # Form content wrapper
    ├── FormHeader.tsx     # Form header display
    ├── FieldRenderer.tsx  # Field rendering logic
    ├── fields/           # Individual field components
    └── SortableFormFieldContainer.tsx # Drag-and-drop container
```

### Right Pane Components
```
builder/_components/right-pane/
├── RightPane.tsx          # Main container
├── field-list-menu/       # Available fields
└── field-config-menu/     # Field configuration
    ├── config-section/    # Field settings
    ├── validation-section/ # Validation rules
    ├── conditional-logic-section/ # Logic rules
    └── action-section/    # Field actions
```

## 📊 Form Rendering Structure

### Form Components
```
form/[formId]/_components/
├── Form.tsx               # Main form component
├── FormContent.tsx        # Form content wrapper
├── FormHeader.tsx         # Form header
├── FormBlobStorage.tsx    # File upload provider
└── fields/               # Form field renderers
    ├── FieldRenderer.tsx  # Field routing
    ├── Checkbox.tsx       # Checkbox component
    ├── Dropdown.tsx       # Dropdown component
    ├── Date.tsx           # Date picker
    ├── File.tsx           # File upload
    ├── Radio.tsx          # Radio buttons
    ├── Text.tsx           # Text input
    ├── Textarea.tsx       # Textarea input
    └── withSetDefaultValueInForm.tsx # Default value HOC
```

## 🏠 Dashboard Structure

### Overview Components
```
(dashboard)/(overview)/_components/
├── Overview.tsx           # Main overview
├── InfoCard.tsx          # Metric cards
├── TotalSubmissions.tsx   # Submission metrics
├── AverageCompletionRate.tsx # Completion stats
├── MostActiveForm.tsx     # Popular forms
├── RecentActivity.tsx     # Activity feed
├── SubmissionsOvertime.tsx # Time-series data
├── FormCompletionRate.tsx # Completion rates
├── SubmissionsOvertimeLineChart.tsx # Chart component
└── FormCompletionRateBarChart.tsx # Bar chart
```

### Forms Management
```
(dashboard)/forms/_components/
├── Forms.tsx             # Forms list
├── FormCard.tsx          # Individual form card
└── DeleteFormModal.tsx   # Deletion confirmation
```

### Templates
```
(dashboard)/templates/_components/
├── Templates.tsx         # Template gallery
└── TemplateCard.tsx     # Template preview
```

## 🔄 Data Flow Architecture

### State Flow
```
User Action → Component → Hook → Store → API → Database
                    ↓
            Component Re-render ← Store Update ← API Response
```

### Form Builder Flow
```
Drag Field → Add to Store → Update UI → Configure Field → Save to DB
```

### Form Submission Flow
```
Fill Form → Validate → Submit → Process → Store → Integrate → Notify
```

This project structure follows Next.js 14 best practices with clear separation of concerns, making the codebase maintainable and scalable.
