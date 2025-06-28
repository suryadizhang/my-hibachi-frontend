import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE } from '../config/api';
import MissingFieldsModal from './MissingFieldsModal';
import './AdminLogin.css';

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const navigate = useNavigate();

  // Get missing fields for validation
  const getMissingFields = () => {
    const missing = [];
    if (!username.trim()) missing.push('Username');
    if (!password.trim()) missing.push('Password');
    return missing;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    
    // Check for missing fields
    const missingFields = getMissingFields();
    if (missingFields.length > 0) {
      setShowMissingFieldsModal(true);
      return;
    }
    
    setLoading(true);
    
    try {
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);
      
      const res = await axios.post(`${API_BASE}/api/booking/token`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      localStorage.setItem("adminToken", res.data.access_token);
      
      // Add success feedback before navigation
      setTimeout(() => {
        navigate("/admin");
      }, 500);
      
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.status === 401) {
        setErrorMsg("Invalid username or password. Please try again.");
      } else if (error.response?.status === 422) {
        setErrorMsg("Please enter valid credentials.");
      } else if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        setErrorMsg("Cannot connect to server. Please try again later.");
      } else {
        setErrorMsg("Login failed. Please check your connection and try again.");
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <span className="emoji-visible">🔐</span>
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">
            Secure access to booking management system
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-form-group">
            <label htmlFor="username" className="admin-form-label">
              <span className="label-icon emoji-visible">👤</span>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <span className="input-icon emoji-visible">👤</span>
              <input
                id="username"
                type="text"
                className="admin-form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label htmlFor="password" className="admin-form-label">
              <span className="label-icon emoji-visible">🔒</span>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <span className="input-icon emoji-visible">🔒</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="admin-form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a0aec0',
                  fontSize: '1.1rem',
                  zIndex: 2
                }}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <span className="emoji-visible">{showPassword ? '🙈' : '👁️'}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Signing In...
              </>
            ) : (
              <>
                <span className="emoji-visible">🚀</span>
                Sign In to Admin Panel
              </>
            )}
          </button>

          {errorMsg && (
            <div className="admin-error-alert" role="alert">
              <span className="emoji-visible">❌</span>
              {errorMsg}
            </div>
          )}

          {/* Missing Fields Warning */}
          {getMissingFields().length > 0 && !loading && !errorMsg && (
            <div style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "12px",
              fontSize: "0.9rem",
              color: "#856404",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem"
            }}>
              <span className="emoji-visible">⚠️</span>
              <span>Please fill in all required fields</span>
            </div>
          )}
        </form>

        <div className="admin-footer">
          <p className="admin-footer-text">
            <span className="emoji-visible">🔒</span> 
            Secure admin access only
          </p>
          <Link to="/" className="admin-back-link">
            <span className="emoji-visible">⬅️</span>
            Back to Main Site
          </Link>
        </div>
      </div>

      {/* Missing Fields Modal */}
      <MissingFieldsModal
        show={showMissingFieldsModal}
        onClose={() => setShowMissingFieldsModal(false)}
        missingFields={getMissingFields()}
        title="Complete Login Form"
        subtitle="Please fill in your username and password to access the admin panel."
      />
    </div>
  );
}

export default AdminLogin;