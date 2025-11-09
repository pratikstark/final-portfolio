import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Import project pages
import CognixaProject from './pages/CognixaProject';
import SettlinProject from './pages/SettlinProject';
import AnimationLibraryProject from './pages/AnimationLibraryProject';
import DataVizProject from './pages/DataVizProject';
import MobileAppProject from './pages/MobileAppProject';
import AIChatProject from './pages/AIChatProject';
import TextPressureDemo from './pages/TextPressureDemo';
import VerticalCutRevealDemo from './pages/VerticalCutRevealDemo';

// Import the main portfolio component
import PortfolioApp from './App_portfolio';

gsap.registerPlugin(ScrollTrigger);

// Simple scroll reset component
function ScrollReset() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Kill all ScrollTriggers immediately on route change
    try {
      const allTriggers = ScrollTrigger.getAll();
      allTriggers.forEach(trigger => {
        try {
          trigger.kill();
        } catch (e) {
          // Ignore individual errors
        }
      });
      ScrollTrigger.refresh();
      gsap.killTweensOf("*");
    } catch (e) {
      // Ignore cleanup errors
    }

    // Reset scroll position
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

// Main App with simple routing
function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/cognixa" element={<CognixaProject />} />
        <Route path="/settlin" element={<SettlinProject />} />
        <Route path="/animation-library" element={<AnimationLibraryProject />} />
        <Route path="/data-viz" element={<DataVizProject />} />
        <Route path="/mobile-app" element={<MobileAppProject />} />
        <Route path="/ai-chat" element={<AIChatProject />} />
        <Route path="/text-pressure-demo" element={<TextPressureDemo />} />
        <Route path="/vertical-cut-reveal-demo" element={<VerticalCutRevealDemo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

