import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

const subjectsByClass = {
  1: ['Mathematics', 'English', 'Hindi'],
  2: ['Mathematics', 'English', 'Hindi'],
  3: ['Mathematics', 'English', 'Hindi', 'Environmental Science'],
  4: ['Mathematics', 'English', 'Hindi', 'Environmental Science', 'GK'],
  5: ['Mathematics', 'English', 'Hindi', 'Science', 'GK', 'Social Science', 'Computer'],
  6: ['Mathematics', 'English', 'Hindi', 'Science', 'GK', 'Social Science', 'Computer'],
  7: ['Mathematics', 'English', 'Hindi', 'Science', 'GK', 'Social Science', 'Computer'],
  8: ['Mathematics', 'English', 'Hindi', 'Science', 'GK', 'Social Science', 'Computer'],
  9: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer', 'Sanskrit', 'Urdu'],
  10: ['Mathematics', 'Science', 'Social Science', 'English', 'Hindi', 'Computer', 'Sanskrit', 'Urdu'],
  11: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Political Science'],
  12: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Geography', 'Political Science'],
};

export default function Quiz() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLang();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cls = searchParams.get('class');
    const sub = searchParams.get('subject');
    if (cls) setSelectedClass(cls);
    if (sub) setSelectedSubject(sub);
  }, []);

  const handleStart = async () => {
    if (!selectedClass || !selectedSubject) {
      return setError('Please select class and subject');
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/quiz/generate?class=${selectedClass}&subject=${selectedSubject}&t=${Date.now()}`
      );

      // Force new page load
      navigate('/quiz/play', {
        state: {
          quiz: data.quiz,
          class: selectedClass,
          subject: selectedSubject,
          time: Date.now()
        }
      });

    } catch (err) {
      setError('Failed to generate quiz');
    } finally {
      setLoading(false);
    }
  };

  const subjects = subjectsByClass[parseInt(selectedClass)] || [];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f3f7fb',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '1100px', margin: 'auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span className="section-tag">{t('quizTitle')}</span>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            marginTop: '10px'
          }}>
            {t('generateQuiz')}
          </h1>
          <p style={{ color: '#666' }}>
            Select class and subject to start quiz
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px'
        }}>

          {/* Left Card */}
          <div style={{
            background: 'white',
            padding: '25px',
            borderRadius: '14px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ marginBottom: '15px' }}>Quiz Setup</h2>

            {error && (
              <div style={{
                background: '#fee2e2',
                color: '#991b1b',
                padding: '10px',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                {error}
              </div>
            )}

            {/* Class */}
            <div style={{ marginBottom: '15px' }}>
              <label>Class</label>
              <select
                value={selectedClass}
                onChange={e => {
                  setSelectedClass(e.target.value);
                  setSelectedSubject('');
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginTop: '5px'
                }}
              >
                <option value="">Select Class</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div style={{ marginBottom: '15px' }}>
              <label>Subject</label>
              <select
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                disabled={!selectedClass}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  marginTop: '5px'
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleStart}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Generating Quiz...' : 'Start Quiz'}
            </button>
          </div>

          {/* Right Info */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px'
          }}>
            {[
              { title: '20 Questions', desc: 'Multiple Choice Questions' },
              { title: '20 Minutes', desc: 'Time Limit' },
              { title: '40 Points', desc: 'Per Correct Answer' },
              { title: 'A+ Grade', desc: 'Performance Based' }
            ].map((item, i) => (
              <div key={i} style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid #dcfce7'
              }}>
                <h3 style={{ color: '#16a34a' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#666' }}>{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}