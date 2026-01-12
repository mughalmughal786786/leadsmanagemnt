import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { 
      path: '/admin', 
      label: 'Admin Panel', 
      icon: '👤',
      roles: ['admin']
    },
    { 
      path: '/csr', 
      label: 'CSR Panel', 
      icon: '📞',
      roles: ['admin', 'csr']
    },
  ];

  // Filter menu items based on user role
  const visibleMenuItems = menuItems.filter(item => {
    if (!user) return false;
    return item.roles.includes(user.role);
  });

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">ALI.</div>
        <div className="sidebar-title">Ali Technologies</div>
      </div>
      <div className="sidebar-menu">
        {visibleMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
