import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface CustomTooltipProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

const CustomTooltip = ({ tooltip, children, className, triggerClassName }: CustomTooltipProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger type="button" className={triggerClassName}>
          {children}
        </TooltipTrigger>
        <TooltipContent className={className}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
