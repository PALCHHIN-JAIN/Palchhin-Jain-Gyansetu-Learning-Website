import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

const LogoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
    <rect width="24" height="24" rx="8" fill="#16a34a"/>
    <path d="M12 4L4 8l8 4 8-4-8-4z" fill="white"/>
    <path d="M4 16l8 4 8-4" stroke="white" strokeWidth="1.5" fill="none"/>
    <path d="M4 12l8 4 8-4" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card animate-in">
        <div className="auth-logo">
          <LogoIcon />
          <div style={{ marginTop: '8px', fontFamily: "'Baloo 2', cursive", fontSize: '1.1rem', fontWeight: '800', color: 'var(--green-700)' }}>
            GyaanSetu
          </div>
        </div>
        <h1 className="auth-title">{t('login')}</h1>
        <p className="auth-subtitle">Welcome back! Continue your learning journey</p>

        {error && (
          <div className="error-msg">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input
              type="email" className="form-input"
              placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('password')}</label>
            <input
              type="password" className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          {/* Demo credentials hint */}
          <div style={{
            background: 'var(--green-50)', border: '1px solid var(--green-200)',
            borderRadius: '10px', padding: '10px 14px', marginBottom: '1rem',
            fontSize: '0.82rem', color: 'var(--gray-600)'
          }}>
            <strong style={{ color: 'var(--green-700)' }}>Demo:</strong> demo@gyaansetu.com / demo123
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                Logging in...
              </span>
            ) : t('loginBtn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('noAccount')} <Link to="/register" className="auth-link">{t('registerHere')}</Link>
        </p>
      </div>
    </div>
  );
}
