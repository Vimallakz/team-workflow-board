import type { StateCreator } from 'zustand';
import type { StoreState } from '../index';
import type { Task, Column } from '../../types/board.types';
import { MOCK_TASKS } from '../../utils/mockTasks';
import { groupTasksByStatus, TASK_STATUSES } from '../../utils/util';

export interface BoardState {
  board: {
    tasks: Task[];
    columns: Column[];
    loading: boolean;
    error: string | null;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: Task['status'], position?: number) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
  };
}

const defaultColumns: Column[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const createBoardSlice: StateCreator<
  StoreState,
  [],
  [],
  BoardState
> = (set) => ({
  board: {
    // Seed board with mock tasks for initial view
    tasks: MOCK_TASKS,
    columns: defaultColumns,
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

        const columns = groupTasksByStatus(state.board.tasks.filter((task) => task.id !== taskId));

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
