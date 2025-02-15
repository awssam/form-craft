import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  disconnectGoogleAccount,
  getAllColumnHeadersFromWorksheet,
  getAllUserSpreadSheetsFromDrive,
  getAllWorksheetsFromSpreadSheet,
  getAuthorizationUrl,
  getConnectedGoogleAccount,
} from '@/data-fetching/functions/google';
import { useAuth } from '@clerk/nextjs';
import { useFormIntegrations } from '@/data-fetching/client/formIntegration';

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

export const useSpreadsheetsFromDrive = ({ enabled }: { enabled: boolean }) => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['spreadsheetsFromDrive', { userId }],
    queryFn: () => getAllUserSpreadSheetsFromDrive(),
    staleTime: 60 * 1000,
    retry: false,
    enabled,
  });
};

export const useWorksheetsFromSpreadSheet = ({
  enabled,
  spreadsheetId,
}: {
  enabled: boolean;
  spreadsheetId: string;
}) => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ['worksheetsFromSpreadSheet', { spreadsheetId, userId }],
    queryFn: () => getAllWorksheetsFromSpreadSheet(spreadsheetId),
    staleTime: 60 * 1000,
    retry: false,
    enabled,
  });
};

export const useWorksheetColumnHeaders = ({
  enabled,
  spreadsheetId,
  worksheetName,
}: {
  enabled: boolean;
  spreadsheetId: string;
  worksheetName: string;
}) => {
  const { userId } = useAuth();
  return useQuery({
    queryKey: ['worksheetColumnHeaders', { userId, spreadsheetId, worksheetName }],
    queryFn: () => getAllColumnHeadersFromWorksheet(spreadsheetId, worksheetName),
    staleTime: 60 * 1000,
    retry: false,
    enabled,
  });
};

export const useFormGoogleSheetIntegration = (formId: string, enabled: boolean) => {
  return useFormIntegrations(formId, { provider: 'google' }, (d) => d?.[0], enabled);
};
