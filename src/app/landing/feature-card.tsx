"use client";

import React from 'react';
import { motion, Variants } from 'motion/react';
import { cn } from '@/lib/utils';

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  gradient?: string;
  status?: 'completed' | 'upcoming' | 'in-progress';
  variants: Variants;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  gradient = 'from-zinc-900/80 to-zinc-900/40',
  status,
  variants,
}) => {
  return (
    <motion.div
      variants={variants}
      className={cn(
        'group relative p-6 rounded-xl border border-zinc-800 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:border-zinc-700/50',
        gradient,
        className
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-zinc-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-md shadow-black/20 transition-all duration-300 group-hover:from-zinc-800/80 group-hover:shadow-lg group-hover:shadow-black/30 group-hover:to-zinc-700/80">
          {icon}
        </div>

        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-zinc-200">
            {title}
          </h3>
          {status && status !== 'completed' && (
            <span
              className={cn(
                'text-xs rounded-full px-2 py-1',
                status === 'upcoming'
                  ? 'bg-emerald-900/30 border border-emerald-800/50 text-emerald-400'
                  : 'bg-amber-900/30 border border-amber-800/50 text-amber-400'
              )}
            >
              {status === 'upcoming' ? 'Coming Soon' : 'In Progress'}
            </span>
          )}
        </div>

        <p className="leading-relaxed text-zinc-400 transition-colors group-hover:text-zinc-300">
          {description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1/2 rounded-b-xl bg-gradient-to-t from-zinc-800/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default FeatureCard;

