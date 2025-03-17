import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

const TemplateShowcase: React.FC = () => {
  const templates = [
    {
      id: 1,
      title: 'Contact Form',
      description: 'A simple contact form for your website',
      category: 'Business',
      image: 'bg-gradient-to-br from-zinc-800 to-zinc-900',
    },
    {
      id: 2,
      title: 'Event Registration',
      description: 'Perfect for event signups and registrations',
      category: 'Event',
      image: 'bg-gradient-to-br from-zinc-800 to-zinc-900',
    },
    {
      id: 3,
      title: 'Job Application',
      description: 'Streamlined job application form',
      category: 'Employment',
      image: 'bg-gradient-to-br from-zinc-800 to-zinc-900',
    },
    {
      id: 4,
      title: 'Survey',
      description: 'Collect feedback and insights',
      category: 'Research',
      image: 'bg-gradient-to-br from-zinc-800 to-zinc-900',
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="group relative rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-zinc-900/20 hover:border-zinc-700"
          >
            <div
              className={`h-48 ${template.image} p-4 relative overflow-hidden transition-transform group-hover:scale-105 duration-500`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
              <div className="absolute bottom-4 left-4">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-zinc-800/80 text-zinc-300 rounded-md backdrop-blur-sm">
                  {template.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1 text-white group-hover:text-zinc-200">{template.title}</h3>
              <p className="text-zinc-400 text-sm mb-3 group-hover:text-zinc-300">{template.description}</p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-between bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              >
                Use template <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 text-center">
        <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-gray-200">
          View All Templates
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TemplateShowcase;
