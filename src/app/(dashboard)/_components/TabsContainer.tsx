'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

const TabsContainer = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, user } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Tabs
      defaultValue="/"
      value={pathname}
      onValueChange={(value) => {
        router.push(value, { scroll: false });
      }}
      className="flex-1"
    >
      <div className="flex justify-between gap-6 md:items-center sm:flex-row flex-col">
        <div className="div text-center md:text-left">
          {!isLoaded ? (
            <Skeleton className="h-7 w-52 rounded-md mx-auto sm:mx-0" />
          ) : (
            <h2 className="font-bold text-white md:text-2xl text-lg">Hey {user?.firstName ?? '...'} 👋</h2>
          )}

          {!isLoaded ? (
            <Skeleton className="h-3 w-96 rounded-md mt-1 mx-auto sm:mx-0" />
          ) : (
            <p className="text-xs text-muted-foreground">
              This is your dashboard, here you can see how your forms are performing, recent activity and more.
            </p>
          )}
        </div>
        <div className="justify-between gap-3 items-center sm:flex mx-auto sm:m-0">
          {/* <DateTimePicker className="md:w-[200px]" placeHolderClasses="text-white" granularity="day" /> */}
          {/* <Button variant={'default'}>Download</Button> */}
          <TabsList className="">
            <TabsTrigger value="/" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="/forms" className="text-xs md:text-sm">
              My Forms
            </TabsTrigger>
            <TabsTrigger value="/templates" className="text-xs md:text-sm">
              Templates
            </TabsTrigger>
            <TabsTrigger value="/analytics" className="text-xs md:text-sm">
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value={pathname} className="mt-6">
        {children}
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
