import { lazy, Suspense } from 'react';

// Lazy load heavy admin components
const AdminPanel = lazy(() => import('./AdminPanel'));
const NewsletterManager = lazy(() => import('./NewsletterManager'));
const LogPanel = lazy(() => import('./LogPanel'));
const SuperAdminManager = lazy(() => import('./SuperAdminManager'));

// Loading component for suspense
const ComponentLoader = ({ text = 'Loading...' }) => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">{text}</span>
    </div>
  </div>
);

// Lazy wrapped components
export const LazyAdminPanel = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading Admin Panel..." />}>
    <AdminPanel {...props} />
  </Suspense>
);

export const LazyNewsletterManager = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading Newsletter Manager..." />}>
    <NewsletterManager {...props} />
  </Suspense>
);

export const LazyLogPanel = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading Log Panel..." />}>
    <LogPanel {...props} />
  </Suspense>
);

export const LazySuperAdminManager = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading Super Admin Manager..." />}>
    <SuperAdminManager {...props} />
  </Suspense>
);

// Lazy load other heavy components
const Reviews = lazy(() => import('./Reviews'));
const Menu = lazy(() => import('./Menu'));
const FAQs = lazy(() => import('./faqs/FAQs'));

export const LazyReviews = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading Reviews..." />}>
    <Reviews {...props} />
  </Suspense>
);

export const LazyMenu = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading Menu..." />}>
    <Menu {...props} />
  </Suspense>
);

export const LazyFAQs = (props) => (
  <Suspense fallback={<ComponentLoader text="Loading FAQs..." />}>
    <FAQs {...props} />
  </Suspense>
);

export default {
  LazyAdminPanel,
  LazyNewsletterManager,
  LazyLogPanel,
  LazySuperAdminManager,
  LazyReviews,
  LazyMenu,
  LazyFAQs
};
