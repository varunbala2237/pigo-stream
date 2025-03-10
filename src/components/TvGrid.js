import React, { useState, useEffect } from 'react';
import CastCard from './CastCard';
import useFetchMediaInfo from '../hooks/useFetchMediaInfo';
import useFetchSeason from '../hooks/useFetchSeason';
import useFetchStream from '../hooks/useFetchStream';
import useSaveMyList from '../hooks/useSaveMyList';
import useCheckMyList from '../hooks/useCheckMyList';
import Player from './Player';
import Alert from '../Alert';

function TvGrid({ id, type, setBackgroundImage }) {
  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [seasons, setSeasons] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedServerName, setSelectedServerName] = useState('');

  const [sliceIndex, setSliceIndex] = useState(12); // Initial slice index

  const { data: mediaInfo, loadingInfo, errorInfo } = useFetchMediaInfo(id, type);
  const { seasonData, loading: loadingSeasonData, error: errorSeasonData } = useFetchSeason(id, selectedSeason);
  const { servers, loading: loadingLink, error: errorLink } = useFetchStream(id, type, selectedSeason, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  useEffect(() => {
    if (mediaInfo) {
      setSeasons(mediaInfo.seasons || []);
      setCast(mediaInfo.credits?.cast || []);
      const director = mediaInfo.credits?.crew?.find(
        crewMember => crewMember.job === 'Director'
      );
      setDirector(director ? director.name : 'Unknown');

      if (mediaInfo.seasons && mediaInfo.seasons.length > 0) {
        const defaultSeasonNumber = mediaInfo.seasons[0]?.season_number || 1;
        setSelectedSeason(defaultSeasonNumber);
      }
      
      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }
  }, [mediaInfo, setBackgroundImage]);

  useEffect(() => {
    if (seasonData) {
      setEpisodes(seasonData.episodes || []);
      const defaultEpisodeNumber = seasonData.episodes[0]?.episode_number || 1;
      setSelectedEpisode(defaultEpisodeNumber);
    }
  }, [seasonData, id, type, selectedSeason]);

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
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (episodeNumber) => {
    setSelectedEpisode(episodeNumber);
  };

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
          <i className="bi bi-wifi-off me-1"></i>
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

  const { genres, vote_average } = mediaInfo;
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
                  handleAddToList={handleAddToList} />
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex text-start">
              <div className="dropdown dropup me-2">
                  <button
                    className="btn btn-dark custom-bg btn-md rounded-pill d-none d-md-inline-block"
                    id="seasonDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    Season {selectedSeason}
                  </button>
                  {/* For small screens */}
                  <button
                    className="btn btn-dark custom-bg btn-sm rounded-pill d-md-none"
                    id="seasonDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    S {selectedSeason}
                  </button>
                  <ul className="dropdown-menu overflow-auto custom-dropdown bd-callout-dark p-0 custom-theme-radius">
                    {loadingSeasonData ? (
                      <li className="dropdown-item text-secondary bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="spinner-border text-light spinner-size-1" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </li>
                    ) : errorSeasonData ? (
                      <li className="dropdown-item text-white bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center dynamic-fs">
                            <i className="bi bi-wifi-off me-1"></i>
                            <span className="mb-0">Something went wrong.</span>
                          </div>
                        </div>
                      </li>
                    ) : seasons.length > 0 ? (
                      seasons.map((season, index) => (
                        <React.Fragment key={season.id}>
                          <li>
                            <button
                              className="dropdown-item text-white bg-transparent text-wrap text-truncate"
                              onClick={() => handleSeasonChange(season.season_number)}
                              value={season.season_number}
                            >
                              <span className="m-1">{season.name === "Specials" ? season.name : `Season ${season.season_number}`}</span>
                            </button>
                          </li>
                          {index < seasons.length - 1 && <li><hr className="dropdown-divider bg-secondary m-0" /></li>}
                        </React.Fragment>
                      ))
                    ) : (
                      <li className="dropdown-item text-white bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center dynamic-fs">
                            <i className="bi bi-database-slash me-1"></i>
                            <span>No season found.</span>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
              </div>
              <div className="dropdown dropup">
                  <button
                    className="btn btn-dark custom-bg btn-md rounded-pill d-none d-md-inline-block"
                    id="episodeDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    Episode {selectedEpisode}
                  </button>
                  {/* For small screens */}
                  <button
                    className="btn btn-dark custom-bg btn-sm rounded-pill d-md-none"
                    id="episodeDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    E {selectedEpisode}
                  </button>
                  <ul className="dropdown-menu overflow-auto custom-dropdown bd-callout-dark p-0 custom-theme-radius">
                    {loadingSeasonData ? (
                      <li className="dropdown-item text-secondary bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="spinner-border text-light spinner-size-1" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </li>
                    ) : errorSeasonData ? (
                      <li className="dropdown-item text-white bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center dynamic-fs">
                            <i className="bi bi-wifi-off me-1"></i>
                            <span className="mb-0">Something went wrong.</span>
                          </div>
                        </div>
                      </li>
                    ) : episodes.length > 0 ? (
                      episodes.map((episode, index) => (
                        <React.Fragment key={episode.id}>
                          <li style={{ margin: 0 }}> {/* Remove margin from the list item */}
                            <button
                              className="dropdown-item text-white bg-transparent episode-item"
                              onClick={() => handleEpisodeChange(episode.episode_number)}
                              value={episode.episode_number}
                              style={{
                              backgroundImage: `url(https://image.tmdb.org/t/p/w300${episode.still_path})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              padding: 0,
                              margin: 0,
                              border: 'none',
                              height: '100px',
                              width: '200px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              }}
                            >
                              <span
                                className="custom-bg text-white p-2 custom-theme-radius-low-br"
                                style={{
                                  position: 'absolute',
                                  whiteSpace: 'nowrap',
                                  overflowX: 'auto',
                                  width: '100%',
                                }}
                              >
                                Episode {episode.episode_number}: {episode.name}
                              </span>
                            </button>
                          </li>
                          {index < episodes.length - 1 && (
                            <li style={{ margin: 0 }}>
                              <hr className="dropdown-divider bg-secondary m-0" style={{ margin: 0, height: '1px' }} />
                            </li> 
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <li className="dropdown-item text-white bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center dynamic-fs">
                            <i className="bi bi-database-slash me-1"></i>
                            <span>No episode found.</span>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <div className="dropdown dropup">
                  {/* Button for medium and large screens */}
                  <button
                    className="btn btn-dark custom-bg btn-md rounded-pill d-none d-md-inline-block"
                    id="serverDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    {selectedServerName ? selectedServerName : 'vidsrc.xyz'}
                  </button>
                  {/* Button for small screens */}
                  <button
                    className="btn btn-dark custom-bg btn-sm rounded-pill d-md-none"
                    id="serverDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    {selectedServerName ? selectedServerName : 'vidsrc.xyz'}
                  </button>
                  <ul className="dropdown-menu overflow-auto custom-dropdown bd-callout-dark p-0 custom-theme-radius">
                    {loadingLink ? (
                      <li className="dropdown-item text-secondary bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="spinner-border text-light spinner-size-1" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </li>
                    ) : errorLink ? (
                      <li className="dropdown-item text-white bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center dynamic-fs">
                            <i className="bi bi-wifi-off me-1"></i>
                            <span className="mb-0">Something went wrong.</span>
                          </div>
                        </div>
                      </li>
                    ) : servers.length > 0 ? (
                      servers.map((server, index) => (
                        <React.Fragment key={server.server_name}>
                          <li>
                            <button
                              className="dropdown-item text-white bg-transparent text-wrap text-truncate"
                              onClick={() => handleServerChange(server.server_name)}
                            >
                              <span className="m-1">{server.server_name}</span>
                            </button>
                          </li>
                          {index < servers.length - 1 && <li><hr className="dropdown-divider bg-secondary m-0" /></li>}
                        </React.Fragment>
                      ))
                    ) : (
                      <li className="dropdown-item text-white bg-transparent">
                        <div className="col d-flex justify-content-center align-items-center">
                          <div className="d-flex align-items-center dynamic-fs">
                            <i className="bi bi-database-slash me-1"></i>
                            <span>No server found.</span>
                          </div>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column align-items-start custom-theme-radius my-2 w-100">
              <div className="container py-2 text-white">
                <div className="d-flex flex-row dynamic-ts">
                  <i className="bi bi-person-fill me-1"></i>
                  Cast
                </div>
                <div className="row justify-content-center">
                  {cast.length === 0 ? (
                    <div className="col d-flex vh-35 justify-content-center align-items-center">
                      <div className="d-flex align-items-center dynamic-fs">
                        <i className="bi bi-database-slash me-1"></i>
                        <span>No cast found.</span>
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
                      className="btn bg-transparent dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block"
                      onClick={handleShowMore}
                    >
                      <i className="bi bi-chevron-down text-white me-1"></i>
                      <span className="text-white">Show More</span>
                    </button>

                    {/* Button for small screens */}
                    <button
                      className="btn bg-transparent dynamic-fs border-0 rounded-pill btn-sm d-md-none"
                      onClick={handleShowMore}
                    >
                      <i className="bi bi-chevron-down text-white me-1"></i>
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

export default TvGrid;