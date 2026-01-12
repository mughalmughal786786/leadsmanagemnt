import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [csrs, setCSRs] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCSR, setEditingCSR] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: []
  });

  // Load CSRs and permissions on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [csrResponse, permResponse] = await Promise.all([
        adminAPI.getAllCSRs(),
        adminAPI.getPermissions()
      ]);
      setCSRs(csrResponse.data);
      setPermissions(permResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePermissionToggle = (permissionValue) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionValue)
        ? prev.permissions.filter(p => p !== permissionValue)
        : [...prev.permissions, permissionValue]
    }));
  };

  const handleCreateCSR = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await adminAPI.createCSR(formData);
      setSuccess('CSR created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', email: '', password: '', permissions: [] });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create CSR');
    }
  };

  const handleUpdatePermissions = async (csrId, currentPermissions) => {
    setError('');
    setSuccess('');

    try {
      await adminAPI.updateCSRPermissions(csrId, formData.permissions);
      setSuccess('Permissions updated successfully!');
      setEditingCSR(null);
      setFormData({ name: '', email: '', password: '', permissions: [] });
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update permissions');
    }
  };

  const handleEditCSR = (csr) => {
    setEditingCSR(csr._id);
    setFormData({
      name: csr.name,
      email: csr.email,
      password: '',
      permissions: csr.permissions || []
    });
    setShowCreateForm(false);
  };

  const handleDeleteCSR = async (csrId) => {
    if (!window.confirm('Are you sure you want to delete this CSR?')) return;

    setError('');
    setSuccess('');

    try {
      await adminAPI.deleteCSR(csrId);
      setSuccess('CSR deleted successfully!');
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete CSR');
    }
  };

  const cancelEdit = () => {
    setEditingCSR(null);
    setShowCreateForm(false);
    setFormData({ name: '', email: '', password: '', permissions: [] });
  };

  if (loading) {
    return (
      <div className="panel-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h1>Admin Panel</h1>
        <p>Manage CSR users and their permissions</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="panel-content">
        <div className="admin-actions">
          <button 
            className="btn-primary" 
            onClick={() => {
              setShowCreateForm(!showCreateForm);
              setEditingCSR(null);
              setFormData({ name: '', email: '', password: '', permissions: [] });
            }}
          >
            {showCreateForm ? 'Cancel' : '+ Create New CSR'}
          </button>
        </div>

        {showCreateForm && (
          <div className="csr-form-card">
            <h3>Create New CSR User</h3>
            <form onSubmit={handleCreateCSR}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Permissions</label>
                <div className="permissions-grid">
                  {permissions.map(perm => (
                    <label key={perm.value} className="permission-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(perm.value)}
                        onChange={() => handlePermissionToggle(perm.value)}
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary">Create CSR</button>
                <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="csr-list">
          <h3>CSR Users ({csrs.length})</h3>
          {csrs.length === 0 ? (
            <div className="empty-state">
              <p>No CSR users found. Create one to get started.</p>
            </div>
          ) : (
            <div className="csr-grid">
              {csrs.map(csr => (
                <div key={csr._id} className="csr-card">
                  <div className="csr-header">
                    <div>
                      <h4>{csr.name}</h4>
                      <p className="csr-email">{csr.email}</p>
                    </div>
                    <div className="csr-actions">
                      <button 
                        className="btn-edit" 
                        onClick={() => handleEditCSR(csr)}
                        title="Edit Permissions"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn-delete" 
                        onClick={() => handleDeleteCSR(csr._id)}
                        title="Delete CSR"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {editingCSR === csr._id ? (
                    <div className="edit-permissions">
                      <h5>Edit Permissions</h5>
                      <div className="permissions-grid">
                        {permissions.map(perm => (
                          <label key={perm.value} className="permission-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.permissions.includes(perm.value)}
                              onChange={() => handlePermissionToggle(perm.value)}
                            />
                            <span>{perm.label}</span>
                          </label>
                        ))}
                      </div>
                      <div className="form-actions">
                        <button 
                          className="btn-primary" 
                          onClick={() => handleUpdatePermissions(csr._id, csr.permissions)}
                        >
                          Save
                        </button>
                        <button className="btn-secondary" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="csr-permissions">
                      <h5>Permissions:</h5>
                      {csr.permissions && csr.permissions.length > 0 ? (
                        <div className="permission-tags">
                          {csr.permissions.map(perm => (
                            <span key={perm} className="permission-tag">
                              {permissions.find(p => p.value === perm)?.label || perm}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="no-permissions">No permissions assigned</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
