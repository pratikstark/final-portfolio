import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
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
import { TextPressure } from './components/ui/interactive-text-pressure.js';
import { VerticalCutReveal } from './components/ui/vertical-cut-reveal.js';
import { createOdometerAnimation, setInitialHiddenState } from './utils/odometer-animation.js';

// Try to register MorphSVGPlugin
try {
  const { MorphSVGPlugin } = require('gsap/MorphSVGPlugin');
  gsap.registerPlugin(MorphSVGPlugin);
} catch (e) {
  // MorphSVGPlugin not available - using fallback
}

// Try to register DrawSVGPlugin
try {
  const { DrawSVGPlugin } = require('gsap/DrawSVGPlugin');
  gsap.registerPlugin(DrawSVGPlugin);
  console.log('DrawSVGPlugin registered successfully');
} catch (e) {
  console.log('DrawSVGPlugin not available - using fallback');
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Try to register Flip plugin
try {
  const { Flip } = require('gsap/Flip');
  gsap.registerPlugin(Flip);
} catch (e) {
  // Flip plugin not available - using fallback
}

// Try to register ScrollToPlugin
try {
  const { ScrollToPlugin } = require('gsap/ScrollToPlugin');
  gsap.registerPlugin(ScrollToPlugin);
} catch (e) {
  // ScrollToPlugin not available - using fallback
}

// Morphing SVG component that contains both arrow and close paths
function MorphingIcon({ className = '', isClose = false, filled = false, sectionName = '' }) {
  const arrowId = `arrow-${sectionName}`;
  const closeId = `close-${sectionName}`;
  const morphId = `morph-${sectionName}`;
  
  return (
    <svg
      className={className}
      width="88"
      height="89"
      viewBox="0 0 88 89"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hidden reference paths */}
      <defs>
        <path
          id={arrowId}
          d="M80.4717 50.5H64.4717V28.3145L25.6289 67.1572H3L53.1572 17H29.9717V1H80.4717V50.5Z"
        />
        <path
          id={closeId}
          d="M72 0L44 29.5L14.5 1.5L0 16.5L29.5 44L1 74L16 88.5L44 59L73.5 87L88 72L58.5 44L87 14.5L72 0Z"
        />
      </defs>
      
      {/* Visible morphing path */}
      <path
        id={morphId}
        d="M80.4717 50.5H64.4717V28.3145L25.6289 67.1572H3L53.1572 17H29.9717V1H80.4717V50.5Z"
        stroke="#111"
        strokeWidth="2"
        fill={filled ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

// SVG Components for the main titles with fillable animations
function PsychologyIcon({ className = '' }) {
  return (
    <div className={`category-svg ${className}`}>
      <svg viewBox="0 0 824 97" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          className="svg-stroke draw-me" 
          d="M2.10594 93V4.34H43.2119C61.7499 4.34 74.9869 16.213 74.9869 32.86C74.9869 49.507 61.6879 61.535 43.2119 61.535H15.1259V93H2.10594ZM15.1259 49.445H42.1889C54.2789 49.445 61.9669 42.997 61.9669 32.86C61.9669 22.816 54.4029 16.43 42.4369 16.43H15.1259V49.445ZM118.742 2.48C139.915 2.48 153.679 13.361 153.679 31.062H140.969C140.969 20.77 131.855 14.26 118.649 14.26C107.582 14.26 95.9875 18.848 95.9875 29.047C95.9875 37.975 104.885 39.494 118.928 41.602L123.516 42.284C138.551 44.547 156.903 47.399 156.903 67.518C156.903 85.932 141.557 94.86 119.858 94.86C96.0185 94.86 81.7275 84.103 81.7275 65.472H94.4375C94.4375 76.508 104.203 83.08 119.641 83.08C132.94 83.08 144.162 78.244 144.162 67.27C144.162 57.443 135.11 55.955 122.493 54.064L116.727 53.196C101.537 50.902 83.2775 48.236 83.2775 29.326C83.2775 11.563 99.3975 2.48 118.742 2.48ZM222.562 4.34H237.287L202.257 59.303V93H189.237V59.396L154.548 4.34H169.614L195.933 46.779L222.562 4.34ZM246.454 48.67C246.454 69.967 257.273 82.77 275.253 82.77C289.792 82.77 299.061 74.431 302.068 58.59H315.088C311.399 81.22 296.426 94.86 275.222 94.86C250.391 94.86 233.434 76.136 233.434 48.67C233.434 21.173 250.391 2.48 275.222 2.48C296.426 2.48 311.399 16.12 315.088 38.75H302.068C299.061 22.909 289.792 14.57 275.253 14.57C257.273 14.57 246.454 27.373 246.454 48.67ZM399.085 4.34V93H386.065V54.808H338.325V93H325.305V4.34H338.325V42.718H386.065V4.34H399.085ZM408.656 48.67C408.656 21.173 425.613 2.48 450.506 2.48C475.399 2.48 492.387 21.173 492.387 48.67C492.387 76.136 475.399 94.86 450.506 94.86C425.613 94.86 408.656 76.136 408.656 48.67ZM421.676 48.67C421.676 69.967 432.495 82.77 450.506 82.77C468.517 82.77 479.367 69.967 479.367 48.67C479.367 27.373 468.517 14.57 450.506 14.57C432.495 14.57 421.676 27.373 421.676 48.67ZM501.981 4.34H515.001V80.91H560.633V93H501.981V4.34ZM563.051 48.67C563.051 21.173 580.008 2.48 604.901 2.48C629.794 2.48 646.782 21.173 646.782 48.67C646.782 76.136 629.794 94.86 604.901 94.86C580.008 94.86 563.051 76.136 563.051 48.67ZM576.071 48.67C576.071 69.967 586.89 82.77 604.901 82.77C622.912 82.77 633.762 69.967 633.762 48.67C633.762 27.373 622.912 14.57 604.901 14.57C586.89 14.57 576.071 27.373 576.071 48.67ZM668.465 48.67C668.465 70.029 678.695 82.925 696.272 82.925C712.795 82.925 725.164 71.92 725.753 57.35H695.094V45.57H738.184V93H725.784V67.983C721.568 84.165 709.013 94.86 692.676 94.86C670.883 94.86 655.445 75.485 655.445 48.67C655.445 21.204 672.371 2.48 697.233 2.48C717.6 2.48 733.193 15.035 737.006 35.03H723.986C720.917 21.948 710.997 14.57 697.264 14.57C679.284 14.57 668.465 27.373 668.465 48.67ZM805.508 4.34H820.233L785.203 59.303V93H772.183V59.396L737.494 4.34H752.56L778.879 46.779L805.508 4.34Z" 
          fill="none" 
          stroke="#111" 
          strokeWidth="2"
        />
        <path 
          className="svg-fill" 
          d="M2.10594 93V4.34H43.2119C61.7499 4.34 74.9869 16.213 74.9869 32.86C74.9869 49.507 61.6879 61.535 43.2119 61.535H15.1259V93H2.10594ZM15.1259 49.445H42.1889C54.2789 49.445 61.9669 42.997 61.9669 32.86C61.9669 22.816 54.4029 16.43 42.4369 16.43H15.1259V49.445ZM118.742 2.48C139.915 2.48 153.679 13.361 153.679 31.062H140.969C140.969 20.77 131.855 14.26 118.649 14.26C107.582 14.26 95.9875 18.848 95.9875 29.047C95.9875 37.975 104.885 39.494 118.928 41.602L123.516 42.284C138.551 44.547 156.903 47.399 156.903 67.518C156.903 85.932 141.557 94.86 119.858 94.86C96.0185 94.86 81.7275 84.103 81.7275 65.472H94.4375C94.4375 76.508 104.203 83.08 119.641 83.08C132.94 83.08 144.162 78.244 144.162 67.27C144.162 57.443 135.11 55.955 122.493 54.064L116.727 53.196C101.537 50.902 83.2775 48.236 83.2775 29.326C83.2775 11.563 99.3975 2.48 118.742 2.48ZM222.562 4.34H237.287L202.257 59.303V93H189.237V59.396L154.548 4.34H169.614L195.933 46.779L222.562 4.34ZM246.454 48.67C246.454 69.967 257.273 82.77 275.253 82.77C289.792 82.77 299.061 74.431 302.068 58.59H315.088C311.399 81.22 296.426 94.86 275.222 94.86C250.391 94.86 233.434 76.136 233.434 48.67C233.434 21.173 250.391 2.48 275.222 2.48C296.426 2.48 311.399 16.12 315.088 38.75H302.068C299.061 22.909 289.792 14.57 275.253 14.57C257.273 14.57 246.454 27.373 246.454 48.67ZM399.085 4.34V93H386.065V54.808H338.325V93H325.305V4.34H338.325V42.718H386.065V4.34H399.085ZM408.656 48.67C408.656 21.173 425.613 2.48 450.506 2.48C475.399 2.48 492.387 21.173 492.387 48.67C492.387 76.136 475.399 94.86 450.506 94.86C425.613 94.86 408.656 76.136 408.656 48.67ZM421.676 48.67C421.676 69.967 432.495 82.77 450.506 82.77C468.517 82.77 479.367 69.967 479.367 48.67C479.367 27.373 468.517 14.57 450.506 14.57C432.495 14.57 421.676 27.373 421.676 48.67ZM501.981 4.34H515.001V80.91H560.633V93H501.981V4.34ZM563.051 48.67C563.051 21.173 580.008 2.48 604.901 2.48C629.794 2.48 646.782 21.173 646.782 48.67C646.782 76.136 629.794 94.86 604.901 94.86C580.008 94.86 563.051 76.136 563.051 48.67ZM576.071 48.67C576.071 69.967 586.89 82.77 604.901 82.77C622.912 82.77 633.762 69.967 633.762 48.67C633.762 27.373 622.912 14.57 604.901 14.57C586.89 14.57 576.071 27.373 576.071 48.67ZM668.465 48.67C668.465 70.029 678.695 82.925 696.272 82.925C712.795 82.925 725.164 71.92 725.753 57.35H695.094V45.57H738.184V93H725.784V67.983C721.568 84.165 709.013 94.86 692.676 94.86C670.883 94.86 655.445 75.485 655.445 48.67C655.445 21.204 672.371 2.48 697.233 2.48C717.6 2.48 733.193 15.035 737.006 35.03H723.986C720.917 21.948 710.997 14.57 697.264 14.57C679.284 14.57 668.465 27.373 668.465 48.67ZM805.508 4.34H820.233L785.203 59.303V93H772.183V59.396L737.494 4.34H752.56L778.879 46.779L805.508 4.34Z" 
          fill="#111"
        />
      </svg>
    </div>
  );
}

function DesignIcon({ className = '' }) {
  return (
    <div className={`category-svg ${className}`}>
      <svg viewBox="0 0 434 97" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          className="svg-stroke draw-me" 
          d="M2.94188 93V4.34H32.1129C59.4859 4.34 77.6519 22.01 77.6519 48.67C77.6519 75.299 59.4859 93 32.1129 93H2.94188ZM15.6519 80.91H32.1129C52.3869 80.91 64.6319 68.758 64.6319 48.67C64.6319 28.582 52.3869 16.43 32.1129 16.43H15.6519V80.91ZM87.2231 4.34H147.115V16.43H100.243V42.718H143.395V54.808H100.243V80.91H148.355V93H87.2231V4.34ZM190.781 2.48C211.954 2.48 225.718 13.361 225.718 31.062H213.008C213.008 20.77 203.894 14.26 190.688 14.26C179.621 14.26 168.027 18.848 168.027 29.047C168.027 37.975 176.924 39.494 190.967 41.602L195.555 42.284C210.59 44.547 228.942 47.399 228.942 67.518C228.942 85.932 213.597 94.86 191.897 94.86C168.058 94.86 153.767 84.103 153.767 65.472H166.477C166.477 76.508 176.242 83.08 191.68 83.08C204.979 83.08 216.201 78.244 216.201 67.27C216.201 57.443 207.149 55.955 194.532 54.064L188.766 53.196C173.576 50.902 155.317 48.236 155.317 29.326C155.317 11.563 171.437 2.48 190.781 2.48ZM250.036 4.34V93H237.016V4.34H250.036ZM272.719 48.67C272.719 70.029 282.949 82.925 300.526 82.925C317.049 82.925 329.418 71.92 330.007 57.35H299.348V45.57H342.438V93H330.038V67.983C325.822 84.165 313.267 94.86 296.93 94.86C275.137 94.86 259.699 75.485 259.699 48.67C259.699 21.204 276.625 2.48 301.487 2.48C321.854 2.48 337.447 15.035 341.26 35.03H328.24C325.171 21.948 315.251 14.57 301.518 14.57C283.538 14.57 272.719 27.373 272.719 48.67ZM431.733 4.34V93H410.591L365.734 12.679V93H353.024V4.34H376.026L419.023 81.313V4.34H431.733Z" 
          fill="none" 
          stroke="#111" 
          strokeWidth="2"
        />
        <path 
          className="svg-fill" 
          d="M2.94188 93V4.34H32.1129C59.4859 4.34 77.6519 22.01 77.6519 48.67C77.6519 75.299 59.4859 93 32.1129 93H2.94188ZM15.6519 80.91H32.1129C52.3869 80.91 64.6319 68.758 64.6319 48.67C64.6319 28.582 52.3869 16.43 32.1129 16.43H15.6519V80.91ZM87.2231 4.34H147.115V16.43H100.243V42.718H143.395V54.808H100.243V80.91H148.355V93H87.2231V4.34ZM190.781 2.48C211.954 2.48 225.718 13.361 225.718 31.062H213.008C213.008 20.77 203.894 14.26 190.688 14.26C179.621 14.26 168.027 18.848 168.027 29.047C168.027 37.975 176.924 39.494 190.967 41.602L195.555 42.284C210.59 44.547 228.942 47.399 228.942 67.518C228.942 85.932 213.597 94.86 191.897 94.86C168.058 94.86 153.767 84.103 153.767 65.472H166.477C166.477 76.508 176.242 83.08 191.68 83.08C204.979 83.08 216.201 78.244 216.201 67.27C216.201 57.443 207.149 55.955 194.532 54.064L188.766 53.196C173.576 50.902 155.317 48.236 155.317 29.326C155.317 11.563 171.437 2.48 190.781 2.48ZM250.036 4.34V93H237.016V4.34H250.036ZM272.719 48.67C272.719 70.029 282.949 82.925 300.526 82.925C317.049 82.925 329.418 71.92 330.007 57.35H299.348V45.57H342.438V93H330.038V67.983C325.822 84.165 313.267 94.86 296.93 94.86C275.137 94.86 259.699 75.485 259.699 48.67C259.699 21.204 276.625 2.48 301.487 2.48C321.854 2.48 337.447 15.035 341.26 35.03H328.24C325.171 21.948 315.251 14.57 301.518 14.57C283.538 14.57 272.719 27.373 272.719 48.67ZM431.733 4.34V93H410.591L365.734 12.679V93H353.024V4.34H376.026L419.023 81.313V4.34H431.733Z" 
          fill="#111"
        />
      </svg>
    </div>
  );
}

function CodeIcon({ className = '' }) {
  return (
    <div className={`category-svg ${className}`}>
      <svg viewBox="0 0 335 97" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          className="svg-stroke draw-me" 
          d="M15.7194 48.67C15.7194 69.967 26.5384 82.77 44.5184 82.77C59.0574 82.77 68.3264 74.431 71.3334 58.59H84.3534C80.6644 81.22 65.6914 94.86 44.4874 94.86C19.6564 94.86 2.69938 76.136 2.69938 48.67C2.69938 21.173 19.6564 2.48 44.4874 2.48C65.6914 2.48 80.6644 16.12 84.3534 38.75H71.3334C68.3264 22.909 59.0574 14.57 44.5184 14.57C26.5384 14.57 15.7194 27.373 15.7194 48.67ZM93.6408 48.67C93.6408 21.173 110.598 2.48 135.491 2.48C160.384 2.48 177.372 21.173 177.372 48.67C177.372 76.136 160.384 94.86 135.491 94.86C110.598 94.86 93.6408 76.136 93.6408 48.67ZM106.661 48.67C106.661 69.967 117.48 82.77 135.491 82.77C153.502 82.77 164.352 69.967 164.352 48.67C164.352 27.373 153.502 14.57 135.491 14.57C117.48 14.57 106.661 27.373 106.661 48.67ZM186.965 93V4.34H216.136C243.509 4.34 261.675 22.01 261.675 48.67C261.675 75.299 243.509 93 216.136 93H186.965ZM199.675 80.91H216.136C236.41 80.91 248.655 68.758 248.655 48.67C248.655 28.582 236.41 16.43 216.136 16.43H199.675V80.91ZM271.247 4.34H331.139V16.43H284.267V42.718H327.419V54.808H284.267V80.91H332.379V93H271.247V4.34Z" 
          fill="none" 
          stroke="#111" 
          strokeWidth="2"
        />
        <path 
          className="svg-fill" 
          d="M15.7194 48.67C15.7194 69.967 26.5384 82.77 44.5184 82.77C59.0574 82.77 68.3264 74.431 71.3334 58.59H84.3534C80.6644 81.22 65.6914 94.86 44.4874 94.86C19.6564 94.86 2.69938 76.136 2.69938 48.67C2.69938 21.173 19.6564 2.48 44.4874 2.48C65.6914 2.48 80.6644 16.12 84.3534 38.75H71.3334C68.3264 22.909 59.0574 14.57 44.5184 14.57C26.5384 14.57 15.7194 27.373 15.7194 48.67ZM93.6408 48.67C93.6408 21.173 110.598 2.48 135.491 2.48C160.384 2.48 177.372 21.173 177.372 48.67C177.372 76.136 160.384 94.86 135.491 94.86C110.598 94.86 93.6408 76.136 93.6408 48.67ZM106.661 48.67C106.661 69.967 117.48 82.77 135.491 82.77C153.502 82.77 164.352 69.967 164.352 48.67C164.352 27.373 153.502 14.57 135.491 14.57C117.48 14.57 106.661 27.373 106.661 48.67ZM186.965 93V4.34H216.136C243.509 4.34 261.675 22.01 261.675 48.67C261.675 75.299 243.509 93 216.136 93H186.965ZM199.675 80.91H216.136C236.41 80.91 248.655 68.758 248.655 48.67C248.655 28.582 236.41 16.43 216.136 16.43H199.675V80.91ZM271.247 4.34H331.139V16.43H284.267V42.718H327.419V54.808H284.267V80.91H332.379V93H271.247V4.34Z" 
          fill="#111"
        />
      </svg>
    </div>
  );
}

function PortfolioApp() {
  const loaderRef = useRef(null);
  const loadingBarRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const contentTextRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const aboutHeaderRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const aboutDetailRef = useRef(null);
  const activeSectionRef = useRef(null);
  const hiThereRef = useRef(null);
  const createRef = useRef(null);

  useEffect(() => {
    console.log('PortfolioApp useEffect running');
    console.log('Loader ref:', loaderRef.current);
    console.log('LoadingBar ref:', loadingBarRef.current);
    
    // Force reset scroll position to top immediately on page load/reload
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Reset GSAP scroll position
    gsap.set(window, { scrollTo: 0 });
    gsap.set(document.documentElement, { scrollTop: 0 });
    gsap.set(document.body, { scrollTop: 0 });
    
    // Reset all GSAP timelines and states
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Reset component states
    setActiveSection(null);
    setLoaderComplete(false);
    
    // Handle page reload/refresh
    const handleBeforeUnload = () => {
      // Reset scroll position before page unloads
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    
    // Also handle page visibility change (when user switches tabs and comes back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Disable scrolling initially only during loader
    document.body.style.overflow = 'hidden';
    
    const loader = loaderRef.current;
    const loadingBar = loadingBarRef.current;
    const video = videoRef.current;

    // Animate loading bar smoothly over 2 seconds
    if (loadingBar) {
      gsap.fromTo(loadingBar, 
        { width: '0%' },
        { 
          width: '100%', 
          duration: 2, 
          ease: "power2.out",
          onComplete: () => {
            console.log('Loader animation complete, hiding loader');
            setLoaderComplete(true);
            if (loader) {
              loader.style.display = 'none';
              console.log('Loader hidden');
            }
            video?.play().catch((e) => {
              console.log('Video play error:', e);
            });
            
            // Re-enable scrolling after loader finishes
            document.body.style.overflow = 'auto';
            console.log('Scrolling re-enabled');
            
            // ScrollSmoother disabled to prevent conflicts with ScrollTrigger
            // Natural browser scrolling will be used instead
          }
        }
      );
    } else {
      // Fallback: hide loader immediately if loadingBar is not found
      console.log('LoadingBar not found, using fallback');
      setTimeout(() => {
        console.log('Fallback: hiding loader');
        setLoaderComplete(true);
        if (loader) {
          loader.style.display = 'none';
          console.log('Loader hidden via fallback');
        }
        video?.play().catch((e) => {
          console.log('Video play error (fallback):', e);
        });
        document.body.style.overflow = 'auto';
        console.log('Scrolling re-enabled (fallback)');
      }, 100);
    }
    
    // Emergency fallback: Force hide loader after 5 seconds regardless
    setTimeout(() => {
      console.log('Emergency fallback: Force hiding loader');
      setLoaderComplete(true);
      if (loader) {
        loader.style.display = 'none';
        console.log('Loader force-hidden');
      }
      document.body.style.overflow = 'auto';
    }, 5000);

    // Additional scroll reset after a short delay to ensure it takes effect
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);

    // Set initial fullscreen state for video container
    if (videoContainerRef.current) {
      gsap.set(videoContainerRef.current, {
        width: '100vw',
        top: '0vw',
        left: '0vw',
        height: '100vh'
      });
    }

    // Set initial hidden state for content text
    if (contentTextRef.current) {
      gsap.set(contentTextRef.current, {
        transform: 'translateY(100%)'
      });
    }

    // Set initial hidden state for VerticalCutReveal text
    gsap.set(['.hero .body-large:first-of-type', '.hero .body-large:last-of-type'], { opacity: 0 });


    // Smooth, scrubbed timeline for the hero with optimized settings
    const heroTl = gsap.timeline({
      defaults: { ease: 'power1.out' },
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=400vh', // Much longer pin duration
        pin: true,
        pinSpacing: true,
        scrub: 1.2, // Faster, more responsive scrubbing
        anticipatePin: 1,
        refreshPriority: 1, // Higher priority to work with ScrollSmoother
        invalidateOnRefresh: true,
        markers: {
          startColor: "red",
          endColor: "red",
          indent: 100,
          fontSize: "12px"
        },
        onEnter: () => {
          console.log('🎯 Hero section entered');
          // Hide text when entering hero section (video should be fullscreen)
          gsap.set(['.hero .body-large:first-of-type', '.hero .body-large:last-of-type'], { opacity: 0 });
        },
        onLeave: () => {
          console.log('👋 Hero section left');
        },
        onEnterBack: () => {
          console.log('🔄 Hero section re-entered');
          // Hide text when re-entering hero section
          gsap.set(['.hero .body-large:first-of-type', '.hero .body-large:last-of-type'], { opacity: 0 });
        },
        onLeaveBack: () => {
          console.log('↩️ Hero section left back');
        }
      }
    });

    // From full screen video to banner with space for text - starts at 20%
    heroTl.fromTo(videoContainerRef.current, {
      width: '100vw',
      top: '0vw',
      left: '0vw',
      height: '100vh'
    }, {
      width: '95vw',
      top: '2.5vw',
      left: '2.5vw',
      height: () => {
        const textEl = contentTextRef.current;
        const textHeight = textEl ? textEl.offsetHeight : 0;
        return `calc(100vh - ${textHeight}px - 7vh)`;
      },
      duration: 0.3
    }, 0.2);

    // Reveal text after video begins shrinking - starts at 30%
    heroTl.fromTo(contentTextRef.current, {
      transform: 'translateY(100%)'
    }, {
      transform: 'translateY(0%)',
      duration: 0.2
    }, 0.3)
    .call(() => {
      // Make text visible and trigger VerticalCutReveal animations
      console.log('🎬 Triggering VerticalCutReveal animations...');

      // Make "Hi there" visible and animate
      gsap.set('.hero .body-large:first-of-type', { opacity: 1 });
      if (hiThereRef.current?.startAnimation) {
        console.log('🚀 Starting "Hi there" animation');
        hiThereRef.current.startAnimation();
      }

      // Make "and I create digital experiences" visible and animate
      gsap.set('.hero .body-large:last-of-type', { opacity: 1 });
      if (createRef.current?.startAnimation) {
        console.log('🚀 Starting "and I create digital experiences" animation');
        createRef.current.startAnimation();
      }
    }, [], 0.35);

    // Add ScrollTrigger for TextPressure component (main title)
    ScrollTrigger.create({
      trigger: '.text-pressure-title',
      start: 'top 80%',
      end: 'bottom 20%',
      markers: {
        startColor: "orange",
        endColor: "orange",
        indent: 150,
        fontSize: "10px"
      },
      onEnter: () => {
        console.log('📘 TextPressure animation triggered!');
        const textPressureTl = gsap.timeline();

        textPressureTl.fromTo('.text-pressure-title',
          {
            y: 20,
            opacity: 0,
            scale: 0.95
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out"
          }
        );
      }
    });

    // Hold the final state for a long time - from 40% to 100%
    heroTl.to({}, { duration: 0.6 }, 0.4);

    // About section parallax scrolling for immersive experience
    ScrollTrigger.create({
      trigger: '.about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const aboutEl = document.querySelector('.about');
        const aboutInner = document.querySelector('.about-inner');
        
        // Removed data-speed to prevent jitter with ScrollSmoother
        
        if (aboutInner) {
          // Subtle parallax movement
          gsap.to(aboutInner, {
            y: progress * 50,
            ease: 'none'
          });
        }
      }
    });

    // Main projects section parallax
    ScrollTrigger.create({
      trigger: '.main-projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const mainProjectsEl = document.querySelector('.main-projects');
        
        // Removed data-speed to prevent jitter with ScrollSmoother
      }
    });

    // Mini projects section parallax
    ScrollTrigger.create({
      trigger: '.mini-projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const miniProjectsEl = document.querySelector('.mini-projects');
        
        // Removed data-speed to prevent jitter with ScrollSmoother
      }
    });

    // Contact section parallax
    ScrollTrigger.create({
      trigger: '.contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const contactEl = document.querySelector('.contact');
        
        // Removed data-speed to prevent jitter with ScrollSmoother
      }
    });

    // Refresh ScrollTrigger to prevent jittery behavior
    ScrollTrigger.refresh();

    // Uniform DrawSVG animation for all about section elements
    ScrollTrigger.create({
      trigger: '.about',
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 1, // Smooth scrubbing tied to scroll
      onUpdate: (self) => {
        const progress = self.progress;
        const allDrawMeElements = document.querySelectorAll('.about .draw-me');
        
        allDrawMeElements.forEach((element, index) => {
          if (gsap.plugins.drawSVG) {
            // Smooth draw progress based on scroll
            const drawProgress = Math.max(0, Math.min(1, progress * 2 - index * 0.1));
            gsap.set(element, { drawSVG: `${drawProgress * 100}%` });
          } else {
            // Fallback opacity animation
            const opacity = Math.max(0, Math.min(1, progress * 2 - index * 0.1));
            gsap.set(element, { opacity: opacity });
          }
        });
      }
    });

    // Remove aggressive scroll consumption - let natural scrolling work
    // The ScrollTrigger snap will handle the hero transition naturally

    // Set up progressive magnetic scrolling for projects
    const setupProgressiveProjectsScrolling = () => {
      const projectsSection = document.querySelector('.main-projects');
      const projectsWrapper = document.querySelector('.projects-wrapper');
      const cards = Array.from(document.querySelectorAll('.project-card'));
      const miniProjectsSection = document.querySelector('.mini-projects');

      if (!projectsSection || !projectsWrapper || cards.length < 3) return;

      const measureRequiredX = (cardIndex) => {
        const target = cards[cardIndex];
        if (!target) return 0;
        const prevTransform = projectsWrapper.style.transform;
        // Temporarily remove transform to get raw positions
        projectsWrapper.style.transform = 'none';
        const targetRect = target.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const requiredX = viewportCenterX - (targetRect.left + targetRect.width / 2);
        // Restore previous transform
        projectsWrapper.style.transform = prevTransform;
        return requiredX;
      };

      const applyScrollLogic = () => {
        const cardPositions = [
          measureRequiredX(0), // First card centered
          measureRequiredX(1), // Second card centered  
          measureRequiredX(2)  // Third card centered
        ];
        
        gsap.set(projectsWrapper, { x: cardPositions[0] });

        // Kill previous triggers for idempotency
        ScrollTrigger.getAll().forEach(t => {
          if (t.vars && (t.vars.id === 'projects-scroll' || t.vars.id?.includes('project-'))) {
            t.kill();
          }
        });

        // Initialize all cards as visible with same scale - no blur effects
        gsap.set(cards, { 
          opacity: 1, 
          scale: 1,
          filter: 'blur(0px)'
        });

        // Add hover functionality for main project cards
        cards.forEach((card, index) => {
          const colorClasses = ['hover-red', 'hover-green', 'hover-blue'];
          const container = document.querySelector('.mini-projects-viewport-container');
          
          
          card.addEventListener('mouseenter', () => {
            if (container) {
              // Remove all hover classes
              container.classList.remove('hover-red', 'hover-green', 'hover-blue', 'hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow');
              // Add appropriate hover class
              if (colorClasses[index]) {
                container.classList.add(colorClasses[index]);
              }
            }
          });
          
          card.addEventListener('mouseleave', () => {
            if (container) {
              // Remove all hover classes on mouse leave
              container.classList.remove('hover-red', 'hover-green', 'hover-blue', 'hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow');
            }
          });
        });

        // Main projects pin with smooth scrolling (no snapping)
        ScrollTrigger.create({
          id: 'projects-scroll',
          trigger: projectsSection,
          start: 'top top',
          end: '+=800vh', // Longer distance for smooth scrolling
          pin: true,
          scrub: 0.5, // Moderate scrub for smooth response
          anticipatePin: 1,
          markers: {
            startColor: "green",
            endColor: "green",
            indent: 50,
            fontSize: "10px"
          },
          onUpdate: (self) => {
            const progress = self.progress;
            let targetX;
            let activeCardIndex = 0;
            
            // MAGNETIC snapping - snaps to nearest project based on direction
            if (progress < 0.25) {
              // First project centered - magnetic to first
              targetX = cardPositions[0];
              activeCardIndex = 0;
            } else if (progress < 0.75) {
              // Second project centered - magnetic to second
              targetX = cardPositions[1];
              activeCardIndex = 1;
            } else {
              // Third project centered - magnetic to third
              targetX = cardPositions[2];
              activeCardIndex = 2;
            }
            
            // Update opacity for non-centered cards
            cards.forEach((card, index) => {
              if (index === activeCardIndex) {
                gsap.to(card, { opacity: 1, duration: 0.3 });
              } else {
                gsap.to(card, { opacity: 0.7, duration: 0.3 });
              }
            });
            
            // Smooth magnetic positioning
            gsap.to(projectsWrapper, {
              x: targetX,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        });

        // ScrollSmoother handles all smooth scrolling natively
        // No additional magnetic hints or transitions needed
      };

      // Initial apply and on resize
      applyScrollLogic();
      window.addEventListener('resize', applyScrollLogic);

      // Clean up listener on teardown of effect
      return () => window.removeEventListener('resize', applyScrollLogic);
    };

    // Set up progressive scrolling for both main and mini projects
    const setupMiniProjectsScrolling = () => {
      const miniProjectsSection = document.querySelector('.mini-projects');
      const miniProjectsWrapper = document.querySelector('.mini-projects-wrapper');
      const miniCards = Array.from(document.querySelectorAll('.mini-project-card'));


      if (!miniProjectsSection || !miniProjectsWrapper || miniCards.length < 3) {
        return;
      }

      const measureRequiredX = (cardIndex) => {
        const target = miniCards[cardIndex];
        if (!target) return 0;
        const prevTransform = miniProjectsWrapper.style.transform;
        // Temporarily remove transform to get raw positions
        miniProjectsWrapper.style.transform = 'none';
        const targetRect = target.getBoundingClientRect();
        const viewportCenterX = window.innerWidth / 2;
        const requiredX = viewportCenterX - (targetRect.left + targetRect.width / 2);
        // Restore previous transform
        miniProjectsWrapper.style.transform = prevTransform;
        return requiredX;
      };

      const applyMiniScrollLogic = () => {
        const cardPositions = [
          measureRequiredX(0), // First mini card centered
          measureRequiredX(1), // Second mini card centered  
          measureRequiredX(2), // Third mini card centered
          measureRequiredX(3)  // Fourth mini card centered (if exists)
        ];
        
        gsap.set(miniProjectsWrapper, { x: cardPositions[0] });

        // Kill previous mini project triggers for idempotency
        ScrollTrigger.getAll().forEach(t => {
          if (t.vars && (t.vars.id === 'mini-projects-scroll' || t.vars.id?.includes('mini-project-'))) {
            t.kill();
          }
        });

        // Initialize all mini cards as visible with same scale
        gsap.set(miniCards, { 
          opacity: 1, 
          scale: 1,
          filter: 'blur(0px)'
        });

        // Track the currently centered mini project
        let currentCenteredMiniProject = 0;
        
        // Add hover functionality for mini project cards
        miniCards.forEach((card, index) => {
          const colorClasses = ['hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow'];
          const container = document.querySelector('.mini-projects-viewport-container');
          
          
          card.addEventListener('mouseenter', () => {
            // Only change color if this is the currently centered project
            if (index === currentCenteredMiniProject && container) {
              // Remove all hover classes
              container.classList.remove('hover-red', 'hover-green', 'hover-blue', 'hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow');
              // Add appropriate hover class
              if (colorClasses[index]) {
                container.classList.add(colorClasses[index]);
              }
            }
          });

          
          card.addEventListener('mouseleave', () => {
            if (container) {
              // Remove all hover classes on mouse leave
              container.classList.remove('hover-red', 'hover-green', 'hover-blue', 'hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow');
            }
          });
        });

        // Mini projects pin with MAGNETIC directional snapping
        ScrollTrigger.create({
          id: 'mini-projects-scroll',
          trigger: miniProjectsSection,
          start: 'top top',
          end: '+=600vh', // Longer distance for magnetic snapping through all cards
          pin: true,
          scrub: 0.5, // Moderate scrub for smooth response
          anticipatePin: 1,
          markers: {
            startColor: "purple",
            endColor: "purple",
            indent: 0,
            fontSize: "10px"
          },
          snap: {
            snapTo: [0, 0.33, 0.66, 1], // Four discrete snap points for 4 cards
            duration: {min: 0.1, max: 0.2}, // Much shorter duration to be less intrusive
            delay: 0.3, // Longer delay to prevent aggressive snapping
            ease: 'power2.out',
            directional: false, // Allow bidirectional movement
            inertia: false, // Disable inertia to prevent unwanted snapping
            snapSpacing: 0.1, // Much smaller spacing for more precise snapping
          },
          onUpdate: (self) => {
            const progress = self.progress;
            let targetX;
            let activeCardIndex = 0;
            
            // MAGNETIC snapping - snaps to nearest mini project based on direction
            if (progress < 0.2) {
              // First mini project centered - magnetic to first
              targetX = cardPositions[0];
              activeCardIndex = 0;
            } else if (progress < 0.5) {
              // Second mini project centered - magnetic to second
              targetX = cardPositions[1];
              activeCardIndex = 1;
            } else if (progress < 0.8) {
              // Third mini project centered - magnetic to third
              targetX = cardPositions[2];
              activeCardIndex = 2;
            } else {
              // Fourth mini project centered - magnetic to fourth
              targetX = cardPositions[3] || cardPositions[2]; // Fallback to third if no fourth
              activeCardIndex = 3;
            }
            
            // Update the currently centered project
            currentCenteredMiniProject = activeCardIndex;
            
            // Update opacity for non-centered mini cards
            miniCards.forEach((card, index) => {
              if (index === activeCardIndex) {
                gsap.to(card, { opacity: 1, duration: 0.3 });
              } else {
                gsap.to(card, { opacity: 0.7, duration: 0.3 });
              }
            });

            // Reset container to white when scrolling (only hover should change color)
            const container = document.querySelector('.mini-projects-viewport-container');
            if (container) {
              // Remove all hover classes when scrolling
              container.classList.remove('hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow');
            }
            
            // Smooth magnetic positioning
            gsap.to(miniProjectsWrapper, {
              x: targetX,
              duration: 0.3,
              ease: "power2.out"
            });

            // Animate the second line of the title - simple right shift
            const secondLine = document.querySelector('.mini-projects-title-second-line');
            if (secondLine) {
              const shiftAmount = progress * 100; // Shift up to 100px to the right
              gsap.to(secondLine, {
                x: shiftAmount,
                duration: 0.3,
                ease: "power3.out"
              });
            }
          }
        });
      };

      // Initial apply and on resize
      applyMiniScrollLogic();
      window.addEventListener('resize', applyMiniScrollLogic);

      // Clean up listener on teardown of effect
      return () => window.removeEventListener('resize', applyMiniScrollLogic);
    };

    // Setup progressive projects scrolling after a brief delay to ensure DOM is ready
    setTimeout(setupProgressiveProjectsScrolling, 100);
    setTimeout(setupMiniProjectsScrolling, 500); // Longer delay to ensure mini projects are rendered
    
    // Fallback: retry mini projects setup if it failed
    setTimeout(() => {
      const miniCards = document.querySelectorAll('.mini-project-card');
      if (miniCards.length === 0) {
        setupMiniProjectsScrolling();
      }
    }, 1000);

    return () => {
      // Kill all GSAP animations and timelines
      gsap.killTweensOf("*");
      ScrollTrigger.getAll().forEach(t => t.kill());
      
      // Reset scroll position
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      gsap.set(window, { scrollTo: 0 });
      gsap.set(document.documentElement, { scrollTop: 0 });
      gsap.set(document.body, { scrollTop: 0 });
      
      // Reset all component states
      setActiveSection(null);
      setLoaderComplete(false);
      
      // Remove event listeners
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // ScrollSmoother cleanup not needed since it's disabled
      
      // Re-enable scrolling on cleanup
      document.body.style.overflow = '';
    };
  }, []);

  // Custom cursor
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = -50; // Position cursor at top center but out of sight
    let trailX = window.innerWidth / 2;
    let trailY = -50; // Position trail at top center but out of sight

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    document.body.appendChild(cursor);

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    document.body.appendChild(trail);

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    };

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.3;
      trailY += (mouseY - trailY) * 0.3;
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
      requestAnimationFrame(animateTrail);
    };

    animateTrail();
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
      if (trail.parentNode) trail.parentNode.removeChild(trail);
    };
  }, []);

  // Update ref whenever state changes
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Simple click handler using ref to avoid closure issues
  const handleClick = (sectionName, isCloseIcon = false) => {
    const currentActiveSection = activeSectionRef.current;
    
    // Two-state machine: null (neutral) or one of sections (expanded)
    if (currentActiveSection) {
      // Any click when expanded -> close
      setActiveSection(null);
    } else {
      // Only open if not clicking close icon (which shouldn't be visible anyway)
      if (!isCloseIcon) {
        setActiveSection(sectionName);
      } else {
      }
    }
  };

  // Set up click handlers ONCE - no dependencies
  useEffect(() => {
    const rows = document.querySelectorAll('.about-title-line');
    const detailArea = document.querySelector('.about-detail');
    
    const clickHandlers = new Map();
    
    rows.forEach((row) => {
      const sectionName = row.dataset.section;
      if (!sectionName) return;
      
      // Handler for the whole row
      const rowHandler = (e) => {
        // Check if clicking on close icon
        const isCloseIcon = e.target.closest('.close-icon');
        e.stopPropagation();
        handleClick(sectionName, !!isCloseIcon);
      };
      
      clickHandlers.set(row, rowHandler);
      row.addEventListener('click', rowHandler);
      row.style.cursor = 'pointer';
    });
    
    const detailHandler = () => {
      setActiveSection(null);
    };
    
    if (detailArea) {
      detailArea.addEventListener('click', detailHandler);
    }
    
    return () => {
      clickHandlers.forEach((handler, row) => {
        row.removeEventListener('click', handler);
      });
      if (detailArea) {
        detailArea.removeEventListener('click', detailHandler);
      }
    };
  }, []); // NO DEPENDENCIES!

  // Update visual states and handle SVG morphing
  useEffect(() => {
    const rows = document.querySelectorAll('.about-title-line');
    
    rows.forEach((row) => {
      const sectionName = row.dataset.section;
      const isActive = activeSection === sectionName;
      
      if (isActive) {
        row.classList.add('active');
      } else {
        row.classList.remove('active');
      }
      
      // Get morphing elements
      const morphPath = row.querySelector(`#morph-${sectionName}`);
      const morphFillPath = row.querySelector(`.fill-clip #morph-${sectionName}`);
      const arrowId = `#arrow-${sectionName}`;
      const closeId = `#close-${sectionName}`;
      
      if (morphPath) {
        if (gsap.plugins.morphSVG) {
          // Use MorphSVGPlugin for smooth morphing - sync with write-up timing
          gsap.to(morphPath, {
            duration: 0.7, // Match write-up duration
            morphSVG: isActive ? closeId : arrowId,
            ease: "power2.out" // Match write-up easing
          });
        } else {
          // Fallback to opacity/scale animation
          gsap.to(morphPath, {
            opacity: 0.8,
            scale: isActive ? 0.9 : 1,
            duration: 0.7, // Match write-up duration
            ease: "power2.out" // Match write-up easing
          });
        }
      }
      
      if (morphFillPath) {
        if (gsap.plugins.morphSVG) {
          // Morph the fill version too - sync with write-up timing
          gsap.to(morphFillPath, {
            duration: 0.7, // Match write-up duration
            morphSVG: isActive ? closeId : arrowId,
            ease: "power2.out" // Match write-up easing
          });
        } else {
          // Fallback for fill version
          gsap.to(morphFillPath, {
            opacity: 0.8,
            scale: isActive ? 0.9 : 1,
            duration: 0.7, // Match write-up duration
            ease: "power2.out" // Match write-up easing
          });
        }
      }
    });
  }, [activeSection]);

  // Animation functions for section transitions with proper state management
  useEffect(() => {
    // Kill any existing animations to prevent conflicts
    gsap.killTweensOf(['.about-kicker', '.about-title-line', '.about-detail']);
    
    if (activeSection) {
      animateToDetail(activeSection);
    } else {
      animateToDefault();
    }
  }, [activeSection]);

  const animateToDetail = (section) => {
    const masterTl = gsap.timeline();
    const rows = document.querySelectorAll('.about-title-line');
    const otherRows = Array.from(rows).filter(row => row.dataset.section !== section);
    const aboutDetail = document.querySelector('.about-detail');
    
    // No need to move grid - let it stay in natural position
    
    // Measure the actual content height with a reasonable maximum
    let targetDetailHeightPx = 300; // fallback
    if (aboutDetail) {
      // Temporarily show the content to measure its natural height
      const originalHeight = aboutDetail.style.height;
      const originalOpacity = aboutDetail.style.opacity;
      const originalOverflow = aboutDetail.style.overflow;
      
      aboutDetail.style.height = 'auto';
      aboutDetail.style.opacity = '1';
      aboutDetail.style.overflow = 'visible';
      aboutDetail.style.visibility = 'visible';
      
      // Get the natural height
      const naturalHeight = aboutDetail.offsetHeight;
      
      // Use natural height but cap it at a reasonable maximum
      targetDetailHeightPx = Math.min(naturalHeight, 500); // Cap at 500px max
      
      // Restore collapsed state
      aboutDetail.style.height = originalHeight || '0px';
      aboutDetail.style.opacity = originalOpacity || '0';
      aboutDetail.style.overflow = originalOverflow || 'hidden';
    }
    
    
    // Store current scroll position to maintain it
    const currentScrollY = window.scrollY;
    
    masterTl
      // Phase 1: Hide kicker and non-selected rows
      .to('.about-kicker', {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .to(otherRows, {
        opacity: 0,
        y: -30,
        height: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.05
      }, '<+0.1')
      .to('.about-title', {
        gap: 0,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '<')
      // Phase 2: Write-up grows in naturally
      .to('.about-detail', {
        opacity: 1,
        height: targetDetailHeightPx, // Animate to measured height
        duration: 0.6,
        ease: 'power2.out'
      }, '<+0.1')
      // ScrollSmoother handles scroll position naturally
  };

  const animateToDefault = () => {
    const masterTl = gsap.timeline();
    const rows = document.querySelectorAll('.about-title-line');
    const aboutDetail = document.querySelector('.about-detail');
    
    // Store current scroll position to maintain it
    const currentScrollY = window.scrollY;
    
    // Ensure we have a numeric height to animate down from; if height is 'auto', set it to current pixel height first
    if (aboutDetail) {
      const computed = window.getComputedStyle(aboutDetail).height;
      if (computed === 'auto' || computed === '' || computed === null) {
        const currentPx = aboutDetail.scrollHeight;
        aboutDetail.style.height = currentPx + 'px';
      }
    }

    masterTl
      // Phase 1: Shrink detail content naturally
      .to('.about-detail', {
        opacity: 0,
        height: 0,
        duration: 0.8, // Longer duration for smooth shrinking
        ease: 'power2.out' // Fast at beginning, slow at end
      })
      // ScrollSmoother handles scroll momentum naturally
      // Phase 3: Restore rows and spacing
      .to(rows, {
        y: 0,
        opacity: 1,
        height: 'auto',
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.03
      }, '<+0.1')
      .to('.about-title', {
        gap: 'clamp(8px, 1.8vw, 14px)',
        duration: 0.6,
        ease: 'power2.out'
      }, '<')
      // Phase 3: Show kicker
      .to('.about-kicker', {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      }, '<+0.2');
  };


  const getSectionData = (section) => {
    const data = {
      psychology: {
        icon: <PsychologyIcon />,
        title: 'Lorem Ipsum Lorem Ipsum',
        body: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
      },
      design: {
        icon: <DesignIcon />,
        title: 'Lorem Ipsum Lorem Ipsum',
        body: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
      },
      code: {
        icon: <CodeIcon />,
        title: 'Lorem Ipsum Lorem Ipsum',
        body: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum'
      }
    };
    return data[section];
  };

  return (
    <>
          <div>
            <div className="loader" ref={loaderRef}>
              <div className="loading-bar-container">
                <div className="loading-bar-background"></div>
                <div className="loading-bar-fill" ref={loadingBarRef}></div>
              </div>
            </div>
          </div>

          {/* Pinned hero that transitions, then releases to normal scroll */}
          <section className="hero" style={{ border: '2px solid red' }}>
            <div className="video-container" ref={videoContainerRef} style={{ border: '2px solid blue' }}>
              <video ref={videoRef} src="/video.mp4" autoPlay muted playsInline style={{ border: '2px solid green' }} />
            </div>
            
            <div className="content-text" ref={contentTextRef} style={{ border: '2px solid orange' }}>
              <div style={{ border: '2px solid purple', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                  <VerticalCutReveal
                    ref={hiThereRef}
                    splitBy="words"
                    staggerDuration={0.1}
                    staggerFrom="first"
                    autoStart={false}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 21,
                    }}
                    containerClassName="body-large"
                    style={{ border: '2px solid yellow', margin: 0, opacity: 0 }}
                  >
                    Hi there,
                  </VerticalCutReveal>
                </div>
                 <TextPressure
                   text="I'm Pratik"
                   flex={false}
                   alpha={false}
                   stroke={false}
                   width={true}
                   weight={true}
                   italic={false}
                   textColor="#000000"
                   strokeColor="#ff0000"
                   className=""
                   style={{ opacity: 0 }}
                 />
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                  <VerticalCutReveal
                    ref={createRef}
                    splitBy="words"
                    staggerDuration={0.1}
                    staggerFrom="last"
                    reverse={true}
                    autoStart={false}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 21,
                    }}
                    containerClassName="body-large"
                    style={{ border: '2px solid magenta', margin: 0, opacity: 0 }}
                  >
                    and I create digital experiences
                  </VerticalCutReveal>
                </div>
              </div>
            </div>
          </section>

      {/* About / Next Screen Wireframe */}
      <section className="about">
        <div className="about-inner">
          <div className="about-header" ref={aboutHeaderRef}>
            <div className="about-kicker">Operating at the intersection of</div>
            <div className="about-title" ref={aboutTitleRef}>
              <div className="about-title-line" data-section="psychology">
                <PsychologyIcon className="category-icon" />
                <span className="arrow">
                  <span className="icon-base">
                    <MorphingIcon className="morphing-icon" sectionName="psychology" />
                  </span>
                  <span className="fill-clip">
                    <MorphingIcon className="morphing-icon icon-fill" sectionName="psychology" filled />
                  </span>
                </span>
              </div>
              <div className="about-title-line" data-section="design">
                <DesignIcon className="category-icon" />
                <span className="arrow">
                  <span className="icon-base">
                    <MorphingIcon className="morphing-icon" sectionName="design" />
                  </span>
                  <span className="fill-clip">
                    <MorphingIcon className="morphing-icon icon-fill" sectionName="design" filled />
                  </span>
                </span>
              </div>
              <div className="about-title-line" data-section="code">
                <CodeIcon className="category-icon" />
                <span className="arrow">
                  <span className="icon-base">
                    <MorphingIcon className="morphing-icon" sectionName="code" />
                  </span>
                  <span className="fill-clip">
                    <MorphingIcon className="morphing-icon icon-fill" sectionName="code" filled />
                  </span>
                </span>
              </div>
        </div>
      </div>

          {/* Detail section that appears on click */}
          <div className="about-detail" ref={aboutDetailRef}>
            {activeSection && (
              <div className="detail-content">
                <div className="detail-left">
                  <div className="detail-icon">
                    {getSectionData(activeSection).icon}
                  </div>
        </div>
                <div className="detail-right">
                  <h3 className="detail-title">{getSectionData(activeSection).title}</h3>
                  <p className="detail-body">{getSectionData(activeSection).body}</p>
        </div>
      </div>
            )}
          </div>
          
          <div className="about-grid">
            <div className="about-col-left">I take full ownership of my work—from initial problem identification to final implementation. Whether I'm debugging code at 2 AM or redesigning a flow for the fifth time, I'm driven by creating products that genuinely improve how people work and think.</div>
            <div className="about-col-right"><span className="about-strong">What I bring:</span> <span className="about-caption">Deep problem-solving, cross-functional execution, and the rare ability to think simultaneously as a user, designer, developer, and business owner.</span></div>
          </div>
        </div>
      </section>

      {/* Main Projects Section with Magnetic Scrolling */}
      <section className="main-projects">
        <div className="main-projects-header">
          <h2 className="main-projects-title">MY WORK.</h2>
        </div>
        <div className="projects-container">
          <div className="projects-track">
            <div className="projects-wrapper">
              <Link to="/cognixa" className="project-card red-project">
                <div className="project-rectangle"></div>
                <div className="project-info">
                  <h3 className="project-title">Cognixa: Building Alone, Building User-First</h3>
                  <p className="project-subtitle">From Psychology to Product, A UX first approach into Systems Thinking and Data-Driven Decision Making</p>
                </div>
              </Link>
              
              <Link to="/settlin" className="project-card green-project">
                <div className="project-rectangle"></div>
                <div className="project-info">
                  <h3 className="project-title">Settlin : Designing with a product mindset</h3>
                  <p className="project-subtitle">My learnings that helped me think in systems and wholistic ecosystem rather than free standing domains</p>
                </div>
              </Link>
              
              <Link to="/settlin" className="project-card blue-project">
                <div className="project-rectangle"></div>
                <div className="project-info">
                  <h3 className="project-title">Settlin : Designing with a product mindset</h3>
                  <p className="project-subtitle">My learnings that helped me think in systems and wholistic ecosystem rather than free standing domains</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Projects Section with Horizontal Scrolling */}
      <section className="mini-projects">
        <div className="mini-projects-header">
            <h2 className="mini-projects-title">
              THINGS I DO WHEN<br />
              <span className="mini-projects-title-second-line">I CANT SIT STILL</span>
            </h2>
        </div>
        <div className="mini-projects-container">
          {/* Invisible viewport container - this is the black rectangle reference */}
          <div className="mini-projects-viewport-container">
            <div className="mini-projects-track">
              <div className="mini-projects-wrapper">
                <Link to="/animation-library" className="mini-project-card purple-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Quick Study: Animation Library</h3>
                    <p className="mini-project-subtitle">Exploring motion design principles through code</p>
                  </div>
                </Link>
                
                <Link to="/data-viz" className="mini-project-card orange-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Data Visualization Tool</h3>
                    <p className="mini-project-subtitle">Interactive charts for complex datasets</p>
                  </div>
                </Link>
                
                <Link to="/mobile-app" className="mini-project-card teal-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Mobile App Prototype</h3>
                    <p className="mini-project-subtitle">Rapid prototyping with React Native</p>
                  </div>
                </Link>
                
                <Link to="/ai-chat" className="mini-project-card yellow-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">AI Chat Interface</h3>
                    <p className="mini-project-subtitle">Conversational UI experiments</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Me Section */}
      <section className="contact">
        <div className="contact-content">
          <h2>Contact Me</h2>
          <p>Let's work together...</p>
        </div>
      </section>
    </>
  );
}

export default function App() {
  return (
    <Router>
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
    </Router>
  );
}