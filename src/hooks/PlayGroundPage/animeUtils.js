// animeUtils.js
const ALLOWED_FORMATS = new Set(['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL']);

export const matchAniMediaByTitleAndDate = (mediaList, tmdbTitle, tmdbDateStr) => {
  if (!tmdbTitle || !tmdbDateStr || !Array.isArray(mediaList)) return null;

  const tmdbDate = new Date(tmdbDateStr).toISOString().split('T')[0];
  const tmdbMonth = tmdbDate.slice(0, 7); // YYYY-MM

  const matched = mediaList.find(media => {
    const aniDate = toFullDate(media.startDate);
    return (
      fuzzyMatch(tmdbTitle, media.title?.english, media.title?.romaji) &&
      aniDate?.slice(0, 7) === tmdbMonth
    );
  });

  if (matched) return matched;

  // Fallback: if not found, loosen match (at least one token match and YYYY-MM)
  return mediaList.find(media => {
    const aniDate = toFullDate(media.startDate);
    return (
      looseTitleMatch(tmdbTitle, media.title?.english, media.title?.romaji) &&
      aniDate?.slice(0, 7) === tmdbMonth
    );
  });
};

export const extractChronologicalChain = (matchedMedia) => {
  if (!matchedMedia) return [];

  const edges = matchedMedia.relations?.edges || [];

  const validRelationTypes = new Set([
    'PREQUEL',
    'SEQUEL',
    'PARENT',
    'SIDE_STORY',
    'ALTERNATIVE_VERSION',
    'COMPILATION',
    'SUMMARY'
  ]);

  const related = edges
    .filter(edge =>
      edge.node &&
      edge.node.type === 'ANIME' &&
      ALLOWED_FORMATS.has(edge.node.format) &&
      validRelationTypes.has(edge.relationType)
    )
    .map(edge => edge.node);

  const all = [matchedMedia, ...related];

  return all.sort((a, b) => {
    const dateA = toFullDate(a.startDate);
    const dateB = toFullDate(b.startDate);
    return new Date(dateA || '9999-12-31') - new Date(dateB || '9999-12-31');
  });
};

export const fuzzyMatch = (tmdbTitle, eng, romaji) => {
  const tmdbTokens = new Set(tokenize(tmdbTitle));
  const candidates = [eng, romaji].filter(Boolean);

  return candidates.some(title => {
    const aniTokens = new Set(tokenize(title));
    const shared = [...tmdbTokens].filter(token => aniTokens.has(token));
    const overlap = shared.length / tmdbTokens.size;
    return overlap >= 0.6 || (tmdbTokens.size <= 2 && shared.length >= 1);
  });
};

export const looseTitleMatch = (tmdbTitle, eng, romaji) => {
  const tmdbTokens = tokenize(tmdbTitle);
  const candidates = [eng, romaji].filter(Boolean);
  return candidates.some(title => {
    const aniTokens = tokenize(title);
    return tmdbTokens.some(token => aniTokens.includes(token));
  });
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