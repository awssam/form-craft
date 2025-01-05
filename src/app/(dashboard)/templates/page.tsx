import React from 'react';
import Templates from '@/components/pages/dashboard/templates/Templates';
import { getAllTemplatesAction } from '@/backend/actions/template';

const TemplatesPage = async () => {
  const templates = await getAllTemplatesAction()
    .then((res) => res?.data)
    .catch(() => []);

  return <Templates templates={templates} />;
};
export default TemplatesPage;
