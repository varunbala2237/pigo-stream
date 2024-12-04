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
    <div key={actor.cast_id} className="col-lg-3 col-md-3-5 col-6 text-center mb-2"> {/* Center text alignment */}
      <a href="#cast" onClick={() => searchActor(actor.name)} className="text-decoration-none">
        {/* Image Container */}
        <div className="d-flex justify-content-center mb-2">
          <img 
            src={imageUrl}
            alt=''
            className="rounded-circle" // Make the image circular
            style={{ 
              height: '150px', // Adjust the size as needed
              width: '150px', 
              objectFit: 'cover',
            }}
          />
        </div>
        {/* Name and Character Section */}
        <div style={{ 
          color: '#fff', // Text color
          fontSize: '14px', // Adjust text size as needed
        }}>
          <p className="mb-0">{actor.name}</p>
          <p className="text-white mb-0">{actor.character || 'Unknown'}</p>        
        </div>
      </a>
    </div>
  );
}

export default CastCard;