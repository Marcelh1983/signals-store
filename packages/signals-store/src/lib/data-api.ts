import { ActionType, StoreSyncOptions } from './types';

export interface DataApi<T> {
  syncOptions: StoreSyncOptions;

  getUserId: () => string;
  getState: () => Promise<T>;
  setState: (doc: T) => Promise<void>;
  storeAction<P>(action: ActionType<T, P>): void;
}
