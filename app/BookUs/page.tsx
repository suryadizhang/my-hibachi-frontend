'use client';

import dynamic from 'next/dynamic';

// Dynamic import to prevent SSR issues
const OrderServices = dynamic(() => import('../../components/OrderServices'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading booking form...</div>
});

export default function BookUsPage() {
  return <OrderServices />;
}
