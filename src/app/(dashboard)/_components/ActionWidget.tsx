import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ActionWidgetProps {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const ActionWidget = (props: ActionWidgetProps) => {
  const className = props.className || 'bg-gradient-to-b from-black via-[#1a222d] to-[#2b2b31]';
  const { icon: Icon, title, description, children } = props;
  return (
    <Card className={cn('p-0', className)}>
      <CardHeader className="p-4">
        <div className="flex gap-2 items-start">
          <div className="mt-0.5 bg-yellow-500/10 rounded-full p-2 h-8 w-8 flex items-center justify-center">
            <Icon size={20} className="text-yellow-300" />
          </div>
          <article>
            <h3 className="font-bold text-sm gradient-text text-transparent">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </article>
        </div>
      </CardHeader>
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
};

export default ActionWidget;