import React from 'react';
import Header from '@/app/(dashboard)/_components/Header';
import TabsContainer from '@/app/(dashboard)/_components/TabsContainer';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: DashboardLayoutProps) => {
  return (
    <main className="w-screen h-screen bg-[#000000]">
      <div className="w-screen h-screen flex flex-col py-3 sm:px-6 px-3 gap-4 bg-[#000000] max-w-screen-[1700px] mx-auto overflow-auto">
        <Header />
        <TabsContainer>{children}</TabsContainer>
      </div>
    </main>
  );
};

export default Layout;
