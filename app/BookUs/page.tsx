'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the new modular booking system
const ModularBookingSystem = dynamic(() => import('../../components/booking/ModularBookingSystem'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading booking form...</div>
});

export default function BookUsPage() {
  return <ModularBookingSystem />;
}
