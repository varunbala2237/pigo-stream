// RootLayout.js
import { Outlet } from 'react-router-dom';
import { HistoryProvider } from '../context/HistoryContext';

export default function RootLayout() {
  return (
    <HistoryProvider>
      <Outlet />
    </HistoryProvider>
  );
}