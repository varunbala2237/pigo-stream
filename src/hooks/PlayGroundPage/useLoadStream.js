// useLoadStream.js
import { useEffect } from 'react';
import Hls from 'hls.js';

const useLoadStream = ({ videoRef, stream, depsReady }) => {
  useEffect(() => {
    if (!depsReady || !stream?.stream_link || !videoRef?.current) return;

    const { stream_link, stream_headers } = stream;
    const referer = stream_headers?.Referer || '';
    const userAgent = stream_headers?.['User-Agent'] || '';

    let hls;

    const loadStream = () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          xhrSetup: (xhr) => {
            const originalOpen = xhr.open;

            xhr.open = function (method, url, async, user, password) {
              const proxyUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/pigo-stream/sources/proxy-stream`);
              proxyUrl.searchParams.append('url', url);
              proxyUrl.searchParams.append('referer', referer);
              proxyUrl.searchParams.append('userAgent', userAgent);

              return originalOpen.call(this, method, proxyUrl.href, async, user, password);
            };
          }
        });

        hls.loadSource(stream_link);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS fallback (rare)
        videoRef.current.src = stream_link;
        videoRef.current.load();
      } else {
        console.error('HLS is not supported in this browser.');
      }
    };

    loadStream();

    return () => {
      if (hls) hls.destroy();
    };
  }, [depsReady, stream, videoRef]);
};

export default useLoadStream;