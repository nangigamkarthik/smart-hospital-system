import React from 'react';

const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <span className="loading-spinner" />
          <p>Loading your hospital workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <span className="loading-spinner loading-spinner--small" />
    </div>
  );
};

export default Loading;
