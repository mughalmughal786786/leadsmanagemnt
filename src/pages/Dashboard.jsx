import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dashboardAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import "./Dashboard.css";

const DEFAULT_DATA = {
  overview: {
    totalLeads: 0,
    totalProjects: 0,
    totalRevenue: 0,
    totalCSRs: 0,
  },
  leadsByStatus: [],
  projectsByStatus: [],
  recentLeads: [],
  recentProjects: [],
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role) loadDashboard();
    // eslint-disable-next-line
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const res =
        user.role === "admin"
          ? await dashboardAPI.getAdminDashboard()
          : await dashboardAPI.getCSRDashboard();

      const dashboardData = res?.data || {};

      setData({
        overview: dashboardData?.overview || DEFAULT_DATA.overview,
        leadsByStatus: Array.isArray(dashboardData?.leadsByStatus)
          ? dashboardData.leadsByStatus
          : [],
        projectsByStatus: Array.isArray(dashboardData?.projectsByStatus)
          ? dashboardData.projectsByStatus
          : [],
        recentLeads: Array.isArray(dashboardData?.recentActivity?.leads)
          ? dashboardData.recentActivity.leads
          : [],
        recentProjects: Array.isArray(dashboardData?.recentActivity?.projects)
          ? dashboardData.recentActivity.projects
          : [],
        recentInvoices: Array.isArray(dashboardData?.recentActivity?.invoices)
          ? dashboardData.recentActivity.invoices
          : [],
        dailyStats: dashboardData?.dailyStats || { leads: [], revenue: [] },
      });
    } catch (err) {
      console.error("Dashboard error:", err);
      setData(DEFAULT_DATA);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard…</div>;
  }

  const { overview, leadsByStatus, projectsByStatus, recentLeads, recentProjects, recentInvoices, dailyStats } =
    data;

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-top">
        <div>
          <h1>Dashboard</h1>
          <p className="subtitle">Welcome back, {user?.name}</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card clickable" onClick={() => navigate("/csr")}>
          <div className="kpi-icon">📋</div>
          <div>
            <h2>{overview.totalLeads}</h2>
            <p>Total Leads</p>
          </div>
        </div>

        <div className="kpi-card clickable" onClick={() => navigate("/projects")}>
          <div className="kpi-icon">📁</div>
          <div>
            <h2>{overview.totalProjects}</h2>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="kpi-card clickable" onClick={() => navigate("/invoices")}>
          <div className="kpi-icon">📄</div>
          <div>
            <h2>{overview.totalInvoices}</h2>
            <p>Total Invoices</p>
          </div>
        </div>

        <div className="kpi-card clickable" onClick={() => navigate("/payments")}>
          <div className="kpi-icon">💰</div>
          <div>
            <h2>${overview.totalRevenue}</h2>
            <p>Total Revenue</p>
          </div>
        </div>

        {user.role === "admin" && (
          <div className="kpi-card">
            <div className="kpi-icon">👥</div>
            <div>
              <h2>{overview.totalCSRs}</h2>
              <p>Total CSRs</p>
            </div>
          </div>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="dashboard-grid">
        {/* LEADS STATUS */}
        <div className="dashboard-panel">
          <h3>Leads by Status</h3>
          {leadsByStatus.length === 0 ? (
            <p className="empty">No data</p>
          ) : (
            <BarChart width={350} height={250} data={leadsByStatus.map(s => ({ name: s._id, value: s.count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          )}
        </div>

        {/* PROJECT STATUS */}
        <div className="dashboard-panel">
          <h3>Projects by Status</h3>
          {projectsByStatus.length === 0 ? (
            <p className="empty">No data</p>
          ) : (
            <BarChart width={350} height={250} data={projectsByStatus.map(s => ({ name: s._id, value: s.count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8b5cf6" />
            </BarChart>
          )}
        </div>

        {/* REVENUE BY MONTH */}
        <div className="dashboard-panel">
          <h3>Revenue by Month</h3>
          {dailyStats.revenue.length === 0 ? (
            <p className="empty">No data</p>
          ) : (
            <LineChart width={350} height={250} data={dailyStats.revenue.map(r => ({ date: r._id, revenue: r.total }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2} />
            </LineChart>
          )}
        </div>

        {/* RECENT ACTIVITY */}
        <div className="dashboard-panel">
          <h3>Recent Activity</h3>

          {recentLeads.length === 0 && recentProjects.length === 0 && recentInvoices.length === 0 && (
            <p className="empty">No recent activity</p>
          )}

          {recentLeads.slice(0, 5).map((l) => (
            <div key={l._id} className="activity-item">
              <span>📋</span>
              <div>
                <p>New lead: {l.name}</p>
                <small>{new Date(l.createdAt).toDateString()}</small>
              </div>
            </div>
          ))}

          {recentProjects.slice(0, 5).map((p) => (
            <div key={p._id} className="activity-item">
              <span>📁</span>
              <div>
                <p>New project: {p.title}</p>
                <small>{new Date(p.createdAt).toDateString()}</small>
              </div>
            </div>
          ))}

          {recentInvoices.slice(0, 5).map((i) => (
            <div key={i._id} className="activity-item">
              <span>📄</span>
              <div>
                <p>New invoice: {i.invoiceNumber}</p>
                <small>{new Date(i.createdAt).toDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
