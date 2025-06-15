export const createGameIdeaPrompt = ({ sessionId, keywords, platform, timeline, category }) => {
   return `
==== FRESH GAME GENERATION SESSION ====
SESSION_ID: ${sessionId}
CRITICAL: IGNORE ALL PREVIOUS CONVERSATIONS AND CONTEXTS
ANALYZE ONLY THE KEYWORDS PROVIDED BELOW

ROLE: Unity Game Design Specialist for Solo/Small Team Development

TASK: Generate ONE unique game concept based EXCLUSIVELY on these keywords: "${keywords}"

PARAMETERS:
- Keywords: "${keywords}"
- Platform: ${platform}
- Timeline: ${timeline}
- Category: ${category}

MANDATORY ANALYSIS PROCESS:
1. Read ONLY these keywords: "${keywords}"
2. Identify the UNIQUE ESSENCE of these specific words
3. What activities, behaviors, or interactions do these keywords represent?
4. What emotions or atmospheres do they naturally evoke?
5. Derive game mechanics FROM this essence (not adapt keywords TO existing templates)

OUTPUT STRUCTURE REQUIRED:

Game Concept
Title: [Game name]
Genre: [Primary genre]
Platform: [Unity 2D/3D]
Timeline: [Development timeline]
Target Audience: [Age group and preferences]
Core Hook: [Unique selling point in 1-2 sentences]

Mechanics and Features
Main Game Mechanics
1. [Mechanic name] - [Detailed explanation of how it works]
2. [Mechanic name] - [Detailed explanation of how it works]
3. [Mechanic name] - [Detailed explanation of how it works]

Additional Features
1. [Feature name] - [Implementation details]
2. [Feature name] - [Implementation details]
3. [Feature name] - [Implementation details]

Technical Implementation
Required C# Classes
1. [ClassName].cs
Purpose: [Main responsibility]
Key Methods: [Core functionality]
Dependencies: [Related classes]

2. [ClassName].cs
Purpose: [Main responsibility]
Key Methods: [Core functionality]
Dependencies: [Related classes]

[Continue with 5-7 essential classes]

Required GameObjects
1. [GameObject name]
Components: [List of required components]
Purpose: [Gameplay role]

2. [GameObject name]
Components: [List of required components]
Purpose: [Gameplay role]

Development Schedule
Week 1 - Foundation
Days 1-2: [Specific tasks]
Days 3-4: [Specific tasks]
Days 5-7: [Specific tasks]
Week 1 Goal: [Milestone description]

Week 2 - Core Features
Days 8-10: [Specific tasks]
Days 11-14: [Specific tasks]
Week 2 Goal: [Milestone description]

Week 3 - Polish
Days 15-17: [Specific tasks]
Days 18-21: [Specific tasks]
Week 3 Goal: [Milestone description]

Week 4 - Release
Days 22-24: [Specific tasks]
Days 25-28: [Specific tasks]
Final Goal: [Release milestone]

Level Design
Level 1
Name: [Level name]
Objective: [Level goal]
Mechanics: [Featured gameplay elements]
Duration: [Estimated playtime]

[Continue with levels 2-5]

Store Preparation
App Details
Store Name: [Game title for store]
Description: [Marketing description]
Search Terms: [Store optimization keywords]

Required Files
App Icon: [Icon specifications]
Screenshots: [Required images]
Preview Video: [Video requirements]

Revenue Strategy
Business Model: [Monetization approach]
Price Points: [Pricing details]

Critical Requirements
Essential Features
1. [Feature name] - [Why it's necessary]
2. [Feature name] - [Why it's necessary]
3. [Feature name] - [Why it's necessary]

Risk Management
1. [Risk description] - [How to address it]
2. [Risk description] - [How to address it]
3. [Risk description] - [How to address it]

Technical Goals
Frame Rate: [Target FPS]
Memory Usage: [RAM limits]
Load Times: [Maximum duration]

CRITICAL CONSTRAINTS:
- Focus ONLY on "${keywords}" - no other influences
- All suggestions must be realistic for Unity development
- Timeline must be achievable for selected team size
- Provide specific, actionable implementation guidance

IMPORTANT KEYWORD RULES:
- USE ALL PROVIDED KEYWORDS EXACTLY AS GIVEN, WITH EXACT SPELLING
- DO NOT modify or anglicize keywords (e.g. keep "anomali" as "anomali", not "anomaly")
- Keywords MUST appear in game title, description, or mechanics
- If keywords seem unusual, creatively integrate them into the concept
- Validate keyword presence before finalizing output

==== END CONTEXT ISOLATION ====
`;
};
