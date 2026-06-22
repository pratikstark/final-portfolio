import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Lenis from 'lenis';
import mixpanel from 'mixpanel-browser';
import './App.css';
import AnimationLibraryProject from './pages/AnimationLibraryProject';
import CognixaProject from './pages/CognixaProject';
import SettlinProject from './pages/SettlinProject';
import DataVizProject from './pages/DataVizProject';
import MobileAppProject from './pages/MobileAppProject';
import AIChatProject from './pages/AIChatProject';
import PravahProject from './pages/PravahProject';

// Import SVG assets for arrow/close widget
import arrowSvg from './assets/arrow.svg';
import closeSvg from './assets/close.svg';

// Global debug state
let globalDebugMode = false;

// True on touch devices / narrow viewports — used to give mobile its own hero
// treatment (no desktop pin/shrink) and other touch-appropriate behaviour.
const isTouchOrNarrow = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(max-width: 900px), (hover: none) and (pointer: coarse)').matches;

// Store original console methods

// Debug logger - only logs when debug mode is enabled
const debugLog = (...args) => {
  if (globalDebugMode) {
    originalConsoleLog(...args);
  }
};

const debugError = (...args) => {
  if (globalDebugMode) {
    originalConsoleError(...args);
  }
};

const debugWarn = (...args) => {
  if (globalDebugMode) {
    originalConsoleWarn(...args);
  }
};

// Project page imports removed - they're now in App.js
import { TextPressure } from './components/ui/interactive-text-pressure.js';
import { VerticalCutReveal } from './components/ui/vertical-cut-reveal.js';
// Project image URLs
const COGNIXA_NON_HOVERED = 'https://cdn.pratiksinghal.in/Projects%20Aseets/COGNIXA.png';
const COGNIXA_HOVERED = 'https://cdn.pratiksinghal.in/Projects%20Aseets/COGNIXA_HOVER.png';
const SETTLIN_NON_HOVERED = 'https://cdn.pratiksinghal.in/Projects%20Aseets/SETTLIN.png';
const SETTLIN_HOVERED = 'https://cdn.pratiksinghal.in/Projects%20Aseets/SETTLIN_HOVER.png';
const PRAVAH_NON_HOVERED = 'https://cdn.pratiksinghal.in/Projects%20Aseets/PRAVAH.png';
const PRAVAH_HOVERED = 'https://cdn.pratiksinghal.in/Projects%20Aseets/PRAVAH_HOVER.png';
import { createOdometerAnimation, setInitialHiddenState } from './utils/odometer-animation.js';
import ScrollVelocity from './components/ui/ScrollVelocity.jsx';
import LightRays from './components/ui/LightRays.js';
import Aurora from './components/ui/Aurora.js';

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
  debugLog('DrawSVGPlugin registered successfully');
} catch (e) {
  debugLog('DrawSVGPlugin not available - using fallback');
}

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

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

// Simple Arrow Widget for Projects - fills on hover
function ProjectArrow() {
  return (
    <span className="project-arrow">
      <span className="project-arrow-base">
        <svg
          viewBox="0 0 85 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="project-arrow-svg-stroke"
        >
          <path
            d="M84.6377 0V60H67.6377V28.5889L24.041 72.1855H0L55.1855 17H24.6377V0H84.6377Z"
            fill="none"
            stroke="#111"
            strokeWidth="2"
          />
        </svg>
      </span>
      <span className="project-arrow-fill-clip">
        <svg
          viewBox="0 0 85 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="project-arrow-svg-fill"
        >
          <path
            d="M84.6377 0V60H67.6377V28.5889L24.041 72.1855H0L55.1855 17H24.6377V0H84.6377Z"
            fill="#111"
            className="project-arrow-svg-fill-path"
          />
        </svg>
      </span>
    </span>
  );
}

// Arrow/Close Widget Component - fills from bottom synchronized with text
function ArrowCloseWidget({ sectionName, isActive = false }) {
  return (
    <span className="arrow-close-widget">
      <span className="arrow-close-base">
        {/* Arrow SVG - stroke version (visible by default) */}
        <svg
          viewBox="0 0 85 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-svg-stroke"
        >
          <path
            d="M84.6377 0V60H67.6377V28.5889L24.041 72.1855H0L55.1855 17H24.6377V0H84.6377Z"
            fill="none"
            stroke="#111"
            strokeWidth="2"
          />
        </svg>
      </span>
      <span className="arrow-close-fill-clip">
        {/* Arrow SVG - fill version (fills from bottom on hover) */}
        <svg
          viewBox="0 0 85 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="arrow-svg-fill"
        >
          <path
            d="M84.6377 0V60H67.6377V28.5889L24.041 72.1855H0L55.1855 17H24.6377V0H84.6377Z"
            fill="#111"
            className="arrow-svg-fill-path"
          />
        </svg>
      </span>
      <span className="arrow-close-close-clip">
        {/* Close SVG - stroke version (shown when active) */}
        <span className="arrow-close-close-base">
          <svg
            viewBox="0 0 85 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-close-close"
          >
            <path
              d="M21.3018 0L42.499 23.9248L63.6982 0H85L53.1504 35.9463L84.999 71.8926H63.6982L42.5 47.9668L21.3018 71.8926H0L31.8486 35.9463L0 0H21.3018Z"
              fill="none"
              stroke="#111"
              strokeWidth="2"
              className="arrow-close-close-path"
            />
          </svg>
        </span>
        {/* Close SVG - fill version (fills on hover) */}
        <span className="arrow-close-close-fill-clip">
          <svg
            viewBox="0 0 85 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-close-close-fill"
          >
            <path
              d="M21.3018 0L42.499 23.9248L63.6982 0H85L53.1504 35.9463L84.999 71.8926H63.6982L42.5 47.9668L21.3018 71.8926H0L31.8486 35.9463L0 0H21.3018Z"
              fill="#111"
              className="arrow-close-close-fill-path"
            />
          </svg>
        </span>
      </span>
    </span>
  );
}

// Morphing SVG component that contains both arrow and close paths
function MorphingIcon({ className = '', isClose = false, filled = false, sectionName = '' }) {
  const arrowId = `arrow-${sectionName}`;
  const closeId = `close-${sectionName}`;
  const morphId = `morph-${sectionName}`;

  return (
    <svg
      className={className}
      viewBox="0 0 88 89"
      preserveAspectRatio="xMidYMid meet"
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

// Import PNG assets
import emailImg from './assets/email.png';
import scheduleImg from './assets/schedule.png';
import messageImg from './assets/message.png';

// Contact Icon Components using PNG assets
function EmailIcon({ className = '' }) {
  debugLog('🔍 EmailIcon rendering, image path:', emailImg);
  return (
    <div className={`category-svg ${className}`}>
      <img
        src={emailImg}
        alt="EMAIL ME"
        className="svg-stroke"
        style={{ width: 'auto', height: '100%', objectFit: 'contain', display: 'block' }}
        onLoad={() => debugLog('✅ Email image loaded')}
        onError={(e) => debugError('❌ Email image error:', e)}
      />
      <img
        src={emailImg}
        alt="EMAIL ME"
        className="svg-fill"
        style={{ width: 'auto', height: '100%', objectFit: 'contain', display: 'block' }}
        onLoad={() => debugLog('✅ Email fill loaded')}
        onError={(e) => debugError('❌ Email fill error:', e)}
      />
    </div>
  );
}

function ScheduleIcon({ className = '' }) {
  return (
    <div className={`category-svg ${className}`}>
      <img
        src={scheduleImg}
        alt="SCHEDULE CALL"
        className="svg-stroke"
        style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
      />
      <img
        src={scheduleImg}
        alt="SCHEDULE CALL"
        className="svg-fill"
        style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
      />
    </div>
  );
}

function MessageIcon({ className = '' }) {
  return (
    <div className={`category-svg ${className}`}>
      <img
        src={messageImg}
        alt="LEAVE A MESSAGE"
        className="svg-stroke"
        style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
      />
      <img
        src={messageImg}
        alt="LEAVE A MESSAGE"
        className="svg-fill"
        style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
      />
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

// Main portfolio component - ONLY renders on homepage
function PortfolioApp() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const loaderRef = useRef(null);
  const loadingBarRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const contentTextRef = useRef(null);
  const line1Ref = useRef(null);
  const nameRef = useRef(null);
  const line3Ref = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoveredMiniProject, setHoveredMiniProject] = useState(null);
  const [showMiniAurora, setShowMiniAurora] = useState(false);
  const [showPrismOverlay, setShowPrismOverlay] = useState(false);
  const [showCognixaOverlay, setShowCognixaOverlay] = useState(false);
  const [showSettlinOverlay, setShowSettlinOverlay] = useState(false);
  const [showDataVizOverlay, setShowDataVizOverlay] = useState(false);
  const [showMobileAppOverlay, setShowMobileAppOverlay] = useState(false);
  const [showAIChatOverlay, setShowAIChatOverlay] = useState(false);
  const [showPravahOverlay, setShowPravahOverlay] = useState(false);
  
  // Project slug to overlay state mapping - using actual project names
  const projectSlugMap = {
    'prism': { setter: setShowPrismOverlay, getter: showPrismOverlay },
    'cognixa': { setter: setShowCognixaOverlay, getter: showCognixaOverlay },
    'settlin': { setter: setShowSettlinOverlay, getter: showSettlinOverlay },
    'jarvis': { setter: setShowDataVizOverlay, getter: showDataVizOverlay },
    'bloom-bakehouse': { setter: setShowMobileAppOverlay, getter: showMobileAppOverlay },
    'conscious-living': { setter: setShowAIChatOverlay, getter: showAIChatOverlay },
    'pravah': { setter: setShowPravahOverlay, getter: showPravahOverlay }
  };
  
  // Sync URL hash with overlay state
  useEffect(() => {
    const hash = location.hash.slice(1); // Remove the # symbol
    const project = projectSlugMap[hash];
    
    if (hash && project) {
      // Open overlay if URL has hash and overlay is not already open
      if (!project.getter) {
        project.setter(true);
      }
    } else if (!hash) {
      // Close all overlays if no hash
      Object.values(projectSlugMap).forEach(({ getter, setter }) => {
        if (getter) {
          setter(false);
        }
      });
    }
  }, [location.hash, showPrismOverlay, showCognixaOverlay, showSettlinOverlay, showDataVizOverlay, showMobileAppOverlay, showAIChatOverlay, showPravahOverlay]);
  
  // Helper function to open overlay with URL update
  const openOverlay = (projectSlug) => {
    const project = projectSlugMap[projectSlug];
    if (project) {
      project.setter(true);
      // Use replace: false to add to history so back button works
      navigate(`#${projectSlug}`, { replace: false });
    }
  };
  
  // Helper function to close overlay with URL update
  const closeOverlay = (projectSlug) => {
    const project = projectSlugMap[projectSlug];
    if (project) {
      project.setter(false);
      // Use replace: false to add to history so back button works
      navigate('#', { replace: false });
    }
  };
  
  // Close all overlays helper
  const closeAllOverlays = () => {
    Object.keys(projectSlugMap).forEach(slug => {
      const project = projectSlugMap[slug];
      if (project.getter) {
        project.setter(false);
      }
    });
    // Use replace: false to add to history so back button works
    navigate('#', { replace: false });
  };

  // Track session start time and scroll depth
  const sessionStartTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const projectsViewed = useRef(new Set());
  const timeOnPageBeforeView = useRef(Date.now());
  const projectHoverTimers = useRef({});
  const projectsHovered = useRef(new Set());

  // Helper function to calculate scroll depth percentage
  const getScrollDepth = () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    const scrollableHeight = documentHeight - windowHeight;
    if (scrollableHeight <= 0) return 0;
    return Math.min(100, Math.round((scrollTop / scrollableHeight) * 100));
  };

  // Track scroll depth
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentDepth = getScrollDepth();
        if (currentDepth > maxScrollDepth.current) {
          maxScrollDepth.current = currentDepth;
          
          // Track milestone scroll depths (25%, 50%, 75%, 100%)
          if ([25, 50, 75, 100].includes(currentDepth)) {
            if (mixpanel && typeof mixpanel.track === 'function') {
              try {
                mixpanel.track('Scroll Depth', {
                  scroll_depth_percent: currentDepth,
                  max_scroll_depth: maxScrollDepth.current,
                  time_on_page: Math.round((Date.now() - sessionStartTime.current) / 1000),
                });
              } catch (e) {
                // Silently fail
              }
            }
          }
        }
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // Track project hovers for analytics (2+ seconds indicates interest)
  useEffect(() => {
    if (hoveredProject) {
      // Clear any existing timer for this project
      if (projectHoverTimers.current[hoveredProject]) {
        clearTimeout(projectHoverTimers.current[hoveredProject]);
      }
      
      // Set timer to track hover after 2 seconds (indicates interest)
      projectHoverTimers.current[hoveredProject] = setTimeout(() => {
        if (!projectsHovered.current.has(hoveredProject)) {
          projectsHovered.current.add(hoveredProject);
          
          if (mixpanel && typeof mixpanel.track === 'function') {
            try {
              mixpanel.track('Project Hover', {
                project_name: hoveredProject,
                project_type: 'main',
                hover_duration: 2,
                time_on_page: Math.round((Date.now() - sessionStartTime.current) / 1000),
                scroll_depth: getScrollDepth(),
                total_projects_hovered: projectsHovered.current.size,
              });
            } catch (e) {
              // Silently fail
            }
          }
        }
      }, 2000);
    } else {
      // Clear all timers when no project is hovered
      Object.values(projectHoverTimers.current).forEach(timer => clearTimeout(timer));
      projectHoverTimers.current = {};
    }
    
    return () => {
      // Cleanup timers on unmount
      Object.values(projectHoverTimers.current).forEach(timer => clearTimeout(timer));
    };
  }, [hoveredProject]);

  // Helper functions to track project views
  const trackProjectView = (projectName, projectType) => {
    if (mixpanel && typeof mixpanel.track === 'function') {
      try {
        const timeBeforeView = Math.round((Date.now() - timeOnPageBeforeView.current) / 1000);
        const scrollDepth = getScrollDepth();
        
        projectsViewed.current.add(projectName);
        
        mixpanel.track('Page View', {
          page_url: window.location.href,
          page_title: `${projectName} - Project`,
          project_name: projectName,
          project_type: projectType,
          time_on_page_before_view: timeBeforeView,
          scroll_depth_at_view: scrollDepth,
          total_projects_viewed: projectsViewed.current.size,
          max_scroll_depth: maxScrollDepth.current,
          session_duration: Math.round((Date.now() - sessionStartTime.current) / 1000),
        });
      } catch (e) {
        // Silently fail if Mixpanel tracking fails
      }
    }
  };
  const [thirdProjectHoveredFor1s, setThirdProjectHoveredFor1s] = useState(false);
  const thirdProjectHoverTimerRef = useRef(null);
  const thirdProjectHoveredFor1sRef = useRef(false);
  const lastScrollProgressRef = useRef(0);
  const isScrollingDownRef = useRef(false);
  const scrollVelocityRef = useRef(0);
  const lastScrollTimeRef = useRef(Date.now());
  const lastMiniScrollProgressRef = useRef(0);
  const isMiniScrollingDownRef = useRef(false);
  const miniScrollVelocityRef = useRef(0);
  const lastMiniScrollTimeRef = useRef(Date.now());
  const lastVerticalScrollYRef = useRef(0);
  const isScrollingUpwardRef = useRef(false);
  const previousHoveredProjectRef = useRef(null);
  const previousHoveredMiniProjectRef = useRef(null);
  const activeProjectIdRef = useRef(null);
  const activeMiniProjectIdRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const hasTriggeredTransitionRef = useRef(false);
  const hasTriggeredMiniTransitionRef = useRef(false);
  const isScrollingToDifferentProjectRef = useRef(false);
  const isScrollingToDifferentMiniProjectRef = useRef(false);
  const isMagneticScrollingRef = useRef(false);
  const magneticScrollTimeoutRef = useRef(null);
  const aboutHeaderRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const aboutDetailRef = useRef(null);
  const activeSectionRef = useRef(null);
  // Homepage scroll position captured when a project overlay opens, so closing it
  // returns the user to the exact spot they left from.
  const overlayScrollRef = useRef(0);
  const lastSignificantScrollYRef = useRef(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  const handleAudioPrompt = (shouldUnmute) => {
    if (shouldUnmute) {
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {});
      }
      
      // Track video unmute
      if (mixpanel && typeof mixpanel.track === 'function') {
        try {
          mixpanel.track('Video Interaction', {
            action: 'unmute',
            time_on_page: Math.round((Date.now() - sessionStartTime.current) / 1000),
            scroll_depth: getScrollDepth(),
          });
        } catch (e) {
          // Silently fail
        }
      }
    }
    setShowAudioPrompt(false);
  };

  // Mobile hero affordance: unmute + push the video into native fullscreen
  // (rotating the phone there fills the screen with sound).
  const handleMobileImmerse = () => {
    const v = videoRef.current;
    if (!v) return;
    setIsMuted(false);
    v.muted = false;
    v.play().catch(() => {});
    const req = v.requestFullscreen || v.webkitEnterFullscreen ||
                v.webkitRequestFullscreen || v.msRequestFullscreen;
    try { if (req) req.call(v); } catch (e) { /* fullscreen may be blocked */ }
  };

  // Rotating a phone into landscape is the immersive moment: auto-attempt native
  // fullscreen + sound. Best-effort — some browsers require a tap, so the rotate
  // cue stays as a fallback, and the CSS already fills the screen in landscape
  // regardless. Rotating back to portrait exits fullscreen.
  useEffect(() => {
    if (!isTouchOrNarrow()) return undefined;
    const mq = window.matchMedia('(orientation: landscape)');
    const enterImmersive = () => {
      const v = videoRef.current;
      if (!v) return;
      setIsMuted(false);
      v.muted = false;
      v.play().catch(() => {});
      const req = v.requestFullscreen || v.webkitEnterFullscreen ||
                  v.webkitRequestFullscreen || v.msRequestFullscreen;
      try { if (req) req.call(v); } catch (e) { /* gesture may be required */ }
    };
    const exitImmersive = () => {
      const v = videoRef.current;
      // iOS plays video fullscreen on the ELEMENT (not the document), so it has to
      // be closed on the element — do this first so rotating back exits cleanly.
      if (v && v.webkitDisplayingFullscreen && typeof v.webkitExitFullscreen === 'function') {
        try { v.webkitExitFullscreen(); } catch (e) { /* ignore */ }
      }
      // Standard / webkit document fullscreen.
      const ex = document.exitFullscreen || document.webkitExitFullscreen;
      try {
        if (ex && (document.fullscreenElement || document.webkitFullscreenElement)) {
          ex.call(document);
        }
      } catch (e) { /* ignore */ }
      // Back in portrait we're the quiet letterbox again — re-mute so nothing keeps
      // playing sound behind the scroll, and the Unmute control re-appears.
      if (v) v.muted = true;
      setIsMuted(true);
    };
    const onChange = (e) => { if (e.matches) enterImmersive(); else exitImmersive(); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Smooth scroll — Lenis is the SINGLE source of truth for scroll position.
  // Everything else only reads scroll; nothing else writes it. Snapping to a
  // project happens here on scroll-end (via Lenis) so it shares one easing and
  // never fights the user's input. This replaces ScrollTrigger's native snap,
  // the magnetic auto-scroll, the hover gsap.to(window) jumps and contact locks.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo.out
      smoothWheel: !reduce,
      gestureOrientation: 'vertical',
      touchMultiplier: 1.5,
      wheelMultiplier: 1,
      // Let any open project overlay scroll natively. Lenis preventDefaults wheel
      // globally (even while .stop()'d), so without this the inner case-study
      // pages can't scroll. data-lenis-prevent semantics, but for every overlay.
      prevent: (node) => !!(node && node.closest && node.closest('.project-overlay')),
    });
    window.__lenis = lenis;

    const raf = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);

    // Snap to the nearest project on scroll-end. One writer (Lenis), shared easing.
    const snapCfg = [
      { id: 'projects-scroll', points: [0, 0.5, 1] },
      { id: 'mini-projects-scroll', points: [0, 1 / 3, 2 / 3, 1] },
    ];
    let snapT = null, snapping = false, safety = null;
    // Keep a snap that lands on the FIRST/LAST card a few px INSIDE the pin range.
    // Landing exactly on st.start / st.end sits on the pin boundary, where the
    // trigger's onLeave/onLeaveBack fire and clear the focus — that's the
    // "scroll to project 1 → it snaps to zero and focus turns off" bug. The inset
    // keeps the rested card safely inside its focused range.
    const EDGE = 12;
    const trySnap = () => {
      if (snapping || reduce) return;
      const y = lenis.scroll;
      for (const { id, points } of snapCfg) {
        const st = ScrollTrigger.getById(id);
        if (!st || st.end <= st.start) continue;
        if (y < st.start - 1 || y > st.end + 1) continue;
        const p = (y - st.start) / (st.end - st.start);
        const np = points.reduce((a, b) => (Math.abs(b - p) < Math.abs(a - p) ? b : a));
        let target = st.start + np * (st.end - st.start);
        const edge = (st.end - st.start) > 4 * EDGE ? EDGE : 0;
        target = Math.min(st.end - edge, Math.max(st.start + edge, target));
        if (Math.abs(target - y) > 2) {
          snapping = true;
          lenis.scrollTo(target, {
            duration: 0.42, // snappier magnetic pull between projects
            easing: (t) => 1 - Math.pow(1 - t, 3),
            onComplete: () => { snapping = false; },
          });
          if (safety) clearTimeout(safety);
          safety = setTimeout(() => { snapping = false; }, 700);
        }
        return;
      }
    };
    const onScroll = () => {
      // Fade the hero scroll cue once the user moves off the very top.
      document.body.classList.toggle('is-scrolled', lenis.scroll > 24);
      if (snapping) return;
      if (snapT) clearTimeout(snapT);
      snapT = setTimeout(trySnap, 100);
    };
    lenis.on('scroll', onScroll);

    let rt = null;
    let lastW = window.innerWidth;
    const onResize = () => {
      // On phones, showing/hiding the browser URL bar fires `resize` with only a
      // HEIGHT change. Refreshing ScrollTrigger on each one yanks the pinned hero
      // mid-scroll (the "laggy" feel). Only refresh when the WIDTH actually changes
      // (covers genuine resizes and portrait<->landscape, since those swap w/h).
      if (window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      if (rt) clearTimeout(rt);
      rt = setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    window.addEventListener('resize', onResize);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (snapT) clearTimeout(snapT);
      if (safety) clearTimeout(safety);
      if (rt) clearTimeout(rt);
      gsap.ticker.remove(raf);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  // Preload project images for smooth hover transitions
  useEffect(() => {
    const preloadImages = () => {
      const images = [
        COGNIXA_NON_HOVERED,
        COGNIXA_HOVERED,
        SETTLIN_NON_HOVERED,
        SETTLIN_HOVERED,
        PRAVAH_NON_HOVERED,
        PRAVAH_HOVERED
      ];
      images.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };
    preloadImages();
  }, []);

  // Handle all overlays: body scroll lock and Escape key
  const anyOverlayOpen = showPrismOverlay || showCognixaOverlay || showSettlinOverlay || 
                         showDataVizOverlay || showMobileAppOverlay || showAIChatOverlay || showPravahOverlay;
  
  // Apply dark mode to entire page when at bottom of page (but not when scrolling up)
  useEffect(() => {
    // Initialize scroll position tracking
    if (lastSignificantScrollYRef.current === 0) {
      lastSignificantScrollYRef.current = window.scrollY || 0;
    }
    
    const scrollThreshold = 10; // Only consider scroll significant if > 10px
    
    const checkDarkMode = () => {
      // Check if at bottom of page (contact section)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const atBottom = scrollTop + windowHeight >= documentHeight - 50; // 50px threshold
      
      // Calculate significant scroll change (ignore tiny movements)
      const scrollDelta = Math.abs(scrollTop - lastSignificantScrollYRef.current);
      const isSignificantUpwardScroll = isScrollingUpwardRef.current && scrollDelta > scrollThreshold;
      
      // If scrolling up significantly, remove dark mode
      if (isSignificantUpwardScroll) {
        document.body.classList.remove('page-dark-mode');
        lastSignificantScrollYRef.current = scrollTop;
        return;
      }
      
      // Update last significant scroll position if movement was significant
      if (scrollDelta > scrollThreshold) {
        lastSignificantScrollYRef.current = scrollTop;
      }
      
      // Dark mode should be active if at bottom of page
      const shouldBeDark = atBottom;
      
      if (shouldBeDark) {
        document.body.classList.add('page-dark-mode');
      } else {
        document.body.classList.remove('page-dark-mode');
      }
    };
    
    checkDarkMode();
    
    // Also check on scroll to update immediately when scroll direction changes
    const handleScroll = () => {
      checkDarkMode();
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      // Only remove if not at bottom
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const atBottom = scrollTop + windowHeight >= documentHeight - 50;
      if (!atBottom) {
        document.body.classList.remove('page-dark-mode');
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    const lenis = window.__lenis;
    if (anyOverlayOpen) {
      // Clear hover states when overlay opens
      setHoveredProject(null);
      setHoveredMiniProject(null);
      setShowMiniAurora(false);

      // Remember exactly where the homepage was, then freeze the background so the
      // overlay's own scroll container takes over. Lenis is the scroll writer, so
      // read/stop it (not window.scrollY) to restore the precise spot on close.
      overlayScrollRef.current = lenis ? lenis.scroll : (window.scrollY || 0);
      if (lenis) lenis.stop();
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      // Handle Escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          closeAllOverlays();
        }
      };
      window.addEventListener('keydown', handleEscape);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleEscape);
        // Resume smooth scroll and snap the homepage back to the exact position the
        // user left from (refresh first so pinned offsets are current, then restore).
        ScrollTrigger.refresh();
        if (lenis) {
          lenis.start();
          lenis.scrollTo(overlayScrollRef.current, { immediate: true });
        } else {
          window.scrollTo(0, overlayScrollRef.current);
        }
      };
    }
  }, [anyOverlayOpen]);

  useEffect(() => {
    debugLog('PortfolioApp useEffect running - HOMEPAGE ONLY');
    const HERO_SCROLL_MULTIPLIER = 1.5; // Reduced for higher scroll sensitivity

    // Debug mode toggle with Cmd+D
    const handleKeyDown = (e) => {
      if (e.key === 'd' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDebugMode(prev => {
          globalDebugMode = !prev;
          debugLog('Debug mode:', globalDebugMode);
          return !prev;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Scroll direction tracking will be handled in the dark mode section below

    // Force reset scroll position to top immediately on page load/reload
    window.scrollTo(0, 0);
    if (document && document.documentElement) {
      try {
        document.documentElement.scrollTop = 0;
      } catch (e) {
        // Ignore if documentElement is null
      }
    }
    if (document && document.body) {
      try {
        document.body.scrollTop = 0;
      } catch (e) {
        // Ignore if body is null
      }
    }

    // Reset GSAP scroll position
    try {
      gsap.set(window, { scrollTo: 0 });
      if (document && document.documentElement) {
        try {
          gsap.set(document.documentElement, { scrollTop: 0 });
        } catch (e) {
          // Ignore GSAP errors
        }
      }
      if (document && document.body) {
        try {
          gsap.set(document.body, { scrollTop: 0 });
        } catch (e) {
          // Ignore GSAP errors
        }
      }
    } catch (e) {
      // Ignore GSAP errors
    }

    // Reset all GSAP timelines and states
    gsap.killTweensOf("*");
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Reset component states
    setActiveSection(null);
    setLoaderComplete(false);

    // Handle page reload/refresh
    const handleBeforeUnload = () => {
      // Reset scroll position before page unloads
      try {
        window.scrollTo(0, 0);
        if (document && document.documentElement) {
          try {
            document.documentElement.scrollTop = 0;
          } catch (e) {
            // Ignore if documentElement is null
          }
        }
        if (document && document.body) {
          try {
            document.body.scrollTop = 0;
          } catch (e) {
            // Ignore if body is null
          }
        }
      } catch (e) {
        // Ignore errors during unload
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

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
            debugLog('Loader animation complete, hiding loader');
            setLoaderComplete(true);
            if (loader) {
              loader.style.display = 'none';
              debugLog('Loader hidden');
            }
            video?.play().catch((e) => {
              debugLog('Video play error:', e);
            });

            // Re-enable scrolling after loader finishes
            document.body.style.overflow = 'auto';
            debugLog('Scrolling re-enabled');
          }
        }
      );
    } else {
      // Fallback: hide loader immediately if loadingBar is not found
      debugLog('LoadingBar not found, using fallback');
      setTimeout(() => {
        debugLog('Fallback: hiding loader');
        setLoaderComplete(true);
        if (loader) {
          loader.style.display = 'none';
          debugLog('Loader hidden via fallback');
        }
        video?.play().catch((e) => {
          debugLog('Video play error (fallback):', e);
        });
        document.body.style.overflow = 'auto';
        debugLog('Scrolling re-enabled (fallback)');
      }, 100);
    }

    // Emergency fallback: Force hide loader after 5 seconds regardless
    setTimeout(() => {
      debugLog('Emergency fallback: Force hiding loader');
      setLoaderComplete(true);
      if (loader) {
        loader.style.display = 'none';
        debugLog('Loader force-hidden');
      }
      document.body.style.overflow = 'auto';
    }, 5000);

    // Additional scroll reset after a short delay to ensure it takes effect
    setTimeout(() => {
      try {
        window.scrollTo(0, 0);
        if (document && document.documentElement) {
          try {
            document.documentElement.scrollTop = 0;
          } catch (e) {
            // Ignore if documentElement is null
          }
        }
        if (document && document.body) {
          try {
            document.body.scrollTop = 0;
          } catch (e) {
            // Ignore if body is null
          }
        }
      } catch (e) {
        // Ignore errors during scroll reset
      }
    }, 100);

    // Hero: the scrubbed full-screen-video -> framed-banner shrink that reveals
    // the intro and then wipes the video up. This now runs on EVERY device so the
    // feel is identical on mobile/tablet; in portrait the video is letterboxed on
    // black (CSS) so nothing is cropped. Rotating a phone still triggers native
    // OS-fullscreen + sound via the orientation listener above.
    {
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

    // Initial hidden state for individual hero lines
    if (line1Ref.current) gsap.set(line1Ref.current, { y: 50, opacity: 0 });
    if (nameRef.current) gsap.set(nameRef.current, { y: 50, opacity: 0 });
    if (line3Ref.current) gsap.set(line3Ref.current, { y: 50, opacity: 0 });

    // VerticalCutReveal components handle their own visibility via isAnimating state

    // Smooth, scrubbed timeline for the hero with optimized settings
    const heroTl = gsap.timeline({
      defaults: { ease: 'power1.out' },
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: `+=${200 * HERO_SCROLL_MULTIPLIER}vh`, // Reduced scroll distance for higher sensitivity
        pin: true,
        pinSpacing: true,
        scrub: 0.5, // Lower value = more responsive to scroll
        anticipatePin: 1,
        refreshPriority: 1, // Higher priority to work with ScrollSmoother
        invalidateOnRefresh: true,
        markers: debugMode ? {
          startColor: "red",
          endColor: "red",
          indent: 100,
          fontSize: "12px"
        } : false,
        onEnter: () => {
          debugLog('🎯 Hero section entered');
          // VerticalCutReveal components handle their own visibility
        },
        onLeave: () => {
          debugLog('👋 Hero section left');
        },
        onEnterBack: () => {
          debugLog('🔄 Hero section re-entered');
          // VerticalCutReveal components handle their own visibility
        },
        onLeaveBack: () => {
          debugLog('↩️ Hero section left back');
        }
      }
    });

    // From full screen video to banner with space for text - starts at 10% for faster response
    // Uniform shrinking - all properties use same ease for consistent animation
    heroTl.fromTo(videoContainerRef.current, {
      width: '100vw',
      top: '0px',
      left: '0px',
      height: '100vh',
      right: '0px',
      bottom: '0px'
    }, {
      width: 'calc(100vw - clamp(24px, 5vw, 64px))',
      top: 'clamp(12px, 2.5vw, 32px)',
      left: 'clamp(12px, 2.5vw, 32px)',
      right: 'clamp(12px, 2.5vw, 32px)',
      height: () => {
        const textEl = contentTextRef.current;
        const textHeight = textEl ? textEl.offsetHeight : 0;
        return `calc(100vh - clamp(24px, 5vw, 64px) - ${textHeight}px)`;
      },
      bottom: () => {
        const textEl = contentTextRef.current;
        const textHeight = textEl ? textEl.offsetHeight : 0;
        return textHeight + 'px';
      },
      marginBottom: 0,
      paddingBottom: 0,
      ease: 'power1.out', // Same ease for all properties ensures uniform shrinking
      duration: 0.5
    }, 0.1);

    // Reveal text after video begins shrinking - starts at 30%
    heroTl.fromTo(contentTextRef.current, {
      transform: 'translateY(100%)'
    }, {
      transform: 'translateY(0%)',
      duration: 0.2
    }, 0.3)
      .call(() => {
        debugLog('🎬 Text revealed');
      }, [], 0.35);

    // Staggered entrances for three lines (bottom-up)
    heroTl.fromTo(line1Ref.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.30);
    heroTl.fromTo(nameRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.20, ease: 'power2.out' }, 0.35);
    heroTl.fromTo(line3Ref.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.40);

    // Collapse video height from bottom to top - starts immediately after text is revealed (at 40%)
    // Using GSAP clip-path to mask the video (not scale) for clean bottom-to-top collapse
    // The content text stays in place and remains visible
    heroTl.fromTo(videoContainerRef.current, {
      clipPath: 'inset(0% 0% 0% 0%)' // Full visible - no clipping
    }, {
      clipPath: 'inset(0% 0% 100% 0%)', // Clip from bottom: top 0%, right 0%, bottom 100% (fully clipped), left 0%
      ease: 'power2.in',
      duration: 0.4
    }, 0.4);
    // Fade the container out over the SAME window the clip-wipe finishes in
    // (0.7→0.8), so the last clipped sliver of the (black, letterboxed) banner is
    // already invisible — no faint line left at the hero→about seam. autoAlpha
    // reverses cleanly when scrubbing back up.
    heroTl.to(videoContainerRef.current, { autoAlpha: 0, duration: 0.1, ease: 'power1.in' }, 0.7);
    }

    // About section parallax — a subtle, BOUNDED rise on desktop only.
    // The old version translated .about-inner by a FULL viewport height and, being
    // created once, left that transform applied when the viewport later crossed
    // below 900px (rotate / resize / DevTools) — shoving the content ~½vh down so
    // it overlapped the next section (the "layout breaks at 682x705" report).
    // Now the from-value is a function that returns 0 on touch/narrow, and is
    // re-applied on every refresh, so crossing the boundary self-clears the
    // transform. Bounded to ≤64px and resolved by the time the section reaches
    // centre, so it can never overlap a neighbour at any size.
    const aboutInner = document.querySelector('.about-inner');
    const aboutSection = document.querySelector('.about');
    if (aboutInner && aboutSection) {
      const aboutFromY = () => (isTouchOrNarrow() ? 0 : Math.min(window.innerHeight * 0.08, 64));
      gsap.fromTo(aboutInner,
        { y: aboutFromY },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'top center', // resolve to natural position before nearing the work section
            scrub: 0.6,
            invalidateOnRefresh: true,
            onRefresh: () => { gsap.set(aboutInner, { y: aboutFromY() }); },
          }
        }
      );
    }

    // Main projects section parallax
    ScrollTrigger.create({
      trigger: '.main-projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const mainProjectsEl = document.querySelector('.main-projects');
      }
    });

    // Unified magnetic snap configuration - consistent across all snap points
    // Starts immediately when scrolling stops, inertia ends at snap points
    const UNIFIED_SNAP_CONFIG = {
      duration: { min: 0.4, max: 0.8 }, // Smooth, consistent duration
      delay: 0, // No delay - starts immediately when scrolling stops
      ease: "power2.out", // Smooth, consistent easing
      directional: true, // Only assist in intended direction
      inertia: true, // Inertia ends at snap points
      snapSpacing: 0.15, // Consistent spacing for all snap points
      onSnap: () => {}
    };


    let debugLastScrollY = window.scrollY;
    let scrollTimeout = null;
    let isScrolling = false;

    // Track scroll position continuously
    const scrollPositionLogger = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - debugLastScrollY;
      const direction = scrollDelta > 0 ? 'DOWN' : scrollDelta < 0 ? 'UP' : 'STOPPED';

      if (Math.abs(scrollDelta) > 0.1) {
        isScrolling = true;
        clearTimeout(scrollTimeout);

        // Get main-projects section position
        const mainProjectsEl = document.querySelector('.main-projects');
        if (mainProjectsEl) {
          const rect = mainProjectsEl.getBoundingClientRect();
          const bottomFromTop = rect.bottom;
          const topFromTop = rect.top;

        }

        debugLastScrollY = currentScrollY;

        // Detect when scrolling stops
        scrollTimeout = setTimeout(() => {
          if (isScrolling) {
            isScrolling = false;
            const mainProjectsEl = document.querySelector('.main-projects');
            if (mainProjectsEl) {
              const rect = mainProjectsEl.getBoundingClientRect();
            }
          }
        }, 150);
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', scrollPositionLogger, { passive: true });

    // Track snap events
    const trackSnapEvents = () => {
      const mainProjectsEl = document.querySelector('.main-projects');
      if (mainProjectsEl) {
        const rect = mainProjectsEl.getBoundingClientRect();
      }
    };

    trackSnapEvents();


    // Removed vertical entry/exit snap triggers - only snap to centered projects within sections

    // Contact section parallax
    ScrollTrigger.create({
      trigger: '.contact',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2,
      onUpdate: (self) => {
        const progress = self.progress;
        const contactEl = document.querySelector('.contact');
      }
    });

    // Refresh ScrollTrigger to prevent jittery behavior
    ScrollTrigger.refresh();

    // About wordmark draw-in (PSYCHOLOGY / DESIGN / CODE). A scrubbed TIMELINE of
    // per-line drawSVG tweens — not a manual onUpdate gsap.set — so each line draws
    // with eased inertia instead of a 1:1 (choppy) map of scroll→progress.
    // Triggered off `.about-title` (the lines themselves), NOT `.about`: the section
    // has a tall top padding, so a `.about` trigger meant the whole draw played out
    // while the words were still in the BOTTOM HALF of the screen ("way too low on
    // web") and only finished at center. Anchoring to the title makes it viewport-
    // consistent — the words draw as they enter from the bottom and are fully drawn
    // by the time they reach the upper third. scrub 1.2 keeps the smoothing/lag.
    const drawEls = gsap.utils.toArray('.about .draw-me');
    if (drawEls.length) {
      const drawTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.about-title',
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
      drawEls.forEach((el, i) => {
        if (gsap.plugins.drawSVG) {
          drawTl.fromTo(el, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'power1.inOut', duration: 1 }, i * 0.22);
        } else {
          // No premium DrawSVGPlugin here — draw the stroke with the native dash
          // offset so the word genuinely "writes on" (smooth, eased) rather than
          // just fading in. getTotalLength gives the exact dash length per path.
          let len = 1000;
          try { len = el.getTotalLength() || 1000; } catch (e) { /* keep fallback */ }
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len, opacity: 1 });
          drawTl.fromTo(el, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 1 }, i * 0.22);
        }
      });
    }

    // Enhanced hover-to-scroll transition function for main projects
    const handleHoverToScrollTransition = (fromProjectIndex, toProjectIndex, cards, projectsSection, lightRaysWrapper, workSummary) => {
      if (isTransitioningRef.current) return; // Prevent multiple transitions
      isTransitioningRef.current = true;

      const trail = document.querySelector('.cursor-trail');
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      // Create timeline for smooth transition
      const transitionTl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
          isScrollingToDifferentProjectRef.current = false;
        }
      });

      // Step 1: Turn background black (dark mode) - instant
      transitionTl.to(projectsSection, {
        backgroundColor: '#111111',
        duration: 0.1,
        ease: 'power2.out'
      }, 0);

      // Step 2: Fade out current light (LightRays) and text
      if (lightRaysWrapper) {
        transitionTl.to(lightRaysWrapper, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }, 0);
      }

      if (workSummary) {
        transitionTl.to(workSummary, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }, 0);
      }

      // Step 3: Transform trail to square in center
      if (trail) {
        // Add square class first
        trail.classList.add('magnetic-square');
        trail.classList.remove('magnetic-rectangle');

        transitionTl.to(trail, {
          left: viewportCenterX + 'px',
          top: viewportCenterY + 'px',
          width: 220,
          height: 220,
          borderRadius: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0.1);
      }

      // Step 4: Slide contents inside trail (project cards)
      if (fromProjectIndex !== null && cards[fromProjectIndex]) {
        transitionTl.to(cards[fromProjectIndex], {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: 'power2.in'
        }, 0.1);
      }

      // Step 5: Fade in new light and text almost instantly (after fade out completes)
      if (toProjectIndex !== null && cards[toProjectIndex]) {
        transitionTl.to(cards[toProjectIndex], {
          opacity: 1,
          scale: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.3);
      }

      // Step 6: Fade in new light and text
      if (lightRaysWrapper) {
        transitionTl.to(lightRaysWrapper, {
          opacity: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.35);
      }

      if (workSummary) {
        transitionTl.to(workSummary, {
          opacity: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.35);
      }
    };

    // Enhanced hover-to-scroll transition function for mini projects
    const handleMiniHoverToScrollTransition = (fromProjectIndex, toProjectIndex, miniCards, miniProjectsSection, auroraWrapper, miniProjectsViewportContainer) => {
      if (isTransitioningRef.current) return; // Prevent multiple transitions
      isTransitioningRef.current = true;

      const trail = document.querySelector('.cursor-trail');
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;

      // Create timeline for smooth transition
      const transitionTl = gsap.timeline({
        onComplete: () => {
          isTransitioningRef.current = false;
          isScrollingToDifferentMiniProjectRef.current = false;
        }
      });

      // Step 1: Turn background black (dark mode) - instant
      transitionTl.to(miniProjectsViewportContainer, {
        backgroundColor: '#000000',
        duration: 0.1,
        ease: 'power2.out'
      }, 0);

      // Step 2: Fade out current light (Aurora) and text
      if (auroraWrapper) {
        transitionTl.to(auroraWrapper, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in'
        }, 0);
      }

      // Step 3: Transform trail to square in center
      if (trail) {
        // Add square class first
        trail.classList.add('magnetic-square');
        trail.classList.remove('magnetic-rectangle');

        transitionTl.to(trail, {
          left: viewportCenterX + 'px',
          top: viewportCenterY + 'px',
          width: 220,
          height: 220,
          borderRadius: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        }, 0.1);
      }

      // Step 4: Slide contents inside trail (mini project cards)
      if (fromProjectIndex !== null && miniCards[fromProjectIndex]) {
        transitionTl.to(miniCards[fromProjectIndex], {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: 'power2.in'
        }, 0.1);
      }

      // Step 5: Fade in new light and text almost instantly (after fade out completes)
      if (toProjectIndex !== null && miniCards[toProjectIndex]) {
        transitionTl.to(miniCards[toProjectIndex], {
          opacity: 1,
          scale: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.3);
      }

      // Step 6: Fade in new light (Aurora)
      if (auroraWrapper) {
        transitionTl.to(auroraWrapper, {
          opacity: 1,
          duration: 0.1,
          ease: 'power2.out'
        }, 0.35);
      }
    };

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
        const section = document.querySelector('.main-projects');
        const wrapper = document.querySelector('.projects-wrapper');
        const cards = Array.from(document.querySelectorAll('.project-card'));
        if (!section || !wrapper || cards.length < 3) return;

        // Idempotent: clear any prior triggers for this section.
        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars && (t.vars.id === 'projects-scroll' || t.vars.id === 'projects-entry' || t.vars.id === 'projects-exit')) t.kill();
        });

        let startX = measureRequiredX(0);
        let endX = measureRequiredX(cards.length - 1);

        gsap.set(cards, { clearProps: 'transform,scale,filter', opacity: 1 });
        gsap.set(wrapper, { x: startX });

        const ids = ['cognixa', 'settlin', 'project3'];
        let lastIdx = -1;
        const setActive = (idx) => {
          const clamped = Math.max(0, Math.min(cards.length - 1, idx));
          if (clamped === lastIdx) return;
          lastIdx = clamped;
          cards.forEach((c, i) => c.classList.toggle('centered', i === clamped));
          const id = ids[clamped];
          // Focus (dark mode + Outcomes/Learnings) is scroll-driven & default-on
          // ONLY on touch (no hover available, for accessibility). On web it's
          // hover-driven, so scrolling never forces "hover mode on by default" —
          // and changing the centered card while scrolling clears any hover focus
          // so it can't stick to a card you've scrolled past.
          if (isTouchOrNarrow()) {
            setHoveredProject((prev) => (prev === id ? prev : id));
          } else {
            setHoveredProject(null);
          }
        };
        const clearActive = () => {
          lastIdx = -1;
          cards.forEach((c) => c.classList.remove('centered'));
          setHoveredProject(null);
          setIsMainProjectsInView(false);
        };

        // ONE pinned, scrubbed trigger. Pin distance == horizontal travel, so the
        // cards advance at the same rate as vertical scroll (1:1). A single
        // gsap.set writes x per frame; the focused card is a class toggle (CSS
        // owns the visuals). No per-frame gsap.to tweens, no elementFromPoint.
        ScrollTrigger.create({
          id: 'projects-scroll',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1, Math.abs(measureRequiredX(0) - measureRequiredX(cards.length - 1)))}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: debugMode ? { startColor: 'green', endColor: 'green', indent: 50, fontSize: '10px' } : false,
          onEnter: () => setIsMainProjectsInView(true),
          onEnterBack: () => setIsMainProjectsInView(true),
          onLeave: clearActive,
          onLeaveBack: clearActive,
          onRefresh: () => {
            startX = measureRequiredX(0);
            endX = measureRequiredX(cards.length - 1);
            gsap.set(wrapper, { x: startX });
          },
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(wrapper, { x: startX + (endX - startX) * p });
            setActive(Math.round(p * (cards.length - 1)));
          },
        });
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

      // Ensure section has fixed dimensions before ScrollTrigger initializes
      // This prevents layout shifts during pinning
      const sectionHeight = miniProjectsSection.offsetHeight;
      if (sectionHeight > 0) {
        miniProjectsSection.style.height = `${sectionHeight}px`;
        miniProjectsSection.style.minHeight = `${sectionHeight}px`;
        miniProjectsSection.style.maxHeight = `${sectionHeight}px`;
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
        const section = document.querySelector('.mini-projects');
        const wrapper = document.querySelector('.mini-projects-wrapper');
        const cards = Array.from(document.querySelectorAll('.mini-project-card'));
        if (!section || !wrapper || cards.length < 4) return;

        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars && (t.vars.id === 'mini-projects-scroll' || t.vars.id === 'mini-projects-entry' || t.vars.id === 'mini-projects-exit')) t.kill();
        });

        let startX = measureRequiredX(0);
        let endX = measureRequiredX(cards.length - 1);

        gsap.set(cards, { clearProps: 'transform,scale,filter', opacity: 1 });
        gsap.set(wrapper, { x: startX });

        const ids = ['prism', 'jarvis', 'bloom-bakehouse', 'conscious-living'];
        let lastIdx = -1;
        const setActive = (idx) => {
          const clamped = Math.max(0, Math.min(cards.length - 1, idx));
          if (clamped === lastIdx) return;
          lastIdx = clamped;
          cards.forEach((c, i) => c.classList.toggle('centered', i === clamped));
          const id = ids[clamped];
          // Same rule as main projects (see there): touch = scroll-driven focus,
          // web = hover-driven (clear on scroll so Aurora/dark never sticks).
          if (isTouchOrNarrow()) {
            setHoveredMiniProject((prev) => (prev === id ? prev : id));
            setShowMiniAurora(true);
          } else {
            setHoveredMiniProject(null);
            setShowMiniAurora(false);
          }
        };
        const clearActive = () => {
          lastIdx = -1;
          cards.forEach((c) => c.classList.remove('centered'));
          setHoveredMiniProject(null);
          setShowMiniAurora(false);
          setIsMiniProjectsInView(false);
        };

        // ONE pinned, scrubbed trigger (see the main projects section for the
        // same clean pattern): single gsap.set per frame, class-toggle focus.
        ScrollTrigger.create({
          id: 'mini-projects-scroll',
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1, Math.abs(measureRequiredX(0) - measureRequiredX(cards.length - 1)))}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: debugMode ? { startColor: 'purple', endColor: 'purple', indent: 50, fontSize: '10px' } : false,
          onEnter: () => setIsMiniProjectsInView(true),
          onEnterBack: () => setIsMiniProjectsInView(true),
          onLeave: clearActive,
          onLeaveBack: clearActive,
          onRefresh: () => {
            startX = measureRequiredX(0);
            endX = measureRequiredX(cards.length - 1);
            gsap.set(wrapper, { x: startX });
          },
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(wrapper, { x: startX + (endX - startX) * p });
            setActive(Math.round(p * (cards.length - 1)));
          },
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

    // Marquee animation setup - seamless infinite scroll with scroll-based speed
    const setupMarqueeAnimation = () => {
      const marqueeContent = document.querySelector('.marquee-content');
      if (!marqueeContent) return;

      const marqueeTexts = marqueeContent.querySelectorAll('.marquee-text');
      if (marqueeTexts.length === 0) return;

      // Kill any existing animation to prevent glitches
      gsap.killTweensOf(marqueeContent);

      // Reset position to prevent glitches on reload
      gsap.set(marqueeContent, { x: 0 });

      // Get the width of one text element (they're duplicates)
      const singleTextWidth = marqueeTexts[0].offsetWidth;

      // Calculate total width including gap
      const gap = 64; // 4rem gap
      const totalWidth = singleTextWidth + gap;

      // Ensure we have enough text elements for seamless loop
      if (marqueeTexts.length < 4) {
        debugWarn('Not enough marquee text elements for seamless loop');
        return;
      }

      // Base animation with seamless loop - slow and steady
      const marqueeTween = gsap.to(marqueeContent, {
        x: -totalWidth,
        duration: 40, // Slow, steady speed
        ease: 'none',
        repeat: -1,
        immediateRender: false, // Prevent glitches on reload
        modifiers: {
          x: function (x) {
            return (parseFloat(x) % totalWidth) + 'px';
          }
        }
      });

      // Keep marquee at slow, steady speed - no scroll-based speed changes
    };

    // One-time entrance animation for mini-projects header second line
    const secondLine = document.querySelector('.mini-projects-title-second-line');
    if (secondLine) {
      // Reset to base position
      gsap.set(secondLine, { x: 0 });
      ScrollTrigger.create({
        trigger: '.mini-projects-header',
        start: 'top 50%', // when header top hits mid viewport
        once: true,
        onEnter: () => {
          gsap.to(secondLine, {
            x: 200, // slide right by 200px (2x distance)
            duration: 0.8, // faster
            ease: 'power2.out' // smooth acceleration with soft ease-out
          });
        }
      });
    }

    // Robust dark mode transition with different behaviors for scroll directions
    // Scroll direction detection for marquee animation (not for dark mode anymore)
    let lastScrollY = window.scrollY;
    let scrollDirection = 'down';

    // Set initial light mode state
    gsap.set('body', { backgroundColor: '#f5f5f0' });
    gsap.set('.marquee-contact-section', { backgroundColor: '#f5f5f0', color: '#111111' });
    gsap.set('.marquee-text', { color: '#111111' });
    gsap.set('.contact-options-kicker, .contact-options-kicker-text', { color: '#111111' });
    // Only target SVG paths in the about section, not contact section
    gsap.set('.about .about-title-line .morphing-icon svg path', { stroke: '#111111' });
    gsap.set('.about .about-title-line .morphing-icon.icon-fill svg path', { fill: '#111111' });
    gsap.set('.about-title-line .arrow svg', { filter: 'none' });
    gsap.set('.marquee-contact-section .category-svg img', { filter: 'none' });

    // Dark mode is now handled by the site-wide dark mode system (body.page-dark-mode)
    // No separate contact section dark mode functions needed

    // Scroll direction detection
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Contact section dark mode is now handled by the site-wide dark mode system
    // No separate ScrollTriggers needed - the site-wide system handles everything

    // Setup marquee with delay to ensure DOM is ready
    setTimeout(setupMarqueeAnimation, 500);

    // Add hover listeners for contact options
    const setupContactOptionHoverListeners = () => {
      const contactOptions = document.querySelectorAll('.about-title-line[data-section="email"], .about-title-line[data-section="schedule"], .about-title-line[data-section="message"]');

      contactOptions.forEach((option) => {
        option.style.cursor = 'pointer';

        option.addEventListener('mouseenter', () => {
          debugLog('Contact option hovered:', option.dataset.section);
        });

        // Use capture phase to run before other handlers
        option.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation(); // Prevent other handlers from running

          const contactType = option.dataset.section;
          debugLog('Contact option clicked:', contactType);

          // mailto: / window.open(_blank) do NOT scroll the page, so there is
          // nothing to "lock" against. (This handler used to run setInterval
          // scroll-locks that froze the page for ~500ms after a click.)
          const calculateScrollDepth = () => {
            try {
              const scrollable = document.documentElement.scrollHeight - window.innerHeight;
              if (scrollable <= 0) return 0;
              return Math.min(100, Math.round((window.scrollY / scrollable) * 100));
            } catch (err) {
              return 0;
            }
          };

          if (window.mixpanel && typeof window.mixpanel.track === 'function') {
            try {
              const timeBeforeConversion = sessionStartTime.current ?
                Math.round((Date.now() - sessionStartTime.current) / 1000) : 0;
              window.mixpanel.track('Conversion', {
                'Conversion Type': `Contact - ${contactType}`,
                contact_method: contactType,
                page_url: window.location.href,
                time_on_page_before_conversion: timeBeforeConversion,
                scroll_depth_at_conversion: calculateScrollDepth(),
                max_scroll_depth: maxScrollDepth.current || 0,
                total_projects_viewed: projectsViewed.current ? projectsViewed.current.size : 0,
                projects_viewed_list: projectsViewed.current ? Array.from(projectsViewed.current) : [],
                session_duration: timeBeforeConversion,
              });
            } catch (err) {
              // Never block navigation on analytics.
            }
          }

          try {
            if (contactType === 'email') {
              window.location.href = 'mailto:connect@pratiksinghal.in';
            } else if (contactType === 'schedule') {
              window.open('https://calendar.app.google/EzFhyN3hioUtucrZ9', '_blank', 'noopener,noreferrer');
            } else if (contactType === 'message') {
              window.open('https://wa.me/message/PGKCRHXIUMD5B1', '_blank', 'noopener,noreferrer');
            }
          } catch (err) {
            // Failed to open contact link
          }
        }, true); // Use capture phase to run before other handlers
      });
    };

    setTimeout(setupContactOptionHoverListeners, 500);

    // Cleanup function - runs when component unmounts
    // CRITICAL: This must run synchronously before React starts unmounting
    return () => {
      // Kill ALL ScrollTriggers IMMEDIATELY - this unpins elements and restores DOM
      // This must happen FIRST before React tries to unmount
      try {
        // Get all triggers first
        const allTriggers = ScrollTrigger.getAll();

        // Kill each trigger synchronously - this unpins elements
        allTriggers.forEach(t => {
          try {
            t.kill();
          } catch (e) {
            // Ignore individual errors
          }
        });

        // Refresh ScrollTrigger to ensure all pins are cleared
        ScrollTrigger.refresh();

        // Kill all tweens
        gsap.killTweensOf("*");

        // Force DOM restoration by removing pin spacers
        // Do this AFTER killing triggers so DOM is restored
        requestAnimationFrame(() => {
          try {
            const pinnedElements = document.querySelectorAll('[data-pin-spacer]');
            pinnedElements.forEach(el => {
              try {
                if (el && el.isConnected) {
                  el.remove();
                }
              } catch (e) {
                // Element may have already been removed
              }
            });
          } catch (e) {
            // Ignore
          }
        });
      } catch (e) {
        // Silently ignore - component is unmounting
      }

      // Remove keyboard listener
      window.removeEventListener('keydown', handleKeyDown);

      // Remove scroll direction tracking
      if (handleScroll) {
        window.removeEventListener('scroll', handleScroll);
      }

      // Reset scroll position with null checks
      try {
        window.scrollTo(0, 0);
        if (document && document.documentElement) {
          try {
            document.documentElement.scrollTop = 0;
          } catch (e) {
            // Ignore if documentElement is null
          }
        }
        if (document && document.body) {
          try {
            document.body.scrollTop = 0;
          } catch (e) {
            // Ignore if body is null
          }
        }
        try {
          gsap.set(window, { scrollTo: 0 });
          if (document && document.documentElement) {
            try {
              gsap.set(document.documentElement, { scrollTop: 0 });
            } catch (e) {
              // Ignore GSAP errors
            }
          }
          if (document && document.body) {
            try {
              gsap.set(document.body, { scrollTop: 0 });
            } catch (e) {
              // Ignore GSAP errors
            }
          }
        } catch (e) {
          // Ignore GSAP errors during cleanup
        }
      } catch (e) {
        // Ignore all errors during cleanup
      }

      // Reset all component states
      setActiveSection(null);
      setLoaderComplete(false);

      // Remove event listeners
      if (handleBeforeUnload) {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      }

      // Re-enable scrolling on cleanup
      if (document.body) {
        document.body.style.overflow = '';
      }
    };
  }, []);

  // Debug mode toggle - add/remove class from body and create/remove debug lines
  useEffect(() => {
    if (debugMode) {
      document.body.classList.add('debug-mode');

      // Create horizontal debug lines
      const topLine = document.createElement('div');
      topLine.className = 'debug-line-top';
      topLine.style.cssText = 'position: fixed; left: clamp(12px, 2.5vw, 32px); right: clamp(12px, 2.5vw, 32px); top: 0; height: 1px; background-color: orange; z-index: 9999; pointer-events: none;';
      document.body.appendChild(topLine);

      const bottomLine = document.createElement('div');
      bottomLine.className = 'debug-line-bottom';
      bottomLine.style.cssText = 'position: fixed; left: clamp(12px, 2.5vw, 32px); right: clamp(12px, 2.5vw, 32px); bottom: 0; height: 1px; background-color: orange; z-index: 9999; pointer-events: none;';
      document.body.appendChild(bottomLine);
    } else {
      document.body.classList.remove('debug-mode');

      // Remove debug lines
      const topLine = document.querySelector('.debug-line-top');
      const bottomLine = document.querySelector('.debug-line-bottom');
      if (topLine && topLine.isConnected) {
        try {
          topLine.remove();
        } catch (e) {
          // Element may have already been removed
        }
      }
      if (bottomLine && bottomLine.isConnected) {
        try {
          bottomLine.remove();
        } catch (e) {
          // Element may have already been removed
        }
      }
    }
  }, [debugMode]);

  // Horizontal scroll handler - converts left/right scroll to up/down (or left/right in horizontal sections)
  useEffect(() => {
    const handleWheel = (e) => {
      // Only handle horizontal scrolling (deltaX)
      const horizontalDelta = e.deltaX;
      const verticalDelta = e.deltaY;
      
      // If there's significant horizontal scroll, convert it
      if (Math.abs(horizontalDelta) > Math.abs(verticalDelta) && Math.abs(horizontalDelta) > 5) {
        e.preventDefault();
        
        // Check if we're in a horizontal scrolling section
        const projectsSection = document.querySelector('.main-projects');
        const miniProjectsSection = document.querySelector('.mini-projects');
        const projectsScrollTrigger = ScrollTrigger.getById('projects-scroll');
        const miniProjectsScrollTrigger = ScrollTrigger.getById('mini-projects-scroll');
        
        const isInProjectsSection = projectsSection && 
          projectsScrollTrigger && 
          projectsScrollTrigger.isActive;
        const isInMiniProjectsSection = miniProjectsSection && 
          miniProjectsScrollTrigger && 
          miniProjectsScrollTrigger.isActive;
        
        if (isInProjectsSection || isInMiniProjectsSection) {
          // We're in a horizontal scrolling section
          // Left scroll (negative deltaX) = scroll left (move backward in progress = scroll up)
          // Right scroll (positive deltaX) = scroll right (move forward in progress = scroll down)
          // Progress increases when scrolling down, so:
          // - Left scroll (negative deltaX) → scroll up (negative top) → decrease progress → move left
          // - Right scroll (positive deltaX) → scroll down (positive top) → increase progress → move right
          const scrollAmount = horizontalDelta * 0.8; // Don't invert - direct mapping
          
          // Simulate vertical scroll which will naturally drive the ScrollTrigger
          window.scrollBy({
            top: scrollAmount,
            behavior: 'auto'
          });
        } else {
          // We're in a vertical scrolling section
          // Left scroll (negative deltaX) = scroll up (negative top)
          // Right scroll (positive deltaX) = scroll down (positive top)
          const scrollAmount = horizontalDelta * 0.8; // Direct mapping
          
          window.scrollBy({
            top: scrollAmount,
            behavior: 'auto'
          });
        }
      }
    };
    
    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Custom cursor with magnetic trail - ONLY for homepage
  useEffect(() => {
    // Touch devices have no pointer to follow: don't create the floating dot/ring/
    // label at all. This is what eliminates the "square stays stuck after I tap
    // out" bug — there is simply no trail on touch. CSS (body.touch-device) shows
    // tap affordances on the elements instead.
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      document.body.classList.add('touch-device');
      return () => document.body.classList.remove('touch-device');
    }
    let mouseX = window.innerWidth / 2;
    let mouseY = -50; // Position cursor at top center but out of sight
    let trailX = window.innerWidth / 2;
    let trailY = -50; // Position trail at top center but out of sight
    let isHoveringProject = false;
    let hoveredElement = null;

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

    // Floating cursor label for about title lines
    const label = document.createElement('div');
    label.className = 'cursor-label';
    label.textContent = '';
    document.body.appendChild(label);

    // Fully detach the floating square/label from any element and revert to the
    // plain dot-trail. Centralised so the rAF proximity check AND the mouseleave
    // handlers clear the exact same state — this is what stops the square getting
    // "stuck" when scroll focus (dark-mode) is on but the pointer has moved away.
    const releaseTrail = () => {
      isHoveringProject = false;
      hoveredElement = null;
      if (trail && trail.isConnected) {
        trail.classList.remove(
          'magnetic-rectangle', 'magnetic-square', 'about-rect',
          'magnetic-audio-button', 'magnetic-audio-button-rect'
        );
        trail.style.width = '';
        trail.style.height = '';
      }
      if (label && label.isConnected) {
        label.classList.remove('visible');
        label.textContent = '';
      }
      window.__hoveredAboutSection = null;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Store mouse position globally for hover checks
      window.mouseX = mouseX;
      window.mouseY = mouseY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
      // Follow label near the cursor
      label.style.left = mouseX + 'px';
      label.style.top = mouseY + 'px';
    };

    let animationFrameId = null;
    const animateTrail = () => {
      // Check if elements are still in DOM before manipulating
      if (!trail || !trail.isConnected) return;

      if (isHoveringProject && hoveredElement && hoveredElement.isConnected) {
        const rect = hoveredElement.getBoundingClientRect();
        // Magnetic capture: the square only wraps the element while the pointer is
        // genuinely within a margin of it. If the pointer moved away — or the page
        // scrolled a scroll-focused (dark-mode) card out from under it — release,
        // so the square is driven by the POINTER, never by scroll focus. This is
        // the fix for "the square is there even when my pointer isn't on it".
        const margin = 70;
        const within = rect.width > 0 && rect.height > 0 &&
          mouseX >= rect.left - margin && mouseX <= rect.right + margin &&
          mouseY >= rect.top - margin && mouseY <= rect.bottom + margin;

        if (within) {
          // Use custom center if set (contact options with icon + arrow), else rect center
          let centerX, centerY;
          if (hoveredElement._trailCenterX !== undefined && hoveredElement._trailCenterX !== null) {
            centerX = hoveredElement._trailCenterX;
            centerY = rect.top + rect.height / 2;
          } else {
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
          }
          // Magnetic pull toward the element center
          trailX += (centerX - trailX) * 0.25;
          trailY += (centerY - trailY) * 0.25;

          const distance = Math.sqrt((centerX - trailX) ** 2 + (centerY - trailY) ** 2);
          if (distance < 5) {
            trailX = centerX;
            trailY = centerY;
          }
        } else {
          // Pointer left the magnetic field → detach and follow the cursor again.
          releaseTrail();
          trailX += (mouseX - trailX) * 0.2;
          trailY += (mouseY - trailY) * 0.2;
        }
      } else {
        // Normal following behavior with smoother easing
        trailX += (mouseX - trailX) * 0.2;
        trailY += (mouseY - trailY) * 0.2;
      }

      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';
      animationFrameId = requestAnimationFrame(animateTrail);
    };

    // Store event listener references for cleanup
    const projectListeners = [];

    // Add hover listeners for major projects (rectangular)
    const setupProjectHoverListeners = () => {
      const majorProjects = document.querySelectorAll('.project-card');
      const miniProjects = document.querySelectorAll('.mini-project-card');

      debugLog('Setting up magnetic cursor for:', majorProjects.length, 'major projects and', miniProjects.length, 'mini projects');

      // Major projects - rectangular magnetic effect
      majorProjects.forEach((project, index) => {
        if (!project.isConnected) return; // Skip if element is not in DOM

        const mouseenterHandler = (e) => {
          if (!project.isConnected) return; // Guard against removed elements
          debugLog('Major project hovered:', index);
          isHoveringProject = true;
          hoveredElement = project;
          if (trail && trail.isConnected) {
            trail.classList.add('magnetic-rectangle');
            trail.classList.remove('magnetic-square');
          }
          // Show cursor label following the cursor
          if (label && label.isConnected) {
            label.textContent = 'Click to learn how I did this';
            label.classList.add('visible');
          }
        };

        const mouseleaveHandler = (e) => {
          if (!project.isConnected) return; // Guard against removed elements
          debugLog('Major project left:', index);
          // Only clear if this card is still the captured element. Moving directly
          // to an adjacent card fires that card's mouseenter first (setting
          // hoveredElement to it), so this guard avoids clobbering it. The rAF
          // proximity check is the backstop for any missed leave during scroll.
          if (hoveredElement === project) releaseTrail();
        };

        project.addEventListener('mouseenter', mouseenterHandler);
        project.addEventListener('mouseleave', mouseleaveHandler);
        projectListeners.push({ element: project, type: 'mouseenter', handler: mouseenterHandler });
        projectListeners.push({ element: project, type: 'mouseleave', handler: mouseleaveHandler });
      });

      // Mini projects - square magnetic effect
      miniProjects.forEach((project, index) => {
        if (!project.isConnected) return; // Skip if element is not in DOM

        const mouseenterHandler = (e) => {
          if (!project.isConnected) return; // Guard against removed elements
          debugLog('Mini project hovered:', index);
          isHoveringProject = true;
          hoveredElement = project;
          if (trail && trail.isConnected) {
            trail.classList.add('magnetic-square');
            trail.classList.remove('magnetic-rectangle');
          }
        };

        const mouseleaveHandler = (e) => {
          if (!project.isConnected) return; // Guard against removed elements
          debugLog('Mini project left:', index);
          // Same guarded release as major projects — magnetic, pointer-driven.
          if (hoveredElement === project) releaseTrail();
        };

        project.addEventListener('mouseenter', mouseenterHandler);
        project.addEventListener('mouseleave', mouseleaveHandler);
        projectListeners.push({ element: project, type: 'mouseenter', handler: mouseenterHandler });
        projectListeners.push({ element: project, type: 'mouseleave', handler: mouseleaveHandler });
      });

      // Audio control button - dynamic magnetic effect based on shape
      const audioButton = document.querySelector('.audio-control-button');
      if (audioButton && audioButton.isConnected) {
        const mouseenterHandler = (e) => {
          if (!audioButton.isConnected) return;
          debugLog('Audio button hovered');
          isHoveringProject = true;
          hoveredElement = audioButton;

          if (trail && trail.isConnected) {
            // Check aspect ratio to decide shape
            const rect = audioButton.getBoundingClientRect();
            const isRectangle = rect.width > rect.height * 1.2; // Threshold for rectangle

            trail.classList.remove('magnetic-rectangle');
            trail.classList.remove('magnetic-square');

            if (isRectangle) {
              trail.classList.add('magnetic-audio-button-rect');
              trail.classList.remove('magnetic-audio-button');
            } else {
              trail.classList.add('magnetic-audio-button');
              trail.classList.remove('magnetic-audio-button-rect');
            }
          }
        };

        const mouseleaveHandler = (e) => {
          if (!audioButton.isConnected) return;
          debugLog('Audio button left');
          if (hoveredElement === audioButton) releaseTrail();
        };

        audioButton.addEventListener('mouseenter', mouseenterHandler);
        audioButton.addEventListener('mouseleave', mouseleaveHandler);
        projectListeners.push({ element: audioButton, type: 'mouseenter', handler: mouseenterHandler });
        projectListeners.push({ element: audioButton, type: 'mouseleave', handler: mouseleaveHandler });
      }
    };

    // Store about hover listener references for cleanup
    const aboutListeners = [];

    // Hover listeners for about title lines with rectangular border and label
    const setupAboutHoverListeners = () => {
      const aboutRows = document.querySelectorAll('.about-title-line');
      aboutRows.forEach((row) => {
        if (!row.isConnected) return; // Skip if element is not in DOM

        const sectionName = row.dataset.section;

        const mouseenterHandler = () => {
          if (!row.isConnected) return; // Guard against removed elements
          // Guard: if another section is expanded, ignore hover
          if (activeSectionRef.current && activeSectionRef.current !== sectionName) return;
          // Magnetic effect to center near the row area
          isHoveringProject = true;
          // Use the entire row (including category SVG and arrow widget) for hover trail
          hoveredElement = row;
          if (trail && trail.isConnected) {
            trail.classList.add('about-rect');
            // Match trail size to the entire row bounds (text + arrow) with slight padding
            const rowRect = row.getBoundingClientRect();
            const icon = row.querySelector('.category-svg');
            const arrow = row.querySelector('.arrow-close-widget');

            let width = rowRect.width;
            let left = rowRect.left;

            // For contact options with images, get actual image width since images are absolutely positioned
            if (icon && arrow) {
              const iconImg = icon.querySelector('img');
              const arrowRect = arrow.getBoundingClientRect();

              if (iconImg) {
                // Get the actual rendered width of the image
                const iconImgRect = iconImg.getBoundingClientRect();
                const iconRect = icon.getBoundingClientRect();
                // Calculate from leftmost point of icon image to rightmost point of arrow
                const combinedLeft = Math.min(iconImgRect.left, iconRect.left);
                const combinedRight = Math.max(arrowRect.right, iconImgRect.right);
                width = combinedRight - combinedLeft;
                left = combinedLeft;
              } else {
                // Fallback: use icon and arrow rects
                const iconRect = icon.getBoundingClientRect();
                const combinedLeft = Math.min(iconRect.left, arrowRect.left);
                const combinedRight = Math.max(iconRect.right, arrowRect.right);
                width = combinedRight - combinedLeft;
                left = combinedLeft;
              }

              // Store for animation
              row._trailCenterX = left + width / 2;
              row._trailLeft = left;
            } else {
              row._trailCenterX = null;
              row._trailLeft = null;
            }

            const paddingPx = 5; // 5px padding from content to border (3px + 2px more)
            trail.style.width = width + paddingPx * 2 + 'px';
            trail.style.height = rowRect.height + paddingPx * 2 + 'px';
          }

          // Dynamic label text based on active state
          const isActive = activeSectionRef.current === sectionName;
          if (label && label.isConnected) {
            label.textContent = isActive ? 'Click to close' : 'Click to open';
            label.classList.add('visible');
          }
          window.__hoveredAboutSection = sectionName;
        };

        const mouseleaveHandler = () => {
          if (!row.isConnected) return; // Guard against removed elements
          if (hoveredElement !== row) return; // moved straight to another row
          // Clear row-specific custom center, then fully detach the trail/label.
          if (row._trailCenterX !== undefined) row._trailCenterX = null;
          if (row._trailLeft !== undefined) row._trailLeft = null;
          releaseTrail();
        };

        row.addEventListener('mouseenter', mouseenterHandler);
        row.addEventListener('mouseleave', mouseleaveHandler);
        aboutListeners.push({ element: row, type: 'mouseenter', handler: mouseenterHandler });
        aboutListeners.push({ element: row, type: 'mouseleave', handler: mouseleaveHandler });
      });
    };

    // Setup hover listeners with retry mechanism to ensure DOM is ready
    const setupWithRetry = () => {
      const majorProjects = document.querySelectorAll('.project-card');
      const miniProjects = document.querySelectorAll('.mini-project-card');

      if (majorProjects.length === 0 && miniProjects.length === 0) {
        debugLog('Projects not ready, retrying in 200ms...');
        setTimeout(setupWithRetry, 200);
        return;
      }

      setupProjectHoverListeners();
    };

    setTimeout(setupWithRetry, 500);
    setTimeout(setupAboutHoverListeners, 600);

    animateTrail();
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);

      // Stop animation loop
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      // Remove all project event listeners
      projectListeners.forEach(({ element, type, handler }) => {
        if (element && element.isConnected) {
          try {
            element.removeEventListener(type, handler);
          } catch (e) {
            // Element may have already been removed by React
          }
        }
      });
      projectListeners.length = 0; // Clear the array

      // Remove all about event listeners
      aboutListeners.forEach(({ element, type, handler }) => {
        if (element && element.isConnected) {
          try {
            element.removeEventListener(type, handler);
          } catch (e) {
            // Element may have already been removed by React
          }
        }
      });
      aboutListeners.length = 0; // Clear the array

      // Use modern remove() method and check if element is still in DOM
      if (cursor && cursor.isConnected) {
        try {
          cursor.remove();
        } catch (e) {
          debugLog('Cursor cleanup error:', e);
        }
      }
      if (trail && trail.isConnected) {
        try {
          trail.remove();
        } catch (e) {
          debugLog('Trail cleanup error:', e);
        }
      }
      if (label && label.isConnected) {
        try {
          label.remove();
        } catch (e) {
          debugLog('Label cleanup error:', e);
        }
      }
    };
  }, []);

  // Subtle "magnetic" pull on interactive controls (web only — touch has no
  // hover). Each magnet eases a few px toward the cursor when it is near and
  // springs back on leave, so buttons/arrows feel alive without ever moving far
  // enough to disturb the layout (hard-capped at 9px).
  useEffect(() => {
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    const SELECTOR = '.audio-control-button, .project-overlay-close, .about-title-line .arrow-close-widget, .hero-rotate-cue';
    const RADIUS = 80;     // px halo around an element where the pull begins
    const STRENGTH = 0.3;  // fraction of the cursor offset applied
    const BOUND = 9;       // hard cap on how far an element shifts
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        document.querySelectorAll(SELECTOR).forEach((el) => {
          const r = el.getBoundingClientRect();
          if (!r.width) return;
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const near = Math.hypot(dx, dy) < RADIUS + Math.max(r.width, r.height) / 2;
          if (near) {
            gsap.to(el, { x: gsap.utils.clamp(-BOUND, BOUND, dx * STRENGTH), y: gsap.utils.clamp(-BOUND, BOUND, dy * STRENGTH), duration: 0.3, ease: 'power3.out', overwrite: 'auto' });
            el._mag = true;
          } else if (el._mag) {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
            el._mag = false;
          }
        });
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => { window.removeEventListener('pointermove', onMove); if (raf) cancelAnimationFrame(raf); };
  }, []);

  // Track section visits
  const sectionsVisited = useRef(new Set());
  
  // Update ref whenever state changes
  useEffect(() => {
    activeSectionRef.current = activeSection;
    // Update cursor label if hovering an about row
    const labelEl = document.querySelector('.cursor-label');
    const hovered = typeof window !== 'undefined' ? window.__hoveredAboutSection : null;
    if (labelEl && hovered) {
      labelEl.textContent = activeSection === hovered ? 'Click to close' : 'Click to open';
    }
    
    // Track section visits
    if (activeSection && !sectionsVisited.current.has(activeSection)) {
      sectionsVisited.current.add(activeSection);
      
      if (mixpanel && typeof mixpanel.track === 'function') {
        try {
          mixpanel.track('Section Visit', {
            section_name: activeSection,
            time_on_page: Math.round((Date.now() - sessionStartTime.current) / 1000),
            scroll_depth: getScrollDepth(),
            total_sections_visited: sectionsVisited.current.size,
          });
        } catch (e) {
          // Silently fail
        }
      }
    }
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
    // Only select about section rows, exclude contact section rows (email, schedule, message)
    const rows = document.querySelectorAll('.about-title-line:not([data-section="email"]):not([data-section="schedule"]):not([data-section="message"])');
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
      // Disable hover/click on non-active rows when any section is expanded
      if (activeSection) {
        row.style.pointerEvents = isActive ? 'auto' : 'none';
        row.style.cursor = isActive ? 'pointer' : 'default';
      } else {
        row.style.pointerEvents = 'auto';
        row.style.cursor = 'pointer';
      }

      // Get morphing elements
      // Arrows removed - skip morphing logic safely
      const morphPath = null;
      const morphFillPath = null;

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
      }, '<+0.1');
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
      // Phase 1: Shrink detail content naturally - match opening duration
      .to('.about-detail', {
        opacity: 0,
        height: 0,
        duration: 0.6, // Match opening duration
        ease: 'power2.inOut' // More balanced easing to match opening feel
      })
      // Phase 2: Restore rows and spacing - match opening timing
      .to(rows, {
        y: 0,
        opacity: 1,
        height: 'auto',
        duration: 0.5,
        ease: 'power2.inOut',
        stagger: 0.05 // Match opening stagger
      }, '<+0.1')
      .to('.about-title', {
        gap: 'clamp(8px, 1.8vw, 14px)',
        duration: 0.5,
        ease: 'power2.inOut'
      }, '<')
      // Phase 3: Show kicker - match opening duration
      .to('.about-kicker', {
        opacity: 1,
        y: 0,
        duration: 0.4, // Match opening duration
        ease: 'power2.inOut'
      }, '<+0.1');
  };

  const getSectionData = (section) => {
    const data = {
      psychology: {
        icon: <PsychologyIcon />,
        title: 'Psychology',
        body: `<p>My academic path started with a multidisciplinary <strong>BA in Journalism, Psychology, and Computer Science at Kristu Jayanti College</strong>, followed by an <strong>MSc in Clinical Psychology from Christ University. Psychology</strong>. This has shaped the way I understand human behavior, decision-making, and how people interact with products.</p><p>It forms the base of how I build things. I rely on research, observation, and behavioral frameworks to design solutions that solve genuine problems rather than surface-level ones. This approach lets me quantify user behavior and turn it into practical insights.</p><p>This shows up clearly in <u data-project="cognixa">Cognixa</u>, my client-management platform for psychologists. It began as a personal need and grew into a structured product shaped by behavioral analysis and user psychology. Psychology continues to guide my product thinking and gives my work a naturally human-centered edge.</p>`
      },
      design: {
        icon: <DesignIcon />,
        title: 'Design',
        body: `<p>My design journey started in <strong>2018</strong> with my first part-time job as a graphic designer. That year taught me how important design is for communicating ideas clearly and fast. I took on freelance projects across <strong>Illustrator, After Effects, and Figma</strong>, which helped me build a solid foundation.</p><p>Since then, I've created full design systems and brand identities for different clients. One example is <u data-project="bloom-bakehouse">Bloom Bakehouse</u>, where I worked on everything from the logo and packaging to brand guidelines that improved their presence. I also created the full visual identity for <u data-project="cognixa">Cognixa</u> encompassing range across digital and physical touchpoints.</p><p>Most recently, at <u data-project="settlin">Settlin</u>, a proptech company, I worked as a <strong>UI/UX Designer</strong> for nine months. I refined user flows, built scalable design systems, designed their pitch deck, and worked closely with engineers to make sure everything shipped properly. I also designed parts of their internal CMS and mobile app.</p><p>I combined design, code, and research in <u data-project="prism">Prism</u>, my color palette generator based on perceptual color science. It creates visually consistent palettes that make sense to both designers and developers.</p>`
      },
      code: {
        icon: <CodeIcon />,
        title: 'Code',
        body: `<p>My development journey began in <strong>2019</strong> with <u data-project="">UBU Community</u>, my first paid web project, which was a static site built with <strong>HTML, CSS, and native code</strong>. That project strengthened my basics in layouts, states, interactions, and animations.</p><p>At <u data-project="settlin">Settlin</u>, I reached a milestone that meant a lot to me: shipping production Flutter screens even though my role was primarily design-focused. This helped close the gap between design and engineering and delivered real business value when resources were tight.</p><p>I've also contributed <strong>React</strong> code at Settlin and built <u data-project="cognixa">Cognixa</u> entirely on a React architecture. While I don't consider myself a highly advanced engineer, I naturally think in systems. That helps reduce friction between design and development and speeds up how projects move.</p><p><u data-project="prism">Prism</u> is where my technical and design skills meet. It uses perceptual color science, has integrated analytics and behavior tracking, and exports palettes in formats that are actually useful in daily design work.</p><p>My engineering approach focuses on problem-solving instead of complexity. I care about clarity, user impact, and business outcomes, which helps me contribute meaningfully even outside traditional design boundaries.</p>`
      }
    };
    return data[section] || null;
  };

  const getProjectData = (projectId) => {
    const projects = {
      cognixa: {
        learnings: [
          ' • That UX is the foundation of any product, not an afterthought',
          ' • How to translate user needs into product features',
          ' • How to ship fast without compromising ethics or privacy',
          ' • That AI should reduce friction, not control the workflow'
        ],
        outcomes: [
          ' • Solo product development from concept to launch',
          ' • Led UX-first development, building around user questions',
          ' • Created privacy-first workflows and clear value propositions',
          ' • Managed end-to-end product work: design, frontend, marketing'
        ],
        color: '#F4D7C4' // Red
      },
      settlin: {
        learnings: [
          ' • Reducing cognitive load boosts conversions instantly',
          ' • Design systems save more time than any single feature',
          ' • Behavioral data beats design intuition',
          ' • Knowing the tech stack makes product planning real'
        ],
        outcomes: [
          ' • Redesigned the Preferences Flow using cognitive load theory',
          ' • Built a full atomic design system (247 components)',
          ' • Set up Mixpanel and shifted decisions to data',
          ' • Contributed in Flutter + React to unblock engineering'
        ],
        color: '#C73C3B' // Green
      },
      project3: {
        learnings: [
          ' • Simplicity requires complex backend logic hidden from users',
          ' • Food waste is a systems issue, not a shopping issue',
          ' • Consistent visual states build trust fast',
          ' • Strong products are loops, not feature lists'
        ],
        outcomes: [
          ' • Researched food-waste habits and built a planning system',
          ' • Designed meal plans based on pantry state, expiry, and goals',
          ' • Built a consistent color-state interface',
          ' • Created a closed feedback loop across meals, inventory, and logs'
        ],
        color: '#C6D4E6' // Blue
      }
    };
    return projects[projectId];
  };

  const getProjectColor = (projectId) => {
    const project = getProjectData(projectId);
    return project ? project.color : '#ffffff';
  };

  const getMiniProjectData = (projectId) => {
    const projects = {
      'prism': {
        color: '#E6E6E6' // Purple
      },
      'jarvis': {
        color: '#76E2E4' // Orange
      },
      'bloom-bakehouse': {
        color: '#EBDCC9' // Teal
      },
      'conscious-living': {
        color: '#013301' // Yellow
      }
    };
    return projects[projectId];
  };

  const getMiniProjectColor = (projectId) => {
    const project = getMiniProjectData(projectId);
    return project ? project.color : '#ffffff';
  };

  const [isMainProjectsInView, setIsMainProjectsInView] = useState(false);
  const [isMiniProjectsInView, setIsMiniProjectsInView] = useState(false);

  // Check if main-projects section is in viewport and aligned at top
  const checkMainProjectsInView = () => {
    const mainProjectsSection = document.querySelector('.main-projects');
    if (!mainProjectsSection) {
      setIsMainProjectsInView(false);
      return false;
    }

    const rect = mainProjectsSection.getBoundingClientRect();
    // Check if section top is at viewport top (within 5px tolerance)
    const isInView = Math.abs(rect.top) < 5 && rect.bottom > window.innerHeight * 0.5;
    setIsMainProjectsInView(isInView);
    return isInView;
  };

  // Handle project hover with viewport check
  const handleProjectHover = (projectId) => {
    // Don't allow hover when any overlay is open
    if (anyOverlayOpen) {
      return;
    }
    
    // Check if third project is centered (at snap point)
    const thirdProjectCard = document.querySelector('.project-card.blue-project');
    const isThirdProjectCentered = thirdProjectCard && thirdProjectCard.classList.contains('centered');

    // Only start 1s timer if hovering over third project AND it's centered (not scrolling)
    if (projectId === 'project3' && isThirdProjectCentered) {
      // Clear any existing timer
      if (thirdProjectHoverTimerRef.current) {
        clearTimeout(thirdProjectHoverTimerRef.current);
      }
      // Set timer to enable snap after 1 second
      thirdProjectHoverTimerRef.current = setTimeout(() => {
        setThirdProjectHoveredFor1s(true);
        thirdProjectHoveredFor1sRef.current = true;
      }, 1000);
    } else {
      // Not third project or not centered, clear timer and reset state
      if (thirdProjectHoverTimerRef.current) {
        clearTimeout(thirdProjectHoverTimerRef.current);
        thirdProjectHoverTimerRef.current = null;
      }
      setThirdProjectHoveredFor1s(false);
      thirdProjectHoveredFor1sRef.current = false;
    }

    // Hover only sets focus state — it must NOT scroll the page (that was a
    // hijack: cards slid under the cursor and cascaded into more scrolls).
    // Scroll position is what drives which project is focused.
    checkMainProjectsInView();
    setHoveredProject(projectId);
    enforceProjectPointerEvents();
  };

  // Enforce pointer-events for projects based on centered state and opacity
  const enforceProjectPointerEvents = () => {
    const cards = Array.from(document.querySelectorAll('.project-card'));
    cards.forEach((card) => {
      // Check if scrolling - all projects are hoverable during scroll
      if (card.classList.contains('scrolling')) {
        card.style.pointerEvents = 'auto';
        return;
      }

      // Check if centered - centered projects are always hoverable
      if (card.classList.contains('centered')) {
        card.style.pointerEvents = 'auto';
        return;
      }

      // Check computed opacity - only full opacity (1) projects should be hoverable
      const computedStyle = window.getComputedStyle(card);
      const opacity = parseFloat(computedStyle.opacity);

      if (opacity >= 0.99) {
        // Full opacity - hoverable
        card.style.pointerEvents = 'auto';
      } else {
        // Less than full opacity - not hoverable
        card.style.pointerEvents = 'none';
      }
    });
  };

  // Check if mini-projects section is in viewport and aligned at top
  const checkMiniProjectsInView = () => {
    const miniProjectsSection = document.querySelector('.mini-projects');
    if (!miniProjectsSection) {
      setIsMiniProjectsInView(false);
      return false;
    }

    const rect = miniProjectsSection.getBoundingClientRect();
    // Check if section top is at viewport top (within 5px tolerance)
    const isInView = Math.abs(rect.top) < 5 && rect.bottom > window.innerHeight * 0.5;
    setIsMiniProjectsInView(isInView);
    return isInView;
  };

  // Handle mini project hover with viewport check
  const handleMiniProjectHover = (projectId) => {
    // Don't allow hover when any overlay is open
    if (anyOverlayOpen) {
      return;
    }
    
    // Check if last mini project is centered (at snap point)
    const lastMiniProjectCard = document.querySelector('.mini-project-card:last-child');
    const isLastMiniProjectCentered = lastMiniProjectCard && lastMiniProjectCard.classList.contains('centered');

    // Hover only sets focus state — never scrolls the page (that was a hijack).
    checkMiniProjectsInView();
    setHoveredMiniProject(projectId);
    enforceMiniProjectPointerEvents();
    setShowMiniAurora(true);
  };

  // Enforce pointer-events for mini projects based on centered state and opacity
  const enforceMiniProjectPointerEvents = () => {
    const miniCards = Array.from(document.querySelectorAll('.mini-project-card'));
    miniCards.forEach((card) => {
      // Check if scrolling - all mini projects are hoverable during scroll
      if (card.classList.contains('scrolling')) {
        card.style.pointerEvents = 'auto';
        return;
      }

      // Check if centered - centered mini projects are always hoverable
      if (card.classList.contains('centered')) {
        card.style.pointerEvents = 'auto';
        return;
      }

      // Check computed opacity - only full opacity (1) mini projects should be hoverable
      const computedStyle = window.getComputedStyle(card);
      const opacity = parseFloat(computedStyle.opacity);

      if (opacity >= 0.99) {
        // Full opacity - hoverable
        card.style.pointerEvents = 'auto';
      } else {
        // Less than full opacity - not hoverable
        card.style.pointerEvents = 'none';
      }
    });
  };

  // Monitor scroll to update viewport state and track vertical scroll direction
  useEffect(() => {
    const handleScroll = () => {
      // Track vertical scroll direction (upward/downward)
      const currentScrollY = window.scrollY;
      const isScrollingUpward = currentScrollY < lastVerticalScrollYRef.current;
      isScrollingUpwardRef.current = isScrollingUpward;
      lastVerticalScrollYRef.current = currentScrollY;

      // (Removed: the "magnetic" auto-scroll that yanked the page to the third
      // project on scroll-up-hover — it generated scroll the user never asked
      // for. Resting on a project is handled by the Lenis scroll-end snap.)

      const wasMainInView = isMainProjectsInView;
      const isMainNowInView = checkMainProjectsInView();

      // If main section was in view but is now out of view, clear hover state
      if (wasMainInView && !isMainNowInView && hoveredProject) {
        setHoveredProject(null);
        // Clear third project hover timer
        if (thirdProjectHoverTimerRef.current) {
          clearTimeout(thirdProjectHoverTimerRef.current);
          thirdProjectHoverTimerRef.current = null;
        }
        setThirdProjectHoveredFor1s(false);
        thirdProjectHoveredFor1sRef.current = false;
        enforceProjectPointerEvents();
      }

      const wasMiniInView = isMiniProjectsInView;
      const isMiniNowInView = checkMiniProjectsInView();

      // If mini section was in view but is now out of view, clear hover state
      if (wasMiniInView && !isMiniNowInView && hoveredMiniProject) {
        setHoveredMiniProject(null);
        setShowMiniAurora(false);
        enforceMiniProjectPointerEvents();
      }
    };

    // Initialize vertical scroll position
    lastVerticalScrollYRef.current = window.scrollY;

    window.addEventListener('scroll', handleScroll, { passive: true });
    checkMainProjectsInView(); // Initial check
    checkMiniProjectsInView(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMainProjectsInView, hoveredProject, isMiniProjectsInView, hoveredMiniProject]);

  // Monitor mouse position to clear hover mode when cursor is not over projects or center area
  useEffect(() => {
    let mouseMoveTimeout = null;

    const handleMouseMove = (e) => {
      // Clear any existing timeout
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }

      // Don't clear hover state if we're scrolling or transitioning
      if (isScrollingToDifferentProjectRef.current ||
        isScrollingToDifferentMiniProjectRef.current ||
        isTransitioningRef.current) {
        return;
      }

      // Check if cursor is over a project card
      const elementUnderMouse = document.elementFromPoint(e.clientX, e.clientY);
      const isOverProject = elementUnderMouse && (
        elementUnderMouse.closest('.project-card') ||
        elementUnderMouse.closest('.mini-project-card')
      );

      // Check if cursor is in center area (where projects snap to)
      // Center area is approximately viewport center ± 200px
      const viewportCenterX = window.innerWidth / 2;
      const viewportCenterY = window.innerHeight / 2;
      const centerAreaRadius = 200; // Radius of center area
      const distanceFromCenter = Math.sqrt(
        Math.pow(e.clientX - viewportCenterX, 2) +
        Math.pow(e.clientY - viewportCenterY, 2)
      );
      const isInCenterArea = distanceFromCenter <= centerAreaRadius;

      // Only clear hover state if cursor is not over project AND not in center area
      // Use a small delay to prevent flickering when moving between areas
      if (!isOverProject && !isInCenterArea) {
        mouseMoveTimeout = setTimeout(() => {
          // Double-check conditions after delay
          const currentElement = document.elementFromPoint(e.clientX, e.clientY);
          const stillOverProject = currentElement && (
            currentElement.closest('.project-card') ||
            currentElement.closest('.mini-project-card')
          );
          const stillInCenter = Math.sqrt(
            Math.pow(e.clientX - viewportCenterX, 2) +
            Math.pow(e.clientY - viewportCenterY, 2)
          ) <= centerAreaRadius;

          // Only clear if still not over project and not in center, and not scrolling
          if (!stillOverProject && !stillInCenter &&
            !isScrollingToDifferentProjectRef.current &&
            !isScrollingToDifferentMiniProjectRef.current &&
            !isTransitioningRef.current) {
            // Clear main projects hover state
            if (hoveredProject && !isMainProjectsInView) {
              setHoveredProject(null);
              // Clear third project hover timer
              if (thirdProjectHoverTimerRef.current) {
                clearTimeout(thirdProjectHoverTimerRef.current);
                thirdProjectHoverTimerRef.current = null;
              }
              setThirdProjectHoveredFor1s(false);
              thirdProjectHoveredFor1sRef.current = false;
            }

            // Clear mini projects hover state
            if (hoveredMiniProject && !isMiniProjectsInView) {
              setHoveredMiniProject(null);
              setShowMiniAurora(false);
            }
          }
        }, 100); // Small delay to prevent flickering
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
    };
  }, [hoveredProject, hoveredMiniProject]);

  // Update cursor shape when audio state changes (if hovering)
  useEffect(() => {
    const audioButton = document.querySelector('.audio-control-button');
    const trail = document.querySelector('.cursor-trail');

    if (audioButton && trail && audioButton.matches(':hover')) {
      // Force update cursor shape
      const rect = audioButton.getBoundingClientRect();
      const isRectangle = rect.width > rect.height * 1.2;

      trail.classList.remove('magnetic-rectangle');
      trail.classList.remove('magnetic-square');

      if (isRectangle) {
        trail.classList.add('magnetic-audio-button-rect');
        trail.classList.remove('magnetic-audio-button');
      } else {
        trail.classList.add('magnetic-audio-button');
        trail.classList.remove('magnetic-audio-button-rect');
      }
    }
  }, [isMuted]);

  // Handle clicks on underlined project links in About section
  useEffect(() => {
    const handleProjectLinkClick = (e) => {
      const target = e.target;
      if (target.tagName === 'U' && target.hasAttribute('data-project')) {
        const projectId = target.getAttribute('data-project');
        if (!projectId) return; // Skip if no project ID
        
        e.preventDefault();
        e.stopPropagation();
        
        // Open overlay with URL update
        if (projectId && projectSlugMap[projectId]) {
          openOverlay(projectId);
        }
      }
    };

    const detailBody = document.querySelector('.detail-body');
    if (detailBody) {
      detailBody.addEventListener('click', handleProjectLinkClick);
      return () => {
        detailBody.removeEventListener('click', handleProjectLinkClick);
      };
    }
  }, [activeSection]);

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
      <section className="hero" style={debugMode ? { border: '2px solid red' } : {}}>
        <div className="video-container" ref={videoContainerRef} style={{ position: 'relative', ...(debugMode ? { border: '2px solid blue' } : {}) }}>
          <video ref={videoRef} src="https://cdn.pratiksinghal.in/Final%20Preview.mp4" autoPlay muted={isMuted} playsInline loop preload="metadata" style={{ height: '100%', width: '100%', objectFit: 'cover', ...(debugMode ? { border: '2px solid green' } : {}) }} />

          <button
            onClick={() => {
              const newMutedState = !isMuted;
              setIsMuted(newMutedState);
              if (videoRef.current) {
                videoRef.current.muted = newMutedState;
                if (!newMutedState) {
                  videoRef.current.play().catch(() => {});
                }
              }
              
              // Track video mute/unmute toggle
              if (mixpanel && typeof mixpanel.track === 'function') {
                try {
                  mixpanel.track('Video Interaction', {
                    action: newMutedState ? 'mute' : 'unmute',
                    time_on_page: Math.round((Date.now() - sessionStartTime.current) / 1000),
                    scroll_depth: getScrollDepth(),
                  });
                } catch (e) {
                  // Silently fail
                }
              }
            }}
            className="audio-control-button"
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              zIndex: 10,
              background: 'black',
              color: 'white',
              border: 'none',
              padding: isMuted ? '12px 20px' : '12px', // Square padding when icon only
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: 0,
              fontFamily: 'inherit',
              fontWeight: 500,
              fontSize: '14px'
            }}
          >
            {isMuted ? (
              <>
                Unmute <VolumeX size={18} />
              </>
            ) : (
              <Volume2 size={18} />
            )}
          </button>
        </div>

        <div className="content-text" ref={contentTextRef} style={debugMode ? { border: '2px solid orange' } : {}}>
          <div style={debugMode ? { border: '2px solid purple', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'fit-content', margin: '0 auto', gap: '0.15em' } : { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'fit-content', margin: '0 auto', gap: '0.15em' }}>
            <div className="body-large" style={{ display: 'flex', justifyContent: 'flex-start', width: '100%', ...(debugMode ? { border: '2px solid yellow', margin: 0 } : { margin: 0 }) }}>
              Hi there,
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
              style={{ opacity: 1 }}
              debugMode={debugMode}
            />
            <div className="body-large" style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', ...(debugMode ? { border: '2px solid magenta', margin: 0 } : { margin: 0 }) }}>
              and I create digital experiences
            </div>
          </div>
        </div>

        {/* Desktop scroll cue — fades on first scroll (class toggled in effect). */}
        <div className="hero-scroll-cue" aria-hidden="true">
          <span className="hero-scroll-cue__label">SCROLL</span>
          <span className="hero-scroll-cue__arrow">↓</span>
        </div>

        {/* Mobile-only: rotate / tap for fullscreen + sound. */}
        <button type="button" className="hero-rotate-cue" onClick={handleMobileImmerse} aria-label="Rotate device for fullscreen with sound">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="6" width="13" height="12" rx="2" transform="rotate(-12 9.5 12)" />
            <path d="M19 7a7 7 0 0 1 1.9 5.4M20.5 9l.6 3.2 2.4-1.6" />
          </svg>
          <span>Rotate &amp; tap for fullscreen + sound</span>
        </button>
      </section>

      {/* About / Next Screen Wireframe */}
      <section className="about" style={debugMode ? { border: '2px solid red' } : {}}>
        <div className="about-inner" style={debugMode ? { border: '2px solid blue' } : {}}>
          <div className="about-header" ref={aboutHeaderRef} style={debugMode ? { border: '2px solid green' } : {}}>
            <div className="about-kicker" style={debugMode ? { border: '2px solid yellow' } : {}}>Operating at the intersection of</div>
            <div className="about-title" ref={aboutTitleRef} style={debugMode ? { border: '2px solid cyan' } : {}}>
              <div className="about-title-line" data-section="psychology" style={debugMode ? { border: '2px solid orange' } : {}}>
                <PsychologyIcon className="category-icon" />
                <ArrowCloseWidget sectionName="psychology" isActive={activeSection === 'psychology'} />
              </div>
              <div className="about-title-line" data-section="design" style={debugMode ? { border: '2px solid orange' } : {}}>
                <DesignIcon className="category-icon" />
                <ArrowCloseWidget sectionName="design" isActive={activeSection === 'design'} />
              </div>
              <div className="about-title-line" data-section="code" style={debugMode ? { border: '2px solid orange' } : {}}>
                <CodeIcon className="category-icon" />
                <ArrowCloseWidget sectionName="code" isActive={activeSection === 'code'} />
              </div>
            </div>
          </div>

          {/* Detail section that appears on click */}
          <div className="about-detail" ref={aboutDetailRef} style={debugMode ? { border: '2px solid purple' } : {}}>
            {activeSection && (
              <div className="detail-content" style={debugMode ? { border: '2px solid magenta' } : {}}>
                <div className="detail-right" style={debugMode ? { border: '2px solid blue' } : {}}>
                  <div className="detail-body" dangerouslySetInnerHTML={{ __html: getSectionData(activeSection)?.body || '' }} />
                </div>
              </div>
            )}
          </div>

          <div className="about-grid" style={debugMode ? { border: '2px solid teal' } : {}}>
            <div className="about-col-left">I take full ownership of my work. I'm driven by creating products that genuinely improve how people work and think.</div>
            <div className="about-col-right"><span className="about-strong">What I bring:</span> <span className="about-caption">Deep problem-solving, cross-functional execution, and the ability to think simultaneously as a user, designer, developer, and stakeholder.</span></div>
          </div>
        </div>
      </section>

      {/* Main Projects Section with Magnetic Scrolling */}
      <section
        className={`main-projects ${hoveredProject && isMainProjectsInView ? 'dark-mode' : ''}`}
        style={{
          ...(debugMode ? { border: '2px solid red' } : {}),
          ...(hoveredProject && isMainProjectsInView ? { '--project-accent': getProjectColor(hoveredProject) } : {}),
        }}
      >
        {hoveredProject && isMainProjectsInView && (
          <div className="light-rays-wrapper">
            <LightRays
              raysOrigin="top-center"
              raysColor={getProjectColor(hoveredProject)}
              raysSpeed={3}
              lightSpread={2}
              rayLength={2}
              followMouse={true}
              mouseInfluence={1}
              noiseAmount={0.1}
              distortion={0.05}
              className="project-light-rays"
            />
          </div>
        )}
        <div className="main-projects-header" style={debugMode ? { border: '2px solid blue' } : {}}>
          <h2 className="main-projects-title" style={debugMode ? { border: '2px solid green' } : {}}>MY WORK.</h2>
        </div>
        {hoveredProject && isMainProjectsInView && getProjectData(hoveredProject) && (
          <div className="work-summary visible" style={debugMode ? { border: '2px solid orange' } : {}}>
            <div className="work-summary-col" style={debugMode ? { border: '2px solid purple' } : {}}>
              <h3 className="work-summary-title" style={debugMode ? { border: '2px solid cyan' } : {}}>Outcomes</h3>
              <ul className="work-summary-list" style={debugMode ? { border: '2px solid yellow' } : {}}>
                {getProjectData(hoveredProject).outcomes.map((outcome, index) => (
                  <li key={index} style={debugMode ? { border: '2px solid magenta' } : {}}>{outcome}</li>
                ))}
              </ul>
            </div>
            <div className="work-summary-col" style={debugMode ? { border: '2px solid teal' } : {}}>
              <h3 className="work-summary-title" style={debugMode ? { border: '2px solid cyan' } : {}}>Learnings</h3>
              <ul className="work-summary-list" style={debugMode ? { border: '2px solid yellow' } : {}}>
                {getProjectData(hoveredProject).learnings.map((learning, index) => (
                  <li key={index} style={debugMode ? { border: '2px solid magenta' } : {}}>{learning}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
        <div className="projects-container" style={debugMode ? { border: '2px solid lime' } : {}}>
          <div className="projects-track" style={debugMode ? { border: '2px solid pink' } : {}}>
            <div className="projects-wrapper" style={debugMode ? { border: '2px solid coral' } : {}}>
              <div
                className={`project-card red-project ${hoveredProject === 'cognixa' ? 'hovered' : ''}`}
                onMouseEnter={() => handleProjectHover('cognixa')}
                onMouseLeave={() => {
                  // Don't clear hover state if we're transitioning or scrolling to a different project
                  if (isTransitioningRef.current || isScrollingToDifferentProjectRef.current) return;
                  // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                  if (isTouchOrNarrow()) return;

                  const wasThirdProject = hoveredProject === 'project3';
                  setHoveredProject(null);
                  // Clear third project hover timer if leaving third project
                  if (wasThirdProject) {
                    if (thirdProjectHoverTimerRef.current) {
                      clearTimeout(thirdProjectHoverTimerRef.current);
                      thirdProjectHoverTimerRef.current = null;
                    }
                    setThirdProjectHoveredFor1s(false);
                    thirdProjectHoveredFor1sRef.current = false;
                  }
                }}
                onClick={() => {
                  trackProjectView('Cognixa', 'main');
                  openOverlay('cognixa');
                }}
                style={debugMode ? { border: '2px solid red' } : {}}
              >
                <div className="project-card-link">
                  <div className="project-rectangle" style={debugMode ? { border: '2px solid darkred' } : {}}>
                    <img
                      src={COGNIXA_NON_HOVERED}
                      alt="Cognixa Project"
                      className="project-thumbnail project-thumbnail-base"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src={COGNIXA_HOVERED}
                      alt="Cognixa Project"
                      className="project-thumbnail project-thumbnail-hover"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="project-info" style={debugMode ? { border: '2px solid indianred' } : {}}>
                    <div className="project-title-wrapper">
                      <h3 className="project-title" style={debugMode ? { border: '2px solid firebrick' } : {}}>Cognixa</h3>
                    </div>
                    <p className="project-subtitle" style={debugMode ? { border: '2px solid crimson' } : {}}>Solo Founded AI SaaS App for Mental health Professionals that helps them streamline their workflow</p>
                    <ProjectArrow />
                  </div>
                </div>
              </div>

              <div
                className={`project-card green-project ${hoveredProject === 'settlin' ? 'hovered' : ''}`}
                onMouseEnter={() => handleProjectHover('settlin')}
                onMouseLeave={() => {
                  // Don't clear hover state if we're transitioning or scrolling to a different project
                  if (isTransitioningRef.current || isScrollingToDifferentProjectRef.current) return;
                  // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                  if (isTouchOrNarrow()) return;

                  const wasThirdProject = hoveredProject === 'project3';
                  setHoveredProject(null);
                  // Clear third project hover timer if leaving third project
                  if (wasThirdProject) {
                    if (thirdProjectHoverTimerRef.current) {
                      clearTimeout(thirdProjectHoverTimerRef.current);
                      thirdProjectHoverTimerRef.current = null;
                    }
                    setThirdProjectHoveredFor1s(false);
                    thirdProjectHoveredFor1sRef.current = false;
                  }
                }}
                onClick={() => {
                  trackProjectView('Settlin', 'main');
                  openOverlay('settlin');
                }}
                style={debugMode ? { border: '2px solid green' } : {}}
              >
                <div className="project-card-link">
                  <div className="project-rectangle" style={debugMode ? { border: '2px solid darkgreen' } : {}}>
                    <img
                      src={SETTLIN_NON_HOVERED}
                      alt="Settlin Project"
                      className="project-thumbnail project-thumbnail-base"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src={SETTLIN_HOVERED}
                      alt="Settlin Project"
                      className="project-thumbnail project-thumbnail-hover"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="project-info" style={debugMode ? { border: '2px solid forestgreen' } : {}}>
                    <div className="project-title-wrapper">
                      <h3 className="project-title" style={debugMode ? { border: '2px solid seagreen' } : {}}>Settlin</h3>
                    </div>
                    <p className="project-subtitle" style={debugMode ? { border: '2px solid mediumseagreen' } : {}}>My time as UI/UX Designer where I pushed code, thought strategically and designed objectively</p>
                    <ProjectArrow />
                  </div>
                </div>
              </div>

              <div
                className={`project-card blue-project ${hoveredProject === 'project3' ? 'hovered' : ''}`}
                onMouseEnter={() => handleProjectHover('project3')}
                onMouseLeave={() => {
                  // Don't clear hover state if we're transitioning or scrolling to a different project
                  if (isTransitioningRef.current || isScrollingToDifferentProjectRef.current) return;
                  // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                  if (isTouchOrNarrow()) return;

                  const wasThirdProject = hoveredProject === 'project3';
                  setHoveredProject(null);
                  // Clear third project hover timer if leaving third project
                  if (wasThirdProject) {
                    if (thirdProjectHoverTimerRef.current) {
                      clearTimeout(thirdProjectHoverTimerRef.current);
                      thirdProjectHoverTimerRef.current = null;
                    }
                    setThirdProjectHoveredFor1s(false);
                    thirdProjectHoveredFor1sRef.current = false;
                  }
                }}
                onClick={() => {
                  trackProjectView('Pravah', 'main');
                  openOverlay('pravah');
                }}
                style={debugMode ? { border: '2px solid blue' } : {}}
              >
                <div className="project-card-link">
                  <div className="project-rectangle" style={debugMode ? { border: '2px solid darkblue' } : {}}>
                    <img
                      src={PRAVAH_NON_HOVERED}
                      alt="Pravah Project"
                      className="project-thumbnail project-thumbnail-base"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src={PRAVAH_HOVERED}
                      alt="Pravah Project"
                      className="project-thumbnail project-thumbnail-hover"
                      loading="eager"
                      decoding="async"
                    />
                  </div>
                  <div className="project-info" style={debugMode ? { border: '2px solid steelblue' } : {}}>
                    <div className="project-title-wrapper">
                      <h3 className="project-title" style={debugMode ? { border: '2px solid royalblue' } : {}}>Pravah</h3>
                    </div>
                    <p className="project-subtitle" style={debugMode ? { border: '2px solid dodgerblue' } : {}}>Designed UI/UX for an AI based health app that focusses on behavior based customisation                    </p>
                    <ProjectArrow />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Projects Section with Horizontal Scrolling */}
      <section className="mini-projects" style={debugMode ? { border: '2px solid purple' } : {}}>
        <div className="mini-projects-header">
          <h2 className="mini-projects-title">
            THINGS I DO WHEN<br />
            <span className="mini-projects-title-second-line">I CANT SIT STILL</span>
          </h2>
        </div>
        <div className="mini-projects-container">
          {/* Invisible viewport container - this is the black rectangle reference */}
          <div className={`mini-projects-viewport-container ${hoveredMiniProject && isMiniProjectsInView ? 'dark-mode' : ''}`}>
            {hoveredMiniProject && isMiniProjectsInView && showMiniAurora && (
              <div className="aurora-wrapper aurora-staggered">
                <Aurora
                  colorStops={[
                    getMiniProjectColor(hoveredMiniProject),
                    getMiniProjectColor(hoveredMiniProject),
                    getMiniProjectColor(hoveredMiniProject)
                  ]}
                  blend={0.5}
                  amplitude={1.0}
                  speed={0.5}
                />
              </div>
            )}
            <div className="mini-projects-track">
              <div className="mini-projects-wrapper">
                <div
                  onClick={() => {
                    trackProjectView('Prism', 'mini');
                    openOverlay('prism');
                  }}
                  className={`mini-project-card purple-project ${hoveredMiniProject === 'prism' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('prism')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;
                    // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                    if (isTouchOrNarrow()) return;

                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                  }}
                >
                  <div className="mini-project-rectangle">
                    <img
                      src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Prism/Prism%20Logo.png"
                      alt="Prism Logo"
                      className="mini-project-image"
                    />
                  </div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Prism</h3>
                    <p className="mini-project-subtitle">Figma Plugin</p>
                  </div>
                  <p className="mini-project-body">A Figma plugin that builds perceptually balanced, sRGB-safe OKLCH color systems with real-time accessibility checks. Designers get cleaner palettes, and developers get synced variables across CSS, Tailwind, React and tokens.</p>
                </div>

                <div
                  onClick={() => {
                    trackProjectView('JARVIS', 'mini');
                    openOverlay('jarvis');
                  }}
                  className={`mini-project-card orange-project ${hoveredMiniProject === 'jarvis' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('jarvis')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;
                    // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                    if (isTouchOrNarrow()) return;

                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                  }}
                >
                  <div className="mini-project-rectangle">
                    <img
                      src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/JARVIS/logo.png"
                      alt="JARVIS Logo"
                      className="mini-project-image"
                    />
                  </div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Jarvis Assistant</h3>
                    <p className="mini-project-subtitle">Self deployable AI</p>
                  </div>
                  <p className="mini-project-body">A fully local AI assistant built with Whisper, Ollama, Piper and n8n running inside a Docker stack. It handles voice, automation, and system actions entirely on-device for total privacy and customisation.</p>
                </div>

                <div
                  onClick={() => {
                    trackProjectView('Bloom Bakehouse', 'mini');
                    openOverlay('bloom-bakehouse');
                  }}
                  className={`mini-project-card teal-project ${hoveredMiniProject === 'bloom-bakehouse' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('bloom-bakehouse')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;
                    // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                    if (isTouchOrNarrow()) return;

                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                  }}
                >
                  <div className="mini-project-rectangle">
                    <img
                      src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Bloom/Bloom%20Logo.png"
                      alt="Bloom Logo"
                      className="mini-project-image"
                    />
                  </div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Bloom Bakehouse</h3>
                    <p className="mini-project-subtitle">Cafe Design Project</p>
                  </div>
                  <p className="mini-project-body">
                    A bakery identity designed for tier-3 India balancing approachability with premium cues, and culturally grounded design choices.
                  </p>
                </div>

                <div
                  onClick={() => {
                    trackProjectView('Conscious Living', 'mini');
                    openOverlay('conscious-living');
                  }}
                  className={`mini-project-card yellow-project ${hoveredMiniProject === 'conscious-living' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('conscious-living')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;
                    // Touch/narrow keeps focus on by default (scroll-driven); web clears focus when the cursor leaves to empty space.
                    if (isTouchOrNarrow()) return;

                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                  }}
                >
                  <div className="mini-project-rectangle">
                    <img
                      src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/CL/Conscious%20Living%20Logo.png"
                      alt="Conscious Living Logo"
                      className="mini-project-image"
                    />
                  </div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Conscious Living</h3>
                    <p className="mini-project-subtitle">Online Sales</p>
                  </div>
                  <p className="mini-project-body">A full Shopify build that connected product storytelling with clear navigation, optimized checkout, and sustainable product presentation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee and Contact Options Section */}
      <section className="marquee-contact-section">
        <div className="marquee-wrapper">
          <ScrollVelocity
            texts={[
              'Hello • नमस्ते • ನಮಸ್ಕಾರ • Hello • வணக்கம் • നമസ്കാരം • नमस्ते • నమస్కారం • Hello • ਸਤ ਸ੍ਰੀ ਅਕਾਲ • नमस्कार • নমস্কার • آदाब • ନମସ୍କାର • Hello • नमस्ते • ನಮಸ್ಕಾರ • નમસ્તે • नमस्कार • Hello • नमस्ते • ನಮಸ್ಕಾರ • नमस्ते • Hello • ನಮಸ್ಕಾರ • नमस्ते •'
            ]}
            velocity={300}
            damping={30}
            stiffness={200}
            velocityMapping={{ input: [0, 800], output: [0, 3] }}
            className="custom-scroll-text"
            numCopies={8}
          />
        </div>

        <div className="contact-options-wrapper">
          <div className="contact-options-header">
            <div className="contact-options-kicker">
              <div className="contact-options-kicker-text" style={{ opacity: 1, fontWeight: 'bold' }}>LET'S CREATE SOMETHING TOGETHER.</div>
              <div style={{ marginTop: '8px' }}>© Pratik Singhal</div>
            </div>
          </div>
          <div className="contact-options-title">
            <div className="about-title-line" data-section="email">
              <EmailIcon className="category-icon" />
              <ArrowCloseWidget sectionName="email" isActive={false} />
            </div>

            <div className="about-title-line" data-section="schedule">
              <ScheduleIcon className="category-icon" />
              <ArrowCloseWidget sectionName="schedule" isActive={false} />
            </div>

            <div className="about-title-line" data-section="message">
              <MessageIcon className="category-icon" />
              <ArrowCloseWidget sectionName="message" isActive={false} />
            </div>
          </div>
        </div>
      </section>

      {/* Prism Overlay */}
      {showPrismOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('prism');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('prism')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <AnimationLibraryProject />
            </div>
          </div>
        </div>
      )}

      {/* JARVIS Overlay */}
      {showDataVizOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('jarvis');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('jarvis')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <DataVizProject />
            </div>
          </div>
        </div>
      )}

      {showMobileAppOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('bloom-bakehouse');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('bloom-bakehouse')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <MobileAppProject />
            </div>
          </div>
        </div>
      )}

      {showCognixaOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('cognixa');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('cognixa')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <CognixaProject />
            </div>
          </div>
        </div>
      )}

      {showSettlinOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('settlin');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('settlin')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <SettlinProject />
            </div>
          </div>
        </div>
      )}

      {showAIChatOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('conscious-living');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('conscious-living')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <AIChatProject />
            </div>
          </div>
        </div>
      )}

      {showPravahOverlay && (
        <div className="project-overlay" onClick={(e) => {
          if (e.target.classList.contains('project-overlay')) {
            closeOverlay('pravah');
          }
        }}>
          <div className="project-overlay-content">
            <button 
              className="project-overlay-close"
              onClick={() => closeOverlay('pravah')}
              aria-label="Close overlay"
            >
              ×
            </button>
            <div className="project-overlay-inner">
              <PravahProject />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Export PortfolioApp as default
export default PortfolioApp;
