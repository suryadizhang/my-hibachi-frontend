// Smart Date Suggestions Hook
// This hook provides intelligent date suggestions for the booking system

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE } from '../../lib/config/api';

export const useSmartDateSuggestions = () => {
  const [suggestions, setSuggestions] = useState({
    nextAvailable: [],
    weekends: [],
    popular: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if date is weekend
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  // Check if date has availability
  const checkDateAvailability = async (dateStr) => {
    try {
      const res = await axios.get(`${API_BASE}/api/booking/availability?date=${dateStr}`);
      return Object.values(res.data).some(slot => slot.status === "available");
    } catch (error) {
      console.warn('Error checking availability for', dateStr, error);
      return false;
    }
  };

  // Get smart date suggestions
  const getSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      const nextAvailable = [];
      const weekends = [];
      const popular = [];

      // Check next 30 days for available dates
      for (let i = 2; i <= 30; i++) { // Start from day 2 (minimum advance booking)
        const date = new Date(now);
        date.setDate(now.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const hasAvailability = await checkDateAvailability(dateStr);
        
        if (hasAvailability) {
          // Add to next available (first 5)
          if (nextAvailable.length < 5) {
            nextAvailable.push({
              date: new Date(date),
              dateStr,
              label: `${date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}`
            });
          }

          // Add weekends
          if (isWeekend(date) && weekends.length < 4) {
            weekends.push({
              date: new Date(date),
              dateStr,
              label: `${date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}`
            });
          }

          // Add popular dates (Friday-Sunday)
          if ((date.getDay() >= 5 || date.getDay() === 0) && popular.length < 4) {
            popular.push({
              date: new Date(date),
              dateStr,
              label: `${date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}`
            });
          }
        }

        // Break early if we have enough suggestions
        if (nextAvailable.length >= 5 && weekends.length >= 4 && popular.length >= 4) {
          break;
        }
      }

      setSuggestions({
        nextAvailable,
        weekends,
        popular
      });

    } catch (err) {
      setError('Failed to load date suggestions');
      console.error('Error getting smart date suggestions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh suggestions when component mounts
  useEffect(() => {
    getSuggestions();
  }, [getSuggestions]);

  return {
    suggestions,
    loading,
    error,
    refreshSuggestions: getSuggestions
  };
};
