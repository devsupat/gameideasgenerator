export const generateSessionId = () => {
    return 'game_gen_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const resetContext = (setSessionId, setGenerationHistory) => {
    setSessionId(generateSessionId());
    setGenerationHistory([]);
    // Clear any cached responses if implemented
};
