import type { FC } from 'react';

interface TagBadgeProps {
  label: string;
}

export const TagBadge: FC<TagBadgeProps> = ({ label }) => (
  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
    {label}
  </span>
);

