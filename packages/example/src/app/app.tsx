import { Outlet, Route, Routes } from 'react-router-dom';
import UserPage from './pages/users';
import { $state, store } from './context';
import { useEffect, useRef } from 'react';
import { LoadAction } from './store';

export function App() {
  // const state = signalState.value;
  const init = useRef(false);

  useEffect(() => {
    const getData = async () => {
      init.current = true;
      await store.dispatch(new LoadAction());
    }
    if (!init.current) {
      getData();
    }
  }, []);
  if ($state.$loading.value) {
    return <div>Loading..</div>
  }

  return <div>
    <Routes>
      <Route
        path="/"
        element={
          <Outlet></Outlet>
        }
      >
        <Route path="/" element={<UserPage />} />
      </Route>
    </Routes>
  </div>
}

export default App;
