const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Next.js + Tailwind CSS Configuration...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.ts',
  'postcss.config.mjs',
  'tailwind.config.js',
  'app/globals.css',
  'app/layout.tsx',
  'app/page.tsx'
];

console.log('📁 Checking required files:');
requiredFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  const exists = fs.existsSync(filePath);
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
});

// Check package.json dependencies
console.log('\n📦 Checking dependencies:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'tailwindcss',
  'postcss',
  'autoprefixer'
];

requiredDeps.forEach(dep => {
  const hasInDeps = packageJson.dependencies && packageJson.dependencies[dep];
  const hasInDevDeps = packageJson.devDependencies && packageJson.devDependencies[dep];
  const exists = hasInDeps || hasInDevDeps;
  console.log(`  ${exists ? '✅' : '❌'} ${dep} ${exists ? `(${hasInDeps ? packageJson.dependencies[dep] : packageJson.devDependencies[dep]})` : ''}`);
});

// Check build output
console.log('\n🏗️  Checking build output:');
const nextDir = path.join(process.cwd(), '.next');
const buildExists = fs.existsSync(nextDir);
console.log(`  ${buildExists ? '✅' : '❌'} .next directory exists`);

if (buildExists) {
  const serverDir = path.join(nextDir, 'server');
  const serverExists = fs.existsSync(serverDir);
  console.log(`  ${serverExists ? '✅' : '❌'} Server build exists`);
}

console.log('\n🎉 Configuration verification complete!');
console.log('\n🚀 Ready to start development server with: npm run dev');
console.log('🏆 Ready for production build with: npm run build');
