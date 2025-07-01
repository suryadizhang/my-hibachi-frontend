'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the CreditCardPayment component
const CreditCardPayment = dynamic(() => import('../../components/CreditCardPayment'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading payment form...</div>
});

export default function PaymentPage() {
  return <CreditCardPayment />;
}
