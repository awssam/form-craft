import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  disconnectGoogleAccount,
  getAuthorizationUrl,
  getConnectedGoogleAccount,
} from '@/data-fetching/functions/google';

export const useGoogleAuthUrl = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['googleAuthUrl'],
    queryFn: getAuthorizationUrl,
    enabled,
    staleTime: 5 * 60 * 1000, // Consider URL valid for 5 minutes
    retry: false,
  });
};

export const useConnectedGoogleAccount = ({ enabled }: { enabled: boolean }) => {
  return useQuery({
    queryKey: ['connectedGoogleAccount'],
    queryFn: () => getConnectedGoogleAccount(),
    staleTime: 10 * 1000,
    retry: false,
    enabled,
  });
};

export const useDisconnectGoogleAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => disconnectGoogleAccount(),
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectedGoogleAccount'] });
    },
  });
};
