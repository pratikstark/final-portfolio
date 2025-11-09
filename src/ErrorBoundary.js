import React from 'react';

// Intercept console.error to suppress the removeChild error
const originalConsoleError = console.error;
console.error = function(...args) {
  const errorString = args[0]?.toString?.() || String(args[0]);
  if (
    errorString.includes("Failed to execute 'removeChild'") ||
    errorString.includes("The node to be removed is not a child")
  ) {
    // Silently suppress this specific GSAP/React sync error
    return;
  }
  // Call original error handler for other errors
  originalConsoleError.apply(console, args);
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if it's the removeChild error during GSAP cleanup
    if (
      error.message?.includes("Failed to execute 'removeChild'") ||
      error.message?.includes("The node to be removed is not a child")
    ) {
      // Suppress this specific error - it's a GSAP/React sync issue during cleanup
      console.warn('Suppressed removeChild DOM error');
      // Return false hasError so the error doesn't show
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Only log non-removeChild errors
    if (
      !error.message?.includes("Failed to execute 'removeChild'") &&
      !error.message?.includes("The node to be removed is not a child")
    ) {
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

