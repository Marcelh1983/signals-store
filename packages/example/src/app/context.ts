// import { Signal, computed } from '@preact/signals-react';
import { StateModel, initialState } from './store';
import { Store } from 'signals-store';
import { computed } from '@preact/signals-react';

export const store = new Store<StateModel>({ ...initialState });
export const $state = computed(() => store.signal).value;
