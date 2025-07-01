/* Advanced SEO Enhancements */

/* Schema.org Event Markup for Rich Snippets */
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Private Hibachi Chef Experience",
  "description": "Live hibachi cooking show with flame tricks at your location",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "USD",
    "price": "starting at $300",
    "availability": "https://schema.org/InStock"
  },
  "performer": {
    "@type": "Person",
    "name": "My Hibachi Chef",
    "sameAs": [
      "https://www.facebook.com/myhibachichef",
      "https://www.instagram.com/myhibachichef",
      "https://www.yelp.com/biz/my-hibachi-chef"
    ]
  },
  "location": {
    "@type": "Place",
    "name": "Your Location",
    "address": "San Jose, Bay Area, Sacramento, San Francisco"
  }
};

/* FAQ Schema for Featured Snippets */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a private hibachi chef cost in San Jose?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Private hibachi chef services in San Jose start at $300 for small parties and scale based on guest count, menu selections, and location. All-inclusive pricing covers chef, equipment, ingredients, and cleanup."
      }
    },
    {
      "@type": "Question", 
      "name": "What areas do you serve for mobile hibachi catering?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide mobile hibachi chef services throughout San Jose, Bay Area, Sacramento, San Francisco, Fremont, Sunnyvale, Mountain View, and surrounding Northern California areas."
      }
    },
    {
      "@type": "Question",
      "name": "Do you bring everything for backyard hibachi parties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our mobile hibachi service is completely all-inclusive. We bring the professional hibachi grill, fresh ingredients, cooking utensils, plates, and handle all setup and cleanup."
      }
    }
  ]
};

/* Local Business Schema with Multiple Locations */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "My Hibachi Chef",
  "description": "Mobile hibachi chef bringing live cooking shows to your backyard",
  "url": "https://myhibachichef.com",
  "telephone": "+1-XXX-XXX-XXXX",
  "priceRange": "$$$",
  "servesCuisine": ["Japanese", "Hibachi", "Teppanyaki"],
  "serviceArea": [
    {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 37.3382,
        "longitude": -121.8863
      },
      "geoRadius": "50000"
    }
  ],
  "areaServed": [
    "San Jose, CA",
    "San Francisco, CA", 
    "Sacramento, CA",
    "Fremont, CA",
    "Sunnyvale, CA",
    "Mountain View, CA",
    "Palo Alto, CA",
    "Santa Clara, CA"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Hibachi Catering Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Private Hibachi Chef for Birthday Parties",
          "description": "Live hibachi cooking show for birthday celebrations"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Corporate Hibachi Catering",
          "description": "Professional hibachi entertainment for corporate events"
        }
      }
    ]
  }
};

export { eventSchema, faqSchema, localBusinessSchema };
