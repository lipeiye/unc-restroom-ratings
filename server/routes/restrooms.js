const express = require('express');
const router = express.Router();
const Restroom = require('../models/Restroom');

// GET all restrooms
router.get('/', async (req, res) => {
  try {
    const { building, minRating, search } = req.query;
    let query = {};

    if (building) query.building = building;
    if (minRating) query.averageRating = { $gte: parseFloat(minRating) };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { building: { $regex: search, $options: 'i' } }
      ];
    }

    const restrooms = await Restroom.find(query).sort({ averageRating: -1 });
    res.json(restrooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single restroom
router.get('/:id', async (req, res) => {
  try {
    const restroom = await Restroom.findById(req.params.id);
    if (!restroom) return res.status(404).json({ message: 'Restroom not found' });
    res.json(restroom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET all unique buildings
router.get('/buildings/list', async (req, res) => {
  try {
    const buildings = await Restroom.distinct('building');
    res.json(buildings.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST seed data (for initial setup)
router.post('/seed', async (req, res) => {
  try {
    const seedData = req.body;
    await Restroom.deleteMany({});
    const restrooms = await Restroom.insertMany(seedData);
    res.json({ message: `Seeded ${restrooms.length} restrooms` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
