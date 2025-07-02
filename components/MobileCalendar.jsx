// Mobile Calendar Component with Touch/Swipe Navigation
// Enhanced calendar specifically optimized for mobile devices

import React, { useState, useEffect, useRef } from 'react';
import './MobileCalendar.css';

const _MobileCalendar = ({ 
  selectedDate, 
  onDateSelect, 
  minDate, 
  excludeDates = [],
  dayClassName,
  onMonthChange
}) => {
  const [currentMonth, setCurrentMonth] = useState(
    selectedDate ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1) 
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const _calendarRef = useRef();

  // Minimum swipe distance for month navigation
  const _MIN_SWIPE_DISTANCE = 50;

  // Get days in month
  const _getDaysInMonth = (date) => {
    const _year = date.getFullYear();
    const _month = date.getMonth();
    const _firstDay = new Date(year, month, 1);
    const _lastDay = new Date(year, month + 1, 0);
    const _daysInMonth = lastDay.getDate();
    const _startingDayOfWeek = firstDay.getDay();

    const _days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Check if date is disabled
  const _isDateDisabled = (date) => {
    if (!date) return true;
    if (minDate && date < minDate) return true;
    return excludeDates.some(excludeDate => 
      excludeDate.toDateString() === date.toDateString()
    );
  };

  // Handle touch start
  const _handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  // Handle touch move
  const _handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Handle touch end - determine swipe direction
  const _handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const _distance = touchStart - touchEnd;
    const _isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const _isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (!isTransitioning) {
      if (isLeftSwipe) {
        navigateMonth(1); // Next month
      } else if (isRightSwipe) {
        navigateMonth(-1); // Previous month
      }
    }
  };

  // Navigate to different month
  const _navigateMonth = (direction) => {
    setIsTransitioning(true);
    
    const _newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    
    // Prevent going to past months
    const _now = new Date();
    const _currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    if (newMonth >= currentMonthStart) {
      setCurrentMonth(newMonth);
      onMonthChange?.(newMonth);
    }
    
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Handle date click
  const _handleDateClick = (date) => {
    if (isDateDisabled(date) || isTransitioning) return;
    onDateSelect(date);
  };

  // Get CSS class for day
  const _getDayClass = (date) => {
    if (!date) return 'mobile-calendar-day empty';
    
    let className = 'mobile-calendar-day';
    
    if (isDateDisabled(date)) {
      className += ' disabled';
    } else {
      className += ' selectable';
    }
    
    if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
      className += ' selected';
    }
    
    // Add custom day class if provided
    if (dayClassName) {
      className += ` ${dayClassName(date)}`;
    }
    
    // Highlight today
    const _today = new Date();
    if (date.toDateString() === today.toDateString()) {
      className += ' today';
    }
    
    return className;
  };

  // Format month/year header
  const _formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const _days = getDaysInMonth(currentMonth);
  const _weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="mobile-calendar" ref={calendarRef}>
      {/* Header */}
      <div className="mobile-calendar-header">
        <button 
          className="nav-button prev"
          onClick={() => navigateMonth(-1)}
          disabled={isTransitioning}
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="month-year">{formatMonthYear(currentMonth)}</h3>
        <button 
          className="nav-button next"
          onClick={() => navigateMonth(1)}
          disabled={isTransitioning}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Week days header */}
      <div className="mobile-calendar-weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div 
        className={`mobile-calendar-grid ${isTransitioning ? 'transitioning' : ''}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {days.map((date, index) => (
          <div
            key={index}
            className={getDayClass(date)}
            onClick={() => handleDateClick(date)}
            role={date ? "button" : "presentation"}
            tabIndex={date && !isDateDisabled(date) ? 0 : -1}
            aria-pressed={selectedDate && date && date.toDateString() === selectedDate.toDateString()}
            aria-label={date ? date.toLocaleDateString() : undefined}
          >
            {date ? date.getDate() : ''}
          </div>
        ))}
      </div>

      {/* Swipe hint */}
      <div className="swipe-hint">
        <span>← Swipe to navigate months →</span>
      </div>
    </div>
  );
};

export default MobileCalendar;
