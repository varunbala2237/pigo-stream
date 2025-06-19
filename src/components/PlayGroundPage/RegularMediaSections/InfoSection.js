// InfoSection.js
import React, { useState, useEffect } from 'react';
import useFetchTrailer from '../../../hooks/PlayGroundPage/useFetchTrailer';
import OverviewSection from '../CommonSections/OverviewSection';

function InfoSection({
  id,
  type,
  mediaInfo,
  isInList,
  handleAddToList,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const { trailerLink } = useFetchTrailer(id, type);

  const poster_path = mediaInfo?.poster_path;
  const title = mediaInfo?.title || mediaInfo?.name;
  const vote_average = mediaInfo?.vote_average;
  const averageVote = vote_average ? vote_average.toFixed(1) : '0.0';
  const release_date = mediaInfo?.release_date || mediaInfo?.first_air_date;
  const director =
    mediaInfo?.credits?.crew?.find(c => c.job === 'Director')?.name ||
    mediaInfo?.created_by?.[0]?.name ||
    'Unknown';
  const { genres = [], spoken_languages = [] } = mediaInfo ? mediaInfo : {};
  const overview = mediaInfo?.overview;

  useEffect(() => {
    setImageUrl(
      poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : 'https://placehold.co/200x300/212529/6c757d?text=?'
    );
  }, [poster_path]);

  const handleShare = () => {
    const currentURL = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title,
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
                className={
                  `btn d-none d-md-block mb-2 d-flex justify-content-center border-0 rounded-pill 
                  ${trailerLink ? 'btn-light' : 'btn-secondary'
                  }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-youtube text-danger me-2"></i>
                <span className="dynamic-fs">Trailer</span>
              </button>
              {/* Smaller button for smaller screen */}
              <button
                className={
                  `btn d-block d-md-none btn-sm mb-2 d-flex justify-content-center border-0 rounded-pill 
                  ${trailerLink ? 'btn-light' : 'btn-secondary'
                  }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-youtube text-danger me-2"></i>
                <span className="dynamic-fs">Trailer</span>
              </button>
            </div>
          </div>
          <div className="section ms-2">
            <div className="d-flex flex-column flex-wrap dynamic-fs">
              <dl className="m-0">
                <dt className="text-wrap dynamic-ts">{title}</dt>
              </dl>

              <dl className="my-2">
                <div className="d-flex">
                  <dd className="dymamic-fs me-2">Release Date:</dd>
                  <dd className="mb-0 dynamic-fs">
                    <span className="text-secondary">{new Date(release_date).toLocaleDateString()}</span>
                  </dd>
                </div>

                <div className="d-flex">
                  <dd className="dymamic-fs me-2">Director:</dd>
                  <dd className="mb-0 text-secondary dynamic-fs">{director}</dd>
                </div>

                <div className="d-flex">
                  <dd className="dymamic-fs me-2">Rating:</dd>
                  <dd id="Rating" className="mb-0 text-secondary">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    {averageVote}
                  </dd>
                </div>

                <div className="d-flex">
                  <dd className="dynamic-fs me-2">Genres:</dd>
                  <dd className="mb-0 text-secondary dynamic-fs">
                    {genres?.map((genre, index) => (
                      <React.Fragment key={index}>
                        {genre.name}
                        {index < genres.length - 1 && ", "}
                      </React.Fragment>
                    ))}
                  </dd>
                </div>

                <div className="d-flex">
                  <dd className="dynamic-fs me-2">Languages:</dd>
                  <dd className="mb-0 text-secondary dynamic-fs">
                    {spoken_languages?.map((lang, index) => (
                      <React.Fragment key={index}>
                        {lang.english_name}
                        {index < spoken_languages.length - 1 && ", "}
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
              <dt className="fw-bold dynamic-fs">Overview:</dt>
              <OverviewSection text={overview} />
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;