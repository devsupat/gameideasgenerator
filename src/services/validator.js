export const validateResponse = (responseText, keywords) => {
    if (!responseText || !keywords) {
        return { valid: false, warning: 'Missing response or keywords' };
    }

    console.log('Validating response with keywords:', keywords);
    const lowerResponse = responseText.toLowerCase();
    const keywordList = keywords.toLowerCase().split(/[,\s]+/).filter(Boolean);

    // Track keyword presence and counts with exact matching
    const keywordResults = keywordList.map(keyword => {
        // Escape special characters for regex
        const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedKeyword, 'gi');
        const matches = lowerResponse.match(regex); // Use lowercase response
        console.log(`Keyword: "${keyword}", Regex: ${regex}, Matches: ${matches ? matches.length : 0}`);
        return {
            keyword,
            found: matches !== null,
            count: matches ? matches.length : 0
        };
    });

    const missingKeywords = keywordResults
        .filter(k => !k.found)
        .map(k => k.keyword);

    // Check for minimum keyword usage
    const underusedKeywords = keywordResults
        .filter(k => k.count < 1)
        .map(k => k.keyword);

    // Validate structure
    const hasRequiredSections = [
        'GAME CONCEPT OVERVIEW',
        'UNITY IMPLEMENTATION',
        'DEVELOPMENT ROADMAP',
        'SCOPE & FEASIBILITY'
    ].every(section => responseText.includes(section));

    const valid = missingKeywords.length === 0 &&
        underusedKeywords.length === 0 &&
        hasRequiredSections;

    // Generate detailed warnings
    const warnings = [];
    if (missingKeywords.length > 0) {
        warnings.push(`Missing keywords: ${missingKeywords.join(', ')}`);
    }
    if (underusedKeywords.length > 0) {
        warnings.push(`Underused keywords: ${underusedKeywords.join(', ')}`);
    }
    if (!hasRequiredSections) {
        warnings.push('Response is missing required sections');
    }

    return {
        valid,
        warning: warnings.join(' | '),
        keywordResults
    };
};
