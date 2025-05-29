"use client";

import { useState, useEffect, useCallback } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { debounce } from "@/lib/performance";

interface MobileOptimizedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: string;
}

export function MobileOptimized({
  children,
  fallback,
  threshold = "(max-width: 768px)",
}: MobileOptimizedProps) {
  const isMobile = useMediaQuery(threshold);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return fallback || null;
  }

  return isMobile ? <>{children}</> : fallback || <>{children}</>;
}

// Hook לאופטימיזציה במובייל
export function useMobileOptimization() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [touchDevice, setTouchDevice] = useState(false);

  useEffect(() => {
    setTouchDevice("ontouchstart" in window);
  }, []);

  // אופטימיזציה לגלילה במובייל
  const optimizedScroll = useCallback(
    debounce((callback: () => void) => {
      if (isMobile) {
        requestAnimationFrame(callback);
      } else {
        callback();
      }
    }, 16), // 60fps
    [isMobile]
  );

  return {
    isMobile,
    touchDevice,
    optimizedScroll,
    // הגדרות אופטימיזציה
    imageQuality: isMobile ? 60 : 80,
    itemsPerPage: isMobile ? 10 : 20,
    animationDuration: isMobile ? 200 : 300,
  };
}
