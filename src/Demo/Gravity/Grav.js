import React from 'react';
import './UnityGame.css'; // Import the specific CSS file

const UnityGame = () => {
  return (
    <div className="unity-game-container">
      <iframe
        src="/unity-gravity/index.html"
        title="Unity Game"
        className="unity-game-iframe"
        allowFullScreen
      />
    </div>
  );
};

export default UnityGame;