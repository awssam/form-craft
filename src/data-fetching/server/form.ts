import { auth } from '@clerk/nextjs/server';
import { QueryClient } from '@tanstack/react-query';
import { fetchAllForms } from '../functions/form';

export const prefetchFormsServer = async () => {
  const queryClient = new QueryClient();

  const { userId } = auth();

  await queryClient.prefetchQuery({
    queryKey: ['all-forms', userId],
    queryFn: fetchAllForms,
    staleTime: 10 * 1000,
  });

  return queryClient;
};
