import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useFormConfigStore } from '@/zustand/store';
import React from 'react';

export const withColorandClassName =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <T extends Record<string, any>>(Component: React.FC<T>) =>
    // eslint-disable-next-line react/display-name
    ({ ...props }: T) => {
      const primaryColor = useFormConfigStore((s) => s.formConfig.theme?.properties?.primaryTextColor);

      return (
        <Component
          {...props}
          className={cn('text-xs md:text-[12px]', props?.className)}
          style={{ color: primaryColor, ...props?.style }}
        />
      );
    };

export default withColorandClassName(Label);
