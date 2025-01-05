import CustomTooltip from '@/components/ui/custom-tooltip';
import { CirclePlus } from 'lucide-react';
import { SectionField } from './config';

interface FieldCardProps {
  icon: React.ReactNode | JSX.Element;
  name: string;
  description: string;
  type: string;
  onClick: (field: Partial<SectionField>) => void;
}

const FieldCard = ({ icon, name, description, type, onClick }: FieldCardProps) => {
  return (
    <div
      className="hover:transform-gpu hover:-translate-y-2 cursor-pointer flex flex-col gap-2 p-4 border border-dashed border-input rounded-lg hover:border-yellow-200/30 transition-all duration-300 mt-2"
      onClick={() => onClick({ name, description, type })}
    >
      <div className="flex items-center gap-2 w-full">
        {icon}
        <h3 className="font-bold text-sm">{name}</h3>
        <CustomTooltip tooltip={`Click to Add a ${name}`} triggerClassName="ml-auto inline">
          <CirclePlus className=" w-4 h-4 text-white/90 inline ml-auto" />
        </CustomTooltip>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default FieldCard;
