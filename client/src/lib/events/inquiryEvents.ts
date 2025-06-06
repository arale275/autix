"use client";

// ✅ Import cache invalidation (יהיה נוצר בשלב הבא)
import { invalidateInquiryCache } from "../../hooks/api/useInquiries";

interface InquiryUpdateDetail {
  inquiryId: number;
  updateType: string;
  data?: any;
  timestamp: number;
}

class InquiryEventEmitter extends EventTarget {
  /**
   * Emit inquiry update event and automatically invalidate cache
   * This is the single source of truth for inquiry updates
   */
  emitInquiryUpdate(inquiryId: number, updateType: string, data?: any) {
    // Create and dispatch event for component communication
    const event = new CustomEvent("inquiryUpdate", {
      detail: {
        inquiryId,
        updateType,
        data,
        timestamp: Date.now(),
      } as InquiryUpdateDetail,
    });
    this.dispatchEvent(event);

    // ✅ Automatically invalidate cache for all hooks
    invalidateInquiryCache(inquiryId);

    console.log(
      `🔄 Inquiry Event + Cache Invalidation: ${updateType} for inquiry ${inquiryId}`,
      data
    );
  }

  /**
   * Listen to inquiry update events
   * Returns cleanup function
   */
  onInquiryUpdate(callback: (detail: InquiryUpdateDetail) => void) {
    const handler = (event: CustomEvent<InquiryUpdateDetail>) =>
      callback(event.detail);
    this.addEventListener("inquiryUpdate", handler as EventListener);

    return () => {
      this.removeEventListener("inquiryUpdate", handler as EventListener);
    };
  }

  /**
   * Emit multiple inquiry updates (for bulk operations)
   */
  emitBulkInquiryUpdate(inquiryIds: number[], updateType: string, data?: any) {
    inquiryIds.forEach((inquiryId) => {
      this.emitInquiryUpdate(inquiryId, updateType, data);
    });
  }

  /**
   * Emit global inquiry list update (when adding new inquiries, etc.)
   */
  emitInquiryListUpdate(updateType: string, data?: any) {
    const event = new CustomEvent("inquiryListUpdate", {
      detail: { updateType, data, timestamp: Date.now() },
    });
    this.dispatchEvent(event);

    // Invalidate all inquiry caches
    invalidateInquiryCache();

    console.log(
      `🔄 Inquiry List Event + Cache Invalidation: ${updateType}`,
      data
    );
  }

  /**
   * Listen to inquiry list updates
   */
  onInquiryListUpdate(callback: (detail: any) => void) {
    const handler = (event: CustomEvent) => callback(event.detail);
    this.addEventListener("inquiryListUpdate", handler as EventListener);

    return () => {
      this.removeEventListener("inquiryListUpdate", handler as EventListener);
    };
  }
}

// Export singleton instance
export const inquiryEvents = new InquiryEventEmitter();

// Export types for better TypeScript support
export type { InquiryUpdateDetail };
