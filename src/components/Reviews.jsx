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
    author: "Mike, San Jose",
    rating: 5,
  },
  {
    quote: "Perfect for our backyard party. Professional, punctual, and delicious food.",
    author: "Lily, Sacramento",
    rating: 5,
  },
  {
    quote: "Great value for the quality and show! Will definitely book again.",
    author: "Daniel, Oakland",
    rating: 5,
  },
];

const StarRating = ({ rating }) => {
  const stars = Array.from({ length: 5 }, (_, index) => (
    <i
      key={index}
      className={`bi ${index < rating ? 'bi-star-fill' : 'bi-star'} text-warning`}
    />
  ));
  return <div className="mb-2">{stars}</div>;
};

const Reviews = () => (
  <Container className="py-5">
    <h2 className="text-center mb-4">✨ What Our Customers Say ✨</h2>
    <Row>
      {reviewsData.map((review, idx) => (
        <Col key={idx} md={6} lg={4} className="mb-4">
          <Card className="h-100 shadow-sm border-0 hover-shadow">
            <Card.Body className="p-4">
              <StarRating rating={review.rating} />
              <blockquote className="blockquote">
                <p className="mb-3 text-dark">“{review.quote}”</p>
              </blockquote>
              <footer className="blockquote-footer text-muted">{review.author}</footer>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
);

export default Reviews;
