import { WEBSITE_DATA, QA_PATTERNS, FALLBACK_RESPONSES } from './knowledgeBase';

// Test the knowledge base structure
console.log('🧪 Testing Enhanced Chatbot Knowledge Base...');

// Test 1: Verify knowledge base structure
const testKnowledgeBase = () => {
  console.log('✅ Services data:', WEBSITE_DATA.services ? 'Present' : 'Missing');
  console.log('✅ Menu data:', WEBSITE_DATA.menu ? 'Present' : 'Missing');
  console.log('✅ Booking data:', WEBSITE_DATA.booking ? 'Present' : 'Missing');
  console.log('✅ Contact data:', WEBSITE_DATA.contact ? 'Present' : 'Missing');
  console.log('✅ QA Patterns:', QA_PATTERNS.length > 0 ? `${QA_PATTERNS.length} patterns` : 'Missing');
  console.log('✅ Fallback responses:', FALLBACK_RESPONSES.length > 0 ? `${FALLBACK_RESPONSES.length} responses` : 'Missing');
};

// Test 2: Pattern matching simulation
const testPatternMatching = (message) => {
  const msg = message.toLowerCase();
  let bestMatch = null;
  let highestScore = 0;

  QA_PATTERNS.forEach(pattern => {
    const score = pattern.keywords.reduce((acc, keyword) => {
      return acc + (msg.includes(keyword) ? pattern.priority : 0);
    }, 0);
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = pattern.category;
    }
  });

  return { category: bestMatch, score: highestScore };
};

// Test 3: Sample queries
const testQueries = [
  "What's on your menu?",
  "How much does it cost?",
  "I want to book a party",
  "Do you have vegetarian options?",
  "Where do you serve?",
  "Random question about something else"
];

console.log('\n🧪 Testing Pattern Matching:');
testQueries.forEach(query => {
  const result = testPatternMatching(query);
  console.log(`Query: "${query}" -> Category: ${result.category || 'Unknown'} (Score: ${result.score})`);
});

// Run tests
testKnowledgeBase();

export { testKnowledgeBase, testPatternMatching };
