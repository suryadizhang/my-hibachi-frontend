import React from 'react';
import { Container } from 'react-bootstrap';

const Reviews = () => {
  return (
    <Container className="py-5">
      <h1>Customer Reviews</h1>
      <p>This is the Reviews page - it's working!</p>
      <div style={{ backgroundColor: 'lightblue', padding: '20px', margin: '20px 0' }}>
        <h2>Test Content</h2>
        <p>If you can see this, the Reviews component is loading correctly.</p>
      </div>
    </Container>
  );
};

export default Reviews;
