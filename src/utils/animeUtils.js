// animeUtils.js
export const validateTitleMatch = (tmdbTitle, englishTitle, romajiTitle) => {
  if (!tmdbTitle || (!englishTitle && !romajiTitle)) return false;

  const lowerTMDB = tmdbTitle.toLowerCase();
  const titles = [englishTitle, romajiTitle].filter(Boolean).map(t => t.toLowerCase());

  return titles.some(title => lowerTMDB.includes(title) || title.includes(lowerTMDB));
};

export const validateDateMatch = (tmdbDateStr, aniStartDate) => {
  if (!tmdbDateStr || !aniStartDate) return false;

  const tmdbDate = new Date(tmdbDateStr);
  const { year, month, day } = aniStartDate;

  if (!year) return false;

  const isYearMatch = tmdbDate.getFullYear() === year;
  const isMonthMatch = month ? tmdbDate.getMonth() + 1 === month : true;
  const isDayMatch = day ? tmdbDate.getDate() === day : true;

  return isYearMatch && isMonthMatch && isDayMatch;
};

export const extractRelatedMedia = (matchedMedia) => {
  const base = formatEdge({ node: matchedMedia });

  const related = matchedMedia.relations?.edges || [];

  const sortByDate = (a, b) => {
    if (!a.year || !b.year) return a.id - b.id;
    if (a.year !== b.year) return a.year - b.year;
    return (a.month || 1) - (b.month || 1);
  };

  const prequels = related
    .filter(rel => rel.relationType === 'PREQUEL')
    .map(formatEdge)
    .sort(sortByDate);

  const sequels = related
    .filter(rel => rel.relationType === 'SEQUEL')
    .map(formatEdge)
    .sort(sortByDate);

  return [...prequels, base, ...sequels];
};

const formatEdge = (edge) => {
  const node = edge.node || edge;
  return {
    id: node.id,
    name: node.title.english || node.title.romaji || 'Untitled',
    type: node.format || 'UNKNOWN',
    year: node.startDate?.year || null,
    month: node.startDate?.month || null
  };
};