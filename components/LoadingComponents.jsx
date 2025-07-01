import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'primary',
  text = 'Loading...',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  return (
    <div className={`d-flex flex-column justify-content-center align-items-center p-4 ${className}`}>
      <div 
        className={`spinner-border text-${variant} ${sizeClasses[size]}`} 
        role="status"
        style={{ width: '2rem', height: '2rem' }}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && (
        <p className="mt-2 text-muted small mb-0">{text}</p>
      )}
    </div>
  );
};

// Skeleton loading for better UX
const SkeletonLoader = ({ lines = 3, className = '' }) => (
  <div className={`p-3 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div key={index} className="mb-2">
        <div 
          className="bg-light rounded" 
          style={{ 
            height: '1rem', 
            width: `${Math.random() * 40 + 60}%`,
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      </div>
    ))}
  </div>
);

// Page loading component
const PageLoader = ({ text = 'Loading page...' }) => (
  <div 
    className="d-flex justify-content-center align-items-center" 
    style={{ minHeight: '50vh' }}
  >
    <div className="text-center">
      <LoadingSpinner size="lg" text={text} />
    </div>
  </div>
);

export { LoadingSpinner, SkeletonLoader, PageLoader };
export default LoadingSpinner;
