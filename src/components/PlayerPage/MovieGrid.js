import React, { useState, useEffect } from 'react';
import CastCard from '../CastCard';
import useFetchMediaInfo from '../../hooks/useFetchMediaInfo';
import useFetchStream from '../../hooks/useFetchStream';
import useSaveMyList from '../../hooks/useSaveMyList';
import useCheckMyList from '../../hooks/useCheckMyList';
import useCheckServerStatus from '../../hooks/useCheckServerStatus';
import Player from './PlayerUI';
import Alert from '../../Alert';

import { storeMediaStateSettings, getMediaStateSettings } from '../../utils/mediaStateSettings';

function MovieGrid({ id, type, setBackgroundImage }) {
  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [selectedServerName, setSelectedServerName] = useState('');

  const [sliceIndex, setSliceIndex] = useState(12); // Initial slice index

  const { data: mediaInfo, loadingInfo, errorInfo } = useFetchMediaInfo(id, type);
  const { servers, loading: loadingLink, error: errorLink } = useFetchStream(id, type);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  // Using the custom hook for checking server status
  const serverStatus = useCheckServerStatus(servers);

  // Retrieve settings from cache if available
  const cachedSettings = getMediaStateSettings(id);

  useEffect(() => {
    if (mediaInfo) {
      setCast(mediaInfo.credits?.cast || []);
      const director = mediaInfo.credits?.crew?.find(crewMember => crewMember.job === 'Director');
      setDirector(director ? director.name : 'Unknown');

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }

  }, [mediaInfo, id, type, setBackgroundImage]);

  useEffect(() => {
    // Ensure the first server is selected by default when the servers are loaded
    if (servers && servers.length > 0 && !selectedServerName) {
      if (cachedSettings) {
        setSelectedServerName(cachedSettings.selectedServerName);
      } else {
        // Set the default server to the first one in the list
        setSelectedServerName(servers[0].server_name);
      }
    }
  }, [servers, selectedServerName, cachedSettings]);

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
    storeMediaStateSettings(id, { selectedServerName: serverName });
  };

  const handleShowMore = () => {
    setSliceIndex(prevSliceIndex => prevSliceIndex + 12); // Increase slice index by 12
  };

  const handleAddToList = async () => {
    try {
      if (isInList) {
        setAlertMessage('Already exists in My List.');
        setAlertType('primary');
        setTimeout(() => setAlertMessage(''), 5000);
      } else {
        await addToList(id, type);
        refetch();
        setAlertMessage('Successfully added to My List.');
        setAlertType('success');
        setTimeout(() => setAlertMessage(''), 5000);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAlertDismiss = () => {
    setAlertMessage('');
  };

  if (loadingInfo || loadingLink) {
    return (
      <div className="col vh-70 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light spinner-size-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorInfo || errorLink) {
    return (
      <div className="col vh-70 d-flex justify-content-center align-items-center">
        <div className="d-flex text-white align-items-center dynamic-fs">
          <i className="bi bi-wifi-off me-2"></i>
          <span className="mb-0">Something went wrong.</span>
        </div>
      </div>
    );
  }

  if (!mediaInfo) {
    return (
      <div className="col vh-70 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light spinner-size-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const { genres = [], vote_average } = mediaInfo;
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
                    servers.map((server) => (
                      <div key={server.server_name} className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                        <button
                          className={`btn w-100 d-flex flex-row align-items-center justify-content-center border-0 rounded-pill shadow-sm ${selectedServerName === server.server_name
                            ? 'btn-primary bd-callout-primary active'
                            : 'btn-primary bd-callout-dark'
                            }`}
                          onClick={() => handleServerChange(server.server_name)}
                        >
                          <span className="text-truncate dynamic-ss">{server.server_name}</span>
                          {serverStatus[server.server_name] === 'danger' && (
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
                      <div className="col d-flex vh-35 justify-content-center align-items-center">
                        <div className="d-flex align-items-center dynamic-fs">
                          <i className="bi bi-database-slash me-2"></i>
                          <span className="mb-0">No cast found.</span>
                        </div>
                      </div>
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
      {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
    </>
  );
}

export default MovieGrid;