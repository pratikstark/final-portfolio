import React, { useLayoutEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ErrorBoundary from './ErrorBoundary';
import './App.css';

// Import demo pages — lazy-loaded so their code is code-split out of the main
// bundle (the portfolio home route no longer downloads them up front).
const TextPressureDemo = lazy(() => import('./pages/TextPressureDemo'));
const VerticalCutRevealDemo = lazy(() => import('./pages/VerticalCutRevealDemo'));

// Import the main portfolio component
import PortfolioApp from './App_portfolio';

gsap.registerPlugin(ScrollTrigger);

// Aggressive cleanup component - runs synchronously before React unmounts
function ScrollReset() {
  const { pathname } = useLocation();

  // Use useLayoutEffect for synchronous cleanup BEFORE React unmounts
  useLayoutEffect(() => {
    // Return cleanup function that runs BEFORE next effect
    return () => {
      // This cleanup runs BEFORE the new path renders
      // Kill ALL ScrollTriggers immediately
      try {
        const allTriggers = ScrollTrigger.getAll();
        allTriggers.forEach(trigger => {
          try {
            trigger.kill();
          } catch (e) {
            // Ignore
          }
        });
        ScrollTrigger.refresh();
        gsap.killTweensOf("*");

        // Remove any GSAP pin spacers
        const pinSpacers = document.querySelectorAll('[data-pin-spacer]');
        pinSpacers.forEach(spacer => {
          try {
            if (spacer?.isConnected) {
              spacer.remove();
            }
          } catch (e) {
            // Already removed
          }
        });
      } catch (e) {
        // Ignore
      }
    };
  }, [pathname]);

  // Additional effect to reset scroll on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
      document.body.style.overflow = 'auto';
    }
  }, [pathname]);

  return null;
}

// Routes component with key that forces complete remount on route change
function AppRoutes() {
  const location = useLocation();

  // Key changes with pathname - forces React to completely destroy and recreate the Routes tree
  // This prevents React from trying to diff the old and new components, which causes the removeChild error
  return (
    <Suspense fallback={null}>
      <Routes key={location.pathname}>
        <Route path="/" element={<PortfolioApp key="portfolio" />} />
        <Route path="/text-pressure-demo" element={<TextPressureDemo key="text-pressure-demo" />} />
        <Route path="/vertical-cut-reveal-demo" element={<VerticalCutRevealDemo key="vertical-cut-reveal-demo" />} />
      </Routes>
    </Suspense>
  );
}

// Main App with simple routing.
// The portfolio is now fully responsive (mobile blur hero, stacked about,
// touch swipe-snap projects), so it renders on every viewport — no more
// desktop-only blocker.
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollReset />
        <AppRoutes />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
