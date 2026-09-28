const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/quiz/generate
router.get('/generate', protect, async (req, res) => {
  try {
    const { class: cls, subject } = req.query;

    if (!cls || !subject) {
      return res.status(400).json({ success: false, message: 'Please provide class and subject' });
    }

    // Delete old quiz so new questions generate
    await Quiz.deleteOne({ class: parseInt(cls), subject });

    const questions = generateQuizQuestions(parseInt(cls), subject);

    const quiz = await Quiz.create({
      class: parseInt(cls),
      subject,
      title: `${subject} Quiz`,
      questions,
      totalQuestions: questions.length,
      timeLimit: 15
    });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route POST /api/quiz/submit
router.post('/submit', protect, async (req, res) => {
  try {
    const { quizId, answers, timeTaken } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

    let score = 0;
    const results = quiz.questions.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctAnswer;
      if (isCorrect) score++;
      return {
        question: q.question,
        selectedAnswer: answers[idx],
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
        options: q.options
      };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);
    const pointsEarned = score * 10;

    const user = await User.findById(req.user._id);
    user.quizHistory.push({
      subject: quiz.subject,
      class: quiz.class,
      score,
      total: quiz.questions.length
    });
    user.totalPoints += pointsEarned;
    user.updateBadge();
    await user.save();

    res.json({
      success: true,
      results,
      score,
      total: quiz.questions.length,
      percentage,
      pointsEarned,
      timeTaken,
      grade:
        percentage >= 90 ? 'A+' :
          percentage >= 80 ? 'A' :
            percentage >= 70 ? 'B' :
              percentage >= 60 ? 'C' :
                percentage >= 40 ? 'D' : 'F'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route GET /api/quiz/history
router.get('/history', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, history: user.quizHistory.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Generate Questions
function generateQuizQuestions(cls, subject) {
  const questionBank = getQuestionBank(cls, subject);

  // Fisher-Yates Shuffle
  for (let i = questionBank.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionBank[i], questionBank[j]] = [questionBank[j], questionBank[i]];
  }

  return questionBank.slice(0, Math.min(20, questionBank.length));
}

function getQuestionBank(cls, subject) {

  // CLASS 1 - ENGLISH
  if (cls === 1 && subject === 'English') {
    return [
      { question: 'Which letter comes after A?', options: ['B', 'C', 'D', 'E'], correctAnswer: 0, explanation: 'A ke baad B' },
      { question: 'Apple starts with?', options: ['A', 'B', 'C', 'D'], correctAnswer: 0, explanation: 'Apple A se start hota hai' },
      { question: 'Which is a vowel?', options: ['B', 'C', 'A', 'D'], correctAnswer: 2, explanation: 'A vowel hai' },
      { question: 'Cat is a?', options: ['Fruit', 'Animal', 'Color', 'Number'], correctAnswer: 1, explanation: 'Cat animal hai' },
      { question: 'How many alphabets?', options: ['24', '25', '26', '27'], correctAnswer: 2, explanation: '26 alphabets' },
      { question: 'Ball starts with?', options: ['A', 'B', 'C', 'D'], correctAnswer: 1, explanation: 'Ball B se' },
      { question: 'Which is a fruit?', options: ['Apple', 'Dog', 'Car', 'Table'], correctAnswer: 0, explanation: 'Apple fruit hai' },
      { question: 'Sun is?', options: ['Star', 'Animal', 'Fruit', 'Toy'], correctAnswer: 0, explanation: 'Sun star hai' },
      { question: 'Color of sky?', options: ['Blue', 'Red', 'Green', 'Black'], correctAnswer: 0, explanation: 'Sky blue' },
      { question: 'Opposite of Big?', options: ['Small', 'Tall', 'Fat', 'Long'], correctAnswer: 0, explanation: 'Big ka opposite Small' },
      { question: 'Which is a number?', options: ['A', 'B', '5', 'C'], correctAnswer: 2, explanation: '5 number hai' },
      { question: 'Dog says?', options: ['Meow', 'Bark', 'Moo', 'Roar'], correctAnswer: 1, explanation: 'Dog barks' },
      { question: 'Bird can?', options: ['Swim', 'Fly', 'Drive', 'Run'], correctAnswer: 1, explanation: 'Bird flies' },
      { question: 'We drink?', options: ['Water', 'Stone', 'Chair', 'Bag'], correctAnswer: 0, explanation: 'Water drink karte hain' },
      { question: 'Which is a color?', options: ['Red', 'Apple', 'Dog', 'Book'], correctAnswer: 0, explanation: 'Red color hai' },
      { question: 'How many eyes do we have?', options: ['1', '2', '3', '4'], correctAnswer: 1, explanation: '2 eyes' },
      { question: 'Which is a shape?', options: ['Circle', 'Dog', 'Pen', 'Book'], correctAnswer: 0, explanation: 'Circle shape hai' },
      { question: 'Fish lives in?', options: ['Water', 'Sky', 'Tree', 'Road'], correctAnswer: 0, explanation: 'Fish water me' },
      { question: 'We write with?', options: ['Pen', 'Cup', 'Ball', 'Plate'], correctAnswer: 0, explanation: 'Pen se likhte hain' },
      { question: 'Which is a day?', options: ['Monday', 'Apple', 'Dog', 'Chair'], correctAnswer: 0, explanation: 'Monday day hai' }
    ];
  }

  // CLASS 2 - ENGLISH
  if (cls === 2 && subject === 'English') {
    return [
      { question: 'Plural of Boy?', options: ['Boys', 'Boyes', 'Boies', 'Boy'], correctAnswer: 0, explanation: 'Boy → Boys' },
      { question: 'Opposite of Tall?', options: ['Short', 'Big', 'Fat', 'Thin'], correctAnswer: 0, explanation: 'Tall ka opposite Short' },
      { question: 'Correct spelling?', options: ['Aple', 'Apple', 'Apel', 'Apll'], correctAnswer: 1, explanation: 'Correct Apple' },
      { question: 'He ___ playing.', options: ['is', 'are', 'am', 'be'], correctAnswer: 0, explanation: 'He is playing' },
      { question: 'She ___ a girl.', options: ['is', 'are', 'am', 'be'], correctAnswer: 0, explanation: 'She is a girl' },
      { question: 'We ___ friends.', options: ['is', 'are', 'am', 'be'], correctAnswer: 1, explanation: 'We are friends' },
      { question: 'Past of go?', options: ['goed', 'went', 'gone', 'going'], correctAnswer: 1, explanation: 'Go → Went' },
      { question: 'Synonym of Big?', options: ['Large', 'Small', 'Tiny', 'Short'], correctAnswer: 0, explanation: 'Big = Large' },
      { question: 'Antonym of Happy?', options: ['Sad', 'Joyful', 'Glad', 'Smile'], correctAnswer: 0, explanation: 'Happy ka opposite Sad' },
      { question: 'Which is noun?', options: ['Run', 'Boy', 'Eat', 'Jump'], correctAnswer: 1, explanation: 'Boy noun hai' },
      { question: 'Which is verb?', options: ['Run', 'Table', 'Boy', 'Chair'], correctAnswer: 0, explanation: 'Run verb hai' },
      { question: 'Which is adjective?', options: ['Red', 'Run', 'Eat', 'Jump'], correctAnswer: 0, explanation: 'Red adjective' },
      { question: 'Sentence ends with?', options: ['.', '?', '!', 'All'], correctAnswer: 3, explanation: 'Sentence . ? ! se end hota hai' },
      { question: 'We ___ to school.', options: ['go', 'goes', 'gone', 'going'], correctAnswer: 0, explanation: 'We go to school' },
      { question: 'Ram ___ a boy.', options: ['is', 'are', 'am', 'be'], correctAnswer: 0, explanation: 'Ram is a boy' },
      { question: 'Opposite of Up?', options: ['Down', 'In', 'On', 'Over'], correctAnswer: 0, explanation: 'Up ka opposite Down' },
      { question: 'Correct sentence?', options: ['She are happy', 'She is happy', 'She am happy', 'She be happy'], correctAnswer: 1, explanation: 'She is happy' },
      { question: 'Which is pronoun?', options: ['He', 'Ram', 'Book', 'Pen'], correctAnswer: 0, explanation: 'He pronoun hai' },
      { question: 'Which is a place?', options: ['School', 'Run', 'Eat', 'Jump'], correctAnswer: 0, explanation: 'School place hai' },
      { question: 'We sleep at?', options: ['Night', 'Morning', 'Noon', 'Evening'], correctAnswer: 0, explanation: 'Night me sleep' }
    ];
  }

  // CLASS 3 - HINDI
  if (cls === 3 && subject === 'Hindi') {
    return [
      { question: 'संज्ञा किसे कहते हैं?', options: ['नाम', 'क्रिया', 'विशेषण', 'सर्वनाम'], correctAnswer: 0, explanation: 'नाम = संज्ञा' },
      { question: 'क्रिया क्या है?', options: ['काम', 'नाम', 'रंग', 'स्थान'], correctAnswer: 0, explanation: 'काम = क्रिया' },
      { question: 'गाय क्या है?', options: ['संज्ञा', 'क्रिया', 'विशेषण', 'कुछ नहीं'], correctAnswer: 0, explanation: 'गाय = संज्ञा' },
      { question: 'विलोम: बड़ा', options: ['छोटा', 'लंबा', 'ऊँचा', 'मोटा'], correctAnswer: 0, explanation: 'बड़ा-छोटा' },
      { question: 'सूरज कहाँ उगता है?', options: ['पूर्व', 'पश्चिम', 'उत्तर', 'दक्षिण'], correctAnswer: 0, explanation: 'पूर्व' },
      { question: 'राम स्कूल जाता है – क्रिया?', options: ['राम', 'स्कूल', 'जाता', 'है'], correctAnswer: 2, explanation: 'जाता क्रिया' },
      { question: 'फल का बहुवचन?', options: ['फल', 'फलों', 'फले', 'फलें'], correctAnswer: 1, explanation: 'फलों' },
      { question: 'लड़का का स्त्रीलिंग?', options: ['लड़की', 'लड़क', 'लड़कन', 'लड़के'], correctAnswer: 0, explanation: 'लड़की' },
      { question: 'जल का अर्थ?', options: ['पानी', 'आग', 'हवा', 'धरती'], correctAnswer: 0, explanation: 'जल = पानी' },
      { question: 'हम खेलते हैं – सर्वनाम?', options: ['हम', 'खेलते', 'हैं', 'कुछ नहीं'], correctAnswer: 0, explanation: 'हम = सर्वनाम' },
      { question: 'नीला क्या है?', options: ['रंग', 'नाम', 'क्रिया', 'स्थान'], correctAnswer: 0, explanation: 'नीला रंग' },
      { question: 'विद्यालय का अर्थ?', options: ['स्कूल', 'घर', 'मंदिर', 'बाजार'], correctAnswer: 0, explanation: 'विद्यालय = स्कूल' },
      { question: 'किताब क्या है?', options: ['संज्ञा', 'क्रिया', 'विशेषण', 'सर्वनाम'], correctAnswer: 0, explanation: 'किताब = संज्ञा' },
      { question: 'दौड़ना क्या है?', options: ['क्रिया', 'संज्ञा', 'रंग', 'स्थान'], correctAnswer: 0, explanation: 'दौड़ना = क्रिया' },
      { question: 'मीठा क्या है?', options: ['विशेषण', 'क्रिया', 'संज्ञा', 'सर्वनाम'], correctAnswer: 0, explanation: 'मीठा = विशेषण' },
      { question: 'राम कौन है?', options: ['संज्ञा', 'क्रिया', 'रंग', 'स्थान'], correctAnswer: 0, explanation: 'राम = संज्ञा' },
      { question: 'खेलना क्या है?', options: ['क्रिया', 'संज्ञा', 'रंग', 'स्थान'], correctAnswer: 0, explanation: 'खेलना = क्रिया' },
      { question: 'सुंदर क्या है?', options: ['विशेषण', 'संज्ञा', 'क्रिया', 'सर्वनाम'], correctAnswer: 0, explanation: 'सुंदर = विशेषण' },
      { question: 'वे क्या है?', options: ['सर्वनाम', 'संज्ञा', 'क्रिया', 'विशेषण'], correctAnswer: 0, explanation: 'वे = सर्वनाम' },
      { question: 'घर क्या है?', options: ['संज्ञा', 'क्रिया', 'रंग', 'स्थान'], correctAnswer: 0, explanation: 'घर = संज्ञा' }
    ];
  }
  if (cls === 4 && subject === 'Mathematics') {
    return [
      { question: '45 + 25 = ?', options: ['60', '65', '70', '75'], correctAnswer: 2, explanation: '45+25=70' },
      { question: '90 - 40 = ?', options: ['40', '45', '50', '55'], correctAnswer: 2, explanation: '90-40=50' },
      { question: '6 × 7 = ?', options: ['36', '40', '42', '48'], correctAnswer: 2, explanation: '6×7=42' },
      { question: '81 ÷ 9 = ?', options: ['7', '8', '9', '6'], correctAnswer: 2, explanation: '81/9=9' },
      { question: 'Largest number?', options: ['456', '465', '546', '564'], correctAnswer: 3, explanation: '564 largest' },
      { question: 'Half of 50?', options: ['20', '25', '30', '35'], correctAnswer: 1, explanation: 'Half=25' },
      { question: 'Quarter of 100?', options: ['20', '25', '30', '40'], correctAnswer: 1, explanation: '1/4 of 100=25' },
      { question: 'Perimeter of square side 5?', options: ['10', '15', '20', '25'], correctAnswer: 2, explanation: '4×5=20' },
      { question: 'Area 6×4?', options: ['20', '22', '24', '26'], correctAnswer: 2, explanation: 'Area=24' },
      { question: 'Roman of 10?', options: ['X', 'V', 'L', 'C'], correctAnswer: 0, explanation: '10=X' },
      { question: 'Place value of 5 in 543?', options: ['5', '50', '500', '5000'], correctAnswer: 2, explanation: '500' },
      { question: 'Even number?', options: ['3', '5', '8', '9'], correctAnswer: 2, explanation: '8 even' },
      { question: 'Odd number?', options: ['4', '6', '9', '10'], correctAnswer: 2, explanation: '9 odd' },
      { question: 'Next number 2,4,6,?', options: ['7', '8', '9', '10'], correctAnswer: 1, explanation: '8' },
      { question: '1000 m = ?', options: ['1 km', '10 km', '100 km', '10000 km'], correctAnswer: 0, explanation: '1 km' },
      { question: '1 hour = ?', options: ['30 min', '60 min', '90 min', '120 min'], correctAnswer: 1, explanation: '60 min' },
      { question: 'Triangle sides?', options: ['2', '3', '4', '5'], correctAnswer: 1, explanation: '3 sides' },
      { question: 'Rectangle sides?', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: '4 sides' },
      { question: '5 tens = ?', options: ['5', '50', '500', '5000'], correctAnswer: 1, explanation: '50' },
      { question: '7 hundreds = ?', options: ['70', '700', '7000', '7'], correctAnswer: 1, explanation: '700' }
    ];
  }
  if (cls === 5 && subject === 'Sanskrit') {
    return [
      { question: 'रामः का अर्थ?', options: ['राम', 'सीता', 'फल', 'पुस्तक'], correctAnswer: 0, explanation: 'रामः = राम' },
      { question: 'फलम् का अर्थ?', options: ['फल', 'जल', 'गाय', 'घर'], correctAnswer: 0, explanation: 'फलम् = फल' },
      { question: 'गच्छति का अर्थ?', options: ['जाता है', 'खाता है', 'पीता है', 'सोता है'], correctAnswer: 0, explanation: 'गच्छति = जाता है' },
      { question: 'पठति का अर्थ?', options: ['पढ़ता है', 'खेलता है', 'सोता है', 'खाता है'], correctAnswer: 0, explanation: 'पठति = पढ़ता है' },
      { question: 'जलम् का अर्थ?', options: ['पानी', 'आग', 'हवा', 'घर'], correctAnswer: 0, explanation: 'जलम् = पानी' },
      { question: 'माता का अर्थ?', options: ['माँ', 'पिता', 'भाई', 'बहन'], correctAnswer: 0, explanation: 'माता = माँ' },
      { question: 'पिता का अर्थ?', options: ['माँ', 'पिता', 'भाई', 'बहन'], correctAnswer: 1, explanation: 'पिता = Father' },
      { question: 'विद्यालयः का अर्थ?', options: ['स्कूल', 'घर', 'मंदिर', 'बाजार'], correctAnswer: 0, explanation: 'विद्यालय = स्कूल' },
      { question: 'पुस्तकम्?', options: ['किताब', 'पेन', 'बैग', 'कुर्सी'], correctAnswer: 0, explanation: 'Book' },
      { question: 'नमः?', options: ['नमस्ते', 'धन्यवाद', 'अलविदा', 'हाँ'], correctAnswer: 0, explanation: 'नमः = नमस्ते' },
      { question: 'बालकः?', options: ['लड़का', 'लड़की', 'गाय', 'फल'], correctAnswer: 0, explanation: 'बालक = लड़का' },
      { question: 'बालिका?', options: ['लड़की', 'लड़का', 'गाय', 'फल'], correctAnswer: 0, explanation: 'बालिका = लड़की' },
      { question: 'अश्वः?', options: ['घोड़ा', 'गाय', 'कुत्ता', 'बिल्ली'], correctAnswer: 0, explanation: 'अश्व = घोड़ा' },
      { question: 'गायत्री?', options: ['लड़की', 'गाय', 'मंत्र', 'फल'], correctAnswer: 2, explanation: 'गायत्री मंत्र' },
      { question: 'क्रीडति?', options: ['खेलता है', 'सोता है', 'खाता है', 'पढ़ता है'], correctAnswer: 0, explanation: 'Play' },
      { question: 'धावति?', options: ['दौड़ता है', 'खेलता है', 'सोता है', 'पढ़ता है'], correctAnswer: 0, explanation: 'Run' },
      { question: 'हसति?', options: ['हँसता है', 'रोता है', 'सोता है', 'खाता है'], correctAnswer: 0, explanation: 'Laugh' },
      { question: 'रोदिति?', options: ['रोता है', 'हँसता है', 'खेलता है', 'खाता है'], correctAnswer: 0, explanation: 'Cry' },
      { question: 'खादति?', options: ['खाता है', 'पीता है', 'सोता है', 'दौड़ता है'], correctAnswer: 0, explanation: 'Eat' },
      { question: 'पिबति?', options: ['पीता है', 'खाता है', 'सोता है', 'दौड़ता है'], correctAnswer: 0, explanation: 'Drink' }
    ];
  }
  if (cls === 6 && subject === 'Mathematics') {
    return [
      { question: 'LCM of 12 and 15?', options: ['30', '60', '45', '90'], correctAnswer: 1, explanation: 'LCM = 60' },
      { question: 'HCF of 18 and 24?', options: ['6', '8', '12', '9'], correctAnswer: 0, explanation: 'HCF = 6' },
      { question: 'Perimeter of rectangle 5 and 3?', options: ['16', '15', '20', '18'], correctAnswer: 0, explanation: '2(5+3)=16' },
      { question: 'Area of square side 6?', options: ['12', '24', '36', '18'], correctAnswer: 2, explanation: '6×6=36' },
      { question: '1 km = ?', options: ['100 m', '1000 m', '10 m', '500 m'], correctAnswer: 1, explanation: '1000 m' },
      { question: 'Convert 500 cm to m', options: ['5', '50', '0.5', '5000'], correctAnswer: 0, explanation: '500 cm = 5 m' },
      { question: 'Simplify 20 + 15 × 2', options: ['50', '40', '35', '60'], correctAnswer: 0, explanation: 'BODMAS = 50' },
      { question: 'Prime number?', options: ['9', '15', '17', '21'], correctAnswer: 2, explanation: '17 prime' },
      { question: 'Composite number?', options: ['13', '17', '19', '21'], correctAnswer: 3, explanation: '21 composite' },
      { question: 'Fraction 1/2 + 1/2?', options: ['1', '2', '1/2', '0'], correctAnswer: 0, explanation: '1' },
      { question: 'Roman numeral L = ?', options: ['10', '50', '100', '500'], correctAnswer: 1, explanation: 'L = 50' },
      { question: 'Angle less than 90?', options: ['Obtuse', 'Acute', 'Right', 'Straight'], correctAnswer: 1, explanation: 'Acute angle' },
      { question: 'Triangle angles sum?', options: ['90', '180', '270', '360'], correctAnswer: 1, explanation: '180°' },
      { question: '7² = ?', options: ['14', '49', '21', '28'], correctAnswer: 1, explanation: '49' },
      { question: 'Cube of 3?', options: ['6', '9', '27', '18'], correctAnswer: 2, explanation: '27' },
      { question: '100 ÷ 25?', options: ['2', '3', '4', '5'], correctAnswer: 2, explanation: '4' },
      { question: 'Decimal of 1/4?', options: ['0.25', '0.5', '0.75', '1'], correctAnswer: 0, explanation: '0.25' },
      { question: 'Even number?', options: ['11', '13', '18', '19'], correctAnswer: 2, explanation: '18 even' },
      { question: 'Mean of 2,4,6?', options: ['4', '5', '6', '3'], correctAnswer: 0, explanation: 'Mean=4' },
      { question: 'Perimeter of square side 8?', options: ['16', '24', '32', '40'], correctAnswer: 2, explanation: '32' }
    ];
  }
  if (cls === 7 && subject === 'English') {
    return [
      { question: 'Synonym of Brave?', options: ['Coward', 'Bold', 'Weak', 'Lazy'], correctAnswer: 1, explanation: 'Brave = Bold' },
      { question: 'Antonym of Rich?', options: ['Poor', 'Happy', 'Tall', 'Big'], correctAnswer: 0, explanation: 'Rich ka opposite Poor' },
      { question: 'Noun in sentence: Ram plays cricket', options: ['Ram', 'plays', 'cricket', 'plays cricket'], correctAnswer: 0, explanation: 'Ram noun' },
      { question: 'Verb?', options: ['Run', 'Table', 'Boy', 'Chair'], correctAnswer: 0, explanation: 'Run verb' },
      { question: 'Adjective?', options: ['Beautiful', 'Run', 'Eat', 'Jump'], correctAnswer: 0, explanation: 'Beautiful adjective' },
      { question: 'Plural of Child?', options: ['Childs', 'Children', 'Childes', 'Child'], correctAnswer: 1, explanation: 'Children' },
      { question: 'Past of Eat?', options: ['Eated', 'Ate', 'Eat', 'Eating'], correctAnswer: 1, explanation: 'Eat → Ate' },
      { question: 'He ___ going.', options: ['is', 'are', 'am', 'be'], correctAnswer: 0, explanation: 'He is going' },
      { question: 'They ___ playing.', options: ['is', 'are', 'am', 'be'], correctAnswer: 1, explanation: 'They are playing' },
      { question: 'Pronoun?', options: ['He', 'Ram', 'Book', 'Pen'], correctAnswer: 0, explanation: 'He pronoun' },
      { question: 'Article before apple?', options: ['a', 'an', 'the', 'no'], correctAnswer: 1, explanation: 'an apple' },
      { question: 'Correct sentence?', options: ['She go to school', 'She goes to school', 'She going school', 'She gone school'], correctAnswer: 1, explanation: 'Correct grammar' },
      { question: 'Opposite of Early?', options: ['Late', 'Fast', 'Quick', 'Soon'], correctAnswer: 0, explanation: 'Early opposite Late' },
      { question: 'Synonym of Happy?', options: ['Sad', 'Joyful', 'Angry', 'Cry'], correctAnswer: 1, explanation: 'Happy = Joyful' },
      { question: 'Future tense of go?', options: ['Went', 'Gone', 'Will go', 'Going'], correctAnswer: 2, explanation: 'Will go' },
      { question: 'Preposition?', options: ['in', 'run', 'happy', 'boy'], correctAnswer: 0, explanation: 'in preposition' },
      { question: 'Adverb?', options: ['Quickly', 'Quick', 'Run', 'Boy'], correctAnswer: 0, explanation: 'Quickly adverb' },
      { question: 'Which is sentence?', options: ['Running fast', 'The boy runs', 'Blue', 'Happy'], correctAnswer: 1, explanation: 'Complete sentence' },
      { question: 'Conjunction?', options: ['and', 'run', 'boy', 'happy'], correctAnswer: 0, explanation: 'and conjunction' },
      { question: 'Opposite of Hot?', options: ['Cold', 'Warm', 'Cool', 'Heat'], correctAnswer: 0, explanation: 'Hot opposite Cold' }
    ];
  }
  if (cls === 8 && subject === 'GK') {
    return [
      { question: 'Capital of India?', options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'], correctAnswer: 1, explanation: 'Delhi capital hai' },
      { question: 'National animal?', options: ['Lion', 'Tiger', 'Elephant', 'Horse'], correctAnswer: 1, explanation: 'Tiger' },
      { question: 'National bird?', options: ['Parrot', 'Peacock', 'Crow', 'Sparrow'], correctAnswer: 1, explanation: 'Peacock' },
      { question: 'Largest planet?', options: ['Earth', 'Mars', 'Jupiter', 'Venus'], correctAnswer: 2, explanation: 'Jupiter largest' },
      { question: 'Smallest planet?', options: ['Mercury', 'Mars', 'Venus', 'Earth'], correctAnswer: 0, explanation: 'Mercury smallest' },
      { question: 'Freedom year?', options: ['1947', '1950', '1930', '1942'], correctAnswer: 0, explanation: '1947' },
      { question: 'Father of Nation?', options: ['Nehru', 'Gandhi', 'Bhagat Singh', 'Patel'], correctAnswer: 1, explanation: 'Gandhi ji' },
      { question: 'Currency of India?', options: ['Dollar', 'Rupee', 'Yen', 'Euro'], correctAnswer: 1, explanation: 'Rupee' },
      { question: 'Red planet?', options: ['Earth', 'Mars', 'Jupiter', 'Saturn'], correctAnswer: 1, explanation: 'Mars' },
      { question: 'Water formula?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 0, explanation: 'H2O' },
      { question: 'Sun is a?', options: ['Planet', 'Star', 'Satellite', 'Asteroid'], correctAnswer: 1, explanation: 'Star' },
      { question: 'How many continents?', options: ['5', '6', '7', '8'], correctAnswer: 2, explanation: '7 continents' },
      { question: 'Largest ocean?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correctAnswer: 2, explanation: 'Pacific' },
      { question: 'Fastest land animal?', options: ['Tiger', 'Lion', 'Cheetah', 'Horse'], correctAnswer: 2, explanation: 'Cheetah' },
      { question: 'National flower?', options: ['Rose', 'Lotus', 'Sunflower', 'Lily'], correctAnswer: 1, explanation: 'Lotus' },
      { question: 'Prime Minister of India?', options: ['President', 'PM', 'CM', 'Governor'], correctAnswer: 1, explanation: 'PM' },
      { question: 'Largest mammal?', options: ['Elephant', 'Blue Whale', 'Giraffe', 'Shark'], correctAnswer: 1, explanation: 'Blue Whale' },
      { question: '1 byte = ?', options: ['4 bits', '8 bits', '16 bits', '32 bits'], correctAnswer: 1, explanation: '8 bits' },
      { question: 'Computer brain?', options: ['CPU', 'Mouse', 'Keyboard', 'Monitor'], correctAnswer: 0, explanation: 'CPU' },
      { question: 'Internet is?', options: ['Network', 'Device', 'Software', 'Cable'], correctAnswer: 0, explanation: 'Network' }
    ];
  }
  if (cls === 9 && subject === 'Computer') {
    return [
      { question: 'Brain of computer?', options: ['CPU', 'Mouse', 'Keyboard', 'Monitor'], correctAnswer: 0, explanation: 'CPU brain' },
      { question: 'Full form of CPU?', options: ['Central Process Unit', 'Central Processing Unit', 'Computer Process Unit', 'Control Process Unit'], correctAnswer: 1, explanation: 'CPU full form' },
      { question: 'Input device?', options: ['Mouse', 'Monitor', 'Printer', 'Speaker'], correctAnswer: 0, explanation: 'Mouse input' },
      { question: 'Output device?', options: ['Keyboard', 'Mouse', 'Monitor', 'Scanner'], correctAnswer: 2, explanation: 'Monitor output' },
      { question: 'Binary digits?', options: ['0 and 1', '1 and 2', '2 and 3', '0 and 2'], correctAnswer: 0, explanation: 'Binary 0,1' },
      { question: '1 byte = ?', options: ['4 bits', '8 bits', '16 bits', '32 bits'], correctAnswer: 1, explanation: '8 bits' },
      { question: 'Operating system?', options: ['Windows', 'Mouse', 'CPU', 'Printer'], correctAnswer: 0, explanation: 'Windows OS' },
      { question: 'Storage device?', options: ['Hard disk', 'Mouse', 'Keyboard', 'Monitor'], correctAnswer: 0, explanation: 'Hard disk' },
      { question: 'Full form of RAM?', options: ['Random Access Memory', 'Read Access Memory', 'Run Access Memory', 'Real Access Memory'], correctAnswer: 0, explanation: 'RAM' },
      { question: 'Full form of ROM?', options: ['Read Only Memory', 'Random Only Memory', 'Run Only Memory', 'Real Only Memory'], correctAnswer: 0, explanation: 'ROM' },
      { question: 'Internet is?', options: ['Network', 'Device', 'Software', 'Hardware'], correctAnswer: 0, explanation: 'Network' },
      { question: 'Email is?', options: ['Electronic mail', 'Electric mail', 'Easy mail', 'None'], correctAnswer: 0, explanation: 'Electronic mail' },
      { question: 'WWW full form?', options: ['World Wide Web', 'World Web Wide', 'Web World Wide', 'Wide World Web'], correctAnswer: 0, explanation: 'WWW' },
      { question: 'Keyboard keys?', options: ['Input', 'Output', 'Storage', 'Process'], correctAnswer: 0, explanation: 'Input' },
      { question: 'Monitor shows?', options: ['Output', 'Input', 'Process', 'Storage'], correctAnswer: 0, explanation: 'Output' },
      { question: 'Printer is?', options: ['Output', 'Input', 'Storage', 'CPU'], correctAnswer: 0, explanation: 'Output' },
      { question: 'Scanner is?', options: ['Input', 'Output', 'Storage', 'CPU'], correctAnswer: 0, explanation: 'Input' },
      { question: 'ALU stands for?', options: ['Arithmetic Logic Unit', 'Array Logic Unit', 'Access Logic Unit', 'None'], correctAnswer: 0, explanation: 'ALU' },
      { question: 'Software means?', options: ['Programs', 'Keyboard', 'Mouse', 'Monitor'], correctAnswer: 0, explanation: 'Programs' },
      { question: 'Hardware means?', options: ['Physical parts', 'Programs', 'Internet', 'Email'], correctAnswer: 0, explanation: 'Physical parts' }
    ];
  }
  if (cls === 10 && subject === 'Social Science') {
    return [
      { question: 'Who was the first President of India?', options: ['Nehru', 'Gandhi', 'Rajendra Prasad', 'Patel'], correctAnswer: 2, explanation: 'Dr. Rajendra Prasad' },
      { question: 'When did India get independence?', options: ['1945', '1947', '1950', '1930'], correctAnswer: 1, explanation: '1947' },
      { question: 'Capital of India?', options: ['Mumbai', 'Delhi', 'Kolkata', 'Chennai'], correctAnswer: 1, explanation: 'New Delhi' },
      { question: 'Green Revolution related to?', options: ['Milk', 'Agriculture', 'Transport', 'Communication'], correctAnswer: 1, explanation: 'Agriculture' },
      { question: 'Which soil is best for cotton?', options: ['Black soil', 'Red soil', 'Alluvial', 'Desert'], correctAnswer: 0, explanation: 'Black soil' },
      { question: 'Largest democracy?', options: ['USA', 'India', 'China', 'Russia'], correctAnswer: 1, explanation: 'India' },
      { question: 'What is GDP?', options: ['Gross Domestic Product', 'General Domestic Product', 'Global Development Product', 'None'], correctAnswer: 0, explanation: 'GDP' },
      { question: 'Which sector is primary?', options: ['Agriculture', 'IT', 'Banking', 'Transport'], correctAnswer: 0, explanation: 'Agriculture' },
      { question: 'Which river is longest in India?', options: ['Ganga', 'Yamuna', 'Godavari', 'Narmada'], correctAnswer: 0, explanation: 'Ganga' },
      { question: 'Forest conservation means?', options: ['Cut trees', 'Protect forest', 'Burn forest', 'None'], correctAnswer: 1, explanation: 'Protect forest' },
      { question: 'Democracy means?', options: ['Rule by king', 'Rule by people', 'Rule by army', 'Rule by queen'], correctAnswer: 1, explanation: 'Rule by people' },
      { question: 'Inflation means?', options: ['Price rise', 'Price fall', 'No change', 'None'], correctAnswer: 0, explanation: 'Price rise' },
      { question: 'Literacy rate means?', options: ['Reading ability', 'Writing ability', 'Educated people %', 'None'], correctAnswer: 2, explanation: 'Educated %' },
      { question: 'Who makes laws in India?', options: ['Judiciary', 'Executive', 'Parliament', 'Police'], correctAnswer: 2, explanation: 'Parliament' },
      { question: 'Who is head of state?', options: ['PM', 'President', 'CM', 'Governor'], correctAnswer: 1, explanation: 'President' },
      { question: 'Which is renewable resource?', options: ['Coal', 'Petrol', 'Solar', 'Diesel'], correctAnswer: 2, explanation: 'Solar energy' },
      { question: 'Population census held every?', options: ['5 years', '10 years', '2 years', '20 years'], correctAnswer: 1, explanation: '10 years' },
      { question: 'Mahatma Gandhi related to?', options: ['Freedom movement', 'Science', 'Math', 'Sports'], correctAnswer: 0, explanation: 'Freedom movement' },
      { question: 'UNO formed in?', options: ['1945', '1947', '1950', '1930'], correctAnswer: 0, explanation: '1945' },
      { question: 'Consumer rights protect?', options: ['Sellers', 'Buyers', 'Farmers', 'Teachers'], correctAnswer: 1, explanation: 'Buyers' }
    ];
  }
  if (cls === 11 && subject === 'Mathematics') {
    return [
      { question: 'sin 30° = ?', options: ['0.5', '1', '0', '√3'], correctAnswer: 0, explanation: 'sin30=1/2' },
      { question: 'cos 60° = ?', options: ['0.5', '1', '0', '√3'], correctAnswer: 0, explanation: 'cos60=1/2' },
      { question: 'tan 45° = ?', options: ['0', '1', '√3', '0.5'], correctAnswer: 1, explanation: 'tan45=1' },
      { question: 'log10(100) = ?', options: ['1', '2', '3', '4'], correctAnswer: 1, explanation: 'log100=2' },
      { question: '2² = ?', options: ['2', '4', '6', '8'], correctAnswer: 1, explanation: '4' },
      { question: '√144 = ?', options: ['10', '11', '12', '13'], correctAnswer: 2, explanation: '12' },
      { question: 'Derivative of x²?', options: ['x', '2x', 'x²', '2'], correctAnswer: 1, explanation: '2x' },
      { question: 'If A={1,2} B={2,3} then A∪B?', options: ['1,2', '2,3', '1,2,3', '1,3'], correctAnswer: 2, explanation: 'Union' },
      { question: 'If A={1,2} B={2,3} then A∩B?', options: ['1', '2', '3', '1,2'], correctAnswer: 1, explanation: 'Intersection=2' },
      { question: 'Slope formula?', options: ['y2-y1/x2-x1', 'x2-x1/y2-y1', 'x+y', 'y-x'], correctAnswer: 0, explanation: 'Slope formula' },
      { question: 'Distance formula?', options: ['√(x2-x1)²+(y2-y1)²', 'x+y', 'x-y', 'None'], correctAnswer: 0, explanation: 'Distance formula' },
      { question: 'Probability range?', options: ['0 to1', '1 to10', '0 to10', '-1 to1'], correctAnswer: 0, explanation: '0–1' },
      { question: 'Mean formula?', options: ['Sum/n', 'n/sum', 'sum×n', 'None'], correctAnswer: 0, explanation: 'Mean=sum/n' },
      { question: 'If f(x)=x then f(2)?', options: ['1', '2', '3', '4'], correctAnswer: 1, explanation: '2' },
      { question: 'Angle in straight line?', options: ['90', '180', '360', '270'], correctAnswer: 1, explanation: '180°' },
      { question: 'Circle angle?', options: ['90', '180', '360', '270'], correctAnswer: 2, explanation: '360°' },
      { question: 'Quadratic equation?', options: ['ax²+bx+c', 'ax+b', 'x²', 'None'], correctAnswer: 0, explanation: 'Quadratic' },
      { question: 'Even function example?', options: ['x²', 'x³', 'x', 'None'], correctAnswer: 0, explanation: 'x² even' },
      { question: 'Odd function example?', options: ['x²', 'x³', '4', '2'], correctAnswer: 1, explanation: 'x³ odd' },
      { question: 'sin²θ+cos²θ=?', options: ['1', '0', '2', '-1'], correctAnswer: 0, explanation: 'Identity' }
    ];
  }
  if (cls === 12 && subject === 'Chemistry') {
    return [
      { question: 'Atomic number of Carbon?', options: ['4', '5', '6', '7'], correctAnswer: 2, explanation: 'Carbon=6' },
      { question: 'pH of pure water?', options: ['5', '6', '7', '8'], correctAnswer: 2, explanation: '7 neutral' },
      { question: 'NaCl is?', options: ['Acid', 'Base', 'Salt', 'Metal'], correctAnswer: 2, explanation: 'Salt' },
      { question: 'HCl is?', options: ['Acid', 'Base', 'Salt', 'Metal'], correctAnswer: 0, explanation: 'Acid' },
      { question: 'NaOH is?', options: ['Acid', 'Base', 'Salt', 'Gas'], correctAnswer: 1, explanation: 'Base' },
      { question: 'Electron charge?', options: ['Positive', 'Negative', 'Neutral', 'None'], correctAnswer: 1, explanation: 'Negative' },
      { question: 'Proton charge?', options: ['Positive', 'Negative', 'Neutral', 'None'], correctAnswer: 0, explanation: 'Positive' },
      { question: 'Neutron charge?', options: ['Positive', 'Negative', 'Neutral', 'None'], correctAnswer: 2, explanation: 'Neutral' },
      { question: 'Water formula?', options: ['H2O', 'CO2', 'O2', 'NaCl'], correctAnswer: 0, explanation: 'H2O' },
      { question: 'Molar mass of H2O?', options: ['18', '16', '20', '22'], correctAnswer: 0, explanation: '18' },
      { question: 'Avogadro number?', options: ['6.022×10²³', '3×10⁸', '1×10²³', '9.8'], correctAnswer: 0, explanation: 'Avogadro number' },
      { question: 'Organic chemistry studies?', options: ['Carbon compounds', 'Metals', 'Salts', 'Gas'], correctAnswer: 0, explanation: 'Carbon compounds' },
      { question: 'Oxidation means?', options: ['Gain e-', 'Loss e-', 'Gain proton', 'None'], correctAnswer: 1, explanation: 'Loss of electrons' },
      { question: 'Reduction means?', options: ['Loss e-', 'Gain e-', 'Gain neutron', 'None'], correctAnswer: 1, explanation: 'Gain of electrons' },
      { question: 'Catalyst does?', options: ['Increase rate', 'Decrease rate', 'Stop reaction', 'None'], correctAnswer: 0, explanation: 'Increase rate' },
      { question: 'Endothermic reaction?', options: ['Absorb heat', 'Release heat', 'No heat', 'None'], correctAnswer: 0, explanation: 'Absorb heat' },
      { question: 'Exothermic reaction?', options: ['Absorb heat', 'Release heat', 'No heat', 'None'], correctAnswer: 1, explanation: 'Release heat' },
      { question: 'Periodic table invented by?', options: ['Newton', 'Mendeleev', 'Einstein', 'Bohr'], correctAnswer: 1, explanation: 'Mendeleev' },
      { question: 'Smallest particle?', options: ['Atom', 'Molecule', 'Cell', 'Electron'], correctAnswer: 0, explanation: 'Atom basic unit' },
      { question: 'Gas law PV=?', options: ['nRT', 'RT', 'nR', 'PT'], correctAnswer: 0, explanation: 'PV=nRT' }
    ];
  }
}

module.exports = router;
