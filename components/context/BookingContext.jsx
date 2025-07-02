// Booking System Context - Centralized State Management
// This context provides shared state and actions for all booking components

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import { useEnhancedCaching } from '../hooks/useEnhancedCaching';
import { useBookingWebSocket } from '../../hooks/useWebSocket';

// Action Types
const BOOKING_ACTIONS = {
  SET_SELECTED_DATE: 'SET_SELECTED_DATE',
  SET_SELECTED_TIME: 'SET_SELECTED_TIME',
  SET_FORM_DATA: 'SET_FORM_DATA',
  SET_AVAILABILITY: 'SET_AVAILABILITY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_STEP: 'SET_STEP',
  RESET_FORM: 'RESET_FORM',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  DISMISS_NOTIFICATION: 'DISMISS_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS',
  SET_BOOKING_STATUS: 'SET_BOOKING_STATUS',
  SAVE_DRAFT: 'SAVE_DRAFT',
  LOAD_DRAFT: 'LOAD_DRAFT'
};

// Initial State
const initialState = {
  selectedDate: null,
  selectedTime: '',
  currentStep: 'date',
  isLoading: false,
  error: null,
  availability: {},
  notifications: [],
  bookingStatus: 'draft', // draft, submitting, confirmed, failed
  customerInfo: {
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipcode: '',
    contactPreference: 'email'
  },
  booking: {
    id: null,
    confirmationNumber: null,
    depositRequired: true,
    depositAmount: null,
    totalAmount: null
  }
};

// Reducer
const bookingReducer = (state, action) => {
  switch (action.type) {
    case BOOKING_ACTIONS.SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
        selectedTime: '', // Reset time when date changes
        currentStep: action.payload ? 'time' : 'date'
      };
    
    case BOOKING_ACTIONS.SET_SELECTED_TIME:
      return {
        ...state,
        selectedTime: action.payload,
        currentStep: action.payload ? 'info' : 'time'
      };
    
    case BOOKING_ACTIONS.SET_FORM_DATA:
      return {
        ...state,
        customerInfo: {
          ...state.customerInfo,
          ...action.payload
        }
      };
    
    case BOOKING_ACTIONS.SET_AVAILABILITY:
      return {
        ...state,
        availability: {
          ...state.availability,
          [action.payload.date]: action.payload.slots
        }
      };
    
    case BOOKING_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    
    case BOOKING_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    
    case BOOKING_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case BOOKING_ACTIONS.SET_STEP:
      return {
        ...state,
        currentStep: action.payload
      };
    
    case BOOKING_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            dismissed: false,
            ...action.payload
          }
        ]
      };
    
    case BOOKING_ACTIONS.DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, dismissed: true }
            : notification
        )
      };
    
    case BOOKING_ACTIONS.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
    
    case BOOKING_ACTIONS.SET_BOOKING_STATUS:
      return {
        ...state,
        bookingStatus: action.payload.status,
        booking: {
          ...state.booking,
          ...action.payload.data
        }
      };
    
    case BOOKING_ACTIONS.SAVE_DRAFT:
      // Save current state to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('bookingDraft', JSON.stringify({
          selectedDate: state.selectedDate,
          selectedTime: state.selectedTime,
          customerInfo: state.customerInfo
        }));
      }
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: 'info',
            message: 'Booking saved as draft',
            timestamp: new Date().toISOString(),
            isToast: true
          }
        ]
      };
    
    case BOOKING_ACTIONS.LOAD_DRAFT:
      if (typeof window !== 'undefined') {
        const draftData = localStorage.getItem('bookingDraft');
        if (draftData) {
          const parsed = JSON.parse(draftData);
          return {
            ...state,
            selectedDate: parsed.selectedDate ? new Date(parsed.selectedDate) : null,
            selectedTime: parsed.selectedTime || '',
            customerInfo: { ...state.customerInfo, ...parsed.customerInfo }
          };
        }
      }
      return state;
    
    case BOOKING_ACTIONS.RESET_FORM:
      // Clear localStorage draft
      if (typeof window !== 'undefined') {
        localStorage.removeItem('bookingDraft');
      }
      return {
        ...initialState
      };
    
    default:
      return state;
  }
};

// Context
const BookingContext = createContext();

// Provider Component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  
  // WebSocket connection for real-time updates (with error handling)
  let webSocketHook = null;
  try {
    webSocketHook = useBookingWebSocket(state.booking.id);
  } catch (error) {
    console.warn('WebSocket not available:', error);
    webSocketHook = {
      isConnected: false,
      bookingStatus: null,
      availableSlots: [],
      notifications: [],
      subscribeToBooking: () => {},
      unsubscribeFromBooking: () => {},
      requestSlotUpdate: () => {},
      clearNotification: () => {},
      clearAllNotifications: () => {},
      error: null
    };
  }
  
  const {
    isConnected: wsConnected,
    bookingStatus: wsBookingStatus,
    availableSlots: wsAvailableSlots,
    notifications: wsNotifications,
    subscribeToBooking,
    unsubscribeFromBooking,
    requestSlotUpdate,
    clearNotification: clearWsNotification,
    clearAllNotifications: clearAllWsNotifications,
    error: wsError
  } = webSocketHook;
  
  // Real-time updates hook (fallback/additional)
  const { isConnected, lastUpdate, updateNotifications } = useRealTimeUpdates(
    state.selectedDate?.toISOString().split('T')[0]
  );
  
  // Enhanced caching hook
  const { getCachedData, setCachedData, clearCache } = useEnhancedCaching();
  
  // Handle WebSocket notifications
  useEffect(() => {
    if (wsNotifications.length > 0) {
      wsNotifications.forEach(notification => {
        dispatch({ 
          type: BOOKING_ACTIONS.ADD_NOTIFICATION, 
          payload: {
            ...notification,
            source: 'websocket'
          }
        });
      });
    }
  }, [wsNotifications]);
  
  // Handle WebSocket booking status updates
  useEffect(() => {
    if (wsBookingStatus) {
      dispatch({ 
        type: BOOKING_ACTIONS.SET_BOOKING_STATUS, 
        payload: { 
          status: wsBookingStatus.status,
          data: wsBookingStatus
        }
      });
    }
  }, [wsBookingStatus]);
  
  // Handle WebSocket slot availability updates
  useEffect(() => {
    if (wsAvailableSlots.length > 0 && state.selectedDate) {
      const dateStr = state.selectedDate.toISOString().split('T')[0];
      dispatch({ 
        type: BOOKING_ACTIONS.SET_AVAILABILITY, 
        payload: { 
          date: dateStr, 
          slots: wsAvailableSlots 
        }
      });
    }
  }, [wsAvailableSlots, state.selectedDate]);
  
  // Handle WebSocket errors (silently in development)
  useEffect(() => {
    if (wsError && process.env.NODE_ENV !== 'development') {
      dispatch({ 
        type: BOOKING_ACTIONS.ADD_NOTIFICATION, 
        payload: {
          type: 'warning',
          message: 'Real-time updates temporarily unavailable',
          source: 'websocket'
        }
      });
    }
  }, [wsError]);
  
  // Memoized actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    setSelectedDate: (date) => {
      dispatch({ type: BOOKING_ACTIONS.SET_SELECTED_DATE, payload: date });
    },
    
    setSelectedTime: (time) => {
      dispatch({ type: BOOKING_ACTIONS.SET_SELECTED_TIME, payload: time });
    },
    
    updateCustomerInfo: (data) => {
      dispatch({ type: BOOKING_ACTIONS.SET_FORM_DATA, payload: data });
    },
    
    setAvailability: (date, slots) => {
      dispatch({ 
        type: BOOKING_ACTIONS.SET_AVAILABILITY, 
        payload: { date, slots } 
      });
      // Cache the availability data
      setCachedData(`availability_${date}`, slots);
    },
    
    setLoading: (loading) => {
      dispatch({ type: BOOKING_ACTIONS.SET_LOADING, payload: loading });
    },
    
    setError: (error) => {
      dispatch({ type: BOOKING_ACTIONS.SET_ERROR, payload: error });
    },
    
    clearError: () => {
      dispatch({ type: BOOKING_ACTIONS.CLEAR_ERROR });
    },
    
    setStep: (step) => {
      dispatch({ type: BOOKING_ACTIONS.SET_STEP, payload: step });
    },
    
    addNotification: (notification) => {
      dispatch({ type: BOOKING_ACTIONS.ADD_NOTIFICATION, payload: notification });
    },
    
    dismissNotification: (id) => {
      dispatch({ type: BOOKING_ACTIONS.DISMISS_NOTIFICATION, payload: id });
    },
    
    clearAllNotifications: () => {
      dispatch({ type: BOOKING_ACTIONS.CLEAR_ALL_NOTIFICATIONS });
    },
    
    setBookingStatus: (status, data = {}) => {
      dispatch({ 
        type: BOOKING_ACTIONS.SET_BOOKING_STATUS, 
        payload: { status, data } 
      });
    },
    
    saveDraft: () => {
      dispatch({ type: BOOKING_ACTIONS.SAVE_DRAFT });
    },
    
    loadDraft: () => {
      dispatch({ type: BOOKING_ACTIONS.LOAD_DRAFT });
    },
    
    resetBooking: () => {
      dispatch({ type: BOOKING_ACTIONS.RESET_FORM });
      clearCache();
    },
    
    // Advanced actions
    exportBooking: () => {
      const bookingData = {
        date: state.selectedDate,
        time: state.selectedTime,
        customer: state.customerInfo
      };
      const dataStr = JSON.stringify(bookingData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `booking-${Date.now()}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    },
    
    requestCallback: () => {
      dispatch({ 
        type: BOOKING_ACTIONS.ADD_NOTIFICATION, 
        payload: {
          type: 'info',
          message: 'Callback request submitted. We will contact you within 24 hours.',
          isToast: true
        }
      });
    },
    
    scheduleReminder: () => {
      dispatch({ 
        type: BOOKING_ACTIONS.ADD_NOTIFICATION, 
        payload: {
          type: 'success',
          message: 'Reminder scheduled. You will receive an email notification.',
          isToast: true
        }
      });
    },
    
    // WebSocket actions
    subscribeToBookingUpdates: (bookingId) => {
      return subscribeToBooking(bookingId);
    },
    
    unsubscribeFromBookingUpdates: (bookingId) => {
      return unsubscribeFromBooking(bookingId);
    },
    
    requestAvailabilityUpdate: (date) => {
      return requestSlotUpdate(date);
    },
    
    clearWebSocketNotification: (id) => {
      clearWsNotification(id);
    },
    
    clearAllWebSocketNotifications: () => {
      clearAllWsNotifications();
    }
  }), [
    setCachedData, 
    clearCache, 
    state.selectedDate, 
    state.selectedTime, 
    state.customerInfo,
    subscribeToBooking,
    unsubscribeFromBooking,
    requestSlotUpdate,
    clearWsNotification,
    clearAllWsNotifications
  ]);
  
  // Memoized value to prevent unnecessary context re-renders
  const contextValue = useMemo(() => ({
    ...state,
    actions,
    realTime: {
      isConnected: isConnected || wsConnected,
      lastUpdate,
      updateNotifications,
      websocket: {
        connected: wsConnected,
        error: wsError
      }
    },
    cache: {
      getCachedData,
      setCachedData,
      clearCache
    }
  }), [
    state,
    actions,
    isConnected,
    wsConnected,
    lastUpdate,
    updateNotifications,
    wsError,
    getCachedData,
    setCachedData,
    clearCache
  ]);
  
  return (
    <BookingContext.Provider value={contextValue}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

// Export action types for use in components
export { BOOKING_ACTIONS };
