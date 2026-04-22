const express = require('express');
const router = express.Router();
const { isDBConnected, isSQLiteConnected } = require('../config/db');
const memoryStore = require('../data/memoryStore');
const sqliteStore = require('../data/sqliteStore');

let Restroom;
try { Restroom = require('../models/Restroom'); } catch (e) { Restroom = null; }

const useMemory = () => !isDBConnected() && !isSQLiteConnected();
const useSQLite = () => !isDBConnected() && isSQLiteConnected();

// POST star rating (1-5)
router.post('/rate/:restroomId', async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }

    if (useMemory()) {
      const result = memoryStore.submitRating(req.params.restroomId, rating);
      if (!result) return res.status(404).json({ message: 'Restroom not found' });
      req.io.emit('ratingUpdate', { restroom: result.restroom });
      return res.status(201).json(result);
    }

    if (useSQLite()) {
      const result = await sqliteStore.submitRating(req.params.restroomId, rating);
      if (!result) return res.status(404).json({ message: 'Restroom not found' });
      req.io.emit('ratingUpdate', { restroom: result.restroom });
      return res.status(201).json(result);
    }

    // DB fallback
    const restroom = await Restroom.findById(req.params.restroomId);
    if (!restroom) return res.status(404).json({ message: 'Not found' });

    const oldTotal = restroom.averageRating * restroom.totalReviews;
    restroom.totalReviews += 1;
    restroom.averageRating = Math.round(((oldTotal + rating) / restroom.totalReviews) * 10) / 10;
    restroom.pooperScore = Math.min(5, Math.round((restroom.averageRating * 0.9) * 10) / 10);
    restroom.cleanliness = Math.min(5, Math.round((restroom.averageRating * 0.95) * 10) / 10);

    if (rating <= 2) {
      restroom.redAlertCount = (restroom.redAlertCount || 0) + 1;
      if (restroom.redAlertCount >= 2) restroom.redAlert = true;
    }
    await restroom.save();

    req.io.emit('ratingUpdate', { restroom });
    res.status(201).json({ rating: { rating }, restroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST no-flush red alert
router.post('/noflush/:restroomId', async (req, res) => {
  try {
    if (useMemory()) {
      const alert = memoryStore.triggerNoFlushAlert(req.params.restroomId);
      if (!alert) return res.status(404).json({ message: 'Restroom not found' });
      const restroom = memoryStore.getRestroomById(req.params.restroomId);
      req.io.emit('ratingUpdate', { restroom });
      return res.status(201).json({ alert, restroom });
    }

    if (useSQLite()) {
      const result = await sqliteStore.triggerNoFlushAlert(req.params.restroomId);
      if (!result) return res.status(404).json({ message: 'Restroom not found' });
      req.io.emit('ratingUpdate', { restroom: result.restroom });
      return res.status(201).json({ alert: result.alert, restroom: result.restroom });
    }

    const restroom = await Restroom.findById(req.params.restroomId);
    if (!restroom) return res.status(404).json({ message: 'Not found' });

    restroom.noFlushCount = (restroom.noFlushCount || 0) + 1;
    restroom.redAlert = true;
    restroom.redAlertCount = Math.max(restroom.redAlertCount || 0, 2);
    await restroom.save();

    req.io.emit('ratingUpdate', { restroom });
    res.status(201).json({ alert: { type: 'no-flush' }, restroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
