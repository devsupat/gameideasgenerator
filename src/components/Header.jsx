import React from 'react';

const Header = ({ sessionId }) => {
  return (
    <header className="bg-primary-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span role="img" aria-label="gamepad">🎮</span> Unity Game Ideas Generator
          </h1>
          <p className="text-sm text-purple-200 mt-1">
            AI-Powered Game Concepts with Context Isolation
          </p>
        </div>
        <div className="mt-3 md:mt-0 text-sm font-mono bg-purple-700 px-3 py-1 rounded">
          Session ID: <span className="break-all">{sessionId}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
