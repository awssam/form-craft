'use client';

import Overview from '@/components/dashboard/overview/Overview';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserButton, useUser } from '@clerk/nextjs';

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center gap-6 w-screen h-screen">
        <h3 className="font-bold text-white text-xl">Loading...</h3>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <main className="w-screen h-screen bg-[#000000]">
      <div className="w-screen h-screen flex flex-col py-3 sm:px-6 px-3 gap-4 bg-[#000000] max-w-screen-[1700px] mx-auto overflow-auto">
        <div className="flex justify-between gap-6 items-center mb-4 sticky -top-3 bg-[#000000] py-3  z-20">
          <h2 className="font-bold text-white md:text-lg text-base">VI Forms</h2>
          <UserButton />
        </div>

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

          <TabsContent value="overview" className="mt-6">
            <Overview />
          </TabsContent>
          <TabsContent value="forms">
            <h3 className="font-bold text-white text-xl">My Forms</h3>
          </TabsContent>
          <TabsContent value="templates">
            <h3 className="font-bold text-white text-xl">Templates</h3>
          </TabsContent>
          <TabsContent value="analytics">
            <h3 className="font-bold text-white text-xl">Analytics</h3>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
