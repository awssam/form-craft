import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  gradient?: string;
  status?: 'completed' | 'upcoming' | 'in-progress';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  className,
  gradient = 'from-zinc-900/80 to-zinc-900/40',
  status,
}) => {
  return (
    <div
      // initial={{ opacity: 0, y: 20 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.5 }}
      // viewport={{ once: true }}
      // whileHover={{ scale: 1.02 }}
      className={cn(
        'group relative p-6 rounded-xl border border-zinc-800 hover:border-zinc-700/50 transition-all duration-300',
        'bg-gradient-to-br backdrop-blur-sm',
        gradient,
        className,
      )}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-zinc-700/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div
          className="mb-5 h-12 w-12 rounded-lg flex items-center justify-center 
                    bg-gradient-to-br from-zinc-800 to-zinc-900 
                    group-hover:from-zinc-800/80 group-hover:to-zinc-700/80
                    shadow-md shadow-black/20 transition-all duration-300
                    group-hover:shadow-lg group-hover:shadow-black/30"
        >
          {icon}
        </div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-white group-hover:text-zinc-200 transition-colors">{title}</h3>
          {status !== 'completed' && (
            <span
              className={cn(
                'text-xs px-2 py-1 rounded-full',
                status === 'upcoming'
                  ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50'
                  : 'bg-amber-900/30 text-amber-400 border border-amber-800/50',
              )}
            >
              {status === 'upcoming' ? 'Coming Soon' : 'In Progress'}
            </span>
          )}
        </div>
        <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors leading-relaxed">{description}</p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-zinc-800/10 to-transparent rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default FeatureCard;
