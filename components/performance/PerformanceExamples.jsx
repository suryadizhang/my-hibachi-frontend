/**
 * Practical Examples: Performance Optimizations for Hibachi Restaurant App
 * 
 * This file demonstrates how to implement the performance optimizations
 * in real-world components for your hibachi booking application.
 */

import React, { useState, useEffect } from 'react';
import {
  useOptimizedAdminState,
  useOptimizedBookingFilters,
  useOptimizedBookingSearch,
  OptimizedBookingCard,
  useLazyImage,
  useInfiniteScroll,
  useOptimizedFetch,
  useConcurrentFeatures,
  useOptimizedForm,
  createLazyRoute,
  withMemoization
} from './PerformanceOptimizedHooks';

// ===== EXAMPLE 1: OPTIMIZED ADMIN PANEL =====

/**
 * Before: Multiple useState calls causing excessive re-renders
 * After: Single useReducer with optimized state management
 */
export const OptimizedAdminPanel = () => {
  // Instead of 15+ useState calls, use optimized state management
  const [state, actions] = useOptimizedAdminState();
  
  // Optimized booking filters with intelligent caching
  const filteredBookings = useOptimizedBookingFilters(state.bookings, state.filters);
  
  // Optimized search with debouncing
  const { searchTerm, setSearchTerm, filteredBookings: searchedBookings } = 
    useOptimizedBookingSearch(filteredBookings);

  // Fetch bookings with caching and deduplication
  const { data: bookings, loading, error } = useOptimizedFetch('/api/bookings', {
    ttl: 2 * 60 * 1000, // 2 minutes cache
    immediate: true
  });

  useEffect(() => {
    if (bookings) {
      actions.setBookings(bookings);
    }
  }, [bookings, actions]);

  const handleEditBooking = (bookingId) => {
    // Optimized callback that doesn't re-create on every render
    console.log('Editing booking:', bookingId);
  };

  const handleDeleteBooking = (bookingId) => {
    // Optimized callback that doesn't re-create on every render
    console.log('Deleting booking:', bookingId);
  };

  if (loading) return <div>Loading bookings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-panel">
      <h1>Optimized Admin Panel</h1>
      
      {/* Optimized search input */}
      <input
        type="text"
        placeholder="Search bookings..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Optimized booking list */}
      <div className="bookings-list">
        {searchedBookings.map(booking => (
          <OptimizedBookingCard
            key={booking.id}
            booking={booking}
            onEdit={handleEditBooking}
            onDelete={handleDeleteBooking}
          />
        ))}
      </div>
    </div>
  );
};

// ===== EXAMPLE 2: OPTIMIZED BOOKING FORM =====

/**
 * High-performance form with minimal re-renders
 */
export const OptimizedBookingForm = () => {
  const {
    values,
    errors,
    setValue,
    setError,
    getFieldProps,
    resetForm
  } = useOptimizedForm({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    partySize: 2
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (response.ok) {
        resetForm();
        alert('Booking created successfully!');
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      setError('submit', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="optimized-form">
      <h2>Make a Reservation</h2>
      
      <div className="form-group">
        <label htmlFor="customerName">Name</label>
        <input
          type="text"
          id="customerName"
          {...getFieldProps('customerName')}
          required
        />
        {errors.customerName && <span className="error">{errors.customerName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="customerEmail">Email</label>
        <input
          type="email"
          id="customerEmail"
          {...getFieldProps('customerEmail')}
          required
        />
        {errors.customerEmail && <span className="error">{errors.customerEmail}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="customerPhone">Phone</label>
        <input
          type="tel"
          id="customerPhone"
          {...getFieldProps('customerPhone')}
          required
        />
        {errors.customerPhone && <span className="error">{errors.customerPhone}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            {...getFieldProps('date')}
            required
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="time">Time</label>
          <select id="time" {...getFieldProps('time')} required>
            <option value="">Select time</option>
            <option value="17:00">5:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
          </select>
          {errors.time && <span className="error">{errors.time}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="partySize">Party Size</label>
        <select id="partySize" {...getFieldProps('partySize')} required>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'person' : 'people'}
            </option>
          ))}
        </select>
        {errors.partySize && <span className="error">{errors.partySize}</span>}
      </div>

      {errors.submit && <div className="error-message">{errors.submit}</div>}

      <button type="submit" className="submit-button">
        Make Reservation
      </button>
    </form>
  );
};

// ===== EXAMPLE 3: OPTIMIZED MENU COMPONENT =====

/**
 * Lazy-loaded images and memoized menu items
 */
const OptimizedMenuItem = withMemoization(({ item }) => {
  const [imageRef, imageSrc] = useLazyImage(item.image, '/placeholder-dish.jpg');

  return (
    <div className="menu-item">
      <div ref={imageRef} className="menu-item-image">
        <img src={imageSrc} alt={item.name} loading="lazy" />
      </div>
      <div className="menu-item-content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <span className="price">${item.price}</span>
      </div>
    </div>
  );
});

export const OptimizedMenu = () => {
  const { data: menuItems, loading } = useOptimizedFetch('/api/menu', {
    ttl: 10 * 60 * 1000 // 10 minutes cache for menu items
  });

  if (loading) return <div>Loading menu...</div>;

  return (
    <div className="optimized-menu">
      <h2>Our Menu</h2>
      <div className="menu-grid">
        {menuItems?.map(item => (
          <OptimizedMenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

// ===== EXAMPLE 4: INFINITE SCROLL BOOKINGS =====

/**
 * Infinite scroll with performance optimization
 */
export const InfiniteBookingsList = () => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?page=${page}&limit=20`);
      const newBookings = await response.json();
      
      if (newBookings.length === 0) {
        setHasMore(false);
      } else {
        setBookings(prev => [...prev, ...newBookings]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    }
  };

  const { observerRef, loading } = useInfiniteScroll(
    fetchMoreBookings,
    hasMore,
    200 // Load more when 200px from bottom
  );

  useEffect(() => {
    fetchMoreBookings();
  }, []); // Initial load

  return (
    <div className="infinite-bookings-list">
      <h2>All Bookings</h2>
      
      {bookings.map(booking => (
        <OptimizedBookingCard
          key={booking.id}
          booking={booking}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      ))}
      
      {/* Intersection observer target */}
      <div ref={observerRef} className="loading-trigger">
        {loading && <div>Loading more bookings...</div>}
        {!hasMore && <div>No more bookings to load</div>}
      </div>
    </div>
  );
};

// ===== EXAMPLE 5: CONCURRENT FEATURES =====

/**
 * React 18 concurrent features for better responsiveness
 */
export const ConcurrentSearchExample = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const { isPending, deferredTransition, useDeferredSearch } = useConcurrentFeatures();
  
  const deferredSearchTerm = useDeferredSearch(searchTerm);

  useEffect(() => {
    if (deferredSearchTerm) {
      // This expensive search operation won't block the UI
      deferredTransition(() => {
        const mockResults = Array.from({ length: 100 }, (_, i) => ({
          id: i,
          name: `Customer ${i}`,
          email: `customer${i}@example.com`
        })).filter(customer => 
          customer.name.toLowerCase().includes(deferredSearchTerm.toLowerCase())
        );
        setResults(mockResults);
      });
    } else {
      setResults([]);
    }
  }, [deferredSearchTerm, deferredTransition]);

  return (
    <div className="concurrent-search">
      <h2>Customer Search</h2>
      
      <input
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
      {isPending && <div className="search-pending">Searching...</div>}
      
      <div className="search-results">
        {results.map(customer => (
          <div key={customer.id} className="customer-result">
            <h4>{customer.name}</h4>
            <p>{customer.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ===== EXAMPLE 6: LAZY ROUTE LOADING =====

/**
 * Code splitting for better initial load performance
 */
export const LazyRoutes = {
  AdminPanel: createLazyRoute(
    () => import('./OptimizedAdminPanel'),
    <div className="loading-page">Loading Admin Panel...</div>
  ),
  
  BookingForm: createLazyRoute(
    () => import('./OptimizedBookingForm'),
    <div className="loading-page">Loading Booking Form...</div>
  ),
  
  Menu: createLazyRoute(
    () => import('./OptimizedMenu'),
    <div className="loading-page">Loading Menu...</div>
  )
};

// ===== PERFORMANCE COMPARISON DEMO =====

/**
 * Component to demonstrate performance improvements
 */
export const PerformanceDemo = () => {
  const [showOptimized, setShowOptimized] = useState(true);

  return (
    <div className="performance-demo">
      <h1>Performance Optimization Demo</h1>
      
      <div className="demo-controls">
        <button 
          onClick={() => setShowOptimized(true)}
          className={showOptimized ? 'active' : ''}
        >
          Optimized Version
        </button>
        <button 
          onClick={() => setShowOptimized(false)}
          className={!showOptimized ? 'active' : ''}
        >
          Standard Version
        </button>
      </div>

      <div className="demo-content">
        {showOptimized ? (
          <div>
            <h2>✅ Optimized Components</h2>
            <p>Using performance hooks and optimizations:</p>
            <ul>
              <li>useReducer instead of multiple useState</li>
              <li>Memoized components with React.memo</li>
              <li>Lazy loading for images and components</li>
              <li>Debounced search with useDeferredValue</li>
              <li>API caching and deduplication</li>
              <li>Virtualized lists for large datasets</li>
            </ul>
            <OptimizedAdminPanel />
          </div>
        ) : (
          <div>
            <h2>❌ Standard Implementation</h2>
            <p>Without optimizations:</p>
            <ul>
              <li>Multiple useState calls</li>
              <li>No memoization</li>
              <li>Eager loading</li>
              <li>No search debouncing</li>
              <li>Duplicate API calls</li>
              <li>Renders all list items</li>
            </ul>
            {/* Standard implementation would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default {
  OptimizedAdminPanel,
  OptimizedBookingForm,
  OptimizedMenu,
  InfiniteBookingsList,
  ConcurrentSearchExample,
  LazyRoutes,
  PerformanceDemo
};
