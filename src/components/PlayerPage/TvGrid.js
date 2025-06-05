import React, { useState, useEffect, useRef } from 'react';
import CastCard from '../CastCard';
import EpisodeList from './EpisodeList';
import useFetchMediaInfo from '../../hooks/PlayerPage/useFetchMediaInfo';
import useFetchSeason from '../../hooks/PlayerPage/useFetchSeason';
import useFetchStream from '../../hooks/PlayerPage/useFetchStream';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import useCheckServerStatus from '../../hooks/PlayerPage/useCheckServerStatus';
import Player from './Player';
import MediaGridSkeleton from './MediaGridSkeleton';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SEASON_STATE_KEY = 'seasonState';

function TvGrid({ id, type, setBackgroundImage }) {
  const TV_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'TvGrid', `${id}`],
    [id]
  );

  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const episodeScrollRef = useRef(null);
  const [selectedServerName, setSelectedServerName] = useState('');

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...TV_STORAGE_PATH, 'sliceIndex') || 12
  );

  const { data: mediaInfo, loadingInfo, errorInfo } = useFetchMediaInfo(id, type);
  const { seasonData } = useFetchSeason(id, selectedSeason);
  const { servers, loading: loadingLink, error: errorLink } = useFetchStream(id, type, selectedSeason, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  // Using the custom hook for checking server status
  const { serverStatus, loading: serverStatusLoading } = useCheckServerStatus(servers);

  useEffect(() => {
    if (mediaInfo) {
      setSeasons(mediaInfo.seasons || []);
      setCast(mediaInfo.credits?.cast || []);
      const director = mediaInfo.credits?.crew?.find(
        crewMember => crewMember.job === 'Director'
      );
      setDirector(director ? director.name : 'Unknown');

      const savedSelectedSeason = getStorageValue(...TV_STORAGE_PATH, 'selectedSeason');

      if (mediaInfo.seasons && mediaInfo.seasons.length > 0) {
        if (savedSelectedSeason) {
          setSelectedSeason(savedSelectedSeason);
        } else {
          const defaultSeasonNumber = mediaInfo.seasons[0]?.season_number || 1;
          setSelectedSeason(defaultSeasonNumber);
        }
      }

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }
  }, [mediaInfo, TV_STORAGE_PATH, setBackgroundImage]);

  useEffect(() => {
    if (seasonData) {
      const episodes = seasonData.episodes || [];
      setEpisodes(episodes);

      const seasonState = getStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY) || {};
      const currentSeasonState = seasonState[selectedSeason] || {};
      const savedEpisode = currentSeasonState.episode;

      const fallbackEpisode = episodes[0]?.episode_number;
      const episodeToSet = episodes.find(ep => ep.episode_number === savedEpisode)
        ? savedEpisode
        : fallbackEpisode;

      if (episodeToSet) {
        setSelectedEpisode(episodeToSet);
      }

      const episodeRefNode = episodeScrollRef.current;
      const savedScroll = currentSeasonState.scroll;

      requestAnimationFrame(() => {
        if (episodeRefNode) episodeRefNode.scrollTo({ top: savedScroll, behavior: 'instant' });
      });
    }
  }, [seasonData, selectedSeason, TV_STORAGE_PATH]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSelectedServer = getStorageValue(...TV_STORAGE_PATH, 'selectedServer');
    // Ensure the first server is selected by default when the servers are loaded
    if (servers && servers.length > 0) {
      if (savedSelectedServer) {
        setSelectedServerName(savedSelectedServer);
      } else {
        // Set the default server to the first one in the list
        setSelectedServerName(servers[0].server_name);
      }
    }
  }, [TV_STORAGE_PATH, servers]);

  // Retrieving selected server link
  useEffect(() => {
    if (servers && servers.length > 0) {
      const selectedServer = selectedServerName
        ? servers.find(server => server.server_name === selectedServerName)
        : servers[0];
      if (selectedServer) {
        setMediaURL(selectedServer.server_link);
      }
    }
  }, [selectedServerName, servers]);

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    setStorageValue(...TV_STORAGE_PATH, 'selectedSeason', seasonNumber);

    // Try to load saved episode and scroll position
    const seasonState = getStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY) || {};
    const seasonInfo = seasonState[seasonNumber];

    if (seasonInfo?.episode) {
      setSelectedEpisode(seasonInfo.episode);
    } else {
      setSelectedEpisode(undefined); // Will be handled in useEffect on seasonData
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
      scroll: episodeRefNode.scrollTop,
    };
    setStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY, seasonState);
  };

  // Check if the episode has aired
  function isEpisodeAired(airDateString) {
    if (!airDateString) return false;

    const airDate = new Date(airDateString);
    const today = new Date();

    // Normalize both dates to midnight to avoid timezone issues
    airDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return airDate <= today;
  }

  // Check if the episode aired today
  function isEpisodeAiredToday(airDateString) {
    if (!airDateString) return false;

    const airDate = new Date(airDateString);
    const today = new Date();

    // Normalize both dates to midnight
    airDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return airDate.getTime() === today.getTime(); // Check if dates match
  }

  const handleServerChange = (serverName) => {
    setSelectedServerName(serverName);
    setStorageValue(...TV_STORAGE_PATH, 'selectedServer', serverName);
  };

  const handleShowMore = () => {
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

  if (!mediaInfo) {
    return (
      <MediaGridSkeleton
        mediaInfo={mediaInfo}
        servers={servers}
        loadingInfo={loadingInfo}
        loadingLink={loadingLink}
        errorInfo={errorInfo}
        errorLink={errorLink}
      />
    );
  }

  const { genres, vote_average } = mediaInfo ? mediaInfo : {};
  const averageVote = vote_average ? vote_average.toFixed(1) : '0.0';

  return (
    <>
      <div className="flex-row text-white custom-w-size-100">
        <div className="row justify-content-center position-relative">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <div className="container bg-transparent">
              <Player mediaURL={mediaURL}
                averageVote={averageVote}
                director={director}
                genres={genres}
                mediaInfo={mediaInfo}
                id={id}
                type={type}
                isInList={isInList}
                handleAddToList={handleAddToList}
                selectedEpisode={selectedEpisode}
              />

              <div className="container-fluid custom-bg custom-theme-radius w-100 p-2 my-2">
                <div className="d-flex flex-row dynamic-ts py-2">
                  <i className="bi bi-hdd-network me-2"></i>
                  Servers
                </div>
                <div className="row g-2">
                  {servers.length > 0 ? (
                    servers.map((server, index) => (
                      <div key={server.server_name} className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                        <button
                          className={`btn w-100 d-flex flex-row align-items-center justify-content-center border-0 rounded-pill shadow-sm ${selectedServerName === server.server_name
                            ? 'btn-primary bd-callout-primary active'
                            : 'btn-primary bd-callout-dark'
                            }`}
                          onClick={() => handleServerChange(server.server_name)}
                        >
                          <span className="text-truncate dynamic-ss">{server.server_name}</span>
                          {!serverStatusLoading && !serverStatus[index] && (
                            <i className="bi bi-exclamation-triangle text-danger ms-2"></i>
                          )}
                        </button>
                      </div>

                    ))
                  ) : (
                    <div className="text-white">No servers available</div>
                  )}
                </div>
              </div>

              <div className="container-fluid custom-bg custom-theme-radius w-100 p-2 my-2">
                <div className="d-flex flex-row dynamic-ts py-2">
                  <i className="bi bi-collection-play me-2"></i>
                  Seasons & Episodes
                </div>

                {/* Season Buttons */}
                <div className="row g-2 mb-2">
                  {seasons.length > 0 ? (
                    seasons.map((season) => (
                      <div key={season.id} className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                        <button
                          className={`btn w-100 d-flex justify-content-center align-items-center border-0 rounded-pill shadow-sm ${selectedSeason === season.season_number
                            ? 'btn-primary bd-callout-primary active'
                            : 'btn-primary bd-callout-dark'
                            }`}
                          onClick={() => handleSeasonChange(season.season_number)}
                        >
                          <span className="text-truncate dynamic-ss">
                            {season.name === 'Specials' ? season.name : `S${season.season_number}`}
                          </span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-white">No seasons available</div>
                  )}
                </div>

                {/* Episodes Scrollable List */}
                <EpisodeList
                  episodes={episodes}
                  selectedEpisode={selectedEpisode}
                  onEpisodeChange={handleEpisodeChange}
                  isEpisodeAired={isEpisodeAired}
                  isEpisodeAiredToday={isEpisodeAiredToday}
                  episodeScrollRef={episodeScrollRef}
                />
              </div>

              <div className="d-flex flex-column align-items-start custom-theme-radius my-2 w-100">
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
                    <div className="text-end">
                      {/* Button for medium and large screens */}
                      <button
                        className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block"
                        onClick={handleShowMore}
                      >
                        <i className="bi bi-chevron-down text-white me-2"></i>
                        <span className="text-white">Show More</span>
                      </button>

                      {/* Button for small screens */}
                      <button
                        className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none"
                        onClick={handleShowMore}
                      >
                        <i className="bi bi-chevron-down text-white me-2"></i>
                        <span className="text-white">Show More</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TvGrid;