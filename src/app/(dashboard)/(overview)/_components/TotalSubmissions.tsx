import { getTotalSubmissionCountAction } from '@/backend/actions/analytics';
import InfoCard from './InfoCard';
import { ClipboardList } from 'lucide-react';

export const revalidate = 10;

const TotalSubmissions = async () => {
  const res = await getTotalSubmissionCountAction();

  const totalSubmissions = res?.data;

  return (
    <InfoCard
      className="col-span-full sm:col-span-3 md:col-span-3 max-h-[230px] "
      title="Total Submissions"
      icon={ClipboardList}
      description={'No. of complete/in complete submissions received across all forms.'}
      data={`${totalSubmissions || 0}`}
    />
  );
};

export default TotalSubmissions;
