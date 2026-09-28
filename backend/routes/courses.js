const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

// ============================================
// @route   GET /api/courses
// @desc    Get all courses OR filter by class
// ============================================
router.get('/', async (req, res) => {
  try {
    const { class: cls } = req.query;
    const filter = cls ? { class: parseInt(cls) } : {};

    const courses = await Course.find(filter).select('-chapters');

    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// @route   GET /api/courses/class/:classNum
// @desc    Get courses by class
// ============================================
router.get('/class/:classNum', async (req, res) => {
  try {
    const courses = await Course.find({
      class: parseInt(req.params.classNum)
    });

    res.json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// @route   GET /api/courses/:id
// @desc    Get single course with chapters
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// @route   POST /api/courses/seed
// @desc    Seed initial course data
// ============================================
router.post('/seed', async (req, res) => {
  try {
    await Course.deleteMany({});
    const coursesData = generateCoursesData();
    await Course.insertMany(coursesData);

    res.json({
      success: true,
      message: `${coursesData.length} courses seeded successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============================================
// Generate All Courses Data
// ============================================
function generateCoursesData() {
  const courses = [];

  // Class 1-5
  const primarySubjects = ['Mathematics', 'English', 'Hindi', 'Environmental Science', 'General Knowledge'];
  const primaryColors = ['#16a34a', '#059669', '#047857', '#065f46', '#166534'];

  for (let cls = 1; cls <= 5; cls++) {
    primarySubjects.forEach((subject, idx) => {
      courses.push({
        class: cls,
        subject,
        subjectCode: subject.substring(0, 3).toUpperCase(),
        description: `${subject} for Class ${cls}`,
        color: primaryColors[idx],
        difficulty: 'Easy',
        totalChapters: 5,
        chapters: generatePrimaryChapters(cls, subject)
      });
    });
  }

  // Class 6-8
  const middleSubjects = ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Sanskrit'];
  for (let cls = 6; cls <= 8; cls++) {
    middleSubjects.forEach((subject, idx) => {
      courses.push({
        class: cls,
        subject,
        subjectCode: subject.substring(0, 3).toUpperCase(),
        description: `${subject} for Class ${cls}`,
        color: primaryColors[idx % primaryColors.length],
        difficulty: 'Medium',
        totalChapters: 14,
        chapters: generateMiddleChapters(cls, subject)
      });
    });
  }

  // Class 9-10
  const secondarySubjects = ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi'];
  for (let cls = 9; cls <= 10; cls++) {
    secondarySubjects.forEach((subject, idx) => {
      courses.push({
        class: cls,
        subject,
        subjectCode: subject.substring(0, 3).toUpperCase(),
        description: `${subject} for Class ${cls} Board Preparation`,
        color: primaryColors[idx % primaryColors.length],
        difficulty: 'Medium',
        totalChapters: 15,
        chapters: generateSecondaryChapters(cls, subject)
      });
    });
  }

  // Class 11-12
  const seniorSubjects = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Political Science', 'Hindi'];

  for (let cls = 11; cls <= 12; cls++) {
    seniorSubjects.forEach((subject, idx) => {
      courses.push({
        class: cls,
        subject,
        subjectCode: subject.substring(0, 3).toUpperCase(),
        description: `${subject} for Class ${cls}`,
        color: primaryColors[idx % primaryColors.length],
        difficulty: 'Hard',
        totalChapters: 15,
        chapters: generateSeniorChapters(cls, subject)
      });
    });
  }

  return courses;
}

// ============================================
// Chapter Generators
// ============================================
function generatePrimaryChapters(cls, subject) {
  return Array.from({ length: 5 }, (_, i) => ({
    chapterNo: i + 1,
    title: `${subject} Chapter ${i + 1}`,
    description: `Learn ${subject} basics`,
    youtubeUrl: getYouTubeUrl(subject),
    duration: '20 min',
    topics: generateTopics(subject)
  }));
}

function generateMiddleChapters(cls, subject) {
  return Array.from({ length: 14 }, (_, i) => ({
    chapterNo: i + 1,
    title: `${subject} Chapter ${i + 1}`,
    description: `Learn ${subject}`,
    youtubeUrl: getYouTubeUrl(subject),
    duration: '25 min',
    topics: generateTopics(subject)
  }));
}

function generateSecondaryChapters(cls, subject) {
  return Array.from({ length: 15 }, (_, i) => ({
    chapterNo: i + 1,
    title: `${subject} Chapter ${i + 1}`,
    description: `Board preparation`,
    youtubeUrl: getYouTubeUrl(subject),
    duration: '30 min',
    topics: generateTopics(subject)
  }));
}

function generateSeniorChapters(cls, subject) {
  return Array.from({ length: 15 }, (_, i) => ({
    chapterNo: i + 1,
    title: `${subject} Chapter ${i + 1}`,
    description: `Advanced study`,
    youtubeUrl: getYouTubeUrl(subject),
    duration: '35 min',
    topics: generateTopics(subject)
  }));
}

// ============================================
// YouTube URLs
// ============================================
function getYouTubeUrl(subject) {
  const urls = {
    Mathematics: 'https://www.youtube.com/watch?v=OmJ-4B-mS-Y',
    Science: 'https://www.youtube.com/watch?v=Rd4a1X3B61w',
    Physics: 'https://www.youtube.com/watch?v=ZM8ECpBuQYE',
    Chemistry: 'https://www.youtube.com/watch?v=FSyAehMdpyI',
    Biology: 'https://www.youtube.com/watch?v=QnQe0xW_JY4',
    English: 'https://www.youtube.com/watch?v=hnCDL4FMnCo',
    Hindi: 'https://www.youtube.com/watch?v=_6eu2mXXMRY',
    'Social Science': 'https://www.youtube.com/watch?v=xn8gLnRcPKY',
    History: 'https://www.youtube.com/watch?v=Yocja_N5s1I',
    Geography: 'https://www.youtube.com/watch?v=D9YjqoNhbSc',
    Accountancy: 'https://www.youtube.com/watch?v=7YxHnY6Jx3Q',
    Economics: 'https://www.youtube.com/watch?v=9uFQECk30Q4',
    'Business Studies': 'https://www.youtube.com/watch?v=Q9g1QYJ3Vn0',
    'Political Science': 'https://www.youtube.com/watch?v=8N0lQnO1E0M'
  };

  return urls[subject] || 'https://www.youtube.com/watch?v=_OBlgSz8sSM';
}

// ============================================
// Topics Generator
// ============================================
function generateTopics(subject) {
  return [
    `Introduction to ${subject}`,
    `Concepts`,
    `Examples`,
    `Practice Questions`,
    `Revision`
  ];
}

module.exports = router;