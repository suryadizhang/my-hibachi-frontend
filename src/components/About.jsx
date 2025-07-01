import React, { useEffect } from "react";
import { Container, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.css";
import heroPic from "../assets/hero_pic.png";
import heroVideo from "../assets/hero_video.mp4";
import SEO from "./SEO";
import { eventSchema, localBusinessSchema } from '../utils/advancedSEO';

const About = () => {
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, observerOptions);

    // Observe all elements with animate-on-scroll class
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));

    // Handle video loading
    const heroContainer = document.querySelector('.hero-media-container');
    const heroVideo = document.querySelector('.hero-video');
    
    if (heroVideo && heroContainer) {
      heroContainer.classList.add('loading');
      
      const handleVideoLoaded = () => {
        heroContainer.classList.remove('loading');
      };
      
      const handleVideoError = () => {
        console.warn('Hero video failed to load, showing fallback image');
        heroContainer.classList.remove('loading');
      };

      heroVideo.addEventListener('loadeddata', handleVideoLoaded);
      heroVideo.addEventListener('error', handleVideoError);

      return () => {
        observer.disconnect();
        if (heroVideo) {
          heroVideo.removeEventListener('loadeddata', handleVideoLoaded);
          heroVideo.removeEventListener('error', handleVideoError);
        }
      };
    }

    return () => observer.disconnect();
  }, []);

  // Enhanced structured data with multiple schema types
  const enhancedStructuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "My Hibachi Chef",
      "description": "Premium private hibachi chef services bringing authentic Japanese cuisine directly to your backyard, beachside, park, or any location for unforgettable dining experiences",
      "url": "https://myhibachichef.com/",
      "logo": "https://myhibachichef.com/src/assets/My%20Hibachi%20logo.png",
      "image": "https://myhibachichef.com/src/assets/hero_pic.png",
      "telephone": "+1-XXX-XXX-XXXX",
      "email": "info@myhibachichef.com",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Jose",
        "addressRegion": "CA",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 37.3382,
        "longitude": -121.8863
      },
      "servesCuisine": ["Japanese", "Hibachi", "Teppanyaki"],
      "areaServed": [
        {
          "@type": "City",
          "name": "San Jose"
        },
        {
          "@type": "City", 
          "name": "San Francisco"
        },
        {
          "@type": "City",
          "name": "Sacramento"
        },
        {
          "@type": "City",
          "name": "Fremont"
        },
        {
          "@type": "City",
          "name": "Sunnyvale"
        },
        {
          "@type": "City",
          "name": "Mountain View"
        }
      ],
      "priceRange": "$$$",
      "paymentAccepted": ["Credit Card", "Cash", "Venmo", "Zelle"],
      "currenciesAccepted": "USD",
      "openingHours": "Mo-Su 10:00-22:00",
      "hasMenu": "https://myhibachichef.com/menu",
      "acceptsReservations": true,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150+",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "description": "Private hibachi chef services for events and parties",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    },
    eventSchema,
    localBusinessSchema,
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Mobile Hibachi Chef Experience",
      "description": "Professional hibachi chef brings live cooking show with flame tricks to your location",
      "provider": {
        "@type": "Organization",
        "name": "My Hibachi Chef"
      },
      "areaServed": {
        "@type": "State",
        "name": "California"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Hibachi Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Backyard Hibachi Party",
              "description": "Transform your backyard into a hibachi restaurant with live cooking entertainment"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Beachside Hibachi Experience", 
              "description": "Mobile hibachi chef for beach parties and waterfront events"
            }
          }
        ]
      }
    }
  ];

  return (
    <section className="about-section">
      <SEO
        title="About My Hibachi Chef | Mobile Hibachi Catering with Live Cooking Show | Bay Area"
        description="Professional mobile hibachi chef bringing authentic teppanyaki experience to your backyard, beachside, or any location. Live hibachi cooking show with flame tricks for birthday parties, corporate events, and special occasions in San Jose, Bay Area, Sacramento, and San Francisco."
        keywords="mobile hibachi chef, live hibachi cooking show, flame tricks hibachi chef, all-inclusive hibachi catering, backyard hibachi party, birthday hibachi party at home, corporate hibachi catering, private chef for anniversary dinner, hibachi menu with steak shrimp chicken, chef brings grill and ingredients"
        url="/"
        image="/src/assets/hero_pic.png"
        structuredData={enhancedStructuredData}
      />

      {/* Hero Video Section */}
      <div className="hero-media-container">
        <div className="hero-media-overlay"></div>
        <video
          className="hero-media hero-video"
          width="1920"
          height="800"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPic}
          onError={(e) => {
            console.warn('Video failed to load, falling back to image');
            e.target.style.display = 'none';
            e.target.nextElementSibling.style.display = 'block';
          }}
        >
          <source src={heroVideo} type="video/mp4" />
          {/* Fallback image for browsers that don't support video */}
          <img
            src={heroPic}
            alt="Private hibachi chef cooking teppanyaki in Bay Area"
            className="hero-media hero-image"
            width="1920"
            height="800"
          />
        </video>
        {/* Fallback image (hidden by default, shown if video fails) */}
        <img
          src={heroPic}
          alt="Private hibachi chef cooking teppanyaki in Bay Area"
          className="hero-media hero-image"
          width="1920"
          height="800"
          style={{ display: 'none' }}
        />
      </div>

      {/* Animated Headline Section */}
      <Container>
        <div className="headline-section animate-on-scroll">
          <h1 className="main-title text-center">
            Experience the Art of Japanese Hibachi
          </h1>
          <p className="subtitle text-center">
            Where Culinary Mastery Meets Unforgettable Entertainment
          </p>
          <div className="text-center">
            <Badge className="quality-badge">
              🌟 Premium Quality Ingredients • Reasonable Prices • Excellence is Our Priority 🌟
            </Badge>
          </div>
        </div>

        {/* Statistics Section */}
        <Row className="statistics-section animate-on-scroll">
          <Col md={3} className="text-center mb-4">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Events</div>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="stat-item">
              <div className="stat-number">5★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Service Areas</div>
            </div>
          </Col>
          <Col md={3} className="text-center mb-4">
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Years Experience</div>
            </div>
          </Col>
        </Row>

        {/* Content Cards */}
        <Row>
          <Col lg={12}>
            <div className="content-card animate-on-scroll">
              <span className="card-icon">👨‍🍳</span>
              <h3 className="card-title">Meet Our Expert Chefs</h3>
              <p className="card-text">
                At <span className="highlight-text">My Hibachi</span>, our talented chefs are true maestros of the teppanyaki grill, 
                blending years of experience with an unwavering passion for flavor and flair. Having honed their skills in renowned 
                Japanese kitchens, our chefs fuse traditional techniques with a modern twist, ensuring each dish is a unique encounter 
                that delights both the palate and the memory.
              </p>
              <p className="card-text">
                We believe that <span className="highlight-text">quality ingredients at reasonable prices</span> and exceptional 
                service bring people together. We are committed to turning every event into a celebration of fresh, delectable 
                Japanese cuisine with <span className="highlight-text">quality as our top priority</span>.
              </p>
            </div>

            <div className="content-card animate-on-scroll">
              <span className="card-icon">🎪</span>
              <h3 className="card-title">The Ultimate Mobile Hibachi Experience</h3>
              <p className="card-text">
                <span className="highlight-text">My Hibachi</span> brings the thrill of hibachi cooking and entertainment directly 
                to you as your mobile, private chef experience in the North California Bay Area and Sacramento. Whether you're 
                celebrating a wedding, proposal, birthday, family reunion, corporate event, anniversary, holiday party, engagement, 
                or bachelor/bachelorette party, My Hibachi transforms your gathering into a memorable occasion.
              </p>
              <p className="card-text">
                Our skilled chefs don't just cook—they perform, crafting a vibrant, interactive atmosphere that keeps your guests 
                entertained and engaged. With <span className="highlight-text">premium quality ingredients and reasonable pricing</span>, 
                we deliver exceptional value for your special events.
              </p>
            </div>
          </Col>
        </Row>

        {/* Features Grid */}
        <div className="features-grid animate-on-scroll">
          <div className="feature-item">
            <span className="feature-icon">🥩</span>
            <h4 className="feature-title">Premium Quality Ingredients</h4>
            <p className="feature-description">
              Fresh, high-quality meats, vegetables, and authentic Japanese seasonings sourced from trusted suppliers.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">💰</span>
            <h4 className="feature-title">Reasonable Pricing</h4>
            <p className="feature-description">
              Competitive rates that deliver exceptional value without compromising on quality or service excellence.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎭</span>
            <h4 className="feature-title">Interactive Entertainment</h4>
            <p className="feature-description">
              Skilled chefs who combine culinary expertise with entertaining performances for an unforgettable experience.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📍</span>
            <h4 className="feature-title">Mobile Service</h4>
            <p className="feature-description">
              We bring the complete hibachi experience to your location across the Bay Area and Sacramento region.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏆</span>
            <h4 className="feature-title">Excellence Guarantee</h4>
            <p className="feature-description">
              Our commitment to quality is our priority, ensuring every event exceeds your expectations.
            </p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎉</span>
            <h4 className="feature-title">All Occasions</h4>
            <p className="feature-description">
              Perfect for weddings, birthdays, corporate events, and any celebration that deserves something special.
            </p>
          </div>
        </div>

        {/* Service Areas */}
        <div className="service-areas animate-on-scroll">
          <h3 className="section-title text-center">🌟 Bringing Hibachi Magic to Your Neighborhood! 🌟</h3>
          <p className="service-intro text-center">
            We're excited to bring our premium hibachi experience directly to your location! 
            Serving within <span className="highlight-text">150 miles of Fremont, CA</span> with 
            <span className="highlight-text">reasonable travel fees</span> for locations outside our primary service areas.
          </p>
          
          <Row className="mt-4">
            <Col md={6}>
              <div className="service-area-card">
                <h4 className="area-title">🏙️ Primary Bay Area Locations</h4>
                <p className="area-subtitle">No additional travel fees within these areas!</p>
                <ul className="area-list">
                  <li>San Francisco - The heart of culinary excellence</li>
                  <li>San Jose - Silicon Valley's finest hibachi</li>
                  <li>Oakland - East Bay entertainment at its best</li>
                  <li>Fremont - Our home base with premium service</li>
                  <li>Santa Clara - Tech meets traditional Japanese cuisine</li>
                  <li>Sunnyvale - Where innovation meets flavor</li>
                  <li>Mountain View - Bringing mountains of flavor</li>
                  <li>Palo Alto - Stanford-level culinary performance</li>
                </ul>
              </div>
            </Col>
            <Col md={6}>
              <div className="service-area-card">
                <h4 className="area-title">🏞️ Sacramento & Extended Regions</h4>
                <p className="area-subtitle">Minimal travel fees for these beautiful locations!</p>
                <ul className="area-list">
                  <li>Sacramento - Capital city hibachi experiences</li>
                  <li>Elk Grove - Family-friendly neighborhood service</li>
                  <li>Roseville - Elegant dining in wine country vicinity</li>
                  <li>Folsom - Historic charm meets modern hibachi</li>
                  <li>Davis - University town celebrations</li>
                  <li>Stockton - Central Valley's premier hibachi</li>
                  <li>Modesto - Agricultural heart, culinary soul</li>
                  <li>Livermore - Wine country hibachi perfection</li>
                </ul>
              </div>
            </Col>
          </Row>
          
          <div className="service-radius-info text-center mt-4">
            <div className="radius-card">
              <span className="radius-icon">📍</span>
              <h4 className="radius-title">We Come to You!</h4>
              <p className="radius-description">
                Serving anywhere within <span className="highlight-text">150 miles of Fremont, CA 94539</span>
              </p>
              <p className="travel-fee-info">
                <span className="travel-highlight">💰 Transparent Pricing:</span> 
                Minimal travel fees apply for locations outside our primary service areas. 
                <br />
                <strong>Call us for a custom quote - we make it affordable for everyone!</strong>
              </p>
              <div className="service-promise">
                <span className="promise-icon">🎯</span>
                <span className="promise-text">
                  <strong>Our Promise:</strong> No hidden fees, just honest pricing and exceptional service!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action Section */}
        <div className="cta-section animate-on-scroll text-center">
          <h2 className="cta-title">🎉 Ready to host an unforgettable hibachi experience? 🎉</h2>
          <p className="cta-description">
            Join hundreds of satisfied customers across the Bay Area and Sacramento! Discover why <span className="highlight-text">My Hibachi</span> 
            is the premier choice for <span className="highlight-text">quality ingredients, reasonable prices, and exceptional entertainment</span>. 
            We bring the restaurant experience to your backyard - anywhere within 150 miles!
          </p>
          <div className="cta-special-offer">
            <span className="offer-badge">✨ Special Offer ✨</span>
            <p className="offer-text">Book now and let us create memories that will last a lifetime!</p>
          </div>
          <div className="cta-buttons">
            <Link to="/BookUs" className="btn btn-primary btn-lg me-3">🔥 Book Your Hibachi Party Now!</Link>
            <Link to="/contact" className="btn btn-outline-primary btn-lg">💬 Get Your Free Quote</Link>
          </div>
          <p className="cta-footer">
            <small>📞 Questions? Call us for instant assistance! • 🚗 We travel to you! • 💯 Satisfaction guaranteed!</small>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default About;
