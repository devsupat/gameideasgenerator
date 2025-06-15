import React from 'react';

const ExportManager = ({ result }) => {
  if (!result) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result).then(() => {
      alert('Copied to clipboard!');
    });
  };

  const downloadAsText = () => {
    const element = document.createElement('a');
    const file = new Blob([result], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'game_idea.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section className="my-4 flex gap-4">
      <button
        onClick={copyToClipboard}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        Copy to Clipboard
      </button>
      <button
        onClick={downloadAsText}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
      >
        Download as Text
      </button>
    </section>
  );
};

export default ExportManager;
