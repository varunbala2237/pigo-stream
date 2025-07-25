// MovieGrid.js
import React, { useState, useEffect } from 'react';
import CastCard from './CastCard';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';
import PlaySection from './Sections/PlaySection';
import ServerSection from './Sections/ServerSection';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const MovieGrid = ({ id, type, activeTab, mediaInfo, setBackgroundImage }) => {
  const MOVIES_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'MovieGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [inHistory, setInHistory] = useState(false);
  const [cast, setCast] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...MOVIES_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available servers
  const { servers, loading: loadingServers } = useFetchServers(id, type);

  const { addToList } = useSaveMyList();
  const { isInList, loading: isListLoading, refetch } = useCheckMyList(id);

  // Metadata for PlayerSection
  const title = mediaInfo?.title || mediaInfo?.name;

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

  const handleSeeMore = () => {
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
            {activeTab === 'info' && (
              <>
                <div className="d-flex justify-content-start align-items-center mb-4">
                  <span className="dynamic-hs">
                    <i className="bi bi-info-circle theme-color me-2"></i>
                    <b>Info</b>
                  </span>
                </div>

                {/* Info Section */}
                <InfoSection
                  id={id}
                  type={type}
                  mediaInfo={mediaInfo}
                  isInList={isInList}
                  isListLoading={isListLoading}
                  handleAddToList={handleAddToList}
                />

                {/* Cast */}
                <div className="d-flex flex-column align-items-start custom-theme-radius-low my-2 w-100">
                  <div className="container py-2 text-white">
                    <div className="d-flex flex-row border-start border-4 theme-border-color dynamic-ts ps-2">
                      <b>Cast</b>
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
                          className="btn btn-dark bd-callout-dark d-flex dynamic-fs border-0 rounded-pill text-white"
                          onClick={handleSeeMore}
                        >
                          <i className="bi bi-caret-down-fill me-2"></i>
                          See More
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'play' && (
              <>
                <div className="d-flex justify-content-start align-items-center mb-4">
                  <span className="dynamic-hs">
                    <i className="bi bi-play-circle theme-color me-2"></i>
                    <b>Playing - {title}</b>
                  </span>
                </div>

                {/* Player Section */}
                <PlaySection
                  id={id}
                  type={type}
                  loadingServers={loadingServers}
                  selectedServer={selectedServer}
                  inHistory={inHistory}
                  setInHistory={setInHistory}
                />

                {/* Server Section */}
                {Array.isArray(servers) && servers.length > 0 && selectedServer && (
                  <ServerSection
                    servers={servers}
                    selectedServer={selectedServer}
                    handleServerChange={handleServerChange}
                  />
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default MovieGrid;