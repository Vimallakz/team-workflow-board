import type { FC } from 'react';
import clsx from 'clsx';

interface AppAvatarProps {
  name: string;
  className?: string;
}

const COLOR_CLASSES = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-700',
  'bg-sky-100 text-sky-700',
  'bg-violet-100 text-violet-700',
];

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'NA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const getColorClass = (name: string): string => {
  const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return COLOR_CLASSES[hash % COLOR_CLASSES.length];
};

export const AppAvatar: FC<AppAvatarProps> = ({ name, className }) => (
  <span
    title={name}
    className={clsx(
      'inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold',
      getColorClass(name),
      className,
    )}
    aria-label={name}
  >
    {getInitials(name)}
  </span>
);

