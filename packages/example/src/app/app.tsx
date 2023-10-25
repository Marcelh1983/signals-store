import React, { useContext, useEffect, useRef } from 'react';
import { ClearFilterAction, FilterAction, LoadAction } from './store';
import { AppContext } from './context';

export function App() {
  const { store, state: signalState } = useContext(AppContext);
  // const state = signalState.value;
  const init = useRef(false);

  useEffect(() => {
    const getData = async () => {
      init.current = true;
      await store.dispatch(new LoadAction());
    }
    if (!init.current) {
      store.subscribe(d => {
        console.log('subscribe', d);
      })
      getData();
    }
  }, [store]);

  const normal =
    'm-2 bg-transparent hover:bg-blue-500 text-bg-blue-500 hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded';
  const active =
    'm-2 cursor-default bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded';
  if (signalState.$loading.value) {
    return <div>Loading..</div>
  }

  return <div>
    <div className="flex">
      <button
        onClick={() => store.dispatch(new FilterAction({ gender: 'female' }))}
        disabled={signalState.$genderFilter.value === 'female'}
        className={signalState.$genderFilter.value === 'female' ? active : normal}
      >
        Female
      </button>
      <button
        onClick={() => store.dispatch(new FilterAction({ gender: 'male' }))}
        disabled={signalState.$genderFilter.value === 'male'}
        className={signalState.$genderFilter.value === 'male' ? active : normal}
      >
        Male
      </button>
      <button
        onClick={() => store.dispatch(new FilterAction({ gender: 'other' }))}
        disabled={signalState.$genderFilter.value === 'other'}
        className={signalState.$genderFilter.value === 'other' ? active : normal}
      >
        Other
      </button>
      <button
        onClick={() => store.dispatch(new ClearFilterAction())}
        disabled={!signalState.$genderFilter.value}
        className={signalState.$genderFilter.value === 'none' ? active : normal}
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
                {signalState.$users?.value.filter(signalState.filter).length === 0 ?? (
                  <div>No results</div>
                )}
                {signalState.$users?.value.filter(signalState.filter).map((user) => (
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
