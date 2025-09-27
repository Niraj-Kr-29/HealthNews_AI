import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export const PullToRefresh = ({ onRefresh, isRefreshing, children }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isTriggered, setIsTriggered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const threshold = 80;

  const handleTouchStart = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && window.scrollY === 0 && startY.current > 0) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(0, currentY - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
        setIsTriggered(distance > threshold);
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isTriggered && !isRefreshing) {
      await onRefresh();
    }
    
    setPullDistance(0);
    setIsTriggered(false);
    setIsDragging(false);
    startY.current = 0;
  };

  // Mouse events for desktop testing
  const handleMouseDown = (e) => {
    if (window.scrollY === 0) {
      startY.current = e.clientY;
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && window.scrollY === 0 && startY.current > 0) {
      const currentY = e.clientY;
      const distance = Math.max(0, currentY - startY.current);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, threshold * 1.5));
        setIsTriggered(distance > threshold);
      }
    }
  };

  const handleMouseUp = async () => {
    if (isTriggered && !isRefreshing) {
      await onRefresh();
    }
    
    setPullDistance(0);
    setIsTriggered(false);
    setIsDragging(false);
    startY.current = 0;
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (!isRefreshing) {
      setPullDistance(0);
      setIsTriggered(false);
    }
  }, [isRefreshing]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      className="min-h-screen select-none"
    >
      {/* Pull indicator */}
      <div
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-center transition-all duration-200 ease-out"
        style={{
          height: pullDistance > 0 || isRefreshing ? '60px' : '0px',
          transform: `translateY(${Math.min(pullDistance - 20, 40)}px)`,
          opacity: pullDistance > 20 || isRefreshing ? 1 : 0
        }}
      >
        <div className="bg-white shadow-lg rounded-full p-3 flex items-center space-x-2">
          <RefreshCw 
            className={`w-5 h-5 text-emerald-600 ${
              isRefreshing || isTriggered ? 'animate-spin' : ''
            }`} 
          />
          <span className="text-sm text-gray-700 font-medium">
            {isRefreshing ? 'Refreshing...' : isTriggered ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          transform: pullDistance > 0 ? `translateY(${Math.min(pullDistance * 0.5, 40)}px)` : 'none',
          transition: pullDistance > 0 ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
};