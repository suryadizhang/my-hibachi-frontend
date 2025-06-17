import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => (
  <section className="about-section py-5 bg-light">
    {/* Hero Video Section */}
    <div className="container mb-5">
      <div className="row align-items-center">
        <div className="col-12 text-center">
          <div className="hero-video-wrapper mb-4">
            {/* Replace src with your actual hero video URL */}
            <video
              className="w-100 rounded shadow"
              controls
              poster="https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=800&q=80"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            >
              <source src="your-hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <h1 className="display-4 fw-bold text-primary mb-3">
            Experience the Art of Japanese Hibachi
          </h1>
          <h2 className="h4 text-secondary mb-4">
            Where Culinary Mastery Meets Unforgettable Entertainment
          </h2>
        </div>
      </div>
    </div>

    {/* About Content */}
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <h3 className="fw-semibold mb-3 text-dark">Meet Our Chefs</h3>
          <p className="lead">
            At{" "}
            <span className="fw-bold text-primary">My Hibachi</span>, our talented
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
