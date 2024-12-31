'use client';

import { Input } from '@/components/ui/input';
import { useTemplatesQuery } from '@/data-fetching/client/template';
import React from 'react';
import TemplateCard from './TemplateCard';
import { Combobox } from '@/components/ui/combobox';
import { FormTemplate } from '@/types/template';
import { useFormActionProperty } from '@/zustand/store';
import { FormConfig } from '@/types/form-config';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Info } from 'lucide-react';

// const handleInsertTemplates = async () => {
//   for (let i = 0; i < templates?.length; i++) {
//     const template = templates[i];
//     const meta = templateMeta[i];

//     const res = await createNewTemplateAction(meta, template);

//     console.log('res', res);
//     console.log('=====================================');
//   }
// };

// const handleDeleteTemplates = async () => {
//   const res = await deleteAllTemplatesAction();
//   console.log('res', res);
// };

const Templates = () => {
  const { data: templates } = useTemplatesQuery();
  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const handleTemplatePreview = (template: FormTemplate) => {
    setFormConfig(template?.templateConfig || ({} as FormConfig));
    router.push('/builder');
    setTimeout(() => {
      toast.info(
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          <div>
            <h4 className="font-bold text-sm">Previewing {template?.meta?.name}</h4>
            <p className="text-sm">
              Click on <span className="text-yellow-200 font-bold">Use template</span> button if you like it.
            </p>
            <p className="text-xs text-muted-foreground">
              You can also edit this as you want before you choose to use it.
            </p>
          </div>
        </div>,
        {
          duration: 3000,
          dismissible: true,
        },
      );
    }, 500);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-row-reverse justify-between gap-4">
          <Combobox
            options={[
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
              { label: 'Option 3', value: 'option-3' },
            ]}
            selectedValues={[]}
          />
          <Input
            className="md:w-[600px] h-11"
            placeholder="Start typing what you want and we will try to find a template for you..."
            type="search"
          />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 rounded-lg">
          {templates?.map((template) => (
            <TemplateCard key={template.id || template._id} template={template} onPreview={handleTemplatePreview} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Templates;
