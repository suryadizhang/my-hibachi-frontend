import React from "react";
import { Button } from "react-bootstrap";

const BookingModal = ({
  show,
  onClose,
  onConfirm,
  selectedDate,
  formData,
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
        <button
          aria-label="Close"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 16,
            background: "none",
            border: "none",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
        <h4>Confirm Booking</h4>
        <p>
          <b>Date:</b> {selectedDate?.toLocaleDateString()}
        </p>
        <p>
          <b>Time:</b> {formData.timeSlot}
        </p>
        <p>
          <b>Name:</b> {formData.name}
        </p>
        <Button variant="success" type="button" onClick={onConfirm}>
          Confirm
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BookingModal;