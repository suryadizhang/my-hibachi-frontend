import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE } from '../lib/config/api';
import './SuperAdminManager.css';

function SuperAdminManager() {
  const [admins, setAdmins] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(null);

  // Form states
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    fullName: '',
    email: ''
  });

  const [passwordReset, setPasswordReset] = useState({
    username: '',
    newPassword: ''
  });

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchAdmins();
    fetchActivityLogs();
  }, [fetchAdmins, fetchActivityLogs]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/booking/superadmin/admins`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAdmins(res.data.admins);
    } catch (err) {
      setError('Failed to fetch admin list: ' + err.response?.data?.detail);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/booking/superadmin/activity_logs?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivityLogs(res.data.logs);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
    }
  }, [token]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdmin.username || !newAdmin.password) {
      setError('Username and password are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', newAdmin.username);
      formData.append('password', newAdmin.password);

      await axios.post(`${API_BASE}/api/booking/superadmin/create_admin`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowCreateForm(false);
      setNewAdmin({ username: '', password: '', fullName: '', email: '' });
      setError('');
      fetchAdmins();
      fetchActivityLogs();
    } catch (err) {
      setError('Failed to create admin: ' + err.response?.data?.detail);
    }
  };

  const handleDeleteAdmin = async (username) => {
    if (!confirm(`Are you sure you want to delete admin "${username}"?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE}/api/booking/superadmin/admin/${username}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAdmins();
      fetchActivityLogs();
    } catch (err) {
      setError('Failed to delete admin: ' + err.response?.data?.detail);
    }
  };

  const handleResetPassword = async (username, useDefault = true) => {
    try {
      const formData = new FormData();
      if (!useDefault && passwordReset.newPassword) {
        formData.append('new_password', passwordReset.newPassword);
      }

      const res = await axios.post(
        `${API_BASE}/api/booking/superadmin/admin/${username}/reset_password`, 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Password reset successful. New password: ${res.data.new_password}`);
      setShowPasswordReset(null);
      setPasswordReset({ username: '', newPassword: '' });
      fetchActivityLogs();
    } catch (err) {
      setError('Failed to reset password: ' + err.response?.data?.detail);
    }
  };

  const handleToggleActive = async (username, isActive) => {
    try {
      const formData = new FormData();
      formData.append('is_active', !isActive);

      await axios.put(`${API_BASE}/api/booking/superadmin/admin/${username}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchAdmins();
      fetchActivityLogs();
    } catch (err) {
      setError('Failed to update admin status: ' + err.response?.data?.detail);
    }
  };

  const setupDefaultAccounts = async () => {
    if (!confirm('This will create the default admin accounts (karen, yohan) with default passwords. Continue?')) {
      return;
    }

    const defaultAccounts = [
      { username: 'karen', password: 'CHANGE_ME_IN_PRODUCTION' },
      { username: 'yohan', password: 'CHANGE_ME_IN_PRODUCTION' }
    ];

    try {
      for (const account of defaultAccounts) {
        try {
          const formData = new FormData();
          formData.append('username', account.username);
          formData.append('password', account.password);

          await axios.post(`${API_BASE}/api/booking/superadmin/create_admin`, formData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (err) {
          console.log(`Account ${account.username} might already exist:`, err.response?.data?.detail);
        }
      }
      
      alert('Default accounts setup completed!');
      fetchAdmins();
      fetchActivityLogs();
    } catch (err) {
      setError('Failed to setup default accounts: ' + err.message);
    }
  };

  return (
    <div className="super-admin-manager">
      <div className="super-admin-header">
        <h2>Super Admin Management</h2>
        <div className="super-admin-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Admin'}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={setupDefaultAccounts}
          >
            Setup Default Accounts
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Create Admin Form */}
      {showCreateForm && (
        <div className="create-admin-form">
          <h3>Create New Admin</h3>
          <form onSubmit={handleCreateAdmin}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({...newAdmin, username: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Admin</button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Admin List */}
      <div className="admin-list">
        <h3>Current Admins</h3>
        {loading ? (
          <div className="loading">Loading admins...</div>
        ) : (
          <div className="admin-grid">
            {admins.map((admin) => (
              <div key={admin.id} className={`admin-card ${!admin.is_active ? 'inactive' : ''}`}>
                <div className="admin-info">
                  <h4>{admin.username}</h4>
                  <p><strong>Full Name:</strong> {admin.full_name || 'Not set'}</p>
                  <p><strong>Email:</strong> {admin.email || 'Not set'}</p>
                  <p><strong>Created:</strong> {new Date(admin.created_at).toLocaleDateString()}</p>
                  <p><strong>Last Login:</strong> {admin.last_login ? new Date(admin.last_login).toLocaleDateString() : 'Never'}</p>
                  <p><strong>Status:</strong> 
                    <span className={`status ${admin.is_active ? 'active' : 'inactive'}`}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  {admin.password_reset_required && (
                    <p className="password-reset-required">⚠️ Password reset required</p>
                  )}
                </div>
                
                <div className="admin-actions">
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => setShowPasswordReset(admin.username)}
                  >
                    Reset Password
                  </button>
                  <button
                    className={`btn btn-sm ${admin.is_active ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => handleToggleActive(admin.username, admin.is_active)}
                  >
                    {admin.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteAdmin(admin.username)}
                  >
                    Delete
                  </button>
                </div>

                {/* Password Reset Form */}
                {showPasswordReset === admin.username && (
                  <div className="password-reset-form">
                    <h5>Reset Password for {admin.username}</h5>
                    <div className="form-group">
                      <label>New Password (leave empty for default):</label>
                      <input
                        type="password"
                        value={passwordReset.newPassword}
                        onChange={(e) => setPasswordReset({...passwordReset, newPassword: e.target.value})}
                        placeholder="Leave empty to use default password"
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleResetPassword(admin.username, !passwordReset.newPassword)}
                      >
                        Reset Password
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setShowPasswordReset(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Logs */}
      <div className="activity-logs">
        <h3>Recent Admin Activity</h3>
        <div className="logs-container">
          {activityLogs.length === 0 ? (
            <p>No activity logs found.</p>
          ) : (
            activityLogs.map((log, index) => (
              <div key={index} className="log-entry">
                <div className="log-time">
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div className="log-details">
                  <strong>{log.actor_username || 'System'}</strong> 
                  <span className="log-action">{log.action}</span>
                  {log.target_user && <span className="log-target">→ {log.target_user}</span>}
                  <div className="log-description">{log.details}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SuperAdminManager;
