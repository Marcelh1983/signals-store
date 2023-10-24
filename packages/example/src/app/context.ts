import { Signal, computed } from '@preact/signals-react';
import { StateModel, initialState } from './store';
import { Store } from 'signals-store';
import { createContext, useContext } from 'react';

export type AppContext = {
  signalState: Signal<StateModel>;
  store: Store<StateModel>;
};

const store = new Store<StateModel>(initialState);
const state = store.signal;
const signalState = computed(() => state.value);

export const AppContext = createContext<AppContext>({
  store,
  signalState,
});
export const useAppContext = () => useContext(AppContext);
