"use client";

import React from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Custom error handling callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In development, also log to console for debugging
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Error Boundary Details");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <Card className="border-red-200 bg-red-50 max-w-2xl mx-auto">
          <CardContent className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                אירעה שגיאה לא צפויה
              </h3>
              <p className="text-red-600 mb-4">
                משהו השתבש באפליקציה. אנא נסה שנית או צור קשר עם התמיכה אם הבעיה
                נמשכת.
              </p>
            </div>

            {/* Error details in development */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-red-100 p-3 rounded border">
                <summary className="cursor-pointer font-medium text-red-800 mb-2">
                  פרטי השגיאה (פיתוח)
                </summary>
                <div className="text-sm text-red-700 space-y-2">
                  <div>
                    <strong>שגיאה:</strong> {this.state.error.message}
                  </div>
                  <div>
                    <strong>Stack:</strong>
                    <pre className="text-xs overflow-auto max-h-32 bg-red-50 p-2 rounded mt-1">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                variant="default"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                נסה שנית
              </Button>

              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                רענן דף
              </Button>

              <Button
                onClick={() => (window.location.href = "/dealer/home")}
                variant="ghost"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                חזור לדף הבית
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
