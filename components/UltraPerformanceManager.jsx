"use client";

import { useEffect, useCallback, useRef } from 'react';

const UltraPerformanceManager = () => {
  const priorityRef = useRef(new Map());
  const intersectionObserverRef = useRef(null);

  // Ultra-fast resource prioritization
  const prioritizeResources = useCallback(() => {
    if (typeof document === 'undefined') return;
    
    // Preload critical fonts with highest priority
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];

    criticalFonts.forEach(fontUrl => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images with highest priority
    const criticalImages = [
      '/assets/My Hibachi logo.png',
      '/assets/hero_pic.png'
    ];

    criticalImages.forEach(src => {
      if (typeof Image !== 'undefined') {
        const img = new Image();
        if ('loading' in img) img.loading = 'eager';
        if ('fetchPriority' in img) img.fetchPriority = 'high';
        img.src = src;
      }
    });
  }, []);

  // Ultra-fast intersection observer for lazy loading
  const setupUltraLazyLoading = useCallback(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;
    
    const options = {
      rootMargin: '50px 0px', // Start loading 50px before element enters viewport
      threshold: 0.1
    };

    intersectionObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          // Ultra-fast image loading
          if (target.dataset.src) {
            if (typeof Image !== 'undefined') {
              const img = new Image();
              img.onload = () => {
                target.src = target.dataset.src;
                target.classList.add('loaded');
              };
              img.onerror = () => {
                target.classList.add('error');
              };
              img.src = target.dataset.src;
            }
          }

          // Ultra-fast component loading
          if (target.dataset.component) {
            // Use static import paths that webpack can analyze
            const componentName = target.dataset.component;
            let componentPromise;
            
            switch (componentName) {
              case 'About':
                componentPromise = import('../components/About');
                break;
              case 'Menu':
                componentPromise = import('../components/Menu');
                break;
              case 'Contact':
                componentPromise = import('../components/Contact');
                break;
              case 'Reviews':
                componentPromise = import('../components/Reviews');
                break;
              default:
                console.warn(`Component ${componentName} not found`);
                return;
            }
            
            componentPromise
              .then(module => {
                target.innerHTML = `<div>Component ${componentName} loaded</div>`;
              })
              .catch(error => {
                console.error(`Failed to load component ${componentName}:`, error);
              });
          }

          intersectionObserverRef.current?.unobserve(target);
        }
      });
    }, options);

    // Observe all lazy elements
    document.querySelectorAll('[data-src], [data-component]').forEach(el => {
      intersectionObserverRef.current?.observe(el);
    });
  }, []);

  // Ultra-fast prefetching for next page
  const prefetchNextPage = useCallback(() => {
    const links = document.querySelectorAll('a[href^="/"]');
    const prefetchMap = new Map();

    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        const href = link.getAttribute('href');
        if (!prefetchMap.has(href)) {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
          prefetchMap.set(href, true);
        }
      }, { once: true });
    });
  }, []);

  // Ultra-fast memory management
  const optimizeMemory = useCallback(() => {
    // Clean up unused resources
    const cleanupInterval = setInterval(() => {
      // Remove unused prefetch links
      document.querySelectorAll('link[rel="prefetch"]').forEach(link => {
        if (Date.now() - link.dataset.created > 30000) { // 30 seconds
          link.remove();
        }
      });

      // Clear unused image cache
      if ('caches' in window) {
        caches.open('ultra-images').then(cache => {
          cache.keys().then(keys => {
            keys.forEach(key => {
              // Simple cache cleanup without timestamp dependency
              cache.delete(key);
            });
          });
        }).catch(error => {
          console.warn('Cache cleanup failed:', error);
        });
      }
    }, 60000); // Every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  // Ultra-fast network optimization
  const optimizeNetwork = useCallback(() => {
    // Implement connection-aware loading with proper feature detection
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        if (connection.effectiveType === '4g') {
          // High-quality assets for fast connections
          document.documentElement.classList.add('high-quality');
        } else {
          // Optimized assets for slower connections
          document.documentElement.classList.add('low-bandwidth');
        }

        // Adjust loading based on save-data preference
        if (connection.saveData) {
          document.documentElement.classList.add('save-data');
        }
      }
    }
  }, []);

  // Ultra-fast scroll optimization
  const optimizeScrolling = useCallback(() => {
    if (typeof window === 'undefined') return () => {};
    
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Optimize scroll performance
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          // Hide/show navbar based on scroll direction
          if (scrollTop > 100) {
            document.body.classList.add('scrolled');
          } else {
            document.body.classList.remove('scrolled');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Initialize ultra-performance features
    const cleanup = [];

    prioritizeResources();
    cleanup.push(optimizeMemory());
    cleanup.push(optimizeScrolling());
    
    // Delay non-critical optimizations
    const timer = setTimeout(() => {
      setupUltraLazyLoading();
      prefetchNextPage();
      optimizeNetwork();
    }, 100);

    return () => {
      clearTimeout(timer);
      cleanup.forEach(fn => fn?.());
      intersectionObserverRef.current?.disconnect();
    };
  }, []);

  return null;
};

export default UltraPerformanceManager;
