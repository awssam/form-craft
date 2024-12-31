'use client';

import React from 'react';

import LeftPaneBreadCrumbs from './BreadCrumbs';
import { Input } from '@/components/ui/input';

import { useFormActionProperty, useFormProperty } from '@/zustand/store';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/builder', label: 'Builder' },
];

const Header = () => {
  const createdBy = useFormProperty('createdBy');
  const isTemplate = createdBy === 'SYSTEM';
  const { user } = useUser();

  const updateFormConfig = useFormActionProperty('updateFormConfig');

  const handleUseTemplate = () => {
    updateFormConfig({
      createdBy: user?.id || 'SYSTEM',
    });
  };

  return (
    <header className="flex flex-col gap-2 sticky pt-4 -top-1 bg-[#0c0a0a] z-20">
      <div className="flex justify-between items-center gap-2">
        <LeftPaneBreadCrumbs links={links} />
        {isTemplate && (
          <Button size="sm" variant="default" onClick={handleUseTemplate}>
            Use template
          </Button>
        )}
      </div>
      <div className="flex justify-between items-center gap-2">
        <FormName />
      </div>
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
      onChange={handleNameChange}
      value={name}
      className="border-0 p-0 border-b-[1px] border-b-greyBorder rounded-none focus-visible:ring-0 font-bold tracking-tight text-white/80 text-lg"
    />
  );
};

export default Header;
