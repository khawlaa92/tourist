const { v4: uuidv4 } = require('uuid');
const placesService = require('./placesService');
const openaiService = require('./openaiService');
const historyModel = require('../models/historyModel');
const ApiError = require('../utils/apiError');

function scorePlace(place, preferences = []) {
  const normalizedPreferences = preferences.map((item) => String(item).toLowerCase());
  const haystack = `${place.name} ${place.category}`.toLowerCase();

  return normalizedPreferences.reduce((score, preference) => {
    return haystack.includes(preference) ? score + 1 : score;
  }, 0);
}

async function recommend({ user, lat, lng, preferences = [] }) {
  if (!lat || !lng) {
    throw new ApiError(400, 'lat and lng are required.');
  }

  const places = await placesService.getNearbyPlaces({ lat, lng });
  const rankedPlaces = [...places]
    .map((place) => ({
      ...place,
      score: scorePlace(place, preferences),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  let explanation =
    'Recommendations were prioritized based on the nearby tourism places and your stated preferences.';

  if (rankedPlaces.length > 0) {
    try {
      explanation = await openaiService.generateChatResponse({
        systemPrompt:
          'You are a tourism recommendation assistant. Summarize why these nearby places match the user preferences in 3 concise sentences.',
        userMessage: JSON.stringify({
          preferences,
          places: rankedPlaces.map((place) => ({
            name: place.name,
            category: place.category,
          })),
        }),
      });
    } catch (_error) {
      // Keep the recommendation flow available even if OpenAI is unavailable.
    }
  }

  const payload = {
    id: uuidv4(),
    userId: user ? user.id : null,
    preferences,
    results: rankedPlaces,
    explanation,
    createdAt: new Date().toISOString(),
  };

  await historyModel.addRecommendation(payload);
  return payload;
}

module.exports = {
  recommend,
};
