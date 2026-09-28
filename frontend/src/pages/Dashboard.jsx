import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const TrophyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
    <path d="M7 4h10l-1 7a5 5 0 0 1-8 0L7 4z"/><path d="M7 4H4l1 4a3 3 0 0 0 2 1M17 4h3l-1 4a3 3 0 0 1-2 1"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

const BookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const [quizHistory, setQuizHistory] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, progRes] = await Promise.all([
          axios.get('http://localhost:5000/api/quiz/history'),
          axios.get('http://localhost:5000/api/progress/my')
        ]);
        setQuizHistory(histRes.data.history || []);
        setProgress(progRes.data.progresses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const badgeClass = {
    Beginner: 'badge-beginner',
    Learner: 'badge-learner',
    Advanced: 'badge-advanced',
    Scholar: 'badge-scholar'
  }[user?.badge] || 'badge-beginner';

  if (loading) return (
    <div className="loading-screen">
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-grid">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="profile-card">
            <div className="profile-avatar">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="profile-name">{user?.name}</div>
            <div className="profile-class">{t('class')} {user?.class}</div>
            <div className={`badge ${badgeClass}`} style={{ marginBottom: '1rem' }}>
              {user?.badge}
            </div>
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-val">{user?.totalPoints || 0}</span>
                <span className="profile-stat-key">{t('totalPoints')}</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-val">{quizHistory.length}</span>
                <span className="profile-stat-key">Quizzes</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="card">
            <div className="card-title">
              <BookIcon /> Quick Access
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to={`/courses?class=${user?.class}`} className="btn btn-primary">
                My Class Courses
              </Link>
              <Link to="/quiz" className="btn btn-outline">
                Practice Quiz
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div>
          {/* Welcome Banner */}
          <div style={{
            background: 'linear-gradient(135deg, var(--green-600), var(--green-800))',
            borderRadius: 'var(--radius-xl)', padding: '1.8rem 2rem',
            color: 'white', marginBottom: '24px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div>
              <div style={{ opacity: 0.85, fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>
                {t('welcomeBack')},
              </div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.8rem', fontWeight: '900' }}>
                {user?.name}!
              </div>
              <div style={{ opacity: 0.8, fontSize: '0.9rem', marginTop: '4px' }}>
                {t('class')} {user?.class} Student
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ opacity: 0.8, fontSize: '0.85rem' }}>Total Points</div>
              <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2.5rem', fontWeight: '900', color: 'var(--green-300)' }}>
                {user?.totalPoints || 0}
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px'
          }}>
            {[
              { label: 'Quizzes Taken', value: quizHistory.length, icon: <TrophyIcon /> },
              { label: 'Avg Score', value: quizHistory.length ? Math.round(quizHistory.reduce((a, q) => a + (q.score / q.total * 100), 0) / quizHistory.length) + '%' : '0%', icon: <ChartIcon /> },
              { label: 'Courses', value: progress.length, icon: <BookIcon /> }
            ].map((s, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--green-600)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2rem', fontWeight: '900', color: 'var(--gray-800)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', fontWeight: '700' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quiz History */}
          <div className="card">
            <div className="card-title">
              <TrophyIcon /> {t('quizHistory')}
            </div>
            {quizHistory.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '2rem',
                color: 'var(--gray-400)'
              }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '10px', opacity: 0.4 }}>
                  <circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/>
                </svg>
                <p style={{ fontWeight: '700' }}>{t('noHistory')}</p>
                <Link to="/quiz" className="btn btn-primary btn-sm" style={{ marginTop: '12px', display: 'inline-flex' }}>
                  Start Quiz
                </Link>
              </div>
            ) : (
              <div className="quiz-history-list">
                {quizHistory.slice(0, 10).map((item, i) => (
                  <div key={i} className="quiz-history-item">
                    <div>
                      <div className="qhi-subject">{item.subject} — {item.chapter}</div>
                      <div className="qhi-detail">
                        {t('class')} {item.class} • {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="qhi-score">{item.score}/{item.total}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {Math.round(item.score / item.total * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
