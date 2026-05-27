import { useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { memo, type FC, type PropsWithChildren } from 'react';
import type { TaskStatus } from '../types/board.types';

interface BoardColumnProps extends PropsWithChildren {
  title: string;
  taskCount: number;
  status: TaskStatus;
  isHighlighted: boolean;
}

const BoardColumnComponent: FC<BoardColumnProps> = ({
  title,
  taskCount,
  status,
  isHighlighted,
  children,
}) => {
  const { setNodeRef } = useDroppable({
    id: status,
    data: { type: 'column', columnStatus: status },
  });

  return (
    <section
      ref={setNodeRef}
      className={clsx(
        'flex h-full min-h-[300px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl border bg-slate-50/60 transition-colors',
        isHighlighted ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200',
      )}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
        <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700">
          {taskCount}
        </span>
      </header>
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-3">
        {children}
      </div>
    </section>
  );
};

export const BoardColumn = memo(
  BoardColumnComponent,
  (prev, next) =>
    prev.title === next.title &&
    prev.taskCount === next.taskCount &&
    prev.status === next.status &&
    prev.isHighlighted === next.isHighlighted,
);
