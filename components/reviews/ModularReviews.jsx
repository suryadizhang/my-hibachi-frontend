import React, { useState, useCallback, useMemo } from 'react';
import { Container, Badge } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import ReviewStats from './ReviewStats.jsx';
import ReviewFilters from './ReviewFilters.jsx';
import ReviewsGrid from './ReviewsGrid.jsx';
import ReviewsPagination from './ReviewsPagination.jsx';
import ReviewsCTA from './ReviewsCTA.jsx';
import { reviewsData } from './reviewsData.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ModularReviews = () => {
  const router = useRouter();
  
  // State management
  const [showAll, setShowAll] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState(6);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Memoized filtered and sorted reviews
  const processedReviews = useMemo(() => {
    const filtered = reviewsData.filter(review => {
      if (filter === 'all') return true;
      return review.service.toLowerCase().includes(filter.toLowerCase());
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
      return 0;
    });

    return sorted;
  }, [filter, sortBy]);

  // Memoized reviews to display
  const reviewsToShow = useMemo(() => {
    return showAll ? processedReviews : processedReviews.slice(0, displayedReviews);
  }, [processedReviews, showAll, displayedReviews]);

  // Event handlers with useCallback for performance
  const handleLoadMore = useCallback(() => {
    if (showAll) {
      setDisplayedReviews(6);
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  }, [showAll]);

  const handleFilterChange = useCallback((newFilter) => {
    setFilter(newFilter);
    setShowAll(false);
    setDisplayedReviews(6);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
    setShowAll(false);
    setDisplayedReviews(6);
  }, []);

  const handleBookEvent = useCallback(() => {
    router.push('/BookUs');
  }, [router]);

  const handleGetQuote = useCallback(() => {
    router.push('/contact');
  }, [router]);

  return (
    <div className="reviews-section" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)', minHeight: '100vh' }}>
      <Container className="py-5">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <div className="hero-badge mb-4">
            <Badge bg="primary" className="px-4 py-2 rounded-pill">
              <i className="bi bi-award-fill me-2"></i>
              Customer Reviews
            </Badge>
          </div>
          <h1 className="display-4 fw-bold mb-4" style={{ 
            background: 'linear-gradient(135deg, #0066cc, #004499)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            <i className="bi bi-star-fill text-warning me-3"></i>
            What Our Customers Say
            <i className="bi bi-star-fill text-warning ms-3"></i>
          </h1>
          <p className="lead text-muted mb-0 mx-auto" style={{ maxWidth: '600px' }}>
            Real experiences from real customers who chose quality hibachi at exceptional value. 
            See why we're the Bay Area's preferred hibachi service!
          </p>
        </div>

        {/* Review Statistics */}
        <ReviewStats reviews={reviewsData} />

        {/* Filter Controls */}
        <ReviewFilters
          filter={filter}
          sortBy={sortBy}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        {/* Reviews Grid */}
        <ReviewsGrid reviews={reviewsToShow} />

        {/* Pagination */}
        <ReviewsPagination 
          showAll={showAll}
          totalReviews={processedReviews.length}
          displayedCount={displayedReviews}
          onLoadMore={handleLoadMore}
        />

        {/* Call-to-Action and Trust Indicators */}
        <ReviewsCTA 
          onBookEvent={handleBookEvent}
          onGetQuote={handleGetQuote}
        />
      </Container>
    </div>
  );
};

export default ModularReviews;
