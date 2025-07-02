import React from "react";
import ModularPartyBookingForm from './party/ModularPartyBookingForm.jsx';
import './party/PartyComponents.css';

// Enhanced version of PartyGuestProteinForm using modular components
// This provides backward compatibility while using the new optimized system
const EnhancedPartyGuestProteinForm = () => {
  return <ModularPartyBookingForm />;
};

export default EnhancedPartyGuestProteinForm;
