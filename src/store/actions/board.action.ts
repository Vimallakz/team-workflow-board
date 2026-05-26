import { useStore } from '../index';

export const useBoardActions = () => ({
  addTask: useStore((state) => state.board.addTask),
  updateTask: useStore((state) => state.board.updateTask),
  deleteTask: useStore((state) => state.board.deleteTask),
  moveTask: useStore((state) => state.board.moveTask),
  setLoading: useStore((state) => state.board.setLoading),
  setError: useStore((state) => state.board.setError),
});
