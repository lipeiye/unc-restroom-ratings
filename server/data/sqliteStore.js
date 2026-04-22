const { getDB } = require('../config/sqlite');
const { UNC_RESTROOMS } = require('./uncRestrooms');

function db() {
  return getDB();
}

function getMeta(key) {
  return new Promise((resolve, reject) => {
    db().get('SELECT value FROM metadata WHERE key = ?', [key], (err, row) => {
      if (err) return reject(err);
      resolve(row ? row.value : null);
    });
  });
}

function setMeta(key, value) {
  return new Promise((resolve, reject) => {
    db().run('INSERT OR REPLACE INTO metadata (key, value) VALUES (?, ?)', [key, value], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function getNextId() {
  const val = await getMeta('nextId');
  const next = parseInt(val || '1', 10);
  await setMeta('nextId', String(next + 1));
  return next;
}

async function initRestrooms() {
  const stmt = db().prepare(`
    INSERT OR REPLACE INTO restrooms
    (_id, name, building, floor, description, lat, lng, averageRating, totalReviews, pooperScore, cleanliness, redAlert, redAlertCount, noFlushCount, lastUpdated, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let id = 1;
  for (const r of UNC_RESTROOMS) {
    const _id = `r-${id++}`;
    stmt.run(
      _id, r.name, r.building, r.floor, r.description,
      r.location.lat, r.location.lng,
      0, 0, 0, 0, 0, 0, 0,
      null, new Date().toISOString()
    );
  }
  stmt.finalize();

  await setMeta('nextId', String(id));
  await setMeta('lastReset', new Date().toISOString());
}

async function seedIfEmpty() {
  const count = await new Promise((resolve, reject) => {
    db().get('SELECT COUNT(*) as count FROM restrooms', (err, row) => {
      if (err) return reject(err);
      resolve(row.count);
    });
  });

  if (count === 0) {
    await initRestrooms();
  }
}

function getAllRestrooms() {
  return new Promise((resolve, reject) => {
    db().all('SELECT * FROM restrooms ORDER BY redAlert DESC, averageRating DESC', (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(rowToRestroom));
    });
  });
}

function getRestroomById(id) {
  return new Promise((resolve, reject) => {
    db().get('SELECT * FROM restrooms WHERE _id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row ? rowToRestroom(row) : null);
    });
  });
}

function getBuildings() {
  return new Promise((resolve, reject) => {
    db().all('SELECT DISTINCT building FROM restrooms ORDER BY building', (err, rows) => {
      if (err) return reject(err);
      resolve(rows.map(r => r.building));
    });
  });
}

async function createRestroom({ name, building, floor, description }) {
  const _id = `r-${await getNextId()}`;
  const restroom = {
    _id,
    name: name || `Floor ${floor} Restroom`,
    building,
    floor,
    description: description || `Restroom at ${building}, Floor ${floor}.`,
    location: {
      lat: 35.9095 + (Math.random() - 0.5) * 0.01,
      lng: -79.0475 + (Math.random() - 0.5) * 0.01
    },
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

  return new Promise((resolve, reject) => {
    db().run(`
      INSERT INTO restrooms (_id, name, building, floor, description, lat, lng, averageRating, totalReviews, pooperScore, cleanliness, redAlert, redAlertCount, noFlushCount, lastUpdated, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      restroom._id, restroom.name, restroom.building, restroom.floor, restroom.description,
      restroom.location.lat, restroom.location.lng,
      restroom.averageRating, restroom.totalReviews, restroom.pooperScore, restroom.cleanliness,
      restroom.redAlert ? 1 : 0, restroom.redAlertCount, restroom.noFlushCount,
      restroom.lastUpdated, restroom.createdAt
    ], (err) => {
      if (err) return reject(err);
      resolve(restroom);
    });
  });
}

async function submitRating(restroomId, rating) {
  const restroom = await getRestroomById(restroomId);
  if (!restroom) return null;

  const oldTotal = restroom.averageRating * restroom.totalReviews;
  const totalReviews = restroom.totalReviews + 1;
  const averageRating = Math.round(((oldTotal + rating) / totalReviews) * 10) / 10;
  const pooperScore = Math.min(5, Math.round((averageRating * 0.9) * 10) / 10);
  const cleanliness = Math.min(5, Math.round((averageRating * 0.95) * 10) / 10);

  let redAlertCount = restroom.redAlertCount;
  let redAlert = restroom.redAlert;
  if (rating <= 2) {
    redAlertCount += 1;
    if (redAlertCount >= 2) redAlert = true;
  }

  const lastUpdated = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db().run(`
      UPDATE restrooms
      SET averageRating = ?, totalReviews = ?, pooperScore = ?, cleanliness = ?,
          redAlert = ?, redAlertCount = ?, lastUpdated = ?
      WHERE _id = ?
    `, [averageRating, totalReviews, pooperScore, cleanliness, redAlert ? 1 : 0, redAlertCount, lastUpdated, restroomId], async (err) => {
      if (err) return reject(err);
      const updated = await getRestroomById(restroomId);
      resolve({ rating, restroom: updated });
    });
  });
}

async function triggerNoFlushAlert(restroomId) {
  const restroom = await getRestroomById(restroomId);
  if (!restroom) return null;

  const noFlushCount = restroom.noFlushCount + 1;
  const redAlert = true;
  const redAlertCount = Math.max(restroom.redAlertCount, 2);
  const lastUpdated = new Date().toISOString();

  return new Promise((resolve, reject) => {
    db().run(`
      UPDATE restrooms
      SET noFlushCount = ?, redAlert = ?, redAlertCount = ?, lastUpdated = ?
      WHERE _id = ?
    `, [noFlushCount, redAlert ? 1 : 0, redAlertCount, lastUpdated, restroomId], async (err) => {
      if (err) return reject(err);
      const updated = await getRestroomById(restroomId);
      resolve({
        alert: {
          _id: `alert-${Date.now()}`,
          restroom: restroomId,
          type: 'no-flush',
          createdAt: new Date().toISOString()
        },
        restroom: updated
      });
    });
  });
}

async function resetAllData() {
  return new Promise((resolve, reject) => {
    db().run('DELETE FROM restrooms', async (err) => {
      if (err) return reject(err);
      await initRestrooms();
      resolve({ message: 'All data reset', resetAt: await getLastResetTime() });
    });
  });
}

async function getLastResetTime() {
  return getMeta('lastReset');
}

function rowToRestroom(row) {
  return {
    _id: row._id,
    name: row.name,
    building: row.building,
    floor: row.floor,
    description: row.description,
    location: { lat: row.lat, lng: row.lng },
    averageRating: row.averageRating,
    totalReviews: row.totalReviews,
    pooperScore: row.pooperScore,
    cleanliness: row.cleanliness,
    redAlert: !!row.redAlert,
    redAlertCount: row.redAlertCount,
    noFlushCount: row.noFlushCount,
    lastUpdated: row.lastUpdated,
    createdAt: row.createdAt
  };
}

module.exports = {
  seedIfEmpty,
  getAllRestrooms,
  getRestroomById,
  getBuildings,
  createRestroom,
  submitRating,
  triggerNoFlushAlert,
  resetAllData,
  getLastResetTime
};
