import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const TitleWithIcon = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <CardTitle>
        <h2>{title}</h2>
      </CardTitle>
      <Icon className="w-4 h-4 text-muted-foreground" />
    </div>
  );
};

interface InfoCardProps {
  className?: string;
  title: string;
  icon: React.ElementType;
  description: string;
  data?: string;
  contentClassName?: string;
  renderData?: () => React.ReactNode;
}
const InfoCard = ({ className, title, icon, description, data, renderData, contentClassName }: InfoCardProps) => {
  return (
    <Card
      className={cn(
        'border-[#212326] shadow-lg border-dashed hover:transform-gpu hover:-translate-y-2 hover:border-yellow-200/30 transition-all duration-300',
        className,
      )}
    >
      <CardHeader className="space-y-0.5">
        <TitleWithIcon title={title} icon={icon} />
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className={cn('mt-auto', contentClassName)}>
        {renderData ? renderData() : <h2 className="font-bold text-white sm:text-2xl text-xl">{data}</h2>}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
