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

  // Enhanced FAQ with breadcrumb schema
  const enhancedStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "name": "Frequently Asked Questions - My Hibachi Chef",
      "description": "Common questions and answers about private hibachi chef services for backyard parties and outdoor events",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does My Hibachi Chef provide for events?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide a professional hibachi chef, all cooking equipment, fresh ingredients, hibachi grill setup, and complete cleanup service. Everything needed for an authentic hibachi dining experience at your location."
          }
        },
        {
          "@type": "Question",
          "name": "What areas do you serve?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We provide private hibachi chef services throughout San Jose, San Francisco, Sacramento, Bay Area, and surrounding areas in Northern California. We can cook at your backyard, beachside, park, vineyard, winery, or any location you prefer. Contact us to confirm service availability for your specific location."
          }
        },
        {
          "@type": "Question",
          "name": "How much does hibachi catering cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pricing varies based on menu selections, number of guests, location, and event requirements. Contact us for a personalized quote based on your specific needs and preferences."
          }
        },
        {
          "@type": "Question",
          "name": "How far in advance should I book?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We recommend booking at least 2-3 weeks in advance to ensure availability, especially for weekend events and holidays. However, we may accommodate last-minute bookings based on our schedule."
          }
        }
      ]
    },
    faqSchema,
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://myhibachichef.com"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": "FAQ",
          "item": "https://myhibachichef.com/faqs"
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "How to Book a Private Hibachi Chef in Bay Area",
      "description": "Step-by-step guide to booking mobile hibachi catering for your event",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Choose Your Date",
          "text": "Select your preferred date and time for the hibachi experience"
        },
        {
          "@type": "HowToStep", 
          "name": "Select Menu",
          "text": "Choose from our premium hibachi menu options including steak, shrimp, and chicken"
        },
        {
          "@type": "HowToStep",
          "name": "Confirm Location",
          "text": "Provide your backyard, venue, or outdoor location details"
        }
      ]
    }
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