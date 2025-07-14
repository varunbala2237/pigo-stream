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

const MovieGrid = ({ id, type, tab, mediaInfo, setBackgroundImage }) => {
  const MOVIES_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'MovieGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [inHistory, setInHistory] = useState(false);
  const [cast, setCast] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);

  const [activeTab, setActiveTab] = useState(tab || 'info');

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...MOVIES_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available servers
  const { servers, loading: loadingServers } = useFetchServers(id, type);

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

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
            <div className="d-flex justify-content-start align-items-center my-2">
              <button
                className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeTab === 'info' ? '' : 'opacity-50'}`}
                onClick={() => handleTabChange('info')}
              >
                <i className="bi bi bi-info-circle theme-color me-2"></i>
                <b>Info</b>
              </button>

              {/* Divider Line */}
              <div className="border-start border-secondary align-self-stretch"></div>

              <button
                className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeTab === 'player' ? '' : 'opacity-50'}`}
                onClick={() => handleTabChange('player')}
              >
                <i className="bi bi-play-circle theme-color me-2"></i>
                <b>Player</b>
              </button>
            </div>

            {activeTab === 'info' && (
              <InfoSection
                id={id}
                type={type}
                mediaInfo={mediaInfo}
                isInList={isInList}
                isListLoading={isListLoading}
                handleAddToList={handleAddToList}
              />
            )}

            {activeTab === 'player' && (
              <PlayerSection
                id={id}
                type={type}
                loadingServers={loadingServers}
                selectedServer={selectedServer}
                inHistory={inHistory}
                setInHistory={setInHistory}
              />
            )}

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
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieGrid;