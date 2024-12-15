import Header from '@/components/pages/dashboard/common/Header';
import TabsContainer from '@/components/pages/dashboard/common/TabsContainer';
import Overview from '@/components/pages/dashboard/overview/Overview';
import { TabsContent } from '@/components/ui/tabs';

export default function Home() {
  return (
    <main className="w-screen h-screen bg-[#000000]">
      <div className="w-screen h-screen flex flex-col py-3 sm:px-6 px-3 gap-4 bg-[#000000] max-w-screen-[1700px] mx-auto overflow-auto">
        <Header />
        <TabsContainer>
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
        </TabsContainer>
      </div>
    </main>
  );
}
