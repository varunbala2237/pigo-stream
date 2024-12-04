import React, { useEffect } from 'react';
import Carousel from "./Carousel";
import useFetchMedia from '../hooks/useFetchMedia';

function CarouselGrid({ filter }) {
    const { data: movieMedia, loading: loadingMovieMedia, error: errorMovieMedia } = useFetchMedia('trending', 'movie');
    const { data: tvMedia, loading: loadingTvMedia, error: errorTvMedia } = useFetchMedia('trending', 'tv');
  
    // Combine or filter media based on the 'filter' prop
    let media = [];
    let loadingMedia = loadingMovieMedia || loadingTvMedia;
    let errorMedia = errorMovieMedia || errorTvMedia;
    
    if (filter === 'movie') {
        media = movieMedia || [];
        loadingMedia = loadingMovieMedia;
        errorMedia = errorMovieMedia;
    } else if (filter === 'tv') {
        media = tvMedia || [];
        loadingMedia = loadingTvMedia;
        errorMedia = errorTvMedia;
    } else {
        // Default case: alternate movie and tv items if filter is 'all' or unspecified
        const maxLength = Math.max(movieMedia?.length || 0, tvMedia?.length || 0);
        for (let i = 0; i < maxLength; i++) {
            if (movieMedia && movieMedia[i]) media.push(movieMedia[i]);
            if (tvMedia && tvMedia[i]) media.push(tvMedia[i]);
        }
    }

    useEffect(() => {
      const carouselElement = document.getElementById('carouselExampleControls');
      if (carouselElement) {
          // Use Bootstrap's API to check if the instance already exists
          const carouselInstance = window.bootstrap.Carousel.getInstance(carouselElement);
          if (!carouselInstance) {
              // Create a new carousel instance if it doesn't exist
              const newCarouselInstance = new window.bootstrap.Carousel(carouselElement, {
                  interval: 7000,
                  pause: 'hover',
              });
              newCarouselInstance.cycle(); // Manually start the carousel
          }
      }
    }, []); // Run only on initial mount

    return (
      <>
        {/* Conditionally render carousel */}
        <div 
          id="carouselExampleControls" 
          className="carousel slide flex-row mt-4 custom-w-size-95"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner col custom-theme-radius">
            {loadingMedia && (
              <div className="col mt-5 mb-5 d-flex justify-content-center">
                <div className="spinner-border text-light spinner-size-1" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            {errorMedia && (
              <div className="col mt-5 mb-5">
                <p className="text-white text-center mb-0">
                  Oops! Something went wrong.
                </p>
              </div>
            )}
            {!loadingMedia && !errorMedia && media.length > 0 ? (
              media.slice(0, 12).map((item, index) => (
                <Carousel key={item.id} media={item} type={item.media_type} isActive={index === 0} />
              ))
            ) : (
              !loadingMedia && !errorMedia && (
                <div className="col mt-5 mb-5">
                  <p className="text-center text-white mb-0">No media found.</p>
                </div>
              )
            )}
          </div>
          <button className="carousel-control-prev d-none d-md-block" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next d-none d-md-block" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
          <div className="carousel-indicators">
            {!loadingMedia && !errorMedia && media.length > 0 && media.slice(0, 12).map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleControls"
                data-bs-slide-to={index}
                className={`rounded-circle m-1 ${index === 0 ? 'active' : ''}`}
                style={{ height: '6px', width: '6px' }}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </>
    );
}

export default CarouselGrid;