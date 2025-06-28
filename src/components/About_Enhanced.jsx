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

      {/* Hero Image Section */}
      <div className="hero-image-container">
        <div className="hero-image-overlay"></div>
        <img
          src={heroPic}
          alt="Private hibachi chef cooking teppanyaki in Bay Area"
          width="1920"
          height="800"
          loading="eager"
          fetchPriority="high"
          className="hero-image"
        />
      </div>

      {/* Headline Section */}
      <Container>
        <div className="headline-section fade-in">
          <h1 className="main-title text-center">
            Experience the Art of Japanese Hibachi
          </h1>
          <h2 className="subtitle text-center">
            Where Culinary Mastery Meets Unforgettable Entertainment
          </h2>
          <div className="text-center">
            <Badge className="quality-badge">
              🌟 Premium Quality Ingredients • Reasonable Prices • Excellence is Our Priority 🌟
            </Badge>
          </div>
        </div>
      </Container>

      {/* Statistics Section */}
      <Container className="my-5">
        <div className="stats-section animate-on-scroll">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Events Served</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8+</span>
              <span className="stat-label">Expert Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5⭐</span>
              <span className="stat-label">Quality Service</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Cities Served</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Content Sections */}
      <Container>
        <Row className="justify-content-center">
          <Col lg={10}>
            {/* Meet Our Chefs Section */}
            <div className="content-card animate-on-scroll slide-in-left">
              <div className="text-center">
                <span className="card-icon">👨‍🍳</span>
                <h3 className="card-title">Meet Our Master Chefs</h3>
              </div>
              <p className="card-text">
                At <span className="highlight-text">My Hibachi</span>, our talented
                chefs are true maestros of the teppanyaki grill, blending years of
                experience with an unwavering passion for flavor and flair. Having
                honed their skills in renowned Japanese kitchens, our chefs fuse
                traditional techniques with a modern twist, ensuring each dish is a
                unique encounter that delights both the palate and the memory.
              </p>
              <p className="card-text">
                <strong className="highlight-text">🏆 Our commitment to quality:</strong> We source only the finest, freshest ingredients 
                at reasonable prices because we believe exceptional culinary experiences should be accessible to everyone. 
                From premium USDA Choice Angus beef to wild-caught Atlantic salmon and organic vegetables, 
                every ingredient meets our rigorous quality standards.
              </p>
              <p className="card-text">
                We believe that good food brings people together, and we are committed
                to turning every event into a celebration of fresh, delectable Japanese
                cuisine. With our expert chefs at the grill and premium ingredients at reasonable prices, 
                expect a symphony of sizzling sounds, enticing aromas, and a spectacle of culinary
                acrobatics that will leave you and your guests truly delighted.
              </p>
            </div>

            {/* Features Grid */}
            <div className="features-grid animate-on-scroll">
              <div className="feature-item">
                <span className="feature-icon">🎭</span>
                <h4 className="feature-title">Interactive Entertainment</h4>
                <p className="feature-description">
                  Our chefs don't just cook—they perform! Enjoy knife tricks, 
                  fire displays, and culinary acrobatics that captivate guests of all ages.
                </p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <h4 className="feature-title">Mobile Service</h4>
                <p className="feature-description">
                  We bring the complete hibachi experience to your location. 
                  No need to travel—the restaurant comes to you!
                </p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎉</span>
                <h4 className="feature-title">All Occasions</h4>
                <p className="feature-description">
                  Perfect for weddings, birthdays, corporate events, family gatherings, 
                  and any celebration that deserves something special.
                </p>
              </div>
            </div>

            {/* Experience Section */}
            <div className="content-card animate-on-scroll slide-in-right">
              <div className="text-center">
                <span className="card-icon">🎌</span>
                <h3 className="card-title">The Ultimate Mobile Hibachi Experience</h3>
              </div>
              <p className="card-text">
                <span className="highlight-text">My Hibachi</span> brings the
                thrill of hibachi cooking and entertainment directly to you as your
                mobile, private chef experience in the North California Bay Area and
                Sacramento. Whether you're celebrating a wedding, proposal, birthday,
                family reunion, corporate event, anniversary, holiday party, engagement,
                or bachelor/bachelorette party, My Hibachi transforms your gathering
                into a memorable occasion with premium quality ingredients at reasonable prices.
              </p>
              <p className="card-text">
                Our skilled chefs don't just cook—they perform, crafting a vibrant,
                interactive atmosphere that keeps your guests entertained and engaged. 
                <span className="highlight-text"> Every dish showcases our commitment to quality ingredients 
                and exceptional value, ensuring your event exceeds expectations without exceeding your budget.</span>
              </p>
              
              {/* Service Areas */}
              <div className="mt-4">
                <h5 className="fw-bold text-primary mb-3">🗺️ Service Areas</h5>
                <Row>
                  <Col md={6}>
                    <ul className="list-unstyled">
                      <li className="mb-2">✅ San Francisco Bay Area</li>
                      <li className="mb-2">✅ San Jose & Silicon Valley</li>
                      <li className="mb-2">✅ Sacramento & Surrounding Areas</li>
                    </ul>
                  </Col>
                  <Col md={6}>
                    <ul className="list-unstyled">
                      <li className="mb-2">✅ Oakland & East Bay</li>
                      <li className="mb-2">✅ Peninsula & South Bay</li>
                      <li className="mb-2">✅ Marin & North Bay</li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Call to Action Section */}
      <Container className="my-5">
        <div className="cta-section animate-on-scroll">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Create Unforgettable Memories?
            </h2>
            <p className="cta-text">
              Discover the ultimate hibachi experience with <strong>My Hibachi</strong>—where every
              meal becomes a celebration of quality, entertainment, and exceptional value.
            </p>
            <div className="cta-buttons">
              <a href="/menu" className="cta-button">
                📋 View Menu & Pricing
              </a>
              <a href="/contact" className="cta-button secondary">
                📞 Book Your Event
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
