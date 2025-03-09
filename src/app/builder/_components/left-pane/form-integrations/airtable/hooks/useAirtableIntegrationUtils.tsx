import { useFormIntegrations } from '@/data-fetching/client/formIntegration';
import {
  disconnectAirtableAccount,
  getAirtableBases,
  getAirtableTables,
  getAuthorizationUrl,
  getConnectedAirtableAccount,
} from '@/data-fetching/functions/airtable';
import { useAuth } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAirtableAuthUrl = ({ enabled }: { enabled: boolean }) => {
  const user = useAuth();
  return useQuery({
    queryKey: ['airtableAuthUrl', { userId: user?.userId }],
    queryFn: getAuthorizationUrl,
    enabled,
    staleTime: 5 * 60 * 1000, // Consider URL valid for 5 minutes
    retry: false,
  });
};

export const useConnectedAirtableAccount = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['connectedAirtableAccount'],
    queryFn: () => getConnectedAirtableAccount(),
    staleTime: 10 * 1000,
    retry: false,
    enabled,
  });
};

export const useDisconnectAirtableAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => disconnectAirtableAccount(),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedAirtableAccount'] });
    },
  });
};

export const useAirtableBases = ({ enabled }: { enabled: boolean }) => {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['airtableBases', { userId }],
    queryFn: () => getAirtableBases(),
    staleTime: 10 * 1000,
    retry: false,
    enabled,
  });
};

export const useAirtableBaseTables = ({ enabled, baseId }: { enabled: boolean; baseId: string }) => {
  return useQuery({
    queryKey: ['airtableBaseTables', { baseId }],
    queryFn: () => getAirtableTables(baseId),
    staleTime: 10 * 1000,
    retry: false,
    enabled,
  });
};

export const useFormAirtableIntegration = (formId: string, enabled: boolean) => {
  return useFormIntegrations(formId, { provider: 'airtable' }, (d) => d?.[0], enabled);
};
