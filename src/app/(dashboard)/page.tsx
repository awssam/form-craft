"use client";

import { UserButton, useUser } from "@clerk/nextjs";

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
    <div className="flex justify-center items-center gap-6 w-screen h-screen">
      <h3 className="font-bold text-white text-xl">Hello {user?.firstName}!</h3>
      <UserButton />
    </div>
  );
}
