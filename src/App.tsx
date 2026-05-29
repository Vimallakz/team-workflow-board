import { useEffect } from 'react';
import { Board } from './components/Board';
import { TaskActions } from './components/TaskActions';
import { STORAGE_KEYS } from './constants/storageKeys';
import { useStore } from './store';
import { applyTaskTransformations } from './store/slices/board.slice';
import type { Task } from './types/board.types';
import { getLocalStorage, setLocalStorage } from './utils/localStorage';
import { MOCK_TASKS } from './utils/mockTasks';

function App() {
  useEffect(() => {
    const { sortField, sortDirection, setTasks } = useStore.getState().board;
    const stored = getLocalStorage<Task[]>(STORAGE_KEYS.tasks);
    const source = stored ?? MOCK_TASKS;
    const tasks = applyTaskTransformations(source, sortField, sortDirection);

    setTasks(tasks);

    return useStore.subscribe((state, prevState) => {
      if (state.board.tasks === prevState.board.tasks) return;
      setLocalStorage(STORAGE_KEYS.tasks, state.board.tasks);
    });
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-2">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Team Workflow Board</h1>
          <TaskActions />
        </div>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
        <Board />
      </main>
    </div>
  );
}

export default App;
