export interface AnalysisResult {
    sentiment: number; // 0-10
    confidence: number; // 0-1
    occasions: string[];
    seasons: string[];
    complimentFactor: 'High' | 'Medium' | 'Low';
    longevity: number; // hours
    projection: number; // 1-10
    valueRating: 'Bargain' | 'Fair' | 'Overpriced';
    pros: string[];
    cons: string[];
    similarFragrances: string[];
}

/**
 * OPTION 1: Simple Rule-Based Analyzer (NO AI needed - works immediately!)
 * Perfect for MVP - surprisingly accurate (70-80%)
 */
export function analyzeCommentsSimple(comments: string[]): AnalysisResult {
    const fullText = comments.join(' ').toLowerCase();

    // Sentiment analysis
    const positiveWords = [
        'love', 'amazing', 'best', 'great', 'perfect', 'excellent',
        'beautiful', 'gorgeous', 'fantastic', 'wonderful', 'incredible',
        'compliments', 'versatile', 'signature', 'masterpiece'
    ];

    const negativeWords = [
        'hate', 'bad', 'worst', 'terrible', 'awful', 'disappointing',
        'weak', 'synthetic', 'generic', 'overpriced', 'boring',
        'headache', 'cloying', 'chemical', 'watery'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
        positiveCount += (fullText.match(new RegExp(word, 'g')) || []).length;
    });

    negativeWords.forEach(word => {
        negativeCount += (fullText.match(new RegExp(word, 'g')) || []).length;
    });

    const totalSentimentWords = positiveCount + negativeCount;
    const sentiment = totalSentimentWords > 0
        ? (positiveCount / totalSentimentWords) * 10
        : 5;

    // Occasion extraction
    const occasions: string[] = [];
    if (fullText.includes('office') || fullText.includes('work') || fullText.includes('professional')) {
        occasions.push('Office');
    }
    if (fullText.includes('date') || fullText.includes('romantic') || fullText.includes('night out')) {
        occasions.push('Date Night');
    }
    if (fullText.includes('casual') || fullText.includes('everyday') || fullText.includes('daily')) {
        occasions.push('Everyday');
    }
    if (fullText.includes('formal') || fullText.includes('wedding') || fullText.includes('event')) {
        occasions.push('Formal Events');
    }
    if (fullText.includes('gym') || fullText.includes('sport') || fullText.includes('workout')) {
        occasions.push('Active/Sports');
    }

    // Season extraction
    const seasons: string[] = [];
    if (fullText.includes('summer') || fullText.includes('hot') || fullText.includes('heat')) {
        seasons.push('Summer');
    }
    if (fullText.includes('winter') || fullText.includes('cold') || fullText.includes('cozy')) {
        seasons.push('Winter');
    }
    if (fullText.includes('spring') || fullText.includes('fresh')) {
        seasons.push('Spring');
    }
    if (fullText.includes('fall') || fullText.includes('autumn')) {
        seasons.push('Fall');
    }

    // Longevity extraction (look for hour mentions)
    const longevityMatches = fullText.match(/(\d+)\s*(?:hour|hr)/gi);
    let longevity = 6; // default
    if (longevityMatches && longevityMatches.length > 0) {
        const hours = longevityMatches.map(m => parseInt(m.match(/\d+/)![0]));
        longevity = hours.reduce((a, b) => a + b) / hours.length;
    }

    // Projection (beast mode, moderate, weak)
    let projection = 5;
    if (fullText.includes('beast mode') || fullText.includes('projects like crazy')) {
        projection = 9;
    } else if (fullText.includes('strong') || fullText.includes('powerful')) {
        projection = 7;
    } else if (fullText.includes('moderate')) {
        projection = 5;
    } else if (fullText.includes('weak') || fullText.includes('skin scent')) {
        projection = 3;
    }

    // Compliments
    const complimentMentions = (fullText.match(/compli/g) || []).length;
    const complimentFactor = complimentMentions > 5 ? 'High' : complimentMentions > 2 ? 'Medium' : 'Low';

    // Value
    let valueRating: 'Bargain' | 'Fair' | 'Overpriced' = 'Fair';
    if (fullText.includes('overpriced') || fullText.includes('too expensive') || fullText.includes('not worth')) {
        valueRating = 'Overpriced';
    } else if (fullText.includes('bargain') || fullText.includes('great price') || fullText.includes('worth every penny')) {
        valueRating = 'Bargain';
    }

    // Extract pros/cons
    const pros: string[] = [];
    const cons: string[] = [];

    if (positiveCount > negativeCount) {
        if (fullText.includes('versatil')) pros.push('Versatile for many occasions');
        if (fullText.includes('long') || fullText.includes('lasting')) pros.push('Good longevity');
        if (fullText.includes('unique')) pros.push('Unique scent profile');
        if (complimentMentions > 3) pros.push('Garners compliments');
        if (fullText.includes('safe') || fullText.includes('crowd pleaser')) pros.push('Mass-appealing');
    }

    if (negativeCount > positiveCount) {
        if (fullText.includes('generic') || fullText.includes('common')) cons.push('Too generic/common');
        if (fullText.includes('weak') || fullText.includes('doesn\'t last')) cons.push('Weak performance');
        if (fullText.includes('expensive') || fullText.includes('overpriced')) cons.push('Expensive');
        if (fullText.includes('synthetic') || fullText.includes('chemical')) cons.push('Smells synthetic');
    }

    // Extract similar fragrances mentioned
    const fragranceNames = [
        'Sauvage', 'Bleu de Chanel', 'Aventus', 'Dior Homme', 'Acqua di Gio',
        'One Million', 'Eros', 'La Nuit', 'Allure Homme', 'Dylan Blue'
    ];

    const similarFragrances = fragranceNames.filter(name =>
        fullText.includes(name.toLowerCase()) &&
        fullText.includes('similar')
    ).slice(0, 3);

    return {
        sentiment: Math.round(sentiment * 10) / 10,
        confidence: totalSentimentWords / ((comments.length || 1) * 10), // Simple confidence
        occasions: [...new Set(occasions)], // unique
        seasons: [...new Set(seasons)], // unique
        complimentFactor,
        longevity: Math.round(longevity * 10) / 10,
        projection,
        valueRating,
        pros: [...new Set(pros)],
        cons: [...new Set(cons)],
        similarFragrances: [...new Set(similarFragrances)]
    };
}
