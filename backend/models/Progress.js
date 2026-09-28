const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  class: Number,
  subject: String,
  completedChapters: [Number],
  progressPercent: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
  timeSpent: { type: Number, default: 0 }, // minutes
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
