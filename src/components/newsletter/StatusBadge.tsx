'use client';

import { cn } from '@/lib/utils';
import type { NewsletterStatus } from '@/types';

interface StatusConfig {
  label: string;
  className: string;
}

/** Semantische Farben für Status-Badges */
const statusConfig: Record<NewsletterStatus, StatusConfig> = {
  idle: {
    label: 'Entwurf',
    className: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
  },
  generating: {
    label: 'Generiert...',
    className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 animate-pulse',
  },
  done: {
    label: 'Fertig',
    className: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
  },
  error: {
    label: 'Fehler',
    className: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
  },
};

const fallbackConfig: StatusConfig = {
  label: 'Unbekannt',
  className: 'bg-gray-100 text-gray-700 border-gray-200',
};

interface StatusBadgeProps {
  status: NewsletterStatus | null | undefined;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const effectiveStatus = status || 'idle';
  const config = statusConfig[effectiveStatus] || fallbackConfig;

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
