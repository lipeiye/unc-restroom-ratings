const express = require('express');
const router = express.Router();
const { isDBConnected, isSQLiteConnected } = require('../config/db');
const memoryStore = require('../data/memoryStore');
const sqliteStore = require('../data/sqliteStore');

let Restroom;
try { Restroom = require('../models/Restroom'); } catch (e) { Restroom = null; }

const useMemory = () => !isDBConnected() && !isSQLiteConnected();
const useSQLite = () => !isDBConnected() && isSQLiteConnected();

// GET all restrooms (sorted: redAlert first, then rating)
router.get('/', async (req, res) => {
  try {
    if (useMemory()) return res.json(memoryStore.getAllRestrooms());
    if (useSQLite()) return res.json(await sqliteStore.getAllRestrooms());

    const restrooms = await Restroom.find().sort({ redAlert: -1, averageRating: -1 });
    res.json(restrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new restroom
router.post('/', async (req, res) => {
  try {
    const { name, building, floor, description } = req.body;
    if (!building || !floor) {
      return res.status(400).json({ message: 'Building and floor are required' });
    }

    if (useMemory()) {
      const restroom = memoryStore.createRestroom({ name, building, floor, description });
      return res.status(201).json(restroom);
    }
    if (useSQLite()) {
      const restroom = await sqliteStore.createRestroom({ name, building, floor, description });
      return res.status(201).json(restroom);
    }

    const restroom = new Restroom({ name, building, floor, description });
    await restroom.save();
    res.status(201).json(restroom);
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
    if (useSQLite()) {
      const restroom = await sqliteStore.getRestroomById(req.params.id);
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
    if (useSQLite()) return res.json(await sqliteStore.getBuildings());

    const buildings = await Restroom.distinct('building');
    res.json(buildings.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET last reset time
router.get('/meta/last-reset', async (req, res) => {
  try {
    if (useMemory()) return res.json({ lastReset: memoryStore.getLastResetTime() });
    if (useSQLite()) return res.json({ lastReset: await sqliteStore.getLastResetTime() });

    res.json({ lastReset: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
