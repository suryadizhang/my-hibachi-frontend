#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 My Hibachi Chef - Project Organization Helper\n');

// Check current organization status
const checkDirectory = (dirPath, name) => {
  const exists = fs.existsSync(dirPath);
  const files = exists ? fs.readdirSync(dirPath).length : 0;
  console.log(`${exists ? '✅' : '❌'} ${name}: ${files} files`);
  return { exists, files };
};

console.log('📁 Directory Structure Status:');
const dirs = [
  ['src/components/layout', 'Layout Components'],
  ['src/components/ui', 'UI Components'],
  ['src/components/features', 'Feature Components'],
  ['src/components/admin', 'Admin Components'],
  ['src/components/performance', 'Performance Components'],
  ['src/hooks', 'Custom Hooks'],
  ['src/lib/utils', 'Utilities'],
  ['src/types', 'Type Definitions'],
  ['src/constants', 'Constants'],
  ['tests', 'Tests'],
  ['docs', 'Documentation'],
];

dirs.forEach(([dir, name]) => {
  checkDirectory(dir, name);
});

console.log('\n🔧 Recommended Actions:');

// Check if old components directory still has files
const oldComponentsDir = 'components';
if (fs.existsSync(oldComponentsDir)) {
  const oldFiles = fs.readdirSync(oldComponentsDir);
  if (oldFiles.length > 0) {
    console.log(`📦 Move ${oldFiles.length} files from 'components/' to organized structure`);
    console.log('   Suggested commands:');
    console.log('   - Copy-Item "components\\EnhancedChatBot.jsx" "src\\components\\features\\ChatBot.jsx"');
    console.log('   - Copy-Item "components\\faqs\\*" "src\\components\\features\\FAQSection\\"');
    console.log('   - Copy-Item "components\\forms\\*" "src\\components\\ui\\"');
  }
}

// Check package.json scripts
const packagePath = 'package.json';
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('\n📋 Package.json Scripts:');
  Object.keys(pkg.scripts || {}).forEach(script => {
    console.log(`   ✅ npm run ${script}`);
  });
}

console.log('\n🎉 Organization Tips:');
console.log('1. Use absolute imports: @/src/components');
console.log('2. Keep related files together (component + styles + types)');
console.log('3. Export from index files for clean imports');
console.log('4. Follow naming conventions: PascalCase for components');
console.log('5. Add TypeScript types for better development experience');

console.log('\n🚀 Ready to continue development!');
console.log('   npm run dev    - Start development server');
console.log('   npm run build  - Production build');
console.log('   npm run test   - Run tests (when configured)');
