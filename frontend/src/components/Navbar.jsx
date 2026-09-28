import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const languageNames = {
  en: { name: 'English', native: 'English' },
  hi: { name: 'Hindi', native: 'हिंदी' },
  bn: { name: 'Bengali', native: 'বাংলা' },
  te: { name: 'Telugu', native: 'తెలుగు' },
  mr: { name: 'Marathi', native: 'मराठी' },
  ta: { name: 'Tamil', native: 'தமிழ்' },
  gu: { name: 'Gujarati', native: 'ગુજરાતી' },
  kn: { name: 'Kannada', native: 'ಕನ್ನಡ' },
  pa: { name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  or: { name: 'Odia', native: 'ଓଡ଼ିଆ' },
};

const GlobeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LogoIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white"/>
    <path d="M2 17l10 5 10-5" stroke="white" strokeWidth="2" fill="none"/>
    <path d="M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none"/>
  </svg>
);

export default function Navbar() {
  const { user, logout } = useAuth();
  const { t, lang, changeLang, isTranslating } = useLang();
  const [showLang, setShowLang] = useState(false);
  const langRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setShowLang(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = languageNames[lang] || languageNames.en;

  return (
    <>
      {isTranslating && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          background: 'linear-gradient(90deg, #16a34a, #4ade80, #16a34a)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.2s infinite',
          height: '3px', zIndex: 9999,
        }} />
      )}
        
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon"><LogoIcon /></div>
            <span className="navbar-logo-text">Gyaan<span>Setu</span></span>
          </Link>

          <div className="navbar-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('home')}</NavLink>
            <NavLink to="/courses" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('courses')}</NavLink>
            {user && <NavLink to="/quiz" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('quiz')}</NavLink>}
            {user && <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>{t('dashboard')}</NavLink>}
          </div>

          <div className="navbar-right">
            {/* Google Translate Language Selector */}
            <div className="lang-selector" ref={langRef}>
              <button className="lang-btn" onClick={() => setShowLang(v => !v)} title="Change Language">
                <GlobeIcon />
                <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentLang.native}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {showLang && (
                <div className="lang-dropdown" style={{ minWidth: '210px' }}>
                  <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--green-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <GlobeIcon />
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Select Language
                      </span>
                    </div>
                  </div>
                  <div style={{
                    padding: '5px 14px',
                    background: 'var(--green-50)',
                    borderBottom: '1px solid var(--green-100)',
                    fontSize: '0.68rem', color: 'var(--green-700)', fontWeight: '700',
                    display: 'flex', alignItems: 'center', gap: '5px'
                  }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    Powered by Google Translate
                  </div>
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {Object.entries(languageNames).map(([code, info]) => (
                      <div
                        key={code}
                        className={`lang-option ${lang === code ? 'active' : ''}`}
                        onClick={() => { changeLang(code); setShowLang(false); }}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '800', fontSize: '0.92rem' }}>{info.native}</div>
                          <div style={{ fontSize: '0.71rem', color: 'var(--gray-400)', fontWeight: '600' }}>{info.name}</div>
                        </div>
                        {lang === code && (
                          <div style={{
                            background: 'var(--green-500)', color: 'white',
                            borderRadius: '50%', width: '20px', height: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            <CheckIcon />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="user-menu">
                <div className="user-avatar" title={user.name} onClick={() => navigate('/dashboard')}>
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <button className="btn btn-outline btn-sm" onClick={() => { logout(); navigate('/'); }}>
                  {t('logout')}
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">{t('login')}</Link>
                <Link to="/register" className="btn btn-primary btn-sm">{t('register')}</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
