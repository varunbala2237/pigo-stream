export const matchAniMediaByTitleAndDate = (mediaList, tmdbTitle, tmdbDateStr) => {
  if (!tmdbTitle || !tmdbDateStr) return null;

  const tmdbDate = new Date(tmdbDateStr).toISOString().split('T')[0];

  return mediaList.find(media => {
    const aniDate = toFullDate(media.startDate);
    return (
      fuzzyMatch(tmdbTitle, media.title?.english, media.title?.romaji) &&
      aniDate === tmdbDate
    );
  });
};

const ALLOWED_FORMATS = new Set(['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL']);

export const extractChronologicalChain = (matchedMedia) => {
  if (!matchedMedia) return [];

  const base = matchedMedia;
  const edges = matchedMedia.relations?.edges || [];

  const related = edges
    .filter(edge =>
      edge.node?.type === 'ANIME' &&
      ALLOWED_FORMATS.has(edge.node?.format)
    )
    .map(edge => edge.node);

  const all = [...related, base].filter(item => ALLOWED_FORMATS.has(item.format));

  return all.sort((a, b) => {
    const ad = new Date(toFullDate(a.startDate) || '9999-12-31');
    const bd = new Date(toFullDate(b.startDate) || '9999-12-31');
    return ad - bd;
  });
};

export const fuzzyMatch = (tmdb, eng, romaji) => {
  const tmdbTokens = tmdb.toLowerCase().split(/[\s:.-]+/).filter(Boolean);

  return [eng, romaji]
    .filter(Boolean)
    .some(title => {
      const titleLower = title.toLowerCase();
      return tmdbTokens.some(token => titleLower.includes(token));
    });
};

export const toFullDate = (startDate) => {
  const { year, month, day } = startDate || {};
  if (!year || !month || !day) return null;
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};