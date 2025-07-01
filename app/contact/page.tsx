// Ultra-fast Contact page using PPR - Static shell with dynamic form
import { Metadata } from 'next';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamic import for the interactive contact form (client component)
const ContactForm = dynamic(() => import('../../components/ContactForm'), {
  loading: () => (
    <div className="card">
      <div className="card-body">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading form...</span>
          </div>
          <p className="mt-2 text-muted">Loading contact form...</p>
        </div>
      </div>
    </div>
  )
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us - My Hibachi Chef | Book Your Event',
    description: 'Contact My Hibachi Chef to book your premium hibachi catering experience. Get a quote today!',
    keywords: 'contact hibachi chef, book hibachi catering, hibachi quote, event booking',
  };
}

// Server Component with static shell (PPR)
export default function ContactPage() {
  // Static content rendered immediately
  const contactInfo = {
    phone: "(555) 123-4567",
    email: "info@myhibachichef.com",
    serviceAreas: ["Los Angeles", "Orange County", "Riverside", "San Bernardino"],
    hours: {
      weekdays: "9:00 AM - 8:00 PM",
      weekends: "10:00 AM - 9:00 PM"
    }
  };

  return (
    <div className="contact-page">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center mb-5">
            <h1 className="display-4">Contact Us</h1>
            <p className="lead">Ready to bring the hibachi experience to your event?</p>
          </div>
        </div>

        <div className="row">
          {/* Static contact information - renders immediately */}
          <div className="col-lg-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h3 className="card-title">Get In Touch</h3>
                
                <div className="mb-4">
                  <h5><i className="bi bi-telephone-fill text-primary me-2"></i>Phone</h5>
                  <p className="mb-0">{contactInfo.phone}</p>
                </div>

                <div className="mb-4">
                  <h5><i className="bi bi-envelope-fill text-primary me-2"></i>Email</h5>
                  <p className="mb-0">{contactInfo.email}</p>
                </div>

                <div className="mb-4">
                  <h5><i className="bi bi-clock-fill text-primary me-2"></i>Hours</h5>
                  <p className="mb-1">Weekdays: {contactInfo.hours.weekdays}</p>
                  <p className="mb-0">Weekends: {contactInfo.hours.weekends}</p>
                </div>

                <div>
                  <h5><i className="bi bi-geo-alt-fill text-primary me-2"></i>Service Areas</h5>
                  <div className="row">
                    {contactInfo.serviceAreas.map((area, index) => (
                      <div key={index} className="col-6">
                        <p className="mb-1">• {area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic contact form - loads with Suspense */}
          <div className="col-lg-6">
            <Suspense fallback={
              <div className="card h-100">
                <div className="card-body d-flex align-items-center justify-content-center">
                  <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Loading contact form...</p>
                  </div>
                </div>
              </div>
            }>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}

// Static generation with revalidation - fastest for static content
export const revalidate = 86400; // 24 hours
