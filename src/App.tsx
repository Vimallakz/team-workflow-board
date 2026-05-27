import { useStore } from "./store";
import { Board } from './components/Board';

const globalStore = useStore.getState();
console.log('globalStore >>>>>>>', globalStore);

function App() {
  /*
   * This will be sample code to use zustand store and actions by calling action hooks
   *
   *   const { count } = useStore((state) => state.counter);
   *   const { increment, decrement, reset } = useCounterActions();
   */
  return (
    <div className="flex h-full flex-col overflow-hidden bg-gray-50">
      <header className="shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Team Workflow Board</h1>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-auto p-6">
        <Board />
      </main>
    </div>
  );
}

export default App;
