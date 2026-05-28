import type { FC } from 'react';

interface AppBadgeProps {
  label: string;
}

export const AppBadge: FC<AppBadgeProps> = ({ label }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
    {label}
  </span>
);

