import React from 'react';
import { Card } from 'react-bootstrap';

const Reviews = () => (
  <Card className="p-4">
    <h2>Customer Reviews</h2>
    <blockquote className="blockquote">
      “The best hibachi experience I've ever had! Chef was entertaining and the food was incredible.”
    </blockquote>
    <footer className="blockquote-footer">Jessica, San Francisco</footer>
  </Card>
);

export default Reviews;
