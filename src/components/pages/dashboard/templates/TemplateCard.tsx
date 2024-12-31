'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React from 'react';
import { FormTemplate } from '@/types/template';
import Image from 'next/image';

import FormTemplatePlaceholderImage from '../../../../../public/images/form-template-placeholder.jpg';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface TemplateCardProps {
  template: FormTemplate;
  onPreview?: (template: FormTemplate) => void;
}

const TemplateCard = ({ template, onPreview }: TemplateCardProps) => {
  const { meta, id } = template;
  return (
    <Card
      className={cn(
        'w-full relative border-[#212326] border-dashed shadow-xl hover:border-yellow-200/30 transition-all transform-gpu hover:-translate-y-2',
        'cursor-pointer duration-300 group',
      )}
    >
      {/* Card Content */}

      <CardHeader className="space-y-0.5 px-4 py-2">
        {/* Image or Fallback */}
        <div className="relative w-full h-[200px] overflow-hidden my-2">
          <Image
            src={FormTemplatePlaceholderImage}
            alt={meta.name}
            className="rounded-md -hue-rotate-60 transition-all duration-300 group-hover:scale-105 w-full h-full object-cover"
          />
        </div>
        <CardTitle
          className="flex group/title items-center justify-between w-full gap-4"
          onClick={() => onPreview?.(template)}
        >
          <h2 className="md:text-lg text-base max-w-[90%] hover:text-yellow-200 flex items-center group transition-all duration-300">
            {meta.name}
          </h2>
          <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover/title:opacity-100 group-hover/title:text-yellow-200" />
        </CardTitle>

        <CardDescription className="text-xs">{meta.description?.slice(0, 150) + '...'}</CardDescription>
      </CardHeader>

      {/* Footer */}
      <CardFooter className="flex items-center flex-wrap w-full px-4 py-2 mt-auto mb-3 gap-3">
        <TemplateTag label="Subscription and Memberships" />

        <Button
          onClick={() => onPreview?.(template)}
          variant="secondary"
          size="sm"
          className="rounded-full bg-black border hover:border-yellow-200/30 absolute top-3 right-3 md:opacity-0 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:-translate-x-0 scale-0 md:group-hover:scale-100 hover:scale-110 transition-all duration-300"
        >
          <span>Preview</span>
          {/* <ArrowRight className="w-4 h-4 ml-2" /> */}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;

const TemplateTag = ({ label }: { label: string }) => {
  return (
    <div className={`flex items-center gap-1 py-1 px-3 rounded-full bg-gray-800 border border-input`}>
      <span className="text-white font-normal text-xs flex items-center gap-1">{label}</span>
    </div>
  );
};
