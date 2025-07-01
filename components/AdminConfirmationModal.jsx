import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const AdminConfirmationModal = ({ 
  show, 
  onClose, 
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  actionType = "warning", // warning, danger, info
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  requiresReason = false,
  reasonPlaceholder = "Please provide a reason for this action...",
  bookingDetails = null,
  isLoading = false
}) => {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  if (!show) return null;

  const handleConfirm = () => {
    if (requiresReason) {
      if (!reason.trim()) {
        setReasonError("Reason is required for this action");
        return;
      }
      if (reason.trim().length < 5) {
        setReasonError("Please provide a more detailed reason (at least 5 characters)");
        return;
      }
    }
    
    onConfirm(reason.trim());
    setReason("");
    setReasonError("");
  };

  const handleClose = () => {
    setReason("");
    setReasonError("");
    onClose();
  };

  const getIconAndColor = () => {
    switch (actionType) {
      case "danger":
        return { icon: "🚨", color: "#dc3545", bgColor: "#f8d7da" };
      case "warning":
        return { icon: "⚠️", color: "#fd7e14", bgColor: "#fff3cd" };
      case "info":
        return { icon: "ℹ️", color: "#0dcaf0", bgColor: "#d1ecf1" };
      default:
        return { icon: "❓", color: "#6c757d", bgColor: "#f8f9fa" };
    }
  };

  const { icon, color, bgColor } = getIconAndColor();

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
        background: "rgba(0,0,0,0.6)",
        zIndex: 1050,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={handleClose}
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "15px",
          minWidth: "400px",
          maxWidth: "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          margin: "1rem",
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
          border: `3px solid ${color}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div 
            style={{ 
              fontSize: "4rem", 
              marginBottom: "1rem",
              padding: "1rem",
              background: bgColor,
              borderRadius: "50%",
              width: "80px",
              height: "80px",
              margin: "0 auto 1rem auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span className="emoji-visible">{icon}</span>
          </div>
          <h3 style={{ color: color, marginBottom: "0.5rem", fontWeight: "bold" }}>
            {title}
          </h3>
          <p style={{ color: "#6c757d", margin: "0", fontSize: "1.1rem" }}>
            {message}
          </p>
        </div>

        {/* Booking Details (if provided) */}
        {bookingDetails && (
          <div style={{ 
            marginBottom: "1.5rem",
            padding: "1rem",
            background: "#f8f9fa",
            borderRadius: "10px",
            border: "1px solid #dee2e6"
          }}>
            <h5 style={{ color: "#495057", marginBottom: "1rem", fontWeight: "600" }}>
              <span className="emoji-visible">📋</span> Booking Details
            </h5>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "auto 1fr", 
              gap: "0.5rem 1rem",
              fontSize: "0.95rem"
            }}>
              <strong>Name:</strong>
              <span>{bookingDetails.name}</span>
              <strong>Date:</strong>
              <span>{new Date(bookingDetails.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
              <strong>Time:</strong>
              <span>{bookingDetails.time_slot}</span>
              <strong>Phone:</strong>
              <span>{bookingDetails.phone}</span>
              <strong>Email:</strong>
              <span>{bookingDetails.email}</span>
            </div>
          </div>
        )}

        {/* Reason Input (if required) */}
        {requiresReason && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label 
              htmlFor="admin-reason"
              style={{ 
                display: "block",
                marginBottom: "0.5rem",
                color: "#495057",
                fontWeight: "600"
              }}
            >
              <span className="emoji-visible">📝</span> Reason for Action *
            </label>
            <textarea
              id="admin-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (reasonError) setReasonError("");
              }}
              placeholder={reasonPlaceholder}
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: reasonError ? "2px solid #dc3545" : "2px solid #dee2e6",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
                fontFamily: "inherit"
              }}
              disabled={isLoading}
            />
            {reasonError && (
              <div style={{ 
                color: "#dc3545", 
                fontSize: "0.875rem", 
                marginTop: "0.25rem",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                <span className="emoji-visible">❌</span>
                {reasonError}
              </div>
            )}
          </div>
        )}

        {/* Warning Messages */}
        {actionType === "danger" && (
          <div style={{
            background: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
            color: "#721c24"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span className="emoji-visible">⚠️</span>
              <strong>Warning: This action cannot be undone!</strong>
            </div>
            <p style={{ margin: "0", fontSize: "0.9rem" }}>
              This action is permanent and will affect the customer's booking. 
              Please ensure you have considered all alternatives before proceeding.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          gap: "1rem",
          flexWrap: "wrap"
        }}>
          <Button
            variant="outline-secondary"
            onClick={handleClose}
            disabled={isLoading}
            style={{
              borderRadius: "25px",
              padding: "0.75rem 2rem",
              fontWeight: "600",
              minWidth: "120px"
            }}
          >
            <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>❌</span>
            {cancelButtonText}
          </Button>
          
          <Button
            variant={actionType === "danger" ? "danger" : actionType === "warning" ? "warning" : "primary"}
            onClick={handleConfirm}
            disabled={isLoading}
            style={{
              borderRadius: "25px",
              padding: "0.75rem 2rem",
              fontWeight: "600",
              minWidth: "120px",
              boxShadow: `0 4px 15px ${
                actionType === "danger" ? "rgba(220,53,69,0.3)" : 
                actionType === "warning" ? "rgba(253,126,20,0.3)" : 
                "rgba(13,202,240,0.3)"
              }`
            }}
          >
            {isLoading ? (
              <>
                <span style={{ 
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid currentColor",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "0.5rem"
                }} />
                Processing...
              </>
            ) : (
              <>
                <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>
                  {actionType === "danger" ? "🗑️" : actionType === "warning" ? "⚠️" : "✅"}
                </span>
                {confirmButtonText}
              </>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#f8f9fa",
          borderRadius: "8px",
          fontSize: "0.85rem",
          color: "#6c757d",
          textAlign: "center"
        }}>
          <span className="emoji-visible">🔒</span>
          {" "}This action is logged for security and audit purposes.
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminConfirmationModal;
