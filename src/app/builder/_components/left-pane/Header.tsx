'use client';

import React from 'react';

import { Input } from '@/components/ui/input';

import { useFormActionProperty, useFormProperty } from '@/zustand/store';

const Header = () => {
  return (
    <header className="flex flex-col pt-1 gap-2 sticky top-[-13px] pb-2  z-20">
      <FormName />
    </header>
  );
};

const FormName = () => {
  const name = useFormProperty('name')!;
  const updateFormConfig = useFormActionProperty('updateFormConfig');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormConfig({ name: e.target.value });
  };

  return (
    <Input
      placeholder="What's this form called?"
      onChange={handleNameChange}
      value={name}
      className="border-0 p-0 border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0 font-bold tracking-tight text-white/80 text-lg"
    />
  );
};

export default Header;
