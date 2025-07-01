import React, { useState, Suspense } from 'react';
import { Accordion, Spinner, Badge, Container, Row, Col, Card } from 'react-bootstrap';
import FAQCategory from './FAQCategory';
import faqData from './faqData';
import './FAQs.css';
import SEO from '../SEO';
import { faqSchema } from '../../utils/advancedSEO';

const FAQs = () => {
  const [activeCategory, setActiveCategory] = useState('');
  const [openCategories, setOpenCategories] = useState([]);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setOpenCategories([category]); // Open only the selected category
    
    // Scroll to the FAQ content section after a short delay
    setTimeout(() => {
      const faqContentElement = document.querySelector('.faq-accordion');
      if (faqContentElement) {
        faqContentElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  // Elite FAQ structured data for voice search and featured snippets
  const enhancedStructuredData = [
    faqSchema
  ];

  return (
    <Container fluid className="faq-container">
      <SEO
        title="FAQ | Mobile Hibachi Chef Questions | Backyard Party Catering | Bay Area"
        description="Get answers to frequently asked questions about hiring a mobile hibachi chef for your backyard party, birthday celebration, or corporate event. Learn about pricing, booking, and our all-inclusive hibachi catering service in San Jose, Bay Area, Sacramento."
        keywords="mobile hibachi chef FAQ, backyard hibachi party questions, birthday hibachi party at home FAQ, private chef questions Bay Area, hibachi catering FAQ San Jose, kids hibachi party questions, corporate hibachi catering FAQ"
        url="/faqs"
        structuredData={enhancedStructuredData}
      />
      <div className="faq-header text-center mb-5">
        <h1 className="faq-title">
          <span className="faq-emoji">❓</span>
          Frequently Asked Questions
          <span className="faq-emoji">❓</span>
        </h1>
        <p className="faq-subtitle">
          Find answers to all your hibachi party questions
        </p>
        <div className="mt-3">
          <Badge bg="success" className="px-4 py-2 fs-6">
            🌟 Premium Quality Ingredients • Reasonable Prices • Excellence is Our Priority 🌟
          </Badge>
        </div>
      </div>

      {/* Category Overview */}
      <Row className="mb-4">
        <Col>
            <Card className="categories-overview">
              <Card.Header>
                <h4 className="mb-0">📋 FAQ Categories</h4>
                <p className="mb-0 mt-2 opacity-75">Click on any category to view related questions</p>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  {Object.entries(faqData).map(([category, items]) => {
                    const [emoji, ...nameParts] = category.split(' ');
                    const categoryName = nameParts.join(' ');
                    
                    return (
                      <Col xs={12} sm={6} lg={4} xl={4} key={category} className="d-flex">
                        <div 
                          className="category-card w-100"
                          onClick={() => handleCategoryClick(category)}
                          style={{ cursor: 'pointer' }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleCategoryClick(category);
                            }
                          }}
                        >
                          <div className="category-icon">
                            {emoji}
                          </div>
                          <div className="category-info">
                            <h6 className="category-name">
                              {categoryName}
                            </h6>
                            <Badge bg="secondary" className="question-count">
                              {items.length} question{items.length !== 1 ? 's' : ''}
                            </Badge>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              </Card.Body>
            </Card>
        </Col>
      </Row>

      {/* FAQ Content */}
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Back to Categories Button */}
          {activeCategory && (
            <div className="back-to-categories text-center">
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setActiveCategory('');
                  setOpenCategories([]);
                }}
              >
                ← Back to All Categories
              </button>
            </div>
          )}
          
          <Suspense fallback={
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          }>
            <Accordion 
              activeKey={openCategories}
              onSelect={(eventKey) => {
                if (eventKey) {
                  if (openCategories.includes(eventKey)) {
                    setOpenCategories(openCategories.filter(key => key !== eventKey));
                  } else {
                    setOpenCategories([...openCategories, eventKey]);
                  }
                }
              }}
              className="faq-accordion"
            >
              {Object.entries(activeCategory ? { [activeCategory]: faqData[activeCategory] } : faqData).map(([category, items]) => (
                <FAQCategory
                  key={category}
                  eventKey={category}
                  title={category}
                  items={items}
                />
              ))}
            </Accordion>
          </Suspense>
        </Col>
      </Row>

      {/* Contact CTA */}
      <Row className="justify-content-center mt-5">
        <Col lg={8} xl={6} className="text-center">
          <Card className="contact-cta-card">
            <Card.Body className="p-4">
              <h4>Still have questions?</h4>
              <p className="text-light mb-2 opacity-90">
                Our customer service team is here to help you plan the perfect hibachi experience!
              </p>
              <p className="text-light mb-4 opacity-75 fst-italic">
                <strong>🏆 Quality ingredients • Reasonable prices • Exceptional service</strong>
              </p>
              <div className="contact-info">
                <Badge className="contact-badge">
                  📞 Available 11 AM - 10 PM Daily
                </Badge>
                <Badge className="contact-badge">
                  📧 cs@myhibachichef.com
                </Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FAQs;