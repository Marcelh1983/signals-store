# signals-store
A simple store for state management using Signals. 
Can be used in all frameworks that support Signals
When providing a ```dataApi``` implentation you can automatically sync stata to for example firebase [(example)](https://github.com/Marcelh1983/signals-store/tree/main/packages/example/src/app/api-examples/firebase-api.ts) or localStorage [(example)](https://github.com/Marcelh1983/signals-store/tree/main/packages/example/src/app/api-examples/localstorage-api.ts).

Created to seperate state management from the UI components without a lot of boilerplate code.

## Examples

Here a [demo](https://signals-store.app/) and the [code](https://github.com/Marcelh1983/signals-store/tree/main/packages/example/src/app) 

### create
```typescript
// creates a new store
const store = new Store<ActivityStateModel>(initialState, !environment.production);
```
In reactJs you can add the store in a ```useRef``` if you use the store in a single component or an ```useContext``` when using it is multiple components. The store can be mapped to the component state like this:

#### useContext

``` typescript
import { Signal, computed } from '@preact/signals-react';
import { StateModel, initialState } from './store';
import { Store } from 'signals-store';
import { createContext, useContext } from 'react';

export type AppContext = {
  signalState: Signal<StateModel>;
  store: Store<StateModel>;
};

const store = new Store<StateModel>(initialState);
const signalState = computed(() => store.signal.value);

export const AppContext = createContext<AppContext>({
  store,
  signalState,
});
export const useAppContext = () => useContext(AppContext);
```

In component: 

``` typescript
  const { store, signalState } = useContext(AppContext);
  const state = signalState.value;
```

#### useRef

```typescript
export function MyComponent() {
  const store = useRef(new Store<StateModel>(initialState));
  const signalState = store.current.signal;
  const computedState = computed(() => {
    return signalState.value;
  });
  const state = computedState.value;
```

### actions

Create an action that implements StoreAction<T, M>

```typescript
export class LoadAction implements StoreAction<StateModel, never> {
    type = "LOAD";
    async execute(ctx: StateContext<StateModel>): Promise<StateModel> {
        if (ctx.getState().users.length === 0) {
            ctx.patchState({ loading: true });
            const users = (await axios.get<ApiResponse>('https://randomuser.me/api/?results=20')).data.results;
            return ctx.patchState({ loading: false, users });
        }
    }
}
```
### API

Store:
- ```constructor: (initialState: T = The initial state, devTools: boolean (connect to redux devTools), dataApi?``` = 
- ```addCallback: (callback: (action: ActionType<T, unknown>, oldState: T, newState: T, context: Map<string, unknown>) => void) => void```  can be to add a callback function that captures all actions. For example to log all actions to the console or database.
- ```dispatch: (action: StoreAction<T, unknown>) => Promise<T>```: dispatches an action and return a promise with the new state
- ```currentState```: returns the current state.
- ```asObservable```: return an observable of T

ctx: StateContext<StateModel>
- ```getContext<T2>(name: string)```: gets the context that is added while creating the store. E.g. use to access History *
- ```dispatch: (action: StoreAction<T, unknown>) => Promise<T>```: dispatches an action and return a promise with the new state
- ```getState```: gets the current state.
- ```setState```: set the entire new state.
- ```patchState```: set only the changed properties of the state, these will be merged with the current state.
- ```dataApi```: the data api that is passed. Can be casted to the used implementation.
- ```storeAction``: default: true, if a specific action should not be logged it can be overridden by setting this property to false
- ```storeState``: default: true, if a specific action should not result in a stored state it can be overridden by setting this property to false

dataApi: Optionally you can pass a dataApi implementation to automatically store the state. Examples can be found [here](https://github.com/Marcelh1983/signals-store/tree/main/packages/example/src/app/api-examples).
-  ```syncOptions```
  - ```state```: state can be stored automatically:
    - ```sync: boolean```: indicates if the state has to be stored
    - ```collectionName```: name of the collection or table where the data will be stored. (default: state)
    - ```addUserId```: add a createdBy field in the state
    - ```excludedFields```: exclude fields from the state that you don't want to store in the database.
  - ```action```: all actions including payload can be stored too e.g. to analyse the use of your application.
    - ```sync```: indicates if actions should ben stored
    - ```collectionName```: name of the collection or table where the data will be stored. (default: actions)
    - ```addUserId```: add a createdBy field in the action
    - ```excludedFields```: exclude fields from the action payload that you don't want to store in the database.
- ```getUserId: () => string```: get the userId of the logged in user.
- ```getState: () => Promise<T>```: returns the stored state
- ```setState: (doc: T) => Promise<void>```: stores the state
- ```storeAction<P>(action: ActionType<T, P>): void```; stores an action

* To use getContext() you have to set the dependency somewhere where it is available:

```typescript
  setStoreContext([
    { name: 'history', dependency: useHistory() }
  ])
```

In the action you can use: 

```typescript
  const auth = ctx.getContext<History>('auth');
```