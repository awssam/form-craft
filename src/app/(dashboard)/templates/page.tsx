import React from 'react';
import Templates from '@/components/pages/dashboard/templates/Templates';
import { prefetchTemplatesServer } from '@/data-fetching/server/template';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const TemplatesPage = async () => {
  const queryClient = await prefetchTemplatesServer();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Templates />
    </HydrationBoundary>
  );
};
export default TemplatesPage;
