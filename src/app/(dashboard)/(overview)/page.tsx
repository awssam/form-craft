import Overview from '@/app/(dashboard)/(overview)/_components/Overview';

export const revalidate = 20;

export default async function OverviewPage() {
  return <Overview />;
}
