import React, { ComponentProps } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface CustomTooltipProps extends ComponentProps<typeof TooltipContent> {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

const CustomTooltip = ({ tooltip, children, className, triggerClassName, ...props }: CustomTooltipProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger type="button" className={triggerClassName}>
          {children}
        </TooltipTrigger>
        <TooltipContent className={className} {...props}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
