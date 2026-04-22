const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Restroom = require('../models/Restroom');

// GET reviews for a restroom
router.get('/:restroomId', async (req, res) => {
  try {
    const reviews = await Review.find({ restroom: req.params.restroomId })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new review
router.post('/:restroomId', async (req, res) => {
  try {
    const { authorName, rating, content, tags } = req.body;
    
    const review = new Review({
      restroom: req.params.restroomId,
      authorName: authorName || 'Anonymous',
      rating,
      content,
      tags: tags || []
    });

    await review.save();

    // Emit real-time update
    const updatedRestroom = await Restroom.findById(req.params.restroomId);
    req.io.emit('newReview', { 
      restroomId: req.params.restroomId,
      review,
      restroomUpdate: {
        averageRating: updatedRestroom.averageRating,
        totalReviews: updatedRestroom.totalReviews
      }
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE a review
router.delete('/:reviewId', async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
