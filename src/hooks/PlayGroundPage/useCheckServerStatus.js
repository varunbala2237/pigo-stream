// useCheckServerStatus.js
import { useState, useEffect } from 'react';

// Fast CORS-tolerant fetch with timeout
const fetchWithTimeout = (url, timeout = 3000) => {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), timeout);

    fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
    })
      .then(() => {
        clearTimeout(timer);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(false);
      });
  });
};

const useCheckServerStatus = (servers) => {
  const [serverStatus, setServerStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      setLoading(true);

      const statusPromises = servers.map(server =>
        fetchWithTimeout(server.server_link)
      );

      const results = await Promise.all(statusPromises);
      setServerStatus(results);
      setLoading(false);
    };

    if (servers.length > 0) {
      checkServerStatus();
    }
  }, [servers]);

  return { serverStatus, loading };
};

export default useCheckServerStatus;