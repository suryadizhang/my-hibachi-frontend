import React from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';

const proteinOptions = [
  { name: 'Chicken', description: 'Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze' },
  { name: 'Premium Angus Sirloin Steak', description: 'Premium USDA choice beef cooked to your preferred temperature' },
  { name: 'Shrimp', description: 'Fresh jumbo shrimp with garlic butter and hibachi spices' },
  { name: 'Tofu', description: 'Fried tofu with our house special seasoning - perfect vegetarian option' }
];

// Sort by price (cheapest to most expensive)
const upgradeOptions = [
  { name: 'Salmon', extra: 5, description: 'Wild-caught Atlantic salmon with teriyaki glaze' },
  { name: 'Scallops', extra: 5, description: 'Fresh sea scallops grilled to perfection' },
  { name: 'Filet Mignon', extra: 8, description: 'Premium tender beef filet' },
  { name: 'Lobster Tail', extra: 15, description: 'Fresh lobster tail with garlic butter' }
].sort((a, b) => a.extra - b.extra);

// Sort by price (cheapest to most expensive)
const additionalOptions = [
  { name: 'Yakisoba Noodles', extra: 5, description: 'Japanese style lo mein noodles' },
  { name: 'Extra Fried Rice', extra: 5, description: 'Additional portion of hibachi fried rice' },
  { name: 'Extra Vegetables', extra: 5, description: 'Additional portion of mixed seasonal vegetables' },
  { name: '3rd Protein', extra: 10, description: 'Add a third protein to your meal' }
].sort((a, b) => a.extra - b.extra);

const Menu = () => (
  <div className="menu-container">
    <div className="container">
      {/* Hero Section */}
      <div className="hero-section text-center mb-5">
        <div className="hero-content">
          <h1 className="display-2 fw-bold mb-3 d-flex align-items-center justify-content-center">
            <span className="emoji-visible" style={{ fontSize: '1.2em', marginRight: '0.75rem' }}>🍱</span>
            <span className="gradient-text">My Hibachi Menu</span>
          </h1>
          <p className="lead mb-4" style={{ fontSize: '1.4rem', color: '#2c3e50', fontWeight: 500 }}>
            ✨ Premium In-Home Hibachi Dining Experience ✨
          </p>
          <div className="hero-badges d-flex flex-wrap justify-content-center gap-3 mb-4">
            <span className="hero-badge">
              <span className="emoji-visible">👨‍🍳</span> Expert Chefs
            </span>
            <span className="hero-badge">
              <span className="emoji-visible">🎭</span> Live Entertainment
            </span>
            <span className="hero-badge">
              <span className="emoji-visible">🏠</span> Your Location
            </span>
            <span className="hero-badge">
              <span className="emoji-visible">⭐</span> Premium Quality
            </span>
          </div>
        </div>
      </div>

      <Card className="menu-card p-0 border-0 overflow-hidden">
        {/* Pricing Section */}
        <div className="pricing-section p-5 mb-0">
          <div className="text-center mb-5">
            <h2 className="mb-4 d-flex align-items-center justify-content-center gap-3" style={{ fontSize: '2.5rem', fontWeight: 700 }}>
              <span className="emoji-visible" style={{ fontSize: '1.3em' }}>💰</span>
              <span style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Transparent Pricing</span>
            </h2>
            <Alert variant="light" className="border-0 text-muted fs-5 mb-4 mx-auto" style={{ maxWidth: '600px' }}>
              Transparent rates — no hidden fees. <br />
              <strong className="text-warning">Gratuity is not included, but always appreciated for your hardworking personal chef.</strong>
            </Alert>
            <div className="pricing-notes mb-4">
              <p className="text-info fs-6 fw-medium mb-0">
                <span className="emoji-visible">🚗</span> Travel fee applied: Free first 30 miles, $2/mile after (up to 150 miles)
              </p>
            </div>
          </div>
          
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              <div className="pricing-grid">
                <div className="pricing-card adult-price">
                  <div className="pricing-icon emoji-visible">👥</div>
                  <div className="pricing-amount">$55</div>
                  <div className="pricing-label">per adult</div>
                  <div className="pricing-note">Ages 13+</div>
                </div>
                <div className="pricing-card child-price">
                  <div className="pricing-icon emoji-visible">🧒</div>
                  <div className="pricing-amount">$30</div>
                  <div className="pricing-label">per child</div>
                  <div className="pricing-note">Ages 6-12</div>
                </div>
                <div className="pricing-card free-price">
                  <div className="pricing-icon emoji-visible">👶</div>
                  <div className="pricing-amount">FREE</div>
                  <div className="pricing-label">little ones</div>
                  <div className="pricing-note">Under 5</div>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="minimum-order-card text-center">
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
              <div className="minimum-info">
                <span className="emoji-visible">🎯</span>
                <strong className="ms-2">Party Minimum: $550</strong>
              </div>
              <div className="tip-info">
                <span className="emoji-visible">💡</span>
                <em className="ms-2">Gratuity not included</em>
              </div>
            </div>
          </div>
        </div>

        {/* Included Items Section */}
        <div className="included-section p-5">
          <div className="text-center mb-5">
            <h2 className="section-title mb-4">
              <span className="emoji-visible" style={{ fontSize: '1.2em' }}>🍽️</span>
              <span className="ms-3">What's Included</span>
            </h2>
            <p className="text-muted fs-5">Every meal comes with these delicious accompaniments</p>
          </div>
          
          <Row className="mb-5">
            <Col lg={6} className="mb-4">
              <div className="included-item">
                <span className="included-icon emoji-visible">🍚</span>
                <div className="included-content">
                  <h5 className="included-title">Hibachi Fried Rice</h5>
                  <p className="included-desc">Perfectly seasoned with egg and fresh vegetables</p>
                </div>
              </div>
              <div className="included-item">
                <span className="included-icon emoji-visible">🥬</span>
                <div className="included-content">
                  <h5 className="included-title">Seasonal Vegetables</h5>
                  <p className="included-desc">Fresh zucchini, onions, and mushrooms</p>
                </div>
              </div>
              <div className="included-item">
                <span className="included-icon emoji-visible">🥗</span>
                <div className="included-content">
                  <h5 className="included-title">Garden Fresh Salad</h5>
                  <p className="included-desc">Crisp greens with signature ginger dressing</p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="included-item">
                <span className="included-icon emoji-visible">🥄</span>
                <div className="included-content">
                  <h5 className="included-title">Yum Yum Sauce</h5>
                  <p className="included-desc">Our famous signature creamy sauce</p>
                </div>
              </div>
              <div className="included-item">
                <span className="included-icon emoji-visible">🍯</span>
                <div className="included-content">
                  <h5 className="included-title">House Special Hot Sauce</h5>
                  <p className="included-desc">A bold and spicy signature blend with a flavorful kick</p>
                </div>
              </div>
              <div className="included-item">
                <span className="included-icon emoji-visible">🎪</span>
                <div className="included-content">
                  <h5 className="included-title">Chef Entertainment</h5>
                  <p className="included-desc">Amazing tricks and interactive cooking show</p>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="protein-selection-banner">
            <div className="banner-content">
              <h3 className="banner-title">
                <span className="emoji-visible">🥩</span>
                Choose Any 2 Proteins Below
                <span className="emoji-visible">🥩</span>
              </h3>
              <p className="banner-subtitle">Mix and match for the perfect combination</p>
            </div>
          </div>
        </div>

        {/* Protein Options and Premium Upgrades */}
        <div className="proteins-section p-5">
          <Row className="mb-5">
            <Col lg={6} className="mb-4">
              <div className="protein-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="emoji-visible">🥩</span>
                    Protein Options
                  </h3>
                  <div className="included-badge">
                    <span className="emoji-visible">✅</span>
                    Choose Any 2 - Included
                  </div>
                </div>
                <div className="card-body">
                  {proteinOptions.map((protein, index) => (
                    <div key={protein.name} className="protein-item" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="protein-content">
                        <h5 className="protein-name">{protein.name}</h5>
                        <p className="protein-desc">{protein.description}</p>
                      </div>
                      <div className="protein-check">
                        <span className="emoji-visible">✨</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg={6} className="mb-4">
              <div className="upgrade-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="emoji-visible">⭐</span>
                    Premium Upgrades
                  </h3>
                  <div className="upgrade-badge">
                    <span className="emoji-visible">💎</span>
                    Replace Any Protein
                  </div>
                </div>
                <div className="card-body">
                  {upgradeOptions.map((upgrade, index) => (
                    <div key={upgrade.name} className="upgrade-item" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="upgrade-content">
                        <h5 className="upgrade-name">{upgrade.name}</h5>
                        <p className="upgrade-desc">{upgrade.description}</p>
                      </div>
                      <div className="upgrade-price">
                        <span className="price-tag">+${upgrade.extra}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Additional Options */}
        <div className="additional-section p-5">
          <div className="text-center mb-5">
            <h2 className="section-title mb-4">
              <span className="emoji-visible" style={{ fontSize: '1.2em' }}>🍜</span>
              <span className="ms-3">Additional Options</span>
            </h2>
            <p className="text-muted fs-5">Enhance your experience with these extras</p>
          </div>
          
          <Row>
            <Col lg={12}>
              <div className="additional-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="emoji-visible">✨</span>
                    Enhancement Options
                  </h3>
                  <div className="additional-badge">
                    <span className="emoji-visible">➕</span>
                    Add to Your Experience
                  </div>
                </div>
                <div className="card-body">
                  <Row>
                    {additionalOptions.map((option, index) => (
                      <Col lg={6} key={option.name} className="mb-3">
                        <div className="additional-item-card" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="additional-content">
                            <h5 className="additional-name">{option.name}</h5>
                            <p className="additional-desc">{option.description}</p>
                          </div>
                          <div className="additional-price">
                            <span className="add-price-tag">+${option.extra}</span>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Call to Action */}
        <div className="cta-section text-center p-5">
          <div className="cta-content">
            <h2 className="cta-title mb-4">
              Ready for an Unforgettable Experience?
            </h2>
            <p className="cta-subtitle mb-5">
              Book your premium hibachi experience today and create memories that will last a lifetime
            </p>
            
            <Link to="/services" aria-label="Order your hibachi experience now">
              <button className="cta-button">
                <span className="emoji-visible">🍽️</span>
                <span className="cta-text">Order Your Hibachi Experience</span>
                <span className="emoji-visible">🍽️</span>
              </button>
            </Link>
            
            <div className="cta-features mt-4">
              <div className="feature-item">
                <span className="emoji-visible">👨‍🍳</span>
                <span>Professional Chef</span>
              </div>
              <div className="feature-item">
                <span className="emoji-visible">🎭</span>
                <span>Live Entertainment</span>
              </div>
              <div className="feature-item">
                <span className="emoji-visible">💯</span>
                <span>Satisfaction Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

export default Menu;
