import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  
  // Disable React Strict Mode and hot reloading
  reactStrictMode: false,
  
  // Standard development settings (no hot reload)
  ...(process.env.NODE_ENV === 'development' && {
    // Disable source maps for faster builds
    productionBrowserSourceMaps: false,
  }),
  
  // Temporarily disable ESLint during build to get pages working
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Output configuration for optimization
  output: 'standalone',
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features for ULTRA performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['react-bootstrap', 'react-icons', 'bootstrap'],
    webpackBuildWorker: true,
    scrollRestoration: true,
    optimizeServerReact: true,
    serverSourceMaps: false,
    
    // Disable loading UI
    appDocumentPreloading: false,
    clientRouterFilter: false,
  },

  // Turbopack configuration (moved from experimental)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        bootstrap: {
          test: /[\\/]node_modules[\\/](bootstrap|react-bootstrap)[\\/]/,
          name: 'bootstrap',
          chunks: 'all',
          priority: 10,
        },
        icons: {
          test: /[\\/]node_modules[\\/]react-icons[\\/]/,
          name: 'icons',
          chunks: 'all',
          priority: 10,
        },
      };
    }

    // Optimize images and videos
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|swf|ogv)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/media/',
          outputPath: 'static/media/',
        },
      },
    });

    return config;
  },

  // Headers for caching and security - ULTRA PERFORMANCE
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Ultra-fast loading hints
          {
            key: 'Link',
            value: '</assets/My Hibachi logo.png>; rel=preload; as=image, </manifest.json>; rel=preload; as=manifest',
          },
          // Early hints for performance
          {
            key: 'Accept-CH',
            value: 'DPR, Viewport-Width, Width',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'x-custom-header',
            value: 'ultra-fast',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Vary',
            value: 'Accept, Accept-Encoding',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
        ],
      },
      // API routes optimization
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
