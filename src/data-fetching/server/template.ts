import { QueryClient } from '@tanstack/react-query';
import { fetchAllTemplates } from '../functions/template';

export const prefetchTemplatesServer = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['form-templates'],
    queryFn: fetchAllTemplates,
    staleTime: 60 * 1000 * 60, // 1 hour -> as the templates doesn't change often
  });

  return queryClient;
};
