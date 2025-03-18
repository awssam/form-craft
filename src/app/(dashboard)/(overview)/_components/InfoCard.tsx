import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const TitleWithIcon = ({ title, icon: Icon }: { title: string; icon: React.ElementType }) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <CardTitle>
        <h2 className="gradient-text">{title}</h2>
      </CardTitle>
      <Icon className="w-4 h-4 text-zinc-400" />
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
        'glass-card border-zinc-800/50 gradient-border hover-lift shadow-lg',
        'hover:border-zinc-700/50 transition-all duration-300',
        className,
      )}
    >
      <CardHeader className="space-y-0.5">
        <TitleWithIcon title={title} icon={icon} />
        <CardDescription className="text-[13.2px] text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent className={cn('mt-auto', contentClassName)}>
        {renderData ? renderData() : <h2 className="font-bold gradient-text sm:text-2xl text-xl">{data}</h2>}
      </CardContent>
    </Card>
  );
};

export const InfoCardSkeleton = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('glass-card border-zinc-800/50 shadow-lg transition-all duration-300', className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-4 w-32 bg-zinc-800/50" /> {/* Title Skeleton */}
          <Skeleton className="w-6 h-6 rounded-full bg-zinc-800/50" /> {/* Icon Skeleton */}
        </div>
        <CardDescription>
          <Skeleton className="h-3 w-44 bg-zinc-800/50" /> {/* Description Skeleton */}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <Skeleton className="h-6 w-20 bg-zinc-800/50" /> {/* Data Skeleton */}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
