'use client';

import React from 'react';

import { Button } from '../ui/button';
import { useFormActionProperty, useFormConfigStore, useFormProperty } from '@/zustand/store';
import { useUser } from '@clerk/nextjs';
import { Check, Copy, Lock, Share } from 'lucide-react';
import { usePublishFormMutation } from '@/data-fetching/client/form';
import { generateId, getAppOriginUrl } from '@/lib/utils';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import LeftPaneBreadCrumbs from '@/app/builder/_components/left-pane/BreadCrumbs';
import useCopyInfo from '@/hooks/useCopyInfo';
import CustomTooltip from '../ui/custom-tooltip';
import { useCreateActivityMutation } from '@/data-fetching/client/activity';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/builder', label: 'Builder' },
];

const TopHeader = () => {
  const { user } = useUser();
  const setFormConfig = useFormActionProperty('setFormConfig');

  const formLink = `${getAppOriginUrl()}/form/${useFormProperty('id')}`;
  const { handleCopy, hasCopied } = useCopyInfo();

  const [isPublishedFormModalOpen, setIsPublishedFormModalOpen] = React.useState(false);

  const formConfig = useFormConfigStore((state) => state.formConfig);
  const createdBy = formConfig?.createdBy;
  const formId = formConfig?.id;

  const isTemplate = createdBy === 'SYSTEM';

  const { mutateAsync, isPending } = usePublishFormMutation();

  const { mutateAsync: createActivity } = useCreateActivityMutation({});
  const handleUseTemplate = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...rest } = formConfig;

    setFormConfig({
      ...rest,
      id: generateId(),
      createdBy: user?.id || 'SYSTEM',
      status: 'draft',
    });
  };

  const handleFormPublishUnPublish = async (id: string) => {
    createActivity({
      formId: id,
      formName: formConfig?.name,
      type: formConfig?.status === 'published' ? 'unpublished' : 'published',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (formConfig?.status === 'published') {
      setFormConfig({
        ...formConfig,
        status: 'draft',
      });

      toast.success('Form marked as draft!', {
        description: "You can publish it again when you're ready.",
      });

      return;
    }

    await mutateAsync(
      { id },
      {
        onSettled(data, error) {
          if (error) {
            toast.error('Something went wrong, please try again.');
          }
          if (data) {
            setIsPublishedFormModalOpen(true);
            setFormConfig({
              ...formConfig,
              status: data?.status,
            });
          }
        },
      },
    );
  };

  return (
    <>
      <header className="w-full z-[9999999] px-4 pt-4 mb-2 center-pane bg-[#0c0a0a]">
        <div className="flex justify-between items-center gap-2">
          <LeftPaneBreadCrumbs links={links} />
          {isTemplate ? (
            <Button size="sm" variant="default" onClick={handleUseTemplate}>
              Use template
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {formConfig?.status === 'published' && (
                <CustomTooltip tooltip={'Copy form link'}>
                  <Button size="icon" variant="secondary" type="button" onClick={() => handleCopy(formLink)}>
                    {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CustomTooltip>
              )}
              <Button
                size="sm"
                variant="default"
                type="button"
                className="flex items-center"
                onClick={() => handleFormPublishUnPublish(formId as string)}
                disabled={isPending}
              >
                {formConfig?.status === 'draft' ? (
                  <Share className="mr-2 h-4 w-4" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                {formConfig?.status === 'draft' ? 'Publish' : 'Mark as draft'}
              </Button>
            </div>
          )}
        </div>
      </header>

      <PublishedFormModal open={isPublishedFormModalOpen} setOpen={setIsPublishedFormModalOpen} />
    </>
  );
};

export default TopHeader;

const PublishedFormModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const formLink = `${getAppOriginUrl()}/form/${useFormProperty('id')}`;
  const { handleCopy, hasCopied } = useCopyInfo();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Form published successfully!</DialogTitle>
          <DialogDescription>You can now start accepting submissions.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-2 items-center">
          <Input placeholder="Form name" readOnly value={formLink} disabled />
          <Button
            variant={'default'}
            size={'sm'}
            onClick={() => handleCopy(formLink, () => toast.error('Failed to copy'))}
          >
            {hasCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {hasCopied ? 'Copied' : 'Copy link'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
