'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const TemplateCardSkeleton = () => {
  return (
    <Card className="w-full relative border-[#212326] border-dashed shadow-xl group">
      {/* Image Skeleton */}

      {/* Card Header Skeleton */}
      <CardHeader className="space-y-2 px-4 py-2">
        <div className="relative w-full h-[200px] overflow-hidden bg-black my-2">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
        <CardTitle>
          <Skeleton className="h-6 w-[90%]" /> {/* Title Skeleton */}
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-[70%]" /> {/* Description Skeleton */}
        </CardDescription>
      </CardHeader>

      {/* Card Footer Skeleton */}
      <CardFooter className="flex items-center flex-wrap w-full px-4 py-2 gap-3 mb-3">
        <Skeleton className="h-6 w-48 rounded-full" /> {/* Tag Skeleton */}
      </CardFooter>
    </Card>
  );
};

const loading = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between gap-4 items-center">
        <Skeleton className="md:w-[500px] h-11 bg-black border-input border rounded-lg" />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 rounded-lg">
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
        <TemplateCardSkeleton />
      </div>
    </div>
  );
};

export default loading;
