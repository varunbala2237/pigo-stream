// AnimeGrid.js
import React, { useState, useEffect, useRef } from 'react';
import CastCard from './CastCard';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';
import ServerSection from './Sections/ServerSection';
import ChainPanel from './Panels/ChainPanel';
import EpisodePanel from './Panels/EpisodePanel';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function AnimeGrid({ id, type, mediaInfo, animeInfo, setMediaURL, setBackgroundImage }) {
  const ANIME_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'AnimeGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [cast, setCast] = useState([]);

  // Compute the initial index based on matching full date
  const initialChainIndex = React.useMemo(() => {
    const mediaDateString = mediaInfo?.release_date || mediaInfo?.first_air_date;
    if (!mediaDateString || !Array.isArray(animeInfo)) return 0;

    const mediaDate = new Date(mediaDateString);
    mediaDate.setHours(0, 0, 0, 0);

    // 1. Exact match (year, month, day)
    let matchedIndex = animeInfo.findIndex(entry => {
      const { year, month, day } = entry?.startDate || {};
      if (!year || !month || !day) return false;

      const entryDate = new Date(year, month - 1, day);
      entryDate.setHours(0, 0, 0, 0);

      return entryDate.getTime() === mediaDate.getTime();
    });

    if (matchedIndex !== -1) return matchedIndex;

    // 2. Partial match (year, month only)
    matchedIndex = animeInfo.findIndex(entry => {
      const { year, month } = entry?.startDate || {};
      if (!year || !month) return false;

      return (
        year === mediaDate.getFullYear() &&
        month === mediaDate.getMonth() + 1
      );
    });

    if (matchedIndex !== -1) return matchedIndex;

    // 3. Closest future/past date
    let closestIndex = -1;
    let smallestDiff = Infinity;
    animeInfo.forEach((entry, index) => {
      const { year, month, day } = entry?.startDate || {};
      if (!year || !month || !day) return;

      const entryDate = new Date(year, month - 1, day);
      entryDate.setHours(0, 0, 0, 0);

      const diff = Math.abs(entryDate.getTime() - mediaDate.getTime());
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestIndex = index;
      }
    });

    return closestIndex !== -1 ? closestIndex : 0;
  }, [mediaInfo, animeInfo]);

  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChainIndex, setSelectedChainIndex] = useState(() =>
    getStorageValue(...ANIME_STORAGE_PATH, 'selectedChainIndex') ?? initialChainIndex
  );

  const selectedChain = animeInfo[selectedChainIndex];
  const animeId = selectedChain?.id ?? null;

  const chainScrollRef = useRef(null);

  const episodeCount = (selectedChain?.episodes > 0)
    ? selectedChain.episodes
    : (mediaInfo?.number_of_episodes > 0 ? mediaInfo.number_of_episodes : 1);

  const [selectedEpisode, setSelectedEpisode] = useState(() => {
    const fullState = getSessionValue(...ANIME_STORAGE_PATH, 'CHAIN_STATE') || {};
    return fullState[selectedChainIndex]?.selectedEpisode ?? 1;
  });

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...ANIME_STORAGE_PATH, 'sliceIndex') || 12
  );

  const { servers } = useFetchServers(animeId, 'anime', selectedChainIndex, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  // Season initial management
  useEffect(() => {
    if (mediaInfo) {
      setCast(mediaInfo.credits?.cast || []);

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }
  }, [mediaInfo, setBackgroundImage]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!Array.isArray(servers) || servers.length === 0) {
      setSelectedServer(null);
      return;
    }

    const saved = getStorageValue(...ANIME_STORAGE_PATH, 'selectedServer');
    const matched = saved && servers.find(s => s.server_name === saved.server_name);

    setSelectedServer(matched || servers[0]);
  }, [ANIME_STORAGE_PATH, servers]);

  // Retrieving selected server link
  useEffect(() => {
    if (!Array.isArray(servers) || servers.length === 0 || !selectedServer) return;

    const current = servers.find(s => s.server_name === selectedServer.server_name);
    if (current?.server_link) {
      setMediaURL(current.server_link);
    }
  }, [selectedServer, servers, setMediaURL]);

  const handleServerChange = (server) => {
    setSelectedServer(server);
    setStorageValue(...ANIME_STORAGE_PATH, 'selectedServer', server);
  };

  // Handle onChain change
  const onChainChange = (index) => {
    setSelectedChainIndex(index);

    const fullState = getSessionValue(...ANIME_STORAGE_PATH, 'CHAIN_STATE') || {};
    const savedEpisode = fullState[index]?.selectedEpisode ?? 1;
    setSelectedEpisode(savedEpisode);

    setStorageValue(...ANIME_STORAGE_PATH, 'selectedChainIndex', index);
  };

  // Handle episode change
  const handleEpisodeChange = (episode) => {
    setSelectedEpisode(episode);
    const fullState = getSessionValue(...ANIME_STORAGE_PATH, 'CHAIN_STATE') || {};
    const current = fullState[selectedChainIndex] || {};
    fullState[selectedChainIndex] = {
      ...current,
      selectedEpisode: episode,
    };
    setSessionValue(...ANIME_STORAGE_PATH, 'CHAIN_STATE', fullState);
  };

  const handleViewMore = () => {
    setSliceIndex(prevSliceIndex => {
      const newIndex = prevSliceIndex + 12;
      setSessionValue(...ANIME_STORAGE_PATH, 'sliceIndex', newIndex);
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
            <InfoSection
              id={id}
              type={type}
              mediaInfo={mediaInfo}
              isInList={isInList}
              handleAddToList={handleAddToList}
            />

            {/* Server Section */}
            {Array.isArray(servers) && servers.length > 0 && selectedServer && (
              <ServerSection
                servers={servers}
                selectedServer={selectedServer}
                handleServerChange={handleServerChange}
              />
            )}

            {/* Chain Panel */}
            <ChainPanel
              animeInfo={animeInfo}
              selectedChainIndex={selectedChainIndex}
              onChainChange={onChainChange}
              chainScrollRef={chainScrollRef}
            />

            {/* Episode Panel */}
            <EpisodePanel
              episodeCount={episodeCount}
              selectedEpisode={selectedEpisode}
              onEpisodeChange={handleEpisodeChange}
              selectedChainPath={[...ANIME_STORAGE_PATH, 'selectedChain', selectedChainIndex]}
            />

            <div className="d-flex flex-column align-items-start custom-theme-radius-low my-2 w-100">
              <div className="container py-2 text-white">
                <div className="d-flex flex-row dynamic-ts">
                  <i className="bi bi-person-fill me-2"></i>
                  Cast
                </div>
                <div className="row justify-content-center">
                  {cast.length === 0 ? (
                    // Show 4 dummy skeletal cards when no cast is found
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

export default AnimeGrid;