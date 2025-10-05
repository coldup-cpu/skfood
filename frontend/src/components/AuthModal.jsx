import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        setError('Please enter your name');
        return;
      }

      if (!validatePassword(formData.password)) {
        setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData.email, formData.password);
      } else {
        result = await signup(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        setFormData({ name: '', email: '', password: '' });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <button className="auth-modal-close" onClick={onClose} aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="auth-modal-content">
          <div className="auth-modal-header">
            <div className="auth-modal-icon">🍛</div>
            <h2 className="auth-modal-title">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </h2>
            <p className="auth-modal-subtitle">
              {isLogin
                ? 'Sign in to continue with your order'
                : 'Join us to enjoy delicious meals'}
            </p>
          </div>

          <form className="auth-modal-form" onSubmit={handleSubmit}>
            {error && (
              <div className="auth-form-error">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="auth-form-group">
                <label className="auth-form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="auth-form-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            )}

            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="auth-form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="password">
                Password
              </label>
              <div className="auth-password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  className="auth-form-input"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="auth-password-requirements">
                  Must be 8+ characters with uppercase, lowercase, number & special character
                </p>
              )}
            </div>

            <button
              type="submit"
              className="auth-form-submit"
              disabled={loading}
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-modal-toggle">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span className="auth-modal-toggle-link" onClick={toggleMode}>
              {isLogin ? 'Sign Up' : 'Sign In'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
