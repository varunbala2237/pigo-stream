// useFetchStream.js
import { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useFetchStream = (selectedServer, depsReady = false) => {
  const [stream, setStream] = useState({ stream_link: null, stream_headers: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!depsReady) return;

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
      setStream({ stream_link: null, stream_headers: null });

      try {
        const response = await fetch(
          `${BASE_URL}/pigo-stream/sources/fetch-stream` +
          `?server_link=${encodeURIComponent(selectedServer.server_link)}` +
          `&referer=${encodeURIComponent(selectedServer.server_domain)}`
        );

        const data = await response.json();

        if (response.ok && data?.stream_link) {
          setStream({
            stream_link: data.stream_link,
            stream_headers: data.stream_headers || null,
          });
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
  }, [selectedServer, depsReady]);

  return { stream, loading, error };
};

export default useFetchStream;