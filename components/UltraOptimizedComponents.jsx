"use client";

import { memo, useMemo, useCallback, useState } from 'react';

// Ultra-optimized component with React.memo and advanced optimizations
const UltraOptimizedComponent = memo(({ data, onAction }) => {
  // Memoize expensive calculations
  const processedData = useMemo(() => {
    if (!data) return [];
    
    return data.map(item => ({
      ...item,
      processed: true,
      timestamp: Date.now()
    }));
  }, [data]);

  // Memoize callback functions
  const handleClick = useCallback((id) => {
    onAction?.(id);
  }, [onAction]);

  const handleOptimizedScroll = useCallback(() => {
    // Optimized scroll handler with throttling
    let ticking = false;
    
    return (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Handle scroll
          ticking = false;
        });
        ticking = true;
      }
    };
  }, []);

  return (
    <div className="ultra-optimized-component">
      {processedData.map((item) => (
        <div 
          key={item.id} 
          className="optimized-item"
          onClick={() => handleClick(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
});

UltraOptimizedComponent.displayName = 'UltraOptimizedComponent';

// Advanced List Component with virtualization for large datasets
const VirtualizedList = memo(({ items, itemHeight = 50, containerHeight = 400 }) => {
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(Math.ceil(containerHeight / itemHeight));
  
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  const handleScroll = useCallback((e) => {
    const scrollTop = e.target.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    const newEndIndex = Math.min(
      newStartIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    setStartIndex(newStartIndex);
    setEndIndex(newEndIndex);
  }, [itemHeight, containerHeight, items.length]);

  return (
    <div 
      className="virtualized-container"
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: (startIndex + index) * itemHeight,
              height: itemHeight,
              width: '100%',
            }}
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
});

VirtualizedList.displayName = 'VirtualizedList';

export { UltraOptimizedComponent, VirtualizedList };
export default UltraOptimizedComponent;
