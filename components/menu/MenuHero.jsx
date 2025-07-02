import React, { memo } from 'react';
import { Container } from 'react-bootstrap';
import './MenuComponents.css';

const MenuHero = memo(() => {
  return (
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
  );
});

MenuHero.displayName = 'MenuHero';
export default MenuHero;
