// Static Site Generation with Incremental Static Regeneration
// This is the FASTEST possible rendering for static content

import { Metadata } from 'next';

// Static metadata generation
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us - My Hibachi Chef | Premium Hibachi Catering',
    description: 'Learn about My Hibachi Chef, your premier destination for authentic hibachi dining experiences at your location.',
    keywords: 'hibachi chef, about us, catering service, japanese cuisine, professional chefs',
    openGraph: {
      title: 'About My Hibachi Chef - Premium Hibachi Catering',
      description: 'Professional hibachi chefs bringing authentic Japanese dining to your location.',
      type: 'website',
    },
  };
}

// Server Component for ultra-fast rendering
export default function AboutPage() {
  // This runs on the server and is pre-rendered at build time
  const aboutData = {
    title: "About My Hibachi Chef",
    description: "We bring the authentic hibachi experience directly to you.",
    features: [
      "Professional certified chefs",
      "Fresh premium ingredients", 
      "Complete setup and cleanup",
      "Entertaining culinary performance"
    ],
    serviceAreas: [
      "Los Angeles County",
      "Orange County", 
      "Riverside County",
      "San Bernardino County"
    ]
  };

  return (
    <div className="about-page">
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <h1 className="display-4 text-center mb-5">{aboutData.title}</h1>
            
            <div className="lead text-center mb-5">
              {aboutData.description}
            </div>

            <div className="row">
              <div className="col-md-6">
                <h3>Our Features</h3>
                <ul className="list-unstyled">
                  {aboutData.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="col-md-6">
                <h3>Service Areas</h3>
                <ul className="list-unstyled">
                  {aboutData.serviceAreas.map((area, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Enable ISR - page regenerates every hour if needed
export const revalidate = 3600; // 1 hour
