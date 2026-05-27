import type { StateCreator } from 'zustand';
import type { StoreState } from '../index';
import type { Task, Column } from '../../types/board.types';
import { MOCK_TASKS } from '../../utils/mockTasks';

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
        const resolvedPosition = position ?? 0;
        const now = new Date().toISOString();

        const tasks = state.board.tasks.map((task) => {
          /**
           * Find the task with the given id and update its status and position
           */
          if (task.id === taskId) {
            return { ...task, status: newStatus, position: resolvedPosition, updatedAt: now };
          }
          /**
           * If the task is in the new status and its position is greater than or equal to the resolved position,
           * increment the position by 1
           * If task position is updated, then prev position will be shifted to the right
           */
          if (task.status === newStatus && task.position >= resolvedPosition) {
            return { ...task, position: task.position + 1 };
          }
          return task;
        });

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
