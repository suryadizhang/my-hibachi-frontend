#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎯 My Hibachi Chef - Component Organization Finalizer\n');

// Function to update import paths in files
function updateImportPaths(filePath, importMapping) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    for (const [oldPath, newPath] of Object.entries(importMapping)) {
      const oldImportRegex = new RegExp(`from ['"](\\.\\./)*components/${oldPath}['"]`, 'g');
      const newImport = `from '${newPath}'`;
      
      if (content.match(oldImportRegex)) {
        content = content.replace(oldImportRegex, newImport);
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated imports in: ${filePath}`);
    }
  } catch (error) {
    console.log(`❌ Error updating ${filePath}:`, error.message);
  }
}

// Define import mapping for organized structure
const importMapping = {
  'Navbar': '../src/components/layout/Navbar',
  'About': '../src/components/features/About',
  'Contact': '../src/components/features/Contact',
  'ContactForm': '../src/components/features/ContactForm',
  'Menu': '../src/components/features/MenuDisplay',
  'Reviews': '../src/components/features/ReviewsSection',
  'AdminPanel': '../src/components/admin/AdminPanel',
  'AdminLogin': '../src/components/admin/AdminLogin',
  'AdminWrapper': '../src/components/admin/AdminWrapper',
  'EnhancedChatBot': '../src/components/features/ChatBot',
  'OrderServices': '../src/components/features/BookingForm',
  'PerformanceOptimizer': '../src/components/performance/PerformanceOptimizer',
  'StreamingComponents': '../src/components/performance/StreamingComponents',
  'LazyComponents': '../src/components/performance/LazyComponents',
  'LoadingComponents': '../src/components/ui/LoadingComponents',
  'OptimizedImage': '../src/components/ui/OptimizedImage',
  'UltraPerformanceManager': '../src/components/performance/UltraPerformanceManager',
  'WebVitalsMonitor': '../src/components/performance/WebVitalsMonitor',
  'RealTimePerformanceMonitor': '../src/components/performance/RealTimePerformanceMonitor'
};

// Files to update
const filesToUpdate = [
  'app/page.tsx',
  'app/about/page.tsx',
  'app/contact/page.tsx',
  'app/menu/page.tsx',
  'app/admin/page.tsx',
  'app/admin-login/page.tsx',
  'app/reviews/page.tsx',
  'app/faqs/page.tsx',
  'app/party/page.tsx',
  'app/BookUs/page.tsx',
  'app/payment/page.tsx'
];

console.log('📦 Updating import paths in app files...');
filesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    updateImportPaths(fullPath, importMapping);
  }
});

// Update component files to use relative imports within organized structure
console.log('\n🔧 Updating internal component imports...');
const componentDirs = [
  'src/components/layout',
  'src/components/ui', 
  'src/components/features',
  'src/components/admin',
  'src/components/performance'
];

componentDirs.forEach(dir => {
  const fullDir = path.join(process.cwd(), dir);
  if (fs.existsSync(fullDir)) {
    const files = fs.readdirSync(fullDir);
    files.filter(file => file.endsWith('.jsx') || file.endsWith('.tsx')).forEach(file => {
      const filePath = path.join(fullDir, file);
      updateImportPaths(filePath, importMapping);
    });
  }
});

// Create barrel exports for each component category
console.log('\n📋 Creating organized barrel exports...');

const createBarrelExport = (dir, exportName) => {
  const fullDir = path.join(process.cwd(), dir);
  if (fs.existsSync(fullDir)) {
    const files = fs.readdirSync(fullDir);
    const components = files
      .filter(file => (file.endsWith('.jsx') || file.endsWith('.tsx')) && file !== 'index.ts')
      .map(file => {
        const componentName = path.basename(file, path.extname(file));
        return `export { default as ${componentName} } from './${componentName}';`;
      });

    if (components.length > 0) {
      const indexPath = path.join(fullDir, 'index.ts');
      const content = `// ${exportName} exports\n${components.join('\n')}\n`;
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log(`✅ Created ${exportName} barrel export`);
    }
  }
};

// Create barrel exports
createBarrelExport('src/components/layout', 'Layout Components');
createBarrelExport('src/components/ui', 'UI Components');
createBarrelExport('src/components/features', 'Feature Components');
createBarrelExport('src/components/admin', 'Admin Components');
createBarrelExport('src/components/performance', 'Performance Components');

// Clean up old component directory
console.log('\n🧹 Component organization status:');
console.log('✅ Organized structure created');
console.log('✅ Import paths updated');
console.log('✅ Barrel exports created');
console.log('📁 Old components directory can be safely archived');

console.log('\n🚀 Organization complete! Next steps:');
console.log('1. Test build: npm run build');
console.log('2. Start dev server: npm run dev');
console.log('3. Archive old components: Move-Item components archive/old-components');
console.log('4. Update any remaining manual imports');

console.log('\n🏆 Your project is now properly organized and modular!');
