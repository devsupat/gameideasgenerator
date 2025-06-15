import React, { useState } from 'react';
import { translateText } from '../services/aiService';

const tabs = [
  { id: 'overview', label: 'Gambaran Konsep Game' },
  { id: 'implementation', label: 'Detail Implementasi Unity' },
  { id: 'roadmap', label: 'Peta Jalan Pengembangan' },
  { id: 'risk', label: 'Penilaian Risiko' },
];

const ResultsDisplay = ({ loading, result, generationHistory }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedContent, setTranslatedContent] = useState('');
  const [showRooCode, setShowRooCode] = useState(false);
  const [rooCodePrompt, setRooCodePrompt] = useState('');

  if (loading) {
    return (
      <section className="my-6 p-6 bg-white rounded shadow-md animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </section>
    );
  }

  if (!result) {
    return (
      <section className="my-6 p-6 bg-white rounded shadow-md text-center text-gray-500">
        Belum ada ide game yang dibuat. Masukkan kata kunci dan klik "Generate Game Idea".
      </section>
    );
  }

  // Parse the result text into sections based on headings
  const parseSection = (text, heading) => {
    const regex = new RegExp(`##\\s*${heading}[\\s\\S]*?(?=##|$)`, 'i');
    const match = text.match(regex);
    return match ? match[0].replace(/\*\*/g, '').replace(/##/g, '') : 'Informasi tidak tersedia.';
  };

  const overview = parseSection(result, '🎮 GAME CONCEPT OVERVIEW');
  const implementation = parseSection(result, '⚙️ UNITY IMPLEMENTATION');
  const roadmap = parseSection(result, '📅 DEVELOPMENT ROADMAP');
  const risk = parseSection(result, '🎯 SCOPE & FEASIBILITY');


  const handleTranslate = async () => {
    try {
      setTranslatedContent('Menerjemahkan...');
      
      let contentToTranslate = '';
      switch (activeTab) {
        case 'overview':
          contentToTranslate = overview;
          break;
        case 'implementation':
          contentToTranslate = implementation;
          break;
        case 'roadmap':
          contentToTranslate = roadmap;
          break;
        case 'risk':
          contentToTranslate = risk;
          break;
        default:
          contentToTranslate = overview;
      }

      const translated = await translateText(contentToTranslate, 'id'); // Ensure Indonesian translation
      setTranslatedContent(translated);
      setIsTranslated(true);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedContent('Terjemahan gagal. Silakan coba lagi.');
      setIsTranslated(false);
    }
  };

  const generateRooCodePrompt = () => {
    const prompt = `Create a Unity game with the following specifications:

Game Overview:
${overview}

Technical Requirements:
${implementation}

Development Plan:
${roadmap}

Please provide the complete implementation including:
1. All necessary C# scripts
2. GameObject hierarchy setup
3. Component configurations
4. Scene organization
5. Asset requirements`;

    setRooCodePrompt(prompt);
    setShowRooCode(true);
  };

  return (
    <section className="my-6 bg-white rounded shadow-md p-6 flex flex-col gap-6">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <nav className="border-b border-gray-300 flex-grow">
          <ul className="flex space-x-4">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  className={`pb-2 font-semibold ${
                    activeTab === tab.id
                      ? 'border-b-4 border-primary-600 text-primary-700'
                      : 'text-gray-600 hover:text-primary-600'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleTranslate}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              🌐 Terjemahkan ke Indonesia
            </button>
            <button
              onClick={generateRooCodePrompt}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center gap-2"
            >
              🚀 Generate Roo Code Prompt
            </button>
          </div>
        </div>

        <article className="prose max-w-none whitespace-pre-wrap font-mono text-sm text-justify">
          {(() => {
            switch(activeTab) {
              case 'overview':
                return isTranslated ? translatedContent : overview;
              case 'implementation':
                return isTranslated ? translatedContent : implementation;
              case 'roadmap':
                return isTranslated ? translatedContent : roadmap;
              case 'risk':
                return isTranslated ? translatedContent : risk;
              default:
                return overview;
            }
          })()}
        </article>

        {showRooCode && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Roo Code Prompt</h3>
              <button
                onClick={() => setShowRooCode(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border border-gray-200">
              {rooCodePrompt}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(rooCodePrompt)}
              className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
            >
              📋 Copy to Clipboard
            </button>
          </div>
        )}
      </div>
      <aside className="w-full md:w-64 bg-gray-50 border border-gray-200 rounded p-4 overflow-y-auto max-h-[400px]">
        <h3 className="font-semibold mb-3">Riwayat Generasi</h3>
        {generationHistory.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada generasi sebelumnya.</p>
        ) : (
          <ul className="space-y-2 text-xs font-mono">
            {generationHistory.map((item) => (
              <li key={item.id} className="border-b border-gray-300 pb-1">
                <div className="truncate" title={item.keywords}>
                  <strong>Kata Kunci:</strong> {item.keywords || 'Tidak ada kata kunci'}
                </div>
                <div>
                  <small>
                    <strong>Sesi:</strong> {item.sessionId}
                  </small>
                </div>
                <div>
                  <small>
                    <strong>Platform:</strong> {item.platform}
                  </small>
                </div>
                <div>
                  <small>
                    <strong>Garis Waktu:</strong> {item.timeline}
                  </small>
                </div>
                <div>
                  <small>
                    <strong>Kategori:</strong> {item.category}
                  </small>
                </div>
                <div>
                  <small>
                    <strong>Waktu:</strong> {new Date(item.timestamp).toLocaleString()}
                  </small>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </section>
  );
};

export default ResultsDisplay;
