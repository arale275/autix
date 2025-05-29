// Performance monitoring utilities

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // מדידת זמן טעינה של קומפוננט
  measureComponentLoad(componentName: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      this.metrics.set(componentName, loadTime);

      if (process.env.NODE_ENV === "development") {
        console.log(`🚀 ${componentName} loaded in ${loadTime.toFixed(2)}ms`);
      }
    };
  }

  // מדידת זמן רינדור
  measureRender(componentName: string, renderFn: () => void): void {
    const startTime = performance.now();
    renderFn();
    const endTime = performance.now();

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎨 ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`
      );
    }
  }

  // דיווח על Core Web Vitals
  reportWebVitals(): void {
    if (typeof window !== "undefined" && "performance" in window) {
      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("🎯 LCP:", lastEntry.startTime);
      }).observe({ entryTypes: ["largest-contentful-paint"] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log("⚡ FID:", entry.processingStart - entry.startTime);
        });
      }).observe({ entryTypes: ["first-input"] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            console.log("📐 CLS:", entry.value);
          }
        });
      }).observe({ entryTypes: ["layout-shift"] });
    }
  }

  // אופטימיזציה לתמונות
  static optimizeImage(src: string, width: number, quality = 75): string {
    if (src.startsWith("/api/placeholder")) {
      return `${src}&w=${width}&q=${quality}`;
    }
    return src;
  }

  // Lazy loading עם Intersection Observer
  static createLazyLoader(
    callback: () => void,
    threshold = 0.1
  ): IntersectionObserver {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
          }
        });
      },
      { threshold }
    );
  }
}

// Hook לביצועים
export function usePerformance(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();

  return {
    measureLoad: () => monitor.measureComponentLoad(componentName),
    measureRender: (fn: () => void) => monitor.measureRender(componentName, fn),
  };
}

// Debounce function לאופטימיזציה
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function לאופטימיזציה
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
