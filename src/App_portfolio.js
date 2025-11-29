import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './App.css';

// Import SVG assets for arrow/close widget
import arrowSvg from './assets/arrow.svg';
import closeSvg from './assets/close.svg';

// Global debug state
let globalDebugMode = false;

// Store original console methods
const originalConsoleLog = console.log.bind(console);
const originalConsoleError = console.error.bind(console);
const originalConsoleWarn = console.warn.bind(console);

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
// Import Cognixa project SVGs
import cognixaNonHovered from './assets/cognixa_non.hovered.svg';
import cognixaHovered from './assets/cognixa_hovered.svg';
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
  const [thirdProjectHoveredFor1s, setThirdProjectHoveredFor1s] = useState(false);
  const thirdProjectHoverTimerRef = useRef(null);
  const thirdProjectHoveredFor1sRef = useRef(false);
  const [lastMiniProjectHoveredFor1s, setLastMiniProjectHoveredFor1s] = useState(false);
  const lastMiniProjectHoverTimerRef = useRef(null);
  const lastMiniProjectHoveredFor1sRef = useRef(false);
  const lastScrollProgressRef = useRef(0);
  const isScrollingDownRef = useRef(false);
  const lastMiniScrollProgressRef = useRef(0);
  const isMiniScrollingDownRef = useRef(false);
  const lastVerticalScrollYRef = useRef(0);
  const isScrollingUpwardRef = useRef(false);
  const previousHoveredProjectRef = useRef(null);
  const previousHoveredMiniProjectRef = useRef(null);
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
  const [isMuted, setIsMuted] = useState(true);
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  const handleAudioPrompt = (shouldUnmute) => {
    if (shouldUnmute) {
      setIsMuted(false);
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(e => console.log('Play error:', e));
      }
    }
    setShowAudioPrompt(false);
  };

  // Preload Cognixa images for smooth hover transitions
  useEffect(() => {
    const preloadImages = () => {
      const img1 = new Image();
      img1.src = cognixaNonHovered;
      const img2 = new Image();
      img2.src = cognixaHovered;
    };
    preloadImages();
  }, []);

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

    // About section parallax scrolling - subtle effect, no text cutoff
    const aboutInner = document.querySelector('.about-inner');
    const aboutSection = document.querySelector('.about');
    if (aboutInner && aboutSection) {
      gsap.fromTo(aboutInner,
        {
          y: () => window.innerHeight * 1 // Start half viewport height below for subtle parallax
        },
        {
          y: 0, // End at natural position
          ease: 'none',
          scrollTrigger: {
            trigger: aboutSection,
            start: 'top bottom',
            end: 'top top', // Complete animation when section reaches top
            scrub: 0.5,
            markers: debugMode ? {
              startColor: "purple",
              endColor: "purple",
              indent: 200,
              fontSize: "12px"
            } : false,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              // Recalculate start position on resize
              gsap.set(aboutInner, { y: window.innerHeight * 0.5 });
            }
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
      onSnap: (self) => {
        console.log('🔵 SNAP TRIGGERED:', {
          trigger: self.trigger?.className || 'unknown',
          snapTo: self.vars?.snap?.snapTo,
          scrollY: window.scrollY,
          progress: self.progress,
          direction: self.direction
        });
      }
    };

    // Debug scroll listeners group
    console.group('📊 MAGNETIC SNAP DEBUG - Scroll Listeners');

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

          console.log('📍 SCROLLING:', {
            scrollY: currentScrollY.toFixed(2),
            delta: scrollDelta.toFixed(2),
            direction,
            mainProjectsTop: topFromTop.toFixed(2),
            mainProjectsBottom: bottomFromTop.toFixed(2),
            viewportHeight: window.innerHeight
          });
        }

        debugLastScrollY = currentScrollY;

        // Detect when scrolling stops
        scrollTimeout = setTimeout(() => {
          if (isScrolling) {
            isScrolling = false;
            const mainProjectsEl = document.querySelector('.main-projects');
            if (mainProjectsEl) {
              const rect = mainProjectsEl.getBoundingClientRect();
              console.log('🛑 SCROLL STOPPED:', {
                finalScrollY: window.scrollY.toFixed(2),
                mainProjectsTop: rect.top.toFixed(2),
                mainProjectsBottom: rect.bottom.toFixed(2),
                mainProjectsTopPercent: ((rect.top / window.innerHeight) * 100).toFixed(2) + '%',
                mainProjectsBottomPercent: ((rect.bottom / window.innerHeight) * 100).toFixed(2) + '%',
                expectedBottomTop: 'Should be 0 when third project centered'
              });
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
        console.log('🎯 MAIN PROJECTS POSITION:', {
          top: rect.top.toFixed(2),
          bottom: rect.bottom.toFixed(2),
          height: rect.height.toFixed(2),
          topPercent: ((rect.top / window.innerHeight) * 100).toFixed(2) + '%',
          bottomPercent: ((rect.bottom / window.innerHeight) * 100).toFixed(2) + '%',
          scrollY: window.scrollY.toFixed(2)
        });
      }
    };

    // Log initial position
    console.log('🚀 INITIAL POSITION:', {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight
    });
    trackSnapEvents();

    // Helper function to manually check position (call from console: window.checkSnapPosition())
    window.checkSnapPosition = () => {
      console.group('🔍 MANUAL POSITION CHECK');
      const mainProjectsEl = document.querySelector('.main-projects');
      const miniProjectsEl = document.querySelector('.mini-projects');

      if (mainProjectsEl) {
        const rect = mainProjectsEl.getBoundingClientRect();
        console.log('📌 MAIN PROJECTS:', {
          top: rect.top.toFixed(2),
          bottom: rect.bottom.toFixed(2),
          height: rect.height.toFixed(2),
          topPercent: ((rect.top / window.innerHeight) * 100).toFixed(2) + '%',
          bottomPercent: ((rect.bottom / window.innerHeight) * 100).toFixed(2) + '%',
          scrollY: window.scrollY.toFixed(2),
          expectedBottomForThirdProject: '0px (when third project centered)',
          actualDifference: rect.bottom.toFixed(2) + 'px from expected'
        });
      }

      if (miniProjectsEl) {
        const rect = miniProjectsEl.getBoundingClientRect();
        console.log('📌 MINI PROJECTS:', {
          top: rect.top.toFixed(2),
          bottom: rect.bottom.toFixed(2),
          topPercent: ((rect.top / window.innerHeight) * 100).toFixed(2) + '%',
          scrollY: window.scrollY.toFixed(2)
        });
      }

      console.log('📌 VIEWPORT:', {
        height: window.innerHeight,
        scrollY: window.scrollY.toFixed(2),
        scrollMax: document.documentElement.scrollHeight - window.innerHeight
      });

      console.groupEnd();
    };

    console.log('💡 TIP: Call window.checkSnapPosition() in console to check current position');

    console.groupEnd();

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
        const cardPositions = [
          measureRequiredX(0), // First card centered
          measureRequiredX(1), // Second card centered  
          measureRequiredX(2)  // Third card centered
        ];

        // Compute a rightmost starting position for the first card
        const measureRightmostX = (cardIndex) => {
          const target = cards[cardIndex];
          if (!target) return cardPositions[0];
          const prevTransform = projectsWrapper.style.transform;
          projectsWrapper.style.transform = 'none';
          const targetRect = target.getBoundingClientRect();
          // Shift so the card's left edge aligns with the viewport right edge (just offscreen)
          const rightmostX = (window.innerWidth - targetRect.left) + 20; // +20px bias offscreen
          projectsWrapper.style.transform = prevTransform;
          return rightmostX;
        };

        const entryStartX = measureRightmostX(0);
        const measureLeftmostX = (cardIndex) => {
          const target = cards[cardIndex];
          if (!target) return cardPositions[cardIndex] || 0;
          const prevTransform = projectsWrapper.style.transform;
          projectsWrapper.style.transform = 'none';
          const targetRect = target.getBoundingClientRect();
          // Shift so the card's right edge aligns with the viewport left edge (slightly offscreen)
          const leftmostX = -(targetRect.right) - 20; // -20px bias offscreen
          projectsWrapper.style.transform = prevTransform;
          return leftmostX;
        };
        const exitEndX = measureLeftmostX(2);

        // Start with the first project off to the right; it will slide in during entry
        gsap.set(projectsWrapper, { x: entryStartX });

        // Kill previous triggers for idempotency
        ScrollTrigger.getAll().forEach(t => {
          if (t.vars && (t.vars.id === 'projects-scroll' || t.vars.id === 'projects-entry' || t.vars.id === 'projects-exit' || t.vars.id?.includes('project-'))) {
            t.kill();
          }
        });

        // Initialize all cards as visible with same scale - no blur effects
        gsap.set(cards, {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)'
        });

        // Entry interaction: as the section scrolls into view, slide first project from rightmost to centered
        ScrollTrigger.create({
          id: 'projects-entry',
          trigger: projectsSection,
          start: 'top bottom',   // section top hits bottom of viewport
          end: 'top top',        // section top reaches top (pin start)
          scrub: 0.5,            // Match vertical scroll sensitivity for smooth transition
          anticipatePin: 1,
          markers: debugMode ? {
            startColor: 'blue',
            endColor: 'blue',
            indent: 50,
            fontSize: '10px'
          } : false,
          onUpdate: (self) => {
            const p = self.progress; // 0 -> 1
            // Apply easing curve for smoother transition
            const easeFunc = gsap.parseEase("power2.out");
            const easedProgress = easeFunc(p);
            const x = gsap.utils.interpolate(entryStartX, cardPositions[0], easedProgress);
            gsap.set(projectsWrapper, { x });
            // Keep first card prominent during entry
            cards.forEach((card, index) => {
              gsap.to(card, { opacity: index === 0 ? 1 : 0.3, duration: 0.3 });
            });
          },
          onLeave: () => {
            // Ensure exact center at handoff to main pinned scrolling
            gsap.set(projectsWrapper, { x: cardPositions[0] });
            cards.forEach((card, index) => {
              gsap.to(card, { opacity: index === 0 ? 1 : 0.3, duration: 0.3 });
            });
          }
        });

        // Exit interaction: gentle fade-out when scrolling away - no push, just natural transition
        ScrollTrigger.create({
          id: 'projects-exit',
          trigger: projectsSection,
          start: 'bottom top',   // when the section bottom reaches top (after pin ends)
          end: '+=20vh',         // Even shorter exit zone for less interference
          scrub: 0.5, // Match vertical scroll sensitivity for smooth transition
          anticipatePin: 1,
          markers: debugMode ? {
            startColor: 'blue',
            endColor: 'blue',
            indent: 80,
            fontSize: '10px'
          } : false,
          onUpdate: (self) => {
            const p = self.progress; // 0 -> 1
            // Very gentle easing - minimal movement
            const easeFunc = gsap.parseEase("power1.out");
            const easedProgress = easeFunc(p);
            // Only slight movement - don't push users
            const slightX = gsap.utils.interpolate(cardPositions[2], cardPositions[2] - 50, easedProgress * 0.3);
            gsap.set(projectsWrapper, { x: slightX });
            // Gentle opacity fade
            cards.forEach((card, index) => {
              const opacity = index === 2 ? 1 - (easedProgress * 0.2) : 0.3 - (easedProgress * 0.1);
              gsap.to(card, { opacity: Math.max(0.2, opacity), duration: 0.2 });
            });
          },
          onEnter: () => {
            // Start from the third centered position
            gsap.set(projectsWrapper, { x: cardPositions[2] });
            cards.forEach((card, index) => {
              gsap.to(card, { opacity: index === 2 ? 1 : 0.3, duration: 0.2 });
            });
          }
        });


        // Main projects pin with smooth scrolling and responsive snap
        ScrollTrigger.create({
          id: 'projects-scroll',
          trigger: projectsSection,
          start: 'top top',
          end: '+=600vh', // Reduced track for more responsive scrolling
          pin: true, // Re-enabled for scroll effects
          scrub: 0.5, // Match vertical scroll sensitivity for smooth transition
          anticipatePin: 1,
          snap: {
            snapTo: (progress) => {
              // If scrolling down past third project (progress > 0.95) and not hovered for 1s, disable snap
              // This allows snapping to the third project (progress 1.0) but disables snap when trying to scroll past
              if (isScrollingDownRef.current && progress > 0.95 && !thirdProjectHoveredFor1sRef.current) {
                return null; // Disable snap when scrolling down past third project
              }

              // Snap to nearest project point
              const snapPoints = [0, 0.5, 1];
              return snapPoints.reduce((prev, curr) =>
                Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
              );
            },
            duration: { min: 0.1, max: 0.15 }, // Fast snap
            delay: 0.3, // Only snap after scrolling stops (300ms delay)
            ease: "power2.out", // Smooth, fast snap
            directional: false,
            inertia: true // Allow natural momentum scrolling
          },
          markers: debugMode ? {
            startColor: "green",
            endColor: "green",
            indent: 50,
            fontSize: "10px"
          } : false,
          onUpdate: (self) => {
            const progress = self.progress;

            // Track scroll direction
            const previousProgress = lastScrollProgressRef.current;
            const isScrollingDown = progress > previousProgress;
            isScrollingDownRef.current = isScrollingDown;
            const isScrolling = Math.abs(progress - previousProgress) > 0.0001; // More sensitive threshold
            lastScrollProgressRef.current = progress;

            // Determine which project will be snapped to based on nearest snap point
            // This ensures only the project that will be snapped to is at 100% opacity
            const snapPoints = [0, 0.5, 1];

            // Find the nearest snap point to determine which project will be snapped to
            let nearestSnapPoint = snapPoints[0];
            let minDistance = Math.abs(progress - snapPoints[0]);
            snapPoints.forEach((snapPoint) => {
              const distance = Math.abs(progress - snapPoint);
              if (distance < minDistance) {
                minDistance = distance;
                nearestSnapPoint = snapPoint;
              }
            });

            // Map snap point to card index
            let activeCardIndex = 0;
            if (nearestSnapPoint === 0) {
              activeCardIndex = 0;
            } else if (nearestSnapPoint === 0.5) {
              activeCardIndex = 1;
            } else {
              activeCardIndex = 2;
            }

            // Check if we're at a snap point (centered) - within 5% of snap points for better tolerance
            const isAtSnapPoint = snapPoints.some(snapPoint => Math.abs(progress - snapPoint) < 0.05);

            // Detect scrolling while hovered and trigger transition
            const currentHoveredProject = hoveredProject;
            const previousHoveredProject = previousHoveredProjectRef.current;

            // CRITICAL: Maintain hover state continuously during scroll based on active project
            // BUT only if cursor is actually over a project card (not just in center area)
            if (isScrolling) {
              // Check if cursor is actually over a project card
              const mouseX = window.mouseX;
              const mouseY = window.mouseY;
              let isOverProject = false;

              if (mouseX !== undefined && mouseY !== undefined) {
                const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
                isOverProject = elementUnderMouse && (
                  elementUnderMouse.closest('.project-card') ||
                  elementUnderMouse.closest('.mini-project-card')
                );
              }

              // Only maintain hover if cursor is actually over a project OR if we're already in hover mode
              // This prevents hover mode from activating just because cursor is in center area
              const shouldMaintainHover = isOverProject || currentHoveredProject;

              if (shouldMaintainHover) {
                // Mark that we're scrolling to prevent onMouseLeave from clearing hover state
                isScrollingToDifferentProjectRef.current = true;

                // Determine which project should be hovered based on scroll position
                const projectIds = ['cognixa', 'settlin', 'project3'];
                const targetProjectId = projectIds[activeCardIndex];

                // Continuously maintain hover state for the active project during scroll
                // Only if cursor is over a project or we were already hovering
                // IMPORTANT: Don't automatically set hover when snapping - only maintain if already hovering
                if (targetProjectId) {
                  // Only update hover state if:
                  // 1. Cursor is actually over a project, OR
                  // 2. We're already hovering (maintain existing hover state)
                  if (isOverProject || currentHoveredProject) {
                    if (targetProjectId !== currentHoveredProject) {
                      // Track previous hover state before updating
                      if (currentHoveredProject) {
                        previousHoveredProjectRef.current = currentHoveredProject;
                      }
                      // Only update if cursor is actually over a project
                      if (isOverProject) {
                        setHoveredProject(targetProjectId);
                      }
                    }
                    // Always ensure hover state is maintained (even if same project)
                    // This prevents onMouseLeave from clearing it
                    isScrollingToDifferentProjectRef.current = true;
                  } else if (currentHoveredProject && !isOverProject) {
                    // Clear hover if cursor left all projects
                    setHoveredProject(null);
                    isScrollingToDifferentProjectRef.current = false;
                  }
                }
              } else if (currentHoveredProject) {
                // Cursor is not over any project and we're not already hovering - clear hover state
                setHoveredProject(null);
                isScrollingToDifferentProjectRef.current = false;
              }
            }

            // If user is hovering and scrolling, trigger transition when moving to different project
            // Use previous hover state to detect when we've moved to a different project
            if (previousHoveredProject && isScrolling && !isTransitioningRef.current) {
              // Find the index of the previous hovered project (before update)
              let fromProjectIndex = null;
              if (previousHoveredProject === 'cognixa') fromProjectIndex = 0;
              else if (previousHoveredProject === 'settlin') fromProjectIndex = 1;
              else if (previousHoveredProject === 'data-viz') fromProjectIndex = 2;

              // Check if we're moving to a different project
              const isMovingToDifferentProject = fromProjectIndex !== null && activeCardIndex !== fromProjectIndex;

              // Trigger transition when we've moved to a different project
              if (isMovingToDifferentProject && !hasTriggeredTransitionRef.current) {
                // Get light rays wrapper and work summary
                const lightRaysWrapper = document.querySelector('.light-rays-wrapper');
                const workSummary = document.querySelector('.work-summary');

                // Mark as triggered
                hasTriggeredTransitionRef.current = true;

                // Trigger transition with the target project index
                handleHoverToScrollTransition(fromProjectIndex, activeCardIndex, cards, projectsSection, lightRaysWrapper, workSummary);
              }
            }

            // Reset transition flag when at snap point
            if (isAtSnapPoint) {
              hasTriggeredTransitionRef.current = false;
              isScrollingToDifferentProjectRef.current = false;
            }

            // Update previous hover state
            previousHoveredProjectRef.current = currentHoveredProject;

            // Calculate smooth position for immediate visual feedback
            // Interpolate through all three card positions for magnetic movement with easing
            let smoothX;
            if (progress <= 0.5) {
              // Interpolate between first card (progress 0) and second card (progress 0.5)
              const localProgress = progress / 0.5; // 0 to 1 between first and second card
              // Apply easing for smoother magnetic movement
              const easedProgress = gsap.parseEase("power2.out")(localProgress);
              smoothX = gsap.utils.interpolate(cardPositions[0], cardPositions[1], easedProgress);
            } else {
              // Interpolate between second card (progress 0.5) and third card (progress 1)
              const localProgress = (progress - 0.5) / 0.5; // 0 to 1 between second and third card
              // Apply easing for smoother magnetic movement
              const easedProgress = gsap.parseEase("power2.out")(localProgress);
              smoothX = gsap.utils.interpolate(cardPositions[1], cardPositions[2], easedProgress);
            }

            // Update wrapper position smoothly based on scroll
            gsap.set(projectsWrapper, { x: smoothX });

            // Only one project active (full opacity) at a time - even during scrolling
            cards.forEach((card, index) => {
              if (isAtSnapPoint) {
                // At snap point - centered project at 100%, others at 30%
                if (index === activeCardIndex) {
                  // Ensure centered class is set and scrolling is removed
                  if (!card.classList.contains('centered')) {
                    card.classList.add('centered');
                  }
                  card.classList.remove('scrolling');
                  // Ensure centered project is hoverable immediately
                  card.style.pointerEvents = 'auto';
                  // Set opacity instantly when at snap point - no animation
                  gsap.set(card, { opacity: 1, immediateRender: true });
                  enforceProjectPointerEvents();
                } else {
                  // Ensure centered class is removed
                  card.classList.remove('centered');
                  card.classList.remove('scrolling');
                  // Force non-centered projects to be non-hoverable immediately
                  card.style.pointerEvents = 'none';
                  // Set opacity instantly when at snap point - no animation
                  gsap.set(card, { opacity: 0.3, immediateRender: true });
                  enforceProjectPointerEvents();
                }
              } else {
                // During scrolling - only active card at full opacity, others at reduced opacity
                // Ensure centered class is removed and scrolling is set
                card.classList.remove('centered');
                if (!card.classList.contains('scrolling')) {
                  card.classList.add('scrolling');
                }

                // Only active card gets full opacity, others get reduced opacity
                // All cards are non-hoverable during scrolling (not hovered state)
                // Set opacity instantly to ensure only one project is active
                if (index === activeCardIndex) {
                  gsap.set(card, { opacity: 1, immediateRender: true }); // Set instantly
                  card.style.pointerEvents = 'none'; // Non-hoverable during scrolling
                } else {
                  gsap.set(card, { opacity: 0.3, immediateRender: true }); // Set instantly
                  card.style.pointerEvents = 'none';
                }
              }
            });
          }
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

        // Entry/exit helpers
        const measureRightmostX = (cardIndex) => {
          const target = miniCards[cardIndex];
          if (!target) return cardPositions[0];
          const prevTransform = miniProjectsWrapper.style.transform;
          miniProjectsWrapper.style.transform = 'none';
          const targetRect = target.getBoundingClientRect();
          const rightmostX = (window.innerWidth - targetRect.left) + 20;
          miniProjectsWrapper.style.transform = prevTransform;
          return rightmostX;
        };
        const measureLeftmostX = (cardIndex) => {
          const target = miniCards[cardIndex];
          if (!target) return cardPositions[cardIndex] || 0;
          const prevTransform = miniProjectsWrapper.style.transform;
          miniProjectsWrapper.style.transform = 'none';
          const targetRect = target.getBoundingClientRect();
          const leftmostX = -(targetRect.right) - 20;
          miniProjectsWrapper.style.transform = prevTransform;
          return leftmostX;
        };

        const firstIndex = 0;
        const lastIndex = Math.min(miniCards.length - 1, 3);
        const miniEntryStartX = measureRightmostX(firstIndex);
        const miniExitEndX = measureLeftmostX(lastIndex);

        // Initialize off to right for entry
        gsap.set(miniProjectsWrapper, { x: miniEntryStartX });

        // Kill previous mini project triggers for idempotency
        ScrollTrigger.getAll().forEach(t => {
          if (t.vars && (t.vars.id === 'mini-projects-scroll' || t.vars.id === 'mini-projects-entry' || t.vars.id === 'mini-projects-exit' || t.vars.id?.includes('mini-project-'))) {
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


        // Entry slide: bring first mini project from right into center before pin starts
        ScrollTrigger.create({
          id: 'mini-projects-entry',
          trigger: miniProjectsSection,
          start: 'top bottom',
          end: 'top top',
          scrub: 0.5, // Match vertical scroll sensitivity for smooth transition
          anticipatePin: 1,
          markers: debugMode ? {
            startColor: 'purple',
            endColor: 'purple',
            indent: 0,
            fontSize: '10px'
          } : false,
          onUpdate: (self) => {
            const p = self.progress; // 0 -> 1
            // Apply easing curve for smoother transition
            const easeFunc = gsap.parseEase("power2.out");
            const easedProgress = easeFunc(p);
            const x = gsap.utils.interpolate(miniEntryStartX, cardPositions[firstIndex], easedProgress);
            gsap.set(miniProjectsWrapper, { x });
            miniCards.forEach((card, index) => {
              gsap.to(card, { opacity: index === firstIndex ? 1 : 0.3, duration: 0.3 });
            });
          },
          onLeave: () => {
            gsap.set(miniProjectsWrapper, { x: cardPositions[firstIndex] });
            miniCards.forEach((card, index) => {
              gsap.to(card, { opacity: index === firstIndex ? 1 : 0.3, duration: 0.3 });
            });
          }
        });

        // Mini projects pin with smooth scrolling and responsive snap
        ScrollTrigger.create({
          id: 'mini-projects-scroll',
          trigger: miniProjectsSection,
          start: 'top top',
          end: '+=600vh', // Reduced track for more responsive scrolling
          pin: true, // Re-enabled for scroll effects
          scrub: 0.5, // Match vertical scroll sensitivity for smooth transition
          anticipatePin: 1,
          snap: {
            snapTo: (progress) => {
              // If scrolling down past last mini project (progress > 0.95) and not hovered for 1s, disable snap
              // This allows snapping to the last mini project (progress 1.0) but disables snap when trying to scroll past
              if (isMiniScrollingDownRef.current && progress > 0.95 && !lastMiniProjectHoveredFor1sRef.current) {
                return null; // Disable snap when scrolling down past last mini project
              }

              // Snap to nearest project point
              const snapPoints = [0, 0.33, 0.66, 1];
              return snapPoints.reduce((prev, curr) =>
                Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev
              );
            },
            duration: { min: 0.1, max: 0.15 }, // Fast snap
            delay: 0.3, // Only snap after scrolling stops (300ms delay)
            ease: "power2.out", // Smooth, fast snap
            directional: false,
            inertia: true // Allow natural momentum scrolling
          },
          markers: debugMode ? {
            startColor: "purple",
            endColor: "purple",
            indent: 0,
            fontSize: "10px"
          } : false,
          onUpdate: (self) => {
            const progress = self.progress;

            // Track scroll direction
            const previousProgress = lastMiniScrollProgressRef.current;
            const isScrollingDown = progress > previousProgress;
            isMiniScrollingDownRef.current = isScrollingDown;
            const isScrolling = Math.abs(progress - previousProgress) > 0.0001; // More sensitive threshold
            lastMiniScrollProgressRef.current = progress;

            // Determine which project will be snapped to based on nearest snap point
            // This ensures only the project that will be snapped to is at 100% opacity
            const snapPoints = [0, 0.33, 0.66, 1];

            // Find the nearest snap point to determine which project will be snapped to
            let nearestSnapPoint = snapPoints[0];
            let minDistance = Math.abs(progress - snapPoints[0]);
            snapPoints.forEach((snapPoint) => {
              const distance = Math.abs(progress - snapPoint);
              if (distance < minDistance) {
                minDistance = distance;
                nearestSnapPoint = snapPoint;
              }
            });

            // Map snap point to card index
            let activeCardIndex = 0;
            if (nearestSnapPoint === 0) {
              activeCardIndex = 0;
            } else if (nearestSnapPoint === 0.33) {
              activeCardIndex = 1;
            } else if (nearestSnapPoint === 0.66) {
              activeCardIndex = 2;
            } else {
              activeCardIndex = 3;
            }

            // Check if we're at a snap point (centered) - within 5% of snap points for better tolerance
            const isAtSnapPoint = snapPoints.some(snapPoint => Math.abs(progress - snapPoint) < 0.05);

            // Detect scrolling while hovered and trigger transition
            const currentHoveredMiniProject = hoveredMiniProject;
            const previousHoveredMiniProject = previousHoveredMiniProjectRef.current;

            // CRITICAL: Maintain hover state continuously during scroll based on active project
            // BUT only if cursor is actually over a mini project card (not just in center area)
            if (isScrolling) {
              // Check if cursor is actually over a mini project card
              const mouseX = window.mouseX;
              const mouseY = window.mouseY;
              let isOverMiniProject = false;

              if (mouseX !== undefined && mouseY !== undefined) {
                const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
                isOverMiniProject = elementUnderMouse && elementUnderMouse.closest('.mini-project-card');
              }

              // Only maintain hover if cursor is actually over a mini project OR if we're already in hover mode
              // This prevents hover mode from activating just because cursor is in center area
              const shouldMaintainHover = isOverMiniProject || currentHoveredMiniProject;

              if (shouldMaintainHover) {
                // Mark that we're scrolling to prevent onMouseLeave from clearing hover state
                isScrollingToDifferentMiniProjectRef.current = true;

                // Determine which project should be hovered based on scroll position
                const miniProjectIds = ['animation-library', 'data-viz', 'mobile-app', 'ai-chat'];
                const targetProjectId = miniProjectIds[activeCardIndex];

                // Continuously maintain hover state for the active project during scroll
                // Only if cursor is over a project or we were already hovering
                if (targetProjectId) {
                  if (targetProjectId !== currentHoveredMiniProject) {
                    // Track previous hover state before updating
                    if (currentHoveredMiniProject) {
                      previousHoveredMiniProjectRef.current = currentHoveredMiniProject;
                    }
                    // Update hover state immediately to match active project
                    setHoveredMiniProject(targetProjectId);
                  }
                  // ALWAYS ensure showMiniAurora is true during scroll
                  // Set it every frame during scroll to prevent flickering
                  // This ensures it's never cleared during scroll transitions
                  setShowMiniAurora(true);
                  // Always ensure hover state is maintained (even if same project)
                  // This prevents onMouseLeave from clearing it
                  isScrollingToDifferentMiniProjectRef.current = true;
                }
              }
            }

            // If user is hovering and scrolling, trigger transition when moving to different project
            // Use previous hover state to detect when we've moved to a different project
            if (previousHoveredMiniProject && isScrolling && !isTransitioningRef.current) {
              // Find the index of the previous hovered mini project (before update)
              const projectCardClassMap = {
                'animation-library': 0,
                'data-viz': 1,
                'mobile-app': 2,
                'ai-chat': 3
              };
              const fromProjectIndex = projectCardClassMap[previousHoveredMiniProject] ?? null;

              // Check if we're moving to a different project
              const isMovingToDifferentProject = fromProjectIndex !== null && activeCardIndex !== fromProjectIndex;

              // Trigger transition when we've moved to a different project
              if (isMovingToDifferentProject && !hasTriggeredMiniTransitionRef.current) {
                // Get aurora wrapper and viewport container
                const auroraWrapper = document.querySelector('.aurora-wrapper');
                const miniProjectsViewportContainer = document.querySelector('.mini-projects-viewport-container');

                // Mark as triggered
                hasTriggeredMiniTransitionRef.current = true;

                // Trigger transition with the target project index
                handleMiniHoverToScrollTransition(fromProjectIndex, activeCardIndex, miniCards, miniProjectsSection, auroraWrapper, miniProjectsViewportContainer);
              }
            }

            // Reset transition flag when at snap point
            if (isAtSnapPoint) {
              hasTriggeredMiniTransitionRef.current = false;
              isScrollingToDifferentMiniProjectRef.current = false;
            }

            // Update previous hover state
            previousHoveredMiniProjectRef.current = currentHoveredMiniProject;

            // Calculate smooth position for immediate visual feedback
            // Interpolate through all four card positions for magnetic movement with easing (same as main projects)
            let smoothX;
            if (progress <= 0.33) {
              // Interpolate between first card (progress 0) and second card (progress 0.33)
              const localProgress = progress / 0.33; // 0 to 1 between first and second card
              // Apply easing for smoother magnetic movement
              const easedProgress = gsap.parseEase("power2.out")(localProgress);
              smoothX = gsap.utils.interpolate(cardPositions[0], cardPositions[1], easedProgress);
            } else if (progress <= 0.66) {
              // Interpolate between second card (progress 0.33) and third card (progress 0.66)
              const localProgress = (progress - 0.33) / 0.33; // 0 to 1 between second and third card
              // Apply easing for smoother magnetic movement
              const easedProgress = gsap.parseEase("power2.out")(localProgress);
              smoothX = gsap.utils.interpolate(cardPositions[1], cardPositions[2], easedProgress);
            } else {
              // Interpolate between third card (progress 0.66) and fourth card (progress 1)
              const localProgress = (progress - 0.66) / 0.34; // 0 to 1 between third and fourth card
              // Apply easing for smoother magnetic movement
              const easedProgress = gsap.parseEase("power2.out")(localProgress);
              smoothX = gsap.utils.interpolate(cardPositions[2], cardPositions[3] || cardPositions[2], easedProgress);
            }

            // Update wrapper position smoothly based on scroll
            gsap.set(miniProjectsWrapper, { x: smoothX });

            // Update the currently centered project
            currentCenteredMiniProject = activeCardIndex;

            // Only one project active (full opacity) at a time - even during scrolling
            miniCards.forEach((card, index) => {
              if (isAtSnapPoint) {
                // At snap point - centered project at 100%, others at 30%
                if (index === activeCardIndex) {
                  // Ensure centered class is set and scrolling is removed
                  if (!card.classList.contains('centered')) {
                    card.classList.add('centered');
                  }
                  card.classList.remove('scrolling');
                  // Ensure centered mini project is hoverable immediately
                  card.style.pointerEvents = 'auto';
                  // Set opacity instantly when at snap point - no animation
                  gsap.set(card, { opacity: 1, immediateRender: true });
                  enforceMiniProjectPointerEvents();
                } else {
                  // Ensure centered class is removed
                  card.classList.remove('centered');
                  card.classList.remove('scrolling');
                  // Force non-centered mini projects to be non-hoverable immediately
                  card.style.pointerEvents = 'none';
                  // Set opacity instantly when at snap point - no animation
                  gsap.set(card, { opacity: 0.3, immediateRender: true });
                  enforceMiniProjectPointerEvents();
                }
              } else {
                // During scrolling - only active card at full opacity, others at reduced opacity
                // Ensure centered class is removed and scrolling is set
                card.classList.remove('centered');
                if (!card.classList.contains('scrolling')) {
                  card.classList.add('scrolling');
                }

                // Only active card gets full opacity, others get reduced opacity
                // All cards are non-hoverable during scrolling (not hovered state)
                // Set opacity instantly to ensure only one project is active
                if (index === activeCardIndex) {
                  gsap.set(card, { opacity: 1, immediateRender: true }); // Set instantly
                  card.style.pointerEvents = 'none'; // Non-hoverable during scrolling
                } else {
                  gsap.set(card, { opacity: 0.3, immediateRender: true }); // Set instantly
                  card.style.pointerEvents = 'none';
                }
              }
            });

          }
        });

        // Exit interaction: gentle fade-out when scrolling away - no push, just natural transition
        ScrollTrigger.create({
          id: 'mini-projects-exit',
          trigger: miniProjectsSection,
          start: 'bottom top',
          end: '+=20vh', // Even shorter exit zone for less interference
          scrub: 0.5, // Match vertical scroll sensitivity for smooth transition
          anticipatePin: 1,
          markers: debugMode ? {
            startColor: 'purple',
            endColor: 'purple',
            indent: 40,
            fontSize: '10px'
          } : false,
          onEnter: () => {
            gsap.set(miniProjectsWrapper, { x: cardPositions[lastIndex] });
            miniCards.forEach((card, index) => {
              gsap.to(card, { opacity: index === lastIndex ? 1 : 0.3, duration: 0.2 });
            });
          },
          onUpdate: (self) => {
            const p = self.progress; // 0 -> 1
            // Very gentle easing - minimal movement
            const easeFunc = gsap.parseEase("power1.out");
            const easedProgress = easeFunc(p);
            // Only slight movement - don't push users
            const lastCardPos = cardPositions[lastIndex] || cardPositions[2];
            const slightX = gsap.utils.interpolate(lastCardPos, lastCardPos - 50, easedProgress * 0.3);
            gsap.set(miniProjectsWrapper, { x: slightX });
            // Gentle opacity fade
            miniCards.forEach((card, index) => {
              const opacity = index === lastIndex ? 1 - (easedProgress * 0.2) : 0.3 - (easedProgress * 0.1);
              gsap.to(card, { opacity: Math.max(0.2, opacity), duration: 0.2 });
            });
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
    let isDarkMode = false;
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

    // Fast transition functions
    const activateDarkMode = () => {
      if (isDarkMode) return;
      isDarkMode = true;
      debugLog('🌙 Activating dark mode');

      // Add dark mode class for CSS styling
      document.querySelector('.marquee-contact-section')?.classList.add('dark-mode');

      gsap.to('body', { backgroundColor: '#000000', duration: 0.02, ease: 'power2.out' });
      gsap.to('.marquee-contact-section', { backgroundColor: '#000000', color: '#ffffff', duration: 0.02, ease: 'power2.out' });
      gsap.to('.marquee-text', { color: '#ffffff', duration: 0.02, ease: 'power2.out' });
      gsap.to('.contact-options-kicker, .contact-options-kicker-text', { color: '#ffffff', duration: 0.02, ease: 'power2.out' });
      // Only target SVG paths in the about section, not contact section
      gsap.to('.about .about-title-line .morphing-icon svg path', { stroke: '#ffffff', duration: 0.02, ease: 'power2.out' });
      gsap.to('.about .about-title-line .morphing-icon.icon-fill svg path', { fill: '#ffffff', duration: 0.02, ease: 'power2.out' });

      // Apply white filter to arrow SVGs and contact section PNG images
      gsap.to('.about-title-line .arrow svg', { filter: 'brightness(0) invert(1)', duration: 0.02, ease: 'power2.out' });
      gsap.to('.marquee-contact-section .category-svg img', { filter: 'brightness(0) invert(1)', duration: 0.02, ease: 'power2.out' });

      debugLog('✅ Dark mode activated');
    };

    const activateLightMode = () => {
      if (!isDarkMode) return;
      isDarkMode = false;
      debugLog('☀️ Activating light mode');

      // Debug: Check if images exist
      const images = document.querySelectorAll('.category-svg img');
      debugLog('🔍 Found', images.length, 'PNG images in light mode:', images);

      // Remove dark mode class for CSS styling
      document.querySelector('.marquee-contact-section')?.classList.remove('dark-mode');

      gsap.to('body', { backgroundColor: '#f5f5f0', duration: 0.02, ease: 'power2.out' });
      gsap.to('.marquee-contact-section', { backgroundColor: '#f5f5f0', color: '#111111', duration: 0.02, ease: 'power2.out' });
      gsap.to('.marquee-text', { color: '#111111', duration: 0.02, ease: 'power2.out' });
      gsap.to('.contact-options-kicker, .contact-options-kicker-text', { color: '#111111', duration: 0.02, ease: 'power2.out' });
      // Only target SVG paths in the about section, not contact section
      gsap.to('.about .about-title-line .morphing-icon svg path', { stroke: '#111111', duration: 0.02, ease: 'power2.out' });
      gsap.to('.about .about-title-line .morphing-icon.icon-fill svg path', { fill: '#111111', duration: 0.02, ease: 'power2.out' });

      // Remove filter from arrow SVGs and contact section PNG images
      gsap.to('.about-title-line .arrow svg', { filter: 'none', duration: 0.02, ease: 'power2.out' });
      gsap.to('.marquee-contact-section .category-svg img', { filter: 'none', duration: 0.02, ease: 'power2.out' });

      debugLog('✅ Light mode activated');
    };

    // Scroll direction detection
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ScrollTrigger for Schedule Call (scrolling down)
    ScrollTrigger.create({
      trigger: '.about-title-line[data-section="schedule"]',
      start: 'top 80%',
      end: 'bottom 20%',
      onEnter: () => {
        if (scrollDirection === 'down') {
          activateDarkMode();
        }
      },
      onLeave: () => {
        if (scrollDirection === 'down') {
          gsap.to('body', { backgroundColor: '#f0f8e6', duration: 0.05, ease: 'power2.out' });
        }
      }
    });

    // ScrollTrigger for upward scroll detection (any upward movement in marquee section)
    ScrollTrigger.create({
      trigger: '.marquee-contact-section',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        if (scrollDirection === 'up' && self.progress > 0.1) {
          activateLightMode();
        }
      }
    });

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

        option.addEventListener('click', (e) => {
          e.preventDefault();
          const contactType = option.dataset.section;
          debugLog('Contact option clicked:', contactType);

          // Handle different contact types
          if (contactType === 'email') {
            window.location.href = 'mailto:your@email.com';
          } else if (contactType === 'schedule') {
            window.open('https://calendar.app.google/EzFhyN3hioUtucrZ9', '_blank');
          } else if (contactType === 'message') {
            // Open contact form or messaging interface
            debugLog('Open message form');
          }
        });
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

  // Custom cursor with magnetic trail - ONLY for homepage
  useEffect(() => {
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
        // Check if we're in hover mode (dark mode active)
        const inMainProjectHoverMode = document.querySelector('.main-projects.dark-mode');
        const inMiniProjectHoverMode = document.querySelector('.mini-projects-viewport-container.dark-mode');

        if (inMainProjectHoverMode || inMiniProjectHoverMode) {
          // In hover mode: lock trail to project track center (where projects snap to)
          let targetX = window.innerWidth / 2;
          let targetY = window.innerHeight / 2;

          if (inMainProjectHoverMode) {
            const projectsTrack = document.querySelector('.projects-track');
            if (projectsTrack) {
              const trackRect = projectsTrack.getBoundingClientRect();
              targetX = trackRect.left + (trackRect.width / 2);
              targetY = trackRect.top + (trackRect.height / 2);
            }
          } else if (inMiniProjectHoverMode) {
            const miniProjectsTrack = document.querySelector('.mini-projects-track');
            if (miniProjectsTrack) {
              const trackRect = miniProjectsTrack.getBoundingClientRect();
              targetX = trackRect.left + (trackRect.width / 2);
              targetY = trackRect.top + (trackRect.height / 2);
            }
          }

          // Smooth transition to fixed snap position
          trailX += (targetX - trailX) * 0.25;
          trailY += (targetY - trailY) * 0.25;

          // Snap when close
          const distance = Math.sqrt((targetX - trailX) ** 2 + (targetY - trailY) ** 2);
          if (distance < 5) {
            trailX = targetX;
            trailY = targetY;
          }
        } else {
          // Not in hover mode: follow the project element
          const rect = hoveredElement.getBoundingClientRect();
          // Use custom center if set (for contact options with icon + arrow), otherwise use rect center
          let centerX, centerY;
          if (hoveredElement._trailCenterX !== undefined && hoveredElement._trailCenterX !== null) {
            centerX = hoveredElement._trailCenterX;
            centerY = rect.top + rect.height / 2;
          } else {
            centerX = rect.left + rect.width / 2;
            centerY = rect.top + rect.height / 2;
          }

          // Stronger magnetic pull for better responsiveness
          trailX += (centerX - trailX) * 0.25;
          trailY += (centerY - trailY) * 0.25;

          // Ensure trail stays centered on the project
          const distance = Math.sqrt((centerX - trailX) ** 2 + (centerY - trailY) ** 2);
          if (distance < 5) {
            trailX = centerX;
            trailY = centerY;
          }
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

          // Don't remove shape if we're still in hover mode (another project is hovered)
          // Use a small delay to let the next mouseenter fire first
          setTimeout(() => {
            // Check if we're still hovering any main project OR if hoveredProject state is set
            const stillOnMainProject = document.querySelector('.project-card:hover');
            const inHoverMode = document.querySelector('.main-projects.dark-mode');

            if (!stillOnMainProject && !inHoverMode) {
              isHoveringProject = false;
              hoveredElement = null;
              if (trail && trail.isConnected) {
                trail.classList.remove('magnetic-rectangle');
              }
              // Hide cursor label
              if (label && label.isConnected) {
                label.classList.remove('visible');
                label.textContent = '';
              }
            }
          }, 10); // Small delay to allow next mouseenter to fire
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

          // Don't remove shape if we're still in hover mode (another mini project is hovered)
          setTimeout(() => {
            // Check if we're still hovering any mini project OR if mini projects section is in dark mode
            const stillOnMiniProject = document.querySelector('.mini-project-card:hover');
            const inHoverMode = document.querySelector('.mini-projects-viewport-container.dark-mode');

            if (!stillOnMiniProject && !inHoverMode) {
              isHoveringProject = false;
              hoveredElement = null;
              if (trail && trail.isConnected) {
                trail.classList.remove('magnetic-square');
              }
            }
          }, 10); // Small delay to allow next mouseenter to fire
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
          isHoveringProject = false;
          hoveredElement = null;
          if (trail && trail.isConnected) {
            trail.classList.remove('magnetic-audio-button');
            trail.classList.remove('magnetic-audio-button-rect');
          }
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
          isHoveringProject = false;
          hoveredElement = null;
          // Clear custom center and left
          if (row._trailCenterX !== undefined) {
            row._trailCenterX = null;
          }
          if (row._trailLeft !== undefined) {
            row._trailLeft = null;
          }
          if (trail && trail.isConnected) {
            trail.classList.remove('about-rect');
            // Reset size so other modes can style it
            trail.style.width = '';
            trail.style.height = '';
          }
          if (label && label.isConnected) {
            label.classList.remove('visible');
          }
          window.__hoveredAboutSection = null;
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

  // Update ref whenever state changes
  useEffect(() => {
    activeSectionRef.current = activeSection;
    // Update cursor label if hovering an about row
    const labelEl = document.querySelector('.cursor-label');
    const hovered = typeof window !== 'undefined' ? window.__hoveredAboutSection : null;
    if (labelEl && hovered) {
      labelEl.textContent = activeSection === hovered ? 'Click to close' : 'Click to open';
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
        body: `<p>My academic path started with a <strong>multidisciplinary BA in Journalism, Psychology, and Computer Science</strong> at Kristu Jayanti College, followed by an <strong>MSc in Clinical Psychology</strong> from Christ University.</p><p>Psychology has shaped the way I understand human behavior, decision-making, and how people interact with products. <u>It forms the base of how I build things.</u> I rely on research, observation, and behavioral frameworks to design solutions that solve genuine problems rather than surface-level ones. This approach lets me quantify user behavior and turn it into practical insights.</p><p>This shows up clearly in <strong>Cognixa</strong>, my client-management platform for psychologists. It began as a personal need and grew into a structured product shaped by behavioral analysis and user psychology. Psychology continues to guide my product thinking and gives my work a naturally human-centered edge.</p>`
      },
      design: {
        icon: <DesignIcon />,
        title: 'Design',
        body: `<p>My design journey started in <strong>2018</strong> with my first part-time job as a graphic designer. That year taught me how important design is for communicating ideas clearly and fast. I took on freelance projects across <strong>Illustrator, After Effects, and Figma</strong>, which helped me build a solid foundation.</p><p>Since then, I've created full design systems and brand identities for different clients. One example is <strong>Bloom Bakehouse</strong>, where I worked on everything from the logo and packaging to brand guidelines that improved their presence. I also created the full visual identity for <strong>Cognixa</strong> across digital and physical touchpoints.</p><p>Most recently, at <strong>Settlin</strong>, a proptech company, I worked as a <u>UI/UX Designer for nine months</u>. I refined user flows, built scalable design systems, designed their pitch deck, and worked closely with engineers to make sure everything shipped properly. I also designed parts of their internal CMS and mobile app.</p><p>I combined design, code, and research in <strong>Prism</strong>, my color palette generator based on perceptual color science. It creates visually consistent palettes that make sense to both designers and developers.</p>`
      },
      code: {
        icon: <CodeIcon />,
        title: 'Code',
        body: `<p>My development journey began in <strong>2019</strong> with <strong>UBU Community</strong>, my first paid web project, which was a static site built with <strong>HTML, CSS, and vanilla code</strong>. That project strengthened my basics in layouts, states, interactions, and animations.</p><p>At <strong>Settlin</strong>, I reached a milestone that meant a lot to me: <u>shipping production Flutter screens even though my role was primarily design-focused</u>. This helped close the gap between design and engineering and delivered real business value when resources were tight. I've also contributed <strong>React code</strong> at Settlin and built <strong>Cognixa</strong> entirely on a React architecture.</p><p>While I don't consider myself a highly advanced engineer, <u>I naturally think in systems</u>. That helps reduce friction between design and development and speeds up how projects move.</p><p><strong>Prism</strong> is where my technical and design skills meet. It uses perceptual color science, has integrated analytics and behavior tracking, and exports palettes in formats that are actually useful in daily design work.</p><p>My engineering approach focuses on problem-solving instead of complexity. I care about clarity, user impact, and business outcomes, which helps me contribute meaningfully even outside traditional design boundaries.</p>`
      }
    };
    return data[section];
  };

  const getProjectData = (projectId) => {
    const projects = {
      cognixa: {
        learnings: [
          'Solo product development from concept to launch',
          'Integrating psychological principles into UX design',
          'Building data-driven decision-making frameworks',
          'Balancing technical debt with feature development'
        ],
        outcomes: [
          'Launched MVP with 500+ active users in first quarter',
          'Reduced user onboarding time by 60%',
          'Achieved 85% user retention rate',
          'Built scalable architecture supporting 10K+ users'
        ],
        color: '#ff0000' // Red
      },
      settlin: {
        learnings: [
          'Cross-functional collaboration in product teams',
          'Designing for complex B2B workflows',
          'Systems thinking in large-scale platforms',
          'Iterative design based on stakeholder feedback'
        ],
        outcomes: [
          'Streamlined 3-day process into 2-hour workflow',
          'Increased team productivity by 40%',
          'Reduced support tickets by 55%',
          'Successfully onboarded 50+ enterprise clients'
        ],
        color: '#00ff00' // Green
      },
      project3: {
        learnings: [
          'Rapid prototyping and validation techniques',
          'Mobile-first design considerations',
          'Performance optimization for web applications',
          'User testing and feedback incorporation'
        ],
        outcomes: [
          'Delivered product 3 weeks ahead of schedule',
          'Achieved 95% positive user feedback score',
          'Improved page load speed by 70%',
          'Created reusable component library'
        ],
        color: '#0000ff' // Blue
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
      'animation-library': {
        color: '#9b59b6' // Purple
      },
      'data-viz': {
        color: '#ff9500' // Orange
      },
      'mobile-app': {
        color: '#00d4aa' // Teal
      },
      'ai-chat': {
        color: '#ffd700' // Yellow
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

  // Scroll main-projects section into viewport smoothly
  const scrollToMainProjects = () => {
    const mainProjectsSection = document.querySelector('.main-projects');
    if (!mainProjectsSection) return;

    const rect = mainProjectsSection.getBoundingClientRect();
    const isInView = rect.top >= 0 && rect.top < window.innerHeight && rect.bottom > 0;

    if (!isInView) {
      // Calculate target scroll position to align section top with viewport top
      const targetScrollY = window.scrollY + rect.top;

      gsap.to(window, {
        scrollTo: { y: targetScrollY },
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => {
          setIsMainProjectsInView(true);
        }
      });
    } else {
      setIsMainProjectsInView(true);
    }
  };

  // Handle project hover with viewport check
  const handleProjectHover = (projectId) => {
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

    // Only scroll to viewport if not scrolling down past third project
    // Allow autoscroll when scrolling upward (towards "my work") even if past third project
    const projectsScrollTrigger = ScrollTrigger.getById('projects-scroll');
    const isScrollingPastThird = projectsScrollTrigger && projectsScrollTrigger.progress > 0.75 && isScrollingDownRef.current;
    const isScrollingUpward = isScrollingUpwardRef.current;

    // Don't scroll back up if scrolling down past third project (unless scrolling upward)
    if (isScrollingPastThird && projectId === 'project3' && !isScrollingUpward) {
      // Just set hover state without scrolling
      setHoveredProject(projectId);
      enforceProjectPointerEvents();
      return;
    }

    if (!checkMainProjectsInView()) {
      // Section not in viewport, scroll to it first
      const mainProjectsSection = document.querySelector('.main-projects');
      if (mainProjectsSection) {
        const rect = mainProjectsSection.getBoundingClientRect();
        const targetScrollY = window.scrollY + rect.top;

        // Store the project card element and track if cursor is still over it
        const projectCard = document.querySelector(`.project-card.${projectId === 'cognixa' ? 'red-project' : projectId === 'settlin' ? 'green-project' : 'blue-project'}`);
        let isStillHovering = false;

        // Track if cursor is still over the card during scroll
        if (projectCard) {
          const checkHover = () => {
            const cardRect = projectCard.getBoundingClientRect();
            const mouseX = window.mouseX || 0;
            const mouseY = window.mouseY || 0;
            return mouseX >= cardRect.left && mouseX <= cardRect.right &&
              mouseY >= cardRect.top && mouseY <= cardRect.bottom;
          };

          // Check hover state periodically during scroll
          const hoverCheckInterval = setInterval(() => {
            isStillHovering = checkHover();
            if (!isStillHovering) {
              clearInterval(hoverCheckInterval);
            }
          }, 50);

          // Scroll to section and wait for completion
          gsap.to(window, {
            scrollTo: { y: targetScrollY },
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              clearInterval(hoverCheckInterval);
              // Verify section is now in viewport
              checkMainProjectsInView();
              // Only set hover if cursor is still over the project card
              if (projectCard && (isStillHovering || checkHover())) {
                setHoveredProject(projectId);
                enforceProjectPointerEvents();
              }
            }
          });
        } else {
          // If card not found, set hover anyway (fallback)
          gsap.to(window, {
            scrollTo: { y: targetScrollY },
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              checkMainProjectsInView();
              setHoveredProject(projectId);
              enforceProjectPointerEvents();
            }
          });
        }
      }
    } else {
      // Section already in viewport, set hover immediately (cursor is already over the project)
      setHoveredProject(projectId);
      enforceProjectPointerEvents();
    }
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
    // Check if last mini project is centered (at snap point)
    const lastMiniProjectCard = document.querySelector('.mini-project-card:last-child');
    const isLastMiniProjectCentered = lastMiniProjectCard && lastMiniProjectCard.classList.contains('centered');

    // Only start 1s timer if hovering over last mini project AND it's centered (not scrolling)
    // Check if it's the last mini project (4th project - 'ai-chat')
    const miniProjectsScrollTrigger = ScrollTrigger.getById('mini-projects-scroll');
    const isLastMiniProject = projectId === 'ai-chat';

    if (isLastMiniProject && isLastMiniProjectCentered) {
      // Clear any existing timer
      if (lastMiniProjectHoverTimerRef.current) {
        clearTimeout(lastMiniProjectHoverTimerRef.current);
      }
      // Set timer to enable snap after 1 second
      lastMiniProjectHoverTimerRef.current = setTimeout(() => {
        setLastMiniProjectHoveredFor1s(true);
        lastMiniProjectHoveredFor1sRef.current = true;
      }, 1000);
    } else {
      // Not last mini project or not centered, clear timer and reset state
      if (lastMiniProjectHoverTimerRef.current) {
        clearTimeout(lastMiniProjectHoverTimerRef.current);
        lastMiniProjectHoverTimerRef.current = null;
      }
      setLastMiniProjectHoveredFor1s(false);
      lastMiniProjectHoveredFor1sRef.current = false;
    }

    // Only scroll to viewport if not scrolling down past last mini project
    // Allow autoscroll when scrolling upward (towards "mini projects") even if past last project
    const isScrollingPastLast = miniProjectsScrollTrigger && miniProjectsScrollTrigger.progress > 0.83 && isMiniScrollingDownRef.current;
    const isScrollingUpward = isScrollingUpwardRef.current;

    // Don't scroll back up if scrolling down past last mini project (unless scrolling upward)
    if (isScrollingPastLast && isLastMiniProject && !isScrollingUpward) {
      // Just set hover state without scrolling
      setHoveredMiniProject(projectId);
      enforceMiniProjectPointerEvents();
      return;
    }

    if (!checkMiniProjectsInView()) {
      // Section not in viewport, scroll to it first
      const miniProjectsSection = document.querySelector('.mini-projects');
      if (miniProjectsSection) {
        const rect = miniProjectsSection.getBoundingClientRect();
        const targetScrollY = window.scrollY + rect.top;

        // Store the project card element and track if cursor is still over it
        // Find the card by matching the projectId with the className
        const projectCardClassMap = {
          'animation-library': 'purple-project',
          'data-viz': 'orange-project',
          'mobile-app': 'teal-project',
          'ai-chat': 'yellow-project'
        };
        const projectCard = document.querySelector(`.mini-project-card.${projectCardClassMap[projectId] || ''}`);
        let isStillHovering = false;

        // Track if cursor is still over the card during scroll
        if (projectCard) {
          const checkHover = () => {
            const cardRect = projectCard.getBoundingClientRect();
            const mouseX = window.mouseX || 0;
            const mouseY = window.mouseY || 0;
            return mouseX >= cardRect.left && mouseX <= cardRect.right &&
              mouseY >= cardRect.top && mouseY <= cardRect.bottom;
          };

          // Check hover state periodically during scroll
          const hoverCheckInterval = setInterval(() => {
            isStillHovering = checkHover();
            if (!isStillHovering) {
              clearInterval(hoverCheckInterval);
            }
          }, 50);

          // Scroll to section and wait for completion
          gsap.to(window, {
            scrollTo: { y: targetScrollY },
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              clearInterval(hoverCheckInterval);
              // Verify section is now in viewport
              checkMiniProjectsInView();
              // Only set hover if cursor is still over the project card
              if (projectCard && (isStillHovering || checkHover())) {
                setHoveredMiniProject(projectId);
                enforceMiniProjectPointerEvents();
                // Show aurora with delay after background turns black
                setShowMiniAurora(false);
                setTimeout(() => {
                  setShowMiniAurora(true);
                }, 200); // 200ms delay for background to turn black first
              }
            }
          });
        } else {
          // If card not found, set hover anyway (fallback)
          gsap.to(window, {
            scrollTo: { y: targetScrollY },
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              checkMiniProjectsInView();
              setHoveredMiniProject(projectId);
              enforceMiniProjectPointerEvents();
              // Show aurora with delay after background turns black
              setShowMiniAurora(false);
              setTimeout(() => {
                setShowMiniAurora(true);
              }, 200); // 200ms delay for background to turn black first
            }
          });
        }
      }
    } else {
      // Section already in viewport, set hover immediately (cursor is already over the project)
      setHoveredMiniProject(projectId);
      // Enforce pointer-events after hover state changes
      enforceMiniProjectPointerEvents();
      // Show aurora with delay after background turns black
      setShowMiniAurora(false);
      setTimeout(() => {
        setShowMiniAurora(true);
      }, 200); // 200ms delay for background to turn black first
    }
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

      // Check if cursor is hovering over third project while scrolling up
      // Only trigger if not already at third project (progress < 0.95) to avoid conflicts with snap
      if (isScrollingUpward && !isMagneticScrollingRef.current) {
        const projectsScrollTrigger = ScrollTrigger.getById('projects-scroll');
        const currentProgress = projectsScrollTrigger ? projectsScrollTrigger.progress : 0;

        // Only trigger magnetic scroll if we're not already at or past the third project
        if (currentProgress < 0.95) {
          const thirdProjectCard = document.querySelector('.project-card.blue-project');
          if (thirdProjectCard) {
            const cardRect = thirdProjectCard.getBoundingClientRect();
            const mouseX = window.mouseX || 0;
            const mouseY = window.mouseY || 0;
            const isOverThirdProject = mouseX >= cardRect.left && mouseX <= cardRect.right &&
              mouseY >= cardRect.top && mouseY <= cardRect.bottom;

            if (isOverThirdProject && hoveredProject !== 'project3') {
              // Clear any existing timeout
              if (magneticScrollTimeoutRef.current) {
                clearTimeout(magneticScrollTimeoutRef.current);
              }

              // Debounce the magnetic scroll to prevent firing too frequently
              magneticScrollTimeoutRef.current = setTimeout(() => {
                // Double-check that we're still hovering and scrolling up
                if (isScrollingUpwardRef.current && !isMagneticScrollingRef.current) {
                  // Verify cursor is still over third project before scrolling
                  const thirdProjectCard = document.querySelector('.project-card.blue-project');
                  if (thirdProjectCard) {
                    const cardRect = thirdProjectCard.getBoundingClientRect();
                    const mouseX = window.mouseX || 0;
                    const mouseY = window.mouseY || 0;
                    const isStillOverThirdProject = mouseX >= cardRect.left && mouseX <= cardRect.right &&
                      mouseY >= cardRect.top && mouseY <= cardRect.bottom;

                    if (isStillOverThirdProject) {
                      const projectsScrollTrigger = ScrollTrigger.getById('projects-scroll');
                      if (projectsScrollTrigger) {
                        isMagneticScrollingRef.current = true;

                        // Calculate scroll position to reach progress = 1.0 (third project centered)
                        const triggerStart = projectsScrollTrigger.start;
                        const triggerEnd = projectsScrollTrigger.end;
                        const scrollDistance = triggerEnd - triggerStart;
                        const targetScrollY = triggerStart + scrollDistance; // Position for progress = 1.0

                        // Scroll to third project position
                        gsap.to(window, {
                          scrollTo: { y: targetScrollY },
                          duration: 0.6,
                          ease: "power2.out",
                          onComplete: () => {
                            // Only activate hover mode if cursor is still over third project
                            const finalCardRect = thirdProjectCard.getBoundingClientRect();
                            const finalMouseX = window.mouseX || 0;
                            const finalMouseY = window.mouseY || 0;
                            const isStillHovering = finalMouseX >= finalCardRect.left && finalMouseX <= finalCardRect.right &&
                              finalMouseY >= finalCardRect.top && finalMouseY <= finalCardRect.bottom;

                            if (isStillHovering) {
                              setHoveredProject('project3');
                              enforceProjectPointerEvents();
                            }
                            isMagneticScrollingRef.current = false;
                          }
                        });
                      }
                    }
                  }
                }
              }, 100); // 100ms debounce
            } else {
              // Cursor left third project, clear timeout
              if (magneticScrollTimeoutRef.current) {
                clearTimeout(magneticScrollTimeoutRef.current);
                magneticScrollTimeoutRef.current = null;
              }
            }
          }
        }
      } else if (!isScrollingUpward) {
        // If scrolling stopped or changed direction, clear magnetic scroll timeout
        if (magneticScrollTimeoutRef.current) {
          clearTimeout(magneticScrollTimeoutRef.current);
          magneticScrollTimeoutRef.current = null;
        }
      }

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
        // Clear last mini project hover timer
        if (lastMiniProjectHoverTimerRef.current) {
          clearTimeout(lastMiniProjectHoverTimerRef.current);
          lastMiniProjectHoverTimerRef.current = null;
        }
        setLastMiniProjectHoveredFor1s(false);
        lastMiniProjectHoveredFor1sRef.current = false;
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
            if (hoveredProject) {
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
            if (hoveredMiniProject) {
              setHoveredMiniProject(null);
              setShowMiniAurora(false);
              // Clear last mini project hover timer
              if (lastMiniProjectHoverTimerRef.current) {
                clearTimeout(lastMiniProjectHoverTimerRef.current);
                lastMiniProjectHoverTimerRef.current = null;
              }
              setLastMiniProjectHoveredFor1s(false);
              lastMiniProjectHoveredFor1sRef.current = false;
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
          <video ref={videoRef} src="https://cdn.pratiksinghal.in/Final.mp4" autoPlay muted={isMuted} playsInline loop style={{ height: '100%', objectFit: 'cover', ...(debugMode ? { border: '2px solid green' } : {}) }} />

          <button
            onClick={() => {
              const newMutedState = !isMuted;
              setIsMuted(newMutedState);
              if (videoRef.current) {
                videoRef.current.muted = newMutedState;
                if (!newMutedState) {
                  videoRef.current.play().catch(e => console.log('Play error:', e));
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
          <div style={debugMode ? { border: '2px solid purple', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'fit-content', margin: '0 auto', gap: '0.5em' } : { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'fit-content', margin: '0 auto', gap: '0.5em' }}>
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
                <div className="detail-left" style={debugMode ? { border: '2px solid red' } : {}}>
                  <div className="detail-icon">
                    {getSectionData(activeSection).icon}
                  </div>
                </div>
                <div className="detail-right" style={debugMode ? { border: '2px solid blue' } : {}}>
                  <div className="detail-body" dangerouslySetInnerHTML={{ __html: getSectionData(activeSection).body }} />
                </div>
              </div>
            )}
          </div>

          <div className="about-grid" style={debugMode ? { border: '2px solid teal' } : {}}>
            <div className="about-col-left">I take full ownership of my work—from initial problem identification to final implementation. Whether I'm debugging code at 2 AM or redesigning a flow for the fifth time, I'm driven by creating products that genuinely improve how people work and think.</div>
            <div className="about-col-right"><span className="about-strong">What I bring:</span> <span className="about-caption">Deep problem-solving, cross-functional execution, and the rare ability to think simultaneously as a user, designer, developer, and business owner.</span></div>
          </div>
        </div>
      </section>

      {/* Main Projects Section with Magnetic Scrolling */}
      <section className={`main-projects ${hoveredProject && isMainProjectsInView ? 'dark-mode' : ''}`} style={debugMode ? { border: '2px solid red' } : {}}>
        {hoveredProject && isMainProjectsInView && (
          <div className="light-rays-wrapper">
            <LightRays
              raysOrigin="top-center"
              raysColor={getProjectColor(hoveredProject)}
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
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
              <h3 className="work-summary-title" style={debugMode ? { border: '2px solid cyan' } : {}}>Learnings</h3>
              <ul className="work-summary-list" style={debugMode ? { border: '2px solid yellow' } : {}}>
                {getProjectData(hoveredProject).learnings.map((learning, index) => (
                  <li key={index} style={debugMode ? { border: '2px solid magenta' } : {}}>{learning}</li>
                ))}
              </ul>
            </div>
            <div className="work-summary-col" style={debugMode ? { border: '2px solid teal' } : {}}>
              <h3 className="work-summary-title" style={debugMode ? { border: '2px solid cyan' } : {}}>Outcomes</h3>
              <ul className="work-summary-list" style={debugMode ? { border: '2px solid yellow' } : {}}>
                {getProjectData(hoveredProject).outcomes.map((outcome, index) => (
                  <li key={index} style={debugMode ? { border: '2px solid magenta' } : {}}>{outcome}</li>
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
                style={debugMode ? { border: '2px solid red' } : {}}
              >
                <Link
                  to="/cognixa"
                  className="project-card-link"
                  onClick={(e) => {
                    // Navigation happens on click
                    e.stopPropagation();
                  }}
                >
                  <div className="project-rectangle" style={debugMode ? { border: '2px solid darkred' } : {}}>
                    <img
                      src={cognixaNonHovered}
                      alt="Cognixa Project"
                      className="project-thumbnail project-thumbnail-base"
                      loading="eager"
                      decoding="async"
                    />
                    <img
                      src={cognixaHovered}
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
                </Link>
              </div>

              <div
                className={`project-card green-project ${hoveredProject === 'settlin' ? 'hovered' : ''}`}
                onMouseEnter={() => handleProjectHover('settlin')}
                onMouseLeave={() => {
                  // Don't clear hover state if we're transitioning or scrolling to a different project
                  if (isTransitioningRef.current || isScrollingToDifferentProjectRef.current) return;

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
                style={debugMode ? { border: '2px solid green' } : {}}
              >
                <Link
                  to="/settlin"
                  className="project-card-link"
                  onClick={(e) => {
                    // Navigation happens on click
                    e.stopPropagation();
                  }}
                >
                  <div className="project-rectangle" style={debugMode ? { border: '2px solid darkgreen' } : {}}></div>
                  <div className="project-info" style={debugMode ? { border: '2px solid forestgreen' } : {}}>
                    <div className="project-title-wrapper">
                      <h3 className="project-title" style={debugMode ? { border: '2px solid seagreen' } : {}}>Settlin</h3>
                    </div>
                    <p className="project-subtitle" style={debugMode ? { border: '2px solid mediumseagreen' } : {}}>My time as UI/UX Designer where I pushed code, thought strategically and designed objectively</p>
                    <ProjectArrow />
                  </div>
                </Link>
              </div>

              <div
                className={`project-card blue-project ${hoveredProject === 'project3' ? 'hovered' : ''}`}
                onMouseEnter={() => handleProjectHover('project3')}
                onMouseLeave={() => {
                  // Don't clear hover state if we're transitioning or scrolling to a different project
                  if (isTransitioningRef.current || isScrollingToDifferentProjectRef.current) return;

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
                style={debugMode ? { border: '2px solid blue' } : {}}
              >
                <Link
                  to="/settlin"
                  className="project-card-link"
                  onClick={(e) => {
                    // Navigation happens on click
                    e.stopPropagation();
                  }}
                >
                  <div className="project-rectangle" style={debugMode ? { border: '2px solid darkblue' } : {}}></div>
                  <div className="project-info" style={debugMode ? { border: '2px solid steelblue' } : {}}>
                    <div className="project-title-wrapper">
                      <h3 className="project-title" style={debugMode ? { border: '2px solid royalblue' } : {}}>Pravah</h3>
                    </div>
                    <p className="project-subtitle" style={debugMode ? { border: '2px solid dodgerblue' } : {}}>Health app that</p>
                    <ProjectArrow />
                  </div>
                </Link>
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
                <Link
                  to="/animation-library"
                  className={`mini-project-card purple-project ${hoveredMiniProject === 'animation-library' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('animation-library')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;

                    const wasLastMiniProject = hoveredMiniProject === 'ai-chat';
                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                    // Clear last mini project hover timer if leaving last mini project
                    if (wasLastMiniProject) {
                      if (lastMiniProjectHoverTimerRef.current) {
                        clearTimeout(lastMiniProjectHoverTimerRef.current);
                        lastMiniProjectHoverTimerRef.current = null;
                      }
                      setLastMiniProjectHoveredFor1s(false);
                      lastMiniProjectHoveredFor1sRef.current = false;
                    }
                  }}
                >
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Prism</h3>
                    <p className="mini-project-subtitle">Figma Plugin</p>
                  </div>
                </Link>

                <Link
                  to="/data-viz"
                  className={`mini-project-card orange-project ${hoveredMiniProject === 'data-viz' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('data-viz')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;

                    const wasLastMiniProject = hoveredMiniProject === 'ai-chat';
                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                    // Clear last mini project hover timer if leaving last mini project
                    if (wasLastMiniProject) {
                      if (lastMiniProjectHoverTimerRef.current) {
                        clearTimeout(lastMiniProjectHoverTimerRef.current);
                        lastMiniProjectHoverTimerRef.current = null;
                      }
                      setLastMiniProjectHoveredFor1s(false);
                      lastMiniProjectHoveredFor1sRef.current = false;
                    }
                  }}
                >
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Jarvis Assistant</h3>
                    <p className="mini-project-subtitle">Self hosted deployable AI</p>
                  </div>
                </Link>

                <Link
                  to="/mobile-app"
                  className={`mini-project-card teal-project ${hoveredMiniProject === 'mobile-app' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('mobile-app')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;

                    const wasLastMiniProject = hoveredMiniProject === 'ai-chat';
                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                    // Clear last mini project hover timer if leaving last mini project
                    if (wasLastMiniProject) {
                      if (lastMiniProjectHoverTimerRef.current) {
                        clearTimeout(lastMiniProjectHoverTimerRef.current);
                        lastMiniProjectHoverTimerRef.current = null;
                      }
                      setLastMiniProjectHoveredFor1s(false);
                      lastMiniProjectHoveredFor1sRef.current = false;
                    }
                  }}
                >
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Bloom Bakehouse</h3>
                    <p className="mini-project-subtitle">Cafe Design Project</p>
                  </div>
                </Link>

                <Link
                  to="/ai-chat"
                  className={`mini-project-card yellow-project ${hoveredMiniProject === 'ai-chat' ? 'hovered' : ''}`}
                  onMouseEnter={() => handleMiniProjectHover('ai-chat')}
                  onMouseLeave={() => {
                    // Don't clear hover state if we're transitioning or scrolling to a different project
                    if (isTransitioningRef.current || isScrollingToDifferentMiniProjectRef.current) return;

                    const wasLastMiniProject = hoveredMiniProject === 'ai-chat';
                    setHoveredMiniProject(null);
                    setShowMiniAurora(false);
                    // Clear last mini project hover timer if leaving last mini project
                    if (wasLastMiniProject) {
                      if (lastMiniProjectHoverTimerRef.current) {
                        clearTimeout(lastMiniProjectHoverTimerRef.current);
                        lastMiniProjectHoverTimerRef.current = null;
                      }
                      setLastMiniProjectHoveredFor1s(false);
                      lastMiniProjectHoveredFor1sRef.current = false;
                    }
                  }}
                >
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Conscious Living</h3>
                    <p className="mini-project-subtitle">Spearheading Online Sales</p>
                  </div>
                </Link>
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
              'Hello • नमस्ते • ನಮಸ್ಕಾರ • Hello • வணக்கம் • നമസ്കാരം • नमस्ते • నమస్కారం • Hello • ਸਤ ਸ੍ਰੀ ਅਕਾਲ • नमस्कार • নমস্কার • آदाब • ନମସ୍କାର • Hello • नमस्ते • ನಮಸ್ಕಾರ • નમસ્તે • नमस्कार • Hello • नमस्ते • ನಮಸ್ಕಾರ • नमस्ते • Hello • ನಮಸ್ಕಾರ • नमस्ते • Hello'
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
    </>
  );
}

// Export PortfolioApp as default
export default PortfolioApp;