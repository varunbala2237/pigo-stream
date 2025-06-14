// MovieGrid.js
import React, { useState, useEffect } from 'react';
import CastCard from '../CastCard';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
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
  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [selectedServer, setSelectedServer] = useState('');

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...MOVIES_STORAGE_PATH, 'sliceIndex') || 12
  );

  // Fetch all available servers
  const { servers  } = useFetchServers(id, type);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  useEffect(() => {
    if (mediaInfo) {
      setCast(mediaInfo.credits?.cast || []);
      const director = mediaInfo.credits?.crew?.find(crewMember => crewMember.job === 'Director');
      setDirector(director ? director.name : 'Unknown');

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }

  }, [mediaInfo, id, type, setBackgroundImage]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSelectedServer = getStorageValue(...MOVIES_STORAGE_PATH, 'selectedServer');

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
  }, [MOVIES_STORAGE_PATH, servers, mediaInfo, type]);

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

  const { genres = [], vote_average } = mediaInfo ? mediaInfo : {};
  const averageVote = vote_average ? vote_average.toFixed(1) : '0.0';

  return (
    <>
      <div className="flex-row text-white custom-w-size-100">
        <div className="row justify-content-center position-relative">
          <div className="col-lg-8 col-md-10 col-sm-12">
            <div className="container bg-transparent">
              <PlayerSection mediaURL={mediaURL}
                averageVote={averageVote}
                director={director}
                genres={genres}
                mediaInfo={mediaInfo}
                id={id}
                type={type}
                isInList={isInList}
                handleAddToList={handleAddToList}
              />

              {/* Server Section */}
              <ServerSection
                servers={servers}
                selectedServer={selectedServer}
                handleServerChange={handleServerChange}
              />

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
                    <div className="text-end">
                      <button
                        className="btn bg-transparent dynamic-fs border-0 rounded-pill text-white"
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
      </div>
    </>
  );
}

export default MovieGrid;