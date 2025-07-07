// TvGrid.js
import React, { useState, useEffect, useRef } from 'react';
import CastCard from './CastCard';
import useFetchSeason from '../../hooks/PlayGroundPage/useFetchSeason';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';
import PlayerSection from './Sections/PlayerSection';
import ServerSection from './Sections/ServerSection';
import SeasonSection from './Sections/SeasonSection';
import EpisodeSection from './Sections/EpisodeSection';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SELECTED_SEASON = 'selectedSeason';
const SEASON_STATE_KEY = 'seasonState';

function TvGrid({ id, type, mediaInfo, setBackgroundImage }) {
  const TV_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'TvGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [inHistory, setInHistory] = useState(false);
  const [cast, setCast] = useState([]);
  const [selectedServer, setSelectedServer] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const seasonScrollRef = useRef(null);
  const episodeScrollRef = useRef(null);

  const [activeTab, setActiveTab] = useState(() =>
    getSessionValue(...TV_STORAGE_PATH, 'activeTab') || 'info'
  );

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...TV_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available seasons and servers
  const { seasonData } = useFetchSeason(
    id && selectedSeason !== null ? id : null,
    selectedSeason !== null ? selectedSeason : null
  );

  // Fetch all available servers
  const { servers, loading: loadingServers } = useFetchServers(id, type, selectedSeason, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, loading: isListLoading, refetch } = useCheckMyList(id);

  // Season initial management
  useEffect(() => {
    if (mediaInfo) {
      setSeasons(mediaInfo.seasons || []);
      setCast(mediaInfo.credits?.cast || []);

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }
  }, [mediaInfo, setBackgroundImage]);

  // Season initial management
  useEffect(() => {
    const savedSelectedSeason = getStorageValue(...TV_STORAGE_PATH, SELECTED_SEASON);

    const seasonToSet =
      mediaInfo?.seasons.find(season => season.season_number === savedSelectedSeason)?.season_number ??
      mediaInfo?.seasons.find(season => season.season_number === 1)?.season_number ??
      mediaInfo?.seasons[0]?.season_number;

    setSelectedSeason(seasonToSet);
  }, [mediaInfo.seasons, TV_STORAGE_PATH]);

  // Episode initial management
  useEffect(() => {
    if (seasonData) {
      const episodes = seasonData.episodes || [];
      setEpisodes(episodes);

      const seasonState = getStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY) || {};
      const currentSeasonState = seasonState[selectedSeason] || {};
      const savedEpisode = currentSeasonState.episode;

      const episodeToSet =
        episodes.find(ep => ep.episode_number === savedEpisode)?.episode_number ??
        episodes[0]?.episode_number;

      setSelectedEpisode(episodeToSet);
    }
  }, [seasonData, selectedSeason, TV_STORAGE_PATH]);

  // Load from localStorage on mount
  useEffect(() => {
    if (!Array.isArray(servers) || servers.length === 0) {
      setSelectedServer(null);
      return;
    }

    const saved = getStorageValue(...TV_STORAGE_PATH, 'selectedServer');
    const matched = saved && servers.find(s => s.server_name === saved.server_name);

    setSelectedServer(matched || servers[0]);
  }, [TV_STORAGE_PATH, servers]);

  const handleSeasonChange = (seasonNumber) => {
    const seasonRefNode = seasonScrollRef.current;
    if (!seasonRefNode) return;
    setSelectedSeason(seasonNumber);

    setStorageValue(...TV_STORAGE_PATH, SELECTED_SEASON, seasonNumber);

    // Try to load saved episode and scroll position
    const seasonState = getStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY) || {};
    const seasonInfo = seasonState[seasonNumber];

    if (seasonInfo?.episode) {
      setSelectedEpisode(seasonInfo.episode);
    }

    // Scroll restoration could be done in another effect if needed
  };

  const handleEpisodeChange = (episodeNumber) => {
    const episodeRefNode = episodeScrollRef.current;
    if (!episodeRefNode) return;
    setSelectedEpisode(episodeNumber);

    const seasonState = getStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY) || {};
    seasonState[selectedSeason] = {
      ...(seasonState[selectedSeason] || {}),
      episode: episodeNumber,
    };
    setStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY, seasonState);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSessionValue(...TV_STORAGE_PATH, 'activeTab', tab);
  };

  const handleServerChange = (server) => {
    setSelectedServer(server);
    setStorageValue(...TV_STORAGE_PATH, 'selectedServer', server);
  };

  const handleViewMore = () => {
    setSliceIndex(prevSliceIndex => {
      const newIndex = prevSliceIndex + 12;
      setSessionValue(...TV_STORAGE_PATH, 'sliceIndex', newIndex);
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
                <i className="bi bi-list theme-color me-2"></i>
                <b>Info</b>
              </button>

              {/* Divider Line */}
              <div className="border-start border-secondary align-self-stretch"></div>

              <button
                className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeTab === 'player' ? '' : 'opacity-50'}`}
                onClick={() => handleTabChange('player')}
              >
                <i className="bi bi-file-earmark-play theme-color me-2"></i>
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

            {/* Seasons Section */}
            <SeasonSection
              seasons={seasons}
              selectedSeason={selectedSeason}
              onSeasonChange={handleSeasonChange}
              seasonScrollRef={seasonScrollRef}
            />

            {/* Episodes Section */}
            <EpisodeSection
              episodes={episodes}
              selectedEpisode={selectedEpisode}
              onEpisodeChange={handleEpisodeChange}
              episodeScrollRef={episodeScrollRef}
            />

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

export default TvGrid;