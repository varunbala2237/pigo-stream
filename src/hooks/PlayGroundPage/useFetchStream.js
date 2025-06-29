// useFetchStream.js
import { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useFetchStream = (selectedServer) => {
  const [stream_link, setStreamLink] = useState(null);
  const [headers, setHeaders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (
      !selectedServer ||
      !selectedServer.server_link ||
      !selectedServer.server_domain
    ) {
      setLoading(false);
      setError('Invalid selected server object');
      return;
    }

    const fetchStream = async () => {
      setLoading(true);
      setError(null);
      setStreamLink(null);
      setHeaders(null);

      try {
        const response = await fetch(
          `${BASE_URL}/pigo-stream/sources/fetch-stream` +
          `?server_link=${encodeURIComponent(selectedServer.server_link)}` +
          `&referer=${encodeURIComponent(selectedServer.server_domain)}`
        );

        const data = await response.json();

        if (response.ok && data?.stream_link) {
          setStreamLink(data.stream_link);
          setHeaders(data.headers || null);  // Contains referer and user-agent
        } else {
          throw new Error(data?.error || 'Failed to extract stream');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStream();
  }, [selectedServer]);

  return { stream_link, headers, loading, error };
};

export default useFetchStream;