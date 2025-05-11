// MediaGridSkeleton.js
import PlayerSkeleton from './PlayerSkeleton';
import './MediaGridSkeleton.css';

function MediaGridSkeleton() {
  return (
    <div className="flex-row custom-w-size-100">
      <div className="row justify-content-center position-relative">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <div className="container bg-transparent">

            {/* Player Skeleton */}
            <PlayerSkeleton />
            
            {/* Servers Section Skeleton */}
            <div className="container custom-bg custom-theme-radius w-100 p-2 my-2">
              <div className="dynamic-ts py-2">
                {/* Grey box for Server Label */}
                <div className="skeleton-placeholder skeleton-text" style={{ width: '150px', height: '20px' }}></div>
              </div>
              <div className="row g-2">
                <div className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                  <button className="btn w-100 border-0 rounded-pill shadow-sm btn-grey bd-callout-dark">
                    <span className="skeleton-placeholder skeleton-text" style={{ width: '80%', height: '18px' }}></span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cast Section Skeleton */}
            <div className="d-flex flex-column align-items-start custom-theme-radius my-2 w-100">
              <div className="container py-2 text-white">
                <div className="dynamic-ts">
                  {/* Grey box for Cast Label */}
                  <div className="skeleton-placeholder skeleton-text" style={{ width: '100px', height: '20px' }}></div>
                </div>
                <div className="row justify-content-center">
                  {/* Skeleton Cast Cards */}
                  <div className="col-3">
                    <div className="skeleton-placeholder skeleton-image"></div>
                    <div className="skeleton-placeholder skeleton-text mt-2" style={{ width: '70%' }}></div>
                  </div>
                  <div className="col-3">
                    <div className="skeleton-placeholder skeleton-image"></div>
                    <div className="skeleton-placeholder skeleton-text mt-2" style={{ width: '70%' }}></div>
                  </div>
                  <div className="col-3">
                    <div className="skeleton-placeholder skeleton-image"></div>
                    <div className="skeleton-placeholder skeleton-text mt-2" style={{ width: '70%' }}></div>
                  </div>
                  <div className="col-3">
                    <div className="skeleton-placeholder skeleton-image"></div>
                    <div className="skeleton-placeholder skeleton-text mt-2" style={{ width: '70%' }}></div>
                  </div>
                </div>
                {/* Show More Button */}
                <div className="text-end">
                  <button className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block">
                    {/* Grey text for Show More */}
                    <div className="skeleton-placeholder skeleton-text" style={{ width: '100px', height: '20px' }}></div>
                  </button>

                  <button className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none">
                    {/* Grey text for Show More */}
                    <div className="skeleton-placeholder skeleton-text" style={{ width: '80px', height: '20px' }}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaGridSkeleton;