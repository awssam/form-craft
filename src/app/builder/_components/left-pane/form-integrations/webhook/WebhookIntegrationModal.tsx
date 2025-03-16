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
import { Input } from '@/components/ui/input';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useFormProperty } from '@/zustand/store';
import { WebhookIntegration } from '@/types/integration';
import { useSaveIntegrationMutation } from '@/data-fetching/client/formIntegration';
import { Combobox } from '@/components/ui/combobox';
import { useWebhookIntegration } from './hooks/useWebhookIntegration';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface WebhookIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WebhookIntegrationModal = ({ open, onOpenChange }: WebhookIntegrationModalProps) => {
  const formId = useFormProperty('id');
  const [integration, setIntegration] = useState<WebhookIntegration>({} as WebhookIntegration);
  const { data: webhookIntegration, isLoading } = useWebhookIntegration(formId as string, open);
  const { mutateAsync: saveFormIntegrationMutation, isPending: isSaving } = useSaveIntegrationMutation<
    WebhookIntegration['config']
  >({});
  const { user } = useUser();

  useEffect(() => {
    const webhook = webhookIntegration as WebhookIntegration;

    if (webhook) {
      setIntegration(() => {
        return {
          ...webhook,
          config: {
            ...webhook.config,
            headers: webhook?.config?.headers ?? [
              {
                key: 'Content-Type',
                value: 'application/json',
                editable: false,
              },
            ],
          },
        };
      });
    }
  }, [webhookIntegration]);

  const handleSaveIntegration = async () => {
    if (!integration?.config?.url) {
      return toast.error('Webhook URL is required');
    }

    const updatedIntegration: WebhookIntegration = {
      ...integration,
      provider: 'webhook',
      formId: formId as string,
      userId: user?.id as string,
      connectedAccountId: user?.id as string,
    };

    await saveFormIntegrationMutation(updatedIntegration, {
      onSuccess: () => onOpenChange(false),
      onError: (error) => console.error('Error saving integration:', error),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Webhook</DialogTitle>
          <DialogDescription>Send form submissions to external services.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <section className="flex flex-col gap-6 mt-3">
            <div className="flex flex-col gap-2">
              <Label>Webhook URL (required)</Label>
              <Input
                type="url"
                placeholder="https://example.com/webhook"
                value={integration?.config?.url || ''}
                onChange={(e) =>
                  setIntegration((prev) => ({
                    ...prev,
                    config: { ...prev.config, url: e.target.value },
                  }))
                }
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Label>HTTP Method</Label>
              <Combobox
                triggerClassName="max-w-full"
                options={[
                  { label: 'POST', value: 'POST' },
                  { label: 'PUT', value: 'PUT' },
                ]}
                handleChange={(values) =>
                  setIntegration((prev) => ({
                    ...prev,
                    config: { ...prev.config, httpMethod: (values[0]?.value as string) || 'POST' },
                  }))
                }
                selectedValues={[
                  {
                    label: integration?.config?.httpMethod || 'POST',
                    value: integration?.config?.httpMethod || 'POST',
                  },
                ]}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Custom Headers</Label>
              {integration?.config?.headers?.map((header, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Key"
                    disabled={!header.editable}
                    value={header.key}
                    onChange={(e) => {
                      if (!header.editable) return;
                      const newHeaders = [...integration.config.headers];
                      newHeaders[index].key = e.target.value;
                      setIntegration((prev) => ({ ...prev, config: { ...prev.config, headers: newHeaders } }));
                    }}
                  />
                  <Input
                    placeholder="Value"
                    value={header.value}
                    disabled={!header.editable}
                    onChange={(e) => {
                      if (!header.editable) return;
                      const newHeaders = [...integration.config.headers];
                      newHeaders[index].value = e.target.value;
                      setIntegration((prev) => ({ ...prev, config: { ...prev.config, headers: newHeaders } }));
                    }}
                  />
                  <Button
                    variant="destructive"
                    className="p-2"
                    size="icon"
                    disabled={!header.editable}
                    onClick={() => {
                      if (!header.editable) return;
                      const newHeaders = integration.config.headers.filter((_, i) => i !== index);
                      setIntegration((prev) => ({ ...prev, config: { ...prev.config, headers: newHeaders } }));
                    }}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setIntegration((prev) => ({
                    ...prev,
                    config: {
                      ...prev.config,
                      headers: [...(prev.config.headers || []), { key: '', value: '', editable: true }],
                    },
                  }))
                }
              >
                <Plus className="w-4 h-4 mr-2" /> Add Header
              </Button>
            </div>
          </section>
        )}

        <DialogFooter className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
          <Button disabled={isSaving} onClick={handleSaveIntegration}>
            Save Integration
          </Button>
          <DialogClose asChild>
            <Button variant="destructive">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookIntegrationModal;
