// AnimeGrid.js
function AnimeGrid({ animeInfo }) {
  return (
    <div style={{ color: 'white', padding: '1rem' }}>
      <h2>Anime Data (Matched)</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {JSON.stringify({ animeInfo }, null, 2)}
      </pre>
    </div>
  );
}

export default AnimeGrid;