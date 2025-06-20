import React, { useRef, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";

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

  useEffect(() => {
    if (show && waitlistNameRef.current) {
      waitlistNameRef.current.focus();
    }
  }, [show]);

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
        <h4>Join Waitlist</h4>
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="waitlistName">Name</Form.Label>
            <Form.Control
              id="waitlistName"
              type="text"
              required
              ref={waitlistNameRef}
              value={waitlistData.name}
              onChange={e =>
                setWaitlistData({ ...waitlistData, name: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="waitlistPhone">Phone</Form.Label>
            <Form.Control
              id="waitlistPhone"
              type="tel"
              required
              pattern="[0-9]{10,15}"
              value={waitlistData.phone}
              onChange={e =>
                setWaitlistData({ ...waitlistData, phone: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="waitlistEmail">Email</Form.Label>
            <Form.Control
              id="waitlistEmail"
              type="email"
              required
              value={waitlistData.email}
              onChange={e =>
                setWaitlistData({ ...waitlistData, email: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label htmlFor="waitlistPreferredTime">Preferred Time</Form.Label>
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
            >
              <option value="">Select a time</option>
              {timeSlots.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Button
            type="submit"
            variant="success"
            style={{ minWidth: 120 }}
            disabled={
              !waitlistData.name ||
              !waitlistData.phone ||
              !waitlistData.email ||
              !waitlistData.preferredTime ||
              loading
            }
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </Button>
          <Button
            variant="secondary"
            className="ms-2"
            type="button"
            onClick={onClose}
            style={{ minWidth: 80 }}
          >
            Cancel
          </Button>
          {waitlistMessage && (
            <Alert variant={waitlistVariant} className="mt-3" aria-live="polite">
              {waitlistMessage}
            </Alert>
          )}
        </Form>
      </div>
    </div>
  );
};

export default WaitlistModal;