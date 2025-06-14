// AnimeGrid.js
function AnimeGrid({ animeMediaInfo }) {

  return (
    <div className="w-100 px-4 py-5 text-light" style={{ maxWidth: '800px' }}>

      <h2 className="mb-3">Mapped AniList Anime Info</h2>

      <pre
        style={{
          backgroundColor: '#1e1e1e',
          color: '#dcdcdc',
          padding: '1rem',
          borderRadius: '8px',
          overflowX: 'auto',
          fontSize: '0.9rem',
        }}
      >
        {JSON.stringify(animeMediaInfo, null, 2)}
      </pre>
    </div>
  );
}

export default AnimeGrid;