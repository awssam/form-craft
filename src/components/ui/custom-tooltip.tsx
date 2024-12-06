import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

interface CustomTooltipProps {
  tooltip: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const CustomTooltip = ({ tooltip, children, className }: CustomTooltipProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className={className}>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
