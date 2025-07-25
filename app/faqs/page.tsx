'use client';

import dynamic from 'next/dynamic';

// Dynamic import for the FAQs component
const FAQs = dynamic(() => import('../../components/faqs/FAQs'), {
  ssr: false,
  loading: () => <div className="text-center p-8">Loading FAQs...</div>
});

export default function FAQsPage() {
  return <FAQs />;
}
