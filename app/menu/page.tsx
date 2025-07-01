// Ultra-fast Menu page using SSG with ISR - FASTEST rendering technique
import { Metadata } from 'next';
import MenuDisplay from '../../src/components/features/MenuDisplay';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Menu - My Hibachi Chef | Hibachi Catering Menu',
    description: 'Explore our premium hibachi menu featuring fresh meats, seafood, vegetables, and signature sauces.',
    keywords: 'hibachi menu, japanese food, steak, chicken, shrimp, vegetables, catering menu',
  };
}

// Server Component for ultra-fast static rendering
export default function MenuPage() {
  return <MenuDisplay />;
}

// Static Generation - No revalidation needed for fixed menu content
