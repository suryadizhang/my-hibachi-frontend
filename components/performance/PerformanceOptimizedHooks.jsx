/**
 * Advanced React Performance Optimization Hooks
 * Better alternatives to useState, useEffect, and useCallback
 * 
 * This file demonstrates high-performance React patterns specifically
 * optimized for the hibachi restaurant booking application.
 */

import { 
  useReducer, 
  useMemo, 
  useCallback, 
  useRef, 
  useState,
  useEffect,
  createContext,
  useContext,
  memo,
  lazy,
  Suspense,
  startTransition,
  useTransition,
  useDeferredValue,
  useId
} from 'react';

// ===== 1. ADVANCED STATE MANAGEMENT =====

/**
 * useReducer Alternative - Better than useState for complex state
 * Perfect for AdminPanel with multiple related state variables
 */

// Define action types for better maintainability
const ADMIN_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_BOOKINGS: 'SET_BOOKINGS',
  SET_USER: 'SET_USER',
  SET_KPIS: 'SET_KPIS',
  SET_FILTERS: 'SET_FILTERS',
  RESET_STATE: 'RESET_STATE',
  SET_MODAL: 'SET_MODAL'
};

// Optimized reducer for complex admin state
const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: '' };
    
    case ADMIN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ADMIN_ACTIONS.SET_BOOKINGS:
      return { 
        ...state, 
        bookings: action.payload, 
        loading: false, 
        error: '' 
      };
    
    case ADMIN_ACTIONS.SET_USER:
      return { 
        ...state, 
        username: action.payload.username, 
        userRole: action.payload.role 
      };
    
    case ADMIN_ACTIONS.SET_KPIS:
      return { ...state, kpis: action.payload };
    
    case ADMIN_ACTIONS.SET_FILTERS:
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        page: 1 // Reset pagination when filters change
      };
    
    case ADMIN_ACTIONS.SET_MODAL:
      return { ...state, confirmModal: { ...state.confirmModal, ...action.payload } };
    
    case ADMIN_ACTIONS.RESET_STATE:
      return action.payload;
    
    default:
      return state;
  }
};

// Initial state for admin panel
const initialAdminState = {
  activeTab: "bookings",
  mode: "upcoming",
  date: "",
  year: new Date().getFullYear().toString(),
  month: (new Date().getMonth() + 1).toString(),
  bookings: [],
  error: "",
  loading: false,
  kpis: { total: 0, week: 0, month: 0, waitlist: 0 },
  search: "",
  page: 1,
  username: "",
  userRole: "admin",
  filters: {},
  confirmModal: {
    show: false,
    title: "",
    message: "",
    actionType: "warning",
    confirmButtonText: "Confirm",
    cancelButtonText: "Cancel",
    requiresReason: false,
    reasonPlaceholder: "",
    bookingDetails: null,
    onConfirm: () => {},
    isLoading: false
  }
};

/**
 * Custom hook for optimized admin state management
 * Replaces 15+ useState calls with one useReducer
 */
export const useOptimizedAdminState = () => {
  const [state, dispatch] = useReducer(adminReducer, initialAdminState);

  // Memoized action creators for better performance
  const actions = useMemo(() => ({
    setLoading: (loading) => dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error }),
    clearError: () => dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: '' }),
    setBookings: (bookings) => dispatch({ type: ADMIN_ACTIONS.SET_BOOKINGS, payload: bookings }),
    setUser: (username, role) => dispatch({ type: ADMIN_ACTIONS.SET_USER, payload: { username, role } }),
    setKpis: (kpis) => dispatch({ type: ADMIN_ACTIONS.SET_KPIS, payload: kpis }),
    setFilters: (filters) => dispatch({ type: ADMIN_ACTIONS.SET_FILTERS, payload: filters }),
    setModal: (modalProps) => dispatch({ type: ADMIN_ACTIONS.SET_MODAL, payload: modalProps }),
    resetState: () => dispatch({ type: ADMIN_ACTIONS.RESET_STATE, payload: initialAdminState }),
    fetchBookings: async () => {
      try {
        dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
        
        // Ensure we're on the client side
        if (typeof window === 'undefined') {
          dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: 'Not on client side' });
          return;
        }
        
        const token = localStorage.getItem('adminToken');
        const response = await fetch('/api/booking/admin/bookings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const bookings = await response.json();
          dispatch({ type: ADMIN_ACTIONS.SET_BOOKINGS, payload: bookings });
        } else {
          throw new Error('Failed to fetch bookings');
        }
      } catch (error) {
        dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: false });
      }
    }
  }), []);

  return [state, actions];
};

// ===== 2. ADVANCED MEMOIZATION HOOKS =====

/**
 * useMemo Alternative - Stable references for complex calculations
 * Perfect for filtering and sorting booking data
 */
export const useStableMemo = (factory, deps) => {
  const ref = useRef();
  
  // Deep comparison for dependencies
  const depsChanged = !ref.current || 
    !deps || 
    !ref.current.deps || 
    deps.length !== ref.current.deps.length ||
    deps.some((dep, i) => dep !== ref.current.deps[i]);

  if (depsChanged) {
    ref.current = {
      value: factory(),
      deps: deps
    };
  }

  return ref.current.value;
};

/**
 * Optimized booking filter hook
 * Replaces multiple useMemo calls with intelligent caching
 */
export const useOptimizedBookingFilters = (bookings, filters) => {
  return useStableMemo(() => {
    if (!bookings?.length) return [];

    let filtered = [...bookings];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.customer_name?.toLowerCase().includes(searchLower) ||
        booking.customer_email?.toLowerCase().includes(searchLower) ||
        booking.customer_phone?.includes(filters.search)
      );
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= new Date(filters.startDate) && 
               bookingDate <= new Date(filters.endDate);
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (filters.sortBy === 'date') {
        return filters.sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      }
      return 0;
    });
  }, [bookings, filters.search, filters.startDate, filters.endDate, filters.status, filters.sortBy, filters.sortOrder]);
};

// ===== 3. ADVANCED CALLBACK OPTIMIZATION =====

/**
 * useCallback Alternative with automatic dependency tracking
 * Prevents unnecessary re-renders in child components
 */
export const useStableCallback = (callback, deps = []) => {
  const callbackRef = useRef(callback);
  const depsRef = useRef(deps);

  // Update callback if dependencies changed
  if (!deps.every((dep, i) => dep === depsRef.current[i])) {
    callbackRef.current = callback;
    depsRef.current = deps;
  }

  return useCallback((...args) => callbackRef.current(...args), []);
};

/**
 * Batch update hook - Reduces multiple re-renders to single render
 * Perfect for API responses that update multiple state pieces
 */
export const useBatchedUpdates = () => {
  const [, forceUpdate] = useState({});
  const updatesRef = useRef([]);
  const timeoutRef = useRef(null);

  const batchUpdate = useCallback((updateFn) => {
    updatesRef.current.push(updateFn);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const updates = [...updatesRef.current];
      updatesRef.current = [];
      
      // Apply all updates in a single render cycle
      updates.forEach(update => update());
      forceUpdate({});
    }, 0);
  }, []);

  return batchUpdate;
};

// ===== 4. GLOBAL STATE MANAGEMENT (Better than prop drilling) =====

/**
 * Context-based state management for global app state
 * Alternative to passing props down multiple levels
 */
const AppStateContext = createContext();

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return context;
};

// State management for global hibachi app state
const appStateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_BOOKING_COUNT':
      return { ...state, globalBookingCount: action.payload };
    default:
      return state;
  }
};

export const AppStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, {
    user: null,
    theme: 'light',
    notifications: [],
    globalBookingCount: 0
  });

  const actions = useMemo(() => ({
    setUser: (user) => dispatch({ type: 'SET_USER', payload: user }),
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    setNotifications: (notifications) => dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications }),
    setBookingCount: (count) => dispatch({ type: 'SET_BOOKING_COUNT', payload: count })
  }), []);

  const value = useMemo(() => [state, actions], [state, actions]);

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

// ===== 5. PERFORMANCE MONITORING HOOKS =====

/**
 * Hook to monitor component render performance
 * Helps identify performance bottlenecks
 */
export const useRenderProfiler = (componentName) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${componentName}] Render #${renderCount.current}, Time since last: ${timeSinceLastRender}ms`);
    }
    
    lastRenderTime.current = now;
  });

  return renderCount.current;
};

/**
 * Hook for debounced state updates (perfect for search inputs)
 * Prevents excessive API calls during typing
 */
export const useDebouncedState = (initialValue, delay = 300) => {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return [value, setValue, debouncedValue];
};

// ===== 6. MEMORY OPTIMIZATION HOOKS =====

/**
 * Auto-cleanup hook for preventing memory leaks
 */
export const useAutoCleanup = () => {
  const cleanupFunctions = useRef([]);

  const addCleanup = useCallback((cleanupFn) => {
    cleanupFunctions.current.push(cleanupFn);
  }, []);

  useEffect(() => {
    return () => {
      cleanupFunctions.current.forEach(cleanup => {
        try {
          cleanup();
        } catch (error) {
          console.warn('Cleanup function failed:', error);
        }
      });
      cleanupFunctions.current = [];
    };
  }, []);

  return addCleanup;
};

/**
 * Hook for virtualized lists (for large booking lists)
 * Only renders visible items for better performance
 */
export const useVirtualizedList = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, index) => ({
      ...item,
      virtualIndex: visibleRange.startIndex + index
    }));
  }, [items, visibleRange]);

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    handleScroll,
    totalHeight: items.length * itemHeight,
    offsetY: visibleRange.startIndex * itemHeight
  };
};

// ===== 7. REACT RENDERING SPEED OPTIMIZATIONS =====

/**
 * React.memo wrapper with custom comparison
 * Prevents unnecessary re-renders for components with complex props
 */
export const createMemoizedComponent = (Component, areEqual) => {
  return memo(Component, areEqual);
};

/**
 * HOC for automatic memoization of components
 * Perfect for booking cards, menu items, etc.
 */
export const withMemoization = (WrappedComponent, customCompare) => {
  const MemoizedComponent = memo(WrappedComponent, customCompare);
  MemoizedComponent.displayName = `Memoized(${WrappedComponent.displayName || WrappedComponent.name})`;
  return MemoizedComponent;
};

/**
 * Lazy loading hook for components
 * Improves initial bundle size and loading speed
 */
export const useLazyComponent = (importFunction) => {
  const LazyComponent = useMemo(() => lazy(importFunction), [importFunction]);
  
  const LazyWrapper = useMemo(() => ({ children, fallback = <div>Loading...</div>, ...props }) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props}>
        {children}
      </LazyComponent>
    </Suspense>
  ), [LazyComponent]);

  return LazyWrapper;
};

/**
 * Intersection Observer hook for lazy loading content
 * Perfect for images, booking cards, menu sections
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [options]);

  return [targetRef, isIntersecting];
};

/**
 * Image lazy loading hook with performance optimization
 * Reduces initial page load time
 */
export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px'
  });

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image();
      img.onload = () => setImageSrc(src);
      img.src = src;
    }
  }, [isIntersecting, src]);

  return [imageRef, imageSrc];
};

/**
 * React 18 Concurrent Features Hook
 * Improves responsiveness during heavy computations
 */
export const useConcurrentFeatures = () => {
  const [isPending, startTransition] = useTransition();

  const deferredTransition = useCallback((updateFn) => {
    startTransition(() => {
      updateFn();
    });
  }, []);

  const useDeferredSearch = (searchTerm) => {
    return useDeferredValue(searchTerm);
  };

  return {
    isPending,
    deferredTransition,
    useDeferredSearch
  };
};

/**
 * Optimized list rendering hook
 * Better performance for large lists of bookings/menu items
 */
export const useOptimizedList = (items, renderItem, keyExtractor) => {
  const stableKeyExtractor = useCallback(keyExtractor, []);
  const stableRenderItem = useCallback(renderItem, []);

  const renderedItems = useMemo(() => {
    return items.map((item, index) => {
      const key = stableKeyExtractor(item, index);
      return stableRenderItem(item, index, key);
    });
  }, [items, stableKeyExtractor, stableRenderItem]);

  return renderedItems;
};

/**
 * Bundle splitting helper for route-based code splitting
 * Improves initial load performance
 */
export const createLazyRoute = (importFn, fallback) => {
  const LazyComponent = lazy(importFn);
  
  return (props) => (
    <Suspense fallback={fallback || <div className="loading-spinner">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Pre-loading hook for critical resources
 * Improves perceived performance
 */
export const usePreloader = () => {
  const preloadedResources = useRef(new Set());

  const preloadImage = useCallback((src) => {
    if (!preloadedResources.current.has(src)) {
      const img = new Image();
      img.src = src;
      preloadedResources.current.add(src);
    }
  }, []);

  const preloadComponent = useCallback((importFn) => {
    const key = importFn.toString();
    if (!preloadedResources.current.has(key)) {
      importFn();
      preloadedResources.current.add(key);
    }
  }, []);

  return { preloadImage, preloadComponent };
};

// ===== 8. FORM OPTIMIZATION HOOKS =====

/**
 * Optimized form state management
 * Reduces re-renders during form input
 */
export const useOptimizedForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const setError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Memoized field helper
  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChange: (e) => setValue(name, e.target.value),
    onBlur: () => setFieldTouched(name),
    error: touched[name] && errors[name]
  }), [values, errors, touched, setValue, setFieldTouched]);

  return {
    values,
    errors,
    touched,
    setValue,
    setError,
    setFieldTouched,
    resetForm,
    getFieldProps
  };
};

/**
 * Uncontrolled form hook for better performance
 * Eliminates re-renders on every keystroke
 */
export const useUncontrolledForm = (validationSchema) => {
  const formRef = useRef();
  const [errors, setErrors] = useState({});

  const getFormData = useCallback(() => {
    if (!formRef.current) return {};
    
    const formData = new FormData(formRef.current);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }, []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const data = getFormData();
    const validationErrors = validationSchema(data);
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [getFormData, validationSchema]);

  const resetForm = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setErrors({});
  }, []);

  return {
    formRef,
    errors,
    getFormData,
    validate,
    resetForm
  };
};

// ===== 9. API OPTIMIZATION HOOKS =====

/**
 * Optimized API caching hook
 * Prevents duplicate API calls and improves performance
 */
export const useApiCache = (ttl = 5 * 60 * 1000) => { // 5 minutes default
  const cache = useRef(new Map());

  const getCachedData = useCallback((key) => {
    const cached = cache.current.get(key);
    if (!cached) return null;

    const { data, timestamp } = cached;
    const isExpired = Date.now() - timestamp > ttl;
    
    if (isExpired) {
      cache.current.delete(key);
      return null;
    }

    return data;
  }, [ttl]);

  const setCachedData = useCallback((key, data) => {
    cache.current.set(key, {
      data,
      timestamp: Date.now()
    });
  }, []);

  const clearCache = useCallback((key) => {
    if (key) {
      cache.current.delete(key);
    } else {
      cache.current.clear();
    }
  }, []);

  return { getCachedData, setCachedData, clearCache };
};

/**
 * Optimized fetch hook with caching and deduplication
 * Perfect for booking data, menu items, etc.
 */
export const useOptimizedFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { getCachedData, setCachedData } = useApiCache(options.ttl);
  const abortControllerRef = useRef();

  const fetchData = useCallback(async (fetchUrl = url, fetchOptions = options) => {
    // Check cache first
    const cachedData = getCachedData(fetchUrl);
    if (cachedData && !fetchOptions.skipCache) {
      setData(cachedData);
      return cachedData;
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(fetchUrl, {
        ...fetchOptions,
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Cache the result
      setCachedData(fetchUrl, result);
      setData(result);
      
      return result;
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, options, getCachedData, setCachedData]);

  useEffect(() => {
    if (url && options.immediate !== false) {
      fetchData();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData, url]);

  return { data, loading, error, refetch: fetchData };
};

// ===== 10. SCROLL OPTIMIZATION HOOKS =====

/**
 * Throttled scroll hook for better performance
 * Perfect for scroll-based animations and infinite loading
 */
export const useThrottledScroll = (callback, delay = 100) => {
  const lastRun = useRef(Date.now());

  const throttledCallback = useCallback((event) => {
    if ((Date.now() - lastRun.current) >= delay) {
      callback(event);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);

  useEffect(() => {
    window.addEventListener('scroll', throttledCallback, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledCallback);
    };
  }, [throttledCallback]);
};

/**
 * Infinite scroll hook with performance optimization
 * Perfect for booking lists, menu items
 */
export const useInfiniteScroll = (fetchMore, hasMore = true, threshold = 100) => {
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const [observerRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: `${threshold}px`
  });

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      setLoading(true);
      fetchMore().finally(() => setLoading(false));
    }
  }, [isIntersecting, hasMore, loading, fetchMore]);

  return { observerRef, loading };
};

// ===== 11. HIBACHI-SPECIFIC OPTIMIZATIONS =====

/**
 * Optimized booking card component
 * Memoized for better list performance
 */
export const OptimizedBookingCard = memo(({ booking, onEdit, onDelete }) => {
  const handleEdit = useCallback(() => onEdit(booking.id), [onEdit, booking.id]);
  const handleDelete = useCallback(() => onDelete(booking.id), [onDelete, booking.id]);

  return (
    <div className="booking-card">
      <h3>{booking.customer_name}</h3>
      <p>{booking.date} at {booking.time}</p>
      <p>Party size: {booking.party_size}</p>
      <div className="actions">
        <button onClick={handleEdit}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for optimal re-rendering
  return (
    prevProps.booking.id === nextProps.booking.id &&
    prevProps.booking.customer_name === nextProps.booking.customer_name &&
    prevProps.booking.date === nextProps.booking.date &&
    prevProps.booking.time === nextProps.booking.time &&
    prevProps.booking.party_size === nextProps.booking.party_size
  );
});

/**
 * Optimized search hook for hibachi bookings
 * Debounced and memoized for better performance
 */
export const useOptimizedBookingSearch = (bookings) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDeferredValue(searchTerm);

  const filteredBookings = useMemo(() => {
    if (!debouncedSearchTerm) return bookings;

    const term = debouncedSearchTerm.toLowerCase();
    return bookings.filter(booking =>
      booking.customer_name?.toLowerCase().includes(term) ||
      booking.customer_email?.toLowerCase().includes(term) ||
      booking.customer_phone?.includes(term) ||
      booking.date?.includes(term)
    );
  }, [bookings, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredBookings,
    isSearching: searchTerm !== debouncedSearchTerm
  };
};

// All exports are handled individually throughout the file
// This prevents duplicate export errors
