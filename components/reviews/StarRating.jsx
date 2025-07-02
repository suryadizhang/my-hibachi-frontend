import React, { memo } from 'react';

const StarRating = memo(({ rating, showLabel = true }) => {
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
      {showLabel && (
        <span className="ms-2 text-muted small">({rating}.0)</span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';

export default StarRating;
