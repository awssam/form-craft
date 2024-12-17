'use client';

import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import CreateFormModal from './CreateFormModal';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between gap-6 items-center mb-4 sticky -top-3 bg-[#000000] py-3  z-20">
      <h2 className="font-bold text-white md:text-lg text-base">VI Forms</h2>
      <CreateFormModal open={isOpen} setOpen={setIsOpen} className="ml-auto" />
      <UserButton />
    </div>
  );
};

export default Header;
