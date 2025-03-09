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
import { useEffect, useMemo, useState } from 'react';
import { AirtableIntegration } from '@/types/integration';
import { useSaveIntegrationMutation } from '@/data-fetching/client/formIntegration';
import {
  useAirtableAuthUrl,
  useAirtableBases,
  useAirtableBaseTables,
  useConnectedAirtableAccount,
  useDisconnectAirtableAccount,
  useFormAirtableIntegration,
} from './hooks/useAirtableIntegrationUtils';
import { Combobox, Option } from '@/components/ui/combobox';
import { useFormProperty } from '@/zustand/store';
import { Skeleton } from '@/components/ui/skeleton';

interface AirtableIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AirtableIntegrationModal = ({ open, onOpenChange }: AirtableIntegrationModalProps) => {
  const [integration, setIntegration] = useState<AirtableIntegration>({} as AirtableIntegration);

  const formId = useFormProperty('id');
  const fieldEntities = useFormProperty('fieldEntities');

  const { data: authUrl, isLoading, isError } = useAirtableAuthUrl({ enabled: open });
  const { data: existingGSIntegrationForForm, isLoading: isExistingIntegrationLoading } = useFormAirtableIntegration(
    formId as string,
    true,
  );

  const { data: connectedAccount } = useConnectedAirtableAccount({ enabled: open });
  const { mutateAsync: disconnectAccount, isPending: isDisconnecting } = useDisconnectAirtableAccount();

  const { data: bases } = useAirtableBases({ enabled: open && !!connectedAccount });

  const { data: tables, isLoading: isTablesLoading } = useAirtableBaseTables({
    enabled: open && !!connectedAccount && !!integration?.config?.base?.value,
    baseId: integration?.config?.base?.value as string,
  });

  const { mutateAsync: saveFormIntegrationMutation, isPending: isSavingFormIntegration } = useSaveIntegrationMutation(
    {},
  );

  const isAirtableAccountConnected = !!connectedAccount?.accountEmail;

  const baseOptions = useMemo(() => {
    return connectedAccount?.accountEmail
      ? bases?.map((base) => ({
          label: base?.name,
          value: base?.id,
        }))
      : [];
  }, [bases, connectedAccount?.accountEmail]);

  const tableOptions = useMemo(() => {
    return connectedAccount?.accountEmail && integration?.config?.base?.value
      ? tables?.map((table) => ({
          label: table?.name,
          value: table?.id,
        }))
      : [];
  }, [connectedAccount?.accountEmail, integration?.config?.base?.value, tables]);

  const tableFields = useMemo(() => {
    const selectedTableId = integration?.config?.table?.value as string;
    const selectedTable = tables?.find((table) => table?.id === selectedTableId);

    return selectedTable?.fields;
  }, [tables, integration?.config?.table?.value]);

  const fieldsAsOptions = useMemo(
    () => Object.values(fieldEntities || {})?.map((v) => ({ label: v?.label, value: v?.name })),
    [fieldEntities],
  );

  useEffect(() => {
    if (existingGSIntegrationForForm) {
      setIntegration(existingGSIntegrationForForm as AirtableIntegration);
    }
  }, [existingGSIntegrationForForm]);

  const handleAirtableAuth = () => {
    if (authUrl) {
      window.location.href = authUrl as string;
    }
  };

  const handleDisconnectAccount = () => {
    disconnectAccount();
    setIntegration({} as AirtableIntegration);
  };

  const handleSaveIntegration = () => {
    const updatedIntegration = {
      ...integration,
      provider: 'airtable' as const,
      formId: formId as string,
      userId: connectedAccount?.userId as string,
      connectedAccountId: connectedAccount?.accountId as string,
      config: {
        ...integration.config,
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
      <DialogContent className="max-w-[80vw] sm:max-w-3xl max-h-[80vh] overflow-auto">
        <DialogHeader className="sticky -top-[24px] bg-[#0c0a0a]">
          <DialogTitle>Set up Airtable Integration</DialogTitle>
          <DialogDescription>
            Set up an Airtable integration to sync your form data with your Airtable account.
          </DialogDescription>
        </DialogHeader>

        <section className="flex flex-col gap-8  mt-3 max-w-full overflow-hidden">
          <div className="flex flex-col gap-2">
            <Label className="text-white">Airtable Account</Label>
            {isAirtableAccountConnected ? (
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">{connectedAccount?.accountEmail}</span>
                <Button variant="outline" size={'sm'} disabled={isDisconnecting} onClick={handleDisconnectAccount}>
                  Disconnect
                </Button>
              </div>
            ) : (
              <>
                <Button variant="secondary" className="w-max" disabled={isLoading} onClick={handleAirtableAuth}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isLoading ? 'Loading...' : 'Connect Account'}
                </Button>
                {isError && (
                  <p className="text-sm text-red-500">Failed to load authentication URL. Please try again.</p>
                )}
              </>
            )}
          </div>

          {isAirtableAccountConnected && !isExistingIntegrationLoading && (
            <div className="flex flex-col gap-2 max-w-full">
              <Label className="text-white">Choose the base to sync</Label>
              <Combobox
                triggerClassName="max-w-full"
                options={baseOptions as Option[]}
                handleChange={(values) => {
                  setIntegration((prevIntegration) => ({
                    ...prevIntegration,
                    config: {
                      ...prevIntegration.config,
                      base: values[0],
                      table: null,
                    },
                    fieldMappings: {},
                  }));
                }}
                selectedValues={[integration?.config?.base as Option]}
              />
            </div>
          )}

          {isAirtableAccountConnected && !isExistingIntegrationLoading && (
            <div className="flex flex-col gap-2 max-w-full">
              <Label className="text-white">Choose the table from the selected base</Label>
              <Combobox
                triggerClassName="max-w-full"
                options={tableOptions as Option[]}
                handleChange={(values) => {
                  setIntegration((prevIntegration: AirtableIntegration) => ({
                    ...prevIntegration,
                    config: {
                      ...prevIntegration.config,
                      table: values[0],
                    },
                    fieldMappings: {},
                  }));
                }}
                selectedValues={[integration?.config?.table as Option]}
              />
            </div>
          )}

          {isAirtableAccountConnected && tableFields?.length && (
            <div className="flex flex-col gap-4 max-w-full">
              <Label className="text-white font-semibold text-xl">Field Mapper</Label>

              {tableFields?.map((column) => (
                <div className="flex flex-col gap-2 max-w-full" key={column.id}>
                  <Label className="text-muted-foreground">{column.name}</Label>
                  <Combobox
                    triggerClassName="max-w-full"
                    options={fieldsAsOptions} // 🔹 Form fields as options
                    handleChange={(values) => {
                      setIntegration((prevIntegration: AirtableIntegration) => ({
                        ...prevIntegration,
                        fieldMappings: {
                          ...prevIntegration.fieldMappings,
                          [column.name]: values[0]?.value as string, // Airtable Column ID: Form field name
                        },
                      }));
                    }}
                    selectedValues={[
                      fieldsAsOptions?.find(
                        (option) => option?.value === integration?.fieldMappings?.[column?.name as string],
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
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>

            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>

            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
          </>
        )}

        {isTablesLoading && (
          <div className="flex flex-col gap-2 max-w-full mt-3">
            <Skeleton className="h-5 w-96 rounded-md mb-3" />

            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
            <div className="flex flex-col gap-2 max-w-full">
              <Skeleton className="h-3 w-96 rounded-md" />
              <Skeleton className="h-6 w-96 rounded-md" />
            </div>
          </div>
        )}

        <DialogFooter className="sticky -bottom-[10px]">
          <Button
            disabled={!isAirtableAccountConnected || isSavingFormIntegration}
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

export default AirtableIntegrationModal;
