import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

function App() {
  useEffect(() => {
    // Elements
    const loader = document.querySelector('.loader');
    const percentText = document.querySelector('.percentage');
    const video = document.querySelector('#hero-video');
    const textContainer = document.querySelector('.text-container');

    // Loader animation (simulate loading progress)
    let percent = 0;
    const loaderInterval = setInterval(() => {
      percent += 1;
      percentText.textContent = `${percent}%`;
      
      if (percent >= 100) {
        clearInterval(loaderInterval);
        loader.style.display = 'none';
        video.play();
      }
    }, 30); // Controls speed of the loader

    // GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Create a simple timeline for video transformation
    gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "+=100vh", // 100vh of scroll distance
        scrub: true,
        markers: true, // Show debug markers
      }
    })
    .to(video, {
      width: "90vw",         // Shrinks from full-screen to banner size
      height: "40vh",        // Match the banner height
      position: "fixed",     // Fix the position so it shrinks and stays
      top: "5vh",            // Position at top with margin
      left: "5vw",           // Center with margins
      ease: "power1.inOut"
    })
    .fromTo(textContainer, 
      { 
        opacity: 0,
        top: "50vh"  // Position below video banner
      }, 
      { 
        opacity: 1, 
        duration: 1 
      }, 
      "<" // Start at the same time as video animation
    );

    // Make sure video stays responsive
    video.style.width = "100%";
    video.style.height = "100%";

    // Handle resize - refresh ScrollTrigger
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      // Cleanup ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Custom cursor
  useEffect(() => {
    let mouseX = window.innerWidth / 2;
    let mouseY = -50; // Position cursor at top center but out of sight
    let trailX = window.innerWidth / 2;
    let trailY = -50; // Position trail at top center but out of sight

    const cursor = document.querySelector('.custom-cursor');
    const trail = document.querySelector('.cursor-trail');

    const updateCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animateCursor = () => {
      const diffX = mouseX - trailX;
      const diffY = mouseY - trailY;
      
      trailX += diffX * 0.1;
      trailY += diffY * 0.1;
      
      if (cursor && trail) {
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
      }
      
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', updateCursor);
    animateCursor();

    return () => {
      window.removeEventListener('mousemove', updateCursor);
    };
  }, []);

  return (
    <div className="App">
      {/* Loading Screen */}
      <div className="loader">
        <div className="percentage">0%</div>
      </div>

      {/* Video Element */}
      <video 
        id="hero-video" 
        autoplay 
        muted 
        loop 
        playsInline
        src="/video.mp4"
      />

      {/* Text Container */}
      <div className="text-container">
        <div className="text-content">
          <div className="text-group">
            <div className="text-body-left">Hi there,</div>
            <div className="text-title">I'M PRATIK</div>
            <div className="text-body-right">and I create digital experiences</div>
          </div>
        </div>
      </div>

      {/* Custom Cursor */}
      <div className="custom-cursor"></div>
      <div className="cursor-trail"></div>
    </div>
  );
}

export default App;
