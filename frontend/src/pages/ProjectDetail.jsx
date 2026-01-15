import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, paymentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  const [project, setProject] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasPermission('view_sales')) {
      loadProject();
      loadInvoices();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      const response = await projectAPI.getProject(id);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
    }
  };

  const loadInvoices = async () => {
    try {
      const response = await paymentAPI.getPaymentsByProject(id);
      setInvoices(response.data);
    } catch (err) {
      console.error('Failed to load invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffa500',
      'In Progress': '#4a9eff',
      'Completed': '#00c851',
      'Cancelled': '#ff4444'
    };
    return colors[status] || '#4a9eff';
  };

  if (!hasPermission('view_sales')) {
    return (
      <div className="project-detail-container">
        <div className="no-permission">
          <div className="no-permission-icon">🔒</div>
          <h2>No Permission</h2>
          <p>You don't have permission to view project details. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="project-detail-container">
        <div className="loading">Loading project details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="project-detail-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="project-detail-container">
      <div className="project-detail-header">
        <button className="back-btn" onClick={() => navigate('/projects')}>
          ← Back to Projects
        </button>
        <h1>{project.name}</h1>
        <span
          className="status-badge"
          style={{ backgroundColor: getStatusColor(project.status) }}
        >
          {project.status}
        </span>
      </div>

      <div className="project-overview">
        <div className="overview-card">
          <h3>Project Overview</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <label>Client</label>
              <p>{project.client}</p>
            </div>
            <div className="overview-item">
              <label>Budget</label>
              <p>${project.budget.toLocaleString()}</p>
            </div>
            <div className="overview-item">
              <label>Start Date</label>
              <p>{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div className="overview-item">
              <label>End Date</label>
              <p>{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</p>
            </div>
            <div className="overview-item">
              <label>Created By</label>
              <p>{project.createdBy.name}</p>
            </div>
            <div className="overview-item">
              <label>Created At</label>
              <p>{new Date(project.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="project-timeline">
        <div className="timeline-card">
          <h3>Project Timeline</h3>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Project Created</h4>
                <p>{new Date(project.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h4>Project Started</h4>
                <p>{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            {project.endDate && (
              <div className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Project Completed</h4>
                  <p>{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="related-invoices">
        <div className="invoices-card">
          <h3>Related Invoices ({invoices.length})</h3>
          {invoices.length === 0 ? (
            <div className="empty-state">
              <p>No invoices found for this project.</p>
            </div>
          ) : (
            <div className="invoices-table-container">
              <table className="invoices-table">
                <thead>
                  <tr>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Date</th>
                    <th>Method</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(invoice => (
                    <tr key={invoice._id}>
                      <td>${invoice.amount.toLocaleString()}</td>
                      <td>
                        <span
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(invoice.status) }}
                        >
                          {invoice.status}
                        </span>
                      </td>
                      <td>{new Date(invoice.paymentDate).toLocaleDateString()}</td>
                      <td>{invoice.paymentMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
