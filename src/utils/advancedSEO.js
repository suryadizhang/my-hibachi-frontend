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

/* Enhanced FAQ Schema for Voice Search & Featured Snippets */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a private hibachi chef cost in San Jose?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Private hibachi chef services in San Jose start at $300 for small parties (up to 8 guests) and scale based on guest count, menu selections, and location. All-inclusive pricing covers professional chef, mobile hibachi grill, premium ingredients, setup, cooking show, and complete cleanup. Popular packages range from $300-$2,000 depending on party size and menu complexity."
      }
    },
    {
      "@type": "Question", 
      "name": "What areas do you serve for mobile hibachi catering?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide mobile hibachi chef services throughout a 150-mile radius from Fremont (94539), covering San Jose, Bay Area, Sacramento, San Francisco, Napa Valley, Santa Cruz, Monterey, Carmel, Modesto, Stockton, Fresno, and over 80 cities in Northern and Central California. From Silicon Valley tech offices to Napa vineyard estates, we bring the hibachi experience anywhere."
      }
    },
    {
      "@type": "Question",
      "name": "Do you bring everything for backyard hibachi parties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Our mobile hibachi service is completely all-inclusive. We bring the professional-grade hibachi grill, fresh premium ingredients (steak, chicken, shrimp, vegetables), cooking utensils, plates, napkins, sauces, and handle all setup and cleanup. You just provide the space and we handle everything else for your perfect hibachi party."
      }
    },
    {
      "@type": "Question",
      "name": "Can I book a hibachi chef for a party in Napa Valley?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! We specialize in Napa Valley hibachi catering for winery events, vineyard parties, wine tasting celebrations, and luxury estate gatherings. Our chefs are experienced in upscale venues and can coordinate with wineries for the perfect food and wine pairing experience. Travel within our 150-mile service radius from Fremont."
      }
    },
    {
      "@type": "Question",
      "name": "How far will My Hibachi Chef travel from Fremont?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We travel up to 150 miles from our Fremont base (94539) to serve customers throughout Northern and Central California. This includes popular destinations like Napa Valley (45 miles), Santa Cruz (65 miles), Monterey (85 miles), Sacramento (95 miles), and Fresno (140 miles). Long-distance bookings may include travel fees."
      }
    },
    {
      "@type": "Question",
      "name": "Do you cater hibachi in Monterey or Carmel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We provide hibachi catering services in Monterey and Carmel for beachside parties, luxury resort events, corporate retreats, and private oceanfront celebrations. Our mobile hibachi service is perfect for Pebble Beach events, Carmel-by-the-Sea parties, and Monterey Bay area festivities."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a private hibachi chef near me for same-day booking?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we often accommodate same-day hibachi chef bookings based on availability throughout the Bay Area, Silicon Valley, and Central Valley. Contact us directly to check if we can serve your area today for emergency hibachi catering, last-minute celebrations, or spontaneous party needs. Call for immediate availability."
      }
    },
    {
      "@type": "Question",
      "name": "What's the best hibachi catering service in Silicon Valley?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "My Hibachi Chef is the premier hibachi catering service for Silicon Valley, serving tech companies like Google, Apple, Facebook, and Tesla with interactive cooking experiences. We specialize in corporate events, product launches, team building, and executive dining in Palo Alto, Mountain View, Cupertino, and throughout the South Bay."
      }
    },
    {
      "@type": "Question",
      "name": "Can you do hibachi catering for a wedding in San Francisco?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! We provide elegant hibachi catering for San Francisco weddings, rehearsal dinners, and reception events. Our chefs work with top wedding venues, hotels, and event planners to create memorable dining experiences. Popular for rooftop venues, waterfront locations, and unique San Francisco celebration spaces."
      }
    },
    {
      "@type": "Question",
      "name": "How much does hibachi catering cost for 50 people?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Hibachi catering for 50 people typically ranges from $1,500-$3,500 depending on menu selections, location, and service level. This includes multiple hibachi chefs, premium ingredients, full setup, entertaining cooking show, and complete cleanup. Corporate events and weddings may include additional services and presentation options."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your hibachi different from restaurants?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our mobile hibachi brings the authentic Japanese teppanyaki experience directly to your location with personalized attention, custom menus, and intimate cooking shows. Unlike crowded restaurants, you get exclusive chef interaction, dietary accommodations, flexible timing, and the comfort of your own space or chosen venue."
      }
    },
    {
      "@type": "Question",
      "name": "Do you serve vegetarian or vegan hibachi options?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! We offer comprehensive vegetarian and vegan hibachi menus featuring grilled vegetables, tofu, plant-based proteins, and custom sauces. Our chefs are experienced in dietary restrictions and can create exciting plant-based hibachi shows with the same entertainment value and delicious flavors."
      }
    }
  ]
};

/* Elite Local Business Schema with Extended 150-Mile Radius */
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://myhibachichef.com/#business",
  "name": "My Hibachi Chef",
  "description": "Elite mobile hibachi chef service bringing authentic Japanese teppanyaki cooking shows to your location throughout Northern California",
  "url": "https://myhibachichef.com",
  "telephone": "+1-XXX-XXX-XXXX",
  "priceRange": "$$$",
  "servesCuisine": ["Japanese", "Hibachi", "Teppanyaki", "Asian Fusion"],
  "foundingDate": "2020",
  "founder": {
    "@type": "Person",
    "@id": "https://myhibachichef.com/#founder",
    "name": "Master Hibachi Chef",
    "sameAs": [
      "https://www.linkedin.com/in/myhibachichef",
      "https://www.facebook.com/myhibachichef"
    ]
  },
  "sameAs": [
    "https://www.facebook.com/myhibachichef",
    "https://www.instagram.com/myhibachichef",
    "https://www.yelp.com/biz/my-hibachi-chef",
    "https://www.google.com/maps/place/my-hibachi-chef",
    "https://www.tiktok.com/@myhibachichef",
    "https://www.youtube.com/channel/myhibachichef"
  ],
  "serviceArea": [
    {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 37.5483,
        "longitude": -121.9886,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Fremont",
          "addressRegion": "CA",
          "postalCode": "94539",
          "addressCountry": "US"
        }
      },
      "geoRadius": "241400"
    }
  ],
  "areaServed": [
    "San Jose, CA", "San Francisco, CA", "Sacramento, CA", "Oakland, CA", "Fremont, CA",
    "Sunnyvale, CA", "Mountain View, CA", "Palo Alto, CA", "Santa Clara, CA", "Cupertino, CA",
    "Redwood City, CA", "Menlo Park, CA", "Foster City, CA", "San Mateo, CA", "Hayward, CA",
    "Union City, CA", "Newark, CA", "Milpitas, CA", "Santa Cruz, CA", "Monterey, CA",
    "Carmel, CA", "Salinas, CA", "Watsonville, CA", "Seaside, CA", "Pacific Grove, CA",
    "Napa, CA", "Napa Valley, CA", "St. Helena, CA", "Calistoga, CA", "Yountville, CA",
    "Sonoma, CA", "Petaluma, CA", "Santa Rosa, CA", "Rohnert Park, CA", "Sebastopol, CA",
    "Modesto, CA", "Stockton, CA", "Tracy, CA", "Manteca, CA", "Lodi, CA", "Turlock, CA",
    "Merced, CA", "Fresno, CA", "Visalia, CA", "Bakersfield, CA", "Gilroy, CA",
    "Morgan Hill, CA", "Hollister, CA", "San Juan Bautista, CA", "Capitola, CA", "Scotts Valley, CA",
    "Half Moon Bay, CA", "Pacifica, CA", "Daly City, CA", "South San Francisco, CA",
    "Dublin, CA", "Pleasanton, CA", "Livermore, CA", "Danville, CA", "San Ramon, CA",
    "Walnut Creek, CA", "Concord, CA", "Martinez, CA", "Antioch, CA", "Pittsburg, CA",
    "Brentwood, CA", "Oakley, CA", "Rio Vista, CA", "Fairfield, CA", "Vacaville, CA",
    "Vallejo, CA", "Benicia, CA", "Suisun City, CA", "Dixon, CA", "Davis, CA",
    "Woodland, CA", "Yuba City, CA", "Marysville, CA", "Grass Valley, CA", "Nevada City, CA"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Elite Hibachi Catering Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Private Hibachi Chef for Birthday Parties",
          "description": "Live hibachi cooking show with flame tricks for birthday celebrations",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "300.00",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "300.00",
              "maxPrice": "2000.00",
              "priceCurrency": "USD"
            }
          }
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Corporate Hibachi Catering",
          "description": "Professional hibachi entertainment for corporate events and team building",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "500.00",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "500.00",
              "maxPrice": "5000.00",
              "priceCurrency": "USD"
            }
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Wedding Hibachi Catering",
          "description": "Elegant hibachi dining experience for wedding receptions and rehearsal dinners",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD",
            "price": "800.00",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "800.00",
              "maxPrice": "8000.00",
              "priceCurrency": "USD"
            }
          }
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Luxury Estate Hibachi Service",
          "description": "Premium hibachi experience for high-end private events and luxury celebrations",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "USD", 
            "price": "1200.00",
            "priceSpecification": {
              "@type": "PriceSpecification",
              "minPrice": "1200.00",
              "maxPrice": "10000.00",
              "priceCurrency": "USD"
            }
          }
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Sarah M."
      },
      "reviewBody": "Absolutely incredible hibachi experience! The chef was entertaining and the food was restaurant quality. Perfect for our Napa Valley winery party!"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "David Chen"
      },
      "reviewBody": "Best decision for our corporate event in Palo Alto! Team loved the interactive cooking show. Highly recommend for any Silicon Valley event."
    }
  ]
};

/* Elite City-Specific Event Examples for Maximum Local Authority */
const cityEventExamples = [
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Luxury Vineyard Hibachi Experience in Napa Valley",
    "description": "Elite private hibachi chef creating culinary magic at exclusive winery estate with wine pairings",
    "location": {
      "@type": "Place",
      "name": "Premium Vineyard Estate",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Napa",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "startDate": "2025-07-20T18:00",
    "endDate": "2025-07-20T21:00",
    "performer": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "sameAs": "https://myhibachichef.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "1200.00"
    }
  },
  {
    "@context": "https://schema.org", 
    "@type": "Event",
    "name": "Tech Company Team Building Hibachi in Palo Alto",
    "description": "Interactive hibachi cooking show for Silicon Valley tech company featuring live entertainment and team collaboration",
    "location": {
      "@type": "Place",
      "name": "Silicon Valley Corporate Campus",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Palo Alto", 
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "startDate": "2025-08-15T12:00",
    "endDate": "2025-08-15T14:00",
    "performer": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "sameAs": "https://myhibachichef.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "800.00"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Event", 
    "name": "Oceanfront Hibachi Celebration in Santa Cruz",
    "description": "Beachside hibachi party with spectacular ocean views featuring fresh seafood and sunset cooking show",
    "location": {
      "@type": "Place",
      "name": "Santa Cruz Beach Resort",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Santa Cruz",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "startDate": "2025-09-10T17:00", 
    "endDate": "2025-09-10T20:00",
    "performer": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "sameAs": "https://myhibachichef.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "600.00"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Luxury Estate Wedding Hibachi in Carmel",
    "description": "Elegant wedding reception hibachi dining experience at exclusive Carmel estate with ocean views",
    "location": {
      "@type": "Place", 
      "name": "Carmel Estate Venue",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Carmel",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "startDate": "2025-10-05T18:30",
    "endDate": "2025-10-05T22:00",
    "performer": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "sameAs": "https://myhibachichef.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "2500.00"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Corporate Retreat Hibachi in Monterey",
    "description": "Executive dining hibachi experience for corporate retreat featuring premium ingredients and professional presentation",
    "location": {
      "@type": "Place",
      "name": "Monterey Conference Resort",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Monterey",
        "addressRegion": "CA", 
        "addressCountry": "US"
      }
    },
    "startDate": "2025-11-12T19:00",
    "endDate": "2025-11-12T21:30",
    "performer": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "sameAs": "https://myhibachichef.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "1500.00"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": "Birthday Celebration Hibachi in Fresno",
    "description": "Family birthday party with interactive hibachi cooking show and flame tricks entertainment",
    "location": {
      "@type": "Place",
      "name": "Private Residence",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Fresno",
        "addressRegion": "CA",
        "addressCountry": "US"
      }
    },
    "startDate": "2025-12-01T17:00",
    "endDate": "2025-12-01T20:00", 
    "performer": {
      "@type": "Organization",
      "name": "My Hibachi Chef",
      "sameAs": "https://myhibachichef.com"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "USD",
      "price": "400.00"
    }
  }
];

/* Enhanced Person Schema for Maximum E-A-T Authority */
const chefPersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://myhibachichef.com/#founder",
  "name": "Master Hibachi Chef",
  "jobTitle": "Executive Hibachi Chef & Culinary Entertainment Director",
  "description": "Award-winning hibachi chef with 15+ years experience in Japanese teppanyaki cuisine and live cooking entertainment",
  "worksFor": {
    "@type": "Organization",
    "name": "My Hibachi Chef",
    "@id": "https://myhibachichef.com/#business"
  },
  "knowsAbout": [
    "Japanese Hibachi Cooking",
    "Teppanyaki Techniques", 
    "Live Cooking Entertainment",
    "Fire Safety Protocols",
    "Mobile Catering Operations",
    "Food Safety Management",
    "Event Planning",
    "Customer Service Excellence",
    "Knife Skills",
    "Flame Cooking Techniques",
    "Asian Cuisine",
    "Culinary Arts",
    "Restaurant Management",
    "Catering Business"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Culinary Arts Certification",
      "credentialCategory": "Professional Certification"
    },
    {
      "@type": "EducationalOccupationalCredential", 
      "name": "Food Safety Manager Certification",
      "credentialCategory": "Safety Certification"
    },
    {
      "@type": "EducationalOccupationalCredential",
      "name": "Business License",
      "credentialCategory": "Business License"
    }
  ],
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": 37.5483,
      "longitude": -121.9886,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Fremont",
        "addressRegion": "CA",
        "postalCode": "94539",
        "addressCountry": "US"
      }
    },
    "geoRadius": 241400
  },
  "sameAs": [
    "https://www.linkedin.com/in/myhibachichef",
    "https://www.facebook.com/myhibachichef",
    "https://www.instagram.com/myhibachichef"
  ],
  "awards": [
    "Best Mobile Catering Service 2023",
    "Excellence in Customer Service Award",
    "Top Rated Hibachi Chef Bay Area"
  ],
  "yearsOfExperience": "15+",
  "specialties": [
    "Corporate Event Catering",
    "Wedding Reception Dining",
    "Birthday Party Entertainment", 
    "Luxury Estate Services",
    "Wine Country Events",
    "Tech Company Catering"
  ]
};

/* Additional Schema Types for Comprehensive SEO */

/* HowTo Schema for Booking Process */
const howToBookSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Book a Private Hibachi Chef",
  "description": "Step-by-step guide to booking your private hibachi chef experience",
  "totalTime": "PT10M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "300"
  },
  "step": [
    {
      "@type": "HowToStep",
      "name": "Choose Your Date",
      "text": "Select your preferred date and check availability on our booking calendar.",
      "url": "https://myhibachichef.com/booking"
    },
    {
      "@type": "HowToStep", 
      "name": "Select Menu Options",
      "text": "Choose from our premium hibachi menu options including steak, chicken, shrimp, and vegetarian selections.",
      "url": "https://myhibachichef.com/menu"
    },
    {
      "@type": "HowToStep",
      "name": "Provide Event Details",
      "text": "Share your location, guest count, and any special requests or dietary restrictions.",
      "url": "https://myhibachichef.com/contact"
    },
    {
      "@type": "HowToStep",
      "name": "Confirm Booking",
      "text": "Review your order details and confirm your hibachi chef booking with secure payment.",
      "url": "https://myhibachichef.com/booking"
    }
  ]
};

/* Service Schema for Each Location */
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Mobile Hibachi Chef Service",
  "description": "Professional hibachi chef bringing authentic Japanese teppanyaki experience to your location",
  "provider": {
    "@type": "Organization",
    "name": "My Hibachi Chef",
    "@id": "https://myhibachichef.com/#business"
  },
  "areaServed": [
    {
      "@type": "City",
      "name": "San Jose",
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    {
      "@type": "City",
      "name": "San Francisco", 
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    {
      "@type": "City",
      "name": "Sacramento",
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    {
      "@type": "City",
      "name": "Napa",
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    {
      "@type": "City",
      "name": "Santa Cruz",
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    },
    {
      "@type": "City",
      "name": "Monterey",
      "containedInPlace": {
        "@type": "State",
        "name": "California"
      }
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Hibachi Service Options",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Residential Hibachi Service"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Corporate Hibachi Catering"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Wedding Hibachi Service"
        }
      }
    ]
  }
};

export { eventSchema, faqSchema, localBusinessSchema, cityEventExamples, chefPersonSchema, howToBookSchema, serviceSchema };
