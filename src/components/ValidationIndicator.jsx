import React from 'react';

const ValidationIndicator = ({ validationStatus }) => {
  if (!validationStatus) return null;

  const { valid, warning } = validationStatus;

  return (
    <div
      className={`my-4 p-3 rounded font-semibold text-sm ${valid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
      role="alert"
      aria-live="polite"
    >
      {valid ? (
        <span>✅ Response validated successfully.</span>
      ) : (
        <span>⚠️ {warning}</span>
      )}
    </div>
  );
};

export default ValidationIndicator;
