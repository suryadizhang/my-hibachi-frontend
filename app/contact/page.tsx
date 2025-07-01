// Ultra-fast Contact page using PPR - Static shell with dynamic form
import { Metadata } from 'next';
import Contact from '../../src/components/features/Contact';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Contact Us - My Hibachi Chef | Book Your Event',
    description: 'Contact My Hibachi Chef to book your premium hibachi catering experience. Get a quote today!',
    keywords: 'contact hibachi chef, book hibachi catering, hibachi quote, event booking',
  };
}

// Server Component with static shell (PPR)
export default function ContactPage() {
  return <Contact />;
}

// Static Generation - No revalidation needed for fixed contact content
