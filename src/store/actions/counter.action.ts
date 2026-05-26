import { useStore } from '../index';

export const useCounterActions = () => ({
    increment: useStore(state => state.counter.increment),
    decrement: useStore(state => state.counter.decrement),
    reset: useStore(state => state.counter.reset),
    incrementBy: useStore(state => state.counter.incrementBy),
});