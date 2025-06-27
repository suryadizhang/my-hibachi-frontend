import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./About.css";
import heroPic from "../assets/hero_pic.png";

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

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about-section">
      <Helmet>
        <title>My Hibachi | Hibachi at Home | Private Hibachi Chef & Catering in Bay Area & Sacramento</title>
        <meta
          name="description"
          content="Experience hibachi at home with My Hibachi. Private chef entertainment and catering for San Francisco, San Jose, Sacramento, and the Bay Area."
        />
        <meta
          name="keywords"
          content="hibachi at home, hibachi catering, private hibachi chef, San Francisco, San Jose, Sacramento, Bay Area, teppanyaki, hibachi party"
        />
        <link rel="canonical" href="https://myhibachichef.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FoodEstablishment",
            name: "My Hibachi",
            image: "https://myhibachichef.com/assets/hero_pic.png",
            telephone: "(408) 123-4567",
            email: "cs@myhibachichef.com",
            address: {
              "@type": "PostalAddress",
              addressLocality: "San Francisco",
              addressRegion: "CA",
              addressCountry: "US",
            },
            servesCuisine: ["Japanese", "Hibachi", "Teppanyaki"],
            areaServed: [
              "San Francisco",
              "San Jose",
              "Sacramento",
              "Bay Area",
            ],
            url: "https://myhibachichef.com/",
          })}
        </script>
      </Helmet>

      {/* Hero Media Section - Ready for Video Integration */}
      <div className="hero-media-container">
        <div className="hero-media-overlay"></div>
        {/* Current Image - Ready to be replaced with video */}
        <img
          src={heroPic}
          alt="Private hibachi chef cooking teppanyaki in Bay Area"
          className="hero-media hero-image"
          width="1920"
          height="800"
          loading="eager"
          fetchPriority="high"
        />
        {/* Video element ready for integration - currently commented out
        <video
          className="hero-media hero-video"
          width="1920"
          height="800"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPic}
        >
          <source src="/path-to-your-video.mp4" type="video/mp4" />
          <source src="/path-to-your-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        */}
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
            <a href="/services" className="btn btn-primary btn-lg me-3">🔥 Book Your Hibachi Party Now!</a>
            <a href="/contact" className="btn btn-outline-primary btn-lg">💬 Get Your Free Quote</a>
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
