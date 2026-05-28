import clsx from 'clsx';
import type { FC } from 'react';

interface AppInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AppInput: FC<AppInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
  className = '',
}) => (
  <input
    type="text"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    placeholder={placeholder}
    className={clsx(
      'h-8 w-full min-w-[220px] rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition',
      'placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
      className,
    )}
  />
);
