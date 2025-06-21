// AnimeGrid.js
import React, { useState, useEffect } from 'react';
import CastCard from './CastCard';
import useFetchServers from '../../hooks/PlayGroundPage/useFetchServers';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function AnimeGrid({ id, type, mediaInfo, animeInfo, setMediaURL, setBackgroundImage }) {
  const ANIME_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'AnimeGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [cast, setCast] = useState([]);
  // Compute the initial index based on matching full date
  const initialChainIndex = React.useMemo(() => {
    const mediaDateString = mediaInfo?.release_date || mediaInfo?.first_air_date;
    if (!mediaDateString || !Array.isArray(animeInfo)) return 0;

    const mediaDate = new Date(mediaDateString);
    mediaDate.setHours(0, 0, 0, 0); // normalize

    const matchedIndex = animeInfo.findIndex(entry => {
      const { year, month, day } = entry?.startDate || {};
      if (!year || !month || !day) return false;

      const entryDate = new Date(year, month - 1, day);
      entryDate.setHours(0, 0, 0, 0); // normalize

      return entryDate.getTime() === mediaDate.getTime();
    });

    return matchedIndex !== -1 ? matchedIndex : 0;
  }, [mediaInfo, animeInfo]);

  const [selectedChainIndex, setSelectedChainIndex] = useState(initialChainIndex);
  const selectedChain = animeInfo[selectedChainIndex];
  const episodeCount = selectedChain?.episodes || 0;
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...ANIME_STORAGE_PATH, 'sliceIndex') || 12
  );

  const { servers } = useFetchServers(id, 'anime', selectedChainIndex, selectedEpisode);

  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);

  // Season initial management
  useEffect(() => {
    if (mediaInfo) {
      setCast(mediaInfo.credits?.cast || []);

      // Setup the backgroundImage
      setBackgroundImage(`https://image.tmdb.org/t/p/original${mediaInfo.backdrop_path}`);
    }
  }, [mediaInfo, setBackgroundImage]);

  const handleViewMore = () => {
    setSliceIndex(prevSliceIndex => {
      const newIndex = prevSliceIndex + 12;
      setSessionValue(...ANIME_STORAGE_PATH, 'sliceIndex', newIndex);
      return newIndex;
    });
  };

  const handleAddToList = async () => {
    try {
      if (!isInList) {
        await addToList(id, type);
        refetch();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center p-0">
        <div className="flex-row text-white w-100">
          <div className="container">
            <InfoSection
              id={id}
              type={type}
              mediaInfo={mediaInfo}
              isInList={isInList}
              handleAddToList={handleAddToList}
            />

            <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
              <div className="d-flex flex-row align-items-center">
                <div className="d-flex flex-row dynamic-fs">
                  <dl className="m-0">
                    <dt className="mb-2">
                      <i className="bi bi-cone-striped text-warning me-2"></i>
                      Work in Progress
                    </dt>
                    <dd className="mb-0">Current Chain Index: {selectedChainIndex}</dd>
                    <dd className="mb-0">
                      {Array.isArray(animeInfo) && animeInfo.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                          {animeInfo.map((item, idx) => (
                            <div
                              key={item.id || idx}
                              className="p-2 border rounded bg-dark text-white"
                              style={{ fontSize: '0.875rem' }}
                            >
                              <div><strong>ID:</strong> {item.id}</div>
                              <div><strong>Title:</strong> {item.title?.english || item.title?.romaji || 'Untitled'}</div>
                              <div className="d-flex flex-wrap gap-3">
                                <div><strong>Format:</strong> {item.format}</div>
                                <div><strong>Episodes:</strong> {item.episodes ?? 'N/A'}</div>
                                <div>
                                  <strong>Start Date:</strong>{' '}
                                  {item.startDate?.year
                                    ? `${item.startDate.year}-${String(item.startDate.month || '01').padStart(2, '0')}-${String(item.startDate.day || '01').padStart(2, '0')}`
                                    : 'Unknown'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-secondary">No matching anime titles were found for this TMDB item.</span>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            <div className="d-flex flex-column align-items-start custom-theme-radius-low my-2 w-100">
              <div className="container py-2 text-white">
                <div className="d-flex flex-row dynamic-ts">
                  <i className="bi bi-person-fill me-2"></i>
                  Cast
                </div>
                <div className="row justify-content-center">
                  {cast.length === 0 ? (
                    // Show 4 dummy skeletal cards when no cast is found
                    Array.from({ length: 4 }).map((_, index) => (
                      <CastCard key={index} isSkeleton={true} />
                    ))
                  ) : (
                    cast.slice(0, sliceIndex).map((actor, index) => (
                      <CastCard key={actor.cast_id ?? `${actor.name}-${index}`} actor={actor} />
                    ))
                  )}
                </div>
                {cast.length > sliceIndex && (
                  <div className="d-flex justify-content-end align-items-center">
                    <button
                      className="btn bg-transparent d-flex dynamic-fs border-0 rounded-pill text-white"
                      onClick={handleViewMore}
                    >
                      <i className="bi bi-arrow-right me-2"></i>
                      View More
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default AnimeGrid;