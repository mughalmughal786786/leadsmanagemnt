import React, { useEffect, useState } from "react";
import { paymentAPI } from "../services/api";
import "./Payments.css";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, totalRevenue: 0 });

  useEffect(() => {
    loadPayments();
    loadStats();
  }, []);

  const loadPayments = async () => {
    const res = await paymentAPI.getAllPayments();
    setPayments(res.data || []);
  };

  const loadStats = async () => {
    try {
      const res = await paymentAPI.getPaymentStats();
      setStats(res.data || { total: 0, thisMonth: 0, totalRevenue: 0 });
    } catch (error) {
      console.error('Failed to load stats:', error);
      setStats({ total: 0, thisMonth: 0, totalRevenue: 0 });
    }
  };

  return (
    <div className="payments-page">
      <h1>Payments</h1>
      <p className="sub">View payment records</p>

      {/* Top Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">💰</div>
          <div>
            <h2>{stats.total}</h2>
            <p>Total Payments</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">📅</div>
          <div>
            <h2>{stats.thisMonth}</h2>
            <p>This Month Payments</p>
          </div>
        </div>
      </div>

      <div className="payments-table">
        <h3>All Payments</h3>
        {payments.length === 0 ? (
          <p>No payments yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.project?.name || 'N/A'}</td>
                  <td>${p.totalAmount}</td>
                  <td>{p.paymentMethod}</td>
                  <td>{new Date(p.createdAt).toDateString()}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Payments;
