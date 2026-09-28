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

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', class: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match!');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, parseInt(form.class));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <h1 className="auth-title">{t('register')}</h1>
        <p className="auth-subtitle">Create your free account and start learning!</p>

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
            <label className="form-label">{t('name')}</label>
            <input
              type="text" className="form-input"
              placeholder="Rahul Kumar"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('email')}</label>
            <input
              type="email" className="form-input"
              placeholder="rahul@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">{t('yourClass')}</label>
            <select
              className="form-select"
              value={form.class}
              onChange={e => setForm({ ...form, class: e.target.value })}
              required
            >
              <option value="">{t('selectClass')}</option>
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(c => (
                <option key={c} value={c}>{t('class')} {c}</option>
              ))}
            </select>
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
          <div className="form-group">
            <label className="form-label">{t('confirmPassword')}</label>
            <input
              type="password" className="form-input"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                Creating account...
              </span>
            ) : t('registerBtn')}
          </button>
        </form>

        <p className="auth-footer">
          {t('alreadyAccount')} <Link to="/login" className="auth-link">{t('loginHere')}</Link>
        </p>
      </div>
    </div>
  );
}
