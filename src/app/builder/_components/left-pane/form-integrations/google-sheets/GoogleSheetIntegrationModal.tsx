'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Loader2, Plus } from 'lucide-react';
import {
  useConnectedGoogleAccount,
  useDisconnectGoogleAccount,
  useFormGoogleSheetIntegration,
  useGoogleAuthUrl,
  useSpreadsheetsFromDrive,
  useWorksheetColumnHeaders,
  useWorksheetsFromSpreadSheet,
} from './hooks/useGoogleSheetIntegrationUtils';
import Image from 'next/image';
import { Combobox, Option } from '@/components/ui/combobox';
import { useEffect, useMemo, useState } from 'react';
import { useFormProperty } from '@/zustand/store';
import { GoogleSheetIntegration as GoogleSheetsFormIntegration } from '@/types/integration';
import { useSaveIntegrationMutation } from '@/data-fetching/client/formIntegration';
import { Skeleton } from '@/components/ui/skeleton';

interface GoogleSheetIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoogleSheetIntegrationModal = ({ open, onOpenChange }: GoogleSheetIntegrationModalProps) => {
  const [integration, setIntegration] = useState<GoogleSheetsFormIntegration>({} as GoogleSheetsFormIntegration);

  const formId = useFormProperty('id');
  const fieldEntities = useFormProperty('fieldEntities');

  const { data: authUrl, isLoading, isError } = useGoogleAuthUrl({ enabled: open });
  const { data: connectedAccount } = useConnectedGoogleAccount({ enabled: open });
  const { mutateAsync: disconnectAccount, isPending: isDisconnecting } = useDisconnectGoogleAccount();
  const { data: userSpreadsheets } = useSpreadsheetsFromDrive({ enabled: open && !!connectedAccount });
  const { data: worksheetColumnHeaders, isLoading: isWorksheetColumnHeadersLoading } = useWorksheetColumnHeaders({
    enabled:
      open &&
      !!connectedAccount &&
      !!integration?.config?.spreadsheet?.value &&
      !!integration?.config?.worksheet?.value,
    spreadsheetId: integration?.config?.spreadsheet?.value as string,
    worksheetName: integration?.config?.worksheet?.value as string,
  });

  const { data: worksheetsFromSpreadSheet } = useWorksheetsFromSpreadSheet({
    enabled: open && !!connectedAccount && !!integration?.config?.spreadsheet?.value,
    spreadsheetId: integration?.config?.spreadsheet?.value as string,
  });

  const { mutateAsync: saveFormIntegrationMutation, isPending: isSavingFormIntegration } = useSaveIntegrationMutation(
    {},
  );

  const isGoogleAccountConnected = !!connectedAccount?.accountEmail;

  const { data: existingGSIntegrationForForm, isLoading: isExistingIntegrationLoading } = useFormGoogleSheetIntegration(
    formId as string,
    open,
  );

  useEffect(() => {
    if (existingGSIntegrationForForm) {
      setIntegration(existingGSIntegrationForForm as GoogleSheetsFormIntegration);
    }
  }, [existingGSIntegrationForForm]);

  const spreadSheetMenuOptions = useMemo(() => {
    return connectedAccount?.accountEmail
      ? userSpreadsheets?.map((spreadsheet) => ({
          label: spreadsheet?.name,
          value: spreadsheet?.id,
        }))
      : [];
  }, [connectedAccount, userSpreadsheets]);

  const worksheetMenuOptions = useMemo(() => {
    return connectedAccount?.accountEmail
      ? worksheetsFromSpreadSheet?.map((worksheet) => ({
          label: worksheet?.properties?.title,
          value: `${worksheet?.properties?.title}`,
        }))
      : [];
  }, [connectedAccount?.accountEmail, worksheetsFromSpreadSheet]);

  const fieldsAsOptions = useMemo(
    () => Object.values(fieldEntities || {})?.map((v) => ({ label: v?.label, value: v?.name })),
    [fieldEntities],
  );

  const worksheetColumns = useMemo(() => {
    // [['column1', 'column2', 'column3']] -> this is the format worksheetColumnHeaders will be in.
    return worksheetColumnHeaders?.[0]?.map((column) => ({
      label: column,
      value: column,
    }));
  }, [worksheetColumnHeaders]);

  const handleGoogleAuth = () => {
    if (authUrl) {
      window.location.href = authUrl as string;
    }
  };

  const handleDisconnectAccount = () => {
    disconnectAccount();
    setIntegration({} as GoogleSheetsFormIntegration);
  };

  const handleSaveIntegration = () => {
    const worksheetColumnHeadersInOrder = worksheetColumns?.map((column) => column?.value) as string[];

    const updatedIntegration = {
      ...integration,
      provider: 'google' as const,
      formId: formId as string,
      userId: connectedAccount?.userId as string,
      connectedAccountId: connectedAccount?.accountId as string,
      config: {
        ...integration.config,
        worksheetColumnHeaders: worksheetColumnHeadersInOrder,
      },
    };

    setIntegration(updatedIntegration);

    saveFormIntegrationMutation(updatedIntegration, {
      onSuccess: (data) => {
        console.log('Integration saved successfully: --->>>', data);
        onOpenChange(false);
      },
      onError: (error) => {
        console.log('Error saving integration: --->>>', error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="leading-normal">Set up Google Sheet Integration</DialogTitle>
          <DialogDescription>
            Set up a Google Sheet integration to sync your form data with Google Sheets.
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-8  mt-3 max-w-full overflow-hidden">
          <div className="flex flex-col gap-2">
            <Label className="text-white">Google Account</Label>
            {isGoogleAccountConnected ? (
              <div className="flex items-center flex-wrap gap-2">
                <Image
                  src={connectedAccount?.accountPicture as string}
                  alt="google account image"
                  width={24}
                  height={24}
                  className="rounded-full w-4 h-4"
                />
                <span className="text-muted-foreground text-sm">{connectedAccount?.accountEmail}</span>
                <Button variant="outline" size={'sm'} disabled={isDisconnecting} onClick={handleDisconnectAccount}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <>
                <Button variant="secondary" className="w-max" disabled={isLoading} onClick={handleGoogleAuth}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isLoading ? 'Loading...' : 'Add Google Account'}
                </Button>
                {isError && (
                  <p className="text-sm text-red-500">Failed to load authentication URL. Please try again.</p>
                )}
              </>
            )}
          </div>

          {isGoogleAccountConnected && !isExistingIntegrationLoading && (
            <div className="flex flex-col gap-2 max-w-full">
              <Label className="text-white">Choose the spreadsheet from your drive</Label>
              <Combobox
                triggerClassName="max-w-full"
                options={spreadSheetMenuOptions as Option[]}
                handleChange={(values) => {
                  setIntegration((prevIntegration) => ({
                    ...prevIntegration,
                    config: {
                      ...prevIntegration.config,
                      spreadsheet: values[0],
                      worksheet: null,
                      worksheetColumnHeaders: [],
                    },
                    fieldMappings: {},
                  }));
                }}
                selectedValues={[integration?.config?.spreadsheet as Option]}
              />
            </div>
          )}

          {isGoogleAccountConnected && !isExistingIntegrationLoading && (
            <div className="flex flex-col gap-2 max-w-full">
              <Label className="text-white">Choose the worksheet from the selected spreadsheet</Label>
              <Combobox
                triggerClassName="max-w-full"
                options={worksheetMenuOptions as Option[]}
                handleChange={(values) => {
                  setIntegration((prevIntegration: GoogleSheetsFormIntegration) => ({
                    ...prevIntegration,
                    config: {
                      ...prevIntegration.config,
                      worksheet: values[0],
                      worksheetColumnHeaders: [],
                    },
                    fieldMappings: {},
                  }));
                }}
                selectedValues={[integration?.config?.worksheet as Option]}
              />
            </div>
          )}

          {isGoogleAccountConnected && !isExistingIntegrationLoading && !!worksheetColumns?.length && (
            <div className="flex flex-col gap-4 max-w-full">
              <Label className="text-white font-semibold text-xl">Field Mapper</Label>

              {worksheetColumns?.map((column) => (
                <div className="flex flex-col gap-2 max-w-full" key={column.value}>
                  <Label className="text-muted-foreground">{column.label}</Label>
                  <Combobox
                    triggerClassName="max-w-full"
                    options={fieldsAsOptions} // 🔹 Form fields as options
                    handleChange={(values) => {
                      console.log(`Mapping: ${column.value} → ${values[0]?.value}`);
                      setIntegration((prevIntegration: GoogleSheetsFormIntegration) => ({
                        ...prevIntegration,
                        fieldMappings: {
                          ...prevIntegration.fieldMappings,
                          [column.value]: values[0]?.value, // Google Sheet column name: Form field name
                        },
                      }));
                    }}
                    selectedValues={[
                      fieldsAsOptions?.find(
                        (option) => option?.value === integration?.fieldMappings?.[column?.value],
                      ) as Option,
                    ]}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {isExistingIntegrationLoading && (
          <>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>

            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>

            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
          </>
        )}

        {isWorksheetColumnHeadersLoading && isGoogleAccountConnected && (
          <div className="flex flex-col gap-2 max-w-full mt-3">
            <Skeleton className="h-5 w-[100%] rounded-md mb-3" />

            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-[100%] rounded-md" />
              <Skeleton className="h-6 w-[100%] rounded-md" />
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button
            disabled={!isGoogleAccountConnected || isSavingFormIntegration || isExistingIntegrationLoading}
            onClick={handleSaveIntegration}
            variant={'default'}
          >
            Save Integration {isSavingFormIntegration && <Loader2 className="w-4 h-4 animate-spin" />}
          </Button>

          <DialogClose asChild>
            <Button variant="destructive" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleSheetIntegrationModal;
