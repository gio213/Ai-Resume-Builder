// components/ErrorBoundary.tsx
"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here
    console.error("Error caught by boundary:", error);
    console.error("Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="m-4 rounded border border-red-400 bg-red-100 p-4 text-red-700">
          <h2 className="mb-2 text-lg font-bold">Something went wrong!</h2>
          <div className="mb-2">Error: {this.state.error?.message}</div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
