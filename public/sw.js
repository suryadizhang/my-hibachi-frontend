// ULTRA-PERFORMANCE Service Worker
const CACHE_NAME = 'my-hibachi-ultra-v2';
const STATIC_CACHE = 'static-ultra-v2';
const DYNAMIC_CACHE = 'dynamic-ultra-v2';
const IMAGE_CACHE = 'images-ultra-v2';

// Ultra-critical resources for instant loading
const ULTRA_CRITICAL = [
  '/',
  '/assets/My Hibachi logo.png',
  '/_next/static/css/app/layout.css',
  '/manifest.json'
];

// Static resources with long-term caching
const STATIC_RESOURCES = [
  '/about',
  '/menu', 
  '/contact',
  '/reviews',
  '/faqs'
];

// Ultra-fast install with critical resource caching
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Ultra-critical cache
      caches.open(CACHE_NAME).then(cache => cache.addAll(ULTRA_CRITICAL)),
      // Static resources cache
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_RESOURCES))
    ]).then(() => self.skipWaiting())
  );
});

// Ultra-fast fetch with intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ultra-fast strategy for different resource types
  if (request.destination === 'image') {
    event.respondWith(ultraFastImageStrategy(request));
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(ultraFastStaticStrategy(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(ultraFastAPIStrategy(request));
  } else {
    event.respondWith(ultraFastPageStrategy(request));
  }
});

// Ultra-fast image caching with WebP optimization
async function ultraFastImageStrategy(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      // Clone and cache successful responses
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return placeholder for failed images
    return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="100%" height="100%" fill="#f0f0f0"/><text x="50%" y="50%" text-anchor="middle" fill="#999">Image not available</text></svg>', {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}

// Ultra-fast static resource caching (immutable resources)
async function ultraFastStaticStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }

  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

// Ultra-fast API caching with network-first strategy
async function ultraFastAPIStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || new Response('{"error": "Network error"}', {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Ultra-fast page caching with stale-while-revalidate
async function ultraFastPageStrategy(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  // Return cached version immediately
  if (cached) {
    // Fetch fresh version in background
    fetch(request).then(response => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
    }).catch(() => {}); // Ignore background fetch errors
    
    return cached;
  }

  // No cache, fetch from network
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    // Return offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
        <head><title>Offline - My Hibachi Chef</title></head>
        <body style="font-family: system-ui; text-align: center; padding: 2rem;">
          <h1>You're Offline</h1>
          <p>Please check your connection and try again.</p>
        </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});
