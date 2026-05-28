import clsx from 'clsx';
import { useEffect, type FC, type PropsWithChildren } from 'react';

interface IProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  widthClassName?: string;
  title?: string;
}

export const AppSideDrawer: FC<IProps> = ({
  open,
  onClose,
  side = 'right',
  widthClassName = 'w-[480px]',
  title = '',
  children,
}) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close drawer overlay"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onClose}
      />

      <aside
        className={clsx(
          'absolute top-0 h-screen bg-white shadow-2xl',
          widthClassName,
          side === 'right' ? 'right-0' : 'left-0',
        )}
      >
        <div className="flex h-full flex-col">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="rounded-full p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6l-12 12"
                />
              </svg>
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        </div>
      </aside>
    </div>
  );
};

