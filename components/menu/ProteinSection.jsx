import React, { memo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { proteinOptions, upgradeOptions } from './menuData';

const ProteinSection = memo(() => {
  return (
    <div className="protein-section p-5">
      <div className="text-center mb-5">
        <h2 className="section-title mb-4">
          <span className="emoji-visible" style={{ fontSize: '1.2em' }}>🥩</span>
          <span className="ms-3">Choose Your Proteins</span>
        </h2>
        <p className="text-muted fs-5">Select 2 proteins per person - fresh, premium quality guaranteed</p>
      </div>
      
      <Row className="mb-5">
        <Col lg={6} className="mb-4">
          <div className="protein-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="emoji-visible">🍗</span>
                Included Proteins
              </h3>
              <div className="protein-badge">
                <span className="emoji-visible">✨</span>
                Choose Any 2
              </div>
            </div>
            <div className="card-body">
              {proteinOptions.map((protein, index) => (
                <div 
                  key={protein.name} 
                  className={`protein-item ${protein.popular ? 'popular' : ''} ${protein.premium ? 'premium' : ''} ${protein.vegetarian ? 'vegetarian' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="protein-content">
                    <div className="protein-header">
                      <span className="protein-icon emoji-visible">{protein.icon}</span>
                      <h5 className="protein-name">{protein.name}</h5>
                      {protein.popular && <span className="protein-label popular-label">Popular</span>}
                      {protein.premium && <span className="protein-label premium-label">Premium</span>}
                      {protein.vegetarian && <span className="protein-label vegetarian-label">Vegetarian</span>}
                    </div>
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
                <div 
                  key={upgrade.name} 
                  className={`upgrade-item ${upgrade.premium ? 'premium' : ''} ${upgrade.luxury ? 'luxury' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="upgrade-content">
                    <div className="upgrade-header">
                      <span className="upgrade-icon emoji-visible">{upgrade.icon}</span>
                      <h5 className="upgrade-name">{upgrade.name}</h5>
                      {upgrade.premium && <span className="upgrade-label premium-label">Premium</span>}
                      {upgrade.luxury && <span className="upgrade-label luxury-label">Luxury</span>}
                    </div>
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
  );
});

ProteinSection.displayName = 'ProteinSection';
export default ProteinSection;
