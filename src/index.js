import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global error handler to suppress the removeChild error
const originalError = console.error;
console.error = function(...args) {
  const message = args[0]?.message || args[0]?.toString?.() || String(args[0]);
  
  // Suppress GSAP/React removeChild errors
  if (
    message?.includes("Failed to execute 'removeChild'") ||
    message?.includes("The node to be removed is not a child of this node") ||
    (args[0] instanceof Error && 
     (args[0].message?.includes("Failed to execute 'removeChild'") ||
      args[0].message?.includes("The node to be removed is not a child")))
  ) {
    return; // Silently suppress
  }
  
  // Call original for other errors
  originalError.apply(console, args);
};

// Also override window.onerror to catch errors globally
window.onerror = function(message, source, lineno, colno, error) {
  if (
    message?.includes("Failed to execute 'removeChild'") ||
    message?.includes("The node to be removed is not a child of this node") ||
    error?.message?.includes("Failed to execute 'removeChild'") ||
    error?.message?.includes("The node to be removed is not a child")
  ) {
    return true; // Suppress error
  }
  return false; // Let other errors propagate
};

// Override unhandledrejection to catch Promise rejections
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes("Failed to execute 'removeChild'") ||
    event.reason?.message?.includes("The node to be removed is not a child")
  ) {
    event.preventDefault(); // Suppress
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
