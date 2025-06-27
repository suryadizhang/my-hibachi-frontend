// Test the FAQ search functionality
import React from 'react';
import faqData from './src/components/faqs/faqData_organized.jsx';

// Helper function to extract text from React elements (same as in FAQs.jsx)
const extractTextFromReactElement = (element) => {
  if (typeof element === 'string') {
    return element;
  }
  if (typeof element === 'number') {
    return element.toString();
  }
  if (React.isValidElement(element)) {
    if (element.props && element.props.children) {
      if (Array.isArray(element.props.children)) {
        return element.props.children
          .map(child => extractTextFromReactElement(child))
          .join(' ');
      }
      return extractTextFromReactElement(element.props.children);
    }
  }
  if (Array.isArray(element)) {
    return element.map(item => extractTextFromReactElement(item)).join(' ');
  }
  return '';
};

// Test search functionality
function testSearch(searchTerm) {
  console.log(`\n🔍 Testing search for: "${searchTerm}"`);
  
  const filtered = {};
  Object.entries(faqData).forEach(([category, items]) => {
    const filteredItems = items.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      const headerMatch = item.header.toLowerCase().includes(searchLower);
      
      // Extract text content from JSX body for searching
      const bodyText = extractTextFromReactElement(item.body).toLowerCase();
      const bodyMatch = bodyText.includes(searchLower);
      
      return headerMatch || bodyMatch;
    });
    
    if (filteredItems.length > 0) {
      filtered[category] = filteredItems;
    }
  });
  
  const totalResults = Object.values(filtered).reduce((total, items) => total + items.length, 0);
  console.log(`✅ Found ${totalResults} results in ${Object.keys(filtered).length} categories`);
  
  Object.entries(filtered).forEach(([category, items]) => {
    console.log(`  📁 ${category}: ${items.length} result(s)`);
  });
  
  return filtered;
}

// Test different search terms
console.log('🧪 FAQ Search Functionality Test');
console.log('=================================');

testSearch('price');
testSearch('vegetarian');
testSearch('booking');
testSearch('safety');
testSearch('chef');
testSearch('deposit');

// Test categories
console.log('\n📋 Available Categories:');
Object.keys(faqData).forEach(category => {
  console.log(`  ${category}: ${faqData[category].length} questions`);
});

console.log('\n✅ FAQ Search Test Complete!');
