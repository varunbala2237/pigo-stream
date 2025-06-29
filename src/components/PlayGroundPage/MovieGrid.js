// MovieGrid.js
import React, { useState, useEffect } from 'react';
import CastCard from './CastCard';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';
import PlayerSection from './Sections/PlayerSection';
import ServerSection from './Sections/ServerSection';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function MovieGrid({ id, type, mediaInfo, setBackgroundImage }) {
  const MOVIES_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'MovieGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [cast, setCast] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...MOVIES_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available servers
  const { servers, loading: loadingServers } = useFetchServers(id, type);
  const depsReady = !loadingServers && selectedServer;

  const { addToList } = useSaveMyList();
  const { isInList, loading: isListLoading, refetch } = useCheckMyList(id);

  useEffect(() => {
    if (mediaInfo) {
      setCast(mediaInfo.credits?.cast || []);

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }

  }, [mediaInfo, id, type, setBackgroundImage]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!Array.isArray(servers) || servers.length === 0) {
      setSelectedServer(null);
      return;
    }

    const saved = getStorageValue(...MOVIES_STORAGE_PATH, 'selectedServer');
    const matched = saved && servers.find(s => s.server_name === saved.server_name);

    setSelectedServer(matched || servers[0]);
  }, [MOVIES_STORAGE_PATH, servers]);

  const handleServerChange = (server) => {
    setSelectedServer(server);
    setStorageValue(...MOVIES_STORAGE_PATH, 'selectedServer', server);
  };

  const handleViewMore = () => {
    setSliceIndex(prevSliceIndex => {
      const newIndex = prevSliceIndex + 12;
      setSessionValue(...MOVIES_STORAGE_PATH, 'sliceIndex', newIndex);
      return newIndex;
    });
  };

  const handleAddToList = async () => {
    try {
      if (!isInList) {
        await addToList(id, type);
        refetch();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center p-0">
        <div className="flex-row text-white w-100">
          <div className="container">
            {/* Info Section */}
            <InfoSection
              id={id}
              type={type}
              mediaInfo={mediaInfo}
              isInList={isInList}
              isListLoading={isListLoading}
              handleAddToList={handleAddToList}
            />

            {/* Player Section */}
            <PlayerSection
              depsReady={depsReady}
              selectedServer={selectedServer}
            />

            {/* Server Section */}
            {Array.isArray(servers) && servers.length > 0 && selectedServer && (
              <ServerSection
                servers={servers}
                selectedServer={selectedServer}
                handleServerChange={handleServerChange}
              />
            )}

            <div className="d-flex flex-column align-items-start custom-theme-radius-low my-2 w-100">
              <div className="container py-2 text-white">
                <div className="d-flex flex-row dynamic-ts">
                  <i className="bi bi-person-fill me-2"></i>
                  Cast
                </div>
                <div className="row justify-content-center">
                  {cast.length === 0 ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <CastCard key={index} isSkeleton={true} />
                    ))
                  ) : (
                    cast.slice(0, sliceIndex).map((actor, index) => (
                      <CastCard key={actor.cast_id ?? `${actor.name}-${index}`} actor={actor} />
                    ))
                  )}
                </div>
                {cast.length > sliceIndex && (
                  <div className="d-flex justify-content-end align-items-center">
                    <button
                      className="btn bg-transparent d-flex dynamic-fs border-0 rounded-pill text-white"
                      onClick={handleViewMore}
                    >
                      <i className="bi bi-arrow-right me-2"></i>
                      View More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieGrid;