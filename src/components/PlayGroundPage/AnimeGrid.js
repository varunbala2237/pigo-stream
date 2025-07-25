// AnimeGrid.js
import React, { useState, useEffect, useRef } from 'react';
import CastCard from './CastCard';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';
import PlaySection from './Sections/PlaySection';
import ServerSection from './Sections/ServerSection';
import RelationPanel from './Panels/RelationPanel';
import EpisodePanel from './Panels/EpisodePanel';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const AnimeGrid = ({ id, type, activeTab, mediaInfo, animeInfo, setBackgroundImage }) => {
  const ANIME_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'AnimeGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [inHistory, setInHistory] = useState(false);
  const [cast, setCast] = useState([]);

  // Compute the initial index based on matching full date
  const initialRelationIndex = React.useMemo(() => {
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
  const [selectedRelationIndex, setSelectedRelationIndex] = useState(() =>
    getStorageValue(...ANIME_STORAGE_PATH, 'selectedRelationIndex') ?? initialRelationIndex
  );

  const selectedRelation = animeInfo[selectedRelationIndex];
  const animeId = selectedRelation?.id ?? null;

  const relationScrollRef = useRef(null);

  const episodeCount = (() => {
    if (selectedRelation?.episodes > 0) return selectedRelation.episodes;

    if (selectedRelationIndex === initialRelationIndex) {
      return mediaInfo?.number_of_episodes > 0 ? mediaInfo.number_of_episodes : 1;
    }

    return 1;
  })();

  const [selectedEpisode, setSelectedEpisode] = useState(() => {
    const state = getStorageValue(...ANIME_STORAGE_PATH, 'RELATION_STATE') || {};
    return state[selectedRelationIndex]?.selectedEpisode ?? 1;
  });

  const [page, setPage] = useState(() => {
    const state = getStorageValue(...ANIME_STORAGE_PATH, 'RELATION_STATE') || {};
    return state[selectedRelationIndex]?.pageState ?? 0;
  });

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...ANIME_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available servers
  const { servers, loading: loadingServers } = useFetchServers(animeId, 'anime', selectedRelationIndex, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, loading: isListLoading, refetch } = useCheckMyList(id);

  // Metadata for PlayerSection
  const title =
    selectedRelation?.title?.english ||
    selectedRelation?.title?.romaji ||
    selectedRelation?.title?.native;

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

  const handleServerChange = (server) => {
    setSelectedServer(server);
    setStorageValue(...ANIME_STORAGE_PATH, 'selectedServer', server);
  };

  // Handle onRelation change
  const handleRelationChange = (index) => {
    setSelectedRelationIndex(index);
    const state = getStorageValue(...ANIME_STORAGE_PATH, 'RELATION_STATE') || {};
    const savedEpisode = state[index]?.selectedEpisode ?? 1;
    setSelectedEpisode(savedEpisode);
    setStorageValue(...ANIME_STORAGE_PATH, 'selectedRelationIndex', index);
  };

  // Handle episode change
  const handleEpisodeChange = (episode) => {
    setSelectedEpisode(episode);
    const state = getStorageValue(...ANIME_STORAGE_PATH, 'RELATION_STATE') || {};
    const current = state[selectedRelationIndex] || {};
    state[selectedRelationIndex] = {
      ...current,
      selectedEpisode: episode,
      pageState: page
    };
    setStorageValue(...ANIME_STORAGE_PATH, 'RELATION_STATE', state);
  };

  const handleSeeMore = () => {
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
                    <b>Playing - {title} ({`A${selectedRelationIndex} - E${selectedEpisode}`})</b>
                  </span>
                </div>

                {/* Play Section */}
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

                {/* Relation Panel */}
                <RelationPanel
                  animeInfo={animeInfo}
                  selectedRelationIndex={selectedRelationIndex}
                  onRelationChange={handleRelationChange}
                  relationScrollRef={relationScrollRef}
                />

                {/* Episode Panel */}
                <EpisodePanel
                  episodeCount={episodeCount}
                  selectedEpisode={selectedEpisode}
                  onEpisodeChange={handleEpisodeChange}
                  selectedRelationPath={[...ANIME_STORAGE_PATH, 'selectedRelation', selectedRelationIndex]}
                  page={page}
                  setPage={setPage}
                />
              </>
            )}

          </div>
        </div>
      </div>
    </>
  );
}

export default AnimeGrid;