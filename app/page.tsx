'use client'

import dynamic from 'next/dynamic'

// Dynamically import About component with no SSR
const About = dynamic(() => import('../components/About'), {
  ssr: false,
  loading: () => <div>Loading...</div>
})

export default function HomePage() {
  return <About />;
}
