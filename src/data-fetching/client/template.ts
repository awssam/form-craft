import { useQuery } from '@tanstack/react-query';
import { fetchAllTemplates } from '../functions/template';

export const useTemplatesQuery = () => {
  return useQuery({
    queryKey: ['form-templates'],
    queryFn: fetchAllTemplates,
    staleTime: 60 * 1000 * 60, // 1 hour -> as the templates doesn't change often
  });
};
