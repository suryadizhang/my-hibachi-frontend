import React, { useRef, useEffect, useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import MissingFieldsModal from "./MissingFieldsModal";

const WaitlistModal = ({
  show,
  onClose,
  onSubmit,
  waitlistData,
  setWaitlistData,
  loading,
  waitlistMessage,
  waitlistVariant,
  timeSlots,
}) => {
  const waitlistNameRef = useRef(null);
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);

  useEffect(() => {
    if (show && waitlistNameRef.current) {
      waitlistNameRef.current.focus();
    }
  }, [show]);

  // Validation functions
  const isPhoneValid = (phone) => /^[0-9]{10,15}$/.test(phone);
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Get missing fields for validation
  const getMissingFields = () => {
    const missing = [];
    if (!waitlistData.name?.trim()) missing.push('Full Name');
    if (!waitlistData.phone?.trim()) missing.push('Phone Number');
    else if (!isPhoneValid(waitlistData.phone)) missing.push('Valid Phone Number (10-15 digits)');
    if (!waitlistData.email?.trim()) missing.push('Email Address');
    else if (!isEmailValid(waitlistData.email)) missing.push('Valid Email Address');
    if (!waitlistData.preferredTime) missing.push('Preferred Time Slot');
    return missing;
  };

  // Handle submit with validation
  const handleSubmitClick = (e) => {
    e.preventDefault();
    const missingFields = getMissingFields();
    
    if (missingFields.length > 0) {
      setShowMissingFieldsModal(true);
    } else {
      onSubmit(e);
    }
  };

  // Check if form is disabled
  const isFormDisabled = () => {
    return loading || getMissingFields().length > 0;
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (show || showMissingFieldsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [show, showMissingFieldsModal]);

  // Keyboard ESC support for modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (showMissingFieldsModal) {
          setShowMissingFieldsModal(false);
        } else if (show) {
          onClose();
        }
      }
    };
    if (show || showMissingFieldsModal) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [show, showMissingFieldsModal, onClose]);

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
    >
      <div
        className="modal-content"
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          minWidth: 300,
          maxWidth: 400,
        }}
      >
        <h4 style={{ marginBottom: "1.5rem", color: "#2d3748", textAlign: "center" }}>
          <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>📝</span>
          Join Waitlist
        </h4>
        
        {waitlistMessage && (
          <Alert variant={waitlistVariant} className="mb-3">
            <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>
              {waitlistVariant === 'success' ? '✅' : '⚠️'}
            </span>
            {waitlistMessage}
          </Alert>
        )}

        <Form onSubmit={handleSubmitClick}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="waitlistName" style={{ fontWeight: "600", color: "#4a5568" }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>👤</span>
              Full Name
            </Form.Label>
            <Form.Control
              id="waitlistName"
              type="text"
              required
              ref={waitlistNameRef}
              value={waitlistData.name}
              onChange={e =>
                setWaitlistData({ ...waitlistData, name: e.target.value })
              }
              style={{
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                padding: "0.75rem",
                transition: "all 0.3s ease"
              }}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor="waitlistPhone" style={{ fontWeight: "600", color: "#4a5568" }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>📞</span>
              Phone Number
            </Form.Label>
            <Form.Control
              id="waitlistPhone"
              type="tel"
              required
              pattern="[0-9]{10,15}"
              value={waitlistData.phone}
              onChange={e =>
                setWaitlistData({ ...waitlistData, phone: e.target.value })
              }
              style={{
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                padding: "0.75rem",
                transition: "all 0.3s ease"
              }}
              placeholder="Enter your phone number"
              disabled={loading}
              isInvalid={waitlistData.phone && !isPhoneValid(waitlistData.phone)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid phone number (10-15 digits).
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor="waitlistEmail" style={{ fontWeight: "600", color: "#4a5568" }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>✉️</span>
              Email Address
            </Form.Label>
            <Form.Control
              id="waitlistEmail"
              type="email"
              required
              value={waitlistData.email}
              onChange={e =>
                setWaitlistData({ ...waitlistData, email: e.target.value })
              }
              style={{
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                padding: "0.75rem",
                transition: "all 0.3s ease"
              }}
              placeholder="Enter your email address"
              disabled={loading}
              isInvalid={waitlistData.email && !isEmailValid(waitlistData.email)}
            />
            <Form.Control.Feedback type="invalid">
              Please enter a valid email address.
            </Form.Control.Feedback>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label htmlFor="waitlistPreferredTime" style={{ fontWeight: "600", color: "#4a5568" }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>⏰</span>
              Preferred Time Slot
            </Form.Label>
            <Form.Select
              id="waitlistPreferredTime"
              required
              value={waitlistData.preferredTime}
              onChange={e =>
                setWaitlistData({
                  ...waitlistData,
                  preferredTime: e.target.value,
                })
              }
              style={{
                borderRadius: "8px",
                border: "2px solid #e2e8f0",
                padding: "0.75rem",
                transition: "all 0.3s ease"
              }}
              disabled={loading}
            >
              <option value="">Select a time slot</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "1.5rem" }}>
            <Button
              type="submit"
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                border: "none",
                borderRadius: "25px",
                padding: "0.75rem 1.5rem",
                fontWeight: "600",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                minWidth: "140px",
                justifyContent: "center"
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite"
                  }}></div>
                  Joining...
                </>
              ) : (
                <>
                  <span className="emoji-visible">📝</span>
                  Join Waitlist
                </>
              )}
            </Button>
            
            <Button
              type="button"
              onClick={onClose}
              style={{
                background: "#6c757d",
                border: "none",
                borderRadius: "25px",
                padding: "0.75rem 1.5rem",
                fontWeight: "600",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                minWidth: "100px",
                justifyContent: "center"
              }}
              disabled={loading}
            >
              <span className="emoji-visible">❌</span>
              Cancel
            </Button>
          </div>

          {/* Missing Fields Warning */}
          {getMissingFields().length > 0 && !loading && (
            <div style={{
              marginTop: "1rem",
              padding: "0.75rem",
              background: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "#856404"
            }}>
              <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>⚠️</span>
              <strong>Please complete:</strong> {getMissingFields().join(", ")}
            </div>
          )}
        </Form>
      </div>

      {/* Missing Fields Modal */}
      <MissingFieldsModal
        show={showMissingFieldsModal}
        onClose={() => setShowMissingFieldsModal(false)}
        missingFields={getMissingFields()}
        title="Complete Waitlist Form"
        subtitle="Please fill in all required fields to join the waitlist."
      />
    </div>
  );
};

export default WaitlistModal;