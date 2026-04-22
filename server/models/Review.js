const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  restroom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restroom', 
    required: true 
  },
  authorName: { type: String, default: 'Anonymous' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true, maxlength: 500 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Update restroom average rating after saving
ReviewSchema.post('save', async function(doc) {
  const Restroom = mongoose.model('Restroom');
  const restroom = await Restroom.findById(doc.restroom);
  if (restroom) {
    await restroom.updateAverageRating();
  }
});

// Update restroom average rating after removing
ReviewSchema.post('remove', async function(doc) {
  const Restroom = mongoose.model('Restroom');
  const restroom = await Restroom.findById(doc.restroom);
  if (restroom) {
    await restroom.updateAverageRating();
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
