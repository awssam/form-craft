import { getAllTemplatesAction } from '@/backend/actions/template';
import React from 'react';

const TemplatesPage = async () => {
  const res = await getAllTemplatesAction({ meta: true, templateConfig: false });

  const templates = await res?.data;

  return (
    <div className="w-full h-screen mt-12 ">
      <h1 className="text-lg font-semibold">Templates</h1>
      <p className="text-muted-foreground text-xs">
        Oh no! you found this page somehow…🥲 we are still working on this. Please come back later
      </p>
      {templates?.length > 0 &&
        templates?.map((template: any) => (
          <div key={template.id}>
            <p>{template?.meta.name}</p>
            <p>{template?.meta.description}</p>
          </div>
        ))}
    </div>
  );
};

export default TemplatesPage;
