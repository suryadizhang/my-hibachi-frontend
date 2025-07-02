"use client";

import { Suspense } from 'react';
import { LoadingSpinner } from './LoadingComponents';

// Ultra-fast streaming components with granular loading
const StreamingWrapper = ({ children, fallback, priority = 'normal' }) => {
  const LoadingComponent = () => (
    <div className={`streaming-loading ${priority}`}>
      {fallback || <LoadingSpinner size="sm" />}
    </div>
  );

  return (
    <Suspense fallback={<LoadingComponent />}>
      {children}
    </Suspense>
  );
};

// Micro-suspense for individual components
export const MicroSuspense = ({ children }) => (
  <Suspense fallback={
    <div className="micro-loading" style={{ 
      height: '20px', 
      background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite'
    }} />
  }>
    {children}
  </Suspense>
);

// Ultra-fast page wrapper
export const UltraFastPage = ({ children, priority = 'high' }) => (
  <div className={`ultra-fast-page priority-${priority}`}>
    <StreamingWrapper priority={priority}>
      {children}
    </StreamingWrapper>
  </div>
);

export default StreamingWrapper;
