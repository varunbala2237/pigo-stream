// TvGrid.js
import React, { useState, useEffect, useRef } from 'react';
import CastCard from '../CastCard';
import useFetchSeason from '../../hooks/PlayGroundPage/useFetchSeason';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import PlayerSection from './CommonSections/PlayerSection';
import ServerSection from './CommonSections/ServerSection';
import SeasonSection from './MediaSections/SeasonSection';
import EpisodeSection from './MediaSections/EpisodeSection';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';
import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SEASON_STATE_KEY = 'seasonState';
const SEASON_SCROLL_KEY = 'selectedSeasonScroll';

function TvGrid({ id, type, mediaInfo, setBackgroundImage }) {
  const TV_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'TvGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const seasonScrollRef = useRef(null);
  const episodeScrollRef = useRef(null);
  const [selectedServer, setSelectedServer] = useState('');

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...TV_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available seasons and servers
  const { seasonData } = useFetchSeason(id, selectedSeason);
  const { servers } = useFetchServers(id, type, selectedSeason, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  // Season initial management
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

  // Season scroll state initial management
  useEffect(() => {
    const savedSeasonScroll = getStorageValue(...TV_STORAGE_PATH, SEASON_SCROLL_KEY);
    if (seasonScrollRef.current && typeof savedSeasonScroll === 'number') {
      requestAnimationFrame(() => {
        seasonScrollRef.current.scrollTo({
          left: savedSeasonScroll,
          behavior: 'instant'
        });
      });
    }
  }, [TV_STORAGE_PATH]);

  // Episode initial management
  useEffect(() => {
    if (seasonData) {
      const episodes = seasonData.episodes || [];
      setEpisodes(episodes);

      const seasonState = getStorageValue(...TV_STORAGE_PATH, SEASON_STATE_KEY) || {};
      const currentSeasonState = seasonState[selectedSeason] || {};
      const savedEpisode = currentSeasonState.episode;
      const savedScroll = currentSeasonState.scroll;

      const fallbackEpisode = episodes[0]?.episode_number;
      const episodeToSet = episodes.find(ep => ep.episode_number === savedEpisode)
        ? savedEpisode
        : fallbackEpisode;

      if (episodeToSet) {
        setSelectedEpisode(episodeToSet);
      }

      const episodeRefNode = episodeScrollRef.current;
      requestAnimationFrame(() => {
        if (episodeRefNode) {
          episodeRefNode.scrollTo({
            left: typeof savedScroll === 'number' ? savedScroll : 0,
            behavior: 'instant'
          });
        }
      });
    }
  }, [seasonData, selectedSeason, TV_STORAGE_PATH]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSelectedServer = getStorageValue(...TV_STORAGE_PATH, 'selectedServer');

    if (servers && servers.length > 0) {
      if (
        savedSelectedServer &&
        servers.some(server => server.server_name === savedSelectedServer.server_name)
      ) {
        setSelectedServer(savedSelectedServer);
      } else {
        setSelectedServer(servers[0]);
      }
    }
  }, [TV_STORAGE_PATH, servers]);

  // Retrieving selected server link
  useEffect(() => {
    if (servers && servers.length > 0) {
      const server = selectedServer
        ? servers.find(server => server.server_name === selectedServer.server_name)
        : servers[0];
      if (server) {
        setMediaURL(server.server_link);
      }
    }
  }, [selectedServer, servers]);

  const handleSeasonChange = (seasonNumber) => {
    if (seasonScrollRef.current) {
      setStorageValue(
        ...TV_STORAGE_PATH,
        SEASON_SCROLL_KEY,
        seasonScrollRef.current.scrollLeft
      );
    }

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
      scroll: episodeRefNode.scrollLeft,
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

  const { genres, vote_average } = mediaInfo ? mediaInfo : {};
  const averageVote = vote_average ? vote_average.toFixed(1) : '0.0';

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center p-0">
        <div className="flex-row text-white w-100">
          <div className="container">
            <PlayerSection mediaURL={mediaURL}
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

            {/* Server Section */}
            <ServerSection
              servers={servers}
              selectedServer={selectedServer}
              handleServerChange={handleServerChange}
            />

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
              isEpisodeAired={isEpisodeAired}
              isEpisodeAiredToday={isEpisodeAiredToday}
              episodeScrollRef={episodeScrollRef}
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

export default TvGrid;