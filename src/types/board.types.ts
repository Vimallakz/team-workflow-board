export type TaskStatus = 'backlog' | 'in-progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';
export type SortDirection = 'asc' | 'desc';
export type BoardSortField = 'createdAt' | 'updatedAt' | 'priority';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: TaskStatus;
  title: string;
}
