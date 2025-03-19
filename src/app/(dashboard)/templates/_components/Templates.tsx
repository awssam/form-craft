'use client';

import React from 'react';
import TemplateCard from './TemplateCard';
import { FormTemplate } from '@/types/template';
import { useFormActionProperty } from '@/zustand/store';
import { FormConfig } from '@/types/form-config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Info, Sparkles } from 'lucide-react';

const Templates = ({ templates }: { templates: FormTemplate[] | undefined }) => {
  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const renderTemplateToast = (template: FormTemplate | undefined) => (
    <div className="flex items-center gap-2">
      <Info className="w-5 h-5" />
      <div>
        <h4 className="font-bold text-sm">Previewing {template?.meta?.name}</h4>
        <p className="text-sm">
          Click on <span className="text-yellow-200 font-bold">Use template</span> button if you like it.
        </p>
        <p className="text-xs text-muted-foreground">You can also edit this as you want before you choose to use it.</p>
      </div>
    </div>
  );

  const handleTemplatePreview = (template: FormTemplate) => {
    setFormConfig(template?.templateConfig || ({} as FormConfig));
    router.push('/builder');
    setTimeout(() => {
      toast.info(renderTemplateToast(template), {
        duration: 3000,
        dismissible: true,
      });
    }, 500);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        {/* <header className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <Input
            className="md:w-[500px] h-11 bg-zinc-900/30 border-zinc-800/60 backdrop-blur-sm focus:border-zinc-700/70 transition-all"
            placeholder="Start typing what you want and we will try to find a template for you..."
            type="search"
          />
          <Combobox
            triggerStyle={{ width: 180 }}
            placeholder="Filter by category"
            options={[
              { label: 'All Templates', value: 'all' },
              { label: 'Business', value: 'business' },
              { label: 'Event', value: 'event' },
              { label: 'Survey', value: 'survey' },
            ]}
            selectedValues={[]}
            allowMultiple={false}
          />
        </header> */}

        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 rounded-lg">
          {templates?.map((template) => (
            <TemplateCard key={template.id || template._id} template={template} onPreview={handleTemplatePreview} />
          ))}

          {(!templates || templates.length === 0) && (
            <div className="col-span-full flex flex-col gap-2 mt-12 justify-center items-center text-zinc-400">
              <div className="inline-flex p-3 rounded-full bg-zinc-800/50 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-400/80" />
              </div>
              <h4 className="text-xl font-bold gradient-text">No templates found</h4>
              <p className="text-sm">Try searching with different keywords or browse all templates.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Templates;
