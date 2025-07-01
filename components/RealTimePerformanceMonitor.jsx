"use client";

import { useEffect, useState } from 'react';

const RealTimePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    fps: 0
  });
  const [showMonitor, setShowMonitor] = useState(false);

  useEffect(() => {
    // Show monitor in development
    if (process.env.NODE_ENV === 'development') {
      setShowMonitor(true);
    }

    let frameCount = 0;
    let lastTime = performance.now();
    
    // FPS monitoring
    const measureFPS = () => {
      frameCount++;
      const now = performance.now();
      
      if (now >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frameCount = 0;
        lastTime = now;
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    measureFPS();

    // Ultra-fast Web Vitals monitoring
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries().find(e => e.name === 'first-contentful-paint');
        if (entry) {
          setMetrics(prev => ({ ...prev, fcp: Math.round(entry.startTime) }));
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: Math.round(lastEntry.startTime) }));
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0];
        const fid = entry.processingStart - entry.startTime;
        setMetrics(prev => ({ ...prev, fid: Math.round(fid) }));
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Navigation timing for TTFB
      const navObserver = new PerformanceObserver((list) => {
        const entry = list.getEntries()[0];
        const ttfb = entry.responseStart - entry.requestStart;
        setMetrics(prev => ({ ...prev, ttfb: Math.round(ttfb) }));
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setMetrics(prev => ({ ...prev, cls: Math.round(clsValue * 1000) / 1000 }));
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      return () => {
        fcpObserver.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
        navObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, []);

  // Performance scoring
  const getScore = (metric, value) => {
    const thresholds = {
      fcp: { good: 1800, poor: 3000 },
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      ttfb: { good: 600, poor: 1500 },
      fps: { good: 55, poor: 30 }
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'unknown';

    if (metric === 'fps') {
      return value >= threshold.good ? 'good' : value >= threshold.poor ? 'needs-improvement' : 'poor';
    } else {
      return value <= threshold.good ? 'good' : value <= threshold.poor ? 'needs-improvement' : 'poor';
    }
  };

  if (!showMonitor) return null;

  return (
    <div className="perf-monitor">
      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '10px' }}>
        🚀 ULTRA PERFORMANCE
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '10px' }}>
        <div className={`metric-${getScore('fcp', metrics.fcp)}`}>
          FCP: {metrics.fcp}ms
        </div>
        <div className={`metric-${getScore('lcp', metrics.lcp)}`}>
          LCP: {metrics.lcp}ms
        </div>
        <div className={`metric-${getScore('fid', metrics.fid)}`}>
          FID: {metrics.fid}ms
        </div>
        <div className={`metric-${getScore('cls', metrics.cls)}`}>
          CLS: {metrics.cls}
        </div>
        <div className={`metric-${getScore('ttfb', metrics.ttfb)}`}>
          TTFB: {metrics.ttfb}ms
        </div>
        <div className={`metric-${getScore('fps', metrics.fps)}`}>
          FPS: {metrics.fps}
        </div>
      </div>
      
      <style jsx>{`
        .metric-good { color: #00ff00; }
        .metric-needs-improvement { color: #ffaa00; }
        .metric-poor { color: #ff0000; }
      `}</style>
    </div>
  );
};

export default RealTimePerformanceMonitor;
