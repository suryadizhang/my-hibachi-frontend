import React, { memo } from 'react';
import { Button } from 'react-bootstrap';

const BookingSubmitSection = memo(({ 
  onSubmit, 
  missingFields,
  submitted 
}) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Button
        type="submit"
        onClick={onSubmit}
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "25px",
          padding: "1rem 2rem",
          fontSize: "1.1rem",
          fontWeight: "600",
          color: "white",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
        }}
      >
        <span className="emoji-visible">📋</span>
        Submit Order Details
      </Button>
      
      {/* Missing Fields Warning */}
      {missingFields.length > 0 && (
        <div style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#fff3cd",
          border: "1px solid #ffeaa7",
          borderRadius: "8px",
          fontSize: "0.9rem",
          color: "#856404",
          maxWidth: "500px",
          margin: "1rem auto 0"
        }}>
          <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>⚠️</span>
          <strong>Please complete:</strong>
          <ul style={{ margin: "0.5rem 0 0 0", textAlign: "left" }}>
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

BookingSubmitSection.displayName = 'BookingSubmitSection';

export default BookingSubmitSection;
