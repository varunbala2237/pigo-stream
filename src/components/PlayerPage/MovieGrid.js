import React, { useState, useEffect } from 'react';
import CastCard from '../CastCard';
import useFetchMediaInfo from '../../hooks/PlayerPage/useFetchMediaInfo';
import useFetchStream from '../../hooks/PlayerPage/useFetchStream';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import useCheckServerStatus from '../../hooks/PlayerPage/useCheckServerStatus';
import Player from './Player';
import MediaGridSkeleton from './MediaGridSkeleton';

import { getStorageValue, setStorageValue } from '../../utils/localStorageStates';

function MovieGrid({ id, type, setBackgroundImage }) {
  const MOVIE_SESSION_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'MovieGrid', `${id}`],
    [id]
  );

  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [selectedServerName, setSelectedServerName] = useState('');

  const [sliceIndex, setSliceIndex] = useState(12); // Initial slice index

  const { data: mediaInfo, loadingInfo, errorInfo } = useFetchMediaInfo(id, type);
  const { servers, loading: loadingLink, error: errorLink } = useFetchStream(id, type);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  // Using the custom hook for checking server status
  const { serverStatus, loading: serverStatusLoading } = useCheckServerStatus(servers);

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
    const savedSelectedServer = getStorageValue(...MOVIE_SESSION_PATH, 'selectedServer');
    // Ensure the first server is selected by default when the servers are loaded
    if (servers && servers.length > 0) {
      if (savedSelectedServer) {
        setSelectedServerName(savedSelectedServer);
      } else {
        // Set the default server to the first one in the list
        setSelectedServerName(servers[0].server_name);
      }
    }
  }, [MOVIE_SESSION_PATH, servers]);

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

  const handleServerChange = (serverName) => {
    setSelectedServerName(serverName);
    setStorageValue(...MOVIE_SESSION_PATH, 'selectedServer', serverName);
  };

  const handleShowMore = () => {
    setSliceIndex(prevSliceIndex => prevSliceIndex + 12);
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

  const { genres = [], vote_average } = mediaInfo ? mediaInfo : {};
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
              />

              <div className="container custom-bg custom-theme-radius w-100 p-2 my-2">
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

              <div className="d-flex flex-column align-items-start custom-theme-radius my-2 w-100">
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
                      cast.slice(0, sliceIndex).map(actor => (
                        <CastCard key={actor.cast_id} actor={actor} />
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

export default MovieGrid;