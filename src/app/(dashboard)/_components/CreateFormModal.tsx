import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateFormMutation } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import { LayoutTemplate, PuzzleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import BuildWithAI from './BuildWithAI';
import ActionWidget from './ActionWidget';
import { NewFeatureBadge } from '@/components/common/FeatureReleaseBadge';
import useFeatureAnnouncer from '@/hooks/useFeatureAnnouncer';

interface CreateFormModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

const CreateFormModal = ({ open, setOpen, className }: CreateFormModalProps) => {
  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');
  const hasAnnouncedNewFormFeature = useFeatureAnnouncer('new-form-generation-capability');

  const mutate = useCreateFormMutation({
    onMutate: () => {
      setOpen(false);
      const toastId = toast.loading('Creating form...');
      return toastId as string;
    },
    onSuccess: (data, context) => {
      toast.dismiss(context as string);
      if (data?.id) {
        setFormConfig(data);
        toast.success('Form created successfully!', {
          style: { background: '#000', color: '#fff' },
        });
        setTimeout(() => router.push('/builder'), 1000);
      }
    },
  });

  const handleWithTemplateOption = () => {
    setOpen(false);
    router.push('/templates');
  };

  const handleBuildFromScratch = () => {
    mutate(void null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        <div className="flex gap-2 items-center">
          {!hasAnnouncedNewFormFeature && <NewFeatureBadge />}
          <Button variant="default" size={'sm'}>
            Create a new form
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-[95dvw] sm:max-w-[700px] max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Form</DialogTitle>
          <DialogDescription>Choose how you want to create your form.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <BuildWithAI />
          <div className="flex flex-wrap gap-4">
            <ActionWidget
              title="Build from scratch"
              icon={PuzzleIcon}
              description="Create a form from scratch"
              className="bg-gradient-to-br from-[#080808] to-[#1c212dc7] basis-[100%] md:basis-[48%]"
            >
              <Button variant={'secondary'} className="w-full" onClick={handleBuildFromScratch}>
                Create from scratch
              </Button>
            </ActionWidget>
            <ActionWidget
              title="Start with a template"
              icon={LayoutTemplate}
              description="Create a form from pre-built templates"
              className="bg-gradient-to-br from-green-950/30 to-emerald-950/30 md:basis-[48%] basis-[100%]"
            >
              <Button variant="outline" className="w-full" onClick={handleWithTemplateOption}>
                Browse templates
              </Button>
            </ActionWidget>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="btn" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormModal;
