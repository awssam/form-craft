'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Menu from '@/components/ui/kebabmenu';

import { formatDistanceToNow } from '@/lib/datetime';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
interface FormCardProps {
  title: string;
  description: string;
  status: string;
  submissions: number;
  lastModified: Date | string;
}

const FormCard = ({ title, description, status, submissions, lastModified }: FormCardProps) => {
  const router = useRouter();

  const formActions = [
    {
      label: 'Edit',
      onClick: () => {
        router.push('/builder');
      },
    },
    {
      label: 'Delete',
      onClick: () => {
        console.log('Delete form');
      },
    },
  ];
  return (
    <Card
      onClick={() => router.push('/builder')}
      className="w-full border-[#212326] border-dashed shadow-xl hover:border-yellow-200/30 transition-all duration-300 transform-gpu hover:-translate-y-2 cursor-pointer"
    >
      <CardHeader className="space-y-0.5">
        <CardTitle className="flex items-center justify-between w-full gap-4">
          <h2 className="hover:font-extrabold hover:text-yellow-200 flex items-center group transition-all duration-300">
            {title}
            <ArrowRight className="w-4 h-4 inline ml-2 group-hover:opacity-100 opacity-0 transition-all duration-300" />
          </h2>
          <Menu items={formActions} />
        </CardTitle>
        <CardDescription className="-mt-6 text-xs text-ellipsis">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold">
          <span className="font-bold text-2xl">{submissions}</span> submissions
        </h3>
      </CardContent>
      <CardFooter className="flex items-center justify-between w-full gap-4 text-ellipsis">
        <p className="text-muted-foreground text-xs">Last modified: {formatDistanceToNow(new Date(lastModified))}</p>
        <FormStatusTag status={status} />
      </CardFooter>
    </Card>
  );
};

export default FormCard;

const FormStatusTag = ({ status }: { status: string }) => {
  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'bg-slate-800', // Yellow color for draft
    },
    published: {
      label: 'Published',
      color: 'bg-green-800',
    },
  };

  return (
    <div
      className={`flex items-center gap-1 h-6 px-3 rounded-full ${
        statusConfig[status as keyof typeof statusConfig].color
      }`}
    >
      <span className="text-white font-normal text-xs">{statusConfig[status as keyof typeof statusConfig].label}</span>
    </div>
  );
};
