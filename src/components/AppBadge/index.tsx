import type { FC } from 'react';
import clsx from 'clsx';

interface AppBadgeProps {
  label: string;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  shape?: 'pill' | 'rounded' | 'square' | 'none';
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<AppBadgeProps['variant']>, string> = {
  neutral:
    'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200/70',
  success:
    'border-emerald-200 bg-emerald-100 text-emerald-700 hover:bg-emerald-200/70',
  warning:
    'border-amber-200 bg-amber-100 text-amber-800 hover:bg-amber-200/70',
  danger: 'border-red-200 bg-red-100 text-red-700 hover:bg-red-200/70',
  info: 'border-indigo-200 bg-indigo-100 text-indigo-700 hover:bg-indigo-200/70',
};

const SHAPE_CLASSES: Record<NonNullable<AppBadgeProps['shape']>, string> = {
  pill: 'rounded-full',
  rounded: 'rounded-md',
  square: 'rounded-sm',
  none: 'rounded-none',
};

export const AppBadge: FC<AppBadgeProps> = ({
  label,
  variant = 'neutral',
  shape = 'pill',
  className,
}) => (
  <span
    className={clsx(
      'inline-flex items-center border px-2 py-0.5 text-xs font-medium transition-colors',
      VARIANT_CLASSES[variant],
      SHAPE_CLASSES[shape],
      className,
    )}
  >
    {label}
  </span>
);

