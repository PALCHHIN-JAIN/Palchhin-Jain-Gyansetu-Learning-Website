import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import { useAuth } from '../context/AuthContext';

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const QuizIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoModal, setVideoModal] = useState(null);
  const [completed, setCompleted] = useState([]);
  const { t } = useLang();
  const { user } = useAuth();

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${id}`)
      .then(({ data }) => setCourse(data.course))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const markComplete = async (chapterNo) => {
    if (!user) return;
    setCompleted(prev => [...new Set([...prev, chapterNo])]);
    try {
      await axios.post('http://localhost:5000/api/progress/update', {
        courseId: id,
        chapterNo,
        class: course?.class,
        subject: course?.subject
      });
    } catch (err) { console.error(err); }
  };

  const getYouTubeId = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!course) return <div style={{ textAlign: 'center', padding: '4rem' }}>Course not found</div>;

  const progressPct = Math.round((completed.length / (course.chapters?.length || 1)) * 100);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #052e16, #166534)',
        padding: '2.5rem 2rem', color: 'white'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <Link to="/courses" style={{
            color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.85rem', fontWeight: '700', marginBottom: '1rem'
          }}>
            <BackIcon /> Back to Courses
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ opacity: 0.8, marginBottom: '6px', fontSize: '0.85rem', fontWeight: '700' }}>
                {t('class')} {course.class}
              </div>
              <h1 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '2rem', fontWeight: '900', marginBottom: '8px' }}>
                {course.subject}
              </h1>
              <p style={{ opacity: 0.8, maxWidth: '600px', lineHeight: 1.7 }}>{course.description}</p>
            </div>
            {user && (
              <Link
                to={`/quiz?class=${course.class}&subject=${course.subject}`}
                className="btn btn-white"
              >
                <QuizIcon /> Practice Quiz
              </Link>
            )}
          </div>

          {/* Progress */}
          <div style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem', opacity: 0.8, fontWeight: '700' }}>
              <span>{completed.length} of {course.chapters?.length} chapters complete</span>
              <span>{progressPct}%</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50px', height: '8px' }}>
              <div style={{
                width: `${progressPct}%`, height: '100%',
                background: 'var(--green-400)', borderRadius: '50px',
                transition: 'width 0.5s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="section" style={{ background: 'var(--gray-50)' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem', color: 'var(--gray-800)' }}>
            All Chapters ({course.chapters?.length})
          </h2>
          <div className="chapter-list">
            {course.chapters?.map((chapter) => {
              const isDone = completed.includes(chapter.chapterNo);
              return (
                <div key={chapter.chapterNo} className={`chapter-item ${isDone ? 'done' : ''}`}>
                  <div className="chapter-num">
                    {isDone ? <CheckIcon /> : chapter.chapterNo}
                  </div>
                  <div className="chapter-info">
                    <div className="chapter-title">{chapter.title}</div>
                    <div className="chapter-duration">
                      {chapter.duration} • {chapter.topics?.length || 0} topics
                    </div>
                    {chapter.topics && chapter.topics.length > 0 && (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                        {chapter.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} style={{
                            background: 'var(--green-100)', color: 'var(--green-700)',
                            padding: '2px 8px', borderRadius: '4px',
                            fontSize: '0.7rem', fontWeight: '700'
                          }}>{topic}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="chapter-actions">
                    {chapter.youtubeUrl && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => setVideoModal(chapter)}
                      >
                        <PlayIcon /> {t('watchVideo')}
                      </button>
                    )}
                    {user && !isDone && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => markComplete(chapter.chapterNo)}
                      >
                        <CheckIcon /> {t('markComplete')}
                      </button>
                    )}
                    {isDone && (
                      <span style={{
                        background: 'var(--green-100)', color: 'var(--green-700)',
                        padding: '6px 12px', borderRadius: '9px',
                        fontSize: '0.82rem', fontWeight: '800',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}>
                        <CheckIcon /> {t('completed')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {videoModal && (
        <div className="modal-overlay" onClick={() => setVideoModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">
                Ch. {videoModal.chapterNo}: {videoModal.title}
              </span>
              <button className="modal-close" onClick={() => setVideoModal(null)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="video-wrapper">
              {getYouTubeId(videoModal.youtubeUrl) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(videoModal.youtubeUrl)}?autoplay=1`}
                  title={videoModal.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px', background: '#000', color: 'white' }}>
                  <a href={videoModal.youtubeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    Open YouTube Video
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
