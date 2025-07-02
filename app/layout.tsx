import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import ClientLayout from '../components/ClientLayout'
import LoadingBlocker from '../components/LoadingBlocker'
import PerformanceOptimizer from '../src/components/performance/PerformanceOptimizer'
import WebVitalsMonitor from '../src/components/performance/WebVitalsMonitor'

// Optimize font loading
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'My Hibachi Chef - Premium Hibachi Catering',
  description: 'Experience authentic hibachi dining at your location with our professional chefs.',
  keywords: 'hibachi, catering, chef, japanese, cooking, entertainment, party, event',
  authors: [{ name: 'My Hibachi Chef' }],
  creator: 'My Hibachi Chef',
  publisher: 'My Hibachi Chef',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myhibachichef.com',
    title: 'My Hibachi Chef - Premium Hibachi Catering',
    description: 'Experience authentic hibachi dining at your location with our professional chefs.',
    siteName: 'My Hibachi Chef',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Hibachi Chef - Premium Hibachi Catering',
    description: 'Experience authentic hibachi dining at your location with our professional chefs.',
  },
  verification: {
    google: 'your-google-verification-code', // Add your verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Critical resource hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/assets/My Hibachi logo.png" as="image" />
        
        {/* Critical CSS preload */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        
        {/* Viewport and mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#DB2B28" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Apple specific optimizations */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="My Hibachi Chef" />
        
        {/* IMMEDIATE Next.js loading blocker - moved to end */}
        <script src="/block-next-loading.js" defer />
      </head>
      <body className={inter.className}>
        <LoadingBlocker />
        <PerformanceOptimizer />
        <WebVitalsMonitor />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
