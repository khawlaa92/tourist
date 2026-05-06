const historyModel = require('../models/historyModel');

async function getStats() {
  const history = await historyModel.getHistoryStore();

  const languageSet = new Set();
  history.translations.forEach((item) => {
    if (item.sourceLanguage) {
      languageSet.add(item.sourceLanguage);
    }

    if (item.targetLanguage) {
      languageSet.add(item.targetLanguage);
    }
  });

  const uniqueVisitedPlaces = [
    ...new Set(history.visitedPlaces.map((place) => place.placeName).filter(Boolean)),
  ];

  return {
    totalMessages: history.chatMessages.length,
    totalTranslations: history.translations.length,
    languagesUsed: Array.from(languageSet),
    visitedPlaces: uniqueVisitedPlaces,
    totalRecommendations: history.recommendations.length,
    lastUpdatedAt: new Date().toISOString(),
  };
}

module.exports = {
  getStats,
};
