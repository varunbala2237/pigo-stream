// InfoSection.js
import React, { useState, useEffect } from 'react';
import useFetchTrailer from '../../../hooks/PlayGroundPage/useFetchTrailer';
import OverviewSection from './OverviewSection';

function InfoSection({
  mediaURL,
  averageVote,
  director,
  genres,
  languages,
  mediaInfo,
  id, type,
  isInList,
  handleAddToList,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const { trailerLink } = useFetchTrailer(id, type);

  useEffect(() => {
    setImageUrl(
      mediaInfo.poster_path
        ? `https://image.tmdb.org/t/p/w500${mediaInfo.poster_path}`
        : 'https://placehold.co/200x300/212529/6c757d?text=?'
    );
  }, [mediaInfo.poster_path]);

  const handleShare = () => {
    const currentURL = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: mediaInfo.title || mediaInfo.name,
        url: currentURL,
      }).catch((err) => console.error('Error sharing:', err));
    } else {
      console.error('Web Share API not supported in this browser.');
    }
  };

  return (
    <div className="d-flex flex-column custom-bg custom-theme-radius-low w-100 p-2">
      <div className="d-flex flex-column align-items-start justify-content-between w-100">
        <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100">
          <div className="section">
            <img
              className="custom-theme-radius-low mb-2"
              src={imageUrl}
              alt="empty"
              style={{
                width: '160px',
                height: '240px',
                objectFit: 'cover',
              }}
            />

            <div className="d-flex flex-column align-items-stretch justify-content-center">

              <div className="d-flex justify-content-between rounded-pill w-100 mb-2">
                <div className="d-flex rounded-pill overflow-hidden border-0 w-100">
                  {/* Large and Small List Buttons*/}
                  <button
                    className="btn btn-dark d-none d-md-block rounded-pill-l border-0 text-white custom-bg flex-grow-1"
                    onClick={handleAddToList}
                  >
                    <i className={`bi-${isInList ? 'bookmark-fill theme-color' : 'bookmark'}`}></i>
                  </button>

                  <button
                    className="btn btn-dark d-block d-md-none btn-sm rounded-pill-l border-0 text-white custom-bg flex-grow-1"
                    onClick={handleAddToList}
                  >
                    <i className={`bi-${isInList ? 'bookmark-fill theme-color' : 'bookmark'}`}></i>
                  </button>

                  {/* Divider Line */}
                  <div className="bg-secondary" style={{ width: '1px' }}></div>

                  {/* Large and Small Share Buttons*/}
                  <button
                    className="btn btn-dark d-none d-md-block rounded-pill-r border-0 text-white custom-bg flex-grow-1"
                    onClick={handleShare}
                  >
                    <i className="bi bi-share-fill"></i>
                  </button>

                  <button
                    className="btn btn-dark d-block d-md-none btn-sm rounded-pill-r border-0 text-white custom-bg flex-grow-1"
                    onClick={handleShare}
                  >
                    <i className="bi bi-share-fill"></i>
                  </button>
                </div>
              </div>

              {/* Larger button for larger screen */}
              <button
                className={`btn d-none d-md-block mb-2 justify-content-center border-0 nowrap rounded-pill ${trailerLink ? 'btn-danger' : 'btn-secondary'
                  }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-play-fill text-white me-2"></i>
                {"Trailer"}
              </button>
              {/* Smaller button for smaller screen */}
              <button
                className={`btn d-block d-md-none btn-sm mb-2 justify-content-center border-0 nowrap rounded-pill ${trailerLink ? 'btn-danger' : 'btn-secondary'
                  }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-play-fill text-white me-2"></i>
                {"Trailer"}
              </button>
            </div>
          </div>
          <div className="section ms-2">

            <div className="w-100 align-items-start justify-content-start mb-2">
            </div>
            <div className="d-flex flex-column flex-wrap dynamic-fs">
              <dl className="m-0">
                <dt className="text-wrap dynamic-ts">{mediaInfo.title ? mediaInfo.title : mediaInfo.name}</dt>
                <dd className="dynamic-fs">
                  <i className="bi bi-star-fill text-warning me-2"></i>
                  <span id="Rating" className="text-white">
                    {averageVote}
                  </span>
                </dd>
              </dl>

              <dl className="m-0">
                <div className="mb-2">
                  <dt className="fw-bold">Release Date:</dt>
                  <dd className="mb-0">
                    {mediaInfo.release_date
                      ? new Date(mediaInfo.release_date).toLocaleDateString()
                      : new Date(mediaInfo.first_air_date).toLocaleDateString()}
                  </dd>
                </div>

                <div className="mb-2">
                  <dt className="fw-bold">Director:</dt>
                  <dd className="mb-0">{director}</dd>
                </div>

                <div className="mb-2">
                  <dt className="fw-bold">Genres:</dt>
                  <dd className="mb-0 text-white">
                    {genres?.map((genre, index) => (
                      <React.Fragment key={index}>
                        {genre.name}
                        {index < genres.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </dd>
                </div>

                <div className="mb-0">
                  <dt className="fw-bold">Languages:</dt>
                  <dd className="mb-0 text-white">
                    {languages?.map((lang, index) => (
                      <React.Fragment key={index}>
                        {lang.english_name}
                        {index < languages.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
        <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100">
          <div className="section">
            <dd className="text-start">
              <dt className="fw-bold">Overview:</dt>
              <OverviewSection text={mediaInfo.overview} />
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;