// useLoadStream.js
import { useEffect } from 'react';
import Hls from 'hls.js';
import axios from 'axios';

const useLoadStream = ({ videoRef, stream, depsReady }) => {
  useEffect(() => {
    if (!depsReady || !stream?.stream_link || !videoRef?.current) return;

    const { stream_link, stream_headers } = stream;

    const referer = stream_headers?.Referer || '';
    const userAgent = stream_headers?.['User-Agent'] || '';

    let hls;

    const loadStream = async () => {
      if (Hls.isSupported()) {
        hls = new Hls({
          xhrSetup: (xhr, url) => {
            const originalOpen = xhr.open;
            xhr.open = function (method, _url, async, user, password) {
              const proxyUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/pigo-stream/sources/proxy-stream`);
              proxyUrl.searchParams.append('url', _url);
              proxyUrl.searchParams.append('referer', referer);
              proxyUrl.searchParams.append('userAgent', userAgent);
              return originalOpen.call(this, method, proxyUrl.href, async, user, password);
            };
          }
        });

        hls.loadSource(stream_link);
        hls.attachMedia(videoRef.current);
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        try {
          const proxyUrl = new URL(`${process.env.REACT_APP_SERVER_URL}/pigo-stream/sources/proxy-stream`);
          proxyUrl.searchParams.append('url', stream_link);
          proxyUrl.searchParams.append('referer', referer);
          proxyUrl.searchParams.append('userAgent', userAgent);

          const res = await axios.get(proxyUrl.href, { responseType: 'blob' });
          const blobUrl = URL.createObjectURL(res.data);
          videoRef.current.src = blobUrl;
          videoRef.current.load();
        } catch (err) {
          console.error('Fallback direct HLS load failed:', err.message);
        }
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