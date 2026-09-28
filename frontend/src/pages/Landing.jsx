import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import heroImage from '../assets/hero.png';
const BookIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const QuizIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LangIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const FreeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

// Inline rows: Row1 = Primary + Middle, Row2 = Secondary + Senior
const buildInlineRows = (classGroups) => [
  { segments: [classGroups[0], classGroups[1]] },
  { segments: [classGroups[2], classGroups[3]] },
];

function ClassCircle({ cls, t }) {
  return (
    <Link
      to={`/courses?class=${cls}`}
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        border: '2px solid #bbf7d0',
        background: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '0.95rem',
        color: '#111827',
        textDecoration: 'none',
        flexShrink: 0,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#16a34a';
        e.currentTarget.style.color = 'white';
        e.currentTarget.style.borderColor = '#16a34a';
        e.currentTarget.style.transform = 'scale(1.12)';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(22,163,74,0.35)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.color = '#111827';
        e.currentTarget.style.borderColor = '#bbf7d0';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {cls}
    </Link>
  );
}

export default function Landing() {
  const { t } = useLang();

  const features = [
    { icon: <BookIcon />, titleKey: 'feature1Title', descKey: 'feature1Desc' },
    { icon: <QuizIcon />, titleKey: 'feature2Title', descKey: 'feature2Desc' },
    { icon: <LangIcon />, titleKey: 'feature3Title', descKey: 'feature3Desc' },
    { icon: <FreeIcon />, titleKey: 'feature4Title', descKey: 'feature4Desc' }
  ];

  const classGroups = [
    { label: t('primary'), range: [1, 2, 3, 4, 5] },
    { label: t('middle'), range: [6, 7, 8] },
    { label: t('secondary'), range: [9, 10, 11, 12] },
    { label: t('senior'), range: [11, 12] },
  ];

  const inlineRows = buildInlineRows(classGroups);

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text animate-in">
            <div className="hero-badge">
              <StarIcon />
              India's Free Rural E-Learning Platform
            </div>
            <h1 className="hero-title">
              {t('heroTitle')}<br />
              <span className="accent">{t('heroSubtitle')}</span>
            </h1>
            <p className="hero-desc">{t('heroDesc')}</p>
            <div className="hero-btns">
              <Link to="/register" className="btn btn-primary btn-lg">
                {t('startLearning')} <ArrowIcon />
              </Link>
              <Link to="/courses" className="btn btn-white btn-lg">
                <PlayIcon /> {t('courses')}
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-num">10+</span>
                <span className="hero-stat-label">{t('statsStudents')}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">80+</span>
                <span className="hero-stat-label">{t('statsCourses')}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">100+</span>
                <span className="hero-stat-label">{t('statsQuizzes')}</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num">5+</span>
                <span className="hero-stat-label">{t('statsLanguages')}</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <img
              src={heroImage}
              alt="Learning Growth"
              className="hero-img"
              style={{ width: "100%", maxWidth: "700px" }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Why GyaanSetu?</span>
            <h2 className="section-title">
              Everything a Student Needs,<br /><span>All in One Place</span>
            </h2>
            <p className="section-desc">Designed especially for rural students with limited resources</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card animate-in" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{t(f.titleKey)}</h3>
                <p className="feature-desc">{t(f.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Class Selection — redesigned to match image ── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('selectClass')}</span>
            <h2 className="section-title">
              {t('class')} 1 to 12 <span>Complete Coverage</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            {inlineRows.map((row, rowIdx) => (
              <div
                key={rowIdx}
                style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0', justifyContent: 'center' }}
              >
                {row.segments.map((group, segIdx) => (
                  <div
                    key={group.label}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {/* Category pill */}
                    <div style={{
                      background: '#16a34a',
                      color: 'white',
                      padding: '6px 16px',
                      borderRadius: '24px',
                      fontWeight: '700',
                      fontSize: '0.82rem',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      {group.label}
                    </div>

                    {/* Dash after pill */}
                    <div style={{ width: '24px', height: '2px', background: '#86efac', flexShrink: 0 }} />

                    {/* Number circles */}
                    {group.range.map((cls, i) => (
                      <div key={cls} style={{ display: 'flex', alignItems: 'center' }}>
                        <ClassCircle cls={cls} t={t} />
                        {i < group.range.length - 1 && <div style={{ width: '8px' }} />}
                      </div>
                    ))}

                    {/* Trailing dash */}
                    <div style={{ width: '24px', height: '2px', background: '#86efac', flexShrink: 0 }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section section-alt">
        <div className="container">
          {/* Header */}
          <div style={{ marginBottom: '40px' }}>
            <span style={{
              display: 'inline-block', background: '#16a34a', color: 'white',
              fontSize: '0.78rem', fontWeight: '700', padding: '5px 14px',
              borderRadius: '20px', marginBottom: '14px', letterSpacing: '0.02em',
            }}>Why Us</span>
            <h2 style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: '800',
              color: '#111827', margin: 0, lineHeight: 1.2,
            }}>
              Why Students <span style={{ color: '#16a34a' }}>Love Learning</span> Here
            </h2>
          </div>

          <style>{`
            .why-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
            }
            @media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2, 1fr); } }
            @media (max-width: 500px) { .why-grid { grid-template-columns: 1fr; } }
            .why-card {
              background: white; border: 1.5px solid #e5e7eb;
              border-radius: 16px; padding: 28px 24px;
              transition: box-shadow 0.2s, transform 0.2s;
            }
            .why-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.09); transform: translateY(-3px); }
            .why-icon {
              width: 52px; height: 52px; border-radius: 12px;
              display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
            }
            .why-title { font-size: 1.05rem; font-weight: 700; color: #111827; margin: 0 0 10px; }
            .why-desc { font-size: 0.88rem; color: #6b7280; line-height: 1.6; margin: 0; }
          `}</style>

          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon" style={{ background: '#fef9c3' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="#ca8a04" strokeWidth="1.8" fill="#fef08a" fillOpacity="0.4" />
                  <path d="M8 7h8M8 11h5" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="why-title">NCERT Aligned</h3>
              <p className="why-desc">Every chapter mapped to your school syllabus. No extra confusion — just focused prep.</p>
            </div>

            <div className="why-card">
              <div className="why-icon" style={{ background: '#dcfce7' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#16a34a" strokeWidth="1.8" fill="#bbf7d0" fillOpacity="0.4" />
                  <path d="M8.5 12.5l2.5 2.5 4.5-5" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="why-title">Chapter-wise Tests</h3>
              <p className="why-desc">Practice exactly what you studied. Instant scores with detailed explanations.</p>
            </div>

            <div className="why-card">
              <div className="why-icon" style={{ background: '#dbeafe' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="9" cy="7" r="3" stroke="#3b82f6" strokeWidth="1.8" fill="#bfdbfe" fillOpacity="0.5" />
                  <path d="M3 19c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M17 9v6M14 12h6" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="why-title">Expert Teachers</h3>
              <p className="why-desc">Learn from experienced educators who know how to make tough topics simple.</p>
            </div>

            <div className="why-card">
              <div className="why-icon" style={{ background: '#fce7f3' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="3" stroke="#db2777" strokeWidth="1.8" fill="#fbcfe8" fillOpacity="0.3" />
                  <path d="M7 14l3-4 3 3 3-5" stroke="#db2777" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="why-title">Track Progress</h3>
              <p className="why-desc">See how you improve week by week. Stay motivated with your personal growth graph.</p>
            </div>
          </div>
        </div>
      </section>


      {/* CTA */}
      <section style={{
        background: 'linear-gradient(135deg, #052e16, #14532d)',
        padding: '5rem 2rem', textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontFamily: "'Baloo 2', cursive",
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: '900', color: 'white', marginBottom: '1rem'
          }}>
            Start Your Learning Journey Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
            Join thousands of rural students learning for free
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            {t('register')} — It's Free! <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#0a0a0a', color: 'rgba(255,255,255,0.6)',
        padding: '2rem', textAlign: 'center', fontSize: '0.88rem'
      }}>
        <p>© 2026 GyaanSetu — Free Education for Rural India | Made with love for every student</p>
      </footer>
    </div>
  );
}