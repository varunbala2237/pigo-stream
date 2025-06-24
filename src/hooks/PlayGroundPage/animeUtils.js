// animeUtils.js
const ALLOWED_FORMATS = new Set(['TV', 'MOVIE', 'OVA', 'ONA', 'SPECIAL']);

/**
 * Match *multiple* AniList media entries that resemble the TMDB title.
 * Filter those that are likely in the same franchise (based on token match and partial title match).
 */
export const matchAllRelatedAniMedia = (mediaList, tmdbTitle, tmdbDateStr) => {
  if (!tmdbTitle || !tmdbDateStr || !Array.isArray(mediaList)) return [];

  const tmdbTokens = new Set(tokenize(tmdbTitle));
  const tmdbMonth = new Date(tmdbDateStr).toISOString().slice(0, 7); // YYYY-MM

  // First pass: title and partial date match
  return mediaList.filter(media => {
    const aniDate = toFullDate(media.startDate)?.slice(0, 7);
    const titleMatch = looseTitleMatch(tmdbTitle, media.title?.english, media.title?.romaji);
    const overlap = getTitleTokenOverlap(tmdbTokens, media.title?.english, media.title?.romaji);
    return titleMatch && aniDate === tmdbMonth && overlap >= 0.4;
  });
};

export const extractChronologicalRelationRecursive = (mediaList) => {
  const visited = new Set();
  const queue = [...mediaList];
  const collected = [];

  const validRelationTypes = new Set([
    'PREQUEL',
    'SEQUEL',
    'PARENT',
    'SIDE_STORY',
    'ALTERNATIVE_VERSION',
    'COMPILATION',
    'SUMMARY',
    'OTHER',
  ]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.id)) continue;

    visited.add(current.id);
    collected.push(current);

    const edges = current.relations?.edges || [];
    for (const edge of edges) {
      const node = edge.node;
      if (
        node &&
        node.type === 'ANIME' &&
        ALLOWED_FORMATS.has(node.format) &&
        validRelationTypes.has(edge.relationType)
      ) {
        queue.push(node);
      }
    }
  }

  return collected.sort((a, b) => {
    const dateA = toFullDate(a.startDate);
    const dateB = toFullDate(b.startDate);
    return new Date(dateA || '9999-12-31') - new Date(dateB || '9999-12-31');
  });
};

const tokenize = (title = '') =>
  title.toLowerCase().split(/[\s:.\-_/]+/).filter(Boolean);

const getTitleTokenOverlap = (tmdbTokens, eng, romaji) => {
  const candidates = [eng, romaji].filter(Boolean);
  return Math.max(
    ...candidates.map(title => {
      const aniTokens = new Set(tokenize(title));
      const shared = [...tmdbTokens].filter(token => aniTokens.has(token));
      return shared.length / tmdbTokens.size;
    }),
    0
  );
};

export const looseTitleMatch = (tmdbTitle, eng, romaji) => {
  const tmdbTokens = tokenize(tmdbTitle);
  const candidates = [eng, romaji].filter(Boolean);
  return candidates.some(title => {
    const aniTokens = tokenize(title);
    return tmdbTokens.some(token => aniTokens.includes(token));
  });
};

export const toFullDate = (startDate) => {
  const { year, month, day } = startDate || {};
  if (!year || !month || !day) return null;
  return `${year.toString().padStart(4, '0')}-${month
    .toString()
    .padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};