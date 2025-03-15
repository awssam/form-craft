import React from 'react';
import Templates from '@/app/(dashboard)/templates/_components/Templates';
import { getAllTemplatesAction } from '@/backend/actions/template';

export const revalidate = 3600;

const TemplatesPage = async () => {
  const templates = await getAllTemplatesAction()
    .then((res) => res?.data)
    .catch(() => []);

  return <Templates templates={templates} />;
};
export default TemplatesPage;
