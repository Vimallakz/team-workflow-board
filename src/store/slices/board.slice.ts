import type { StateCreator } from 'zustand';
import type { StoreState } from '../index';
import type {
  Task,
  Column,
  BoardSortField,
  SortDirection,
  TaskPriority,
} from '../../types/board.types';
import { MOCK_TASKS } from '../../utils/mockTasks';
import {
  groupByStatus,
  sortBy,
  TASK_STATUSES,
} from '../../utils/util';

export interface BoardState {
  board: {
    tasks: Task[];
    columns: Column[];
    sortField: BoardSortField;
    sortDirection: SortDirection;
    selectedPriorities: TaskPriority[];
    searchQuery: string;
    loading: boolean;
    error: string | null;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: Task['status'], position?: number) => void;
    setSort: (field: BoardSortField, direction: SortDirection) => void;
    setSelectedPriorities: (priorities: TaskPriority[]) => void;
    setSearchQuery: (query: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}

const defaultColumns: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

const DEFAULT_SORT_FIELD: BoardSortField = 'createdAt';
const DEFAULT_SORT_DIRECTION: SortDirection = 'asc';
const DEFAULT_SELECTED_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];

const applyTaskTransformations = (tasks: Task[], sortField: BoardSortField, sortDirection: SortDirection,): Task[] => {
  /**
   * 1. Sort the tasks by the sort field and direction
   * 2. Group the tasks by status
   * 3. Reindex the tasks by position
   * 4. Return the tasks
   */
  const sorted = sortBy(tasks, sortField, sortDirection);

  const grouped = groupByStatus(sorted, false);
  for (const status of TASK_STATUSES) {
    grouped[status].forEach((task, index) => {
      task.position = index;
    });
  }

  return TASK_STATUSES.flatMap((status) => grouped[status]);
};

export const createBoardSlice: StateCreator<
  StoreState,
  [],
  [],
  BoardState
> = (set) => ({
  board: {
    // Seed board with mock tasks for initial view
    tasks: applyTaskTransformations(MOCK_TASKS, DEFAULT_SORT_FIELD, DEFAULT_SORT_DIRECTION),
    columns: defaultColumns,
    sortField: DEFAULT_SORT_FIELD,
    sortDirection: DEFAULT_SORT_DIRECTION,
    selectedPriorities: DEFAULT_SELECTED_PRIORITIES,
    searchQuery: '',
    loading: false,
    error: null,

    addTask: (task: Task) =>
      set((state) => ({
        board: {
          ...state.board,
          tasks: [...state.board.tasks, task]
        },
      })),

    updateTask: (id: string, updates: Partial<Task>) =>
      set((state) => ({
        board: {
          ...state.board,
          tasks: state.board.tasks.map((task) =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
          ),
        },
      })),

    deleteTask: (id: string) =>
      set((state) => ({
        board: {
          ...state.board,
          tasks: state.board.tasks.filter((task) => task.id !== id),
        },
      })),

    moveTask: (taskId: string, newStatus: Task['status'], position?: number) =>
      set((state) => {
        /**
         * 1. Find the source task
         * 2. Get the columns grouped by status
         * 3. Get the target list
         * 4. Create the target task with the new status and updated timestamp
         * 5. Insert the target task into the target list at the specified position
         * 6. Get the affected statuses
         * 7. Update the positions of the affected tasks
         * 8. Return the new tasks state
         */
        const sourceTask = state.board.tasks.find((t) => t.id === taskId);
        if (!sourceTask) return state;

        const columns = groupByStatus(state.board.tasks.filter((task) => task.id !== taskId));

        const targetList = columns[newStatus];
        const targetTask = {
          ...sourceTask,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        }
        targetList.splice(position ?? 0, 0, targetTask);

        const affectedStatuses: Task['status'][] = sourceTask.status === newStatus ? [newStatus] : [newStatus, sourceTask.status];

        for (const status of affectedStatuses) {
          columns[status].forEach((task, index) => {
            task.position = index;
          });
        }

        const tasks = TASK_STATUSES.flatMap((status) => columns[status]);

        return { board: { ...state.board, tasks } };
      }),

    setSort: (sortField: BoardSortField, sortDirection: SortDirection) =>
      set((state) => {
        const tasks = applyTaskTransformations(state.board.tasks, sortField, sortDirection);

        return {
          board: { ...state.board, sortField, sortDirection, tasks: [...tasks] },
        };
      }),

    setSelectedPriorities: (selectedPriorities: TaskPriority[]) =>
      set((state) => ({
        board: { ...state.board, selectedPriorities },
      })),

    setSearchQuery: (searchQuery: string) =>
      set((state) => ({
        board: { ...state.board, searchQuery },
      })),

    setLoading: (loading: boolean) =>
      set((state) => ({
        board: { ...state.board, loading },
      })),

    setError: (error: string | null) =>
      set((state) => ({
        board: { ...state.board, error },
      })),
  },
});
