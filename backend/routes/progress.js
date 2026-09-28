const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const { protect } = require('../middleware/auth');

// @route POST /api/progress/update
router.post('/update', protect, async (req, res) => {
  try {
    const { courseId, chapterNo, class: cls, subject } = req.body;
    let progress = await Progress.findOne({ userId: req.user._id, courseId });
    if (!progress) {
      progress = new Progress({ userId: req.user._id, courseId, class: cls, subject });
    }
    if (!progress.completedChapters.includes(chapterNo)) {
      progress.completedChapters.push(chapterNo);
    }
    progress.lastAccessed = Date.now();
    await progress.save();
    res.json({ success: true, progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/progress/my
router.get('/my', protect, async (req, res) => {
  try {
    const progresses = await Progress.find({ userId: req.user._id }).populate('courseId', 'subject class');
    res.json({ success: true, progresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
