// components/features/Toast.tsx
import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  X,
  Loader2,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info" | "loading";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => string;
  hideToast: (id: string) => void;
  hideAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, "id">): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toast.duration ?? (toast.type === "loading" ? 0 : 5000);

    const newToast: Toast = {
      id,
      duration,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        hideToast(id);
      }, duration);
    }

    return id;
  };

  const hideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const hideAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, hideAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2 w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastComponent({ toast }: { toast: Toast }) {
  const { hideToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => hideToast(toast.id), 150);
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "error":
        return <XCircle size={20} className="text-red-600" />;
      case "warning":
        return <AlertCircle size={20} className="text-yellow-600" />;
      case "info":
        return <Info size={20} className="text-blue-600" />;
      case "loading":
        return <Loader2 size={20} className="text-blue-600 animate-spin" />;
      default:
        return <Info size={20} className="text-gray-600" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-green-500";
      case "error":
        return "border-l-red-500";
      case "warning":
        return "border-l-yellow-500";
      case "info":
        return "border-l-blue-500";
      case "loading":
        return "border-l-blue-500";
      default:
        return "border-l-gray-500";
    }
  };

  return (
    <Card
      className={`
        transition-all duration-150 ease-in-out border-l-4 ${getBorderColor()}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        shadow-lg
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="text-sm text-gray-600 leading-relaxed">
                {toast.description}
              </p>
            )}

            {toast.action && (
              <Button
                variant="link"
                size="sm"
                onClick={toast.action.onClick}
                className="p-0 h-auto mt-2 text-sm font-medium"
              >
                {toast.action.label}
              </Button>
            )}
          </div>

          {toast.type !== "loading" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function useToastUtils() {
  const { showToast, hideToast } = useToast();

  const success = (
    title: string,
    description?: string,
    options?: Partial<Omit<Toast, "id" | "type">>
  ) => showToast({ type: "success", title, description, ...options });

  const error = (
    title: string,
    description?: string,
    options?: Partial<Omit<Toast, "id" | "type">>
  ) => showToast({ type: "error", title, description, ...options });

  const warning = (
    title: string,
    description?: string,
    options?: Partial<Omit<Toast, "id" | "type">>
  ) => showToast({ type: "warning", title, description, ...options });

  const info = (
    title: string,
    description?: string,
    options?: Partial<Omit<Toast, "id" | "type">>
  ) => showToast({ type: "info", title, description, ...options });

  const loading = (title: string, description?: string) =>
    showToast({ type: "loading", title, description, duration: 0 });

  const hide = hideToast;

  return {
    success,
    error,
    warning,
    info,
    loading,
    hide,
  };
}

export default ToastProvider;
