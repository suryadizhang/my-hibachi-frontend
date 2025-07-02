import { Suspense } from 'react'
import dynamic from 'next/dynamic'

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

export default function HomePage() {
  return (
    <div className="page-wrapper">
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <About />
      </Suspense>
    </div>
  )
}
