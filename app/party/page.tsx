'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the PartyGuestProteinForm component
const PartyGuestProteinForm = dynamic(() => import('../../components/PartyGuestProteinForm'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading party form...</div>
});

export default function PartyPage() {
  return <PartyGuestProteinForm />;
}
