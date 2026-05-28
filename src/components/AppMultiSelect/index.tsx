import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';

export interface AppMultiSelectOption {
  value: string;
  label: string;
}

interface AppMultiSelectProps {
  values: string[];
  options: AppMultiSelectOption[];
  onChange: (values: string[]) => void;
  className?: string;
  buttonWidthClassName?: string;
  buttonHeightClassName?: string;
}

export const AppMultiSelect: FC<AppMultiSelectProps> = ({
  values,
  options,
  onChange,
  className = '',
  buttonWidthClassName = 'min-w-[170px]',
  buttonHeightClassName = 'h-8',
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedCount = values.length;
  const buttonLabel = useMemo(() => {
    if (selectedCount === options.length) return `${selectedCount} selected`;
    if (selectedCount === 0) return '0 selected';
    return `${selectedCount} selected`;
  }, [options.length, selectedCount]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value));
      return;
    }
    onChange([...values, value]);
  };

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={clsx(
          'w-full rounded-lg border border-slate-300 bg-white px-3 pr-10 text-left text-sm text-slate-700 outline-none transition',
          'hover:border-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100',
          buttonWidthClassName,
          buttonHeightClassName,
        )}
      >
        <span className="block truncate">{buttonLabel}</span>
      </button>

      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={clsx('h-4 w-4 transition-transform', open && 'rotate-180')}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.51a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg"
        >
          {options.map((option) => {
            const isSelected = values.includes(option.value);
            return (
              <li key={option.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => toggleValue(option.value)}
                  className={clsx(
                    'flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors',
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-700 hover:bg-slate-100',
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.42 0l-3.2-3.2a1 1 0 111.42-1.42l2.49 2.49 6.49-6.49a1 1 0 011.42 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
