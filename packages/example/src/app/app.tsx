import React, { useEffect, useRef } from 'react';
import { Store } from 'signals-store';
import { ClearFilterAction, FilterAction, LoadAction, StateModel, initialState } from './store';
import { computed } from "@preact/signals-react";

export function App() {
  const store = useRef(new Store<StateModel>(initialState));
  const signalState = store.current.signal;
  const init = useRef(false);

  const computedState = computed(() => {
    return signalState.value;
  });

  useEffect(() => {
    const getData = async () => {
      init.current = true;
      await store.current.dispatch(new LoadAction());
    }
    if (!init.current) {
      getData();
    }
  }, []);

  const normal =
    'm-2 bg-transparent hover:bg-blue-500 text-bg-blue-500 hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded';
  const active =
    'm-2 cursor-default bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
  if (!store.current || !store.current.signal || !store.current.signal.value || store.current.signal.value.loading) {
    return <div>Loading..</div>
  }
  const state = computedState.value;
  return <div>
    <div className="flex">
      <button
        onClick={() => store.current?.dispatch(new FilterAction({ gender: 'female' }))}
        disabled={state.genderFilter === 'female'}
        className={state.genderFilter === 'female' ? active : normal}
      >
        Female
      </button>
      <button
        onClick={() => store.current?.dispatch(new FilterAction({ gender: 'male' }))}
        disabled={state.genderFilter === 'male'}
        className={state.genderFilter === 'male' ? active : normal}
      >
        Male
      </button>
      <button
        onClick={() => store.current?.dispatch(new FilterAction({ gender: 'other' }))}
        disabled={state.genderFilter === 'other'}
        className={state.genderFilter === 'other' ? active : normal}
      >
        Other
      </button>
      <button
        onClick={() => store.current?.dispatch(new ClearFilterAction())}
        disabled={!state.genderFilter}
        className={state.genderFilter === 'none' ? active : normal}
      >
        Unfiltered
      </button>
    </div>
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Gender
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.users.filter(state.filter).length === 0 ?? (
                  <div>No results</div>
                )}
                {state.users.filter(state.filter).map((user) => (
                  <tr key={user.email}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={user.picture.thumbnail}
                            alt=""
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name.first} {user.name.last}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.gender}{' '}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
}

export default App;
