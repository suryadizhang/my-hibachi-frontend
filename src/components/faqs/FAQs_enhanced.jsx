import React, { useState, useMemo } from 'react';
import { Accordion, Spinner, Form, InputGroup, Badge, Container, Row, Col, Card } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';
import FAQCategory from './FAQCategory';
import faqData from './faqData_organized';
import './FAQs.css';

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Filter FAQs based on search term
  const filteredFAQData = useMemo(() => {
    if (!searchTerm.trim()) return faqData;

    const filtered = {};
    Object.entries(faqData).forEach(([category, items]) => {
      const filteredItems = items.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const headerMatch = item.header.toLowerCase().includes(searchLower);
        
        // Extract text content from JSX body for searching
        const bodyText = typeof item.body === 'string' 
          ? item.body 
          : item.body.props?.children?.toString() || '';
        const bodyMatch = bodyText.toLowerCase().includes(searchLower);
        
        return headerMatch || bodyMatch;
      });
      
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    
    return filtered;
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setActiveCategory('');
  };

  const totalFAQs = Object.values(filteredFAQData).reduce((total, items) => total + items.length, 0);

  return (
    <Container fluid className="faq-container">
      <div className="faq-header text-center mb-5">
        <h1 className="faq-title">
          <span className="faq-emoji">❓</span>
          Frequently Asked Questions
          <span className="faq-emoji">❓</span>
        </h1>
        <p className="faq-subtitle">
          Find answers to all your hibachi party questions
        </p>
      </div>

      {/* Search Section */}
      <Row className="justify-content-center mb-4">
        <Col lg={8} md={10}>
          <Card className="search-card">
            <Card.Body>
              <InputGroup size="lg" className="search-input-group">
                <InputGroup.Text className="search-icon">
                  <Search size={20} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search FAQs... (e.g., 'price', 'vegetarian', 'booking', 'safety')"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <InputGroup.Text 
                    className="clear-search" 
                    onClick={clearSearch}
                    style={{ cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </InputGroup.Text>
                )}
              </InputGroup>
              
              {searchTerm && (
                <div className="search-results-info mt-3">
                  <Badge bg="primary" className="me-2">
                    {totalFAQs} result{totalFAQs !== 1 ? 's' : ''} found
                  </Badge>
                  <span className="text-muted">
                    for "{searchTerm}"
                  </span>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category Overview (when not searching) */}
      {!searchTerm && (
        <Row className="mb-4">
          <Col>
            <Card className="categories-overview">
              <Card.Header>
                <h4 className="mb-0">📋 FAQ Categories</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  {Object.entries(faqData).map(([category, items]) => (
                    <Col md={6} lg={4} key={category} className="mb-3">
                      <div 
                        className="category-card"
                        onClick={() => setActiveCategory(category)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="category-icon">
                          {category.split(' ')[0]}
                        </div>
                        <div className="category-info">
                          <h6 className="category-name">
                            {category.replace(/^[^\s]+\s/, '')}
                          </h6>
                          <Badge bg="secondary" className="question-count">
                            {items.length} question{items.length !== 1 ? 's' : ''}
                          </Badge>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* FAQ Content */}
      <Row className="justify-content-center">
        <Col lg={10}>
          {Object.keys(filteredFAQData).length === 0 ? (
            <Card className="no-results-card text-center">
              <Card.Body>
                <div className="no-results-icon mb-3">
                  🔍
                </div>
                <h4>No results found</h4>
                <p className="text-muted">
                  Try different keywords or browse our categories above
                </p>
                <button 
                  className="btn btn-primary"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </Card.Body>
            </Card>
          ) : (
            <Suspense fallback={
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
              </div>
            }>
              <Accordion 
                alwaysOpen 
                flush 
                activeKey={activeCategory}
                className="faq-accordion"
              >
                {Object.entries(filteredFAQData).map(([category, items]) => (
                  <FAQCategory
                    key={category}
                    eventKey={category}
                    title={category}
                    items={items}
                    searchTerm={searchTerm}
                  />
                ))}
              </Accordion>
            </Suspense>
          )}
        </Col>
      </Row>

      {/* Contact CTA */}
      <Row className="justify-content-center mt-5">
        <Col lg={8} className="text-center">
          <Card className="contact-cta-card">
            <Card.Body>
              <h4>Still have questions?</h4>
              <p className="text-muted mb-3">
                Our customer service team is here to help you plan the perfect hibachi experience!
              </p>
              <div className="contact-info">
                <Badge bg="success" className="me-3 p-2">
                  📞 Available 11 AM - 10 PM Daily
                </Badge>
                <Badge bg="info" className="p-2">
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
