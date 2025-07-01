import React from 'react';
import { Button } from 'react-bootstrap';

const MissingFieldsModal = ({ 
  show, 
  onClose, 
  missingFields = [], 
  title = "Missing Required Fields",
  subtitle = "Please complete all required fields to proceed."
}) => {
  if (!show) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "15px",
          minWidth: "320px",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          margin: "1rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            <span className="emoji-visible">⚠️</span>
          </div>
          <h3 style={{ color: "#dc3545", marginBottom: "0.5rem" }}>
            {title}
          </h3>
          <p style={{ color: "#6c757d", margin: "0" }}>
            {subtitle}
          </p>
        </div>
        
        <div style={{ marginBottom: "1.5rem" }}>
          <h5 style={{ color: "#495057", marginBottom: "1rem" }}>
            Please complete:
          </h5>
          <ul style={{ 
            listStyle: "none", 
            padding: "1rem",
            margin: "0",
            background: "#f8f9fa",
            borderRadius: "8px"
          }}>
            {missingFields.map((field, index) => (
              <li key={index} style={{ 
                padding: "0.5rem 0", 
                borderBottom: index < missingFields.length - 1 ? "1px solid #dee2e6" : "none",
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{ color: "#dc3545", marginRight: "0.5rem" }}>•</span>
                <span style={{ color: "#495057" }}>{field}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button
            variant="primary"
            onClick={onClose}
            style={{
              background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
              border: "none",
              borderRadius: "25px",
              padding: "0.75rem 2rem",
              fontWeight: "600",
              boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
            }}
          >
            <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>✏️</span>
            Continue Filling Form
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissingFieldsModal;
