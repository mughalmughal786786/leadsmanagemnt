import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">ALI.</span>
        <h2>Ali Technologies</h2>
      </div>
      <div className="navbar-actions">
        {user && (
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role">({user.role})</span>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
