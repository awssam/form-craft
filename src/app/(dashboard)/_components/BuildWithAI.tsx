import React from 'react';
import ActionWidget from './ActionWidget';
import { Lightbulb, Loader, Loader2, Sparkles } from 'lucide-react';
import FormField from '@/components/common/FormField';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useFormActionProperty } from '@/zustand/store';
import { useRouter } from 'next/navigation';

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

const BuildWithAI = () => {
  const { mutateAsync, isPending } = useGeminiChat();

  const setFormConfig = useFormActionProperty('setFormConfig');
  const router = useRouter();

  const promptRef = React.useRef<HTMLTextAreaElement>(null);
  const handlePromptSubmit = () => {
    const prompt = promptRef.current?.value.trim();

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
      title="Build with AI ✨"
      icon={Sparkles}
      description="Describe what you need, and we wll generate a form for you instantly"
      className="bg-gradient-to-b from-black via-[#101316] to-[#1f1f23] w-full"
    >
      <FormField label="Describe what you need" id="description" className="gradient-text-dark font-normal text-sm">
        <Textarea
          ref={promptRef}
          placeholder="Eg: I need a form to collect customer details"
          className="text-white resize-none focus-visible:gradient-border focus-visible:ring-0  focus-visible:border focus-visible:border-white/30"
          rows={4}
        />
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
            Generating... <Loader2 className="animate-spin" />
          </>
        )}
      </Button>
    </ActionWidget>
  );
};

export default BuildWithAI;
