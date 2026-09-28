import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const subjectColors = {
  Mathematics: 'linear-gradient(135deg, #16a34a, #15803d)',
  Science: 'linear-gradient(135deg, #0891b2, #0e7490)',
  Physics: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
  Chemistry: 'linear-gradient(135deg, #dc2626, #b91c1c)',
  Biology: 'linear-gradient(135deg, #059669, #047857)',
  English: 'linear-gradient(135deg, #ea580c, #c2410c)',
  Hindi: 'linear-gradient(135deg, #d97706, #b45309)',
  'Social Science': 'linear-gradient(135deg, #0284c7, #0369a1)',
  History: 'linear-gradient(135deg, #854d0e, #713f12)',
  Geography: 'linear-gradient(135deg, #166534, #14532d)',
  Accountancy: 'linear-gradient(135deg, #9333ea, #7e22ce)',
  'Business Studies': 'linear-gradient(135deg, #0f766e, #115e59)',
  Economics: 'linear-gradient(135deg, #be185d, #9d174d)',
  default: 'linear-gradient(135deg, #16a34a, #15803d)'
};

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState(0);
  const { t } = useLang();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const cls = searchParams.get('class');
    if (cls) setSelectedClass(parseInt(cls));
  }, [searchParams]);

  useEffect(() => {
    fetchCourses();
  }, [selectedClass]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = selectedClass ? `?class=${selectedClass}` : '';
      const { data } = await axios.get(`http://localhost:5000/api/courses${params}`);
      setCourses(data.courses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = courses.filter(c =>
    c.subject?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-header-title">{t('allCourses')}</h1>
        <p className="page-header-sub">NCERT curriculum for Class 1 to 12 — Free forever</p>
      </div>

      {/* Search */}
      <div style={{ background: 'white', padding: '1.2rem 2rem', borderBottom: '2px solid var(--green-100)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '360px' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }}>
              <SearchIcon />
            </span>
            <input
              type="text" placeholder={`${t('search')} subjects...`}
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 12px 9px 40px',
                border: '2px solid var(--gray-200)', borderRadius: '10px',
                fontSize: '0.9rem', fontFamily: 'inherit', outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Class filter */}
      <div className="class-filter">
        <div className="class-filter-inner">
          <button
            className={`filter-btn ${selectedClass === 0 ? 'active' : ''}`}
            onClick={() => setSelectedClass(0)}
          >
            All Classes
          </button>
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(cls => (
            <button
              key={cls}
              className={`filter-btn ${selectedClass === cls ? 'active' : ''}`}
              onClick={() => setSelectedClass(cls)}
            >
              {t('class')} {cls}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="container">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
              <div className="spinner"></div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1.5rem', color: 'var(--gray-500)', fontWeight: '700', fontSize: '0.9rem' }}>
                {filtered.length} courses found
                {selectedClass > 0 && ` for ${t('class')} ${selectedClass}`}
              </div>
              <div className="courses-grid">
                {filtered.map((course) => (
                  <Link
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className="course-card"
                  >
                    <div className="course-card-header" style={{
                      background: subjectColors[course.subject] || subjectColors.default
                    }}>
                      <div className="course-card-class">{t('class')} {course.class}</div>
                      <div className="course-card-subject">{course.subject}</div>
                    </div>
                    <div className="course-card-body">
                      <p className="course-card-desc">{course.description}</p>
                      <div className="course-card-meta">
                        <span className="course-card-badge">{course.difficulty}</span>
                        <span className="course-card-chapters">
                          {course.totalChapters} {t('chapters')}
                        </span>
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                        {t('enroll')}
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gray-400)' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.4 }}>
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <p style={{ fontWeight: '700', fontSize: '1.1rem' }}>No courses found</p>
                  <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try a different class or search term</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
