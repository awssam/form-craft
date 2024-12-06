import { CheckboxIcon } from '@radix-ui/react-icons';
import { CalendarIcon, CircleDot, FormInputIcon, Notebook, TextIcon } from 'lucide-react';

const sections = [
  {
    title: 'Basic Fields',
    description: 'Choose from a variety of basic field types to collect user information efficiently.',
    icon: <FormInputIcon className="w-4 h-4 text-white/90" />,
    fields: [
      {
        name: 'Text Field',
        icon: <TextIcon className="w-4 h-4 text-white/90" />,
        description: 'A single-line input field for short text entries.',
      },
      {
        name: 'Multi-Line Text Field',
        icon: <Notebook className="w-4 h-4 text-white/90" />,
        description: 'A text area for longer text entries or comments.',
      },
      {
        name: 'Date Picker',
        icon: <CalendarIcon className="w-4 h-4 text-white/90" />,
        description: 'A field for selecting a date from a calendar.',
      },
      {
        name: 'Radio Buttons',
        icon: <CircleDot className="w-4 h-4 text-white/90" />,
        description: 'A field that allows users to select one option from a set of options..',
      },
      {
        name: 'Checkbox',
        icon: <CheckboxIcon className="w-4 h-4 text-white/90" />,
        description: 'A field that allows users to select one or more options from a set of options.',
      },
    ],
  },
];

export default sections;
