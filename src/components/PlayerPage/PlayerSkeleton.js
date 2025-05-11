import React, { useState, useEffect } from 'react';

function PlayerSkeleton({ loading }) {
  return (
    <div className="d-flex flex-column custom-bg custom-theme-radius w-100 p-2">
      {/* Player Header */}
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100">
        {/* Left Section with Image */}
        <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100">
          <div className="section border-0">
            <div className="skeleton-placeholder mb-3" style={{ width: '100%', height: '300px', borderRadius: '10px', backgroundColor: '#e0e0e0' }}></div>

            <div className="d-flex flex-column align-items-stretch justify-content-center">
              <div className="d-flex justify-content-between w-100 mb-3">
                <div className="d-flex justify-content-center text-start w-50">
                  <div className="skeleton-placeholder" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
                </div>

                <div className="d-flex justify-content-center text-end w-50">
                  <div className="skeleton-placeholder" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
                </div>
              </div>

              <div className="skeleton-placeholder" style={{ width: '100%', height: '40px', borderRadius: '20px', backgroundColor: '#e0e0e0' }}></div>
              <div className="skeleton-placeholder" style={{ width: '100%', height: '40px', borderRadius: '20px', backgroundColor: '#e0e0e0', marginTop: '10px' }}></div>
            </div>
          </div>

          {/* Right Section with Details */}
          <div className="section ms-3">
            <div className="skeleton-placeholder" style={{ width: '200px', height: '25px', borderRadius: '10px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
            <div className="d-flex align-items-start justify-content-start w-100">
              <div className="skeleton-placeholder" style={{ width: '60px', height: '20px', borderRadius: '10px', backgroundColor: '#e0e0e0' }}></div>
            </div>

            <div className="d-flex flex-column flex-wrap mt-2">
              <div className="skeleton-placeholder" style={{ width: '100%', height: '20px', borderRadius: '10px', backgroundColor: '#e0e0e0', marginBottom: '10px' }}></div>
              <div className="skeleton-placeholder" style={{ width: '100%', height: '20px', borderRadius: '10px', backgroundColor: '#e0e0e0' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (Note for unsupported platform) */}
      <div className="skeleton-placeholder mt-3" style={{ width: '100%', height: '40px', borderRadius: '10px', backgroundColor: '#e0e0e0' }}></div>
    </div>
  );
}

export default PlayerSkeleton;