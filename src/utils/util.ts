import type {
  Task,
  TaskStatus,
  BoardSortField,
  SortDirection,
} from '../types/board.types';

export const TASK_STATUSES: TaskStatus[] = ['backlog', 'in-progress', 'done'];

export type GroupedTasks = Record<TaskStatus, Task[]>;

export const createEmptyTaskGroups = (): GroupedTasks => ({
  backlog: [],
  'in-progress': [],
  done: [],
});

export const groupByStatus = (tasks: Task[], sortByPosition: boolean = true): GroupedTasks => {
  const grouped = createEmptyTaskGroups();

  for (const task of tasks) {
    grouped[task.status].push(task);
  }
  if (sortByPosition) {
    for (const status of TASK_STATUSES) {
      grouped[status].sort((a, b) => a.position - b.position);
    }
  }

  return grouped;
};

const PRIORITY_RANK: Record<Task['priority'], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const sortBy = (tasks: Task[], sortField: BoardSortField, sortDirection: SortDirection): Task[] => {

  const direction = sortDirection === 'asc' ? 1 : -1;
  const cloned = [...tasks];

  cloned.sort((a, b) => {
    if (sortField === 'priority') {
      return (PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]) * direction;
    }

    const aTime = new Date(a[sortField]).getTime();
    const bTime = new Date(b[sortField]).getTime();
    return (aTime - bTime) * direction;
  });

  return cloned;
};
