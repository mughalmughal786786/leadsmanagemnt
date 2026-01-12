import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './ResetPassword.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      // Auto login after successful password reset
      if (response.data.token) {
        login(response.data.user, response.data.token);
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/csr');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <div className="logo">ALI.</div>
          <h1>Reset Password</h1>
          <p>Enter your new password below.</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            <small>Minimum 6 characters</small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Resetting...
              </>
            ) : (
              'Reset Password'
            )}
          </button>

          <div className="reset-password-footer">
            <Link to="/login" className="back-link">
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
