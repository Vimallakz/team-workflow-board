import type { FC } from 'react';
import type { Task, TaskPriority } from '../../types/board.types';
import { AppBadge } from '../AppBadge';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700 border border-red-200',
  medium: 'bg-amber-100 text-amber-800 border border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
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
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRIORITY_CLASSES[task.priority]}`}
      >
        {task.priority}
      </span>
    </header>

    <p className="mb-2 line-clamp-3 text-xs text-slate-600">{task.description}</p>

    {task.tags.length > 0 && (
      <div className="mb-2 flex flex-wrap gap-1">
        {task.tags.map((tag) => (
          <AppBadge key={tag} label={tag} />
        ))}
      </div>
    )}

    <footer className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
      <span className="font-medium text-slate-700">{task.assignee}</span>
      <span>Pos {task.position}</span>
    </footer>
  </article>
);

