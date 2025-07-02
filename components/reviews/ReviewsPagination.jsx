import React, { memo } from 'react';
import { Button } from 'react-bootstrap';

const ReviewsPagination = memo(({ 
  showAll, 
  totalReviews, 
  displayedCount, 
  onLoadMore 
}) => {
  if (totalReviews <= displayedCount && !showAll) {
    return null;
  }

  return (
    <div className="text-center mt-5">
      <Button 
        variant="outline-primary" 
        size="lg" 
        onClick={onLoadMore}
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
            Load {totalReviews - displayedCount} More Reviews
          </>
        )}
      </Button>
    </div>
  );
});

ReviewsPagination.displayName = 'ReviewsPagination';

export default ReviewsPagination;
