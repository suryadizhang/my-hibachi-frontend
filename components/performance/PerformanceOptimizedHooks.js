import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * 🚀 PERFORMANCE OPTIMIZED HOOKS
 * Collection of hooks for optimal React performance
 */

/**
 * Use debounced state with configurable delay
 */
export const useDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [value, setValue, debouncedValue];
};

/**
 * Stable callback that doesn't change reference unless dependencies change
 */
export const useStableCallback = (callback, deps = []) => {
  const callbackRef = useRef(callback);
  
  useEffect(() => {
    callbackRef.current = callback;
  });

  return useCallback((...args) => {
    return callbackRef.current(...args);
  }, deps);
};

/**
 * Optimized admin state management with performance tracking
 */
export const useOptimizedAdminState = () => {
  const [state, setState] = useState({
    bookings: [],
    isLoading: false,
    error: null,
    lastUpdated: null,
    filters: {},
    pagination: { page: 1, limit: 10, total: 0 }
  });

  // Performance metrics
  const metricsRef = useRef({
    renderCount: 0,
    lastFetch: null,
    cacheHits: 0,
    cacheMisses: 0
  });

  // Cache for API responses
  const cacheRef = useRef(new Map());

  // Stable actions
  const actions = useMemo(() => ({
    setLoading: (isLoading) => setState(prev => ({ ...prev, isLoading })),
    setError: (error) => setState(prev => ({ ...prev, error })),
    clearError: () => setState(prev => ({ ...prev, error: null })),
    
    setBookings: (bookings) => setState(prev => ({ 
      ...prev, 
      bookings, 
      lastUpdated: new Date().toISOString() 
    })),

    updateBooking: (bookingId, updates) => setState(prev => ({
      ...prev,
      bookings: prev.bookings.map(booking => 
        booking.id === bookingId ? { ...booking, ...updates } : booking
      )
    })),

    removeBooking: (bookingId) => setState(prev => ({
      ...prev,
      bookings: prev.bookings.filter(booking => booking.id !== bookingId)
    })),

    setFilters: (filters) => setState(prev => ({ ...prev, filters })),
    
    setPagination: (pagination) => setState(prev => ({ 
      ...prev, 
      pagination: { ...prev.pagination, ...pagination } 
    })),

    // Optimized fetch with caching
    fetchBookings: async (options = {}) => {
      const cacheKey = JSON.stringify(options);
      
      // Check cache first
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey);
        if (Date.now() - cached.timestamp < 60000) { // 1 minute cache
          metricsRef.current.cacheHits++;
          setState(prev => ({ 
            ...prev, 
            bookings: cached.data,
            lastUpdated: cached.timestamp
          }));
          return cached.data;
        }
      }

      metricsRef.current.cacheMisses++;
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch('/api/booking/admin/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: JSON.stringify(options)
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Cache the result
        cacheRef.current.set(cacheKey, {
          data: data.bookings || [],
          timestamp: Date.now()
        });

        setState(prev => ({
          ...prev,
          bookings: data.bookings || [],
          pagination: {
            ...prev.pagination,
            total: data.total || 0,
            page: data.page || 1
          },
          isLoading: false,
          lastUpdated: new Date().toISOString()
        }));

        metricsRef.current.lastFetch = Date.now();
        return data.bookings || [];

      } catch (error) {
        console.error('Fetch bookings error:', error);
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        throw error;
      }
    },

    // Clear cache
    clearCache: () => {
      cacheRef.current.clear();
      metricsRef.current.cacheHits = 0;
      metricsRef.current.cacheMisses = 0;
    },

    // Get performance metrics
    getMetrics: () => ({ ...metricsRef.current })
  }), []);

  // Track render count
  useEffect(() => {
    metricsRef.current.renderCount++;
  });

  return [state, actions];
};

/**
 * Optimized booking filters with memoization
 */
export const useOptimizedBookingFilters = (bookings, filters) => {
  return useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    let filtered = [...bookings];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.customer_name?.toLowerCase().includes(searchLower) ||
        booking.phone?.includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        booking.id?.toString().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange?.start || filters.dateRange?.end) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

        if (startDate && bookingDate < startDate) return false;
        if (endDate && bookingDate > endDate) return false;
        return true;
      });
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy];
        let bValue = b[filters.sortBy];

        // Handle different data types
        if (filters.sortBy === 'date' || filters.sortBy === 'created_at') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        } else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }, [bookings, filters]);
};

/**
 * Render profiler hook for performance monitoring
 */
export const useRenderProfiler = (componentName) => {
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef([]);

  useEffect(() => {
    const startTime = performance.now();
    renderCountRef.current++;

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      renderTimesRef.current.push(renderTime);

      // Keep only last 50 render times
      if (renderTimesRef.current.length > 50) {
        renderTimesRef.current = renderTimesRef.current.slice(-50);
      }

      // Log performance issues in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`🐌 Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });

  return {
    renderCount: renderCountRef.current,
    averageRenderTime: renderTimesRef.current.length > 0 
      ? renderTimesRef.current.reduce((a, b) => a + b, 0) / renderTimesRef.current.length 
      : 0,
    lastRenderTime: renderTimesRef.current[renderTimesRef.current.length - 1] || 0
  };
};

/**
 * Infinite scroll hook with performance optimization
 */
export const useInfiniteScroll = (fetchMore, options = {}) => {
  const { threshold = 100, debounce = 150 } = options;
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const fetchTimeoutRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!hasMore || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }

      fetchTimeoutRef.current = setTimeout(async () => {
        setIsFetching(true);
        try {
          const moreData = await fetchMore();
          if (!moreData || moreData.length === 0) {
            setHasMore(false);
          }
        } catch (error) {
          console.error('Infinite scroll fetch error:', error);
        } finally {
          setIsFetching(false);
        }
      }, debounce);
    }
  }, [fetchMore, hasMore, isFetching, threshold, debounce]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  return { isFetching, hasMore, setHasMore };
};

/**
 * Local storage hook with performance optimization
 */
export const useOptimizedLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

  return [value, setStoredValue];
};

/**
 * Optimized WebSocket hook with reconnection logic
 */
export const useOptimizedWebSocket = (url, options = {}) => {
  const { 
    reconnectInterval = 3000, 
    maxReconnectAttempts = 5,
    heartbeatInterval = 30000 
  } = options;

  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messageHistory, setMessageHistory] = useState([]);
  
  const reconnectAttempts = useRef(0);
  const heartbeatTimer = useRef(null);

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        setConnectionStatus('Connected');
        reconnectAttempts.current = 0;
        
        // Start heartbeat
        heartbeatTimer.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, heartbeatInterval);
      };

      ws.onclose = () => {
        setConnectionStatus('Disconnected');
        clearInterval(heartbeatTimer.current);
        
        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.current++;
            setConnectionStatus('Reconnecting...');
            connect();
          }, reconnectInterval);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'pong') { // Filter out heartbeat responses
            setMessageHistory(prev => [...prev.slice(-99), data]); // Keep last 100 messages
          }
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      setSocket(ws);
    } catch (error) {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('Error');
    }
  }, [url, reconnectInterval, maxReconnectAttempts, heartbeatInterval]);

  useEffect(() => {
    connect();
    
    return () => {
      if (socket) {
        socket.close();
      }
      clearInterval(heartbeatTimer.current);
    };
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, [socket]);

  return {
    socket,
    connectionStatus,
    messageHistory,
    sendMessage,
    reconnect: connect
  };
};

/**
 * Memory usage monitor hook
 */
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    if (!performance.memory) return;

    const interval = setInterval(() => {
      setMemoryInfo({
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576), // MB
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576), // MB
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576), // MB
        timestamp: Date.now()
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};
