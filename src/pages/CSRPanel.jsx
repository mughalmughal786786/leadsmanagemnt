import React, { useState, useEffect } from 'react';
import { leadAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CSRPanel.css';

const CSRPanel = () => {
  const { hasPermission } = useAuth();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'Other',
    status: 'New',
    notes: ''
  });

  // Load leads on mount
  useEffect(() => {
    if (hasPermission('view_leads')) {
      loadLeads();
      loadStats();
    }
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadAPI.getAllLeads();
      setLeads(response.data);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await leadAPI.getLeadStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await leadAPI.createLead(formData);
      setSuccess('Lead created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', email: '', phone: '', source: 'Other', status: 'New', notes: '' });
      loadLeads();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create lead');
    }
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await leadAPI.updateLead(editingLead._id, formData);
      setSuccess('Lead updated successfully!');
      setEditingLead(null);
      setFormData({ name: '', email: '', phone: '', source: 'Other', status: 'New', notes: '' });
      loadLeads();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update lead');
    }
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      source: lead.source,
      status: lead.status,
      notes: lead.notes || ''
    });
    setShowCreateForm(false);
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    setError('');
    setSuccess('');

    try {
      await leadAPI.deleteLead(leadId);
      setSuccess('Lead deleted successfully!');
      loadLeads();
      loadStats();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete lead');
    }
  };

  const cancelEdit = () => {
    setEditingLead(null);
    setShowCreateForm(false);
    setFormData({ name: '', email: '', phone: '', source: 'Other', status: 'New', notes: '' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'New': '#4a9eff',
      'Contacted': '#ffa500',
      'Qualified': '#9c27b0',
      'Converted': '#00c851',
      'Rejected': '#ff4444'
    };
    return colors[status] || '#4a9eff';
  };

  if (!hasPermission('view_leads')) {
    return (
      <div className="panel-container">
        <div className="panel-header">
          <h1>CSR Panel</h1>
          <p>Manage your leads and customer interactions</p>
        </div>
        <div className="panel-content">
          <div className="no-permission">
            <div className="no-permission-icon">🔒</div>
            <h2>No Permission</h2>
            <p>You don't have permission to view leads. Please contact your administrator.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="panel-container">
        <div className="loading">Loading leads...</div>
      </div>
    );
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1>Leads Management</h1>
        <p>Manage your leads and track customer interactions</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* Statistics Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.total}</h3>
              <p>Total Leads</p>
            </div>
          </div>
          {stats.byStatus.map(stat => (
            <div key={stat._id} className="stat-card">
              <div className="stat-icon" style={{ color: getStatusColor(stat._id) }}>●</div>
              <div className="stat-content">
                <h3>{stat.count}</h3>
                <p>{stat._id}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="panel-content">
        {hasPermission('create_leads') && (
          <div className="lead-actions">
            <button 
              className="btn-primary" 
              onClick={() => {
                setShowCreateForm(!showCreateForm);
                setEditingLead(null);
                setFormData({ name: '', email: '', phone: '', source: 'Other', status: 'New', notes: '' });
              }}
            >
              {showCreateForm ? 'Cancel' : '+ Create New Lead'}
            </button>
          </div>
        )}

        {(showCreateForm || editingLead) && (
          <div className="lead-form-card">
            <h3>{editingLead ? 'Edit Lead' : 'Create New Lead'}</h3>
            <form onSubmit={editingLead ? handleUpdateLead : handleCreateLead}>
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter lead name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select
                    name="source"
                    value={formData.source}
                    onChange={handleInputChange}
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Converted">Converted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingLead ? 'Update Lead' : 'Create Lead'}
                </button>
                <button type="button" className="btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="leads-list">
          <h3>All Leads ({leads.length})</h3>
          {leads.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <p>No leads found. Create your first lead to get started.</p>
            </div>
          ) : (
            <div className="leads-table-container">
              <table className="leads-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead._id}>
                      <td className="lead-name">{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.source}</td>
                      <td>
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: getStatusColor(lead.status) }}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                      <td className="actions-cell">
                        {hasPermission('edit_leads') && (
                          <button 
                            className="btn-icon" 
                            onClick={() => handleEditLead(lead)}
                            title="Edit Lead"
                          >
                            ✏️
                          </button>
                        )}
                        {hasPermission('delete_leads') && (
                          <button 
                            className="btn-icon" 
                            onClick={() => handleDeleteLead(lead._id)}
                            title="Delete Lead"
                          >
                            🗑️
                          </button>
                        )}
                      </td>
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

export default CSRPanel;
