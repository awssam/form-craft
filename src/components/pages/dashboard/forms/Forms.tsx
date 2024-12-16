import { Input } from '@/components/ui/input';
import React from 'react';
import FormCard from './FormCard';

const forms = [
  {
    title: 'Customer Feedback Form',
    description: 'Collect feedback from customers about their experience.',
    status: 'published',
    submissions: 120,
    lastModified: new Date('2024-01-10'),
  },
  {
    title: 'Event Registration Form',
    description: 'Register participants for upcoming events.',
    status: 'draft',
    submissions: 45,
    lastModified: new Date('2024-01-05'),
  },
  {
    title: 'Product Inquiry Form',
    description: 'Gather inquiries about products from potential customers.',
    status: 'published',
    submissions: 200,
    lastModified: new Date('2024-01-15'),
  },
  {
    title: 'Survey Form',
    description: 'Conduct surveys to gather data and insights.',
    status: 'published',
    submissions: 80,
    lastModified: new Date('2024-01-12'),
  },
  {
    title: 'Newsletter Signup Form',
    description: 'Allow users to sign up for our newsletter.',
    status: 'draft',
    submissions: 30,
    lastModified: new Date('2024-01-03'),
  },
  {
    title: 'Service Request Form',
    description: 'Submit requests for services or support.',
    status: 'published',
    submissions: 150,
    lastModified: new Date('2024-01-08'),
  },
  {
    title: 'Contact Us Form',
    description: 'Provide a way for users to contact us directly.',
    status: 'published',
    submissions: 60,
    lastModified: new Date('2024-01-11'),
  },
  {
    title: 'Feedback Survey Form',
    description: 'Collect detailed feedback through surveys.',
    status: 'draft',
    submissions: 10,
    lastModified: new Date('2024-01-02'),
  },
  {
    title: 'Event Feedback Form',
    description: 'Gather feedback from participants after events.',
    status: 'published',
    submissions: 75,
    lastModified: new Date('2024-01-09'),
  },
  {
    title: 'Job Application Form',
    description: 'Collect applications for job openings.',
    status: 'published',
    submissions: 25,
    lastModified: new Date('2024-01-04'),
  },
];

const Forms = () => {
  return (
    <div className="flex flex-col gap-6 mt-6">
      <div className="flex justify-between gap-4 items-center">
        <Input className="md:w-[500px] h-11" placeholder="Quickly find your forms from here." type="search" />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 rounded-lg">
        {/* {All forms Here} */}

        {forms.map((form) => (
          <FormCard key={form.title} {...form} />
        ))}
      </div>
    </div>
  );
};

export default Forms;
