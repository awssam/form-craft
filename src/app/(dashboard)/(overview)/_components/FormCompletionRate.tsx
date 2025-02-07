import { BarChartIcon } from 'lucide-react';
import InfoCard from './InfoCard';
import FormCompletionRateBarChart from './FormCompletionRateBarChart';
import { getCompletionRateByFormAction } from '@/backend/actions/analytics';

const FormCompletionRate = async () => {
  const res = await getCompletionRateByFormAction();

  if (!res?.data) return null;

  return (
    <InfoCard
      className="col-span-full md:col-span-6 flex flex-col  gap-2 md:[grid-row:3] max-h-[400px]"
      title={'Completion Rate By Form'}
      icon={BarChartIcon}
      contentClassName="p-0"
      description={'Showing data for all time.'}
      renderData={() => <FormCompletionRateBarChart chartData={res?.data} />}
    />
  );
};

export default FormCompletionRate;
