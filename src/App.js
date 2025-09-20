import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './App.css';

// Try to register MorphSVGPlugin
try {
  const { MorphSVGPlugin } = require('gsap/MorphSVGPlugin');
  gsap.registerPlugin(MorphSVGPlugin);
  console.log('MorphSVGPlugin registered successfully');
} catch (e) {
  console.log('MorphSVGPlugin not available - using fallback');
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

// Try to register ScrollToPlugin
try {
  const { ScrollToPlugin } = require('gsap/ScrollToPlugin');
  gsap.registerPlugin(ScrollToPlugin);
  console.log('ScrollToPlugin registered successfully');
} catch (e) {
  console.log('ScrollToPlugin not available - using fallback');
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

export default function App() {
  const loaderRef = useRef(null);
  const percentRef = useRef(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const contentTextRef = useRef(null);
  const [activeSection, setActiveSection] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const aboutHeaderRef = useRef(null);
  const aboutTitleRef = useRef(null);
  const aboutDetailRef = useRef(null);
  const activeSectionRef = useRef(null);

  useEffect(() => {
    // Don't force scroll reset - let user stay where they were
    
    // Disable scrolling initially only during loader
    document.body.style.overflow = 'hidden';
    
    const loader = loaderRef.current;
    const percentEl = percentRef.current;
    const video = videoRef.current;

    let value = 0;
    const id = setInterval(() => {
      value += 1;
      if (percentEl) percentEl.textContent = `${value}%`;
        if (value >= 100) {
        clearInterval(id);
        if (loader) loader.style.display = 'none';
        video?.play().catch(() => {});
        
        // Re-enable scrolling after loader finishes
        document.body.style.overflow = 'auto';
        
        // Initialize GSAP ScrollSmoother with scroll control
        const smoother = ScrollSmoother.create({
          wrapper: "#smooth-wrapper",
          content: "#smooth-content",
          smooth: 1.5, // Higher smoothness for bouncy feel
          effects: true, // Enable effects for better performance
          normalizeScroll: true, // Normalize scroll across devices
          ignoreMobileResize: true, // Better mobile performance
          smoothTouch: 0.3, // Moderate touch sensitivity for smooth feel
          ease: "power2.out", // Bouncy easing for smooth feel
          // Normal sensitivity settings for proper scrolling
          wheelMultiplier: 1, // Normal wheel sensitivity
          touchMultiplier: 1, // Normal touch sensitivity
          // Disable auto-scroll behaviors that might cause random scrolling
          autoResize: false, // Prevent automatic resizing that might trigger scroll
          preventDefault: false, // Allow natural scroll behavior
        });
        
        // Keep ScrollSmoother enabled but control hero section
        
        console.log('GSAP ScrollSmoother initialized');
        console.log('ScrollSmoother instance:', smoother);
        console.log('Content height:', document.getElementById('smooth-content')?.scrollHeight);
        
        // Store smoother instance for cleanup
        window.scrollSmoother = smoother;
        
        // Add scroll position tracking with debugging
        const updateScrollPosition = () => {
          try {
            if (window.scrollSmoother && typeof window.scrollSmoother.scrollTop === 'function') {
              const scroll = window.scrollSmoother.scrollTop();
              setScrollPosition(Math.round(scroll));
              
              // Debug: Log if scroll position suddenly jumps to 0
              if (Math.round(scroll) === 0 && Math.round(scroll) !== scrollPosition) {
                console.warn('Scroll jumped to top! Previous position:', scrollPosition, 'New position:', Math.round(scroll));
              }
            } else {
              setScrollPosition(Math.round(window.scrollY));
              
              // Debug: Log if scroll position suddenly jumps to 0
              if (Math.round(window.scrollY) === 0 && Math.round(window.scrollY) !== scrollPosition) {
                console.warn('Scroll jumped to top! Previous position:', scrollPosition, 'New position:', Math.round(window.scrollY));
              }
            }
          } catch (error) {
            // Fallback to window.scrollY if ScrollSmoother fails
            setScrollPosition(Math.round(window.scrollY));
          }
        };
        
        // Update scroll position on scroll
        window.addEventListener('scroll', updateScrollPosition);
        
        // Store the function for cleanup
        window.updateScrollPosition = updateScrollPosition;
      }
    }, 30);

    // Debug function
    const debugElements = () => {
      const videoRect = videoContainerRef.current?.getBoundingClientRect();
      const textRect = contentTextRef.current?.getBoundingClientRect();
      console.log('🎬 VIDEO CONTAINER:', {
        top: videoRect?.top,
        left: videoRect?.left,
        width: videoRect?.width,
        height: videoRect?.height
      });
      console.log('📝 TEXT CONTAINER:', {
        top: textRect?.top,
        left: textRect?.left,
        width: textRect?.width,
        height: textRect?.height
      });
    };

    // Create a pinned hero section timeline that advances exactly one step per gesture
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=50vh', // Very short distance - only first transition
        scrub: 2, // High scrub to consume scroll momentum
        pin: true,
        anticipatePin: 1,
        // Disable snap to prevent random scrolling to top
        // snap: {
        //   snapTo: [0, 1], // Two discrete states: fullscreen video, video + text
        //   duration: { min: 0.3, max: 0.6 }, // Much shorter duration to reduce forced snapping
        //   delay: 0.2, // Longer delay to allow user intention
        //   ease: 'power2.out',
        //   directional: false, // Allow bidirectional snapping
        //   inertia: true, // Allow natural momentum
        //   snapSpacing: 0.8 // Much larger spacing to reduce snap frequency
        // },
        onUpdate: debugElements
      }
    });

    // Phase 1: video is full-screen by default (CSS).
    // Phase 2: text slides up from bottom and video fills remaining space above.
    tl.to(videoContainerRef.current, {
      width: '90vw',
      height: 'calc(100vh - 5vh)', // Fill remaining space above text
      top: '5vh',
      left: '5vw',
      ease: 'power2.inOut', // Smooth easing
      duration: 1 // Moderate duration for smooth transition
    })
    .to(
      contentTextRef.current,
      { 
        transform: 'translateY(0%)', // bring blue container to bottom of viewport
        ease: 'power2.inOut', // Smooth easing
        duration: 1 // Moderate duration for smooth transition
      },
      '<'
    );

    // Add DrawSVG animation for text reveal
    if (gsap.plugins.drawSVG) {
      console.log('Setting up DrawSVG animation for text reveal');
      gsap.from(".draw-me", {
        duration: 1,
        drawSVG: 0,
        ease: "power2.out",
        stagger: 0.2
      });
    } else {
      console.log('DrawSVG not available - using fallback animation');
      gsap.from(".draw-me", {
        duration: 1,
        opacity: 0,
        y: 20,
        ease: "power2.out",
        stagger: 0.2
      });
    }

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

        // Main projects pin with MAGNETIC directional snapping
        ScrollTrigger.create({
          id: 'projects-scroll',
          trigger: projectsSection,
          start: 'top top',
          end: '+=800vh', // Longer distance for magnetic snapping
          pin: true,
          scrub: 0.5, // Moderate scrub for smooth response
          anticipatePin: 1,
          // Disable snap to prevent random scrolling issues
          // snap: {
          //   snapTo: [0, 0.5, 1], // Three discrete snap points
          //   duration: {min: 0.4, max: 0.8}, // Shorter duration to be less forced
          //   delay: 0.3, // Longer delay to respect user intention
          //   ease: 'power2.out',
          //   directional: false, // Allow bidirectional movement
          //   inertia: true, // Allow natural momentum
          //   snapSpacing: 0.6, // Much larger spacing to reduce snap frequency
          // },
          onUpdate: (self) => {
            const progress = self.progress;
            let targetX;
            
            // MAGNETIC snapping - snaps to nearest project based on direction
            if (progress < 0.25) {
              // First project centered - magnetic to first
              targetX = cardPositions[0];
            } else if (progress < 0.75) {
              // Second project centered - magnetic to second
              targetX = cardPositions[1];
            } else {
              // Third project centered - magnetic to third
              targetX = cardPositions[2];
            }
            
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

      if (!miniProjectsSection || !miniProjectsWrapper || miniCards.length < 3) return;

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

        // Mini projects pin with MAGNETIC directional snapping
        ScrollTrigger.create({
          id: 'mini-projects-scroll',
          trigger: miniProjectsSection,
          start: 'top top',
          end: '+=600vh', // Longer distance for magnetic snapping through all cards
          pin: true,
          scrub: 0.5, // Moderate scrub for smooth response
          anticipatePin: 1,
          // Disable snap to prevent random scrolling issues
          // snap: {
          //   snapTo: [0, 0.33, 0.66, 1], // Four discrete snap points for 4 cards
          //   duration: {min: 0.4, max: 0.8}, // Shorter duration to be less forced
          //   delay: 0.3, // Longer delay to respect user intention
          //   ease: 'power2.out',
          //   directional: false, // Allow bidirectional movement
          //   inertia: true, // Allow natural momentum
          //   snapSpacing: 0.6, // Much larger spacing to reduce snap frequency
          // },
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
            
            // Update container background based on centered project
            const container = document.querySelector('.mini-projects-viewport-container');
            if (container) {
              // Remove all hover classes
              container.classList.remove('hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow');
              
              // Add appropriate hover class based on active card
              const colorClasses = ['hover-purple', 'hover-orange', 'hover-teal', 'hover-yellow'];
              if (colorClasses[activeCardIndex]) {
                container.classList.add(colorClasses[activeCardIndex]);
              }
            }
            
            // Smooth magnetic positioning
            gsap.to(miniProjectsWrapper, {
              x: targetX,
              duration: 0.3,
              ease: "power2.out"
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
    setTimeout(setupMiniProjectsScrolling, 150); // Slight delay after main projects

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      clearInterval(id);
      // Clean up ScrollSmoother instance
      if (window.scrollSmoother) {
        window.scrollSmoother.kill();
        window.scrollSmoother = null;
      }
      // Re-enable scrolling on cleanup
      document.body.style.overflow = '';
      // Remove scroll position tracking
      if (window.updateScrollPosition) {
        window.removeEventListener('scroll', window.updateScrollPosition);
        delete window.updateScrollPosition;
      }
      // Hero scroll listeners already cleaned up in natural scroll flow
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
    console.log('CLICK:', sectionName, 'Close icon:', isCloseIcon, 'Current:', currentActiveSection);
    
    // Two-state machine: null (neutral) or one of sections (expanded)
    if (currentActiveSection) {
      // Any click when expanded -> close
      console.log('CLOSING because current active is:', currentActiveSection);
      setActiveSection(null);
    } else {
      // Only open if not clicking close icon (which shouldn't be visible anyway)
      if (!isCloseIcon) {
        console.log('OPENING section:', sectionName);
        setActiveSection(sectionName);
      } else {
        console.log('IGNORING close icon click when no section is active');
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
        console.log('Row clicked, close icon:', !!isCloseIcon);
        handleClick(sectionName, !!isCloseIcon);
      };
      
      clickHandlers.set(row, rowHandler);
      row.addEventListener('click', rowHandler);
      row.style.cursor = 'pointer';
    });
    
    const detailHandler = () => {
      console.log('Detail area clicked, closing');
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
        console.log('ACTIVATING:', sectionName);
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
          console.log('Using MorphSVGPlugin for morphing');
          // Use MorphSVGPlugin for smooth morphing - sync with write-up timing
          gsap.to(morphPath, {
            duration: 0.7, // Match write-up duration
            morphSVG: isActive ? closeId : arrowId,
            ease: "power2.out" // Match write-up easing
          });
        } else {
          console.log('MorphSVGPlugin not available - using fallback');
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
      console.log('Natural height:', naturalHeight);
      
      // Use natural height but cap it at a reasonable maximum
      targetDetailHeightPx = Math.min(naturalHeight, 500); // Cap at 500px max
      
      // Restore collapsed state
      aboutDetail.style.height = originalHeight || '0px';
      aboutDetail.style.opacity = originalOpacity || '0';
      aboutDetail.style.overflow = originalOverflow || 'hidden';
    }
    
    console.log('Target height:', targetDetailHeightPx);
    
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

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
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
      {/* Scroll Position Debug Counter - Outside smooth-wrapper */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        fontSize: '14px',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        Scroll: {scrollPosition}px
      </div>
      
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className={debugMode ? '' : 'debug-off'}>
            <div className="loader" ref={loaderRef}>
            <div className="loader-percentage" ref={percentRef}>0%</div>
          </div>

          {/* Pinned hero that transitions, then releases to normal scroll */}
          <section className="hero">
            <div className="video-container" ref={videoContainerRef}>
              <video ref={videoRef} src="/video.mp4" autoPlay muted playsInline />
            </div>
            
            <div className="content-text" ref={contentTextRef}>
              <div>
                <h1>Hi there,</h1>
                <h2>I'M PRATIK</h2>
                <p>and I create digital experiences</p>
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
          <h2 className="main-projects-title">MY MAIN PROJECTS</h2>
        </div>
        <div className="projects-container">
          <div className="projects-track">
            <div className="projects-wrapper">
              <div className="project-card red-project">
                <div className="project-rectangle"></div>
                <div className="project-info">
                  <h3 className="project-title">Cognixa: Building Alone, Building User-First</h3>
                  <p className="project-subtitle">From Psychology to Product, A UX first approach into Systems Thinking and Data-Driven Decision Making</p>
                </div>
              </div>
              
              <div className="project-card green-project">
                <div className="project-rectangle"></div>
                <div className="project-info">
                  <h3 className="project-title">Settlin : Designing with a product mindset</h3>
                  <p className="project-subtitle">My learnings that helped me think in systems and wholistic ecosystem rather than free standing domains</p>
                </div>
              </div>
              
              <div className="project-card blue-project">
                <div className="project-rectangle"></div>
                <div className="project-info">
                  <h3 className="project-title">Settlin : Designing with a product mindset</h3>
                  <p className="project-subtitle">My learnings that helped me think in systems and wholistic ecosystem rather than free standing domains</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Projects Section with Horizontal Scrolling */}
      <section className="mini-projects">
        <div className="mini-projects-header">
          <h2 className="mini-projects-title">MINI PROJECTS</h2>
        </div>
        <div className="mini-projects-container">
          {/* Invisible viewport container - this is the black rectangle reference */}
          <div className="mini-projects-viewport-container">
            <div className="mini-projects-track">
              <div className="mini-projects-wrapper">
                <div className="mini-project-card purple-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Quick Study: Animation Library</h3>
                    <p className="mini-project-subtitle">Exploring motion design principles through code</p>
                  </div>
                </div>
                
                <div className="mini-project-card orange-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Data Visualization Tool</h3>
                    <p className="mini-project-subtitle">Interactive charts for complex datasets</p>
                  </div>
                </div>
                
                <div className="mini-project-card teal-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">Mobile App Prototype</h3>
                    <p className="mini-project-subtitle">Rapid prototyping with React Native</p>
                  </div>
                </div>
                
                <div className="mini-project-card yellow-project">
                  <div className="mini-project-rectangle"></div>
                  <div className="mini-project-info">
                    <h3 className="mini-project-title">AI Chat Interface</h3>
                    <p className="mini-project-subtitle">Conversational UI experiments</p>
                  </div>
                </div>
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

        </div>
      </div>
    </div>
    
    {/* Debug Toggle Button - Outside smooth-wrapper to stay visible */}
    <button 
      className={`debug-toggle ${debugMode ? 'active' : ''}`}
      onClick={toggleDebugMode}
    >
      {debugMode ? 'Show Debug' : 'Hide Debug'}
    </button>
    </>
  );
}