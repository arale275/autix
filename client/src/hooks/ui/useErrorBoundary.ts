import { useCallback } from "react";

export const useErrorBoundary = () => {
  const throwError = useCallback((error: Error) => {
    // This will trigger the nearest error boundary
    throw error;
  }, []);

  const captureError = useCallback(
    (error: Error, context?: string) => {
      console.error(`Error captured${context ? ` in ${context}` : ""}:`, error);

      // In production, you might want to send this to an error reporting service
      if (process.env.NODE_ENV === "production") {
        // Example: Sentry.captureException(error);
      }

      throwError(error);
    },
    [throwError]
  );

  return { captureError, throwError };
};
