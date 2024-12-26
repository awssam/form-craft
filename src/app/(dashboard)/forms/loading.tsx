import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const FormCardSkeleton = () => {
  return (
    <Card className="w-full border-[#212326] border-dashed shadow-xl ">
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center justify-between w-full gap-4">
          <Skeleton className="min-h-6 w-[90%]" /> {/* Title Skeleton */}
        </CardTitle>
        <CardDescription>
          <Skeleton className="min-h-4 w-[70%]" /> {/* Description Skeleton */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-1/2" /> {/* Submissions count Skeleton */}
      </CardContent>
      <CardFooter className="flex items-center justify-between w-full gap-4 text-ellipsis">
        <Skeleton className="h-4 w-[120px]" /> {/* Last modified time Skeleton */}
        <Skeleton className="h-6 w-20 rounded-lg" /> {/* Status Tag Skeleton */}
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
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
        <FormCardSkeleton />
      </div>
    </div>
  );
};

export default loading;
