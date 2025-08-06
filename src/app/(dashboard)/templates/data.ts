// import { createNewTemplateAction } from "@/backend/actions/template";

// export const handleInsertTemplates = async () => {
//   for (let i = 0; i < templates?.length; i++) {
//     const template = templates[i];
//     const meta = templateMeta[i];

//     //@ts-expect-error templasafste is not typed
//     const res = await createNewTemplateAction(meta, template);

//     console.log('res', res);
//     console.log('=====================================');
//   }

// };

// const handleDeleteTemplates = async () => {
//   const res = await deleteAllTemplatesAction();
//   console.log('res', res);
// };

export const formThemes = {
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

// export const templates = [
//   {
//     id: 'form_125',
//     name: 'Client Onboarding Form',
//     createdBy: 'SYSTEM',
//     description: 'Gather essential details from new clients during onboarding.',
//     tags: ['client', 'onboarding', 'business'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Basic Information',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id'],
//       },
//       page2_id: {
//         id: 'page2_id',
//         name: 'Business Details',
//         fields: ['field5_id', 'field6_id', 'field7_id', 'field8_id'],
//       },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'client-name',
//         type: 'text',
//         label: 'Full Name',
//         placeholder: "Enter client's full name",
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: {
//               value: true,
//               message: 'Name is required.',
//               type: 'binary',
//             },
//             minLength: {
//               value: 3,
//               message: 'Name must be at least 3 characters long.',
//               type: 'withValue',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'client-email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: "Enter client's email",
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: {
//               value: true,
//               message: 'Email is required.',
//               type: 'binary',
//             },
//             isEmail: {
//               value: true,
//               message: 'Enter a valid email address.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'phone-number',
//         type: 'text',
//         label: 'Phone Number',
//         placeholder: 'Enter phone number',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: {
//               value: true,
//               message: 'Phone number is required.',
//               type: 'binary',
//             },
//             isValidPhoneNumber: {
//               value: true,
//               message: 'Enter a valid phone number.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'address',
//         type: 'textarea',
//         label: 'Address',
//         placeholder: "Enter client's address",
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: {
//               value: true,
//               message: 'Address is required.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '100%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'business-name',
//         type: 'text',
//         label: 'Business Name',
//         placeholder: 'Enter the business name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: {
//               value: true,
//               message: 'Business name is required.',
//               type: 'binary',
//             },
//             noSpecialCharacters: {
//               value: true,
//               message: 'Business name should not include special characters.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'industry',
//         type: 'dropdown',
//         label: 'Industry',
//         options: [
//           { label: 'Technology', value: 'technology', helperText: '' },
//           { label: 'Finance', value: 'finance', helperText: '' },
//           { label: 'Healthcare', value: 'healthcare', helperText: '' },
//           { label: 'Retail', value: 'retail', helperText: '' },
//         ],
//         validation: {
//           custom: {
//             required: {
//               value: true,
//               message: 'Please select an industry.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field7_id: {
//         id: 'field7_id',
//         name: 'number-of-employees',
//         type: 'text',
//         label: 'Number of Employees',
//         placeholder: 'Enter number of employees',
//         defaultValue: '',
//         validation: {
//           custom: {
//             isNumeric: {
//               value: true,
//               message: 'Only numeric values are allowed.',
//               type: 'binary',
//             },
//             required: {
//               value: true,
//               message: 'Number of employees is required.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field8_id: {
//         id: 'field8_id',
//         name: 'additional-info',
//         type: 'textarea',
//         label: 'Additional Information',
//         placeholder: 'Enter any additional details',
//         defaultValue: '',
//         validation: {
//           custom: {},
//         },
//         width: '100%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f5f5f5',
//       fontPrimaryColor: '#000000',
//       fontSecondaryColor: '#666666',
//     },
//     theme: {
//       type: 'deep-violet',
//       id: 'deep-violet',
//       properties: formThemes['deep-violet'],
//     },
//   },

//   {
//     id: 'form_126',
//     name: 'Customer Feedback Form',
//     createdBy: 'SYSTEM',
//     description: 'Gather detailed feedback from customers about their experience with your product or service.',
//     tags: ['feedback', 'customer', 'business'],
//     status: 'draft',
//     multiPage: false,
//     pages: ['page1_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Customer Feedback',
//         fields: [
//           'field1_id',
//           'field2_id',
//           'field3_id',
//           'field4_id',
//           'field5_id',
//           'field6_id',
//           'field7_id',
//           'field8_id',
//         ],
//       },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'customer-name',
//         type: 'text',
//         label: 'Customer Name',
//         placeholder: 'Enter your name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Customer name is required.', type: 'binary' },
//             minLength: { value: 3, message: 'Name must be at least 3 characters long.', type: 'withValue' },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email address',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email is required.', type: 'binary' },
//             isEmail: { value: true, message: 'Enter a valid email address.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'product-used',
//         type: 'dropdown',
//         label: 'Product/Service Used',
//         options: [
//           { label: 'Product A', value: 'product_a' },
//           { label: 'Product B', value: 'product_b' },
//           { label: 'Service X', value: 'service_x' },
//           { label: 'Service Y', value: 'service_y' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please select a product/service.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'rating',
//         type: 'radio',
//         label: 'Overall Experience',
//         options: [
//           { label: 'Excellent', value: 'excellent' },
//           { label: 'Good', value: 'good' },
//           { label: 'Average', value: 'average' },
//           { label: 'Poor', value: 'poor' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please rate your experience.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'recommend',
//         type: 'checkbox',
//         label: 'Would you recommend us?',
//         options: [
//           { label: 'Yes', value: 'yes' },
//           { label: 'No', value: 'no' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please select an option.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'comments',
//         type: 'textarea',
//         label: 'Additional Comments',
//         placeholder: 'Share your thoughts or suggestions',
//         defaultValue: '',
//         validation: {
//           custom: {
//             maxLength: { value: 500, message: 'Comments must be under 500 characters.', type: 'withValue' },
//           },
//         },
//         width: '100%',
//       },
//       field7_id: {
//         id: 'field7_id',
//         name: 'contact-permission',
//         type: 'checkbox',
//         label: 'May we contact you for follow-up?',
//         options: [
//           { label: 'Yes', value: 'yes' },
//           { label: 'No', value: 'no' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please select an option.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//       field8_id: {
//         id: 'field8_id',
//         name: 'improvement-suggestions',
//         type: 'textarea',
//         label: 'Suggestions for Improvement',
//         placeholder: 'Share how we can improve',
//         defaultValue: '',
//         validation: {
//           custom: {
//             maxLength: { value: 300, message: 'Suggestions must be under 300 characters.', type: 'withValue' },
//           },
//         },
//         width: '100%',
//       },
//     },
//     settings: {
//       submission: {
//         emailNotifications: true,
//         redirectURL: '/thank-you-feedback',
//       },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#ffffff',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#666666',
//     },
//     theme: { type: 'deep-space', id: 'deep-space', properties: formThemes['deep-space'] },
//   },

//   {
//     id: 'form_126',
//     name: 'Event Registration Form',
//     createdBy: 'SYSTEM',
//     description: 'Capture participant details for events and conferences.',
//     tags: ['event', 'registration', 'conference'],
//     status: 'draft',
//     multiPage: false,
//     pages: ['page1_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Registration Details',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id', 'field5_id', 'field6_id', 'field7_id'],
//       },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'participant-name',
//         type: 'text',
//         label: 'Full Name',
//         placeholder: 'Enter your full name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Name is required.', type: 'binary' },
//             minLength: { value: 3, message: 'Name must be at least 3 characters.', type: 'withValue' },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email is required.', type: 'binary' },
//             isEmail: { value: true, message: 'Enter a valid email address.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'contact-number',
//         type: 'text',
//         label: 'Contact Number',
//         placeholder: 'Enter your contact number',
//         defaultValue: '',
//         validation: {
//           custom: {
//             isValidPhoneNumber: {
//               value: true,
//               message: 'Enter a valid phone number.',
//               type: 'binary',
//             },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'event-type',
//         type: 'dropdown',
//         label: 'Event Type',
//         options: [
//           { label: 'Conference', value: 'conference' },
//           { label: 'Workshop', value: 'workshop' },
//           { label: 'Seminar', value: 'seminar' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Select an event type.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'organization-name',
//         type: 'text',
//         label: 'Organization Name',
//         placeholder: 'Enter your organization name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             maxLength: {
//               value: 50,
//               message: 'Organization name cannot exceed 50 characters.',
//               type: 'withValue',
//             },
//           },
//         },
//         width: '100%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'attendance-mode',
//         type: 'radio',
//         label: 'Attendance Mode',
//         options: [
//           { label: 'In-Person', value: 'in-person' },
//           { label: 'Virtual', value: 'virtual' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Select an attendance mode.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field7_id: {
//         id: 'field7_id',
//         name: 'comments',
//         type: 'textarea',
//         label: 'Comments or Special Requests',
//         placeholder: 'Enter any additional comments',
//         defaultValue: '',
//         width: '100%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/thank-you' },
//       fileUploadLimit: '10MB',
//     },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f9f9f9',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#555555',
//     },
//     theme: { type: 'night-sky', id: 'night-sky', properties: formThemes['night-sky'] },
//   },

//   {
//     id: 'form_vendor_registration',
//     name: 'Vendor Registration Form',
//     createdBy: 'SYSTEM',
//     description:
//       'A comprehensive form designed for onboarding vendors, capturing details such as business type, contact information, and GST numbers.',
//     tags: ['vendor', 'registration', 'business'],
//     status: 'draft',
//     multiPage: false,
//     pages: ['page1_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Vendor Information',
//         fields: [
//           'field1_id',
//           'field2_id',
//           'field3_id',
//           'field4_id',
//           'field5_id',
//           'field6_id',
//           'field7_id',
//           'field8_id',
//         ],
//       },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'business-name',
//         type: 'text',
//         label: 'Business Name',
//         placeholder: 'Enter the business name',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Business name is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'contact-person',
//         type: 'text',
//         label: 'Contact Person Name',
//         placeholder: 'Enter the contact person\u2019s name',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Contact person\u2019s name is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'business-type',
//         type: 'dropdown',
//         label: 'Business Type',
//         options: [
//           { label: 'Retail', value: 'retail' },
//           { label: 'Wholesale', value: 'wholesale' },
//           { label: 'Manufacturing', value: 'manufacturing' },
//           { label: 'Service', value: 'service' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Business type is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter the email address',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email address is required.', type: 'binary' },
//             isEmail: { value: true, message: 'Enter a valid email address.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'phone-number',
//         type: 'text',
//         label: 'Phone Number',
//         placeholder: 'Enter the phone number',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Phone number is required.', type: 'binary' },
//             isValidPhoneNumber: { value: true, message: 'Enter a valid phone number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'gst-number',
//         type: 'text',
//         label: 'GST Number',
//         placeholder: 'Enter the GST number',
//         validation: {
//           custom: {
//             required: { value: true, message: 'GST number is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field7_id: {
//         id: 'field7_id',
//         name: 'address',
//         type: 'textarea',
//         label: 'Address',
//         placeholder: 'Enter the business address',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Address is required.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//       field8_id: {
//         id: 'field8_id',
//         name: 'services-offered',
//         type: 'textarea',
//         label: 'Services Offered',
//         placeholder: 'List the services offered',
//         width: '100%',
//       },
//     },
//     settings: { submission: { emailNotifications: true, redirectURL: '/thank-you' }, fileUploadLimit: '5MB' },
//     theme: { type: 'midnight-black', id: 'midnight-black', properties: formThemes['midnight-black'] },
//     styles: {},
//   },

//   {
//     id: 'form_001',
//     name: 'Employee Onboarding Form',
//     createdBy: 'SYSTEM',
//     description: 'Gather necessary information to onboard new employees.',
//     tags: ['employee', 'onboarding', 'HR'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id', 'page3_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Personal Information',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id'],
//       },
//       page2_id: { id: 'page2_id', name: 'Job Details', fields: ['field5_id', 'field6_id', 'field7_id'] },
//       page3_id: { id: 'page3_id', name: 'Emergency Contact', fields: ['field8_id', 'field9_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'full-name',
//         type: 'text',
//         label: 'Full Name',
//         placeholder: 'Enter your full name',
//         validation: { custom: { required: { value: true, message: 'Full name is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email address',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email is required.', type: 'binary' },
//             isEmail: { value: true, message: 'Enter a valid email.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'phone',
//         type: 'text',
//         label: 'Phone Number',
//         placeholder: 'Enter your phone number',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Phone number is required.', type: 'binary' },
//             isValidPhoneNumber: { value: true, message: 'Enter a valid phone number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'address',
//         type: 'textarea',
//         label: 'Home Address',
//         placeholder: 'Enter your home address',
//         validation: { custom: { required: { value: true, message: 'Address is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'position',
//         type: 'dropdown',
//         label: 'Position',
//         options: [
//           { label: 'Software Engineer', value: 'software-engineer' },
//           { label: 'Product Manager', value: 'product-manager' },
//           { label: 'Designer', value: 'designer' },
//         ],
//         validation: { custom: { required: { value: true, message: 'Position is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'start-date',
//         type: 'text',
//         label: 'Start Date',
//         placeholder: 'MM/DD/YYYY',
//         validation: { custom: { required: { value: true, message: 'Start date is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field7_id: {
//         id: 'field7_id',
//         name: 'salary',
//         type: 'text',
//         label: 'Salary Expectation',
//         placeholder: 'Enter your expected salary',
//         validation: { custom: { required: { value: true, message: 'Salary is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field8_id: {
//         id: 'field8_id',
//         name: 'emergency-contact-name',
//         type: 'text',
//         label: 'Emergency Contact Name',
//         placeholder: 'Enter emergency contact name',
//         validation: {
//           custom: { required: { value: true, message: 'Emergency contact name is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field9_id: {
//         id: 'field9_id',
//         name: 'emergency-contact-phone',
//         type: 'text',
//         label: 'Emergency Contact Phone',
//         placeholder: 'Enter emergency contact phone',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Emergency contact phone is required.', type: 'binary' },
//             isValidPhoneNumber: { value: true, message: 'Enter a valid phone number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/onboarding-thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f0f0f0',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#777777',
//     },
//     theme: { type: 'midnight-black', id: 'midnight-black', properties: formThemes['midnight-black'] },
//   },

//   {
//     id: 'form_002',
//     name: 'Purchase Order Form',
//     createdBy: 'SYSTEM',
//     description: 'Capture details for product purchase orders.',
//     tags: ['purchase', 'order', 'business'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Order Information',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id', 'field5_id'],
//       },
//       page2_id: { id: 'page2_id', name: 'Shipping Information', fields: ['field6_id', 'field7_id', 'field8_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'order-id',
//         type: 'text',
//         label: 'Order ID',
//         placeholder: 'Enter order ID',
//         validation: { custom: { required: { value: true, message: 'Order ID is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'order-date',
//         type: 'text',
//         label: 'Order Date',
//         placeholder: 'MM/DD/YYYY',
//         validation: { custom: { required: { value: true, message: 'Order date is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'product-name',
//         type: 'text',
//         label: 'Product Name',
//         placeholder: 'Enter product name',
//         validation: { custom: { required: { value: true, message: 'Product name is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'quantity',
//         type: 'text',
//         label: 'Quantity',
//         placeholder: 'Enter quantity',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Quantity is required.', type: 'binary' },
//             isNumeric: { value: true, message: 'Enter a valid number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'price',
//         type: 'text',
//         label: 'Price per Unit',
//         placeholder: 'Enter unit price',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Price is required.', type: 'binary' },
//             isNumeric: { value: true, message: 'Enter a valid price.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'shipping-address',
//         type: 'textarea',
//         label: 'Shipping Address',
//         placeholder: 'Enter shipping address',
//         validation: { custom: { required: { value: true, message: 'Shipping address is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field7_id: {
//         id: 'field7_id',
//         name: 'shipping-method',
//         type: 'dropdown',
//         label: 'Shipping Method',
//         options: [
//           { label: 'Standard', value: 'standard' },
//           { label: 'Expedited', value: 'expedited' },
//           { label: 'Next Day', value: 'next-day' },
//         ],
//         validation: { custom: { required: { value: true, message: 'Shipping method is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field8_id: {
//         id: 'field8_id',
//         name: 'payment-method',
//         type: 'dropdown',
//         label: 'Payment Method',
//         options: [
//           { label: 'Credit Card', value: 'credit-card' },
//           { label: 'Bank Transfer', value: 'bank-transfer' },
//           { label: 'PayPal', value: 'paypal' },
//         ],
//         validation: { custom: { required: { value: true, message: 'Payment method is required.', type: 'binary' } } },
//         width: '50%',
//       },
//     },
//     settings: { submission: { emailNotifications: true, redirectURL: '/order-thank-you' }, fileUploadLimit: '5MB' },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f9f9f9',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#777777',
//     },
//     theme: { type: 'charcoal-black', id: 'charcoal-black', properties: formThemes['charcoal-black'] },
//   },

//   {
//     id: 'form_003',
//     name: 'Product Feedback Form',
//     createdBy: 'SYSTEM',
//     description: 'Collect feedback from customers about products.',
//     tags: ['feedback', 'product', 'survey'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Product Experience',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id'],
//       },
//       page2_id: { id: 'page2_id', name: 'Additional Comments', fields: ['field5_id', 'field6_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'product-name',
//         type: 'text',
//         label: 'Product Name',
//         placeholder: 'Enter the product name',
//         validation: { custom: { required: { value: true, message: 'Product name is required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'rating',
//         type: 'radio',
//         label: 'Rating',
//         options: [
//           { label: '1', value: '1' },
//           { label: '2', value: '2' },
//           { label: '3', value: '3' },
//           { label: '4', value: '4' },
//           { label: '5', value: '5' },
//         ],
//         validation: { custom: { required: { value: true, message: 'Please rate the product.', type: 'binary' } } },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'would-recommend',
//         type: 'radio',
//         label: 'Would you recommend this product?',
//         options: [
//           { label: 'Yes', value: 'yes' },
//           { label: 'No', value: 'no' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please answer if you would recommend this product.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'improvements',
//         type: 'textarea',
//         label: 'Suggestions for Improvement',
//         placeholder: 'Enter your suggestions',
//         validation: { custom: { required: { value: true, message: 'Suggestions are required.', type: 'binary' } } },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'additional-comments',
//         type: 'textarea',
//         label: 'Additional Comments',
//         placeholder: 'Enter additional comments',
//         validation: { custom: { required: { value: false, message: 'This is optional.', type: 'binary' } } },
//         width: '50%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'email',
//         type: 'text',
//         label: 'Your Email (Optional)',
//         placeholder: 'Enter your email address',
//         validation: { custom: { isEmail: { value: true, message: 'Enter a valid email address.', type: 'binary' } } },
//         width: '50%',
//       },
//     },
//     settings: { submission: { emailNotifications: true, redirectURL: '/feedback-thank-you' }, fileUploadLimit: '5MB' },
//     styles: {
//       fontFamily: 'Verdana, sans-serif',
//       backgroundColor: '#ffffff',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#777777',
//     },
//     theme: { type: 'deep-space', id: 'deep-space', properties: formThemes['deep-space'] },
//   },
//   {
//     id: 'form_125',
//     name: 'Employee Satisfaction Survey',
//     createdBy: 'SYSTEM',
//     description: 'Gather feedback from employees to measure job satisfaction.',
//     tags: ['employee', 'survey', 'feedback'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id', 'page3_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Satisfaction', fields: ['field1_id', 'field2_id', 'field3_id'] },
//       page2_id: { id: 'page2_id', name: 'Work Environment', fields: ['field4_id', 'field5_id'] },
//       page3_id: { id: 'page3_id', name: 'General Feedback', fields: ['field6_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'overall-satisfaction',
//         type: 'radio',
//         label: 'Overall Satisfaction',
//         options: [
//           { label: 'Very Satisfied', value: 'very-satisfied' },
//           { label: 'Satisfied', value: 'satisfied' },
//           { label: 'Neutral', value: 'neutral' },
//           { label: 'Dissatisfied', value: 'dissatisfied' },
//           { label: 'Very Dissatisfied', value: 'very-dissatisfied' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please select your satisfaction level.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'work-life-balance',
//         type: 'radio',
//         label: 'Work-Life Balance',
//         options: [
//           { label: 'Excellent', value: 'excellent' },
//           { label: 'Good', value: 'good' },
//           { label: 'Average', value: 'average' },
//           { label: 'Poor', value: 'poor' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please rate your work-life balance.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'recommend-to-friends',
//         type: 'checkbox',
//         label: 'Would you recommend this company to a friend?',
//         options: [
//           { label: 'Yes', value: 'yes' },
//           { label: 'No', value: 'no' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please select if you would recommend us.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'work-environment-feedback',
//         type: 'textarea',
//         label: 'Work Environment Feedback',
//         placeholder: 'Provide your thoughts on the work environment.',
//         validation: {
//           custom: { required: { value: true, message: 'Feedback is required.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'improvement-suggestions',
//         type: 'textarea',
//         label: 'Suggestions for Improvement',
//         placeholder: 'How can we improve?',
//         validation: {
//           custom: { required: { value: true, message: 'Suggestions are required.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//       field6_id: {
//         id: 'field6_id',
//         name: 'additional-comments',
//         type: 'textarea',
//         label: 'Additional Comments',
//         placeholder: 'Any other comments?',
//         width: '100%',
//       },
//     },
//     settings: { submission: { emailNotifications: true, redirectURL: '/thank-you' }, fileUploadLimit: '5MB' },
//     styles: {
//       fontFamily: 'Verdana, sans-serif',
//       backgroundColor: '#f4f4f4',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#777777',
//     },
//     theme: { type: 'midnight-black', id: 'midnight-black', properties: formThemes['midnight-black'] },
//   },
//   {
//     id: 'form_126',
//     name: 'Inventory Management Form',
//     createdBy: 'SYSTEM',
//     description: 'Track items in inventory and update stock levels.',
//     tags: ['inventory', 'management', 'stock'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Product Information', fields: ['field1_id', 'field2_id', 'field3_id'] },
//       page2_id: { id: 'page2_id', name: 'Stock Management', fields: ['field4_id', 'field5_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'product-name',
//         type: 'text',
//         label: 'Product Name',
//         placeholder: 'Enter product name',
//         validation: {
//           custom: { required: { value: true, message: 'Product name is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'product-code',
//         type: 'text',
//         label: 'Product Code',
//         placeholder: 'Enter product code',
//         validation: {
//           custom: { required: { value: true, message: 'Product code is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'category',
//         type: 'dropdown',
//         label: 'Category',
//         options: [
//           { label: 'Electronics', value: 'electronics' },
//           { label: 'Furniture', value: 'furniture' },
//           { label: 'Clothing', value: 'clothing' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please select a category.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'stock-quantity',
//         type: 'text',
//         label: 'Stock Quantity',
//         placeholder: 'Enter stock quantity',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Stock quantity is required.', type: 'binary' },
//             isNumeric: { value: true, message: 'Please enter a valid number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'restock-date',
//         type: 'date',
//         label: 'Restock Date',
//         validation: {
//           custom: { required: { value: true, message: 'Restock date is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/inventory-thank-you' },
//       fileUploadLimit: '10MB',
//     },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#ffffff',
//       fontPrimaryColor: '#000000',
//       fontSecondaryColor: '#555555',
//     },
//     theme: { type: 'deep-space', id: 'deep-space', properties: formThemes['deep-space'] },
//   },
//   {
//     id: 'form_127',
//     name: 'Customer Support Ticket Form',
//     createdBy: 'SYSTEM',
//     description: 'Allow customers to submit support tickets for assistance.',
//     tags: ['support', 'ticket', 'customer service'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Ticket Details', fields: ['field1_id', 'field2_id', 'field3_id'] },
//       page2_id: { id: 'page2_id', name: 'Issue Description', fields: ['field4_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'ticket-id',
//         type: 'text',
//         label: 'Ticket ID',
//         placeholder: 'Enter ticket ID',
//         validation: {
//           custom: { required: { value: true, message: 'Ticket ID is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'customer-name',
//         type: 'text',
//         label: 'Customer Name',
//         placeholder: 'Enter your full name',
//         validation: {
//           custom: { required: { value: true, message: 'Customer name is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'ticket-priority',
//         type: 'radio',
//         label: 'Ticket Priority',
//         options: [
//           { label: 'High', value: 'high' },
//           { label: 'Medium', value: 'medium' },
//           { label: 'Low', value: 'low' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please select priority.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'issue-description',
//         type: 'textarea',
//         label: 'Issue Description',
//         placeholder: 'Describe your issue',
//         validation: {
//           custom: { required: { value: true, message: 'Issue description is required.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//     },
//     settings: { submission: { emailNotifications: true, redirectURL: '/ticket-submitted' }, fileUploadLimit: '5MB' },
//     styles: {
//       fontFamily: 'Georgia, serif',
//       backgroundColor: '#f9f9f9',
//       fontPrimaryColor: '#333333',
//       fontSecondaryColor: '#666666',
//     },
//     theme: { type: 'charcoal-black', id: 'charcoal-black', properties: formThemes['charcoal-black'] },
//   },

//   {
//     id: 'form_131',
//     name: 'Subscription Plan Form',
//     createdBy: 'SYSTEM',
//     description: 'Allow users to choose and subscribe to different plans for your service.',
//     tags: ['subscription', 'plan', 'payment'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Personal Details', fields: ['field1_id', 'field2_id'] },
//       page2_id: { id: 'page2_id', name: 'Subscription Plan', fields: ['field3_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'full-name',
//         type: 'text',
//         label: 'Full Name',
//         placeholder: 'Enter your full name',
//         validation: {
//           custom: { required: { value: true, message: 'Name is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email address',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email is required.', type: 'binary' },
//             isEmail: { type: 'binary', value: true, message: 'Please enter a valid email address.' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'plan',
//         type: 'radio',
//         label: 'Subscription Plan',
//         options: [
//           { label: 'Basic', value: 'basic' },
//           { label: 'Premium', value: 'premium' },
//           { label: 'Enterprise', value: 'enterprise' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please select a subscription plan.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/subscription-confirmation' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Courier New, monospace',
//       backgroundColor: '#fff',
//       fontPrimaryColor: '#2c3e50',
//       fontSecondaryColor: '#8e44ad',
//     },
//     theme: { type: 'midnight-black', id: 'midnight-black', properties: formThemes['midnight-black'] },
//   },

//   {
//     id: 'form_132',
//     name: 'Course Enrollment Form',
//     createdBy: 'SYSTEM',
//     description: 'Allow students to enroll in various courses offered by an institution.',
//     tags: ['course', 'enrollment', 'education'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Student Information', fields: ['field1_id', 'field2_id'] },
//       page2_id: { id: 'page2_id', name: 'Course Selection', fields: ['field3_id', 'field4_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'student-name',
//         type: 'text',
//         label: 'Full Name',
//         placeholder: 'Enter your full name',
//         validation: {
//           custom: { required: { value: true, message: 'Name is required.', type: 'binary' } },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'student-email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email address',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email is required.', type: 'binary' },
//             isEmail: { type: 'binary', value: true, message: 'Please enter a valid email address.' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'course-selection',
//         type: 'dropdown',
//         label: 'Select Course',
//         options: [
//           { label: 'Math 101', value: 'math101' },
//           { label: 'History 202', value: 'history202' },
//           { label: 'Computer Science', value: 'cs101' },
//         ],
//         validation: {
//           custom: { required: { value: true, message: 'Please select a course.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'start-date',
//         type: 'date',
//         label: 'Preferred Start Date',
//         validation: {
//           custom: { required: { value: true, message: 'Start date is required.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/course-enrollment-thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Times New Roman, serif',
//       backgroundColor: '#fafafa',
//       fontPrimaryColor: '#2c3e50',
//       fontSecondaryColor: '#7f8c8d',
//     },
//     theme: { type: 'deep-space', id: 'deep-space', properties: formThemes['deep-space'] },
//   },

//   {
//     id: 'form_133',
//     name: 'Order Tracking Form',
//     createdBy: 'SYSTEM',
//     description: 'Allow customers to track the status of their orders.',
//     tags: ['order', 'tracking', 'customer service'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Order Details', fields: ['field1_id', 'field2_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'order-id',
//         type: 'text',
//         label: 'Order ID',
//         placeholder: 'Enter your order ID',
//         validation: {
//           custom: { required: { value: true, message: 'Order ID is required.', type: 'binary' } },
//         },
//         width: '100%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email address',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email address is required.', type: 'binary' },
//             isEmail: { value: true, message: 'Please enter a valid email address.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/order-tracking-thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Courier, monospace',
//       backgroundColor: '#fafafa',
//       fontPrimaryColor: '#34495e',
//       fontSecondaryColor: '#7f8c8d',
//     },
//     theme: { type: 'midnight-black', id: 'midnight-black', properties: formThemes['midnight-black'] },
//   },

//   {
//     id: 'form_127',
//     name: 'Appointment Scheduling Form',
//     createdBy: 'SYSTEM',
//     description: 'Form for users to schedule appointments with a service provider.',
//     tags: ['appointment', 'scheduling', 'service'],
//     status: 'draft',
//     multiPage: false,
//     pages: ['page1_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Appointment Details',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id'],
//       },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'name',
//         type: 'text',
//         label: 'Your Name',
//         placeholder: 'Enter your full name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Name is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'phone-number',
//         type: 'text',
//         label: 'Phone Number',
//         placeholder: 'Enter your phone number',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Phone number is required.', type: 'binary' },
//             isNumeric: { value: true, message: 'Please enter a valid phone number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'appointment-date',
//         type: 'text',
//         label: 'Preferred Appointment Date',
//         placeholder: 'Enter your preferred date',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Appointment date is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'service-type',
//         type: 'dropdown',
//         label: 'Select Service',
//         options: [
//           { label: 'Consultation', value: 'consultation', helperText: '' },
//           { label: 'Therapy', value: 'therapy', helperText: '' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please select a service.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/appointment-thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Tahoma, sans-serif',
//       backgroundColor: '#f8f8f8',
//       fontPrimaryColor: '#4a4a4a',
//       fontSecondaryColor: '#8e8e8e',
//     },
//     theme: { type: 'deep-violet', id: 'deep-violet', properties: formThemes['deep-violet'] },
//   },

//   {
//     id: 'form_126',
//     name: 'Travel Booking Form',
//     createdBy: 'SYSTEM',
//     description: 'Form for customers to book their travel and accommodation.',
//     tags: ['travel', 'booking', 'hotel'],
//     status: 'draft',
//     multiPage: true,
//     pages: ['page1_id', 'page2_id'],
//     pageEntities: {
//       page1_id: { id: 'page1_id', name: 'Traveler Details', fields: ['field1_id', 'field2_id', 'field3_id'] },
//       page2_id: { id: 'page2_id', name: 'Travel Details', fields: ['field4_id', 'field5_id'] },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'traveler-name',
//         type: 'text',
//         label: 'Full Name',
//         placeholder: 'Enter your full name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Full name is required.', type: 'binary' },
//             minLength: { value: 3, message: 'Name must be at least 3 characters long.', type: 'withValue' },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'email',
//         type: 'text',
//         label: 'Email Address',
//         placeholder: 'Enter your email address',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Email address is required.', type: 'binary' },
//             isEmail: { value: true, message: 'Please enter a valid email address.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'phone-number',
//         type: 'text',
//         label: 'Phone Number',
//         placeholder: 'Enter your phone number',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Phone number is required.', type: 'binary' },
//             isNumeric: { value: true, message: 'Please enter a valid phone number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'travel-date',
//         type: 'text',
//         label: 'Travel Date',
//         placeholder: 'Enter your travel date',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Travel date is required.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field5_id: {
//         id: 'field5_id',
//         name: 'destination',
//         type: 'dropdown',
//         label: 'Destination',
//         options: [
//           { label: 'Paris', value: 'paris', helperText: '' },
//           { label: 'London', value: 'london', helperText: '' },
//           { label: 'New York', value: 'new-york', helperText: '' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please select a destination.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/travel-booking-thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Verdana, sans-serif',
//       backgroundColor: '#e6e6e6',
//       fontPrimaryColor: '#4d4d4d',
//       fontSecondaryColor: '#999',
//     },
//     theme: { type: 'deep-space', id: 'deep-space', properties: formThemes['deep-space'] },
//   },
//   {
//     id: 'form_125',
//     name: 'Service Request Form',
//     createdBy: 'SYSTEM',
//     description: 'Form for customers to request services or maintenance.',
//     tags: ['service', 'request', 'maintenance'],
//     status: 'draft',
//     multiPage: false,
//     pages: ['page1_id'],
//     pageEntities: {
//       page1_id: {
//         id: 'page1_id',
//         name: 'Request Details',
//         fields: ['field1_id', 'field2_id', 'field3_id', 'field4_id'],
//       },
//     },
//     fieldEntities: {
//       field1_id: {
//         id: 'field1_id',
//         name: 'customer-name',
//         type: 'text',
//         label: 'Customer Name',
//         placeholder: 'Enter your full name',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Full name is required.', type: 'binary' },
//             minLength: { value: 3, message: 'Name must be at least 3 characters long.', type: 'withValue' },
//           },
//         },
//         width: '50%',
//       },
//       field2_id: {
//         id: 'field2_id',
//         name: 'service-type',
//         type: 'dropdown',
//         label: 'Type of Service',
//         options: [
//           { label: 'Plumbing', value: 'plumbing', helperText: '' },
//           { label: 'Electrical', value: 'electrical', helperText: '' },
//           { label: 'HVAC', value: 'hvac', helperText: '' },
//         ],
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please select a service type.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//       field3_id: {
//         id: 'field3_id',
//         name: 'service-description',
//         type: 'textarea',
//         label: 'Service Description',
//         placeholder: 'Describe the issue or request',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Please provide a description of the service.', type: 'binary' },
//           },
//         },
//         width: '100%',
//       },
//       field4_id: {
//         id: 'field4_id',
//         name: 'contact-number',
//         type: 'text',
//         label: 'Phone Number',
//         placeholder: 'Enter your phone number',
//         defaultValue: '',
//         validation: {
//           custom: {
//             required: { value: true, message: 'Phone number is required.', type: 'binary' },
//             isNumeric: { value: true, message: 'Please enter a valid phone number.', type: 'binary' },
//           },
//         },
//         width: '50%',
//       },
//     },
//     settings: {
//       submission: { emailNotifications: true, redirectURL: '/thank-you' },
//       fileUploadLimit: '5MB',
//     },
//     styles: {
//       fontFamily: 'Arial, sans-serif',
//       backgroundColor: '#f1f1f1',
//       fontPrimaryColor: '#333',
//       fontSecondaryColor: '#777',
//     },
//     theme: { type: 'midnight-black', id: 'midnight-black', properties: formThemes['midnight-black'] },
//   },
// ];

export const templateMeta = [
  {
    name: 'Client Onboarding Form',
    description:
      'This form is designed to collect essential information from clients during the onboarding process. It helps businesses efficiently gather data such as company details, contact information, and specific requirements. The form is targeted towards businesses in sectors like consulting, software, and services, helping streamline client engagement and project initiation.',
    image: 'https://www.example.com/client-onboarding-image.jpg',
  },
  {
    name: 'Customer Feedback Form',
    description:
      'This form is created to gather customer insights and feedback regarding products, services, or experiences. It helps businesses understand customer satisfaction, identify areas for improvement, and enhance customer relationships. Targeted to businesses of all sizes, this form is crucial for companies that value continuous improvement.',
    image: 'https://www.example.com/customer-feedback-image.jpg',
  },
  {
    name: 'Event Registration Form',
    description:
      'This form is used for registering attendees to events such as conferences, webinars, workshops, or seminars. It collects important attendee information like name, email, and payment details. This form is ideal for event organizers and companies hosting business or community events.',
    image: 'https://www.example.com/event-registration-image.jpg',
  },
  {
    name: 'Vendor Registration Form',
    description:
      "A form that allows businesses to register potential vendors or suppliers. It collects data about the vendor's company, products or services, pricing, and contact information. This template is best used by procurement departments and businesses looking to source goods or services from external vendors.",
    image: 'https://www.example.com/vendor-registration-image.jpg',
  },
  {
    name: 'Employee Onboarding Form',
    description:
      "This form helps organizations gather key information from new hires, including personal details, tax information, and job preferences. It's used by HR departments to streamline the hiring process and ensure that all necessary documentation is collected for new employees.",
    image: 'https://www.example.com/employee-onboarding-image.jpg',
  },
  {
    name: 'Purchase Order Form',
    description:
      'A form used by businesses to place orders for products or services from suppliers. It captures important details like product specifications, quantities, pricing, and delivery instructions. Ideal for purchasing and procurement teams.',
    image: 'https://www.example.com/purchase-order-image.jpg',
  },
  {
    name: 'Product Feedback Form',
    description:
      "This form collects feedback from customers about specific products. It helps businesses understand customer satisfaction, gather suggestions for improvements, and track product performance. It's suitable for product managers and quality assurance teams.",
    image: 'https://www.example.com/product-feedback-image.jpg',
  },
  {
    name: 'Employee Satisfaction Survey',
    description:
      'A survey aimed at understanding employee satisfaction levels. It gathers insights into workplace culture, management effectiveness, job satisfaction, and areas for improvement. This form is used by HR departments and managers to create a positive work environment.',
    image: 'https://www.example.com/employee-satisfaction-image.jpg',
  },
  {
    name: 'Inventory Management Form',
    description:
      'This form helps businesses track inventory levels, reorder supplies, and manage stock. It is used by warehouse and inventory managers to maintain accurate inventory records, reduce shortages, and streamline stock control.',
    image: 'https://www.example.com/inventory-management-image.jpg',
  },
  {
    name: 'Customer Support Ticket Form',
    description:
      'A form designed for customers to submit support tickets. It collects details about the issue, including descriptions and priority level. Ideal for customer service departments, this form helps track and resolve customer issues efficiently.',
    image: 'https://www.example.com/support-ticket-image.jpg',
  },
  {
    name: 'Subscription Plan Form',
    description:
      'This form is used to collect customer information for subscription-based services. It gathers data on subscription plans, billing details, and customer preferences. It is suitable for businesses offering subscription products, such as software as a service (SaaS), media services, or membership organizations.',
    image: 'https://www.example.com/subscription-plan-image.jpg',
  },
  {
    name: 'Course Enrollment Form',
    description:
      'This form allows students or participants to enroll in courses or educational programs. It captures information like name, contact details, and course preferences. This form is perfect for educational institutions, online learning platforms, and training providers.',
    image: 'https://www.example.com/course-enrollment-image.jpg',
  },
  {
    name: 'Order Tracking Form',
    description:
      'A form that lets customers track the status of their orders, including shipping details, tracking numbers, and delivery dates. It is used by businesses that provide order tracking services and is essential for e-commerce websites and logistics companies.',
    image: 'https://www.example.com/order-tracking-image.jpg',
  },
  {
    name: 'Appointment Scheduling Form',
    description:
      'This form is designed for booking appointments for services like consultations, healthcare, or meetings. It collects client details, preferred time slots, and the service requested. Perfect for businesses that rely on appointments, such as medical offices, salons, and professional consultants.',
    image: 'https://www.example.com/appointment-scheduling-image.jpg',
  },
  {
    name: 'Travel Booking Form',
    description:
      'A form used by customers to book travel services, such as flights, hotels, or packages. It collects information on travel dates, destinations, and preferences. Ideal for travel agencies, tour operators, and online booking platforms.',
    image: 'https://www.example.com/travel-booking-image.jpg',
  },
  {
    name: 'Service Request Form',
    description:
      "This form is used to request a service from a business, such as technical support, maintenance, or installation. It captures service details, urgency, and customer contact information. It's suitable for businesses offering services like repairs, IT support, and installations.",
    image: 'https://www.example.com/service-request-image.jpg',
  },
];
