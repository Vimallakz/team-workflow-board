import type { StateCreator } from 'zustand';
import type { StoreState } from '../index';

export interface CounterState {
  counter: {
    count: number;
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    incrementBy: (amount: number) => void;
  };
}

export const createCounterSlice: StateCreator<
  StoreState,
  [],
  [],
  CounterState
> = (set) => ({
  counter: {
    count: 0,
    increment: () =>
      set((state) => ({
        counter: { ...state.counter, count: state.counter.count + 1 },
      })),
    decrement: () =>
      set((state) => ({
        counter: { ...state.counter, count: state.counter.count - 1 },
      })),
    reset: () =>
      set((state) => ({
        counter: { ...state.counter, count: 0 },
      })),
    incrementBy: (amount: number) =>
      set((state) => ({
        counter: { ...state.counter, count: state.counter.count + amount },
      })),
  },
});
