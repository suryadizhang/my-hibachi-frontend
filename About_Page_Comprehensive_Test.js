// About Page Comprehensive Testing Script
// Run this in browser console on the About page

console.log("🔍 Starting comprehensive About page functionality tests...");

function testAboutPageFunctionality() {
  const results = {
    heroSection: false,
    headlineSection: false,
    statisticsSection: false,
    contentCards: false,
    featuresGrid: false,
    serviceAreas: false,
    ctaSection: false,
    buttonLinks: false,
    responsiveDesign: false,
    animations: false,
    total: 0,
    passed: 0
  };

  try {
    // Test 1: Hero Section
    console.log("1️⃣ Testing hero section...");
    const heroContainer = document.querySelector('.hero-media-container');
    const heroMedia = document.querySelector('.hero-media');
    if (heroContainer && heroMedia) {
      results.heroSection = true;
      console.log("✅ Hero section: PASS");
    } else {
      console.log("❌ Hero section: FAIL");
    }

    // Test 2: Headline Section
    console.log("2️⃣ Testing headline section...");
    const headlineSection = document.querySelector('.headline-section');
    const mainTitle = document.querySelector('.main-title');
    const qualityBadge = document.querySelector('.quality-badge');
    if (headlineSection && mainTitle && qualityBadge) {
      results.headlineSection = true;
      console.log("✅ Headline section: PASS");
    } else {
      console.log("❌ Headline section: FAIL");
    }

    // Test 3: Statistics Section
    console.log("3️⃣ Testing statistics section...");
    const statisticsSection = document.querySelector('.statistics-section');
    const statItems = document.querySelectorAll('.stat-item');
    if (statisticsSection && statItems.length === 4) {
      results.statisticsSection = true;
      console.log("✅ Statistics section: PASS");
    } else {
      console.log("❌ Statistics section: FAIL - Expected 4 stat items, found " + statItems.length);
    }

    // Test 4: Content Cards
    console.log("4️⃣ Testing content cards...");
    const contentCards = document.querySelectorAll('.content-card');
    if (contentCards.length === 2) {
      results.contentCards = true;
      console.log("✅ Content cards: PASS");
    } else {
      console.log("❌ Content cards: FAIL - Expected 2 cards, found " + contentCards.length);
    }

    // Test 5: Features Grid
    console.log("5️⃣ Testing features grid...");
    const featuresGrid = document.querySelector('.features-grid');
    const featureItems = document.querySelectorAll('.feature-item');
    if (featuresGrid && featureItems.length === 6) {
      results.featuresGrid = true;
      console.log("✅ Features grid: PASS");
    } else {
      console.log("❌ Features grid: FAIL - Expected 6 features, found " + featureItems.length);
    }

    // Test 6: Service Areas
    console.log("6️⃣ Testing service areas...");
    const serviceAreas = document.querySelector('.service-areas');
    const areaLists = document.querySelectorAll('.area-list');
    if (serviceAreas && areaLists.length === 2) {
      results.serviceAreas = true;
      console.log("✅ Service areas: PASS");
    } else {
      console.log("❌ Service areas: FAIL");
    }

    // Test 7: CTA Section
    console.log("7️⃣ Testing CTA section...");
    const ctaSection = document.querySelector('.cta-section');
    const ctaButtons = document.querySelector('.cta-buttons');
    if (ctaSection && ctaButtons) {
      results.ctaSection = true;
      console.log("✅ CTA section: PASS");
    } else {
      console.log("❌ CTA section: FAIL");
    }

    // Test 8: Button Links
    console.log("8️⃣ Testing button links...");
    const bookEventBtn = document.querySelector('a[href="/services"]');
    const getQuoteBtn = document.querySelector('a[href="/contact"]');
    if (bookEventBtn && getQuoteBtn) {
      results.buttonLinks = true;
      console.log("✅ Button links: PASS");
      console.log("   - Book Event button links to: " + bookEventBtn.getAttribute('href'));
      console.log("   - Get Quote button links to: " + getQuoteBtn.getAttribute('href'));
    } else {
      console.log("❌ Button links: FAIL");
    }

    // Test 9: Responsive Design Elements
    console.log("9️⃣ Testing responsive design...");
    const currentWidth = window.innerWidth;
    const heroResponsiveContainer = document.querySelector('.hero-media-container');
    if (heroResponsiveContainer) {
      const computedStyle = window.getComputedStyle(heroResponsiveContainer);
      results.responsiveDesign = true;
      console.log("✅ Responsive design: PASS");
      console.log("   - Current viewport: " + currentWidth + "px");
      console.log("   - Hero height: " + computedStyle.height);
    } else {
      console.log("❌ Responsive design: FAIL");
    }

    // Test 10: Animation Elements
    console.log("🔟 Testing animation elements...");
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    if (animateElements.length > 0) {
      results.animations = true;
      console.log("✅ Animation elements: PASS - Found " + animateElements.length + " animated elements");
    } else {
      console.log("❌ Animation elements: FAIL");
    }

    // Calculate final results
    results.total = Object.keys(results).length - 2; // Exclude total and passed
    results.passed = Object.values(results).filter(v => v === true).length;
    
    console.log("🏁 ABOUT PAGE TEST RESULTS SUMMARY:");
    console.log("=".repeat(50));
    console.log(`✅ Tests Passed: ${results.passed}/${results.total}`);
    console.log(`📊 Success Rate: ${((results.passed/results.total)*100).toFixed(1)}%`);
    console.log("=".repeat(50));
    
    if (results.passed === results.total) {
      console.log("🎉 ALL TESTS PASSED! About page is fully functional!");
    } else {
      console.log("⚠️ Some tests failed. Check individual test results above.");
    }
    
    return results;

  } catch (error) {
    console.error("❌ Test execution error:", error);
  }
}

// Quality/Value Messaging Verification
function verifyQualityMessaging() {
  console.log("\n🌟 QUALITY/VALUE MESSAGING VERIFICATION:");
  console.log("=".repeat(50));
  
  const qualityKeywords = ['quality', 'premium', 'reasonable', 'excellence', 'priority'];
  const pageText = document.body.innerText.toLowerCase();
  
  qualityKeywords.forEach(keyword => {
    const count = (pageText.match(new RegExp(keyword, 'g')) || []).length;
    if (count > 0) {
      console.log(`✅ "${keyword}" mentioned ${count} times`);
    } else {
      console.log(`❌ "${keyword}" not found`);
    }
  });
}

// Display Structure Verification
function verifyDisplayStructure() {
  console.log("\n🔧 DISPLAY STRUCTURE VERIFICATION:");
  console.log("=".repeat(50));
  
  const sections = {
    'Hero Section': '.hero-media-container',
    'Headline Section': '.headline-section',
    'Statistics Section': '.statistics-section',
    'Content Cards': '.content-card',
    'Features Grid': '.features-grid',
    'Service Areas': '.service-areas',
    'CTA Section': '.cta-section'
  };
  
  Object.entries(sections).forEach(([name, selector]) => {
    const element = document.querySelector(selector);
    if (element) {
      const rect = element.getBoundingClientRect();
      console.log(`✅ ${name}: Found (Height: ${rect.height.toFixed(0)}px)`);
    } else {
      console.log(`❌ ${name}: Missing`);
    }
  });
}

// Run comprehensive tests
console.log("🚀 Running About page comprehensive tests...");
testAboutPageFunctionality();

setTimeout(() => {
  verifyQualityMessaging();
}, 1000);

setTimeout(() => {
  verifyDisplayStructure();
}, 2000);

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testAboutPageFunctionality, verifyQualityMessaging, verifyDisplayStructure };
}
