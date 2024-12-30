'use client';

import { Input } from '@/components/ui/input';
import { useTemplatesQuery } from '@/data-fetching/client/template';
import React from 'react';
import TemplateCard from './TemplateCard';

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
  console.log('templates =======================================================>>>>>>', templates);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between gap-4 items-center">
          <Input
            className="md:w-[600px] h-11"
            placeholder="Start typing what you want and we will try to find a template for you..."
            type="search"
          />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 rounded-lg">
          {templates?.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Templates;
