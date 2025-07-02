// Smart Date Suggestions Component
// Displays intelligent date suggestions to users

import React from 'react';
import { Button, Card, Row, Col, Spinner } from 'react-bootstrap';
import { useSmartDateSuggestions } from './hooks/useSmartDateSuggestions';
import './SmartDateSuggestions.css';

const SmartDateSuggestions = ({ onDateSelect, selectedDate }) => {
  const { suggestions, loading, error, refreshSuggestions } = useSmartDateSuggestions();

  if (loading) {
    return (
      <div className="smart-suggestions-loading">
        <Spinner animation="border" size="sm" />
        <span>Finding best dates...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="smart-suggestions-error">
        <span>Unable to load suggestions</span>
        <Button 
          variant="outline-primary" 
          size="sm" 
          onClick={refreshSuggestions}
        >
          Retry
        </Button>
      </div>
    );
  }

  const handleDateClick = (suggestionDate) => {
    onDateSelect(suggestionDate.date);
  };

  const isDateSelected = (suggestionDate) => {
    return selectedDate && 
           suggestionDate.date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="smart-date-suggestions">
      <div className="suggestions-header">
        <h5>
          <span className="emoji-visible">🎯</span>
          Smart Date Suggestions
        </h5>
        <Button 
          variant="outline-secondary" 
          size="sm" 
          onClick={refreshSuggestions}
          className="refresh-btn"
        >
          <span className="emoji-visible">🔄</span>
        </Button>
      </div>

      {/* Next Available Dates */}
      {suggestions.nextAvailable.length > 0 && (
        <div className="suggestion-section">
          <h6 className="section-title">
            <span className="emoji-visible">⚡</span>
            Next Available
          </h6>
          <div className="suggestion-grid">
            {suggestions.nextAvailable.map((suggestion, index) => (
              <Button
                key={index}
                variant={isDateSelected(suggestion) ? "primary" : "outline-primary"}
                size="sm"
                className="suggestion-btn"
                onClick={() => handleDateClick(suggestion)}
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Weekend Dates */}
      {suggestions.weekends.length > 0 && (
        <div className="suggestion-section">
          <h6 className="section-title">
            <span className="emoji-visible">🌅</span>
            Weekends
          </h6>
          <div className="suggestion-grid">
            {suggestions.weekends.map((suggestion, index) => (
              <Button
                key={index}
                variant={isDateSelected(suggestion) ? "success" : "outline-success"}
                size="sm"
                className="suggestion-btn weekend-btn"
                onClick={() => handleDateClick(suggestion)}
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Dates */}
      {suggestions.popular.length > 0 && (
        <div className="suggestion-section">
          <h6 className="section-title">
            <span className="emoji-visible">🔥</span>
            Popular Times
          </h6>
          <div className="suggestion-grid">
            {suggestions.popular.map((suggestion, index) => (
              <Button
                key={index}
                variant={isDateSelected(suggestion) ? "warning" : "outline-warning"}
                size="sm"
                className="suggestion-btn popular-btn"
                onClick={() => handleDateClick(suggestion)}
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* No suggestions available */}
      {suggestions.nextAvailable.length === 0 && 
       suggestions.weekends.length === 0 && 
       suggestions.popular.length === 0 && (
        <div className="no-suggestions">
          <span className="emoji-visible">📅</span>
          <p>Looking for the best available dates...</p>
          <small>Please check the calendar for availability</small>
        </div>
      )}
    </div>
  );
};

export default SmartDateSuggestions;
