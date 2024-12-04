import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Carousel({ media, type, isActive }) {
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setImageUrl(`https://image.tmdb.org/t/p/original${media.backdrop_path}`);
  }, [media.backdrop_path]);

  const watchMedia = async () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/play?id=${media.id}&type=${type}`);
  };

  // Extracting rating and year
  const rating = media.vote_average.toFixed(1); // Round to one decimal place
  const releaseYear = media.release_date ? new Date(media.release_date).getFullYear() : (media.first_air_date ? new Date(media.first_air_date).getFullYear() : '');

  return (
    <div className={`carousel-item ${isActive ? 'active' : ''}`} style={{ cursor: 'pointer', position: 'relative' }}>
      <img
        src={imageUrl}
        id="carouselImage"
        className="d-block w-100"
        alt={media.title}
        style={{ objectFit: 'cover' }}
      />
      <div className="overlay" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}></div>

      {/* Rating in Top-Left Corner */}
      <div className="position-absolute top-0 start-0 m-3 custom-bg p-1 rounded">
        <i className="bi bi-star-fill text-warning"></i>
        <span className="text-white"> {rating} </span>
      </div>

      {/* Right-Aligned Caption Content */}
      <div className="carousel-caption d-flex flex-column align-items-end mb-4" style={{ right: '10%', textAlign: 'right' }}>
        <h6 className="text-white text-glow">{media.title ? media.title : media.name} | {releaseYear}</h6>
        {/* Button for medium and large screens */}
        <button className="btn btn-dark custom-bg text-white btn-md rounded-pill d-none d-md-inline-block mt-2" onClick={watchMedia}>
          <i className="bi bi-play-fill me-2"></i>Watch
        </button>
        {/* Button for small screens */}
        <button className="btn btn-dark custom-bg btn-sm rounded-pill d-md-none mt-2" onClick={watchMedia}>
          <i className="bi bi-play-fill me-2"></i>Watch
        </button>
      </div>
    </div>
  );
}

export default Carousel;