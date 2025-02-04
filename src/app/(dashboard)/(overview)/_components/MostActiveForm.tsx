import { getMostActiveFormAction } from '@/backend/actions/analytics';
import InfoCard from './InfoCard';
import { StarFilledIcon } from '@radix-ui/react-icons';

export const revalidate = 10;

const MostActiveForm = async () => {
  const res = await getMostActiveFormAction();

  const formName = res?.data;

  return (
    <InfoCard
      className="col-span-full md:col-span-6 [grid-row:2/span-1]  max-h-[230px]"
      title={'Most Active Form'}
      icon={StarFilledIcon}
      description={'Form with the highest number of submissions received.'}
      data={formName}
    />
  );
};

export default MostActiveForm;
