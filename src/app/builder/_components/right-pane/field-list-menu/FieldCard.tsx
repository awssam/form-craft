import CustomTooltip from '@/components/ui/custom-tooltip';
import { CirclePlus } from 'lucide-react';
import { SectionField } from './config';
import useFeatureAnnouncer from '@/hooks/useFeatureAnnouncer';
import { NewFeatureBadge } from '@/components/common/FeatureReleaseBadge';

interface FieldCardProps {
  icon: React.ReactNode | JSX.Element;
  name: string;
  description: string;
  type: string;
  featureTag?: string;
  onClick: (field: Partial<SectionField>) => void;
}

const FieldCard = ({ icon, name, description, type, featureTag, onClick }: FieldCardProps) => {
  const hasAnnouncedFeatureTag = useFeatureAnnouncer(featureTag as string, !!featureTag);

  return (
    <div
      className="hover:transform-gpu hover:-translate-y-2 cursor-pointer flex flex-col gap-2 p-4 border border-dashed border-input rounded-lg hover:border-yellow-200/30 transition-all duration-300 mt-2"
      onClick={() => onClick({ name, description, type })}
    >
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-bold gradient-text-light text-sm">{name}</h3>
          {!hasAnnouncedFeatureTag && <NewFeatureBadge className="w-fit px-3 py-0.1" childrenClass="text-[10px]" />}
        </div>
        <CustomTooltip tooltip={`Click to Add a ${name}`} triggerClassName="ml-auto inline">
          <CirclePlus className=" w-4 h-4 text-white/90 inline ml-auto" />
        </CustomTooltip>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default FieldCard;
