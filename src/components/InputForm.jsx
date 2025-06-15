import React, { useState, useEffect, useCallback } from 'react';
import { generateGameIdea } from '../services/aiService.js';
import { validateResponse } from '../services/validator.js';
import debounce from 'lodash.debounce';

const InputForm = ({
  keywords,
  setKeywords,
  platform,
  setPlatform,
  timeline,
  setTimeline,
  category,
  setCategory,
  setLoading,
  setCurrentResult,
  addToHistory,
  sessionId,
  setValidationStatus,
  debugMode,
}) => {
  const [error, setError] = useState('');
  const [apiStatus, setApiStatus] = useState('Idle');

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      setError('Please enter keywords to generate a game idea.');
      return;
    }
    setError('');
    setLoading(true);
    setApiStatus('Generating...');
    try {
      const { data, service } = await generateGameIdea({
        sessionId,
        keywords,
        platform,
        timeline,
        category,
      });

      const responseText = data?.choices?.[0]?.message?.content || data?.text || JSON.stringify(data);

      const validation = validateResponse(responseText, keywords);
      setValidationStatus(validation);

      if (!validation.valid) {
        setApiStatus('Validation failed, retrying with fresh context...');
        // Retry logic could be implemented here if desired
      } else {
        setApiStatus(`Success via ${service}`);
        setCurrentResult(responseText);
        addToHistory({
          id: Date.now(),
          sessionId,
          keywords,
          platform,
          timeline,
          category,
          response: responseText,
          timestamp: new Date().toISOString(),
          service,
        });
      }
    } catch (err) {
      setApiStatus('API call failed. Please try again later.');
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Debounced input handler to reduce excessive API calls (if auto-generate is implemented)
  const debouncedSetKeywords = useCallback(
    debounce((value) => {
      setKeywords(value);
    }, 500),
    []
  );

  const onKeywordsChange = (e) => {
    debouncedSetKeywords(e.target.value);
  };

  return (
    <section className="mb-6 bg-white p-6 rounded shadow-md">
      <div className="mb-4">
        <label htmlFor="keywords" className="block font-semibold mb-1">
          Enter game concept keywords
        </label>
        <textarea
          id="keywords"
          placeholder="Enter game concept keywords (e.g., 'tukang ronda kampung', 'penjaga warung malam')"
          defaultValue={keywords}
          onChange={onKeywordsChange}
          rows={3}
          className="w-full border border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <fieldset>
          <legend className="font-semibold mb-2">Platform</legend>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="platform"
              value="Unity 2D"
              checked={platform === 'Unity 2D'}
              onChange={(e) => setPlatform(e.target.value)}
              className="mr-2"
            />
            Unity 2D
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="platform"
              value="Unity 3D"
              checked={platform === 'Unity 3D'}
              onChange={(e) => setPlatform(e.target.value)}
              className="mr-2"
            />
            Unity 3D
          </label>
        </fieldset>

        <fieldset>
          <legend className="font-semibold mb-2">Timeline</legend>
          <label className="inline-flex items-center mr-4">
            <input
              type="radio"
              name="timeline"
              value="1 Month Solo"
              checked={timeline === '1 Month Solo'}
              onChange={(e) => setTimeline(e.target.value)}
              className="mr-2"
            />
            1 Month Solo
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="timeline"
              value="3-6 Months Team"
              checked={timeline === '3-6 Months Team'}
              onChange={(e) => setTimeline(e.target.value)}
              className="mr-2"
            />
            3-6 Months Team
          </label>
        </fieldset>

        <fieldset>
          <legend className="font-semibold mb-2">Category</legend>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="Casual">Casual</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Horror">Horror</option>
            <option value="Anomaly">Anomaly</option>
            <option value="Idle">Idle</option>
          </select>
        </fieldset>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleGenerate}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded shadow"
          disabled={false}
        >
          🎯 Generate Game Idea
        </button>
      </div>

      {error && <p className="mt-3 text-red-600 font-semibold">{error}</p>}
      {apiStatus && <p className="mt-2 text-gray-700 italic">{apiStatus}</p>}
    </section>
  );
};

export default InputForm;
