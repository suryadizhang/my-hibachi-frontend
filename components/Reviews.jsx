"use client";

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Reviews.css';

const reviewsData = [
  {
    quote: "The best hibachi experience I've ever had! Chef was entertaining and the food was incredible. The quality was restaurant-level and the pricing was so reasonable!",
    author: "Jessica M.",
    location: "San Francisco, CA",
    rating: 5,
    verified: true,
    service: "Birthday Party",
    date: "2025-06-15"
  },
  {
    quote: "Amazing flavors and fun! My guests are still talking about it weeks later. The chef was professional and the interactive cooking show was fantastic. Highly recommended!",
    author: "Mike R.",
    location: "Fremont, CA",
    rating: 5,
    verified: true,
    service: "Corporate Event",
    date: "2025-06-10"
  },
  {
    quote: "Perfect for our backyard party. Professional, punctual, and delicious food. The fresh ingredients and skilled preparation exceeded all expectations!",
    author: "Lily C.",
    location: "Newark, CA",
    rating: 5,
    verified: true,
    service: "Family Gathering",
    date: "2025-06-08"
  },
  {
    quote: "Great value for the quality and show! Will definitely book again. The entertainment value combined with amazing food made our anniversary unforgettable.",
    author: "Daniel O.",
    location: "Oakland, CA",
    rating: 5,
    verified: true,
    service: "Anniversary Dinner",
    date: "2025-06-05"
  },
  {
    quote: "Outstanding quality ingredients and reasonable pricing! The chef's skills were impressive and the presentation was restaurant-quality right in our backyard.",
    author: "Maria Rodriguez",
    location: "Palo Alto, CA",
    rating: 5,
    verified: true,
    service: "Wedding Reception",
    date: "2025-06-01"
  },
  {
    quote: "Exceeded all expectations! Fresh ingredients, expert preparation, and fair pricing. Our guests were amazed by the quality and entertainment value.",
    author: "James Chen",
    location: "Mountain View, CA",
    rating: 5,
    verified: true,
    service: "Graduation Party",
    date: "2025-05-28"
  },
  {
    quote: "Premium hibachi experience at an affordable price. The chef was professional, the food was delicious, and the interactive cooking show was fantastic!",
    author: "Sarah Thompson",
    location: "Sunnyvale, CA",
    rating: 5,
    verified: true,
    service: "Baby Shower",
    date: "2025-05-25"
  },
  {
    quote: "Best value for money! High-quality ingredients, skilled chef, and unforgettable experience. Worth every penny and more!",
    author: "Robert Martinez",
    location: "San Jose, CA",
    rating: 5,
    verified: true,
    service: "Retirement Party",
    date: "2025-05-22"
  },
  {
    quote: "Exceptional quality at reasonable rates. The chef sourced the freshest ingredients and created an amazing dining experience. Highly recommend!",
    author: "Emily Davis",
    location: "Santa Clara, CA",
    rating: 5,
    verified: true,
    service: "Holiday Party",
    date: "2025-05-20"
  },
  {
    quote: "Top-notch service and quality! The pricing is very fair for such premium ingredients and entertainment. Our family event was perfect!",
    author: "David Kim",
    location: "Milpitas, CA",
    rating: 5,
    verified: true,
    service: "Family Reunion",
    date: "2025-05-18"
  },
  {
    quote: "Incredible value proposition! Fresh, high-quality ingredients prepared by a master chef. The interactive experience was worth every dollar.",
    author: "Amanda Johnson",
    location: "Foster City, CA",
    rating: 5,
    verified: true,
    service: "Housewarming",
    date: "2025-05-15"
  },
  {
    quote: "Outstanding quality-to-price ratio! Professional service, premium ingredients, and an entertaining show. Couldn't ask for more!",
    author: "Carlos Vega",
    location: "Hayward, CA",
    rating: 5,
    verified: true,
    service: "Birthday Celebration",
    date: "2025-05-12"
  },
  {
    quote: "Exceptional hibachi experience! The chef's expertise with quality ingredients at such reasonable pricing made our event unforgettable. Five stars!",
    author: "Rachel Wong",
    location: "Cupertino, CA",
    rating: 5,
    verified: true,
    service: "Company Picnic",
    date: "2025-05-10"
  },
  {
    quote: "Perfect blend of quality, entertainment, and value! Fresh ingredients, skilled preparation, and fair pricing. Our guests were thoroughly impressed!",
    author: "Michael O'Brien",
    location: "Redwood City, CA",
    rating: 5,
    verified: true,
    service: "Engagement Party",
    date: "2025-05-08"
  },
  {
    quote: "Absolutely phenomenal! The chef's culinary skills combined with premium ingredients at such reasonable pricing created magic. Best hibachi service ever!",
    author: "Lisa Park",
    location: "Daly City, CA",
    rating: 5,
    verified: true,
    service: "Sweet 16 Party",
    date: "2025-05-05"
  },
  {
    quote: "Incredible experience from start to finish! Quality ingredients, masterful preparation, and excellent value. Our anniversary dinner was absolutely perfect!",
    author: "Anthony Silva",
    location: "San Mateo, CA",
    rating: 5,
    verified: true,
    service: "Anniversary Celebration",
    date: "2025-05-03"
  },
  {
    quote: "Five-star hibachi experience! The chef was entertaining, food was exceptional, and pricing was more than fair. Will book again for sure!",
    author: "Jennifer Lee",
    location: "Pleasanton, CA",
    rating: 5,
    verified: true,
    service: "Office Party",
    date: "2025-05-01"
  },
  {
    quote: "Outstanding service and quality! Fresh ingredients, skilled chef, and great entertainment value. Our guests loved every moment of the experience!",
    author: "Kevin Torres",
    location: "Union City, CA",
    rating: 5,
    verified: true,
    service: "Graduation Celebration",
    date: "2025-04-28"
  },
  {
    quote: "Best hibachi experience we've ever had! The quality of ingredients and chef's expertise at such reasonable pricing is unmatched. Highly recommended!",
    author: "Nicole Brown",
    location: "San Ramon, CA",
    rating: 5,
    verified: true,
    service: "Bridal Shower",
    date: "2025-04-25"
  },
  {
    quote: "Exceptional quality and value! The chef's performance was entertaining and the food was restaurant-quality. Perfect for special occasions!",
    author: "Steven Garcia",
    location: "Walnut Creek, CA",
    rating: 5,
    verified: true,
    service: "Birthday Party",
    date: "2025-04-22"
  },
  {
    quote: "Epic bachelor party experience! The chef was amazing, food was incredible, and the interactive show was the perfect entertainment. All the guys loved it!",
    author: "Jake Thompson",
    location: "San Jose, CA",
    rating: 5,
    verified: true,
    service: "Bachelor Party",
    date: "2025-04-20"
  },
  {
    quote: "Best bachelor party idea ever! Quality hibachi, great entertainment, and reasonable pricing. The chef kept everyone engaged and the food was outstanding!",
    author: "Ryan Mitchell",
    location: "Santa Cruz, CA",
    rating: 5,
    verified: true,
    service: "Bachelor Party",
    date: "2025-04-18"
  },
  {
    quote: "Outstanding hibachi experience for our bachelorette party! The chef was professional, food was delicious, and it was such a unique celebration idea!",
    author: "Amanda Chen",
    location: "Palo Alto, CA",
    rating: 5,
    verified: true,
    service: "Bachelorette Party",
    date: "2025-04-15"
  },
  {
    quote: "Perfect for our pool party! The chef worked around our backyard setup and delivered an amazing hibachi experience. Great quality at fair prices!",
    author: "Carlos Rodriguez",
    location: "Fremont, CA",
    rating: 5,
    verified: true,
    service: "Pool Party",
    date: "2025-04-12"
  },
  {
    quote: "Incredible team building event! Our company loved the interactive hibachi experience. Professional service and excellent value for corporate events!",
    author: "Patricia Williams",
    location: "Mountain View, CA",
    rating: 5,
    verified: true,
    service: "Team Building Event",
    date: "2025-04-10"
  },
  {
    quote: "Amazing housewarming party experience! The chef made our new home celebration extra special. Fresh ingredients and great entertainment value!",
    author: "Mark Johnson",
    location: "Cupertino, CA",
    rating: 5,
    verified: true,
    service: "Housewarming Party",
    date: "2025-04-08"
  },
  {
    quote: "Best Father's Day surprise ever! Dad loved the hibachi show and the whole family enjoyed the delicious food. Perfect special occasion service!",
    author: "Sarah Davis",
    location: "Los Altos, CA",
    rating: 5,
    verified: true,
    service: "Father's Day Celebration",
    date: "2025-04-05"
  },
  {
    quote: "Fantastic Mother's Day celebration! Mom was thrilled with the hibachi experience. Quality ingredients, skilled chef, and wonderful entertainment!",
    author: "David Kim",
    location: "Sunnyvale, CA",
    rating: 5,
    verified: true,
    service: "Mother's Day Celebration",
    date: "2025-04-03"
  }
];

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating mb-3" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning me-1`}
          style={{ fontSize: '1.1rem' }}
          role="img"
          aria-hidden="true"
        />
      ))}
      <span className="ms-2 text-muted small">({rating}.0)</span>
    </div>
  );
};

const ReviewCard = ({ review, index }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Col md={6} lg={4} className="mb-4">
      <Card 
        className={`review-card h-100 shadow-hover border-0 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          borderRadius: '16px',
          transition: 'all 0.3s ease'
        }}
      >
        <Card.Body className="p-4 d-flex flex-column">
          {/* Header with rating and verification */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <StarRating rating={review.rating} />
            {review.verified && (
              <Badge bg="success" className="verified-badge d-flex align-items-center">
                <i className="bi bi-shield-check-fill me-1"></i>
                Verified
              </Badge>
            )}
          </div>
          
          {/* Quote */}
          <blockquote className="blockquote flex-grow-1 mb-0">
            <p className="mb-3 text-dark review-quote" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
              <i className="bi bi-quote text-primary me-2" style={{ fontSize: '1.5rem', opacity: '0.7' }}></i>
              {review.quote}
            </p>
          </blockquote>
          
          {/* Footer */}
          <div className="review-footer mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <cite className="fw-bold text-dark d-block">{review.author}</cite>
                <small className="text-muted">
                  <i className="bi bi-geo-alt me-1"></i>
                  {review.location}
                </small>
              </div>
              <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
            </div>
            <Badge bg="light" text="dark" className="service-badge">
              <i className="bi bi-calendar-event me-1"></i>
              {review.service}
            </Badge>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const ReviewStats = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
  
  return (
    <div className="review-stats-container mb-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="stats-card p-4 rounded-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)' }}>
            <Row className="text-center text-white">
              <Col md={4} className="mb-3 mb-md-0">
                <div className="stat-item">
                  <h2 className="stat-number mb-0 fw-bold">{averageRating.toFixed(1)}</h2>
                  <p className="stat-label mb-0 opacity-75">Average Rating</p>
                  <div className="mt-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={4} className="mb-3 mb-md-0">
                <div className="stat-item">
                  <h2 className="stat-number mb-0 fw-bold">{totalReviews}</h2>
                  <p className="stat-label mb-0 opacity-75">Happy Customers</p>
                  <small className="opacity-75">All verified reviews</small>
                </div>
              </Col>
              <Col md={4}>
                <div className="stat-item">
                  <h2 className="stat-number mb-0 fw-bold">100%</h2>
                  <p className="stat-label mb-0 opacity-75">Satisfaction Rate</p>
                  <small className="opacity-75">5-star experiences</small>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Reviews = () => {
  const [showAll, setShowAll] = useState(false);
  const [displayedReviews, setDisplayedReviews] = useState(6);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Filter and sort reviews
  const filteredReviews = reviewsData.filter(review => {
    if (filter === 'all') return true;
    return review.service.toLowerCase().includes(filter.toLowerCase());
  });

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    return 0;
  });

  const reviewsToShow = showAll ? sortedReviews : sortedReviews.slice(0, displayedReviews);

  const handleLoadMore = () => {
    if (showAll) {
      setDisplayedReviews(6);
      setShowAll(false);
    } else {
      setShowAll(true);
    }
  };

  const serviceTypes = [...new Set(reviewsData.map(review => review.service))];

  // Navigation handlers
  const handleBookEvent = () => {
    router.push('/BookUs');
  };

  const handleGetQuote = () => {
    router.push('/contact');
  };

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

        {/* Filter and Sort Controls */}
        <Row className="mb-4">
          <Col md={6} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center">
              <label className="me-3 fw-bold text-muted">Filter by Event:</label>
              <select 
                className="form-select form-select-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ maxWidth: '200px' }}
              >
                <option value="all">All Events</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </Col>
          <Col md={6}>
            <div className="d-flex align-items-center justify-content-md-end">
              <label className="me-3 fw-bold text-muted">Sort by:</label>
              <select 
                className="form-select form-select-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ maxWidth: '150px' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </Col>
        </Row>

        {/* Reviews Grid */}
        <Row className="reviews-grid">
          {reviewsToShow.map((review, index) => (
            <ReviewCard key={index} review={review} index={index} />
          ))}
        </Row>

        {/* Load More Button */}
        {sortedReviews.length > 6 && (
          <div className="text-center mt-5">
            <Button 
              variant="outline-primary" 
              size="lg" 
              onClick={handleLoadMore}
              className="load-more-btn px-5 py-3 rounded-pill"
              style={{ 
                border: '2px solid #0066cc',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {showAll ? (
                <>
                  <i className="bi bi-chevron-up me-2"></i>
                  Show Less Reviews
                </>
              ) : (
                <>
                  <i className="bi bi-chevron-down me-2"></i>
                  Load {sortedReviews.length - displayedReviews} More Reviews
                </>
              )}
            </Button>
          </div>
        )}

        {/* Call-to-Action Section */}
        <div className="cta-section mt-5">
          <div className="cta-card p-5 rounded-4 text-center" style={{ 
            background: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
            color: 'white'
          }}>
            <h2 className="fw-bold mb-3">Ready to Create Your Own 5-Star Experience?</h2>
            <p className="lead mb-4 opacity-90">
              Join {reviewsData.length}+ satisfied customers who chose quality hibachi at exceptional value
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Button 
                variant="light" 
                size="lg" 
                className="cta-button px-4 py-3 fw-bold"
                onClick={handleBookEvent}
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Book Your Event Now
              </Button>
              <Button 
                variant="outline-light" 
                size="lg" 
                className="cta-button px-4 py-3 fw-bold"
                onClick={handleGetQuote}
              >
                <i className="bi bi-chat-dots me-2"></i>
                Get Free Quote
              </Button>
            </div>
            <div className="mt-4">
              <small className="opacity-75">
                <i className="bi bi-shield-check me-2"></i>
                100% Satisfaction Guarantee • Professional Service • Premium Ingredients
              </small>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <Row className="mt-5 text-center">
          <Col md={3} className="mb-3">
            <div className="trust-item">
              <i className="bi bi-shield-check-fill text-success mb-2" style={{ fontSize: '2rem' }}></i>
              <h6 className="fw-bold">Verified Reviews</h6>
              <small className="text-muted">All authentic customer experiences</small>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="trust-item">
              <i className="bi bi-award-fill text-warning mb-2" style={{ fontSize: '2rem' }}></i>
              <h6 className="fw-bold">5-Star Service</h6>
              <small className="text-muted">Consistently excellent experiences</small>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="trust-item">
              <i className="bi bi-clock-fill text-primary mb-2" style={{ fontSize: '2rem' }}></i>
              <h6 className="fw-bold">Reliable & Punctual</h6>
              <small className="text-muted">Professional service every time</small>
            </div>
          </Col>
          <Col md={3} className="mb-3">
            <div className="trust-item">
              <i className="bi bi-heart-fill text-danger mb-2" style={{ fontSize: '2rem' }}></i>
              <h6 className="fw-bold">Customer Loved</h6>
              <small className="text-muted">Memorable experiences guaranteed</small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reviews;
