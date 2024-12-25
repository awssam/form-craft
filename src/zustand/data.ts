import { FormConfig, Theme, ThemeProperties } from '@/types/form-config';

export const formThemes: Record<Theme, ThemeProperties> = {
  'midnight-black': {
    formBackgroundColor: '#0B0B0B', // Deep black background
    primaryTextColor: '#EAEAEA', // Light gray text
    secondaryTextColor: '#B0B0B0', // Slightly darker gray for helper text
    inputPlaceholderColor: '#7F7F7F', // Gray placeholder text
    inputBorderColor: '#444444', // Dark border for inputs
    borderRadius: '8px', // Rounded corners
  },
  'deep-space': {
    formBackgroundColor: '#0D0D15', // Very dark navy
    primaryTextColor: '#FFFFFF', // Pure white text
    secondaryTextColor: '#B3B3B3', // Light gray for helper text
    inputPlaceholderColor: '#A1A1A1', // Light gray placeholder text
    inputBorderColor: '#2A2A2A', // Dark border
    borderRadius: '6px', // Slightly rounded corners
  },
  'charcoal-black': {
    formBackgroundColor: '#0C0C0C', // Dark charcoal background
    primaryTextColor: '#E0E0E0', // Light gray text
    secondaryTextColor: '#B3B3B3', // Soft gray for helper text
    inputPlaceholderColor: '#8C8C8C', // Medium gray placeholder text
    inputBorderColor: '#3C3C3C', // Dark border
    borderRadius: '5px', // Rounded corners
  },
  'deep-violet': {
    formBackgroundColor: '#0D0315', // Deep dark violet
    primaryTextColor: '#FFFFFF', // White text
    secondaryTextColor: '#D1C6D1', // Light lavender for helper text
    inputPlaceholderColor: '#A77BCA', // Light purple placeholder text
    inputBorderColor: '#4B2B7F', // Darker violet for inputs
    borderRadius: '7px', // Rounded corners
  },
  'night-sky': {
    formBackgroundColor: '#1A0D25', // Dark deep indigo
    primaryTextColor: '#F5F5F5', // Soft white text
    secondaryTextColor: '#A6B0B5', // Soft blue-gray for helper text
    inputPlaceholderColor: '#BDC3C7', // Light gray placeholder text
    inputBorderColor: '#4A607D', // Dark blue for inputs
    borderRadius: '8px', // Rounded corners
  },
};

export const formConfig: FormConfig = {
  id: 'form_123', // Unique identifier for the form
  name: 'Customer Feedback Form',
  createdBy: 'John Doe',
  description: 'A form to collect feedback from our valued customers.',
  image: 'https://example.com/form-image.png', // URL of an image to display in the form
  tags: ['feedback', 'customer', 'survey'],
  status: 'draft',
  multiPage: true, // This form supports multiple pages
  pages: ['page1_id', 'page2_id'], // Array of page IDs to maintain page order
  pageEntities: {
    page1_id: {
      id: 'page1_id',
      name: 'Personal Information',
      fields: ['field1_id', 'field2_id'], // Fields on this page
    },
    page2_id: {
      id: 'page2_id',
      name: 'Feedback Section',
      fields: ['field3_id', 'field4_id', 'field5_id', 'field6_id'], // Fields on this page
    },
  },
  fieldEntities: {
    field1_id: {
      id: 'field1_id',
      name: 'full-name',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      defaultValue: 'John Doe',
      validation: {
        custom: {
          minLength: {
            value: 3,
            message: 'Full name must be at least 3 characters long.',
            type: 'withValue',
          },
          required: {
            value: true,
            message: 'Full name is required.',
            type: 'binary',
          },
        },
      },
      width: '50%',
    },
    field2_id: {
      id: 'field2_id',
      name: 'date-of-birth',
      type: 'date',
      label: 'Date of Birth',
      placeholder: 'Select your date of birth',
      defaultValue: new Date('1990-01-01').toISOString(),
      validation: {
        custom: {
          required: {
            value: true,
            message: 'Date of birth is required.',
            type: 'binary',
          },
          // isBefore: {
          //   value: new Date('2000-01-01'),
          //   message: 'Should be before 2000-01-01.',
          //   type: 'withValue',
          // },
        },
      },
      width: '50%',
    },
    field3_id: {
      id: 'field3_id',
      name: 'satisfaction',
      type: 'radio',
      label: 'Are you satisfied with our service?',
      defaultValue: 'yes',
      options: [
        { label: 'Yes', value: 'yes', helperText: 'You are satisfied' },
        { label: 'No', value: 'no', helperText: 'You are not satisfied' },
      ],
      validation: {
        custom: {
          required: {
            value: true,
            message: 'Please select an option.',
            type: 'binary',
          },
        },
      },
      width: '50%',
    },
    field4_id: {
      id: 'field4_id',
      name: 'additional-comments',
      type: 'textarea',
      label: 'Additional Comments',
      placeholder: 'Write any additional feedback here...',
      defaultValue: 'Some comments',
      validation: {},
      width: '100%',
    },
    field5_id: {
      id: 'field5_id',
      name: 'recommendation',
      type: 'checkbox',
      label: 'Would you recommend us to others?',
      defaultValue: ['yes', 'no'],
      options: [
        { label: 'Yes', value: 'yes', helperText: 'You will recommend us' },
        { label: 'No', value: 'no', helperText: 'You will not recommend us' },
      ],
      validation: {
        custom: {
          required: {
            value: true,
            message: 'Please select an option.',
            type: 'binary',
          },
        },
      },
      width: '50%',
    },
    field6_id: {
      id: 'field6_id',
      name: 'gender',
      type: 'dropdown',
      label: 'Select your gender',
      defaultValue: [],
      options: [
        { label: 'Male', value: 'male', helperText: 'Gender is Male' },
        { label: 'Female', value: 'female', helperText: 'Gender is female' },
        {
          label: 'Prefer not to say',
          value: 'prefer-not-to-say',
          helperText: 'User does not want to reveal their gender',
        },
      ],
      validation: {
        custom: {
          required: {
            value: true,
            message: 'Please select an option.',
            type: 'binary',
          },
        },
      },
      width: '50%',
    },
  },
  settings: {
    submission: {
      emailNotifications: true, // Enable email notifications for form submissions
      redirectURL: '/thank-you', // Redirect to a thank-you page after submission
    },
    fileUploadLimit: '10MB', // Limit file uploads to 10MB
  },
  styles: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#0a0909', // black background color
    fontPrimaryColor: '#e0c7c7', // lighter  font color
    fontSecondaryColor: '#666666', // Lighter font color for secondary text
  },
  theme: {
    type: 'charcoal-black',
    id: 'charcoal-black',
    properties: formThemes['charcoal-black'],
  },
};
