import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import InputForm from './components/InputForm.jsx'
import ResultsDisplay from './components/ResultsDisplay.jsx'
import SessionManager from './components/SessionManager.jsx'
import ValidationIndicator from './components/ValidationIndicator.jsx'
import ExportManager from './components/ExportManager.jsx'
import { generateSessionId } from './services/contextManager.js'

function App() {
  const [sessionId, setSessionId] = useState(generateSessionId())
  const [keywords, setKeywords] = useState('')
  const [platform, setPlatform] = useState('Unity 2D')
  const [timeline, setTimeline] = useState('1 Month Solo')
  const [category, setCategory] = useState('Casual')
  const [generationHistory, setGenerationHistory] = useState([])
  const [currentResult, setCurrentResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [validationStatus, setValidationStatus] = useState({ valid: true, warning: '' })
  const [debugMode, setDebugMode] = useState(false)

  // Reset context and generation history
  const resetContext = () => {
    const newSessionId = generateSessionId()
    setSessionId(newSessionId)
    setGenerationHistory([])
    setCurrentResult(null)
    setValidationStatus({ valid: true, warning: '' })
  }

  // Add new generation result to history
  const addToHistory = (result) => {
    setGenerationHistory(prev => [result, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header sessionId={sessionId} />
      <main className="flex-grow container mx-auto px-4 py-6">
        <SessionManager
          sessionId={sessionId}
          resetContext={resetContext}
          debugMode={debugMode}
          setDebugMode={setDebugMode}
        />
        <InputForm
          keywords={keywords}
          setKeywords={setKeywords}
          platform={platform}
          setPlatform={setPlatform}
          timeline={timeline}
          setTimeline={setTimeline}
          category={category}
          setCategory={setCategory}
          setLoading={setLoading}
          setCurrentResult={setCurrentResult}
          addToHistory={addToHistory}
          sessionId={sessionId}
          setValidationStatus={setValidationStatus}
          debugMode={debugMode}
        />
        <ValidationIndicator validationStatus={validationStatus} />
        <ResultsDisplay
          loading={loading}
          result={currentResult}
          generationHistory={generationHistory}
        />
        <ExportManager result={currentResult} />
      </main>
      <footer className="bg-primary-600 text-white text-center py-3">
        <p>© 2024 Unity Game Ideas Generator. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
