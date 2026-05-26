import type { StateCreator } from 'zustand';
import type { StoreState } from '../index';
import type { Task, Column } from '../../types/board.types';

export interface BoardState {
  board: {
    tasks: Task[];
    columns: Column[];
    loading: boolean;
    error: string | null;
    addTask: (task: Task) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    moveTask: (taskId: string, newStatus: Task['status']) => void;
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
    tasks: [],
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

    moveTask: (taskId: string, newStatus: Task['status']) =>
      set((state) => ({
        board: {
          ...state.board,
          tasks: state.board.tasks.map((task) =>
            task.id === taskId
              ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
              : task
          ),
        },
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
