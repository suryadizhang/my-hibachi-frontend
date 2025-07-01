import React from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Menu.css';
import SEO from './SEO';

const proteinOptions = [
  { name: 'Chicken', description: 'Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze' },
  { name: 'Premium Angus Sirloin Steak', description: 'Premium Angus Sirloin steak cooked to your preferred temperature' },
  { name: 'Shrimp', description: 'Fresh jumbo shrimp with garlic butter and hibachi spices' },
  { name: 'Calamari', description: 'Fresh tender calamari grilled with garlic and hibachi spices' },
  { name: 'Tofu', description: 'Fried tofu with our house special seasoning - perfect vegetarian option' }
];

// Sort by price (cheapest to most expensive)
const upgradeOptions = [
  { name: 'Salmon', extra: 5, description: 'Wild-caught Atlantic salmon with teriyaki glaze' },
  { name: 'Scallops', extra: 5, description: 'Fresh sea scallops grilled to perfection' },
  { name: 'Filet Mignon', extra: 5, description: 'Premium tender beef filet' },
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
    <SEO
      title="Mobile Hibachi Chef Menu | Premium Steak Shrimp Chicken | All-Inclusive Bay Area Service"
      description="Complete hibachi menu for your private party! Our mobile hibachi chef brings everything - grill, ingredients, live cooking show with flame tricks. Premium Angus steak, jumbo shrimp, organic chicken, and vegetarian options. Perfect for backyard hibachi parties in San Jose, Bay Area, Sacramento."
      keywords="mobile hibachi chef menu, hibachi menu with steak shrimp chicken, all-inclusive hibachi catering, chef brings grill and ingredients, premium hibachi menu Bay Area, backyard hibachi party menu, San Jose hibachi catering menu, private chef menu Northern California, hibachi birthday party menu, corporate hibachi menu"
      url="/menu"
      structuredData={{
        "@context": "https://schema.org",
        "@type": "Menu",
        "name": "My Hibachi Chef Menu",
        "description": "Authentic Japanese hibachi cuisine menu featuring premium proteins and fresh ingredients",
        "provider": {
          "@type": "Restaurant",
          "name": "My Hibachi Chef",
          "url": "https://myhibachichef.com"
        },
        "hasMenuItem": [
          {
            "@type": "MenuItem",
            "name": "Premium Angus Sirloin Steak",
            "description": "Premium Angus Sirloin steak cooked to your preferred temperature",
            "menuAddOn": {
              "@type": "MenuItemOption",
              "value": "Included in base price"
            }
          },
          {
            "@type": "MenuItem", 
            "name": "Chicken Hibachi",
            "description": "Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze"
          },
          {
            "@type": "MenuItem",
            "name": "Hibachi Shrimp",
            "description": "Fresh jumbo shrimp with garlic butter and hibachi spices"
          },
          {
            "@type": "MenuItem",
            "name": "Filet Mignon Upgrade",
            "description": "Premium tender beef filet",
            "offers": {
              "@type": "Offer",
              "price": "+5",
              "priceCurrency": "USD"
            }
          },
          {
            "@type": "MenuItem",
            "name": "Lobster Tail Upgrade", 
            "description": "Fresh lobster tail with garlic butter",
            "offers": {
              "@type": "Offer",
              "price": "+15",
              "priceCurrency": "USD"
            }
          }
        ],
        "inLanguage": "en-US"
      }}
    />
    <Container fluid className="px-lg-5">
      {/* Enhanced Hero Section */}
      <div className="hero-section text-center mb-5">
        <div className="hero-content">
          <div className="hero-icon-wrapper mb-4">
            <span className="hero-main-icon emoji-visible">🍱</span>
          </div>
          <h1 className="display-1 fw-bold mb-4">
            <span className="gradient-text">My Hibachi Menu</span>
          </h1>
          <p className="hero-subtitle mb-5">
            <span className="emoji-visible">✨</span>
            Premium In-Home Hibachi Dining Experience
            <span className="emoji-visible">✨</span>
          </p>
          
          {/* Enhanced feature badges with better spacing */}
          <div className="hero-features-grid mb-5">
            <div className="feature-badge">
              <span className="feature-icon emoji-visible">👨‍🍳</span>
              <span className="feature-text">Expert Chefs</span>
            </div>
            <div className="feature-badge">
              <span className="feature-icon emoji-visible">🎭</span>
              <span className="feature-text">Live Entertainment</span>
            </div>
            <div className="feature-badge">
              <span className="feature-icon emoji-visible">🏠</span>
              <span className="feature-text">Your Location</span>
            </div>
            <div className="feature-badge">
              <span className="feature-icon emoji-visible">⭐</span>
              <span className="feature-text">Premium Quality</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="menu-card p-0 border-0 overflow-hidden">
        {/* Enhanced Pricing Section */}
        <div className="pricing-section p-5 mb-0">
          <div className="text-center mb-5">
            <div className="section-header">
              <h2 className="section-title mb-4">
                <span className="emoji-visible">💰</span>
                <span>Transparent Pricing</span>
              </h2>
              <p className="section-subtitle">No hidden fees, just great value</p>
            </div>
            
            <div className="pricing-info-card mb-5">
              <div className="info-highlight">
                <span className="emoji-visible">✨</span>
                <span>Transparent rates — no hidden fees</span>
              </div>
              <div className="gratuity-note">
                <span className="emoji-visible">💝</span>
                <span><strong>Gratuity is not included</strong>, but always appreciated for your hardworking personal chef</span>
              </div>
              <div className="travel-info">
                <span className="emoji-visible">🚗</span>
                <span>Travel fee: Free first 30 miles, $2/mile after (up to 150 miles)</span>
              </div>
            </div>
          </div>
          
          <Row className="justify-content-center mb-5">
            <Col lg={12}>
              <div className="pricing-cards-wrapper">
                <div className="pricing-card adult-price">
                  <div className="card-header-accent"></div>
                  <div className="pricing-icon emoji-visible">👥</div>
                  <div className="pricing-amount">$55</div>
                  <div className="pricing-label">per adult</div>
                  <div className="pricing-note">Ages 13+</div>
                  <div className="card-features">
                    <div className="feature">Full hibachi experience</div>
                    <div className="feature">2 protein choices</div>
                    <div className="feature">All sides included</div>
                  </div>
                </div>
                
                <div className="pricing-card child-price">
                  <div className="card-header-accent"></div>
                  <div className="pricing-icon emoji-visible">🧒</div>
                  <div className="pricing-amount">$30</div>
                  <div className="pricing-label">per child</div>
                  <div className="pricing-note">Ages 6-12</div>
                  <div className="card-features">
                    <div className="feature">Kid-friendly portions</div>
                    <div className="feature">1 protein choice</div>
                    <div className="feature">Interactive experience</div>
                  </div>
                </div>
                
                <div className="pricing-card free-price">
                  <div className="card-header-accent"></div>
                  <div className="pricing-icon emoji-visible">👶</div>
                  <div className="pricing-amount">FREE</div>
                  <div className="pricing-label">little ones</div>
                  <div className="pricing-note">Under 5</div>
                  <div className="card-features">
                    <div className="feature">Complimentary meal</div>
                    <div className="feature">Small portions</div>
                    <div className="feature">Entertainment included</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          <div className="pricing-footer">
            <div className="minimum-order-banner">
              <div className="banner-content-flex">
                <div className="minimum-info">
                  <span className="info-icon emoji-visible">🎯</span>
                  <div className="info-text">
                    <strong>Party Minimum: $550</strong>
                    <small>Approximately 10 adults</small>
                  </div>
                </div>
                <div className="tip-info">
                  <span className="info-icon emoji-visible">💡</span>
                  <div className="info-text">
                    <strong>Gratuity Guidelines</strong>
                    <small>20-35% based on your satisfaction</small>
                  </div>
                </div>
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
                  <p className="included-desc">Fresh zucchini, carrots, onions, mushrooms, and broccoli</p>
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

        {/* Enhanced Call to Action */}
        <div className="cta-section text-center p-5">
          <div className="cta-content-wrapper">
            <div className="cta-background-pattern"></div>
            
            {/* CTA Header */}
            <div className="cta-header mb-5">
              <div className="cta-icon-group mb-4">
                <span className="cta-icon emoji-visible">🍽️</span>
                <span className="cta-icon emoji-visible">🎉</span>
                <span className="cta-icon emoji-visible">👨‍🍳</span>
              </div>
              <h2 className="cta-main-title">
                Ready for an Unforgettable Experience?
              </h2>
              <p className="cta-main-subtitle">
                Book your premium hibachi experience today and create memories that will last a lifetime
              </p>
            </div>
            
            {/* Main CTA Button */}
            <div className="cta-button-wrapper mb-5">
              <Link to="/BookUs" aria-label="Order your hibachi experience now" className="cta-link">
                <button className="cta-main-button">
                  <span className="button-icon emoji-visible">🍽️</span>
                  <span className="button-text">Order Your Hibachi Experience</span>
                  <span className="button-icon emoji-visible">🍽️</span>
                  <div className="button-shimmer"></div>
                </button>
              </Link>
              
              {/* Secondary actions */}
              <div className="secondary-actions mt-4">
                <div className="action-item">
                  <span className="emoji-visible">📞</span>
                  <span>Call for custom packages</span>
                </div>
                <div className="action-divider">•</div>
                <div className="action-item">
                  <span className="emoji-visible">💬</span>
                  <span>Ask about group discounts</span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Feature Highlights */}
            <div className="cta-features-section">
              <h3 className="features-title mb-4">Why Choose My Hibachi?</h3>
              <div className="cta-features-grid">
                <div className="cta-feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon emoji-visible">👨‍🍳</span>
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">Professional Chef</h4>
                    <p className="feature-description">Expertly trained hibachi chefs with 8+ years of professional experience</p>
                  </div>
                </div>
                
                <div className="cta-feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon emoji-visible">🎭</span>
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">Live Entertainment</h4>
                    <p className="feature-description">Amazing tricks, flips, and interactive cooking show</p>
                  </div>
                </div>
                
                <div className="cta-feature-card">
                  <div className="feature-icon-wrapper">
                    <span className="feature-icon emoji-visible">🎯</span>
                  </div>
                  <div className="feature-content">
                    <h4 className="feature-title">Personalized Service</h4>
                    <p className="feature-description">Customized experience tailored to your preferences</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Container>
  </div>
);

export default Menu;
