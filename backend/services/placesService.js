const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const env = require('../config/env');
const ApiError = require('../utils/apiError');
const historyModel = require('../models/historyModel');

function normalizePlace(element) {
  const tags = element.tags || {};
  const latitude = element.lat || element.center?.lat || null;
  const longitude = element.lon || element.center?.lon || null;

  return {
    id: element.id,
    name: tags.name || tags.tourism || tags.amenity || 'Unnamed place',
    category: tags.tourism || tags.amenity || tags.leisure || 'point_of_interest',
    latitude,
    longitude,
    address: [
      tags['addr:street'],
      tags['addr:housenumber'],
      tags['addr:city'],
    ]
      .filter(Boolean)
      .join(', '),
  };
}

async function getNearbyPlaces({ lat, lng, radius = env.placesRadiusMeters }) {
  if (!lat || !lng) {
    throw new ApiError(400, 'lat and lng are required.');
  }

  const overpassQuery = `
    [out:json];
    (
      node(around:${radius},${lat},${lng})["tourism"];
      way(around:${radius},${lat},${lng})["tourism"];
      relation(around:${radius},${lat},${lng})["tourism"];
      node(around:${radius},${lat},${lng})["amenity"~"restaurant|cafe|museum|place_of_worship"];
      way(around:${radius},${lat},${lng})["amenity"~"restaurant|cafe|museum|place_of_worship"];
    );
    out center 25;
  `;

  const response = await axios.post(env.placesApiUrl, overpassQuery, {
    headers: {
      'Content-Type': 'text/plain',
      'User-Agent': 'Smart-AI-Tourism-Bracelet/1.0',
    },
  });

  const elements = Array.isArray(response.data?.elements) ? response.data.elements : [];
  return elements.map(normalizePlace);
}

async function recordVisitedPlace({ user, placeName, lat, lng, notes }) {
  if (!placeName) {
    throw new ApiError(400, 'placeName is required.');
  }

  const entry = {
    id: uuidv4(),
    userId: user ? user.id : null,
    placeName,
    lat: lat || null,
    lng: lng || null,
    notes: notes || null,
    visitedAt: new Date().toISOString(),
  };

  await historyModel.addVisitedPlace(entry);
  return entry;
}

module.exports = {
  getNearbyPlaces,
  recordVisitedPlace,
};
