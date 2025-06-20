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

export const extractChronologicalChain = (matchedMedia) => {
  if (!matchedMedia) return [];

  const base = matchedMedia;
  const related = matchedMedia.relations?.edges || [];

  const prequels = related
    .filter(edge => edge.relationType === 'PREQUEL')
    .map(edge => edge.node);

  const sequels = related
    .filter(edge => edge.relationType === 'SEQUEL')
    .map(edge => edge.node);

  const all = [...prequels, base, ...sequels];

  return all.sort((a, b) => {
    const ad = new Date(toFullDate(a.startDate) || '9999-12-31');
    const bd = new Date(toFullDate(b.startDate) || '9999-12-31');
    return ad - bd;
  });
};

export const fuzzyMatch = (tmdb, eng, romaji) => {
  const base = tmdb.toLowerCase();
  return [eng, romaji]
    .filter(Boolean)
    .some(title => {
      const t = title.toLowerCase();
      return t.includes(base) || base.includes(t);
    });
};

export const toFullDate = (startDate) => {
  const { year, month, day } = startDate || {};
  if (!year || !month || !day) return null;
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
};