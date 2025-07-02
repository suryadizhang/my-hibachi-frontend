import React, { memo, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, Spinner, Alert } from 'react-bootstrap';
import './AdminComponents.css';

/**
 * 🚀 VIRTUALIZED LIST
 * High-performance virtual scrolling for large datasets
 */
const VirtualizedList = memo(({
  items = [],
  itemHeight = 80,
  containerHeight = 600,
  overscan = 5,
  renderItem,
  renderSkeleton,
  onScrollEnd,
  isLoading = false,
  error = null,
  emptyMessage = 'No items to display',
  loadingMessage = 'Loading items...'
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length - 1
    );
    
    return {
      start: Math.max(0, visibleStart - overscan),
      end: Math.min(items.length - 1, visibleEnd + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  // Visible items with positioning
  const visibleItems = useMemo(() => {
    const result = [];
    
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      if (items[i]) {
        result.push({
          index: i,
          item: items[i],
          top: i * itemHeight
        });
      }
    }
    
    return result;
  }, [visibleRange, items, itemHeight]);

  // Total height for scrollbar
  const totalHeight = items.length * itemHeight;

  // Handle scroll with debouncing
  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);
    
    isScrollingRef.current = true;
    
    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set scrolling to false after inactivity
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);

    // Check if scrolled to bottom
    const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - currentScrollTop <= clientHeight + 100) {
      onScrollEnd?.();
    }
  }, [onScrollEnd]);

  // Performance monitoring
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
  });

  // Scroll to index
  const scrollToIndex = useCallback((index) => {
    if (containerRef.current) {
      const scrollTop = index * itemHeight;
      containerRef.current.scrollTop = scrollTop;
      setScrollTop(scrollTop);
    }
  }, [itemHeight]);

  // Expose scroll methods
  const scrollMethods = useMemo(() => ({
    scrollToIndex,
    scrollToTop: () => scrollToIndex(0),
    scrollToBottom: () => scrollToIndex(items.length - 1)
  }), [scrollToIndex, items.length]);

  // Error handling
  if (error) {
    return (
      <Card className="virtualized-list-error">
        <Card.Body className="text-center py-5">
          <Alert variant="danger">
            <h6>⚠️ Error Loading Data</h6>
            <p className="mb-0">{error}</p>
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // Empty state
  if (!isLoading && items.length === 0) {
    return (
      <Card className="virtualized-list-empty">
        <Card.Body className="text-center py-5">
          <div className="empty-state-icon mb-3">📭</div>
          <h6 className="text-muted">{emptyMessage}</h6>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="virtualized-list">
      <Card.Body className="p-0">
        {/* Performance Info (Development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="virtualized-debug p-2 bg-light border-bottom">
            <small className="text-muted">
              📊 Renders: {renderCount.current} | 
              Visible: {visibleRange.start}-{visibleRange.end} of {items.length} | 
              Height: {totalHeight}px
            </small>
          </div>
        )}

        {/* Virtual Scroll Container */}
        <div
          ref={containerRef}
          className="virtualized-container"
          style={{ height: containerHeight, overflowY: 'auto' }}
          onScroll={handleScroll}
        >
          {/* Total height spacer */}
          <div
            className="virtualized-spacer"
            style={{ height: totalHeight, position: 'relative' }}
          >
            {/* Visible items */}
            {visibleItems.map(({ index, item, top }) => (
              <div
                key={item.id || index}
                className="virtualized-item"
                style={{
                  position: 'absolute',
                  top,
                  left: 0,
                  right: 0,
                  height: itemHeight
                }}
              >
                {renderItem ? (
                  renderItem(item, index, {
                    isScrolling: isScrollingRef.current,
                    visibleRange
                  })
                ) : (
                  <div className="p-3 border-bottom">
                    <div className="placeholder-item">
                      Item {index}: {JSON.stringify(item).substring(0, 50)}...
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading skeleton items */}
            {isLoading && renderSkeleton && (
              <>
                {Array.from({ length: Math.ceil(containerHeight / itemHeight) }, (_, i) => (
                  <div
                    key={`loading-${i}`}
                    className="virtualized-item"
                    style={{
                      position: 'absolute',
                      top: items.length * itemHeight + i * itemHeight,
                      left: 0,
                      right: 0,
                      height: itemHeight
                    }}
                  >
                    {renderSkeleton(i)}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="virtualized-loading p-3 text-center border-top">
            <Spinner animation="border" size="sm" className="me-2" />
            <span>{loadingMessage}</span>
          </div>
        )}

        {/* Scroll controls */}
        <div className="virtualized-controls position-absolute top-0 end-0 m-2">
          <div className="btn-group-vertical">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={scrollMethods.scrollToTop}
              title="Scroll to top"
            >
              ⬆️
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={scrollMethods.scrollToBottom}
              title="Scroll to bottom"
            >
              ⬇️
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

/**
 * 📋 VIRTUALIZED BOOKING LIST
 * Specialized virtualized list for bookings with optimized rendering
 */
const VirtualizedBookingsList = memo(({
  bookings = [],
  onBookingSelect,
  onBookingAction,
  selectedBookings = [],
  isLoading = false,
  error = null
}) => {
  // Optimized booking item renderer
  const renderBookingItem = useCallback((booking, index, { isScrolling }) => {
    const isSelected = selectedBookings.includes(booking.id);
    
    return (
      <div 
        className={`booking-item p-3 border-bottom ${isSelected ? 'selected' : ''} ${isScrolling ? 'scrolling' : ''}`}
        onClick={() => onBookingSelect(booking.id)}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div className="booking-info flex-grow-1">
            <div className="d-flex align-items-center mb-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onBookingSelect(booking.id);
                }}
                className="me-2"
              />
              <strong>#{booking.id}</strong>
              <span className={`badge ms-2 bg-${getStatusColor(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            
            <div className="booking-details">
              <div className="text-muted small">
                📅 {new Date(booking.date).toLocaleDateString()} at {booking.time}
              </div>
              <div className="booking-customer">
                👤 {booking.customer_name} • 📞 {booking.phone}
              </div>
              <div className="booking-party">
                👥 {booking.party_size} guests • 💰 ${booking.total_amount}
              </div>
            </div>
          </div>
          
          <div className="booking-actions">
            <div className="btn-group btn-group-sm">
              <button
                className="btn btn-outline-success"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookingAction('approve', booking.id);
                }}
                disabled={booking.status === 'confirmed'}
              >
                ✅
              </button>
              <button
                className="btn btn-outline-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookingAction('cancel', booking.id);
                }}
                disabled={booking.status === 'cancelled'}
              >
                ❌
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }, [selectedBookings, onBookingSelect, onBookingAction]);

  // Skeleton loader for booking item
  const renderBookingSkeleton = useCallback((index) => (
    <div className="booking-skeleton p-3 border-bottom">
      <div className="d-flex">
        <div className="skeleton-checkbox me-2"></div>
        <div className="flex-grow-1">
          <div className="skeleton-line mb-2" style={{ width: '60%' }}></div>
          <div className="skeleton-line mb-1" style={{ width: '80%' }}></div>
          <div className="skeleton-line" style={{ width: '40%' }}></div>
        </div>
        <div className="skeleton-actions"></div>
      </div>
    </div>
  ), []);

  return (
    <VirtualizedList
      items={bookings}
      itemHeight={120}
      containerHeight={600}
      overscan={3}
      renderItem={renderBookingItem}
      renderSkeleton={renderBookingSkeleton}
      isLoading={isLoading}
      error={error}
      emptyMessage="No bookings found"
      loadingMessage="Loading bookings..."
    />
  );
});

VirtualizedBookingsList.displayName = 'VirtualizedBookingsList';

// Helper function for status colors
const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    confirmed: 'success',
    cancelled: 'danger',
    completed: 'primary',
    'no-show': 'secondary'
  };
  return colors[status] || 'secondary';
};

export default VirtualizedList;
export { VirtualizedBookingsList };
