import { useStore } from "./store";

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Team Workflow Board
        </h1>
      </header>
      <main className="p-6">
        <p className="text-gray-600">Board setup complete. Ready for development.</p>
      </main>
    </div>
  );
}

export default App;
