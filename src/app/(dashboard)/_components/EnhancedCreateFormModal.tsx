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
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCreateFormMutation } from '@/data-fetching/client/form';
import { useFormActionProperty } from '@/zustand/store';
import { LayoutTemplate, PuzzleIcon, Wand2, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// import BuildWithAI from './BuildWithAI';
import ActionWidget from './ActionWidget';
import { NewFeatureBadge } from '@/components/common/FeatureReleaseBadge';
import useFeatureAnnouncer from '@/hooks/useFeatureAnnouncer';
import { useState } from 'react';
import { getFormTypesByCategory } from '@/config/form-types';
import { FormUsageType } from '@/types/form-templates';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';

interface CreateFormModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}

type CreateStep = 'method' | 'form-type' | 'ai';

const CreateFormModal = ({ open, setOpen, className }: CreateFormModalProps) => {
  const router = useRouter();
  const setFormConfig = useFormActionProperty('setFormConfig');
  const hasAnnouncedNewFormFeature = useFeatureAnnouncer('new-form-generation-capability');
  const [currentStep, setCurrentStep] = useState<CreateStep>('method');
  const [selectedFormType, setSelectedFormType] = useState<FormUsageType | null>(null);

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
    mutate('general');
  };

  const handleFormTypeSelect = (formType: FormUsageType) => {
    setSelectedFormType(formType);
  };

  const handleCreateWithType = () => {
    if (selectedFormType) {
      mutate(selectedFormType);
    }
  };

//   const handleAiGeneration = () => {
//     setCurrentStep('ai');
//   };

  const resetModal = () => {
    setCurrentStep('method');
    setSelectedFormType(null);
  };

  const handleModalClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetModal();
    }
    setOpen(isOpen);
  };

  const renderMethodSelection = () => (
    <>
      <DialogHeader>
        <DialogTitle>New Form</DialogTitle>
        <DialogDescription>Choose how you want to create your form.</DialogDescription>
      </DialogHeader>

      <div className="flex flex-col gap-4">
        {/* <BuildWithAI onAiClick={handleAiGeneration} /> */}
        
        <div className="flex flex-wrap gap-4">
          <ActionWidget
            title="Use Form Template"
            icon={LayoutTemplate}
            description="Choose from predefined form types with smart field mapping"
            className="bg-gradient-to-br from-blue-950/30 to-indigo-950/30 basis-[100%] md:basis-[48%]"
          >
            <Button 
              variant={'secondary'} 
              className="w-full" 
              onClick={() => setCurrentStep('form-type')}
            >
              Choose Form Type
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </ActionWidget>

          <ActionWidget
            title="Build from scratch"
            icon={PuzzleIcon}
            description="Create a custom form without predefined structure"
            className="bg-gradient-to-br from-[#080808] to-[#1c212dc7] basis-[100%] md:basis-[48%]"
          >
            <Button variant={'secondary'} className="w-full" onClick={handleBuildFromScratch}>
              Create from scratch
            </Button>
          </ActionWidget>
        </div>

        <div className="mt-2">
          <ActionWidget
            title="Start with a template"
            icon={LayoutTemplate}
            description="Browse our collection of pre-built form templates"
            className="bg-gradient-to-br from-green-950/30 to-emerald-950/30"
          >
            <Button variant="outline" className="w-full" onClick={handleWithTemplateOption}>
              Browse templates
            </Button>
          </ActionWidget>
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary" className="btn">
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );

  const renderFormTypeSelection = () => {
    const categories = ['event', 'business', 'feedback', 'application', 'general'];
    const categoryDisplayNames = {
      event: 'Event Management',
      business: 'Business Operations', 
      feedback: 'Feedback & Surveys',
      application: 'Applications',
      general: 'General Purpose'
    };

    return (
      <>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentStep('method')}
              className="p-1 h-auto"
            >
              ←
            </Button>
            Select Form Type
          </DialogTitle>
          <DialogDescription>
            Choose the type of form you want to create. Each type comes with preconfigured fields and database mappings.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {categories.map((category) => {
              const formTypes = getFormTypesByCategory(category);
              if (formTypes.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      {categoryDisplayNames[category as keyof typeof categoryDisplayNames]}
                    </h3>
                    <Separator className="flex-1" />
                  </div>
                  
                  <div className="grid gap-3">
                    {formTypes.map((formTypeConfig) => (
                      <Card
                        key={formTypeConfig.id}
                        className={`cursor-pointer transition-all hover:shadow-md border-2 ${
                          selectedFormType === formTypeConfig.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleFormTypeSelect(formTypeConfig.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <div className="text-2xl">{formTypeConfig.icon}</div>
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{formTypeConfig.name}</h4>
                                  {selectedFormType === formTypeConfig.id && (
                                    <Check className="w-4 h-4 text-primary" />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {formTypeConfig.description}
                                </p>
                                
                                {formTypeConfig.preconfiguredFields.length > 0 && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {formTypeConfig.preconfiguredFields.length} pre-configured fields
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      Auto-mapped to database
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('method')}
          >
            Back
          </Button>
          <Button
            onClick={handleCreateWithType}
            disabled={!selectedFormType}
            className="flex items-center gap-2"
          >
            Create Form
            <Wand2 className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </>
    );
  };

  const renderAiGeneration = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('method')}
            className="p-1 h-auto"
          >
            ←
          </Button>
          AI Form Generation
        </DialogTitle>
        <DialogDescription>
          Use AI to generate your form based on your requirements.
        </DialogDescription>
      </DialogHeader>

      {/* <BuildWithAI standalone /> */}

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => setCurrentStep('method')}
        >
          Back
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogTrigger asChild className={className}>
        <div className="flex gap-2 items-center">
          {!hasAnnouncedNewFormFeature && <NewFeatureBadge />}
          <Button variant="default" size={'sm'}>
            Create a new form
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="rounded-lg max-w-[95dvw] sm:max-w-[700px] max-h-[90dvh] overflow-y-auto">
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'form-type' && renderFormTypeSelection()}
        {currentStep === 'ai' && renderAiGeneration()}
      </DialogContent>
    </Dialog>
  );
};

export default CreateFormModal;
