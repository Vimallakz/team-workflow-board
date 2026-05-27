import type { Task, TaskStatus } from '../types/board.types';

export const TASK_STATUSES: TaskStatus[] = ['backlog', 'in-progress', 'done'];

export type GroupedTasks = Record<TaskStatus, Task[]>;

export const createEmptyTaskGroups = (): GroupedTasks => ({
  backlog: [],
  'in-progress': [],
  done: [],
});

export const groupTasksByStatus = (tasks: Task[]): GroupedTasks => {
  const grouped = createEmptyTaskGroups();

  for (const task of tasks) {
    grouped[task.status].push(task);
  }

  for (const status of TASK_STATUSES) {
    grouped[status].sort((a, b) => a.position - b.position);
  }

  return grouped;
};
