import { useState, useEffect } from 'react';

// Helper function for fetch with retry and timeout
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 500) => {
  let attempt = 0;
  
  const fetchRequest = async () => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Unable to fetch data.');
      return true; // Return true if successful
    } catch (err) {
      if (attempt < retries) {
        attempt++;
        await new Promise(resolve => setTimeout(resolve, delay)); // Retry after delay
        return fetchRequest(); // Retry
      }
      return false; // Return false if all retries fail
    }
  };

  return fetchRequest();
};

// Custom hook for checking server status
const useCheckServerStatus = (servers) => {
  const [serverStatus, setServerStatus] = useState({});

  useEffect(() => {
    const checkServerStatus = async () => {
      const statusPromises = servers.map(server => 
        fetchWithRetry(server.server_link).then(isServerUp => ({
          server_name: server.server_name,
          status: isServerUp ? 'success' : 'danger'
        }))
      );

      // Wait for all the promises to resolve concurrently
      const results = await Promise.all(statusPromises);
      
      // Create an object from the results to set state
      const statusObj = results.reduce((acc, { server_name, status }) => {
        acc[server_name] = status;
        return acc;
      }, {});

      setServerStatus(statusObj);
    };

    if (servers.length > 0) {
      checkServerStatus();
    }
  }, [servers]); // Re-run the effect when servers change

  return serverStatus;
};

export default useCheckServerStatus;