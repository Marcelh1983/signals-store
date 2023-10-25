// import { Signal, computed } from '@preact/signals-react';
import { StateModel, initialState } from './store';
import { Store } from 'signals-store';
import { createContext, useContext } from 'react';
import type { DeepSignal } from 'deepsignal';
import { computed } from '@preact/signals-react';
export type AppContext = {
  state: DeepSignal<StateModel>;
  store: Store<StateModel>;
};

const store = new Store<StateModel>({ ...initialState });
const signalState = computed(() => store.signal);

export const AppContext = createContext<AppContext>({
  store,
  state: signalState.value,
});
export const useAppContext = () => useContext(AppContext);
