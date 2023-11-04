import { DataApi } from './data-api';
import { ActionType, StateContextType } from './types';
import { Store } from './store';
export class StateContext<T> implements StateContextType<T> {
  constructor(public storeRef: Store<T>) {}

  restoreState = async () => {
    if (this.storeRef.dataApi) {
      const restoredState = await this.storeRef.dataApi.getState();
      if (restoredState) {
        return this.setState(restoredState);
      }
    }
    return this.getState();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch<P>(action: ActionType<T, P>) {
    return action.execute(this as any) as Promise<T>; // trick compiler here
  }
  setDataApi = (dataApi: DataApi<T>) => {
    this.storeRef.dataApi = dataApi;
  };

  get dataApi() {
    return this.storeRef.dataApi;
  }

  getContext<T2>(name: string) {
    return this.storeRef.storeContext.get(name) as T2;
  }
  setStoreContext = (context: { name: string; dependency: unknown }[]) => {
    context.forEach((c) => {
      if (this.storeRef.storeContext.get(c.name)) {
        console.warn(
          `${c.name} is already added in the store context. Overriding current value`
        );
      }
      this.storeRef.storeContext.set(c.name, c.dependency);
    });
  };
  getState = () => {
    // create a new object with the same properties as the signal expect for the properties that start with $
    const state = {} as any;
    for (const key in this.storeRef.signal) {
      if (!key.startsWith('$')) {
        const value = this.storeRef.signal[key];
        // check if value is an object
        if (typeof value === 'object') {
          // if it is an object, then we need to clone it
          state[key] = { ...value };
        } else if (Array.isArray(value)) {
          // if it is an array, then we need to clone it
          state[key] = [...value];
        }
        state[key] = value;
      }
    }
    return state as T;
  };

  setState = (state: T) => {
    // loop through state and set each property
    for (const key in state) {
      (this.storeRef.signal as any)[key] = state[key];
    }
    return Promise.resolve(state);
  };
  patchState = (state: Partial<T>) => {
    for (const key in state) {
      (this.storeRef.signal as any)[key] = state[key];
    }
    return Promise.resolve(this.getState());
  };
}
