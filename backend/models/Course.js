const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
  chapterNo: Number,
  title: String,
  description: String,
  youtubeUrl: String,
  youtubePlaylist: String,
  duration: String,
  topics: [String],
  isCompleted: { type: Boolean, default: false },
  isPlaylist: { type: Boolean, default: false }
});

const courseSchema = new mongoose.Schema({
  class: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  subject: {
    type: String,
    required: true
  },
  subjectCode: String,
  description: String,
  icon: String,
  color: String,
  youtubePlaylist: String, // <-- ADD THIS
  totalChapters: Number,
  chapters: [chapterSchema],
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  enrolledCount: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });
module.exports = mongoose.model('Course', courseSchema);
