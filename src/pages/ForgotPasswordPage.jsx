import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError('Please enter your email'); return; }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError('Failed to send reset email. Please check your email address.');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <span className="auth-left-emoji">🔑</span>
          <h1>Reset Password</h1>
          <p>No worries! We'll send you a link to reset your password.</p>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Forgot Password</h2>
            <p>Enter your email to receive a reset link</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          {success ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📧</div>
              <h3 style={{ marginBottom: '8px' }}>Check Your Email</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link to="/login" className="btn btn-primary">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="auth-link">
            Remember your password? <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
