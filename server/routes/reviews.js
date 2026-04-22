const express = require('express');
const router = express.Router();
const { isDBConnected } = require('../config/db');
const memoryStore = require('../data/memoryStore');

let Restroom;
try { Restroom = require('../models/Restroom'); } catch (e) { Restroom = null; }
const useMemory = () => !isDBConnected() || !Restroom;

// POST rating only (1-5 stars)
router.post('/rate/:restroomId', async (req, res) => {
  try {
    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be 1-5' });
    }

    if (useMemory()) {
      const result = memoryStore.submitRating(req.params.restroomId, rating);
      if (!result) return res.status(404).json({ message: 'Restroom not found' });
      const restroom = memoryStore.getRestroomById(req.params.restroomId);
      req.io.emit('ratingUpdate', { restroom });
      return res.status(201).json({ rating: result, restroom });
    }

    // DB mode fallback
    const restroom = await Restroom.findById(req.params.restroomId);
    if (!restroom) return res.status(404).json({ message: 'Not found' });

    const oldTotal = restroom.averageRating * restroom.totalReviews;
    restroom.totalReviews += 1;
    restroom.averageRating = Math.round(((oldTotal + rating) / restroom.totalReviews) * 10) / 10;
    if (rating <= 2) {
      restroom.redAlertCount = (restroom.redAlertCount || 0) + 1;
      if (restroom.redAlertCount >= 2) restroom.redAlert = true;
    }
    await restroom.save();

    req.io.emit('ratingUpdate', { restroom });
    res.status(201).json({ restroom });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
