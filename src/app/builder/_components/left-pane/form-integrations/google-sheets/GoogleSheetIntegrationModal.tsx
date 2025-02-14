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
import { Plus } from 'lucide-react';
import { useConnectedGoogleAccount, useDisconnectGoogleAccount, useGoogleAuthUrl } from './hooks/useGoogleAuth';
import Image from 'next/image';

interface GoogleSheetIntegrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GoogleSheetIntegrationModal = ({ open, onOpenChange }: GoogleSheetIntegrationModalProps) => {
  const { data: authUrl, isLoading, isError } = useGoogleAuthUrl({ enabled: open });
  const { data: connectedAccount } = useConnectedGoogleAccount({ enabled: open });
  const { mutateAsync: disconnectAccount, isPending: isDisconnecting } = useDisconnectGoogleAccount();

  const isGoogleAccountConnected = !!connectedAccount?.accountEmail;

  const handleGoogleAuth = () => {
    if (authUrl) {
      window.location.href = authUrl as string;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set up Google Sheet Integration</DialogTitle>
          <DialogDescription>
            Set up Google Sheet integration to sync your form data with Google Sheets.
          </DialogDescription>
        </DialogHeader>

        <section className="mt-3">
          <div className="flex flex-col gap-2">
            <Label className="text-white">Google Account</Label>
            {isGoogleAccountConnected ? (
              <div className="flex items-center gap-2">
                <Image
                  src={connectedAccount?.accountPicture as string}
                  alt="google account image"
                  width={24}
                  height={24}
                  className="rounded-full w-4 h-4"
                />
                <span className="text-muted-foreground text-sm">{connectedAccount?.accountEmail}</span>
                <Button variant="outline" size={'sm'} disabled={isDisconnecting} onClick={() => disconnectAccount()}>
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
        </section>

        <DialogFooter>
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
