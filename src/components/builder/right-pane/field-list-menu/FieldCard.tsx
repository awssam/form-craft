import { Grip } from 'lucide-react';

interface FieldCardProps {
  icon: React.ReactNode;
  name: string;
  description: string;
}

const FieldCard = ({ icon, name, description }: FieldCardProps) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-dashed border-input rounded-lg hover:border-yellow-200/30 transition-all duration-300">
      <div className="flex items-center gap-2 w-full">
        {icon}
        <h3 className="font-bold text-sm">{name}</h3>
        <Grip className="w-4 h-4 text-white/90 inline ml-auto" />
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default FieldCard;
