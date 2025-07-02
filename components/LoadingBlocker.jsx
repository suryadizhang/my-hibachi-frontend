'use client'

import { useEffect } from 'react'

export default function LoadingBlocker() {
  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return

    // Function to remove Next.js loading elements
    const removeNextLoadingElements = () => {
      // Target specifically the SVG with data-next-mark-loading="false"
      const falseLoadingElements = document.querySelectorAll('svg[data-next-mark-loading="false"]')
      falseLoadingElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      })

      // Remove SVG elements with Next.js logo characteristics
      const svgElements = document.querySelectorAll('svg[viewBox="0 0 40 40"], svg[width="40"][height="40"]')
      svgElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      })

      // Remove elements with any Next.js loading attributes
      const loadingElements = document.querySelectorAll('[data-next-mark-loading]')
      loadingElements.forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el)
        }
      })
    }

    // Remove on mount
    removeNextLoadingElements()

    // Set up interval to catch the "false" state transitions
    const interval = setInterval(() => {
      const loadingIndicator = document.querySelector('svg[data-next-mark-loading="false"]')
      if (loadingIndicator) {
        loadingIndicator.remove()
      }
    }, 50)

    // Set up mutation observer to catch dynamically added elements
    const observer = new MutationObserver(() => {
      removeNextLoadingElements()
    })

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-next-mark-loading']
    })

    // Check periodically for the first few seconds
    const timeouts = [100, 200, 500, 1000, 2000].map(delay => 
      setTimeout(removeNextLoadingElements, delay)
    )

    return () => {
      clearInterval(interval)
      observer.disconnect()
      timeouts.forEach(clearTimeout)
    }
  }, [])

  return null // This component doesn't render anything
}
