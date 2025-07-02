import React, { memo, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { pricingInfo } from './menuData';

const PricingSection = memo(() => {
  const pricingCards = useMemo(() => [
    {
      size: '6-8 People',
      price: 6 * pricingInfo.basePrice,
      description: 'Perfect for small gatherings',
      icon: '👨‍👩‍👧‍👦',
      popular: false
    },
    {
      size: '10-12 People',
      price: 10 * pricingInfo.basePrice,
      description: 'Ideal for family celebrations',
      icon: '🎉',
      popular: true
    },
    {
      size: '15+ People',
      price: 15 * pricingInfo.basePrice,
      description: 'Great for large events',
      icon: '🎊',
      popular: false
    }
  ], []);

  return (
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
            <span>
              <strong>Gratuity is not included</strong>, but always appreciated for your hardworking personal chef
            </span>
          </div>
          <div className="travel-info">
            <span className="emoji-visible">🚗</span>
            <span>
              Travel fee: Free first {pricingInfo.travelFee.freeDistance} miles, 
              ${pricingInfo.travelFee.ratePerMile}/mile after (up to {pricingInfo.travelFee.maxDistance} miles)
            </span>
          </div>
        </div>
      </div>
      
      <Row className="justify-content-center mb-5">
        <Col lg={12}>
          <div className="pricing-cards-wrapper">
            <Row className="g-4">
              {pricingCards.map((card, index) => (
                <Col key={card.size} md={4} className="pricing-card-col">
                  <div className={`pricing-card ${card.popular ? 'popular' : ''}`}>
                    {card.popular && (
                      <div className="popular-badge">
                        <span className="emoji-visible">⭐</span>
                        Most Popular
                      </div>
                    )}
                    <div className="pricing-card-icon">
                      <span className="emoji-visible">{card.icon}</span>
                    </div>
                    <h3 className="pricing-card-size">{card.size}</h3>
                    <div className="pricing-card-price">
                      <span className="price-amount">${card.price}</span>
                      <span className="price-unit">starting</span>
                    </div>
                    <p className="pricing-card-desc">{card.description}</p>
                    <div className="pricing-details">
                      <div className="detail-item">
                        <span className="emoji-visible">🍽️</span>
                        <span>${pricingInfo.basePrice} per person</span>
                      </div>
                      <div className="detail-item">
                        <span className="emoji-visible">👨‍🍳</span>
                        <span>Professional chef included</span>
                      </div>
                      <div className="detail-item">
                        <span className="emoji-visible">🎭</span>
                        <span>Live cooking show</span>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>

      {/* Additional pricing info */}
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="pricing-additional-info">
            <div className="tip-examples">
              <div className="tip-info">
                <span className="info-icon emoji-visible">🎯</span>
                <div className="info-text">
                  <strong>Example: $300 service</strong>
                  <small>Approximately 10 adults</small>
                </div>
              </div>
              <div className="tip-info">
                <span className="info-icon emoji-visible">💡</span>
                <div className="info-text">
                  <strong>Gratuity Guidelines</strong>
                  <small>{pricingInfo.gratuityRange}% based on your satisfaction</small>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

PricingSection.displayName = 'PricingSection';
export default PricingSection;
