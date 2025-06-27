import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const reviewsData = [
  {
    quote: "The best hibachi experience I've ever had! Chef was entertaining and the food was incredible.",
    author: "Jessica, San Francisco",
    rating: 5,
  },
  {
    quote: "Amazing flavors and fun! My guests are still talking about it. Highly recommended.",
    author: "Mike, Fremont",
    rating: 5,
  },
  {
    quote: "Perfect for our backyard party. Professional, punctual, and delicious food.",
    author: "Lily, Newark",
    rating: 5,
  },
  {
    quote: "Great value for the quality and show! Will definitely book again.",
    author: "Daniel, Oakland",
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  return (
    <div className="mb-2" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[...Array(5)].map((_, index) => (
        <i
          key={index}
          className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
          role="img"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

const Reviews = () => (
  <Container className="py-5" aria-label="Customer Reviews Section">
    <h1 className="text-center fw-bold mb-3">✨ What Our Customers Say ✨</h1>
    <Row className="justify-content-center">
      {reviewsData.map((review, idx) => (
        <Col key={idx} md={6} lg={4} className="mb-4 d-flex">
          <Card className="h-100 shadow-sm border-0 hover-shadow flex-fill">
            <Card.Body className="p-4 d-flex flex-column justify-content-between">
              <div>
                <StarRating rating={review.rating} />
                <blockquote className="blockquote">
                  <p className="mb-3 text-dark">“{review.quote}”</p>
                </blockquote>
              </div>
              <footer className="blockquote-footer text-muted">
                <cite>{review.author}</cite>
              </footer>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Reviews;
