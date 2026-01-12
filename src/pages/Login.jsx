import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/csr';
      navigate(redirectPath, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect based on user role
        const redirectPath = result.data.role === 'admin' ? '/admin' : '/csr';
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">ALI.</div>
        <h1 className="login-title">Ali Technologies</h1>
        <p className="login-subtitle">Sign in to your account</p>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
          
          <div className="forgot-password-link">
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
