import axios from 'axios';

const GEMINI_PRIMARY_KEY = import.meta.env.VITE_GEMINI_PRIMARY_KEY;
const GEMINI_FALLBACK_KEY = import.meta.env.VITE_GEMINI_FALLBACK_KEY;
const OPENROUTER_PRIMARY_KEY = import.meta.env.VITE_OPENROUTER_PRIMARY_KEY;
const OPENROUTER_FALLBACK_KEY = import.meta.env.VITE_OPENROUTER_FALLBACK_KEY;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Configuration for API services with fallback mechanism
const API_SERVICES = [
  {
    name: 'Gemini Primary',
    url: GEMINI_API_URL,
    key: GEMINI_PRIMARY_KEY,
    type: 'gemini',
    timeout: 30000 // 30 seconds timeout
  },
  {
    name: 'Gemini Fallback',
    url: GEMINI_API_URL,
    key: GEMINI_FALLBACK_KEY,
    type: 'gemini',
    timeout: 30000
  },
  {
    name: 'OpenRouter Primary',
    url: OPENROUTER_API_URL,
    key: OPENROUTER_PRIMARY_KEY,
    type: 'openrouter',
    timeout: 45000 // 45 seconds for OpenRouter
  },
  {
    name: 'OpenRouter Fallback',
    url: OPENROUTER_API_URL,
    key: OPENROUTER_FALLBACK_KEY,
    type: 'openrouter',
    timeout: 45000
  },
];

/**
 * Validates input parameters
 * @param {Object} params - Input parameters
 * @returns {Object} Validation result
 */
const validateParams = (params) => {
  const errors = [];

  if (!params.sessionId || typeof params.sessionId !== 'string') {
    errors.push('sessionId is required and must be a string');
  }

  if (!params.keywords || typeof params.keywords !== 'string' || params.keywords.trim().length === 0) {
    errors.push('keywords is required and must be a non-empty string');
  }

  if (!params.platform || typeof params.platform !== 'string') {
    errors.push('platform is required and must be a string');
  }

  if (!params.timeline || typeof params.timeline !== 'string') {
    errors.push('timeline is required and must be a string');
  }

  if (!params.category || typeof params.category !== 'string') {
    errors.push('category is required and must be a string');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes input to prevent injection attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';

  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 500); // Limit length
};

/**
 * Creates a prompt for AI services
 * @param {Object} params - Parameters for prompt generation
 * @returns {string} Generated prompt
 */
const createPrompt = ({ sessionId, keywords, platform, timeline, category }) => {
  // Sanitize all inputs
  const safeSessionId = sanitizeInput(sessionId);
  const safeKeywords = sanitizeInput(keywords);
  const safePlatform = sanitizeInput(platform);
  const safeTimeline = sanitizeInput(timeline);
  const safeCategory = sanitizeInput(category);

  return `
==== FRESH GAME GENERATION SESSION ====
SESSION_ID: ${safeSessionId}
CRITICAL REQUIREMENTS:
1. USE ALL PROVIDED KEYWORDS EXACTLY AS GIVEN: "${safeKeywords}"
2. Keywords MUST appear in game title, description, or mechanics
3. If keywords seem unusual, creatively integrate them into the concept
4. Validate keyword presence before finalizing output

ROLE: Unity Game Design Specialist for Solo/Small Team Development

TASK: Generate ONE unique game concept that INCORPORATES ALL THESE KEYWORDS: "${safeKeywords}"

MANDATORY KEYWORD USAGE:
- Each keyword must be used at least once
- Keywords must be integrated naturally into the concept
- Never omit or ignore any keywords

PARAMETERS:
- Keywords: "${safeKeywords}"
- Platform: ${safePlatform}
- Timeline: ${safeTimeline}
- Category: ${safeCategory}

MANDATORY ANALYSIS PROCESS:
1. Read ONLY these keywords: "${safeKeywords}"
2. Identify the UNIQUE ESSENCE of these specific words
3. What activities, behaviors, or interactions do these keywords represent?
4. What emotions or atmospheres do they naturally evoke?
5. Derive game mechanics FROM this essence (not adapt keywords TO existing templates)

OUTPUT STRUCTURE REQUIRED:

## 🎮 GAME CONCEPT OVERVIEW
**Title Options:** [3 creative titles]
**Core Essence:** [What makes these keywords unique]
**Primary Activity:** [What players will actually DO]
**Unique Hook:** [Why this is different from existing games]

## ⚙️ UNITY IMPLEMENTATION
**Platform Optimization:** [Specific to Unity 2D/3D choice]
**Essential Scripts:** [List of C# scripts needed]
**Key Prefabs:** [Main prefabs to create]
**Technical Challenges:** [Unity-specific implementation issues]

## 📅 DEVELOPMENT ROADMAP
[Detailed timeline based on selected timeframe]

## 🎯 SCOPE & FEASIBILITY
**Realistic Goals:** [What's achievable in timeframe]
**Risk Factors:** [Potential development challenges]
**Simplification Options:** [If scope is too ambitious]

CRITICAL CONSTRAINTS:
- Focus ONLY on "${safeKeywords}" - no other influences
- All suggestions must be realistic for Unity development
- Timeline must be achievable for selected team size
- Provide specific, actionable implementation guidance

==== END CONTEXT ISOLATION ====
`;
};

/**
 * Calls Gemini API with proper error handling
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - API key for authentication
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Object>} API response
 */
const callGeminiAPI = async (prompt, apiKey, timeout = 30000) => {
  if (!apiKey || apiKey === 'YOUR_GEMINI_PRIMARY_KEY' || apiKey === 'YOUR_GEMINI_FALLBACK_KEY') {
    throw new Error('Gemini API key is not configured');
  }

  try {
    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: timeout,
      }
    );

    // Validate response structure
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      throw new Error('Invalid response structure from Gemini API');
    }

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - Gemini API took too long to respond');
    }

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Unknown error';

      switch (status) {
        case 400:
          throw new Error(`Bad request to Gemini API: ${message}`);
        case 401:
          throw new Error('Invalid Gemini API key');
        case 403:
          throw new Error('Gemini API access forbidden');
        case 429:
          throw new Error('Gemini API rate limit exceeded');
        case 500:
          throw new Error('Gemini API server error');
        default:
          throw new Error(`Gemini API error (${status}): ${message}`);
      }
    }

    throw new Error(`Gemini API network error: ${error.message}`);
  }
};

/**
 * Calls OpenRouter API with proper error handling
 * @param {string} prompt - The prompt to send
 * @param {string} apiKey - API key for authentication
 * @param {number} timeout - Request timeout in milliseconds
 * @returns {Promise<Object>} API response
 */
const callOpenRouterAPI = async (prompt, apiKey, timeout = 45000) => {
  if (!apiKey || apiKey === 'YOUR_OPENROUTER_PRIMARY_KEY' || apiKey === 'YOUR_OPENROUTER_FALLBACK_KEY') {
    throw new Error('OpenRouter API key is not configured');
  }

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2048,
        temperature: 0.7,
        top_p: 0.8,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://your-app-domain.com', // Add your domain
          'X-Title': 'Game Idea Generator' // Add your app name
        },
        timeout: timeout,
      }
    );

    // Validate response structure
    if (!response.data || !response.data.choices || !response.data.choices[0]) {
      throw new Error('Invalid response structure from OpenRouter API');
    }

    return response.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - OpenRouter API took too long to respond');
    }

    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.error?.message || 'Unknown error';

      switch (status) {
        case 400:
          throw new Error(`Bad request to OpenRouter API: ${message}`);
        case 401:
          throw new Error('Invalid OpenRouter API key');
        case 403:
          throw new Error('OpenRouter API access forbidden');
        case 429:
          throw new Error('OpenRouter API rate limit exceeded');
        case 500:
          throw new Error('OpenRouter API server error');
        default:
          throw new Error(`OpenRouter API error (${status}): ${message}`);
      }
    }

    throw new Error(`OpenRouter API network error: ${error.message}`);
  }
};

/**
 * Processes API response based on service type
 * @param {Object} data - Raw API response
 * @param {string} serviceType - Type of service (gemini/openrouter)
 * @returns {string} Processed response text
 */
const processResponse = (data, serviceType) => {
  try {
    if (serviceType === 'gemini') {
      return data.candidates[0].content.parts[0].text;
    } else if (serviceType === 'openrouter') {
      return data.choices[0].message.content;
    }
    throw new Error('Unknown service type');
  } catch (error) {
    throw new Error(`Failed to process response: ${error.message}`);
  }
};

/**
 * Main function to generate game ideas with fallback mechanism
 * @param {Object} params - Parameters for game idea generation
 * @returns {Promise<Object>} Generated game idea with metadata
 */
/**
 * Translates text to specified language while preserving technical terms
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code (e.g. 'id' for Indonesian)
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, targetLanguage) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text to translate must be a non-empty string');
  }

  const prompt = `Translate the following game development documentation strictly to Indonesian (Bahasa Indonesia) while preserving:
1. All technical terms (keep in English)
2. Markdown formatting
3. Code blocks and special characters
4. Section headers structure

Only translate natural language portions. Return the exact same structure with translated text.

Text to translate:
${text}`;

  const errors = [];

  // Try each service in order
  for (const service of API_SERVICES) {
    try {
      console.log(`Attempting translation using ${service.name}...`);

      let data;
      const startTime = Date.now();

      if (service.type === 'gemini') {
        data = await callGeminiAPI(prompt, service.key, service.timeout);
      } else if (service.type === 'openrouter') {
        data = await callOpenRouterAPI(prompt, service.key, service.timeout);
      } else {
        throw new Error(`Unknown service type: ${service.type}`);
      }

      const responseTime = Date.now() - startTime;
      const processedResponse = processResponse(data, service.type);

      console.log(`✅ Successfully translated using ${service.name} in ${responseTime}ms`);

      return processedResponse;

    } catch (error) {
      const errorMessage = `${service.name}: ${error.message}`;
      errors.push(errorMessage);
      console.error(`❌ ${errorMessage}`);

      // Continue to next service
      continue;
    }
  }

  // All services failed
  throw new Error(`All translation services failed. Errors: ${errors.join(' | ')}`);
};

export const generateGameIdea = async (params) => {
  // Validate input parameters
  const validation = validateParams(params);
  if (!validation.isValid) {
    throw new Error(`Invalid parameters: ${validation.errors.join(', ')}`);
  }

  const { sessionId, keywords, platform, timeline, category } = params;
  const prompt = createPrompt({ sessionId, keywords, platform, timeline, category });

  const errors = [];

  // Try each service in order
  for (const service of API_SERVICES) {
    try {
      console.log(`Attempting to use ${service.name}...`);

      let data;
      const startTime = Date.now();

      if (service.type === 'gemini') {
        data = await callGeminiAPI(prompt, service.key, service.timeout);
      } else if (service.type === 'openrouter') {
        data = await callOpenRouterAPI(prompt, service.key, service.timeout);
      } else {
        throw new Error(`Unknown service type: ${service.type}`);
      }

      const responseTime = Date.now() - startTime;
      const processedResponse = processResponse(data, service.type);

      console.log(`✅ Successfully generated idea using ${service.name} in ${responseTime}ms`);

      return {
        success: true,
        data: processedResponse,
        metadata: {
          service: service.name,
          serviceType: service.type,
          responseTime: responseTime,
          sessionId: sessionId,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      const errorMessage = `${service.name}: ${error.message}`;
      errors.push(errorMessage);
      console.error(`❌ ${errorMessage}`);

      // Continue to next service
      continue;
    }
  }

  // All services failed
  throw new Error(`All AI services failed. Errors: ${errors.join(' | ')}`);
};

/**
 * Utility function to test API connectivity
 * @returns {Promise<Object>} Service status report
 */
export const testAPIConnectivity = async () => {
  const results = [];

  for (const service of API_SERVICES) {
    try {
      const testPrompt = "Generate a simple test response.";
      const startTime = Date.now();

      let data;
      if (service.type === 'gemini') {
        data = await callGeminiAPI(testPrompt, service.key, 10000);
      } else if (service.type === 'openrouter') {
        data = await callOpenRouterAPI(testPrompt, service.key, 10000);
      }

      const responseTime = Date.now() - startTime;

      results.push({
        service: service.name,
        status: 'success',
        responseTime: responseTime
      });

    } catch (error) {
      results.push({
        service: service.name,
        status: 'failed',
        error: error.message
      });
    }
  }

  return results;
};

export default { generateGameIdea, testAPIConnectivity };
