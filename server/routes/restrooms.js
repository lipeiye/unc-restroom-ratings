const express = require('express');
const router = express.Router();
const { isDBConnected } = require('../config/db');
const memoryStore = require('../data/memoryStore');

let Restroom;
try { Restroom = require('../models/Restroom'); } catch (e) { Restroom = null; }
const useMemory = () => !isDBConnected() || !Restroom;

// GET all restrooms (sorted: redAlert first, then rating)
router.get('/', async (req, res) => {
  try {
    if (useMemory()) return res.json(memoryStore.getAllRestrooms());
    const restrooms = await Restroom.find().sort({ redAlert: -1, averageRating: -1 });
    res.json(restrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single restroom
router.get('/:id', async (req, res) => {
  try {
    if (useMemory()) {
      const restroom = memoryStore.getRestroomById(req.params.id);
      if (!restroom) return res.status(404).json({ message: 'Not found' });
      return res.json(restroom);
    }
    const restroom = await Restroom.findById(req.params.id);
    if (!restroom) return res.status(404).json({ message: 'Not found' });
    res.json(restroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET buildings list
router.get('/meta/buildings', async (req, res) => {
  try {
    if (useMemory()) return res.json(memoryStore.getBuildings());
    const buildings = await Restroom.distinct('building');
    res.json(buildings.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET last reset time
router.get('/meta/last-reset', async (req, res) => {
  try {
    res.json({ lastReset: memoryStore.getLastResetTime() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
