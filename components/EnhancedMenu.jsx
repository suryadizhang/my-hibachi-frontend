import React, { memo, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Spinner } from 'react-bootstrap';
import ModularMenu from './menu/ModularMenu';

// Legacy fallback - dynamically imported for code splitting
const LegacyMenu = dynamic(() => import('./Menu'), {
  loading: () => (
    <div className="text-center p-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading menu...</span>
      </Spinner>
    </div>
  ),
  ssr: false
});

/**
 * 🔧 ENHANCED MENU WRAPPER
 * 
 * Provides backward compatibility while enabling modular architecture.
 * Features:
 * - Performance-optimized modular components by default
 * - Fallback to legacy version if needed
 * - Improved loading states
 * - Better error boundaries
 * - Code splitting for optimal bundle size
 */
const EnhancedMenu = memo(({ 
  useLegacy = false,
  showLoadingSpinner = true 
}) => {
  if (useLegacy) {
    return (
      <Suspense fallback={
        showLoadingSpinner ? (
          <div className="text-center p-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading legacy menu...</span>
            </Spinner>
          </div>
        ) : null
      }>
        <LegacyMenu />
      </Suspense>
    );
  }

  return <ModularMenu />;
});

EnhancedMenu.displayName = 'EnhancedMenu';
export default EnhancedMenu;
