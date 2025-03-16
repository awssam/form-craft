'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import Menu from '@/components/ui/kebabmenu';

import { formatDistanceToNow } from '@/lib/datetime';
import { cn, getAppOriginUrl } from '@/lib/utils';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface FormCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  submissions: number;
  lastModified: Date | string;
  isPreview?: boolean;
  onEdit?: (id: string, name: string) => void;
  onDelete?: (id: string, name: string) => void;
}

const FormCard = ({
  id,
  title,
  description,
  status,
  submissions,
  lastModified,
  isPreview,
  onEdit,
  onDelete,
}: FormCardProps) => {
  const formActions = [
    {
      label: 'Edit',
      onClick: () => onEdit?.(id, title),
    },
    {
      label: 'Delete',
      onClick: () => onDelete?.(id, title),
    },
  ];

  if (status === 'published') {
    formActions.push({
      label: 'Go to published form',
      onClick: () => {
        const formLink = `${getAppOriginUrl()}/form/${id}`;
        window.open(formLink, '_blank');
      },
    });
  }

  return (
    <>
      <Card
        className={cn(
          'w-full border-[#212326] border-dashed shadow-xl hover:border-yellow-200/30 transition-all transform-gpu hover:-translate-y-2',
          {
            'cursor-pointer duration-300': !isPreview,
            'cursor-not-allowed animate-pulse': isPreview,
          },
        )}
      >
        <CardHeader className="space-y-0.5">
          <CardTitle className="flex items-center justify-between w-full gap-4">
            <h2
              className="text-base md:text-lg max-w-[90%] hover:text-yellow-200/95 flex items-center group transition-all duration-300"
              onClick={() => onEdit?.(id, title)}
            >
              <Link prefetch href={`/builder`}>
                {title || 'Untitled Form'}
                <ArrowRight className="w-4 h-4 inline ml-2 group-hover:opacity-100 opacity-0 " />
              </Link>
            </h2>
            {!isPreview && <Menu items={formActions} />}
          </CardTitle>
          <CardDescription className="-mt-6 text-xs text-ellipsis">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link prefetch href={submissions > 0 ? `/forms/${id}` : ''} className="font-semibold group">
            <span className="font-bold text-2xl">{submissions}</span> submissions
            {submissions > 0 && <ArrowRight className="w-4 h-4 inline ml-2" aria-label="View Submissions" />}
          </Link>
        </CardContent>
        <CardFooter className="flex items-center justify-between w-full gap-4 text-ellipsis">
          <p className="text-muted-foreground text-xs">
            Last modified: {formatDistanceToNow(new Date(lastModified ?? Date.now()))}
          </p>
          <FormStatusTag status={isPreview ? 'creating-new' : status} />
        </CardFooter>
      </Card>
    </>
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
    'creating-new': {
      label: 'Creating...',
      color: 'bg-gray-800',
    },
  };

  return (
    <div
      className={`flex items-center gap-1 h-6 px-3 rounded-full ${
        statusConfig[status as keyof typeof statusConfig]?.color
      }`}
    >
      <span className="text-white font-normal text-xs flex items-center gap-1">
        {statusConfig[status as keyof typeof statusConfig].label}
        {status === 'creating-new' && <LoaderCircle className="w-4 h-4 inline animate-spin" />}
      </span>
    </div>
  );
};
