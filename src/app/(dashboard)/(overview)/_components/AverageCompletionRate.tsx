import { getAverageCompletionRateAction } from '@/backend/actions/analytics';
import InfoCard from './InfoCard';
import { CirclePercent } from 'lucide-react';

export const revalidate = 10;

const AverageCompletionRate = async () => {
  const res = await getAverageCompletionRateAction();

  const averageCompletionRate = res?.data;

  return (
    <InfoCard
      className="col-span-full sm:col-span-3 md:col-span-3  max-h-[230px]"
      title="Average Completion Rate"
      icon={CirclePercent}
      description={'Percentage of users who completed forms.'}
      data={`${averageCompletionRate ? `${averageCompletionRate?.toFixed(2)}%` : 0}`}
    />
  );
};

export default AverageCompletionRate;
