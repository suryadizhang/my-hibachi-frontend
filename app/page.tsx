import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { UltraFastPage } from '../src/components/performance/StreamingComponents'

// Ultra-fast dynamic imports with priority loading
const About = dynamic(() => import('../components/About'), {
  loading: () => (
    <div className="hero-skeleton">
      <div className="container py-5">
        <div className="row">
          <div className="col-12 text-center">
            <div className="placeholder-glow">
              <span className="placeholder col-8 placeholder-lg"></span>
            </div>
            <div className="placeholder-glow mt-3">
              <span className="placeholder col-6"></span>
              <span className="placeholder col-4"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Edge Runtime for maximum speed
export const runtime = 'edge'
export const revalidate = 3600

export default function HomePage() {
  return (
    <UltraFastPage priority="critical">
      <Suspense fallback={<div className="ultra-loading">Loading...</div>}>
        <About />
      </Suspense>
    </UltraFastPage>
  )
}
