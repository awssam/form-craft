# Project Overview

## 🎯 What is FormCraft?

FormCraft is an AI-powered visual form builder that empowers users to create beautiful, responsive forms without writing code. It features an intuitive drag-and-drop interface, advanced conditional logic, seamless integrations, file uploads, and real-time analytics.

## 🎨 Key Features

### Core Functionality
- **AI Form Builder**: Create forms in seconds with AI-generated validations and logic
- **Visual Form Builder**: Drag-and-drop interface for form creation
- **Multi-Page Forms**: Create complex forms spanning multiple pages
- **Conditional Logic**: Show/hide fields based on user inputs
- **Field Validation**: Built-in and custom regex-based validations
- **File Upload**: Support for file uploads with size limits
- **Theme Customization**: 5 pre-defined themes with font customization

### Data Management
- **Form Submissions**: View submissions in tabular format
- **Analytics Dashboard**: Track views, submissions, completion rates
- **Data Export**: PDF and CSV export capabilities (coming soon)
- **Real-time Updates**: Live form analytics and submission tracking

### Integrations
- **Google Sheets**: Direct integration for form submissions
- **Airtable**: Seamless Airtable integration
- **Webhooks**: Custom webhook integrations
- **Email Notifications**: Configurable email alerts (coming soon)

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **Drag & Drop**: @dnd-kit
- **Authentication**: Clerk

### Backend Stack
- **API**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Clerk
- **File Storage**: Cloudinary
- **AI Integration**: Google Gemini
- **Email**: (Future implementation)

### Data Flow Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │────│  Next.js    │────│  Database   │
│  (React)    │    │  API Routes │    │ (MongoDB)   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ├── Zustand Store   ├── Clerk Auth      ├── Form Models
       ├── React Hook Form ├── AI Integration  ├── Submission Models
       ├── DnD Kit         ├── Integrations    ├── Activity Models
       └── Tailwind CSS    └── File Upload     └── Template Models
```

## 🎭 User Personas

### 1. Form Creators (Primary Users)
- Business owners needing customer feedback forms
- Event organizers creating registration forms
- HR professionals building onboarding forms
- Marketers creating lead generation forms

### 2. Form Respondents (End Users)
- Customers filling out contact forms
- Event attendees registering
- Job applicants submitting information
- Survey participants providing feedback

## 🔄 User Journey

### Form Creation Flow
1. **Authentication**: User signs in via Clerk
2. **Dashboard**: Access to forms, templates, analytics
3. **Form Builder**: Drag-and-drop form creation
4. **Configuration**: Field settings, validation, styling
5. **Integration**: Connect to external services
6. **Publishing**: Make form live and shareable

### Form Response Flow
1. **Form Access**: User visits form URL
2. **Form Filling**: Complete form fields with validation
3. **Submission**: Data sent to configured integrations
4. **Confirmation**: Success message displayed
5. **Analytics**: Response tracked in dashboard

## 📊 Data Models

### Core Entities
- **Form**: Contains structure, fields, pages, settings
- **Field**: Individual form inputs with validation
- **Page**: Groups of fields for multi-page forms
- **Submission**: User responses to forms
- **Activity**: Audit trail of form interactions
- **Template**: Pre-built form configurations

### Integration Entities
- **ConnectedAccount**: OAuth connections to third parties
- **FormIntegration**: Configuration for form-service connections
- **TemplateCategory**: Grouping for form templates

## 🎯 Design Principles

### User Experience
- **Simplicity**: Intuitive interface requiring no technical knowledge
- **Flexibility**: Powerful customization without complexity
- **Performance**: Fast loading and responsive design
- **Accessibility**: WCAG compliant form experiences

### Technical Principles
- **Type Safety**: Full TypeScript implementation
- **Component Reusability**: Modular component architecture
- **State Management**: Predictable state with Zustand
- **API Design**: RESTful API with clear error handling
- **Data Validation**: Client and server-side validation

## 🚀 Scalability Considerations

### Performance
- **Code Splitting**: Next.js automatic code splitting
- **Image Optimization**: Next.js Image component
- **Caching**: React Query for API caching
- **Bundle Optimization**: Tree shaking and minification

### Infrastructure
- **Database**: MongoDB for horizontal scaling
- **CDN**: Cloudinary for file delivery
- **Authentication**: Clerk for user management
- **Deployment**: Vercel for edge deployment

## 🎪 Future Roadmap

### Short Term
- Email notification system
- Advanced analytics features
- More field types (rating, signature)
- PDF/CSV export functionality

### Long Term
- White-label solutions
- Advanced AI features
- Mobile app
- Enterprise features
- Advanced integrations

This project overview provides the foundational understanding needed to work with FormCraft. For detailed technical implementation, see the specific documentation sections for each component area.
