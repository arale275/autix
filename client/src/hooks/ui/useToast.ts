"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from "react";

// ========== Types ==========

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastOptions {
  title?: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface UseToastReturn {
  toasts: Toast[];
  addToast: (
    message: string,
    type: ToastType,
    options?: ToastOptions
  ) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  success: (message: string, options?: ToastOptions) => string;
  error: (message: string, options?: ToastOptions) => string;
  warning: (message: string, options?: ToastOptions) => string;
  info: (message: string, options?: ToastOptions) => string;
}

// ========== Constants ==========

const DEFAULT_DURATION = 5000;
const MAX_TOASTS = 5;

// ========== Helper Functions ==========

const generateId = (): string => {
  return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getDefaultDuration = (type: ToastType): number => {
  switch (type) {
    case "error":
      return 7000;
    case "warning":
      return 6000;
    case "success":
      return 4000;
    case "info":
      return 5000;
    default:
      return DEFAULT_DURATION;
  }
};

// ========== Main Hook ==========

export function useToast(): UseToastReturn {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    const timeout = timeoutsRef.current.get(id);
    if (timeout) {
      clearTimeout(timeout);
      timeoutsRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
    setToasts([]);
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType, options: ToastOptions = {}): string => {
      const id = generateId();
      const duration = options.duration ?? getDefaultDuration(type);
      const persistent = options.persistent ?? false;

      const newToast: Toast = {
        id,
        title: options.title,
        message,
        type,
        duration,
        persistent,
        action: options.action,
      };

      setToasts((prev) => [newToast, ...prev].slice(0, MAX_TOASTS));

      if (!persistent && duration > 0) {
        const timeout = setTimeout(() => removeToast(id), duration);
        timeoutsRef.current.set(id, timeout);
      }

      return id;
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, "success", options);
    },
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, "error", options);
    },
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, "warning", options);
    },
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      return addToast(message, "info", options);
    },
    [addToast]
  );

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
  };
}

// ========== Context ==========

const ToastContext = createContext<UseToastReturn | null>(null);

export interface ToastProviderProps {
  children: ReactNode;
}

// Note: ToastProvider component should be implemented in a .tsx file
// This is just the context setup

export function useToastContext(): UseToastReturn {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
}

export { ToastContext };

// ========== Utility Hooks ==========

export function useApiToast() {
  const toast = useToast();

  const handleApiError = useCallback(
    (error: any, fallbackMessage = "אירעה שגיאה") => {
      const message =
        error?.response?.data?.message || error?.message || fallbackMessage;
      return toast.error(message);
    },
    [toast]
  );

  const handleApiSuccess = useCallback(
    (message: string) => {
      return toast.success(message);
    },
    [toast]
  );

  return { ...toast, handleApiError, handleApiSuccess };
}

export function useFormToast() {
  const toast = useToast();

  const handleFormError = useCallback(
    (error: any) => {
      if (error?.response?.data?.errors) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0] as string;
        return toast.error(firstError);
      } else {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "שגיאה בשמירת הנתונים";
        return toast.error(message);
      }
    },
    [toast]
  );

  const handleFormSuccess = useCallback(
    (message: string = "הנתונים נשמרו בהצלחה") => {
      return toast.success(message);
    },
    [toast]
  );

  return { ...toast, handleFormError, handleFormSuccess };
}

export function useQuickToast() {
  const toast = useToast();

  const showLoading = useCallback(
    (message: string = "טוען...") => {
      return toast.info(message, { persistent: true });
    },
    [toast]
  );

  const showSaved = useCallback(() => {
    return toast.success("נשמר בהצלחה");
  }, [toast]);

  const showDeleted = useCallback(() => {
    return toast.success("נמחק בהצלחה");
  }, [toast]);

  const showCopied = useCallback(() => {
    return toast.success("הועתק ללוח");
  }, [toast]);

  const showNetworkError = useCallback(() => {
    return toast.error("בעיית חיבור לאינטרנט");
  }, [toast]);

  const confirmAction = useCallback(
    (message: string, onConfirm: () => void) => {
      return toast.warning(message, {
        persistent: true,
        action: {
          label: "אישור",
          onClick: () => {
            onConfirm();
            toast.clearAll();
          },
        },
      });
    },
    [toast]
  );

  return {
    ...toast,
    showLoading,
    showSaved,
    showDeleted,
    showCopied,
    showNetworkError,
    confirmAction,
  };
}

// ========== Toast Messages ==========

export const TOAST_MESSAGES = {
  SUCCESS: {
    SAVED: "נשמר בהצלחה",
    DELETED: "נמחק בהצלחה",
    UPDATED: "עודכן בהצלחה",
    CREATED: "נוצר בהצלחה",
    LOGIN: "התחברות בוצעה בהצלחה",
    LOGOUT: "התנתקות בוצעה בהצלחה",
  },
  ERROR: {
    GENERAL: "אירעה שגיאה לא צפויה",
    NETWORK: "בעיית חיבור לאינטרנט",
    UNAUTHORIZED: "אין הרשאה לביצוע פעולה זו",
    LOGIN_FAILED: "שם משתמש או סיסמה שגויים",
  },
  WARNING: {
    UNSAVED_CHANGES: "יש שינויים שלא נשמרו",
    DELETE_CONFIRM: "האם אתה בטוח שברצונך למחוק?",
  },
  INFO: {
    LOADING: "טוען...",
    SAVING: "שומר...",
    NO_RESULTS: "לא נמצאו תוצאות",
  },
} as const;

export default useToast;
