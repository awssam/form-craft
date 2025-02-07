import { LineChartIcon } from 'lucide-react';
import InfoCard from './InfoCard';
import { SubmissionsOvertimeLineChart } from './SubmissionsOvertimeLineChart';
import { getFormSubmissionRateOverTimeAction } from '@/backend/actions/analytics';

const SubmissionsOvertime = async () => {
  const res = await getFormSubmissionRateOverTimeAction();

  return (
    <InfoCard
      className="col-span-full flex flex-col gap-2 row-span-2 md:[grid-column:7/14] max-h-[400px]"
      title={'Submissions Overtime'}
      icon={LineChartIcon}
      contentClassName="p-2"
      description={'Showing data for the year'}
      renderData={() => <SubmissionsOvertimeLineChart chartData={res?.data || []} />}
    />
  );
};

export default SubmissionsOvertime;
