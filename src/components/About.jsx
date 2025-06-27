import React from "react";
import { Helmet } from "react-helmet-async";
import "bootstrap/dist/css/bootstrap.min.css";
import heroPic from "../assets/hero_pic.png";

const About = () => (
  <section className="about-section py-5 bg-light text-dark">
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

    {/* Hero Image (LCP Target) */}
    <div>
      <img
        src={heroPic}
        alt="Private hibachi chef cooking teppanyaki in Bay Area"
        width="1920"
        height="800"
        loading="eager"
        fetchPriority="high"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>

    {/* Headline Section */}
    <div className="container text-center my-4">
      <h1 className="display-4 fw-bold text-primary mb-3">
        Experience the Art of Japanese Hibachi
      </h1>
      <h2 className="h4 text-secondary mb-4">
        Where Culinary Mastery Meets Unforgettable Entertainment
      </h2>
    </div>

    {/* About Content */}
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h3 className="fw-semibold mb-3 text-dark">Meet Our Chefs</h3>
          <p className="lead">
            At <span className="fw-bold text-primary">My Hibachi</span>, our talented
            chefs are true maestros of the teppanyaki grill, blending years of
            experience with an unwavering passion for flavor and flair. Having
            honed their skills in renowned Japanese kitchens, our chefs fuse
            traditional techniques with a modern twist, ensuring each dish is a
            unique encounter that delights both the palate and the memory.
          </p>
          <p>
            We believe that good food brings people together, and we are committed
            to turning every event into a celebration of fresh, delectable Japanese
            cuisine. With our expert chefs at the grill, expect a symphony of
            sizzling sounds, enticing aromas, and a spectacle of culinary
            acrobatics that will leave you and your guests truly delighted.
          </p>
          <h3 className="fw-semibold mt-5 mb-3 text-dark">
            The Ultimate Mobile Hibachi Experience
          </h3>
          <p>
            <span className="fw-bold text-primary">My Hibachi</span> brings the
            thrill of hibachi cooking and entertainment directly to you as your
            mobile, private chef experience in the North California Bay Area and
            Sacramento. Whether you’re celebrating a wedding, proposal, birthday,
            family reunion, corporate event, anniversary, holiday party, engagement,
            or bachelor/bachelorette party, My Hibachi transforms your gathering
            into a memorable occasion.
          </p>
          <p>
            Our skilled chefs don’t just cook—they perform, crafting a vibrant,
            interactive atmosphere that keeps your guests entertained and engaged.
          </p>
          <div className="text-center mt-5">
            <h2 className="fw-bold text-success mb-3">
              Ready to host an event your guests will never forget?
            </h2>
            <p className="lead">
              Discover the ultimate hibachi experience with{" "}
              <span className="fw-bold text-primary">My Hibachi</span>—where every
              meal becomes a celebration.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default About;
