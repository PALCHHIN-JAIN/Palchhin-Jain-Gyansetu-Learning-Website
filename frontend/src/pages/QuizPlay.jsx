import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';

export default function QuizPlay() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLang();

  // Get quiz from navigation state
  const quiz = location.state?.quiz;
  const selectedClass = location.state?.class;
  const subject = location.state?.subject;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeLeft, setTimeLeft] = useState((quiz?.timeLimit || 15) * 60);
  const [startTime, setStartTime] = useState(Date.now());

  // 🔥 Reset state when new quiz comes
  useEffect(() => {
    if (quiz) {
      setCurrent(0);
      setAnswers({});
      setSubmitted(false);
      setResults(null);
      setTimeLeft((quiz.timeLimit || 15) * 60);
      setStartTime(Date.now());
    }
  }, [quiz]);

  const submitQuiz = useCallback(async () => {
    if (submitted) return;
    setSubmitted(true);

    const answerArr = quiz.questions.map((_, i) => answers[i] ?? -1);

    try {
      const token = localStorage.getItem('token');

      const { data } = await axios.post(
        'http://localhost:5000/api/quiz/submit',
        {
          quizId: quiz._id,
          answers: answerArr,
          timeTaken: Math.round((Date.now() - startTime) / 1000)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setResults(data);
    } catch (err) {
      console.error(err);
    }
  }, [quiz, answers, submitted, startTime]);

  // Timer
  useEffect(() => {
    if (!quiz || !quiz.questions) {
      navigate('/quiz');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, navigate, submitQuiz]);

  if (!quiz || !quiz.questions) return null;

  const formatTime = (s) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60)
      .toString()
      .padStart(2, '0')}`;

  const q = quiz.questions[current];
  const progress = ((current + 1) / quiz.questions.length) * 100;
  const optionLabels = ['A', 'B', 'C', 'D'];

  const handleSelect = (idx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [current]: idx }));
  };

  const getOptionClass = (idx) => {
    if (!submitted && answers[current] === idx) return 'selected';
    if (submitted) {
      if (idx === q.correctAnswer) return 'correct';
      if (idx === answers[current] && idx !== q.correctAnswer) return 'incorrect';
    }
    return '';
  };

  // Results screen
  if (results) {
    return (
      <div className="quiz-page">
        <div className="quiz-play-container">
          <div className="result-card">
            <h2>Score: {results.score} / {results.total}</h2>
            <h3>Grade: {results.grade}</h3>
            <p>{results.percentage}%</p>

            <div style={{ marginTop: '20px' }}>
              <button onClick={() => navigate('/quiz')} className="btn btn-outline">
                Try Again
              </button>
              <Link to="/dashboard" className="btn btn-primary">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="quiz-page">
      <div className="quiz-play-container">

        {/* Progress */}
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Header */}
        <div className="quiz-header">
          <div>
            Question {current + 1} of {quiz.questions.length}
          </div>
          <div className="quiz-timer">{formatTime(timeLeft)}</div>
        </div>

        {/* Question */}
        <div className="question-card">
          <p className="question-text">{q.question}</p>
          <div className="options-grid">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${getOptionClass(idx)}`}
                onClick={() => handleSelect(idx)}
                disabled={submitted}
              >
                <span>{optionLabels[idx]}</span> {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            onClick={() => setCurrent(p => p - 1)}
            disabled={current === 0}
            className="btn btn-outline"
          >
            Previous
          </button>

          {current < quiz.questions.length - 1 ? (
            <button
              onClick={() => setCurrent(p => p + 1)}
              className="btn btn-primary"
            >
              Next
            </button>
          ) : (
            <button
              onClick={submitQuiz}
              disabled={submitted}
              className="btn btn-primary"
            >
              Submit Quiz
            </button>
          )}
        </div>

      </div>
    </div>
  );
}