// animeUtils.js
const ALLOWED_FORMATS = new Set(['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL']);

export const matchAniMediaByTitleAndDate = (mediaList, tmdbTitle, tmdbDateStr) => {
  if (!tmdbTitle || !tmdbDateStr || !Array.isArray(mediaList)) return null;

  const tmdbDate = new Date(tmdbDateStr).toISOString().split('T')[0];

  return mediaList.find(media => {
    const aniDate = toFullDate(media.startDate);
    return (
      fuzzyMatch(tmdbTitle, media.title?.english, media.title?.romaji) &&
      aniDate === tmdbDate
    );
  });
};

export const extractChronologicalChain = (matchedMedia) => {
  if (!matchedMedia) return [];

  const edges = matchedMedia.relations?.edges || [];

  const related = edges
    .map(edge => edge.node)
    .filter(node =>
      node &&
      node.type === 'ANIME' &&
      ALLOWED_FORMATS.has(node.format)
    );

  const all = [matchedMedia, ...related].filter(
    item => ALLOWED_FORMATS.has(item.format)
  );

  return all.sort((a, b) => {
    const dateA = toFullDate(a.startDate);
    const dateB = toFullDate(b.startDate);
    return new Date(dateA || '9999-12-31') - new Date(dateB || '9999-12-31');
  });
};

export const fuzzyMatch = (tmdbTitle, eng, romaji) => {
  const tmdbTokens = tokenize(tmdbTitle);
  const compareTokens = [eng, romaji]
    .filter(Boolean)
    .flatMap(title => tokenize(title));

  return tmdbTokens.some(token => compareTokens.includes(token));
};

const tokenize = (title = '') => {
  return title
    .toLowerCase()
    .split(/[\s:.\-_/]+/)
    .filter(Boolean);
};

export const toFullDate = (startDate) => {
  const { year, month, day } = startDate || {};
  if (!year || !month || !day) return null;
  return `${year.toString().padStart(4, '0')}-${month
    .toString()
    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};