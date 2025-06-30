// HistoryContext.js
import { createContext, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const location = useLocation();
  const prevPathRef = useRef(null);

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <HistoryContext.Provider value={prevPathRef.current}>
      {children}
    </HistoryContext.Provider>
  );
}

export function usePreviousRoute() {
  return useContext(HistoryContext);
}