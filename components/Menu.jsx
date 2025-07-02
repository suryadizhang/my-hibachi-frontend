import React from 'react';
import { Card, Row, Col, Badge, ListGroup, Alert, Container } from 'react-bootstrap';
import Link from 'next/link';
import './Menu.css';

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
    <Container fluid className="px-lg-5">
      {/* Enhanced Hero Section with Better Flow */}
      <div className="hero-section text-center mb-5">
        <div className="hero-content">
          <div className="hero-icon-wrapper mb-4">
            <div className="floating-icons">
              <span className="hero-main-icon emoji-visible">🍱</span>
              <span className="floating-icon emoji-visible" style={{animationDelay: '0s'}}>🔥</span>
              <span className="floating-icon emoji-visible" style={{animationDelay: '1s'}}>🥢</span>
              <span className="floating-icon emoji-visible" style={{animationDelay: '2s'}}>🍤</span>
              <span className="floating-icon emoji-visible" style={{animationDelay: '3s'}}>🥩</span>
            </div>
          </div>
          <h1 className="display-1 fw-bold mb-4">
            <span className="gradient-text">Premium Hibachi Menu</span>
          </h1>
          <p className="hero-subtitle mb-4">
            <span className="emoji-visible">✨</span>
            Experience authentic Japanese hibachi dining in the comfort of your home
            <span className="emoji-visible">✨</span>
          </p>
          
          {/* Enhanced Value Proposition */}
          <div className="value-proposition mb-5">
            <div className="value-item">
              <span className="value-icon emoji-visible">🚚</span>
              <span className="value-text">We Come to You</span>
            </div>
            <div className="value-divider">•</div>
            <div className="value-item">
              <span className="value-icon emoji-visible">👨‍🍳</span>
              <span className="value-text">Professional Chef</span>
            </div>
            <div className="value-divider">•</div>
            <div className="value-item">
              <span className="value-icon emoji-visible">🎭</span>
              <span className="value-text">Live Entertainment</span>
            </div>
          </div>
          
          {/* Enhanced feature badges with better animations */}
          <div className="hero-features-grid mb-5">
            <div className="feature-badge modern-feature-badge" style={{animationDelay: '0.2s'}}>
              <div className="feature-icon-bg">
                <span className="feature-icon emoji-visible">⭐</span>
              </div>
              <div className="feature-content">
                <span className="feature-title">Premium Quality</span>
                <span className="feature-subtitle">Fresh ingredients</span>
              </div>
            </div>
            <div className="feature-badge modern-feature-badge" style={{animationDelay: '0.4s'}}>
              <div className="feature-icon-bg">
                <span className="feature-icon emoji-visible">�</span>
              </div>
              <div className="feature-content">
                <span className="feature-title">Your Location</span>
                <span className="feature-subtitle">Full setup included</span>
              </div>
            </div>
            <div className="feature-badge modern-feature-badge" style={{animationDelay: '0.6s'}}>
              <div className="feature-icon-bg">
                <span className="feature-icon emoji-visible">�</span>
              </div>
              <div className="feature-content">
                <span className="feature-title">Custom Experience</span>
                <span className="feature-subtitle">Tailored to you</span>
              </div>
            </div>
            <div className="feature-badge modern-feature-badge" style={{animationDelay: '0.8s'}}>
              <div className="feature-icon-bg">
                <span className="feature-icon emoji-visible">💎</span>
              </div>
              <div className="feature-content">
                <span className="feature-title">Luxury Service</span>
                <span className="feature-subtitle">8+ years experience</span>
              </div>
            </div>
          </div>
          
          {/* Quick stats redesigned */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">8+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">⭐⭐⭐⭐⭐</span>
              <span className="stat-label">5 Star Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modernized Pricing Section - Moved up for better flow */}
      <Card className="menu-card p-0 border-0 overflow-hidden mb-5">
        <div className="pricing-section p-5 mb-0">
          <div className="text-center mb-5">
            <div className="section-header animated-section">
              <div className="section-icon-wrapper mb-3">
                <span className="section-icon emoji-visible">💰</span>
              </div>
              <h2 className="section-title mb-4">
                <span>Transparent Pricing</span>
              </h2>
              <p className="section-subtitle">Premium experience, honest pricing — no hidden fees</p>
            </div>
          </div>
          
          {/* Enhanced pricing cards with animations */}
          <Row className="justify-content-center mb-5">
            <Col lg={12}>
              <div className="pricing-cards-container">
                <div className="pricing-card modern-card adult-price" data-price="adult">
                  <div className="card-glow"></div>
                  <div className="card-header-accent"></div>
                  <div className="pricing-icon-container">
                    <span className="pricing-icon emoji-visible">�‍👩‍👧‍👦</span>
                  </div>
                  <div className="pricing-amount">$55</div>
                  <div className="pricing-label">per adult</div>
                  <div className="pricing-note">Ages 13+</div>
                  <div className="card-features">
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Full hibachi experience</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>2 protein choices</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>All sides included</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Chef entertainment</span>
                    </div>
                  </div>
                </div>
                
                <div className="pricing-card modern-card child-price" data-price="child">
                  <div className="card-glow"></div>
                  <div className="card-header-accent"></div>
                  <div className="pricing-icon-container">
                    <span className="pricing-icon emoji-visible">🧒</span>
                  </div>
                  <div className="pricing-amount">$30</div>
                  <div className="pricing-label">per child</div>
                  <div className="pricing-note">Ages 6-12</div>
                  <div className="card-features">
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Kid-friendly portions</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>1 protein choice</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Interactive experience</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>All sides included</span>
                    </div>
                  </div>
                </div>
                
                <div className="pricing-card modern-card free-price featured-card" data-price="free">
                  <div className="featured-badge">
                    <span>Most Popular</span>
                  </div>
                  <div className="card-glow"></div>
                  <div className="card-header-accent"></div>
                  <div className="pricing-icon-container">
                    <span className="pricing-icon emoji-visible">👶</span>
                  </div>
                  <div className="pricing-amount">FREE</div>
                  <div className="pricing-label">little ones</div>
                  <div className="pricing-note">Under 5</div>
                  <div className="card-features">
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Complimentary meal</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Small portions</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Entertainment included</span>
                    </div>
                    <div className="feature">
                      <span className="feature-check">✓</span>
                      <span>Parents' peace of mind</span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Enhanced info banners */}
          <div className="pricing-footer">
            <div className="info-cards-grid">
              <div className="info-card">
                <div className="info-icon">
                  <span className="emoji-visible">🎯</span>
                </div>
                <div className="info-content">
                  <h5>Party Minimum</h5>
                  <p>$550 total order (≈ 10 adults)</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <span className="emoji-visible">💡</span>
                </div>
                <div className="info-content">
                  <h5>Gratuity Guide</h5>
                  <p>20-35% based on satisfaction</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <span className="emoji-visible">�</span>
                </div>
                <div className="info-content">
                  <h5>Travel Policy</h5>
                  <p>Free 30 mi, $2/mi after</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* What's Included Section - Moved up for better flow */}
      <Card className="menu-card p-0 border-0 overflow-hidden mb-5">
        <div className="included-section p-5">
          <div className="text-center mb-5">
            <div className="section-header animated-section">
              <div className="section-icon-wrapper mb-3">
                <span className="section-icon emoji-visible">🍽️</span>
              </div>
              <h2 className="section-title mb-4">Complete Hibachi Experience</h2>
              <p className="section-subtitle">Every booking includes these delicious accompaniments & entertainment</p>
            </div>
          </div>
          
          <div className="included-items-grid mb-5">
            <div className="included-item modern-item enhanced-item" style={{animationDelay: '0.1s'}}>
              <div className="item-icon-wrapper">
                <span className="included-icon emoji-visible">🍚</span>
              </div>
              <div className="included-content">
                <h5 className="included-title">Hibachi Fried Rice</h5>
                <p className="included-desc">Perfectly seasoned with fresh eggs and mixed vegetables</p>
                <div className="included-badge">Signature Recipe</div>
              </div>
            </div>
            
            <div className="included-item modern-item enhanced-item" style={{animationDelay: '0.2s'}}>
              <div className="item-icon-wrapper">
                <span className="included-icon emoji-visible">🥬</span>
              </div>
              <div className="included-content">
                <h5 className="included-title">Fresh Seasonal Vegetables</h5>
                <p className="included-desc">Zucchini, carrots, onions, mushrooms, and broccoli</p>
                <div className="included-badge">Farm Fresh</div>
              </div>
            </div>
            
            <div className="included-item modern-item enhanced-item" style={{animationDelay: '0.3s'}}>
              <div className="item-icon-wrapper">
                <span className="included-icon emoji-visible">🥗</span>
              </div>
              <div className="included-content">
                <h5 className="included-title">Garden Fresh Salad</h5>
                <p className="included-desc">Crisp greens with our signature ginger dressing</p>
                <div className="included-badge">House Special</div>
              </div>
            </div>
            
            <div className="included-item modern-item enhanced-item" style={{animationDelay: '0.4s'}}>
              <div className="item-icon-wrapper">
                <span className="included-icon emoji-visible">🥄</span>
              </div>
              <div className="included-content">
                <h5 className="included-title">Famous Yum Yum Sauce</h5>
                <p className="included-desc">Our legendary creamy signature sauce</p>
                <div className="included-badge">Customer Favorite</div>
              </div>
            </div>
            
            <div className="included-item modern-item enhanced-item" style={{animationDelay: '0.5s'}}>
              <div className="item-icon-wrapper">
                <span className="included-icon emoji-visible">�️</span>
              </div>
              <div className="included-content">
                <h5 className="included-title">House Special Hot Sauce</h5>
                <p className="included-desc">Bold and spicy signature blend with perfect heat</p>
                <div className="included-badge">Chef's Special</div>
              </div>
            </div>
            
            <div className="included-item modern-item enhanced-item" style={{animationDelay: '0.6s'}}>
              <div className="item-icon-wrapper">
                <span className="included-icon emoji-visible">🎪</span>
              </div>
              <div className="included-content">
                <h5 className="included-title">Live Chef Entertainment</h5>
                <p className="included-desc">Amazing tricks, flips, and interactive cooking show</p>
                <div className="included-badge">Unforgettable</div>
              </div>
            </div>
          </div>
          
          <div className="protein-selection-banner modern-banner enhanced-banner">
            <div className="banner-content">
              <div className="banner-icon">
                <span className="emoji-visible">🥩</span>
              </div>
              <div className="banner-text">
                <h3 className="banner-title">Choose Any 2 Proteins From Below</h3>
                <p className="banner-subtitle">Mix and match for the perfect combination that suits your taste</p>
              </div>
              <div className="banner-decoration">
                <span className="emoji-visible">🍤</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

        {/* Enhanced Protein Options and Premium Upgrades - Better Layout */}
        <Card className="menu-card p-0 border-0 overflow-hidden mb-5">
          <div className="proteins-section p-5">
            <div className="text-center mb-5">
              <div className="section-header animated-section">
                <div className="section-icon-wrapper mb-3">
                  <span className="section-icon emoji-visible">🥩</span>
                </div>
                <h2 className="section-title mb-4">Protein Selection</h2>
                <p className="section-subtitle">Choose your perfect combination from our premium selection</p>
              </div>
            </div>
            
            <Row className="mb-5">
              <Col lg={6} className="mb-4">
                <div className="protein-card modern-card enhanced-protein-card">
                  <div className="card-glow"></div>
                  <div className="card-header enhanced-header">
                    <div className="card-icon-wrapper">
                      <span className="card-icon emoji-visible">✅</span>
                    </div>
                    <div className="header-content">
                      <h3 className="card-title">Base Protein Options</h3>
                      <p className="card-subtitle">Choose any 2 - Included in every meal</p>
                    </div>
                    <div className="included-badge pulse-badge">
                      <span className="emoji-visible">🆓</span>
                      Included
                    </div>
                  </div>
                  <div className="card-body enhanced-body">
                    {proteinOptions.map((protein, index) => (
                      <div key={protein.name} className="protein-item modern-protein-item enhanced-protein-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="protein-content">
                          <div className="protein-header">
                            <h5 className="protein-name">{protein.name}</h5>
                            <div className="protein-sparkle">
                              <span className="emoji-visible">✨</span>
                            </div>
                          </div>
                          <p className="protein-desc">{protein.description}</p>
                          <div className="protein-features">
                            <span className="feature-tag">Fresh Daily</span>
                            <span className="feature-tag">Chef's Choice</span>
                          </div>
                        </div>
                        <div className="protein-check">
                          <div className="check-circle">
                            <span className="check-icon">✓</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              
              <Col lg={6} className="mb-4">
                <div className="upgrade-card modern-card featured-upgrade enhanced-upgrade-card">
                  <div className="card-glow premium-glow"></div>
                  <div className="card-header enhanced-header premium-header">
                    <div className="card-icon-wrapper premium-icon">
                      <span className="card-icon emoji-visible">⭐</span>
                    </div>
                    <div className="header-content">
                      <h3 className="card-title">Premium Upgrades</h3>
                      <p className="card-subtitle">Replace any protein with these premium options</p>
                    </div>
                    <div className="upgrade-badge premium-badge">
                      <span className="emoji-visible">💎</span>
                      Premium
                    </div>
                  </div>
                  <div className="card-body enhanced-body">
                    {upgradeOptions.map((upgrade, index) => (
                      <div key={upgrade.name} className="upgrade-item modern-upgrade-item enhanced-upgrade-item" style={{ animationDelay: `${index * 0.1}s` }}>
                        <div className="upgrade-content">
                          <div className="upgrade-header">
                            <h5 className="upgrade-name">{upgrade.name}</h5>
                            {upgrade.extra === 15 && (
                              <div className="luxury-badge">
                                <span className="emoji-visible">👑</span>
                                <span>Luxury</span>
                              </div>
                            )}
                            {upgrade.extra === 5 && (
                              <div className="popular-badge">
                                <span className="emoji-visible">🔥</span>
                                <span>Popular</span>
                              </div>
                            )}
                          </div>
                          <p className="upgrade-desc">{upgrade.description}</p>
                          <div className="upgrade-features">
                            <span className="feature-tag premium-tag">Premium Quality</span>
                            <span className="feature-tag premium-tag">Fresh Daily</span>
                          </div>
                        </div>
                        <div className="upgrade-price">
                          <div className="price-circle enhanced-price-circle">
                            <span className="price-tag">+${upgrade.extra}</span>
                            <span className="price-label">per person</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Card>

        {/* Modern Additional Options */}
        <Card className="menu-card p-0 border-0 overflow-hidden mb-5">
          <div className="additional-section p-5">
            <div className="text-center mb-5">
              <div className="section-header animated-section">
                <div className="section-icon-wrapper mb-3">
                  <span className="section-icon emoji-visible">🍜</span>
                </div>
                <h2 className="section-title mb-4">Additional Enhancements</h2>
                <p className="section-subtitle">Take your hibachi experience to the next level</p>
              </div>
            </div>
            
            <div className="additional-items-grid">
              {additionalOptions.map((option, index) => (
                <div key={option.name} className="additional-item-card modern-additional-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="additional-content">
                    <div className="additional-icon-wrapper">
                      <span className="additional-icon emoji-visible">🍜</span>
                    </div>
                    <h5 className="additional-name">{option.name}</h5>
                    <p className="additional-desc">{option.description}</p>
                  </div>
                  <div className="additional-price">
                    <div className="add-price-circle">
                      <span className="add-price-tag">+${option.extra}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Enhanced Call to Action */}
        <Card className="menu-card p-0 border-0 overflow-hidden">
          <div className="cta-section text-center p-5">
            <div className="cta-content-wrapper">
              <div className="cta-background-pattern"></div>
              
              {/* CTA Header */}
              <div className="cta-header mb-5">
                <div className="cta-icon-group mb-4">
                  <span className="cta-icon emoji-visible floating-cta-icon" style={{animationDelay: '0s'}}>🍽️</span>
                  <span className="cta-icon emoji-visible floating-cta-icon" style={{animationDelay: '0.5s'}}>🎉</span>
                  <span className="cta-icon emoji-visible floating-cta-icon" style={{animationDelay: '1s'}}>👨‍🍳</span>
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
                <Link href="/BookUs" aria-label="Order your hibachi experience now" className="cta-link">
                  <button className="cta-main-button modern-cta-button">
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
                  <div className="cta-feature-card modern-feature-card" style={{animationDelay: '0.2s'}}>
                    <div className="feature-icon-wrapper">
                      <span className="feature-icon emoji-visible">👨‍🍳</span>
                    </div>
                    <div className="feature-content">
                      <h4 className="feature-title">Professional Chef</h4>
                      <p className="feature-description">Expertly trained hibachi chefs with 8+ years of professional experience</p>
                    </div>
                  </div>
                  
                  <div className="cta-feature-card modern-feature-card" style={{animationDelay: '0.4s'}}>
                    <div className="feature-icon-wrapper">
                      <span className="feature-icon emoji-visible">🎭</span>
                    </div>
                    <div className="feature-content">
                      <h4 className="feature-title">Live Entertainment</h4>
                      <p className="feature-description">Amazing tricks, flips, and interactive cooking show</p>
                    </div>
                  </div>
                  
                  <div className="cta-feature-card modern-feature-card" style={{animationDelay: '0.6s'}}>
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
