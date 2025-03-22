import { cn } from '@/lib/utils';
import React from 'react';

const BaseBadge = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <span
      className={cn(
        `flex items-center gap-1 h-6 px-3 rounded-full backdrop-blur-sm bg-yellow-900/70 border border-green-700/50`,
        className,
      )}
    >
      <span className="font-normal text-[9px] flex items-center gap-1 gradient-text-light">{children}</span>
    </span>
  );
};

const ComingSoonBadge = ({ className }: { className?: string }) => {
  return <BaseBadge className={className}>Coming soon</BaseBadge>;
};

export default ComingSoonBadge;

export const NewFeatureBadge = ({ className, childrenClass }: { className?: string; childrenClass?: string }) => {
  return (
    <BaseBadge className={cn('bg-orange-400/70 border border-green-700/50 rounded-3xl animate-pulse', className)}>
      <span className={cn('text-[12px] font-semibold flex items-center gap-1 gradient-text', childrenClass)}>New!</span>
    </BaseBadge>
  );
};
