'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { FormTemplate } from '@/types/template';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: FormTemplate;
  onPreview?: (template: FormTemplate) => void;
}

const TemplateCard = ({ template, onPreview }: TemplateCardProps) => {
  const { meta } = template;

  // Generate a deterministic gradient background based on template id
  const getTemplateBackground = () => {
    const id = template.id || template._id || '';
    const num = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5;

    const gradients = [
      'from-zinc-800 to-zinc-900', // default
      'from-zinc-800 to-purple-950/20',
      'from-zinc-800 to-blue-950/20',
      'from-zinc-800 to-green-950/20',
      'from-zinc-800 to-amber-950/20',
    ];

    return gradients[num] || gradients[0];
  };

  return (
    <Card
      className={cn(
        'glass-card border-zinc-800/50 gradient-border hover-lift shadow-lg',
        'hover:border-zinc-700/50 transition-all duration-300 group',
        'overflow-hidden',
      )}
    >
      <div
        className={`h-48 bg-gradient-to-br ${getTemplateBackground()} p-4 relative overflow-hidden transition-transform group-hover:scale-105 duration-500`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80"></div>
        <div className="absolute bottom-4 left-4">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-zinc-800/80 text-zinc-300 rounded-md backdrop-blur-sm">
            {'Template'}
          </span>
        </div>
      </div>

      <CardHeader className="space-y-0.5">
        <CardTitle className="flex items-center justify-between w-full gap-4" onClick={() => onPreview?.(template)}>
          <h2 className="text-base md:text-lg max-w-[90%] gradient-text flex items-center group transition-all duration-300">
            {meta.name}
            <ArrowRight className="w-4 h-4 inline ml-2 group-hover:opacity-100 opacity-0" />
          </h2>
        </CardTitle>

        <CardDescription className="-mt-1 text-xs text-zinc-400">
          {meta.description?.slice(0, 100)}
          {meta.description && meta.description.length > 100 ? '...' : ''}
        </CardDescription>
      </CardHeader>

      {/* <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mt-2">
          {meta.tags?.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-1 text-xs bg-zinc-800/50 text-zinc-300 rounded-full border border-zinc-700/30"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent> */}

      <CardFooter className="flex justify-between items-center">
        <Button
          onClick={() => onPreview?.(template)}
          variant="ghost"
          size="sm"
          className="w-full justify-between bg-zinc-800/50 text-zinc-300 hover:bg-zinc-700 hover:text-white"
        >
          Use template <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
