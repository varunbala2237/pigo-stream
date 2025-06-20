// AnimeGrid.js
import React, { useState, useEffect } from 'react';
import CastCard from './Sections/CastCard';
import useSaveMyList from '../../hooks/MyListPage/useSaveMyList';
import useCheckMyList from '../../hooks/MyListPage/useCheckMyList';
import InfoSection from './Sections/InfoSection';
import PlayGroundFooter from './PlayGroundFooter';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function AnimeGrid({ id, type, mediaInfo, setBackgroundImage }) {
  const ANIME_STORAGE_PATH = React.useMemo(
    () => ['PlayGroundUI', 'Grids', 'AnimeGrid', `${id}`],
    [id]
  );

  // Initialize required useStates
  const [mediaURL, setMediaURL] = useState('');
  const [cast, setCast] = useState([]);

  // Demo
  setMediaURL("https://example.com/");

  const [sliceIndex, setSliceIndex] = useState(() =>
    getSessionValue(...ANIME_STORAGE_PATH, 'sliceIndex') || 12
  );

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

      {/* Backspace & PlayGroundFooter */}
      <div className="divider" style={{ height: '6rem' }}></div>
      <PlayGroundFooter id={id} type={type} mediaURL={mediaURL} />
    </>
  );
}

export default AnimeGrid;