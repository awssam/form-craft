import { cn } from '@/lib/utils';
import React from 'react';

const ComingSoonBadge = ({ className }: { className?: string }) => {
  return (
    <span
      className={cn(
        `flex items-center gap-1 h-6 px-3 rounded-full backdrop-blur-sm bg-yellow-900/70 border border-green-700/50`,
        className,
      )}
    >
      <span className="font-normal text-[9px] flex items-center gap-1 gradient-text-light">Coming soon</span>
    </span>
  );
};

export default ComingSoonBadge;
