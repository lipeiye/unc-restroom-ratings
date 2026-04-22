const { UNC_RESTROOMS } = require('./uncRestrooms');

let restrooms = [];
let nextId = 1;
let lastResetTime = null;

function initRestrooms() {
  restrooms = UNC_RESTROOMS.map((r) => ({
    _id: `r-${nextId++}`,
    name: r.name,
    building: r.building,
    floor: r.floor,
    description: r.description,
    location: r.location,
    averageRating: 0,
    totalReviews: 0,
    pooperScore: 0,
    cleanliness: 0,
    redAlert: false,
    redAlertCount: 0,
    noFlushCount: 0,
    lastUpdated: null,
    createdAt: new Date().toISOString()
  }));
  lastResetTime = new Date().toISOString();
}

initRestrooms();

function getAllRestrooms() {
  return [...restrooms].sort((a, b) => {
    if (a.redAlert !== b.redAlert) return b.redAlert - a.redAlert;
    return b.averageRating - a.averageRating;
  });
}

function getRestroomById(id) {
  return restrooms.find(r => r._id === id);
}

function getBuildings() {
  return [...new Set(restrooms.map(r => r.building))].sort();
}

function createRestroom({ name, building, floor, description }) {
  const restroom = {
    _id: `r-${nextId++}`,
    name: name || `Floor ${floor} Restroom`,
    building,
    floor,
    description: description || `Restroom at ${building}, Floor ${floor}.`,
    location: { lat: 35.9095 + (Math.random() - 0.5) * 0.01, lng: -79.0475 + (Math.random() - 0.5) * 0.01 },
    averageRating: 0,
    totalReviews: 0,
    pooperScore: 0,
    cleanliness: 0,
    redAlert: false,
    redAlertCount: 0,
    noFlushCount: 0,
    lastUpdated: null,
    createdAt: new Date().toISOString()
  };
  restrooms.push(restroom);
  return restroom;
}

function submitRating(restroomId, rating) {
  const restroom = getRestroomById(restroomId);
  if (!restroom) return null;

  const oldTotal = restroom.averageRating * restroom.totalReviews;
  restroom.totalReviews += 1;
  restroom.averageRating = Math.round(((oldTotal + rating) / restroom.totalReviews) * 10) / 10;

  restroom.pooperScore = Math.min(5, Math.round((restroom.averageRating * 0.9) * 10) / 10);
  restroom.cleanliness = Math.min(5, Math.round((restroom.averageRating * 0.95) * 10) / 10);

  if (rating <= 2) {
    restroom.redAlertCount += 1;
    if (restroom.redAlertCount >= 2) restroom.redAlert = true;
  }

  restroom.lastUpdated = new Date().toISOString();
  return { rating, restroom };
}

function triggerNoFlushAlert(restroomId) {
  const restroom = getRestroomById(restroomId);
  if (!restroom) return null;

  restroom.noFlushCount += 1;
  restroom.redAlert = true;
  restroom.redAlertCount = Math.max(restroom.redAlertCount, 2);
  restroom.lastUpdated = new Date().toISOString();

  return {
    _id: `alert-${Date.now()}`,
    restroom: restroomId,
    type: 'no-flush',
    createdAt: new Date().toISOString()
  };
}

function resetAllData() {
  initRestrooms();
  return { message: 'All data reset', resetAt: lastResetTime };
}

function getLastResetTime() {
  return lastResetTime;
}

module.exports = {
  getAllRestrooms,
  getRestroomById,
  getBuildings,
  createRestroom,
  submitRating,
  triggerNoFlushAlert,
  resetAllData,
  getLastResetTime
};
