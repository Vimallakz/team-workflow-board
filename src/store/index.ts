import { create } from 'zustand';
import { createCounterSlice, type CounterState } from './slices/counter.slice';
import { createBoardSlice, type BoardState } from './slices/board.slice';

// Combined store type — add new slice types here with &
export type StoreState = CounterState & BoardState;

// Single store with all slices combined
export const useStore = create<StoreState>()((...args) => ({
  ...createCounterSlice(...args),
  ...createBoardSlice(...args),
}));
