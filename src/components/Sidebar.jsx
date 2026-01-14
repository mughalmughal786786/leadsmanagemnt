import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const mainMenu = [
    {
      label: "Dashboard",
      path: "/",
      icon: "📊",
      roles: ["admin", "csr"],
    },
    {
      label: "Leads",
      path: "/csr",
      icon: "📋",
      roles: ["admin", "csr"],
    },
    {
      label: "Projects",
      path: "/projects",
      icon: "📁",
      roles: ["admin", "csr"],
    },
    {
      label: "Invoices",
      path: "/invoices",
      icon: "💰",
      roles: ["admin", "csr"],
    },
    {
      label: "Payments",
      path: "/payments",
      icon: "💳",
      roles: ["admin", "csr"],
    },
    {
      label: "Reports",
      path: "/reports",
      icon: "📈",
      roles: ["admin", "csr"],
    },
  ];

  const bottomMenu = [
    {
      label: "Users",
      path: "/admin",
      icon: "👥",
      roles: ["admin"],
    },
    {
      label: "Settings",
      path: "/settings",
      icon: "⚙️",
      roles: ["admin", "csr"],
    },
  ];

  return (
    <aside className="sidebar">
      {/* LOGO */}
      <div className="sidebar-header">
        <div className="sidebar-logo">ALI.</div>
        <div className="sidebar-title">Ali Technologies</div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        {/* Main Menu */}
        {mainMenu
          .filter((item) => item.roles.includes(user.role))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}

        {/* Separator */}
        <div className="sidebar-separator"></div>

        {/* Bottom Menu */}
        {bottomMenu
          .filter((item) => item.roles.includes(user.role))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </NavLink>
          ))}

        {/* Logout */}
        <button
          className="sidebar-item logout-btn"
          onClick={logout}
        >
          <span className="sidebar-icon">🚪</span>
          <span className="sidebar-label">Logout</span>
        </button>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <small>© {new Date().getFullYear()} Ali Technologies</small>
      </div>
    </aside>
  );
};

export default Sidebar;
