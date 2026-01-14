import React, { useEffect, useState } from "react";
import { dashboardAPI } from "../services/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import "./Reports.css";

const Reports = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const res = await dashboardAPI.getAdminDashboard();
    setStats(res.data?.data || {});
  };

  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <p className="sub">View system reports and analytics</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.overview?.totalCSRs || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.overview?.totalLeads || 0}</h3>
            <p>Total Leads</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📁</div>
          <div className="stat-content">
            <h3>{stats.overview?.totalProjects || 0}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.overview?.totalRevenue || 0}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart */}
      <div className="chart-section">
        <h2>Monthly Revenue Chart</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.monthlyRevenue?.map(item => ({ month: item._id, revenue: item.total })) || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CSR Performance */}
      <div className="chart-section">
        <h2>CSR Performance</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.csrPerformance || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
              <Legend />
              <Bar dataKey="totalRevenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Conversion Rate */}
      <div className="conversion-rate-section">
        <h2>Lead Conversion Rate</h2>
        <div className="conversion-display">
          <div className="conversion-circle">
            <span className="conversion-percentage">{stats.overview?.conversionRate || 0}%</span>
          </div>
          <p>Overall Conversion Rate</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
