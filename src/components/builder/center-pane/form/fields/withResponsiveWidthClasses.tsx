import { cn } from '@/lib/utils';
import { FieldEntity } from '@/types/form-config';

const withResponsiveWidthClasses =
  <T extends { field: FieldEntity }>(Component: React.FC<T>) =>
  // eslint-disable-next-line react/display-name
  ({ ...props }: T) => {
    const { field } = props;
    return (
      <Component
        {...props}
        className={cn(
          'lg:w-[calc(100%-12px)] w-full hover:bg-yellow-200/10 py-3 px-2 rounded-lg transition-all duration-150 ease-in-out group',
          {
            'lg:w-[calc(75%-12px)] w-full': field?.width === '75%',
            'lg:w-[calc(50%-12px)] w-full': field?.width === '50%',
            'lg:w-[calc(25%-12px)] w-full': field?.width === '25%',
          },
        )}
      />
    );
  };

export default withResponsiveWidthClasses;
