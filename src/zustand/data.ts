import { FormConfig } from "@/types/form-config";

export const formConfig: FormConfig = {
    id: "form_123", // Unique identifier for the form
    name: "Customer Feedback Form",
    description: "A form to collect feedback from our valued customers.",
    image: "https://example.com/form-image.png", // URL of an image to display in the form
    tags: ["feedback", "customer", "survey"],
    status:'draft',
    multiPage: true, // This form supports multiple pages
    pages: ["page1_id", "page2_id"], // Array of page IDs to maintain page order
    pageEntities: {
      "page1_id": {
        id: "page1_id",
        name: "Personal Information",
        fields: ["field1_id", "field2_id"], // Fields on this page
      },
      "page2_id": {
        id: "page2_id",
        name: "Feedback Section",
        fields: ["field3_id", "field4_id", "field5_id"], // Fields on this page
      },
    },
    fieldEntities: {
      "field1_id": {
        id: "field1_id",
        type: "text",
        label: "Full Name",
        placeholder: "Enter your full name",
        validation: {
          required: {
            value: true,
            message: "Full name is required.",
          },
          minLength: {
            value: 3,
            message: "Full name must be at least 3 characters long.",
          },
        },
      },
      "field2_id": {
        id: "field2_id",
        type: "date",
        label: "Date of Birth",
        placeholder: "Select your date of birth",
        validation: {
          required: {
            value: true,
            message: "Date of birth is required.",
          },
        },
      },
      "field3_id": {
        id: "field3_id",
        type: "radio",
        label: "Are you satisfied with our service?",
        options: [
          { label: "Yes", value: "yes", helperText: "You are satisfied" },
          { label: "No", value: "no", helperText: "You are not satisfied" },
        ],
        validation: {
          required: {
            value: true,
            message: "Please select an option.",
          },
        },
      },
      "field4_id": {
        id: "field4_id",
        type: "textarea",
        label: "Additional Comments",
        placeholder: "Write any additional feedback here...",
        validation: {
          maxLength: {
            value: 500,
            message: "Your comments should not exceed 500 characters.",
          },
        },
      },
      "field5_id": {
        id: "field5_id",
        type: "checkbox",
        label: "Would you recommend us to others?",
        options: [
          { label: "Yes", value: "yes", helperText: "You will recommend us" },
          { label: "No", value: "no", helperText: "You will not recommend us" },
        ],
        validation: {
          required: {
            value: true,
            message: "Please check at least one option.",
          },
        },
      },
    },
    settings: {
      submission: {
        emailNotifications: true, // Enable email notifications for form submissions
        redirectURL: "/thank-you", // Redirect to a thank-you page after submission
      },
      fileUploadLimit: "10MB", // Limit file uploads to 10MB
    },
    styles: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#0a0909", // black background color
      fontPrimaryColor: "#e0c7c7", // lighter  font color
      fontSecondaryColor: "#666666", // Lighter font color for secondary text
    },
  };
  