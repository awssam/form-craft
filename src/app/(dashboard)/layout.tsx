import React from 'react';
import Header from '@/app/(dashboard)/_components/Header';
import TabsContainer from '@/app/(dashboard)/_components/TabsContainer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="w-screen h-screen bg-black relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-black/0 pointer-events-none"></div>
      <div className="absolute top-40 -left-64 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-3xl"></div>
      <div className="absolute top-80 -right-64 w-96 h-96 bg-zinc-900/20 rounded-full filter blur-3xl"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02] pointer-events-none"></div>

      {/* Content container */}
      <div className="relative w-screen h-screen flex flex-col py-3 sm:px-6 px-3 gap-4 max-w-screen-[1700px] mx-auto overflow-auto z-10">
        <Header />
        <TabsContainer>{children}</TabsContainer>
      </div>
    </main>
  );
};

export default Layout;
