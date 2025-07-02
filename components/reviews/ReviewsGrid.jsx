import React, { memo } from 'react';
import { Row } from 'react-bootstrap';
import ReviewCard from './ReviewCard.jsx';

const ReviewsGrid = memo(({ reviews }) => {
  return (
    <Row className="reviews-grid">
      {reviews.map((review, index) => (
        <ReviewCard key={`${review.author}-${review.date}`} review={review} index={index} />
      ))}
    </Row>
  );
});

ReviewsGrid.displayName = 'ReviewsGrid';

export default ReviewsGrid;
