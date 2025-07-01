# 🔧 Development Workflow Guide

## 🚀 Quick Start Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # Check ESLint issues
npm run lint:fix        # Auto-fix ESLint issues (when available)

# Performance
npm run analyze         # Bundle analysis
npm run lighthouse      # Performance audit
npm run perf           # Combined performance test
```

## 📝 Adding New Components

### 1. UI Components (Reusable)
```bash
# Create in src/components/ui/
touch src/components/ui/NewComponent.jsx
touch src/components/ui/NewComponent.css
```

### 2. Feature Components (Business Logic)
```bash
# Create in src/components/features/
touch src/components/features/NewFeature.jsx
touch src/components/features/NewFeature.css
```

### 3. Update Barrel Exports
```typescript
// Add to src/components/index.ts
export { default as NewComponent } from './ui/NewComponent';
export { default as NewFeature } from './features/NewFeature';
```

## 🧹 ESLint Cleanup Process

### Priority Order:
1. **Fix unused variables** - Remove or prefix with underscore
2. **Fix missing dependencies** - Add to useEffect dependencies
3. **Fix undefined variables** - Import or define properly
4. **Fix React hooks rules** - Follow hooks best practices

### Example Fixes:
```javascript
// ❌ Before: Unused variable
const [data, setData] = useState(null);

// ✅ After: Remove if unused, or prefix if intentionally unused
const [_data, setData] = useState(null);

// ❌ Before: Missing dependency
useEffect(() => {
  fetchData();
}, []);

// ✅ After: Add dependency or use useCallback
const fetchData = useCallback(() => {
  // fetch logic
}, [dependency]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

## 🎯 Component Best Practices

1. **Use TypeScript** for new components
2. **Add PropTypes** or TypeScript interfaces
3. **Follow naming conventions** - PascalCase for components
4. **Group related files** - component + styles + types
5. **Export from index files** for clean imports
6. **Use performance hooks** for expensive operations
7. **Implement error boundaries** for robust components

## 🔄 Continuous Improvement

- Fix ESLint issues gradually (5-10 per session)
- Add tests for critical components
- Document complex components
- Monitor performance metrics
- Review and refactor regularly
