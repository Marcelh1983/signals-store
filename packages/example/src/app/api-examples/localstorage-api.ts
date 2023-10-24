import { DataApi, StoreSyncOptions } from 'signals-store';

export class LocalStorageDataApi<T> implements DataApi<T> {
  constructor(public syncOptions: StoreSyncOptions, public initialState: T) {}

  getUserId = () => 'default_user';

  getState = async () => {
    const state = await this.getStateFromLocalStorage();
    return Promise.resolve(state);
  };

  setState = async (document: T) => {
    const state = await this.setStateFromLocalStorage(document);
    return Promise.resolve(state);
  };

  storeAction = async (action: unknown) => {
    const collectionName =
      this.syncOptions?.actions?.collectionName || 'actions';
    const userId = this.getUserId();
    let actions: unknown[] = [];
    try {
      const rawActions = localStorage.getItem(`${collectionName}_${userId}`);
      if (rawActions) {
        actions = JSON.parse(rawActions) as unknown[];
      }
    } catch {
      // ignore
    }
    if (!actions) actions = [];
    actions.push(action);
    localStorage.setItem(
      `${collectionName}_${userId}`,
      JSON.stringify(actions)
    );
    return Promise.resolve();
  };

  getStateFromLocalStorage = () => {
    const collectionName = this.syncOptions?.state?.collectionName || 'state';
    const userId = this.getUserId();
    const state = localStorage.getItem(`${collectionName}_${userId}`);
    try {
      if (state) {
        return JSON.parse(state) as T;
      }
    } catch {
      // ignore error
    }
    return this.initialState;
  };

  setStateFromLocalStorage = (doc: T) => {
    const collectionName = this.syncOptions?.state?.collectionName || 'state';
    const userId = this.getUserId();
    localStorage.setItem(`${collectionName}_${userId}`, JSON.stringify(doc));
  };
}
