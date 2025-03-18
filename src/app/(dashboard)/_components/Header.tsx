'use client';

import { UserButton } from '@clerk/nextjs';
import React, { useState } from 'react';
import CreateFormModal from './CreateFormModal';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between gap-6 items-center mb-4 sticky bg-[#0f0d10] -top-3 py-3  z-20 w-full">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-600"></div>
        <Link className="font-bold text-lg md:text-xl" href={'/'}>FormCraft</Link>
      </div>
      <CreateFormModal open={isOpen} setOpen={setIsOpen} className="ml-auto" />
      <UserButton />
    </div>
  );
};

export default Header;
