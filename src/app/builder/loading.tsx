import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

const Loading = () => {
  return (
    <main className="flex md:flex-row flex-col flex-nowrap bg-background w-[100dvw] h-[100dvh]">
      {/* Left Panel */}
      <div className="h-full bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto flex-grow">
        <Skeleton className="h-8 w-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="p-4 space-y-10" key={index}>
            <div className="space-y-2">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Center Panel */}
      <div className="h-full bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto flex-grow-[2] z-10">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="flex flex-col gap-4 max-w-[80%] mx-auto mb-[100px]" key={index}>
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div className="h-full bg-background flex-col gap-6 p-4 pt-0 max-h-screen overflow-auto flex-grow">
        <Skeleton className="h-8 w-full max-w-[95%] mx-auto" />

        <div className="mt-[40px] flex flex-col gap-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex flex-col gap-[40px] mt-[40px]">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton className="h-[70px] w-full" key={index} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Loading;
