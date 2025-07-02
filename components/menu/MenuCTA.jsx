import React, { memo } from 'react';
import Link from 'next/link';

const MenuCTA = memo(() => {
  return (
    <div className="menu-cta-section p-5 text-center">
      <div className="cta-content">
        <h2 className="cta-title mb-4">
          <span className="emoji-visible">🎉</span>
          Ready to Book Your Experience?
        </h2>
        <p className="cta-subtitle mb-5">
          Bring the authentic hibachi experience directly to your home
        </p>
        
        <div className="cta-buttons">
          <Link href="/BookUs" className="btn btn-primary btn-lg cta-button">
            <span className="emoji-visible">📅</span>
            Book Now
          </Link>
          <Link href="/contact" className="btn btn-outline-primary btn-lg cta-button ms-3">
            <span className="emoji-visible">📞</span>
            Contact Us
          </Link>
        </div>
        
        <div className="cta-features mt-5">
          <div className="cta-feature">
            <span className="emoji-visible">🚀</span>
            <span>Quick & Easy Booking</span>
          </div>
          <div className="cta-feature">
            <span className="emoji-visible">🛡️</span>
            <span>100% Satisfaction Guarantee</span>
          </div>
          <div className="cta-feature">
            <span className="emoji-visible">🎭</span>
            <span>Unforgettable Entertainment</span>
          </div>
        </div>
      </div>
    </div>
  );
});

MenuCTA.displayName = 'MenuCTA';
export default MenuCTA;
