import React from 'react';
import ActionWidget from './ActionWidget';
import { Loader2, Sparkles } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useFormActionProperty } from '@/zustand/store';
import { useRouter } from 'next/navigation';
import AnimatedPromptTextarea from './AnimatedTextarea';
import { NewFeatureBadge } from '@/components/common/FeatureReleaseBadge';
import useFeatureAnnouncer from '@/hooks/useFeatureAnnouncer';

const useGeminiChat = () => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch('/api/form/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();

      console.log('data', data);

      if (data?.content) {
        return data?.content;
      } else {
        throw new Error('Something went wrong');
      }
    },
  });
};

const examplePrompts = [
  'User registration form with email and password fields',
  'Product review form with rating and comment fields',
  'Contact form with name, email, and message fields',
  'Job application form with name, email, and resume fields',
  'Sales lead capture form with name, email, and company fields',
];

const BuildWithAI = () => {
  const { mutateAsync, isPending } = useGeminiChat();
  const [value, setValue] = React.useState('');
  const setFormConfig = useFormActionProperty('setFormConfig');
  const router = useRouter();
  const hasAnnouncedAiFormGenFeature = useFeatureAnnouncer('ai-form-generation');

  const handlePromptSubmit = () => {
    const prompt = value;

    if (!prompt?.length) return toast.error('Please describe what you need');

    mutateAsync(prompt, {
      onSuccess: (data) => {
        const response = data;

        if (response) {
          setFormConfig(response);
          toast.success('Form created successfully!', {
            style: { background: '#000', color: '#fff' },
          });
          setTimeout(() => router.push('/builder'), 1000);
        }
      },
      onError: () => {
        toast.error('Something went wrong');
      },
    });
  };

  return (
    <ActionWidget
      title={
        <span className="flex items-center gap-2">
          Build with AI ✨{' '}
          {!hasAnnouncedAiFormGenFeature && (
            <NewFeatureBadge className="w-fit px-3 py-0.5" childrenClass="text-[10px]" />
          )}
        </span>
      }
      icon={Sparkles}
      description="Describe what you need, and we wll generate a form for you instantly"
      className="bg-gradient-to-b from-black via-[#101316] to-[#1f1f23] w-full"
    >
      <FormField label="Describe what you need" id="description" className="gradient-text-dark font-normal text-sm">
        <AnimatedPromptTextarea placeholders={examplePrompts} onValueChange={setValue} />
        <small className="text-xs text-muted-foreground">
          Tip💡 : Provide details like fields, validation rules, and layout preferences for better results.
        </small>
      </FormField>
      <Button
        variant={'default'}
        className="w-full flex items-center mt-4"
        onClick={handlePromptSubmit}
        disabled={isPending}
      >
        {!isPending && (
          <>
            Generate with AI <Sparkles className="ml-2 h-4 w-4" color="#000" />{' '}
          </>
        )}
        {isPending && (
          <>
            AI is working... <Loader2 className="ml-2 animate-spin h-4 w-4" />
          </>
        )}
      </Button>
    </ActionWidget>
  );
};

export default BuildWithAI;
