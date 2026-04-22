const mongoose = require('mongoose');

const RestroomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  building: { type: String, required: true },
  floor: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  description: { type: String, default: '' },
  amenities: {
    handicapAccessible: { type: Boolean, default: false },
    changingTable: { type: Boolean, default: false },
    freePadsTampons: { type: Boolean, default: false },
    airDryer: { type: Boolean, default: false },
    paperTowels: { type: Boolean, default: false }
  },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Update average rating when reviews change
RestroomSchema.methods.updateAverageRating = async function() {
  const Review = mongoose.model('Review');
  const result = await Review.aggregate([
    { $match: { restroom: this._id } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  
  if (result.length > 0) {
    this.averageRating = Math.round(result[0].avgRating * 10) / 10;
    this.totalReviews = result[0].count;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  await this.save();
};

module.exports = mongoose.model('Restroom', RestroomSchema);
