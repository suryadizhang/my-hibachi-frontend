// Enhanced Chatbot Knowledge Base with Advanced Features
export const WEBSITE_DATA = {
  services: {
    description: "Premium in-home hibachi dining experience with professional chefs",
    types: ["Private dining", "Birthday parties", "Corporate events", "Wedding receptions", "Family reunions", "Holiday celebrations", "Graduation parties", "Baby showers", "Engagement parties"],
    pricing: {
      adult: "$55",
      child: "$30 (ages 6-12)", 
      under5: "Free",
      minimum: "$550 per party",
      upgrades: "Available for premium proteins",
      deposits: "$100 deposit required within 6 hours",
      travel_fee: "Free for first 30 miles from Fremont, CA 94539, then $2 per mile up to 150 miles"
    },
    features: [
      "Professional hibachi chef entertainment",
      "Fresh ingredients cooked on-site",
      "Interactive cooking show",
      "Customizable menu options",
      "All cooking equipment provided",
      "Memorable dining experience"
    ]
  },
  
  menu: {
    proteins: [
      { name: "Chicken", description: "Tender grilled chicken breast with signature hibachi seasonings and teriyaki glaze", popular: true },
      { name: "Premium Angus Sirloin Steak", description: "Premium USDA choice beef cooked to your preferred temperature", popular: true },
      { name: "Shrimp", description: "Fresh jumbo shrimp with garlic butter and hibachi spices", popular: true },
      { name: "Tofu", description: "Fried tofu with our house special seasoning - perfect vegetarian option", popular: false }
    ],
    sides: [
      "Hibachi fried rice with egg and vegetables",
      "Mixed seasonal vegetables (zucchini, onions, mushrooms)", 
      "Fresh garden salad with ginger dressing",
      "Signature yum yum sauce",
      "Traditional ginger dressing",
      "Homemade teriyaki sauce"
    ],
    upgrades: [
      { name: "Filet Mignon", price: "+$8", description: "Premium tender beef filet" },
      { name: "Salmon", price: "+$5", description: "Wild-caught Atlantic salmon with teriyaki glaze" },
      { name: "Scallops", price: "+$5", description: "Fresh sea scallops grilled to perfection" },
      { name: "Lobster Tail", price: "+$15", description: "Fresh lobster tail with garlic butter" }
    ],
    additional_options: [
      { name: "Yakisoba Noodles", price: "+$5", description: "Japanese style lo mein noodles" },
      { name: "3rd Protein", price: "+$10", description: "Add a third protein to your meal" },
      { name: "Extra Fried Rice", price: "+$5", description: "Additional portion of hibachi fried rice" },
      { name: "Extra Vegetables", price: "+$5", description: "Additional portion of mixed seasonal vegetables" }
    ],
    combo_suggestions: [
      { name: "Surf & Turf", proteins: ["Premium Angus Sirloin Steak", "Shrimp"], popular: true },
      { name: "Land & Sea", proteins: ["Chicken", "Scallops"], popular: true },
      { name: "Ocean Feast", proteins: ["Salmon", "Shrimp", "Scallops"], popular: false }
    ]
  },

  booking: {
    process: "Visit /BookUs page, select date/time, fill comprehensive booking form",
    advance_notice: "Minimum 48 hours advance booking required",
    requirements: ["Guest count (minimum 10 people)", "Complete address with parking info", "Dietary restrictions and allergies", "Special occasion details", "Preferred cooking time"],
    deposit: "$100 deposit required within 6 hours to secure your booking",
    confirmation: "You'll receive email confirmation with chef contact info",
    preparation_time: "Chef arrives 20 minutes early for setup",
    flexibility: "We can accommodate last-minute changes with advance notice"
  },

  dietary: {
    accommodations: [
      "Vegetarian meals with tofu and extra vegetables",
      "Vegan preparation available with advance notice", 
      "Gluten-free cooking with separate utensils",
      "Dairy-free options available",
      "We use dairy-free liquid butter (no dairy products)",
      "Peanut-free and sesame-free cooking"
    ],
    allergens: {
      free_from: ["Peanuts", "Sesame", "Dairy products"],
      possible_allergens: ["Eggs", "Mushrooms", "Gluten", "Seafood"],
      note: "Please inform us of any allergies when booking - we can accommodate most dietary restrictions"
    },
    additional_options: [
      "Halal meat preparation available",
      "Kosher cooking with certified ingredients",
      "Nut allergy accommodations with allergen-free prep",
      "Low-sodium options for health-conscious guests",
      "Keto-friendly high-protein, low-carb meals"
    ],
    notice_required: "Please inform us of all dietary restrictions at least 24 hours before your event"
  },

  service_area: {
    base_location: "Fremont, California 94539",
    travel_policy: "Free travel for first 30 miles from our Fremont, CA 94539 location",
    travel_fee: "$2 per mile after the first 30 miles",
    regions_served: ["Northern California", "Bay Area", "Greater Sacramento", "Surrounding areas"],
    extended: "We serve Northern California, Bay Area, Greater Sacramento and surrounding regions with our travel fee policy",
    coverage_radius: "Up to 150 miles from Fremont, CA 94539 with advance booking"
  },

  event_details: {
    duration: "2 hours depending on party size, including setup, cooking show, and cleanup",
    group_sizes: {
      minimum: "10 people minimum",
      optimal: "15-25 people for best experience",
      maximum: "Up to 150 people with multiple chefs"
    },
    setup_required: [
      "Tables and chairs for all guests",
      "Dinner plates and salad plates", 
      "Utensils (forks, knives, chopsticks optional)",
      "Beverages and glasses",
      "Napkins and paper towels",
      "Trash bags for cleanup"
    ],
    provided: [
      "Certified professional hibachi chef",
      "All cooking equipment and portable grill",
      "Fresh premium ingredients", 
      "Interactive cooking entertainment and tricks",
      "Complete cleanup of cooking area",
      "Setup and breakdown of cooking station"
    ],
    space_requirements: "Minimum 8x8 feet outdoor space or well-ventilated indoor area"
  },

  policies: {
    weather: "Indoor cooking available with proper ventilation - we bring portable exhaust fans",
    cancellation: "48-hour cancellation policy - contact customer service immediately",
    rescheduling: "Free rescheduling with 48+ hours notice, $50 fee for less notice",
    tipping: "Gratuity appreciated but not included - typically 15-20% for excellent service",
    payment: "Cash, credit cards, Venmo, Zelle accepted - final payment due day of event",
    insurance: "Fully licensed and insured for your peace of mind"
  },

  faqs: [
    {
      q: "What makes your service special?",
      a: "Our certified chefs provide authentic hibachi entertainment with fresh ingredients, creating an unforgettable dining experience in your own home."
    },
    {
      q: "Do you provide tables and chairs?",
      a: "No, we focus on the culinary experience. You provide the seating and table setup, we bring the amazing food and entertainment!"
    },
    {
      q: "Can you cook indoors?",
      a: "Yes! We can cook indoors with proper ventilation. We bring portable exhaust equipment when needed."
    },
    {
      q: "What if it rains?",
      a: "No problem! We can move the cooking indoors or under covered areas. We're flexible with weather changes."
    },
    {
      q: "Do you charge travel fees?",
      a: "Travel is free for the first 30 miles from our Fremont, CA 94539 location. After 30 miles, we charge $2 per mile. We travel up to 150 miles from Fremont with advance booking. We serve Northern California, Bay Area, Greater Sacramento and surrounding regions!"
    }
  ],

  contact: {
    email: "info@myhibachichef.com",
    phone: "Contact via website form for fastest response",
    website: typeof window !== 'undefined' ? window.location.origin : "https://myhibachichef.com",
    support_hours: "Available 7 days a week for questions and booking assistance",
    response_time: "We typically respond within 2-4 hours during business hours",
    emergency_contact: "For day-of-event issues, contact information provided with booking confirmation"
  }
};

// Enhanced Q&A patterns with advanced natural language understanding
export const QA_PATTERNS = [
  // Menu related - expanded keywords
  {
    keywords: ["menu", "food", "what do you serve", "dishes", "options", "eat", "meal", "protein", "chicken", "steak", "shrimp", "salmon", "tofu", "what's included", "comes with"],
    category: "menu",
    priority: 1
  },
  // Pricing - comprehensive price keywords
  {
    keywords: ["price", "cost", "how much", "expensive", "rates", "pricing", "fee", "charge", "money", "budget", "affordable", "deposit", "payment"],
    category: "pricing", 
    priority: 1
  },
  // Booking - booking related terms
  {
    keywords: ["book", "reserve", "schedule", "appointment", "availability", "when", "date", "time", "available", "open", "calendar", "booking"],
    category: "booking",
    priority: 1
  },
  // Dietary - health and dietary terms
  {
    keywords: ["vegetarian", "vegan", "gluten", "allergy", "dietary", "restrictions", "health", "special diet", "kosher", "halal", "dairy free", "lactose", "nut allergy", "celiac"],
    category: "dietary",
    priority: 1
  },
  // Service area - location terms
  {
    keywords: ["where", "location", "area", "serve", "travel", "distance", "fremont", "northern california", "bay area", "sacramento", "greater sacramento", "come to", "deliver", "service area", "travel fee", "miles"],
    category: "location",
    priority: 1
  },
  // Event details - event planning terms
  {
    keywords: ["setup", "prepare", "duration", "how long", "what to bring", "what do i need", "requirements", "space", "time", "party", "event", "celebration"],
    category: "event_details",
    priority: 2
  },
  // Weather and policies
  {
    keywords: ["weather", "rain", "cancel", "reschedule", "policy", "indoor", "outdoor", "ventilation"],
    category: "policies",
    priority: 2
  },
  // Chef and entertainment
  {
    keywords: ["chef", "entertainment", "show", "tricks", "performance", "experience", "fun", "interactive"],
    category: "entertainment",
    priority: 2
  },
  // Group size and party planning
  {
    keywords: ["how many people", "group size", "minimum", "maximum", "party size", "guests", "crowd"],
    category: "group_size",
    priority: 2
  },
  // Special occasions
  {
    keywords: ["birthday", "wedding", "anniversary", "graduation", "corporate", "holiday", "celebration", "special occasion"],
    category: "occasions",
    priority: 2
  }
];

// Advanced fallback responses with personality
export const FALLBACK_RESPONSES = [
  "🤔 That's an interesting question! I want to make sure you get the most accurate answer. Let me connect you with our expert customer service team.",
  "🎯 Great question! Our knowledgeable customer service team can provide you with detailed, personalized information about that.",
  "💭 I want to give you the best possible answer! Our customer service specialists are experts at handling unique questions like yours.",
  "🤝 I'm here to help, and for that specific question, our customer service team can provide you with the most comprehensive answer.",
  "✨ That's exactly the kind of detailed question our customer service team loves to answer! They'll take great care of you."
];

// Conversation starters and suggestions
export const CONVERSATION_STARTERS = [
  "🍽️ Tell me about your menu and pricing",
  "📅 How do I book a hibachi party?",
  "🥗 What dietary options do you have?",
  "📍 Do you serve my area?",
  "🎉 What makes your service special?",
  "⏰ How long does an event take?",
  "🏠 What do I need to prepare?",
  "👨‍🍳 Tell me about your chefs"
];

// Quick response templates for common scenarios
export const QUICK_RESPONSES = {
  popular_combos: "🔥 **Popular Combinations:**\n• Surf & Turf: NY Strip + Shrimp\n• Land & Sea: Chicken + Scallops\n• Classic Trio: Chicken + Steak + Shrimp",
  
  booking_checklist: "📋 **Booking Checklist:**\n✅ Minimum 10 guests\n✅ 48+ hours advance notice\n✅ Address with parking info\n✅ Dietary restrictions list\n✅ $100 deposit within 6 hours",
  
  setup_quick: "🏠 **Quick Setup Guide:**\n• Tables & chairs for all guests\n• Plates, utensils, napkins\n• Beverages\n• 8x8 ft cooking space\n• We handle the rest!",
  
  pricing_quick: "💰 **Quick Pricing:**\n• Adults: $55 each\n• Kids 6-12: $30 each\n• Under 5: FREE\n• $550 minimum per party\n• $100 deposit required\n• Travel: Free first 30 miles from Fremont, CA 94539, then $2/mile up to 150 miles"
};
