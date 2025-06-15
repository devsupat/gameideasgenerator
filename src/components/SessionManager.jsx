import React from 'react';

const SessionManager = ({ sessionId, resetContext, debugMode, setDebugMode }) => {
  return (
    <section className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <button
        onClick={resetContext}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded shadow"
        title="Reset session and clear context"
      >
        🔄 Fresh Context
      </button>
      <div className="flex items-center gap-3">
        <label htmlFor="debugMode" className="font-medium text-gray-700">
          Debug Mode
        </label>
        <input
          id="debugMode"
          type="checkbox"
          checked={debugMode}
          onChange={() => setDebugMode(!debugMode)}
          className="w-5 h-5"
        />
      </div>
      {debugMode && (
        <div className="bg-gray-100 border border-gray-300 rounded p-3 font-mono text-xs text-gray-700 max-w-full break-words">
          <strong>Debug Info:</strong> Current Session ID: {sessionId}
        </div>
      )}
    </section>
  );
};

export default SessionManager;
