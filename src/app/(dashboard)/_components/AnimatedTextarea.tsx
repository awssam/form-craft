'use client';

import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface AnimatedPromptTextareaProps {
  placeholders: string[];
  onValueChange?: (value: string) => void;
}

const AnimatedPromptTextarea = ({ placeholders, onValueChange }: AnimatedPromptTextareaProps) => {
  const [currentPlaceholder, setCurrentPlaceholder] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    if (!placeholders.length) return;

    const typingSpeed = isDeleting ? 30 : 70;
    const pauseDuration = 1500;

    const timeout = setTimeout(
      () => {
        const currentText = placeholders[currentPlaceholderIndex];

        if (isDeleting) {
          setCurrentPlaceholder(currentText.substring(0, currentCharIndex - 1));
          setCurrentCharIndex((prev) => prev - 1);

          if (currentCharIndex <= 1) {
            setIsDeleting(false);
            setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
          }
        } else {
          setCurrentPlaceholder(currentText.substring(0, currentCharIndex + 1));
          setCurrentCharIndex((prev) => prev + 1);

          if (currentCharIndex >= currentText.length) {
            setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        }
      },
      isDeleting && currentCharIndex <= 1 ? 500 : typingSpeed,
    );

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentPlaceholderIndex, isDeleting, placeholders]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <Textarea
      value={value}
      onChange={handleChange}
      className="text-white resize-none focus-visible:gradient-border focus-visible:ring-0  focus-visible:border focus-visible:border-white/30"
      placeholder={currentPlaceholder}
      rows={4}
    />
  );
};

export default AnimatedPromptTextarea;
