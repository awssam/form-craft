import { CalendarIcon, CircleDot, File, FormInputIcon, Notebook, TextIcon, Mail, Phone, Link, Hash, Clock } from 'lucide-react';
import { CheckboxIcon } from '@radix-ui/react-icons';
import { SelectIcon } from '@radix-ui/react-select';

const sections = [
  {
    title: 'Basic Fields',
    description: (
      <p>
        Choose from the most common field types. <strong className="text-yellow-200">Click</strong> on a field to add it
        to the form.
      </p>
    ),
    icon: <FormInputIcon className="w-4 h-4" />,
    fields: [
      {
        name: 'Text Field',
        icon: <TextIcon className="w-4 h-4" />,
        description: 'A single-line input field for short text entries.',
        type: 'text',
      },
      {
        name: 'Email Field',
        icon: <Mail className="w-4 h-4" />,
        description: 'A field for entering an email address.',
        type: 'email',
      },
      {
        name: 'Phone Field',
        icon: <Phone className="w-4 h-4" />,
        description: 'A field for entering a phone number.',
        type: 'phone',
      },
      {
        name: 'URL Field',
        icon: <Link className="w-4 h-4" />,
        description: 'A field for entering a website URL.',
        type: 'url',
      },
      {
        name: 'Number Field',
        icon: <Hash className="w-4 h-4" />,
        description: 'A field for entering numeric values.',
        type: 'number',
      },
      {
        name: 'Multi-Line Text Field',
        icon: <Notebook className="w-4 h-4" />,
        description: 'A text area for longer text entries or comments.',
        type: 'textarea',
      },
      {
        name: 'Date Picker',
        icon: <CalendarIcon className="w-4 h-4" />,
        description: 'A field for selecting a date from a calendar.',
        type: 'date',
      },
      {
        name: 'Date & Time Picker',
        icon: <Clock className="w-4 h-4" />,
        description: 'A field for selecting a date and time.',
        type: 'datetime',
      },
      {
        name: 'File Upload',
        icon: <File className="w-4 h-4" />,
        description: 'A field for uploading files.',
        type: 'file',
        featureTag: 'fileUpload',
      },
      {
        name: 'Dropdown',
        icon: <SelectIcon className="w-4 h-4" />,
        description: 'A field that allows users to select one or more options from a set of options.',
        type: 'dropdown',
      },
      {
        name: 'Radio Button',
        icon: <CircleDot className="w-4 h-4" />,
        description: 'A field that allows users to select one option from a set of options.',
        type: 'radio',
      },
      {
        name: 'Checkbox',
        icon: <CheckboxIcon className="w-4 h-4" />,
        description: 'A field that allows users to select one or more options from a set of options.',
        type: 'checkbox',
      },
    ],
  },
];

export type Section = (typeof sections)[0];

export type SectionField = Section['fields'][0];

export default sections;
