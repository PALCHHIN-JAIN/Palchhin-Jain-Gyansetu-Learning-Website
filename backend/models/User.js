const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  class: {
    type: Number,
    required: [true, 'Class is required'],
    min: 1,
    max: 12
  },
  avatar: {
    type: String,
    default: ''
  },
  preferredLanguage: {
    type: String,
    default: 'en',
    enum: ['en', 'hi', 'bn', 'te', 'mr', 'ta', 'gu', 'kn', 'pa', 'or']
  },
  enrolledCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrolledAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],
  quizHistory: [{
    subject: String,
    class: Number,
    chapter: String,
    score: Number,
    total: Number,
    date: { type: Date, default: Date.now }
  }],
  totalPoints: { type: Number, default: 0 },
  badge: { type: String, default: 'Beginner' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Update badge based on points
userSchema.methods.updateBadge = function() {
  if (this.totalPoints >= 1000) this.badge = 'Scholar';
  else if (this.totalPoints >= 500) this.badge = 'Advanced';
  else if (this.totalPoints >= 200) this.badge = 'Learner';
  else this.badge = 'Beginner';
};

module.exports = mongoose.model('User', userSchema);
