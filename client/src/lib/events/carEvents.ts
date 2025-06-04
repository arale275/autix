// lib/events/carEvents.ts - Enhanced with Auto Cache Invalidation
"use client";

// ✅ Import cache invalidation directly
import { invalidateCarCache } from "../../hooks/api/useCars";

interface CarUpdateDetail {
  carId: number;
  updateType: string;
  data?: any;
  timestamp: number;
}

class CarEventEmitter extends EventTarget {
  /**
   * Emit car update event and automatically invalidate cache
   * This is the single source of truth for car updates
   */
  emitCarUpdate(carId: number, updateType: string, data?: any) {
    // Create and dispatch event for component communication
    const event = new CustomEvent("carUpdate", {
      detail: {
        carId,
        updateType,
        data,
        timestamp: Date.now(),
      } as CarUpdateDetail,
    });
    this.dispatchEvent(event);

    // ✅ Automatically invalidate cache for all hooks
    invalidateCarCache(carId);

    console.log(
      `🔄 Car Event + Cache Invalidation: ${updateType} for car ${carId}`,
      data
    );
  }

  /**
   * Listen to car update events
   * Returns cleanup function
   */
  onCarUpdate(callback: (detail: CarUpdateDetail) => void) {
    const handler = (event: CustomEvent<CarUpdateDetail>) =>
      callback(event.detail);
    this.addEventListener("carUpdate", handler as EventListener);

    return () => {
      this.removeEventListener("carUpdate", handler as EventListener);
    };
  }

  /**
   * Emit multiple car updates (for bulk operations)
   */
  emitBulkCarUpdate(carIds: number[], updateType: string, data?: any) {
    carIds.forEach((carId) => {
      this.emitCarUpdate(carId, updateType, data);
    });
  }

  /**
   * Emit global car list update (when adding new cars, etc.)
   */
  emitCarListUpdate(updateType: string, data?: any) {
    const event = new CustomEvent("carListUpdate", {
      detail: { updateType, data, timestamp: Date.now() },
    });
    this.dispatchEvent(event);

    // Invalidate all car caches
    invalidateCarCache();

    console.log(`🔄 Car List Event + Cache Invalidation: ${updateType}`, data);
  }

  /**
   * Listen to car list updates
   */
  onCarListUpdate(callback: (detail: any) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    this.addEventListener("carListUpdate", handler as EventListener);

    return () => {
      this.removeEventListener("carListUpdate", handler as EventListener);
    };
  }
}

// Export singleton instance
export const carEvents = new CarEventEmitter();

// Export types for better TypeScript support
export type { CarUpdateDetail };
