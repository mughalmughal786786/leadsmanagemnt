import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-shell">
      {/* Top Navbar */}
      <Navbar />

      {/* Body */}
      <div className="app-body">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="app-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
