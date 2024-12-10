import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CastCard from './CastCard';
import useFetchMediaInfo from '../hooks/useFetchMediaInfo';
import useFetchStream from '../hooks/useFetchStream';
import useSaveMyList from '../hooks/useSaveMyList';
import useCheckMyList from '../hooks/useCheckMyList';
import Player from './Player';
import Alert from '../Alert';

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
      <div className="col mt-5 mb-5 d-flex justify-content-center">
        <div className="spinner-border text-light spinner-size-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (errorInfo || errorLink) {
    return (
      <div className="col mt-5 mb-5">
        <p className="text-white text-center">Oops! Something went wrong.</p>
      </div>
    );
  }

  if (!mediaInfo) {
    return (
      <div className="col mt-5 mb-5 d-flex justify-content-center">
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
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium">
        <Header/>
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
                    handleAddToList={handleAddToList} />
            <div className="d-flex justify-content-end mt-2">
              <div className="dropdown">
                {/* Button for medium and large screens */}
                <button
                  className="btn btn-dark custom-bg btn-md rounded-pill d-none d-md-inline-block"
                  id="serverDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-chevron-down me-2"></i>
                  {selectedServerName ? selectedServerName : 'vidsrc.xyz'}
                </button>
                {/* Button for small screens */}
                <button
                  className="btn btn-dark custom-bg btn-sm rounded-pill d-md-none"
                  id="serverDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-chevron-down me-2"></i>
                  {selectedServerName ? selectedServerName : 'vidsrc.xyz'}
                </button>
                <ul className="dropdown-menu overflow-auto custom-dropdown bd-callout-dark p-0 custom-theme-radius">
                  {loadingLink ? (
                    <li className="dropdown-item text-white bg-transparent">
                      <div className="col d-flex justify-content-center">
                        <div className="spinner-border text-light spinner-size-1" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    </li>
                  ) : errorLink ? (
                    <li className="dropdown-item text-white bg-transparent">Oops! Something went wrong.</li>
                  ) : servers.length > 0 ? (
                    servers.map((server, index) => (
                      <React.Fragment key={server.server_name}>
                        <li>
                          <button
                            className="dropdown-item text-white bg-transparent text-wrap text-truncate"
                            onClick={() => handleServerChange(server.server_name)}
                          >
                            {server.server_name}
                          </button>
                        </li>
                        {index < servers.length - 1 && <li><hr className="dropdown-divider bg-secondary m-0" /></li>}
                      </React.Fragment>
                    ))
                  ) : (
                    <li className="dropdown-item text-white bg-transparent">No servers available.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start custom-bg custom-theme-radius mt-2 w-100">
              <div className="d-flex flex-row m-2 p-2">
                <i className="bi bi-person-fill me-1"></i>
                Cast
              </div>
            
              <div className="container text-white">
                <div className="row m-2">
                  {cast.length === 0 ? (
                    <p className="text-center text-white mb-5">No cast found.</p>
                  ) : (
                    cast.slice(0, sliceIndex).map(actor => (
                      <CastCard key={actor.cast_id} actor={actor} />
                    ))
                  )}
                </div>
                {cast.length > sliceIndex && (
                  <div className="text-end m-2 p-2">
                    {/* Button for medium and large screens */}
                    <button
                      className="btn btn-light text-black rounded-pill btn-md d-none d-md-inline-block"
                      onClick={handleShowMore}
                    >
                      <i className="bi bi-chevron-down me-2"></i>
                      Show More
                    </button>

                    {/* Button for small screens */}
                    <button
                      className="btn btn-light text-black rounded-pill btn-sm d-md-none"
                      onClick={handleShowMore}
                    >
                      <i className="bi bi-chevron-down me-2"></i>
                      Show More
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
        <Footer/>
        {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
      </div>
    </>
  );
}

export default MovieGrid;