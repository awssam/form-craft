'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/nextjs';
import React from 'react';

const TabsContainer = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <Tabs defaultValue="overview" className="flex-1">
      <div className="flex justify-between gap-6 items-start md:items-center sm:flex-row flex-col">
        <div className="div">
          <h2 className="font-bold text-white md:text-2xl text-lg">Hey {user?.firstName}!! 👋</h2>
          <p className="text-xs text-muted-foreground">
            This is your dashboard, here you can see how your forms are performing, recent activity and more.
          </p>
        </div>
        <div className="justify-between gap-3 items-center sm:flex">
          {/* <DateTimePicker className="md:w-[200px]" placeHolderClasses="text-white" granularity="day" /> */}
          {/* <Button variant={'default'}>Download</Button> */}
          <TabsList className="">
            <TabsTrigger value="overview" className="text-xs md:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="forms" className="text-xs md:text-sm">
              My Forms
            </TabsTrigger>
            <TabsTrigger value="templates" className="text-xs md:text-sm">
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {children}
    </Tabs>
  );
};

export default TabsContainer;
