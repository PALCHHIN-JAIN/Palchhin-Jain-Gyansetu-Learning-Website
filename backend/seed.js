const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

// ─────────────────────────────────────────────
//  HELPER: playlist course ke liye chapters banana
// ─────────────────────────────────────────────
const playlistChapter = (url, topics = ['All Chapters']) => ([
  {
    chapterNo: 1,
    title: 'Full Course Playlist',
    description: 'Complete course playlist. Click to open on YouTube.',
    youtubeUrl: url,
    youtubePlaylist: url,
    duration: 'Full Course',
    topics,
    isPlaylist: true
  }
]);

// ─────────────────────────────────────────────
//  COURSES DATA — Class 1 to 12
// ─────────────────────────────────────────────
const coursesData = [

  // ══════════════════════════════════════════
  //  CLASS 1
  // ══════════════════════════════════════════
  {
    class: 1, subject: 'Mathematics', subjectCode: 'MATH01',
    description: 'Basic numbers, shapes, and simple arithmetic for Class 1 students.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Numbers 1 to 20', description: 'Learn to count and write numbers from 1 to 20.', youtubeUrl: 'https://www.youtube.com/watch?v=By2hmo323xM', duration: '15 min', topics: ['Counting', 'Writing numbers', 'Number names', 'Before/After', 'Greater/Smaller'] },
      { chapterNo: 2, title: 'Addition', description: 'Simple addition of single digit numbers.', youtubeUrl: 'https://www.youtube.com/watch?v=uQiUTFO78Jk', duration: '20 min', topics: ['Adding numbers', 'Finger addition', 'Number line addition', 'Word problems'] },
      { chapterNo: 3, title: 'Subtraction', description: 'Basic subtraction within 20.', youtubeUrl: 'https://www.youtube.com/watch?v=jSL5WNcTtUs', duration: '20 min', topics: ['Taking away', 'Subtraction facts', 'Number line subtraction'] },
      { chapterNo: 4, title: 'Shapes', description: 'Identify basic 2D shapes.', youtubeUrl: 'https://www.youtube.com/watch?v=jSL5WNcTtUs', duration: '15 min', topics: ['Circle', 'Square', 'Triangle', 'Rectangle'] },
      { chapterNo: 5, title: 'Measurement', description: 'Compare lengths, weights and capacities.', youtubeUrl: 'https://www.youtube.com/watch?v=jSL5WNcTtUs', duration: '15 min', topics: ['Longer/Shorter', 'Heavier/Lighter', 'Full/Empty'] },
    ]
  },
  {
    class: 1, subject: 'English', subjectCode: 'ENG01',
    description: 'Alphabets, phonics, and simple words for Class 1.',
    icon: '📖', color: '#059669', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Alphabets A to Z', description: 'Learn uppercase and lowercase letters.', youtubeUrl: 'https://www.youtube.com/watch?v=JT0MmZcJ2Vw', duration: '20 min', topics: ['Capital letters', 'Small letters'] },
      { chapterNo: 2, title: 'Phonics', description: 'Letter sounds and phonics basics.', youtubeUrl: 'https://www.youtube.com/watch?v=75p-N9YKqNo', duration: '20 min', topics: ['Vowels', 'Consonants', 'CVC words'] },
      { chapterNo: 3, title: 'Simple Words', description: 'Common 3-letter words.', youtubeUrl: 'https://www.youtube.com/watch?v=otpciDgPUSg', duration: '15 min', topics: ['cat', 'bat', 'hat', 'mat'] },
      { chapterNo: 4, title: 'Sentences', description: 'Form simple sentences.', youtubeUrl: 'https://www.youtube.com/watch?v=GhGpuo5-HPU', duration: '20 min', topics: ['Subject', 'Verb', 'Simple sentences'] },
      { chapterNo: 5, title: 'Rhymes and Poems', description: 'Fun rhymes and short poems.', youtubeUrl: 'https://www.youtube.com/watch?v=yCjJyiqpAuU', duration: '15 min', topics: ['Rhyming words', 'Short poems'] },
    ]
  },
  {
    class: 1, subject: 'Hindi', subjectCode: 'HIN01',
    description: 'Hindi varnmala aur chhote shabd Class 1 ke liye.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Varnmala', description: 'Hindi ke swar aur vyanjan seekhein.', youtubeUrl: 'https://www.youtube.com/watch?v=qzszbus30UQ', duration: '20 min', topics: ['Swar', 'Vyanjan'] },
      { chapterNo: 2, title: 'Chhote Shabd', description: 'Do akshar ke chhote shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=1ffqvHXMSBM', duration: '15 min', topics: ['Shabd banana', 'Padhna'] },
      { chapterNo: 3, title: 'Matra', description: 'Aa, i, ee, u matra.', youtubeUrl: 'https://www.youtube.com/watch?v=N2a4JOhaGVo', duration: '20 min', topics: ['Aa ki matra', 'I ki matra'] },
      { chapterNo: 4, title: 'Chhoti Kahani', description: 'Chhoti aur seedhi kahaniyan.', youtubeUrl: 'https://www.youtube.com/watch?v=LWd_z7upri8', duration: '15 min', topics: ['Paheli', 'Kahani'] },
      { chapterNo: 5, title: 'Ginti', description: '1 se 20 tak Hindi mein ginti.', youtubeUrl: 'https://www.youtube.com/watch?v=D0Ajq682yrA', duration: '15 min', topics: ['Ek se bis tak'] },
    ]
  },

  // ══════════════════════════════════════════
  //  CLASS 2
  // ══════════════════════════════════════════
  {
    class: 2, subject: 'Mathematics', subjectCode: 'MATH02',
    description: 'Numbers up to 100, addition, subtraction and simple multiplication.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Numbers up to 100', description: 'Counting, reading and writing up to 100.', youtubeUrl: 'https://www.youtube.com/watch?v=JBSpqULMw4s', duration: '20 min', topics: ['Tens and ones', 'Place value'] },
      { chapterNo: 2, title: 'Addition up to 100', description: 'Adding two-digit numbers.', youtubeUrl: 'https://www.youtube.com/watch?v=zYQWJWPn830', duration: '20 min', topics: ['With carrying', 'Without carrying'] },
      { chapterNo: 3, title: 'Subtraction up to 100', description: 'Subtracting two-digit numbers.', youtubeUrl: 'https://www.youtube.com/watch?v=RSK0Lb4Up1I', duration: '20 min', topics: ['With borrowing', 'Without borrowing'] },
      { chapterNo: 4, title: 'Multiplication Tables 2 to 5', description: 'Learn times tables from 2 to 5.', youtubeUrl: 'https://www.youtube.com/watch?v=GvTcpfSnOMQ', duration: '25 min', topics: ['Table of 2', 'Table of 3', 'Table of 4', 'Table of 5'] },
      { chapterNo: 5, title: 'Time and Calendar', description: 'Days, months and reading a clock.', youtubeUrl: 'https://www.youtube.com/watch?v=_IN1C_KkZtA', duration: '20 min', topics: ['Days of week', 'Months', 'Clock'] },
    ]
  },
  {
    class: 2, subject: 'English', subjectCode: 'ENG02',
    description: 'Reading comprehension, grammar basics and writing for Class 2.',
    icon: '📖', color: '#059669', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Nouns', description: 'Names of people, places and things.', youtubeUrl: 'https://www.youtube.com/watch?v=xLYEBrBlfdU', duration: '20 min', topics: ['Common nouns', 'Proper nouns'] },
      { chapterNo: 2, title: 'Verbs', description: 'Action words in sentences.', youtubeUrl: 'https://www.youtube.com/watch?v=KzVLcrvVjNM', duration: '20 min', topics: ['Action verbs', 'Is/Am/Are'] },
      { chapterNo: 3, title: 'Adjectives', description: 'Describing words.', youtubeUrl: 'https://www.youtube.com/watch?v=kprtJOehhJI', duration: '15 min', topics: ['Size', 'Color', 'Shape'] },
      { chapterNo: 4, title: 'Reading Short Stories', description: 'Read and understand short passages.', youtubeUrl: 'https://www.youtube.com/watch?v=xvzd0BNla2g', duration: '25 min', topics: ['Comprehension', 'Question-Answer'] },
      { chapterNo: 5, title: 'Writing Practice', description: 'Write sentences and short paragraphs.', youtubeUrl: 'https://www.youtube.com/watch?v=resdjMKpkn0', duration: '20 min', topics: ['Sentence writing', 'Paragraph'] },
    ]
  },
  {
    class: 2, subject: 'Hindi', subjectCode: 'HIN02',
    description: 'Hindi padhna likhna aur matra abhyas Class 2 ke liye.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Sanyukt Akshar', description: 'Do akshar milake bane shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=It5M_U0E4dA', duration: '20 min', topics: ['Pakka', 'Kachcha'] },
      { chapterNo: 2, title: 'Puri Matra Abhyas', description: 'Sabhi matrao ka abhyas.', youtubeUrl: 'https://www.youtube.com/watch?v=1O17TI508k0', duration: '25 min', topics: ['Chhoti i', 'Badi ee', 'U, Oo'] },
      { chapterNo: 3, title: 'Sangya aur Sarvnam', description: 'Naam aur unke badale mein aane wale shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=HSB7RmSelNQ', duration: '20 min', topics: ['Sangya', 'Sarvnam'] },
      { chapterNo: 4, title: 'Chhote Anuchhed', description: 'Chhote anuchhed padhna aur samajhna.', youtubeUrl: 'https://www.youtube.com/watch?v=7-fhaOis2JY', duration: '20 min', topics: ['Padhna', 'Prashn uttar'] },
      { chapterNo: 5, title: 'Paryayvachi Shabd', description: 'Ek jaisi meaning wale shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=yHvTqd8yxnw', duration: '15 min', topics: ['Paryayvachi'] },
    ]
  },

  // ══════════════════════════════════════════
  //  CLASS 3
  // ══════════════════════════════════════════
  {
    class: 3, subject: 'Mathematics', subjectCode: 'MATH03',
    description: 'Multiplication, division, fractions and geometry for Class 3.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Easy', totalChapters: 6,
    chapters: [
      { chapterNo: 1, title: 'Numbers up to 1000', description: 'Hundreds, tens and ones.', youtubeUrl: 'https://www.youtube.com/watch?v=2FDgrOk_ZIA', duration: '20 min', topics: ['Place value', '3-digit numbers'] },
      { chapterNo: 2, title: 'Addition and Subtraction', description: '3-digit addition and subtraction.', youtubeUrl: 'https://www.youtube.com/watch?v=-xnVNRGVBEQ', duration: '25 min', topics: ['Carrying', 'Borrowing'] },
      { chapterNo: 3, title: 'Multiplication Tables 6-10', description: 'Learn tables from 6 to 10.', youtubeUrl: 'https://www.youtube.com/watch?v=nxyjpfBh6LM', duration: '25 min', topics: ['Table of 6,7,8,9,10'] },
      { chapterNo: 4, title: 'Division', description: 'Basic division and remainders.', youtubeUrl: 'https://www.youtube.com/watch?v=QlBzBcLIN2U', duration: '25 min', topics: ['Equal sharing', 'Remainder'] },
      { chapterNo: 5, title: 'Fractions', description: 'Half, quarter and three-quarters.', youtubeUrl: 'https://www.youtube.com/watch?v=akxO8eNSXJ8', duration: '20 min', topics: ['1/2', '1/4', '3/4'] },
      { chapterNo: 6, title: 'Geometry Basics', description: '2D and 3D shapes.', youtubeUrl: 'https://www.youtube.com/watch?v=hlUbQsdHPQo', duration: '20 min', topics: ['Cube', 'Cylinder', 'Cone'] },
    ]
  },
  {
    class: 3, subject: 'English', subjectCode: 'ENG03',
    description: 'Grammar, comprehension and creative writing for Class 3.',
    icon: '📖', color: '#059669', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Tenses - Present', description: 'Simple present tense usage.', youtubeUrl: 'https://www.youtube.com/watch?v=7Oqk_UZKNF0', duration: '25 min', topics: ['Simple present', 'Present continuous'] },
      { chapterNo: 2, title: 'Tenses - Past', description: 'Simple past tense.', youtubeUrl: 'https://www.youtube.com/watch?v=jBUklI7YlYQ', duration: '25 min', topics: ['Regular verbs', 'Irregular verbs'] },
      { chapterNo: 3, title: 'Pronouns', description: 'He, she, it, they, we, I.', youtubeUrl: 'https://www.youtube.com/watch?v=FfRXKZGdHG0', duration: '20 min', topics: ['Personal pronouns'] },
      { chapterNo: 4, title: 'Comprehension Passage', description: 'Read and answer questions.', youtubeUrl: 'https://www.youtube.com/watch?v=ulvrIHnqeT4', duration: '25 min', topics: ['Reading', 'Inference'] },
      { chapterNo: 5, title: 'Letter Writing', description: 'Write informal letters.', youtubeUrl: 'https://www.youtube.com/watch?v=MSrOA_eVSPo', duration: '20 min', topics: ['Format', 'Friendly letter'] },
    ]
  },
  {
    class: 3, subject: 'Hindi', subjectCode: 'HIN03',
    description: 'Hindi vyakaran, path aur lekhan for Class 3.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Sangya', description: 'Naam wale shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=BxjQ4_V-Czs', duration: '20 min', topics: ['Vyakti', 'Sthan', 'Vastu'] },
      { chapterNo: 2, title: 'Sarvanam', description: 'Sangya ke badle aane wale shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=Ys_pO2SI-h4', duration: '20 min', topics: ['Main', 'Tum', 'Vah'] },
      { chapterNo: 3, title: 'Kriya', description: 'Kaam batane wale shabd.', youtubeUrl: 'https://www.youtube.com/watch?v=NSOc0uVT_hA', duration: '20 min', topics: ['Kriya', 'Kaal'] },
      { chapterNo: 4, title: 'Gadyansh', description: 'Passage padho aur prashn ke uttar do.', youtubeUrl: 'https://www.youtube.com/watch?v=ppI-e4fKiH4', duration: '20 min', topics: ['Reading', 'Questions'] },
      { chapterNo: 5, title: 'Patra Lekhan', description: 'Anaupcharik patra likhna.', youtubeUrl: 'https://www.youtube.com/watch?v=TnJOcqIOfp8', duration: '20 min', topics: ['Format', 'Patra'] },
    ]
  },
  {
    class: 3, subject: 'Environmental Studies', subjectCode: 'EVS03',
    description: 'Our environment, plants, animals and community for Class 3.',
    icon: '🌿', color: '#16A34A', difficulty: 'Easy', totalChapters: 5,
    chapters: [
      { chapterNo: 1, title: 'Our Family', description: 'Family members and relationships.', youtubeUrl: 'https://www.youtube.com/watch?v=2yxSirq_a84', duration: '15 min', topics: ['Nuclear family', 'Joint family'] },
      { chapterNo: 2, title: 'Plants Around Us', description: 'Types of plants and their uses.', youtubeUrl: 'https://www.youtube.com/watch?v=Ot158t4H7a0', duration: '20 min', topics: ['Trees', 'Shrubs', 'Herbs'] },
      { chapterNo: 3, title: 'Animals', description: 'Domestic and wild animals.', youtubeUrl: 'https://www.youtube.com/watch?v=jW4Yx6JYx7Q', duration: '20 min', topics: ['Domestic', 'Wild', 'Pet animals'] },
      { chapterNo: 4, title: 'Water', description: 'Sources and uses of water.', youtubeUrl: 'https://www.youtube.com/watch?v=TWb4KlM2vts', duration: '20 min', topics: ['River', 'Rain', 'Water cycle'] },
      { chapterNo: 5, title: 'Food and Nutrition', description: 'Healthy eating and food groups.', youtubeUrl: 'https://www.youtube.com/watch?v=fqhYBTg73fw', duration: '20 min', topics: ['Vitamins', 'Proteins', 'Carbohydrates'] },
    ]
  },

  // ══════════════════════════════════════════
  //  CLASS 4
  // ══════════════════════════════════════════
  {
    class: 4, subject: 'English', subjectCode: 'ENG04',
    description: 'Class 4 English Full NCERT Marigold Book Explanation.',
    icon: '📖', color: '#059669', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLAiXwJscHdchA6q3jhbB2LZ2C-mrgbLGr', ['All Chapters', 'NCERT Marigold'])
  },
  {
    class: 4, subject: 'Hindi', subjectCode: 'HIN04',
    description: 'Class 4 Hindi Full Course with chapter explanation.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PL7Bsyw4aKDIHgRld6tBg7IB5k6r5GvbR3', ['All Chapters'])
  },
  {
    class: 4, subject: 'Mathematics', subjectCode: 'MATH04',
    description: 'Class 4 Maths Full NCERT Course.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLPbVevbMS3Mpf_Y5jarghRLCrxUR4JHoJ', ['All Chapters', 'NCERT Maths'])
  },
  {
    class: 4, subject: 'Science', subjectCode: 'SCI04',
    description: 'Class 4 Science Full Course.',
    icon: '🔬', color: '#7C3AED', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLW6ZJtqCeoWu6LK30rLamB8gjMOq0P2XK', ['All Chapters'])
  },
  {
    class: 4, subject: 'Social Studies', subjectCode: 'SST04',
    description: 'Class 4 Social Studies Full Course.',
    icon: '🌍', color: '#B45309', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLW6ZJtqCeoWu6LK30rLamB8gjMOq0P2XK', ['History', 'Geography', 'Civics'])
  },
  {
    class: 4, subject: 'Computer', subjectCode: 'COMP04',
    description: 'Class 4 Computer Full Course.',
    icon: '💻', color: '#0284C7', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PL7RVT3_wnISGbZOXp54IFhfggx1bkMTiM', ['Basics', 'MS Word', 'Paint'])
  },
  {
    class: 4, subject: 'GK', subjectCode: 'GK04',
    description: 'Class 4 General Knowledge.',
    icon: '🌟', color: '#CA8A04', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=GQnrGI3QauU&list=PLVLoWQFkZbhUpp_hDE4OP9hEY0uDXS1xe', ['GK Questions', 'India', 'World'])
  },

  // ══════════════════════════════════════════
  //  CLASS 5
  // ══════════════════════════════════════════
  {
    class: 5, subject: 'Mathematics', subjectCode: 'MATH05',
    description: 'Complete Mathematics playlist for Class 5.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhVUMz2O9n_V22DDjr5qp91f', ['Large Numbers', 'Fractions', 'Decimals', 'Percentage', 'Geometry', 'Data Handling'])
  },
  {
    class: 5, subject: 'Science', subjectCode: 'SCI05',
    description: 'Complete Science playlist for Class 5.',
    icon: '🔬', color: '#7C3AED', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLWdaWfYSSybznRqt6gLbUoxHBUc8yTr5-', ['Human Body', 'Plants', 'Matter', 'Light', 'Environment'])
  },
  {
    class: 5, subject: 'English', subjectCode: 'ENG05',
    description: 'Complete English playlist for Class 5.',
    icon: '📖', color: '#059669', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PL7RVT3_wnISELksYKPumgxeTri32gkGrB', ['Grammar', 'Poems', 'Stories', 'Writing'])
  },
  {
    class: 5, subject: 'Hindi', subjectCode: 'HIN05',
    description: 'Complete Hindi playlist for Class 5.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=RE2Uy0Ohsb0&list=PLt3jBqzh-BOqcjFsaUyvAN78TPCji3Uez', ['Rimjhim', 'Grammar', 'Poems', 'Stories'])
  },
  {
    class: 5, subject: 'Social Studies', subjectCode: 'SST05',
    description: 'Complete SST playlist for Class 5.',
    icon: '🌍', color: '#F59E0B', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLTMOwqmI-LuBCbHI0j0OTdHtOdli2_5tu', ['History', 'Geography', 'Civics'])
  },
  {
    class: 5, subject: 'Computer', subjectCode: 'COMP05',
    description: 'Complete Computer playlist for Class 5.',
    icon: '💻', color: '#0EA5E9', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=NOSEYpgDOHM&list=PLVLoWQFkZbhX7KHCxcjCnC5LtpRojrsHq', ['Basics', 'MS Word', 'Paint', 'Internet'])
  },
  {
    class: 5, subject: 'GK', subjectCode: 'GK05',
    description: 'Complete GK playlist for Class 5.',
    icon: '🧠', color: '#9333EA', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=3NSMEXBZ2xg&list=PLVLoWQFkZbhUFLnB3mOnvSrmUe5xSKxe9', ['India GK', 'Science GK', 'World GK', 'Current Affairs'])
  },

  // ══════════════════════════════════════════
  //  CLASS 6
  // ══════════════════════════════════════════
  {
    class: 6, subject: 'English', subjectCode: 'ENG06',
    description: 'NCERT Class 6 English complete playlist.',
    icon: '📖', color: '#059669', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLFW1d3OZq2-V6f-m375yEEDPcYL1rnQaO', ['All Chapters', 'NCERT Honeysuckle'])
  },
  {
    class: 6, subject: 'Hindi', subjectCode: 'HIN06',
    description: 'NCERT Class 6 Hindi complete playlist.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/c/HindiClass6th', ['All Chapters', 'Vasant', 'Durva'])
  },
  {
    class: 6, subject: 'Mathematics', subjectCode: 'MATH06',
    description: 'NCERT Class 6 Maths complete playlist.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLMsRAiQ1jDpGyimvi3uM6jyee1Ke0nQdN', ['Integers', 'Fractions', 'Algebra', 'Geometry', 'Mensuration'])
  },
  {
    class: 6, subject: 'Science', subjectCode: 'SCI06',
    description: 'NCERT Class 6 Science complete playlist.',
    icon: '🔬', color: '#7C3AED', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLMsRAiQ1jDpGyimvi3uM6jyee1Ke0nQdN', ['Food', 'Materials', 'Living World', 'Motion', 'Environment'])
  },
  {
    class: 6, subject: 'Social Science', subjectCode: 'SST06',
    description: 'History, Geography, Civics complete playlist.',
    icon: '🌍', color: '#B45309', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLbBOyEQoaUO9wPoIJ4JFfJvJFnQbf5lHA', ['History', 'Geography', 'Civics'])
  },
  {
    class: 6, subject: 'Computer', subjectCode: 'COMP06',
    description: 'Computer basics for Class 6.',
    icon: '💻', color: '#2563EB', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=RDQr7fVzVZU', ['Basics', 'MS Office', 'Internet'])
  },
  {
    class: 6, subject: 'GK', subjectCode: 'GK06',
    description: 'General Knowledge for Class 6.',
    icon: '🧠', color: '#EA580C', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=heRZvby14SE', ['India GK', 'World GK', 'Science GK'])
  },

  // ══════════════════════════════════════════
  //  CLASS 7
  // ══════════════════════════════════════════
  {
    class: 7, subject: 'English', subjectCode: 'ENG07',
    description: 'NCERT Class 7 English complete playlist.',
    icon: '📖', color: '#059669', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+english+ncert+playlist', ['All Chapters', 'Honeycomb', 'An Alien Hand'])
  },
  {
    class: 7, subject: 'Hindi', subjectCode: 'HIN07',
    description: 'NCERT Class 7 Hindi complete playlist.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+hindi+ncert+playlist', ['Vasant', 'Mahabharat', 'Durva'])
  },
  {
    class: 7, subject: 'Mathematics', subjectCode: 'MATH07',
    description: 'NCERT Class 7 Maths complete playlist.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+maths+ncert+playlist', ['Integers', 'Fractions', 'Algebra', 'Triangles', 'Data Handling'])
  },
  {
    class: 7, subject: 'Science', subjectCode: 'SCI07',
    description: 'NCERT Class 7 Science complete playlist.',
    icon: '🔬', color: '#7C3AED', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+science+ncert+playlist', ['Nutrition', 'Heat', 'Acids', 'Weather', 'Forests', 'Motion'])
  },
  {
    class: 7, subject: 'Social Science', subjectCode: 'SST07',
    description: 'History, Geography, Civics complete playlist for Class 7.',
    icon: '🌍', color: '#B45309', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+social+science+ncert+playlist', ['History', 'Geography', 'Civics'])
  },
  {
    class: 7, subject: 'Computer', subjectCode: 'COMP07',
    description: 'Computer basics for Class 7.',
    icon: '💻', color: '#2563EB', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+computer+basics+playlist', ['MS Word', 'MS Excel', 'Internet', 'Programming Basics'])
  },
  {
    class: 7, subject: 'GK', subjectCode: 'GK07',
    description: 'General Knowledge for Class 7.',
    icon: '🧠', color: '#EA580C', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/results?search_query=class+7+gk+questions+playlist', ['India GK', 'World GK', 'Current Affairs'])
  },

  // ══════════════════════════════════════════
  //  CLASS 8
  // ══════════════════════════════════════════
  {
    class: 8, subject: 'English', subjectCode: 'ENG08',
    description: 'NCERT Class 8 English complete playlist.',
    icon: '📖', color: '#059669', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLR0R7uA6mUyo_GngijALHJta1L4eF4IRS', ['Honeydew', 'It So Happened'])
  },
  {
    class: 8, subject: 'Hindi', subjectCode: 'HIN08',
    description: 'NCERT Class 8 Hindi complete playlist.',
    icon: '🅰️', color: '#DC2626', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhVY6pQ13S9fXw7Zr7I5l9xM', ['Vasant', 'Durva', 'Bharat ki Khoj'])
  },
  {
    class: 8, subject: 'Mathematics', subjectCode: 'MATH08',
    description: 'NCERT Class 8 Maths complete playlist.',
    icon: '🔢', color: '#4F46E5', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhVqW0IYvDqzTeWY5Avzk1l3', ['Rational Numbers', 'Squares', 'Cubes', 'Mensuration', 'Algebra', 'Graphs'])
  },
  {
    class: 8, subject: 'Science', subjectCode: 'SCI08',
    description: 'NCERT Class 8 Science complete playlist.',
    icon: '🔬', color: '#7C3AED', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhXGzYF9bBlt3F4iAfDdc0AG', ['Crop Production', 'Metals', 'Coal', 'Combustion', 'Cell', 'Force', 'Sound', 'Light'])
  },
  {
    class: 8, subject: 'Social Science', subjectCode: 'SST08',
    description: 'NCERT Class 8 Social Science complete playlist.',
    icon: '🌍', color: '#B45309', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhU3sZ8a9kaI0s5momkMumZ5', ['History', 'Geography', 'Civics'])
  },
  {
    class: 8, subject: 'Computer', subjectCode: 'COMP08',
    description: 'Computer for Class 8.',
    icon: '💻', color: '#2563EB', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLwpirh4EWFpE0lQzj5xwZc0aF4Pjk6Hoy', ['MS Excel', 'HTML Basics', 'Internet', 'Programming'])
  },
  {
    class: 8, subject: 'GK', subjectCode: 'GK08',
    description: 'General Knowledge for Class 8.',
    icon: '🧠', color: '#EA580C', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLpuxPG4TUOR4q4E3L6E4z7O8g5N6p9Q9K', ['India GK', 'World GK', 'Current Affairs'])
  },
  {
    class: 8, subject: 'Sanskrit', subjectCode: 'SAN08',
    description: 'NCERT Class 8 Sanskrit complete playlist.',
    icon: '📜', color: '#7C3AED', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhXKi6N32H2e3-OjvPisnREX', ['Ruchira', 'Grammar', 'All Chapters'])
  },
  {
    class: 8, subject: 'Urdu', subjectCode: 'URD08',
    description: 'NCERT Class 8 Urdu complete playlist.',
    icon: '📝', color: '#14B8A6', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLcPSz-vyRTiyllRj4dh6tyjUam84N4jb3', ['All Chapters'])
  },

  // ══════════════════════════════════════════
  //  CLASS 9
  // ══════════════════════════════════════════
  //  CLASS 9
  // ══════════════════════════════════════════
  {
    class: 9, subject: 'Mathematics', subjectCode: 'MATH09',
    description: 'NCERT Class 9 Mathematics complete playlist.',
    icon: '📐', color: '#4F46E5', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=IMnSIaPcqiE&list=PLJYTm6FPHiXUIS9NKQj32yuQXDuBWf5TB',
      ['Number Systems', 'Polynomials', 'Coordinate Geometry', 'Linear Equations', 'Triangles', 'Circles', 'Herons Formula', 'Surface Area', 'Statistics'])
  },
  {
    class: 9, subject: 'Science', subjectCode: 'SCI09',
    description: 'NCERT Class 9 Science complete playlist.',
    icon: '🔬', color: '#059669', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=AU3JcbtuGo4&t=14s',
      ['Matter', 'Atoms', 'Cell', 'Tissues', 'Motion', 'Force', 'Gravitation', 'Work Energy', 'Sound', 'Natural Resources'])
  },
  {
    class: 9, subject: 'Social Science', subjectCode: 'SST09',
    description: 'NCERT Class 9 Social Science complete playlist.',
    icon: '🌍', color: '#DC2626', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=ik3tXVUbiQE&list=PLVLoWQFkZbhUvAmP7ZlLrVAfXHuoGthee',
      ['History', 'Geography', 'Economics', 'Political Science'])
  },
  {
    class: 9, subject: 'English', subjectCode: 'ENG09',
    description: 'NCERT Class 9 English complete playlist.',
    icon: '📖', color: '#2563EB', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=OBW7b2X7dJs&list=PLVLoWQFkZbhWvnzQBSVOj14dJlH6YeoQc',
      ['Beehive', 'Moments', 'Grammar', 'Writing'])
  },
  {
    class: 9, subject: 'Hindi', subjectCode: 'HIN09',
    description: 'NCERT Class 9 Hindi complete playlist.',
    icon: '🅰️', color: '#EA580C', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=epd_c7mkrts&list=PLVLoWQFkZbhXXAOBv5pdiTibLiz3bw6Dn',
      ['Kshitij', 'Sparsh', 'Sanchayan', 'Kritika'])
  },
  {
    class: 9, subject: 'Computer', subjectCode: 'COMP09',
    description: 'CBSE Computer Applications Class 9.',
    icon: '💻', color: '#0EA5E9', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=R7D2JQlbFd4&list=PLVLoWQFkZbhX21BTngxAJ3ISH610F4l20',
      ['Introduction to IT', 'HTML', 'Cyber Safety'])
  },
  {
    class: 9, subject: 'Sanskrit', subjectCode: 'SAN09',
    description: 'NCERT Sanskrit Class 9 (Shemushi).',
    icon: '📜', color: '#7C3AED', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=s700xTDfpYE&list=PLVLoWQFkZbhXhrGQT8QJ4UeSwu-oACgxs',
      ['Shemushi', 'Grammar', 'All Chapters'])
  },
  {
    class: 9, subject: 'Urdu', subjectCode: 'URD09',
    description: 'NCERT Class 9 Urdu complete playlist.',
    icon: '📝', color: '#14B8A6', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/watch?v=65py2K2w3rQ&list=PLF_rOjfXl15LJ-7umqLTXRLt3JvGLx9wP',
      ['All Chapters'])
  },

  // ══════════════════════════════════════════
  //  CLASS 10
  // ══════════════════════════════════════════
  //  CLASS 10
  // ══════════════════════════════════════════
  {
    class: 10, subject: 'Mathematics', subjectCode: 'MATH10',
    description: 'NCERT Class 10 Mathematics complete playlist.',
    icon: '📐', color: '#4F46E5', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PL8dPuuaLjXtNM_Y-bUAhblSAdWRnmBUcr',
      ['Real Numbers', 'Polynomials', 'Quadratic Equations', 'AP', 'Triangles', 'Coordinate Geometry', 'Trigonometry', 'Circles', 'Area', 'Surface Area', 'Statistics', 'Probability'])
  },
  {
    class: 10, subject: 'Science', subjectCode: 'SCI10',
    description: 'NCERT Class 10 Science complete playlist.',
    icon: '🔬', color: '#059669', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhUsgGOhJ4d0x5Ya9dT_W-7A',
      ['Chemical Reactions', 'Acids Bases', 'Metals', 'Carbon', 'Life Processes', 'Reproduction', 'Heredity', 'Light', 'Electricity', 'Magnetic Effects', 'Environment'])
  },
  {
    class: 10, subject: 'Social Science', subjectCode: 'SST10',
    description: 'NCERT Class 10 Social Science complete playlist.',
    icon: '🌍', color: '#DC2626', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhXU2r9j04YfGLwRoTSesFiq',
      ['History', 'Geography', 'Economics', 'Political Science'])
  },
  {
    class: 10, subject: 'English', subjectCode: 'ENG10',
    description: 'NCERT Class 10 English complete playlist.',
    icon: '📖', color: '#2563EB', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhVv0zz6Dx4zYdMYYGr2susx',
      ['First Flight', 'Footprints Without Feet', 'Grammar', 'Writing'])
  },
  {
    class: 10, subject: 'Hindi', subjectCode: 'HIN10',
    description: 'NCERT Class 10 Hindi complete playlist.',
    icon: '🅰️', color: '#EA580C', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhXyZfyPU1KUKf5pFwchAuNm',
      ['Kshitij', 'Sparsh', 'Sanchayan', 'Kritika'])
  },
  {
    class: 10, subject: 'Computer', subjectCode: 'COMP10',
    description: 'CBSE Computer Applications Class 10.',
    icon: '💻', color: '#0EA5E9', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhVcd9rzM1fit-TZrLp14i27',
      ['HTML', 'CSS', 'Database', 'Networking', 'Cyber Safety'])
  },
  {
    class: 10, subject: 'Sanskrit', subjectCode: 'SAN10',
    description: 'NCERT Class 10 Sanskrit complete playlist.',
    icon: '📜', color: '#7C3AED', difficulty: 'Medium', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLeUdn394wLGj1GvYDn8ApX2HFqRSbVSSM',
      ['Shemushi', 'Grammar', 'All Chapters'])
  },
  {
    class: 10, subject: 'Urdu', subjectCode: 'URD10',
    description: 'NCERT Class 10 Urdu complete playlist.',
    icon: '📝', color: '#14B8A6', difficulty: 'Easy', totalChapters: 1,
    chapters: playlistChapter('https://www.youtube.com/playlist?list=PLVLoWQFkZbhX0rGZWlznEU61s9oIoVNew',
      ['All Chapters'])
  },

  // ═════════════════════════════════════════
  // CLASS 11 FINAL WORKING
  {
    class: 11,
    subject: 'Physics',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLVLoWQFkZbhVEkBxEqVCjC8AowXwDexSw',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhVEkBxEqVCjC8AowXwDexSw',
      ['Units', 'Motion', 'Laws of Motion', 'Work Energy', 'Gravitation', 'Thermodynamics', 'Waves']
    )
  },
  {
    class: 11,
    subject: 'Chemistry',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLVLoWQFkZbhUhN8QNvgjDZnHFr_rbg4mr',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhUhN8QNvgjDZnHFr_rbg4mr',
      ['Basic Concepts', 'Atomic Structure', 'Chemical Bonding', 'Thermodynamics', 'Equilibrium', 'Redox', 'Organic']
    )
  },
  {
    class: 11,
    subject: 'Mathematics',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLVLoWQFkZbhXv9f5nXoy2cuglRez2oJ6k',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhXv9f5nXoy2cuglRez2oJ6k',
      ['Sets', 'Relations', 'Trigonometry', 'Complex Numbers', 'Sequences', 'Straight Lines', 'Conic Sections', 'Limits', 'Statistics']
    )
  },
  {
    class: 11,
    subject: 'Biology',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLVLoWQFkZbhU8v7lidhraNangNh4tW7x1',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhU8v7lidhraNangNh4tW7x1',
      ['Living World', 'Cell', 'Biomolecules', 'Plant Kingdom', 'Animal Kingdom']
    )
  },
  {
    class: 11,
    subject: 'English',
    youtubePlaylist: 'https://www.youtube.com/playlist?list=PLVLoWQFkZbhW8aVhF9pN2k9J9Q2sG8Y8C',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhW8aVhF9pN2k9J9Q2sG8Y8C',
      ['Hornbill', 'Snapshots', 'Grammar', 'Writing']
    )
  },

  // ══════════════════════════════════════════
  //  CLASS 12 FINAL WORKING PLAYLISTS
  // ══════════════════════════════════════════
  {
    class: 12,
    subject: 'Physics',
    subjectCode: 'PHY12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=GkzMGOoS76Y&list=PLVLoWQFkZbhU6U0BhqGieiARjUYmyoa8p',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhU6U0BhqGieiARjUYmyoa8p',
      ['Electric Charges', 'Electrostatic Potential', 'Current Electricity', 'Magnetism', 'EMI', 'Optics', 'Dual Nature', 'Atoms', 'Nuclei', 'Semiconductors']
    )
  },
  {
    class: 12,
    subject: 'Chemistry',
    subjectCode: 'CHEM12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=sBFgmwEEbQo&list=PLVLoWQFkZbhVdStvLVoS3kU7RBaJR4JTR',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhVdStvLVoS3kU7RBaJR4JTR',
      ['Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics', 'Surface Chemistry', 'Coordination Compounds', 'Organic Chemistry', 'Biomolecules', 'Polymers']
    )
  },
  {
    class: 12,
    subject: 'Mathematics',
    subjectCode: 'MATH12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=ggNHzywiVCA&list=PLVLoWQFkZbhWENNsv70Pwzxb_ddDm8EjM',
    chapters: playlistChapter(
      'https://www.youtube.com/playlist?list=PLVLoWQFkZbhWENNsv70Pwzxb_ddDm8EjM',
      ['Relations', 'Inverse Trig', 'Matrices', 'Determinants', 'Continuity', 'Differentiation', 'AOD', 'Integrals', 'Differential Equations', '3D Geometry', 'LPP', 'Probability']
    )
  },
  {
    class: 12,
    subject: 'Biology',
    subjectCode: 'BIO12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=YOy7_LPJgAw&list=PLVLoWQFkZbhXy7if3Grafu9UngDHol9EX',
    chapters: playlistChapter(
      'https://www.youtube.com/watch?v=YOy7_LPJgAw&list=PLVLoWQFkZbhXy7if3Grafu9UngDHol9EX',
      ['Reproduction', 'Genetics', 'Evolution', 'Human Health', 'Biotechnology', 'Ecology', 'Biodiversity']
    )
  },
  {
    class: 12,
    subject: 'English',
    subjectCode: 'ENG12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=-Fg8FgQY3_s&list=PLINZtyI0yfBkGmGXnId07Uxr84nlDQ26O',
    chapters: playlistChapter(
      'https://www.youtube.com/watch?v=-Fg8FgQY3_s&list=PLINZtyI0yfBkGmGXnId07Uxr84nlDQ26',
      ['Flamingo', 'Vistas', 'Grammar', 'Writing Skills']
    )
  },
  {
    class: 12,
    subject: 'History',
    subjectCode: 'HIS12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=P6VBDgRDO1A&list=PL8MO3a2YR81-5BuqcrrqQhmflG1MNqGKI',
    chapters: playlistChapter(
      'https://www.youtube.com/watch?v=P6VBDgRDO1A&list=PL8MO3a2YR81-5BuqcrrqQhmflG1MNqGKI',
      ['Bricks Beads', 'Kings Farmers', 'Thinkers Beliefs', 'Bhakti Sufi', 'Mughal Court', 'Colonialism', 'Gandhi', 'Partition', 'Constitution']
    )
  },
  {
    class: 12,
    subject: 'Geography',
    subjectCode: 'GEO12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=y6zHxtg5cqE&list=PL8MO3a2YR818vqol5BYLEXen_DUVh-OmJ',
    chapters: playlistChapter(
      'https://www.youtube.com/watch?v=y6zHxtg5cqE&list=PL8MO3a2YR818vqol5BYLEXen_DUVh-OmJ',
      ['Human Geography', 'Population', 'Resources', 'Transport', 'India Geography']
    )
  },
  {
    class: 12,
    subject: 'Political Science',
    subjectCode: 'POL12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=n1KldOQKoxI&list=PL8MO3a2YR81-G4RcxD_IJ7HEfhWCMX_5q',
    chapters: playlistChapter(
      'https://www.youtube.com/watch?v=n1KldOQKoxI&list=PL8MO3a2YR81-G4RcxD_IJ7HEfhWCMX_5q',
      ['Cold War', 'World Order', 'Indian Politics', 'Party System', 'Regional Aspirations']
    )
  },
  {
    class: 12,
    subject: 'Economics',
    subjectCode: 'ECO12',
    youtubePlaylist: 'https://www.youtube.com/watch?v=cSQDI-afw8c&list=PL8MO3a2YR818G_r7v0pWyuar_wWIQWyXE',
    chapters: playlistChapter(
      'https://www.youtube.com/watch?v=cSQDI-afw8c&list=PL8MO3a2YR818G_r7v0pWyuar_wWIQWyXE',
      ['Macro Economics', 'National Income', 'Money Banking', 'Government Budget', 'Balance of Payments']
    )
  },
];

// ─────────────────────────────────────────────
//  SEED FUNCTION
// ─────────────────────────────────────────────
const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gyaansetu');
    console.log('✅ Connected to MongoDB');

    // ── Demo User ──────────────────────────────
    const existing = await User.findOne({ email: 'demo@gyaansetu.com' });
    if (!existing) {
      await User.create({
        name: 'Demo Student',
        email: 'demo@gyaansetu.com',
        password: 'demo123',
        class: 10
      });
      console.log('✅ Demo user created: demo@gyaansetu.com / demo123');
    } else {
      console.log('ℹ️  Demo user already exists');
    }

    // ── Courses ────────────────────────────────
    await Course.deleteMany({});
    console.log('🗑️  Old courses cleared');

    const inserted = await Course.insertMany(coursesData);
    console.log(`✅ ${inserted.length} courses seeded successfully!\n`);

    // Summary
    const classSummary = {};
    inserted.forEach(c => {
      if (!classSummary[c.class]) classSummary[c.class] = [];
      classSummary[c.class].push(c.subject);
    });

    console.log('📚 Courses seeded by class:');
    Object.keys(classSummary).sort((a, b) => a - b).forEach(cls => {
      console.log(`   Class ${cls}: ${classSummary[cls].join(', ')}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedAll();