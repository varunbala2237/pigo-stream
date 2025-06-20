// App.js
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import AuthUI from './components/AuthPage/AuthUI';
import IndexUI from './components/IndexPage/IndexUI';
import PlayGroundUI from './components/PlayGroundPage/PlayGroundUI';
import WatchHistoryUI from './components/WatchHistoryPage/WatchHistoryUI';
import MyListUI from './components/MyListPage/MyListUI';
import PigoStoreUI from './components/PigoStorePage/PigoStoreUI';

const router = createBrowserRouter(
  [
    { path: '/', element: <AuthUI /> },
    { path: '/index', element: <IndexUI /> },
    { path: '/play', element: <PlayGroundUI /> },
    { path: '/watch-history', element: <WatchHistoryUI /> },
    { path: '/my-list', element: <MyListUI /> },
    { path: '/pigostore', element: <PigoStoreUI /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    },
  }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;