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
  const user = useAuth();
  return useQuery({
    queryKey: ['googleAuthUrl', { userId: user?.userId }],
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
    retry: false,
    enabled,
  });
};

export const useFormGoogleSheetIntegration = (formId: string, enabled: boolean) => {
  return useFormIntegrations(formId, { provider: 'google' }, (d) => d?.[0], enabled);
};
