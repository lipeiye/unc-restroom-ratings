const { UNC_RESTROOMS } = require('./uncRestrooms');

let restrooms = [];
let nextId = 1;
let lastResetTime = null;

function initRestrooms() {
  restrooms = UNC_RESTROOMS.map((r) => ({
    _id: `r-${nextId++}`,
    ...r,
    averageRating: 0,
    totalReviews: 0,
    redAlert: false,
    redAlertCount: 0,
    lastUpdated: null,
    createdAt: new Date().toISOString()
  }));
  lastResetTime = new Date().toISOString();
}

initRestrooms();

function getAllRestrooms() {
  // Sort: redAlert first, then by averageRating desc
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

function submitRating(restroomId, rating) {
  const restroom = getRestroomById(restroomId);
  if (!restroom) return null;

  // Update average
  const oldTotal = restroom.averageRating * restroom.totalReviews;
  restroom.totalReviews += 1;
  restroom.averageRating = Math.round(((oldTotal + rating) / restroom.totalReviews) * 10) / 10;
  restroom.lastUpdated = new Date().toISOString();

  // Red alert logic: rating <= 2 triggers red alert
  if (rating <= 2) {
    restroom.redAlertCount += 1;
    if (restroom.redAlertCount >= 2) {
      restroom.redAlert = true;
    }
  }

  return {
    _id: `rating-${Date.now()}`,
    restroom: restroomId,
    rating,
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
  submitRating,
  resetAllData,
  getLastResetTime
};
