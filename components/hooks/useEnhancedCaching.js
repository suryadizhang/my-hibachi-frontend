// Enhanced Caching Hook with Prefetch Strategy
// This hook implements smart caching for availability data with prefetching

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_BASE } from '../../lib/config/api';

export const useEnhancedCaching = () => {
  const [cache, setCache] = useState(new Map());
  const [pendingRequests, setPendingRequests] = useState(new Set());
  const cacheTimeouts = useRef(new Map());
  
  // Cache duration: 5 minutes for regular days, 2 minutes for popular days
  const CACHE_DURATION_REGULAR = 5 * 60 * 1000; // 5 minutes
  const CACHE_DURATION_POPULAR = 2 * 60 * 1000; // 2 minutes

  // Check if date is popular (weekends, Friday evenings)
  const isPopularDate = (date) => {
    const day = date.getDay();
    return day === 0 || day === 5 || day === 6; // Sunday, Friday, Saturday
  };

  // Get cache duration based on popularity
  const getCacheDuration = (dateStr) => {
    const date = new Date(dateStr);
    return isPopularDate(date) ? CACHE_DURATION_POPULAR : CACHE_DURATION_REGULAR;
  };

  // Check if cached data is still valid
  const isCacheValid = useCallback((dateStr) => {
    const cacheEntry = cache.get(dateStr);
    if (!cacheEntry) return false;
    
    const duration = getCacheDuration(dateStr);
    return Date.now() - cacheEntry.timestamp < duration;
  }, [cache]);

  // Get availability from cache or API
  const getAvailability = useCallback(async (dateStr) => {
    // Check cache first
    if (isCacheValid(dateStr)) {
      return cache.get(dateStr).data;
    }

    // Avoid duplicate requests
    if (pendingRequests.has(dateStr)) {
      // Wait for existing request
      return new Promise((resolve) => {
        const checkCache = () => {
          if (cache.has(dateStr)) {
            resolve(cache.get(dateStr).data);
          } else {
            setTimeout(checkCache, 100);
          }
        };
        checkCache();
      });
    }

    try {
      setPendingRequests(prev => new Set(prev).add(dateStr));
      
      const response = await axios.get(`${API_BASE}/api/booking/availability?date=${dateStr}`);
      const data = response.data;

      // Update cache
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(dateStr, {
          data,
          timestamp: Date.now()
        });
        return newCache;
      });

      // Set cache expiration
      const duration = getCacheDuration(dateStr);
      if (cacheTimeouts.current.has(dateStr)) {
        clearTimeout(cacheTimeouts.current.get(dateStr));
      }
      
      const timeout = setTimeout(() => {
        setCache(prev => {
          const newCache = new Map(prev);
          newCache.delete(dateStr);
          return newCache;
        });
        cacheTimeouts.current.delete(dateStr);
      }, duration);
      
      cacheTimeouts.current.set(dateStr, timeout);

      return data;
    } catch (error) {
      console.error('Error fetching availability:', error);
      throw error;
    } finally {
      setPendingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(dateStr);
        return newSet;
      });
    }
  }, [cache, isCacheValid, pendingRequests]);

  // Prefetch strategy: popular dates and surrounding dates
  const prefetchAvailability = useCallback(async (selectedDate) => {
    if (!selectedDate) return;

    const datesToPrefetch = [];
    const baseDate = new Date(selectedDate);

    // Prefetch next 3 days
    for (let i = 1; i <= 3; i++) {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      datesToPrefetch.push(date.toISOString().split('T')[0]);
    }

    // Prefetch previous 1 day
    const prevDate = new Date(baseDate);
    prevDate.setDate(baseDate.getDate() - 1);
    const prevDateStr = prevDate.toISOString().split('T')[0];
    if (prevDate >= new Date()) {
      datesToPrefetch.push(prevDateStr);
    }

    // Prefetch upcoming weekends within next 2 weeks
    const now = new Date();
    for (let i = 0; i <= 14; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      if (isPopularDate(date)) {
        const dateStr = date.toISOString().split('T')[0];
        if (!datesToPrefetch.includes(dateStr)) {
          datesToPrefetch.push(dateStr);
        }
      }
    }

    // Execute prefetch requests (but don't wait for them)
    datesToPrefetch.forEach(dateStr => {
      if (!isCacheValid(dateStr) && !pendingRequests.has(dateStr)) {
        getAvailability(dateStr).catch(() => {
          // Silently handle prefetch errors
        });
      }
    });
  }, [getAvailability, isCacheValid, pendingRequests]);

  // Bulk prefetch for multiple dates
  const bulkPrefetch = useCallback(async (dateStrings) => {
    const uncachedDates = dateStrings.filter(dateStr => 
      !isCacheValid(dateStr) && !pendingRequests.has(dateStr)
    );
    
    if (uncachedDates.length === 0) return;
    
    try {
      // Phase 1: Use bulk availability endpoint
      const response = await axios.post(`${API_BASE}/api/booking/bulk-availability`, uncachedDates);
      const bulkData = response.data;
      
      // Update cache with all results
      setCache(prev => {
        const newCache = new Map(prev);
        Object.entries(bulkData).forEach(([dateStr, data]) => {
          newCache.set(dateStr, {
            data,
            timestamp: Date.now()
          });
          
          // Set cache expiration
          const duration = getCacheDuration(dateStr);
          if (cacheTimeouts.current.has(dateStr)) {
            clearTimeout(cacheTimeouts.current.get(dateStr));
          }
          
          const timeout = setTimeout(() => {
            setCache(prevCache => {
              const updatedCache = new Map(prevCache);
              updatedCache.delete(dateStr);
              return updatedCache;
            });
            cacheTimeouts.current.delete(dateStr);
          }, duration);
          
          cacheTimeouts.current.set(dateStr, timeout);
        });
        return newCache;
      });
      
    } catch (error) {
      console.error('Error bulk fetching availability:', error);
      // Fallback to individual requests
      const promises = uncachedDates.map(dateStr => 
        getAvailability(dateStr).catch(() => null)
      );
      await Promise.allSettled(promises);
    }
  }, [getAvailability, isCacheValid, pendingRequests]);

  // Clear expired cache entries
  const clearExpiredCache = useCallback(() => {
    setCache(prev => {
      const newCache = new Map();
      for (const [dateStr, entry] of prev.entries()) {
        const duration = getCacheDuration(dateStr);
        if (Date.now() - entry.timestamp < duration) {
          newCache.set(dateStr, entry);
        }
      }
      return newCache;
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all timeouts
      for (const timeout of cacheTimeouts.current.values()) {
        clearTimeout(timeout);
      }
      cacheTimeouts.current.clear();
    };
  }, []);

  // Periodic cache cleanup
  useEffect(() => {
    const interval = setInterval(clearExpiredCache, 60000); // Every minute
    return () => clearInterval(interval);
  }, [clearExpiredCache]);

  return {
    getAvailability,
    prefetchAvailability,
    bulkPrefetch,
    isCacheValid,
    cacheSize: cache.size,
    clearCache: () => {
      setCache(new Map());
      for (const timeout of cacheTimeouts.current.values()) {
        clearTimeout(timeout);
      }
      cacheTimeouts.current.clear();
    }
  };
};
