import React, { useState, useEffect } from 'react';
import CastCard from './CastCard';
import useFetchMediaInfo from '../hooks/useFetchMediaInfo';
import useFetchSeason from '../hooks/useFetchSeason';
import useFetchStream from '../hooks/useFetchStream';
import useSaveMyList from '../hooks/useSaveMyList';
import useCheckMyList from '../hooks/useCheckMyList';
import Player from './Player';
import Alert from '../Alert'

function TvGrid({ id, type }) {
  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);
  const [director, setDirector] = useState('');
  const [productionCompanies, setProductionCompanies] = useState([]);
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
      setProductionCompanies(mediaInfo.production_companies || []);

      if (mediaInfo.seasons && mediaInfo.seasons.length > 0) {
        const defaultSeasonNumber = mediaInfo.seasons[0]?.season_number || 1;
        setSelectedSeason(defaultSeasonNumber);
      }
    }
  }, [mediaInfo]);

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

  const handleAddToList = async () => {
    try {
      if (isInList) {
        setAlertMessage("Already exists in My List.");
        setAlertType("primary");
        setTimeout(() => setAlertMessage(''), 5000);
      } else {
        await addToList(id, type);
        refetch();
        setAlertMessage("Successfully added to My List.");
        setAlertType("success");
        setTimeout(() => setAlertMessage(''), 5000);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAlertDismiss = () => {
    setAlertMessage('');
  };

  const handleServerChange = (serverName) => {
    setSelectedServerName(serverName);
  };

  const handleShowMore = () => {
    setSliceIndex(prevSliceIndex => prevSliceIndex + 12); // Increase slice index by 12
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

  const { name, first_air_date, overview, genres, vote_average } = mediaInfo;

  return (
    <div className="row justify-content-center position-relative">
      {/* Blurry Background */}
      {mediaInfo.backdrop_path && (
      <div
        className="bg-blur"
        style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path})`,
        }}
      ></div>
      )}
      <div className="col-lg-8 col-md-10 col-sm-12">
        <div className="container bg-transparent m-0">
          <div className="d-flex justify-content-between align-items-center mt-2">
            <div className="text-start">
              <h5>{name}</h5>
            </div>
            <div className="text-end">
              <button 
                className="btn btn-transparent border-0 py-1 px-2 text-white"
                onClick={handleAddToList}
                title="Add to My List"
              >
                <i className={`bi-bookmark${isInList ? '-fill' : ''}`}></i>
              </button>
            </div>
          </div>
          <div className="my-2">
            <Player mediaURL={mediaURL} id={id} type={type}/>
          </div>
          <div className="d-flex justify-content-between">
            <div className="d-flex text-start">
              <div className="dropdown me-2">
                  <button
                    className="btn btn-dark custom-bg btn-md rounded-pill d-none d-md-inline-block"
                    id="seasonDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-chevron-down me-2"></i>
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
                    <i className="bi bi-chevron-down me-2"></i>
                    S {selectedSeason}
                  </button>
                  <ul className="dropdown-menu overflow-auto custom-dropdown bd-callout-dark p-0 custom-theme-radius">
                    {loadingSeasonData ? (
                      <li className="dropdown-item text-secondary bg-transparent">
                        <div className="col d-flex justify-content-center">
                          <div className="spinner-border text-light spinner-size-1" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </li>
                    ) : errorSeasonData ? (
                      <li className="dropdown-item text-white bg-transparent">Oops! Something went wrong.</li>
                    ) : seasons.length > 0 ? (
                      seasons.map((season, index) => (
                        <React.Fragment key={season.id}>
                          <li>
                            <button
                              className="dropdown-item text-white bg-transparent text-wrap text-truncate"
                              onClick={() => handleSeasonChange(season.season_number)}
                              value={season.season_number}
                            >
                              <span>{season.name === "Specials" ? season.name : `Season ${season.season_number}`}</span>
                            </button>
                          </li>
                          {index < seasons.length - 1 && <li><hr className="dropdown-divider bg-secondary m-0" /></li>}
                        </React.Fragment>
                      ))
                    ) : (
                      <li className="dropdown-item text-white bg-transparent">No seasons available.</li>
                    )}
                  </ul>
              </div>
              <div className="dropdown">
                  <button
                    className="btn btn-dark custom-bg btn-md rounded-pill d-none d-md-inline-block"
                    id="episodeDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <i className="bi bi-chevron-down me-2"></i>
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
                    <i className="bi bi-chevron-down me-2"></i>
                    E {selectedEpisode}
                  </button>
                  <ul className="dropdown-menu overflow-auto custom-dropdown bd-callout-dark p-0 custom-theme-radius">
                    {loadingSeasonData ? (
                      <li className="dropdown-item text-secondary bg-transparent">
                        <div className="col d-flex justify-content-center">
                          <div className="spinner-border text-light spinner-size-1" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      </li>
                    ) : errorSeasonData ? (
                      <li className="dropdown-item text-white bg-transparent">Oops! Something went wrong.</li>
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
                              display: 'flex',
                              justifyContent: 'space-between',
                              }}
                            >
                              <span
                                className="bd-callout-dark text-white p-2 custom-theme-radius-low-br"
                                style={{
                                whiteSpace: 'nowrap',       // Prevent text from wrapping
                                overflowX: 'auto',          // Allow horizontal scroll inside the container
                                display: 'block',           // Ensure the background stretches with the content
                                width: '100%',              // Take the full width of the container
                                maxWidth: '100%',           // Restrict max width to prevent overflow outside
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
                      <li className="dropdown-item text-white bg-transparent">No episodes available.</li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="d-flex justify-content-end">
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
                      <li className="dropdown-item text-secondary bg-transparent">
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
            </div>
            <div className="d-flex flex-column mt-2">
              <div className="d-flex justify-content-between mb-2">
                <div className="text-start">
                <i className="bi bi-star-fill text-warning me-2"></i><span id="Rating" className="text-white">{vote_average?.toFixed(1) || '0.0'}</span>
              </div>
            </div>
            <p>{overview}<br/><br/>
            <b>Release Date:</b>&nbsp;{first_air_date}<br/>
            <b>Genre:</b>&nbsp;{genres?.map(genre => genre.name).join(', ')}<br/>
            <b>Director:</b>&nbsp;{director}<br/>
            <b>Production Companies:</b>&nbsp;{productionCompanies.map(company => company.name).join(', ')}</p>
          </div>
          <h5 className="card-title text-white mt-2"><i className="bi bi-person-fill me-2"></i>Cast</h5>
          <div className="container my-4 text-white">
            <div className="row mb-2">
              {cast.length === 0 ? (
                <p className="text-center text-white mt-5 mb-5">No cast found.</p>
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
      {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
    </div>
  );
}

export default TvGrid;