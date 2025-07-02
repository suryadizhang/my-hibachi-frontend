"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Card, Form, Alert } from "react-bootstrap";
import GuestCountSelector from './GuestCountSelector.jsx';
import ProteinSelector from './ProteinSelector.jsx';
import PricingCalculator from './PricingCalculator.jsx';
import BookingSubmitSection from './BookingSubmitSection.jsx';
import MissingFieldsModal from '../MissingFieldsModal.jsx';
import { getMissingFields } from './partyValidation.js';

const ModularPartyBookingForm = () => {
  // Guest counts
  const [adults, setAdults] = useState(10);
  const [children, setChildren] = useState(0);
  
  // Protein selections
  const [adultProteins, setAdultProteins] = useState([]);
  const [childProteins, setChildProteins] = useState([]);
  const [adultProteinCount, setAdultProteinCount] = useState(2);
  const [childProteinCount, setChildProteinCount] = useState(2);
  
  // Add-ons
  const [adultNoodles, setAdultNoodles] = useState(false);
  const [childNoodles, setChildNoodles] = useState(false);
  
  // UI state
  const [showMissingFieldsModal, setShowMissingFieldsModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Memoized validation
  const missingFields = useMemo(() => 
    getMissingFields(adults, children, adultProteins, childProteins, adultProteinCount, childProteinCount),
    [adults, children, adultProteins, childProteins, adultProteinCount, childProteinCount]
  );

  // Event handlers with useCallback for performance
  const handleAdultsChange = useCallback((newAdults) => {
    setAdults(newAdults);
  }, []);

  const handleChildrenChange = useCallback((newChildren) => {
    setChildren(newChildren);
  }, []);

  const handleAdultProteinCountChange = useCallback((newCount) => {
    setAdultProteinCount(newCount);
    setAdultProteins([]); // Reset selections when count changes
  }, []);

  const handleChildProteinCountChange = useCallback((newCount) => {
    setChildProteinCount(newCount);
    setChildProteins([]); // Reset selections when count changes
  }, []);

  const handleAdultProteinChange = useCallback((newProteins) => {
    setAdultProteins(newProteins);
  }, []);

  const handleChildProteinChange = useCallback((newProteins) => {
    setChildProteins(newProteins);
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (missingFields.length > 0) {
      setShowMissingFieldsModal(true);
    } else {
      // Simulate successful submission
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  }, [missingFields]);

  const handleModalClose = useCallback(() => {
    setShowMissingFieldsModal(false);
  }, []);

  return (
    <Card className="p-4 my-4" style={{ maxWidth: "800px", margin: "2rem auto" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ color: "#2d3748", marginBottom: "0.5rem" }}>
          <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>🍽️</span>
          Party Guests & Protein Calculator
        </h2>
        <p style={{ color: "#718096", margin: "0" }}>
          Calculate your hibachi party cost and select proteins for all guests
        </p>
      </div>

      {/* Success Message */}
      {submitted && (
        <Alert variant="success" className="mb-4">
          <span className="emoji-visible" style={{ marginRight: "0.5rem" }}>✅</span>
          <strong>Order Details Submitted!</strong> We'll contact you shortly to confirm your booking.
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Guest Count Selector */}
        <GuestCountSelector
          adults={adults}
          children={children}
          onAdultsChange={handleAdultsChange}
          onChildrenChange={handleChildrenChange}
        />

        {/* Adult Protein Selection */}
        <ProteinSelector
          guestType="adult"
          proteinCount={adultProteinCount}
          selectedProteins={adultProteins}
          onProteinCountChange={handleAdultProteinCountChange}
          onProteinSelectionChange={handleAdultProteinChange}
          noodlesSelected={adultNoodles}
          onNoodleChange={setAdultNoodles}
          guestCount={adults}
        />

        {/* Child Protein Selection (only shown if children > 0) */}
        {children > 0 && (
          <ProteinSelector
            guestType="child"
            proteinCount={childProteinCount}
            selectedProteins={childProteins}
            onProteinCountChange={handleChildProteinCountChange}
            onProteinSelectionChange={handleChildProteinChange}
            noodlesSelected={childNoodles}
            onNoodleChange={setChildNoodles}
            guestCount={children}
          />
        )}

        {/* Pricing Calculator */}
        <PricingCalculator
          adults={adults}
          children={children}
          adultProteinCount={adultProteinCount}
          childProteinCount={childProteinCount}
          adultProteins={adultProteins}
          childProteins={childProteins}
          adultNoodles={adultNoodles}
          childNoodles={childNoodles}
        />

        {/* Submit Section */}
        <BookingSubmitSection
          onSubmit={handleSubmit}
          missingFields={missingFields}
          submitted={submitted}
        />
      </Form>

      {/* Missing Fields Modal */}
      <MissingFieldsModal
        show={showMissingFieldsModal}
        onClose={handleModalClose}
        missingFields={missingFields}
        title="Complete Party Details"
        subtitle="Please complete all required selections before submitting your order."
      />
    </Card>
  );
};

export default ModularPartyBookingForm;
