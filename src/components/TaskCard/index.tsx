import type { FC } from 'react';
import type { Task, TaskPriority } from '../../types/board.types';
import { AppAvatar } from '../AppAvatar';
import { AppBadge } from '../AppBadge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const PRIORITY_VARIANTS: Record<TaskPriority,'danger' | 'warning' | 'success'> = {
  high: 'danger',
  medium: 'warning',
  low: 'success',
};

export const TaskCard: FC<TaskCardProps> = ({ task, onClick }) => (
  <article
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(event) => {
      if (!onClick) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick();
      }
    }}
    className="rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
  >
    <header className="mb-1 flex items-start justify-between gap-2">
      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{task.title}</h3>
      <AppBadge
        label={task.priority}
        variant={PRIORITY_VARIANTS[task.priority]}
        shape="pill"
        className="text-[10px] font-semibold uppercase tracking-wide"
      />
    </header>

    <p className="mb-2 line-clamp-3 text-xs text-slate-600">{task.description}</p>

    {task.tags.length > 0 && (
      <div className="mb-2 flex flex-wrap gap-1">
        {task.tags.map((tag) => (
          <AppBadge key={tag} label={tag} shape="rounded" />
        ))}
      </div>
    )}

    <footer className="mt-1 flex items-center justify-end text-[11px] text-slate-500">
      <div className="flex items-center gap-2" title={task.assignee}>
        <AppAvatar name={task.assignee} />
      </div>
    </footer>
  </article>
);

