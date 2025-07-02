import React from "react";
import ModularReviews from './reviews/ModularReviews.jsx';
import './reviews/ReviewsComponents.css';

// Enhanced version of Reviews using modular components
// This provides backward compatibility while using the new optimized system
const EnhancedReviews = () => {
  return <ModularReviews />;
};

export default EnhancedReviews;
