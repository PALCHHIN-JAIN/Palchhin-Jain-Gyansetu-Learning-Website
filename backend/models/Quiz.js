const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const quizSchema = new mongoose.Schema({
  class: { type: Number, required: true, min: 1, max: 12 },
  subject: { type: String, required: true },
  title: String, // ← ADD THIS
  questions: [questionSchema],
  totalQuestions: Number,
  timeLimit: { type: Number, default: 15 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);