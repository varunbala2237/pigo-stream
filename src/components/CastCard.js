import React from 'react';

function CastCard({ actor }) {
  const searchActor = (name) => {
    const searchQuery = encodeURIComponent(name);
    const searchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(searchUrl, '_blank');
  };

  const imageUrl = actor.profile_path 
    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
    : 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  return (
    <div key={actor.cast_id} className="col-lg-3 col-md-4 col-5 text-center my-2"> {/* Center text alignment */}
      <a href="#cast" onClick={() => searchActor(actor.name)} className="text-decoration-none">
        {/* Image Container */}
        <div className="d-flex justify-content-center mb-2">
          <img 
            src={imageUrl}
            alt='empty'
            className="custom-cast-card-img rounded-circle"
            style={{ 
              objectFit: 'cover',
            }}
          />
        </div>
        {/* Name and Character Section */}
        <div className="text-white">
          <p className="dynamic-fs mb-0">{actor.name}</p>
          <p className="dynamic-fs text-secondary mb-0">{actor.character || 'Unknown'}</p>        
        </div>
      </a>
    </div>
  );
}

export default CastCard;