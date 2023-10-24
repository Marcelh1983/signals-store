import { ActionType } from './types';

export function IsNullOrUndefined(value: unknown) {
  return value === null || value === undefined;
}

export function getDevToolsDispatcher<T>(currentState: T) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__?.connect({});
  devTools?.init(currentState);

  return function (action: ActionType<T, unknown>, currentState: T) {
    devTools?.send(action.type, currentState);
  };
}
