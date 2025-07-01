import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Container } from 'react-bootstrap';
import { 
  FaEnvelope, 
  FaSms, 
  FaInstagram, 
  FaFacebook, 
  FaStar,
  FaYelp,
  FaGoogle,
  FaCalendarAlt,
  FaQuoteLeft,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaPhone
} from 'react-icons/fa';
import './Contact.css';
import SEO from './SEO';

const Contact = () => {
  const navigate = useNavigate();

  const handleBookEvent = () => {
    navigate('/BookUs');
  };

  const handleGetQuote = () => {
    const contactSection = document.getElementById('contact-details');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="contact-page">
      <SEO
        title="Contact My Hibachi Chef - Book Your Private Hibachi Experience | Dallas, TX"
        description="Contact My Hibachi Chef for private hibachi catering services in Dallas, Texas. Get quotes, book events, and reach our professional hibachi chefs. Phone, email, and social media contact information."
        keywords="contact hibachi chef dallas, hibachi catering quote, book hibachi event, private chef contact, dallas hibachi booking, hibachi party quote, japanese chef contact"
        url="/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact My Hibachi Chef",
          "description": "Contact information and booking details for My Hibachi Chef catering services",
          "mainEntity": {
            "@type": "Organization",
            "name": "My Hibachi Chef",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+1-XXX-XXX-XXXX",
                "contactType": "customer service",
                "areaServed": "Dallas, TX",
                "availableLanguage": ["English", "Spanish"],
                "hoursAvailable": {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                  "opens": "10:00",
                  "closes": "22:00"
                }
              },
              {
                "@type": "ContactPoint",
                "email": "info@myhibachichef.com",
                "contactType": "customer service"
              }
            ],
            "sameAs": [
              "https://www.instagram.com/myhibachichef",
              "https://www.facebook.com/myhibachichef",
              "https://www.yelp.com/biz/my-hibachi-chef"
            ]
          }
        }}
      />
      <Container fluid className="px-0">
        {/* Hero Section */}
        <div className="contact-hero">
          <div className="hero-content">
            <h1 className="hero-title">
              <FaHeart className="heart-icon" />
              Book Your Experience
            </h1>
            <p className="hero-subtitle">
              Transform your special occasion into an unforgettable culinary adventure. Our expert hibachi chefs bring restaurant-quality dining directly to your venue!
            </p>
          </div>
        </div>

        <Container className="contact-container">
          {/* Main Contact Section */}
          <Row className="contact-main-section" id="contact-details">
            {/* Contact Information Card */}
            <Col lg={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body>
                  <h3 className="card-title">
                    <FaEnvelope className="title-icon" />
                    Professional Booking Services
                  </h3>
                  
                  <div className="contact-info-list">
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <div className="contact-details">
                        <h5>Professional Booking</h5>
                        <a href="mailto:cs@myhibachichef.com" className="contact-link">
                          cs@myhibachichef.com
                        </a>
                        <p className="contact-note">Premium service bookings, custom quotes, and expert consultation</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <FaSms className="contact-icon" />
                      <div className="contact-details">
                        <h5>Instant Response</h5>
                        <a href="sms:+19167408768" className="contact-link">
                          +1 (916) 740-8768
                        </a>
                        <p className="contact-note">Text for immediate assistance, scheduled calls available</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <FaClock className="contact-icon" />
                      <div className="contact-details">
                        <h5>Rapid Response Guarantee</h5>
                        <p className="contact-link">Within 1-2 hours</p>
                        <p className="contact-note">Professional team standing by! Email or social media DM for fastest response</p>
                      </div>
                    </div>

                    <div className="contact-item">
                      <FaMapMarkerAlt className="contact-icon" />
                      <div className="contact-details">
                        <h5>Service Coverage</h5>
                        <p className="contact-link">Northern California up to 150 miles from Fremont</p>
                        <p className="contact-note">Premium mobile hibachi service delivered to your location!</p>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Reviews & Social Media Card */}
            <Col lg={6} className="mb-4">
              <Card className="contact-card h-100">
                <Card.Body>
                  <h3 className="card-title">
                    <FaStar className="title-icon" />
                    Client Reviews & Community
                  </h3>

                  {/* Review Platforms */}
                  <div className="review-section">
                    <h5 className="section-subtitle">⭐ Share Your Experience & Help Others Discover Excellence!</h5>
                    <p className="review-incentive">
                      Your testimonials inspire confidence in future clients and help us maintain our commitment to exceptional service. 
                      We value every review! 🙏
                    </p>
                    <div className="review-buttons">
                      <a
                        href="https://www.yelp.com/biz/my-hibachi-fremont"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="review-button yelp-button"
                      >
                        <FaYelp className="review-icon" />
                        <div className="review-content">
                          <strong>Share Your Hibachi Experience</strong>
                          <small>Help others discover our service!</small>
                        </div>
                        <div className="review-badge">⭐ 5.0 Stars</div>
                      </a>

                      <a
                        href="https://www.google.com/maps/place/My+hibachi/@37.8543835,-122.0808034,8z/data=!4m15!1m8!3m7!1s0x808fc75b1c21cf49:0x152b61e9f0a0f93d!2sMy+hibachi!8m2!3d37.8543835!4d-122.0808034!10e1!16s%2Fg%2F11xkvw5_hv!3m5!1s0x808fc75b1c21cf49:0x152b61e9f0a0f93d!8m2!3d37.8543835!4d-122.0808034!16s%2Fg%2F11xkvw5_hv?entry=ttu&g_ep=EgoyMDI1MDYyNi4wIKXMDSoASAFQAw%3D%3D"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="review-button google-button"
                      >
                        <FaGoogle className="review-icon" />
                        <div className="review-content">
                          <strong>Google Business Review</strong>
                          <small>Boost our visibility to new clients!</small>
                        </div>
                        <div className="review-badge">⭐ 5.0 Stars</div>
                      </a>
                    </div>
                    
                    <div className="review-stats">
                      <div className="stat-item">
                        <span className="stat-number">⭐⭐⭐⭐⭐</span>
                        <span className="stat-label">Five Star Service</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="social-section">
                    <h5 className="section-subtitle">🔗 Connect With Our Community</h5>
                    <div className="social-links">
                      <a
                        href="https://www.instagram.com/my_hibachi_chef/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link instagram-link"
                      >
                        <FaInstagram className="social-icon" />
                        <div>
                          <strong>@my_hibachi_chef</strong>
                          <small>Exclusive content & culinary inspiration</small>
                        </div>
                      </a>

                      <a
                        href="https://www.facebook.com/profile.php?id=61577483702847"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link facebook-link"
                      >
                        <FaFacebook className="social-icon" />
                        <div>
                          <strong>My Hibachi</strong>
                          <small>Event galleries & client testimonials</small>
                        </div>
                      </a>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Testimonial Section */}
          <Row className="testimonial-section">
            <Col>
              <Card className="testimonial-card">
                <Card.Body>
                  <div className="testimonial-content">
                    <FaQuoteLeft className="quote-icon" />
                    <blockquote className="testimonial-text">
                      "The entire experience was amazing! Chef Mike was professional, entertaining, and the food was absolutely delicious. All our guests are still talking about it!"
                    </blockquote>
                    <div className="testimonial-author">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="star-icon" />
                        ))}
                      </div>
                      <p>- Sarah M., Birthday Party Host</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Call-to-Action Section */}
          <Row className="cta-section">
            <Col>
              <Card className="cta-card">
                <Card.Body className="text-center">
                  <h3 className="cta-title">Ready to Reserve Your Premium Experience?</h3>
                  <p className="cta-subtitle">
                    Join our distinguished clientele who trust us with their most important celebrations and corporate events!
                  </p>
                  <div className="cta-buttons">
                    <Button 
                      size="lg" 
                      onClick={handleBookEvent}
                      className="cta-button"
                    >
                      <FaCalendarAlt className="button-icon" />
                      Book Your Event Now
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={handleGetQuote}
                      className="cta-button"
                    >
                      <FaEnvelope className="button-icon" />
                      Get Free Quote
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Trust Indicators */}
          <Row className="trust-section">
            <Col>
              <div className="trust-indicators">
                <div className="trust-item">
                  <div className="trust-number">🏆</div>
                  <div className="trust-label">Award-Winning Events</div>
                </div>
                <div className="trust-item">
                  <div className="trust-number">5.0★</div>
                  <div className="trust-label">Excellence Certified</div>
                </div>
                <div className="trust-item">
                  <div className="trust-number">🎯</div>
                  <div className="trust-label">Professional Standards</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
};

export default Contact;
