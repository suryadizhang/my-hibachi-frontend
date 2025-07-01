'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the Reviews component
const Reviews = dynamic(() => import('../../components/Reviews'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading reviews...</div>
});

export default function ReviewsPage() {
  return <Reviews />;
}
