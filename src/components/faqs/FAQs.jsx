import React, { useState, useMemo, Suspense } from 'react';
import { Accordion, Spinner, Form, InputGroup, Badge, Container, Row, Col, Card } from 'react-bootstrap';
import { Search, X } from 'react-bootstrap-icons';
import FAQCategory from './FAQCategory';
import faqData from './faqData';
import './FAQs.css';

// Helper function to extract text from React elements
const extractTextFromReactElement = (element) => {
  if (typeof element === 'string') {
    return element;
  }
  if (typeof element === 'number') {
    return element.toString();
  }
  if (React.isValidElement(element)) {
    if (element.props && element.props.children) {
      if (Array.isArray(element.props.children)) {
        return element.props.children
          .map(child => extractTextFromReactElement(child))
          .join(' ');
      }
      return extractTextFromReactElement(element.props.children);
    }
  }
  if (Array.isArray(element)) {
    return element.map(item => extractTextFromReactElement(item)).join(' ');
  }
  return '';
};

const FAQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [openCategories, setOpenCategories] = useState([]);

  // Filter FAQs based on search term
  const filteredFAQData = useMemo(() => {
    if (!searchTerm.trim()) return faqData;

    const filtered = {};
    Object.entries(faqData).forEach(([category, items]) => {
      const filteredItems = items.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        const headerMatch = item.header.toLowerCase().includes(searchLower);
        
        // Extract text content from JSX body for searching
        const bodyText = extractTextFromReactElement(item.body).toLowerCase();
        const bodyMatch = bodyText.includes(searchLower);
        
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
    setOpenCategories([]);
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchTerm(''); // Clear search when navigating to category
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
        <div className="mt-3">
          <Badge bg="success" className="px-4 py-2 fs-6">
            🌟 Premium Quality Ingredients • Reasonable Prices • Excellence is Our Priority 🌟
          </Badge>
        </div>
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
      )}

      {/* FAQ Content */}
      <Row className="justify-content-center">
        <Col lg={10}>
          {/* Back to Categories Button */}
          {activeCategory && !searchTerm && (
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
                  Clear Search & View All Categories
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
                activeKey={searchTerm ? Object.keys(filteredFAQData) : openCategories}
                onSelect={(eventKey) => {
                  if (!searchTerm && eventKey) {
                    if (openCategories.includes(eventKey)) {
                      setOpenCategories(openCategories.filter(key => key !== eventKey));
                    } else {
                      setOpenCategories([...openCategories, eventKey]);
                    }
                  }
                }}
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