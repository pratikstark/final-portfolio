import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollSmoother);

function App() {
  const loaderRef = useRef(null);
  const textContainerRef = useRef(null);
  const hiThereRef = useRef(null);
  const nameRef = useRef(null);
  const taglineRef = useRef(null);
  const aboutIntroRef = useRef(null);
  const aboutTitleRef = useRef(null);

  // Initialize GSAP Smooth Scroll with living effects
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.2, // Reduced smooth value for better responsiveness
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // Simplified screen entrance - no excessive 3D effects
    gsap.utils.toArray(".screen-container").forEach((section, index) => {
      gsap.fromTo(section, 
        { 
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            scrub: 1,
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Remove floating animation - text should be stable
    // gsap.utils.toArray(".text-title, .text-body-left, .text-body-right").forEach((text, index) => {
    //   gsap.to(text, {
    //     y: "+=10",
    //     duration: 2 + index * 0.5,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //     scrollTrigger: {
    //       trigger: text,
    //       start: "top 90%",
    //       end: "bottom 10%",
    //       scrub: false,
    //       toggleActions: "play none none reverse"
    //     }
    //   });
    // });

    // Remove parallax effect to prevent scaling issues
    // gsap.utils.toArray(".project-thumbnail").forEach((thumb, index) => {
    //   gsap.to(thumb, {
    //     y: "-=50",
    //     rotationY: 5,
    //     duration: 1,
    //     ease: "power2.out",
    //     scrollTrigger: {
    //       trigger: thumb,
    //       start: "top 80%",
    //       end: "bottom 20%",
    //       scrub: 1,
    //       toggleActions: "play none none reverse"
    //     }
    //   });
    // });

    // Remove breathing effect to prevent shrinking
    // gsap.utils.toArray(".project-item").forEach((project, index) => {
    //   gsap.to(project, {
    //     scale: 1.02,
    //     duration: 2,
    //     ease: "sine.inOut",
    //     yoyo: true,
    //     repeat: -1,
    //     scrollTrigger: {
    //       trigger: project,
    //       start: "top 50%",
    //       end: "bottom 50%",
    //       scrub: false,
    //       toggleActions: "play none none reverse"
    //     }
    //   });
    // });

    // Simplified about title animation - no excessive 3D effects
    gsap.utils.toArray(".about-title .title-line").forEach((line, index) => {
      gsap.fromTo(line, 
        { 
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "bottom 15%",
            scrub: 1,
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Remove magnetic hover effects - projects shouldn't have hover animation
    // gsap.utils.toArray(".project-thumbnail").forEach((thumb) => {
    //   thumb.addEventListener("mouseenter", () => {
    //     gsap.to(thumb, {
    //       scale: 1.05,
    //       rotationY: 10,
    //       duration: 0.3,
    //       ease: "power2.out"
    //     });
    //   });
    //   
    //   thumb.addEventListener("mouseleave", () => {
    //     gsap.to(thumb, {
    //       scale: 1,
    //       rotationY: 0,
    //       duration: 0.3,
    //       ease: "power2.out"
    //     });
    //   });
    // });

    return () => {
      smoother.kill();
    };
  }, []);

  useEffect(() => {
    const loader = loaderRef.current;
    const textContainer = textContainerRef.current;
    const hiThere = hiThereRef.current;
    const name = nameRef.current;
    const tagline = taglineRef.current;

    // Prevent scrolling during loading
    document.body.style.overflow = 'hidden';

    // Set initial full-screen state
    gsap.set(loader, { 
      scaleX: 0, 
      transformOrigin: "left center",
      width: '100vw',
      height: '100vh',
      top: 0,
      left: 0,
      position: 'fixed'
    });
    gsap.set([hiThere, name, tagline], { opacity: 0, y: 30 });

    // Create counting number element positioned exactly like the title
    const counterElement = document.createElement('div');
    counterElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: var(--text-xxl);
      font-weight: var(--font-weight-bold);
      color: #f5f5f0;
      font-family: var(--font-family);
      letter-spacing: var(--letter-spacing-wide);
      line-height: var(--line-height-tight);
      z-index: 3;
      text-align: center;
      white-space: nowrap;
    `;
    counterElement.textContent = '0%';
    document.body.appendChild(counterElement);

    // Create timeline
    const tl = gsap.timeline();

    // Animate loader from left to right with ease-in (2 seconds - faster)
    tl.to(loader, {
      scaleX: 1,
      duration: 2,
      ease: "power1.in"
    })
    // Animate counter from 0% to 100%
    .to(counterElement, {
      innerHTML: 100,
      duration: 2,
      ease: "power1.in",
      snap: { innerHTML: 1 },
      onUpdate: function() {
        const value = Math.round(this.targets()[0].innerHTML);
        counterElement.textContent = value + '%';
      }
    }, 0) // Start at the same time as loader
    // Keep counter at 100% for a moment, then hide it
    .to(counterElement, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    }, 2.5)
    // Shrink loader to final position - only top portion of screen
    .to(loader, {
      width: '100%',
      height: '45%',
      top: 0,
      left: 0,
      position: 'absolute',
      duration: 1,
      ease: "power2.out"
    })
    // Re-enable scrolling
    .call(() => {
      document.body.style.overflow = 'auto';
    })
    .to([hiThere, name, tagline], {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power2.out"
    }, 3.5); // Start text animation after loader shrinks

    return () => {
      if (counterElement.parentNode) {
        counterElement.parentNode.removeChild(counterElement);
      }
      document.body.style.overflow = 'auto';
    };
  }, []);

  // About section animations
  useEffect(() => {
    const aboutIntro = aboutIntroRef.current;
    const aboutTitle = aboutTitleRef.current;

    if (aboutIntro && aboutTitle) {
      // Set initial states
      gsap.set(aboutIntro, { opacity: 0, y: 30 });
      gsap.set(aboutTitle, { opacity: 0, y: 30 });

      // Create timeline for about section
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: aboutIntro,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

      // Animate intro text
      aboutTl.to(aboutIntro, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      })
      // Animate title with scramble effect
      .to(aboutTitle, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
      // Scramble text effect for each line
      .to(aboutTitle.querySelector('.title-line:nth-child(1)'), {
        text: "PSYCHOLOGY",
        duration: 1.2,
        ease: "power2.out",
        scrambleText: {
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          speed: 0.3
        }
      }, "-=0.2")
      .to(aboutTitle.querySelector('.title-line:nth-child(2)'), {
        text: "DESIGN &",
        duration: 1.2,
        ease: "power2.out",
        scrambleText: {
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ&",
          speed: 0.3
        }
      }, "-=0.8")
      .to(aboutTitle.querySelector('.title-line:nth-child(3)'), {
        text: "CODE",
        duration: 1.2,
        ease: "power2.out",
        scrambleText: {
          chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          speed: 0.3
        }
      }, "-=0.8")
      // Fallback: if scrambleText doesn't work, use regular text animation
      .to(aboutTitle.querySelectorAll('.title-line'), {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.7)",
        stagger: 0.2
      }, "-=0.5");
    }
  }, []);


  // Simple cursor hiding
  useEffect(() => {
    // Simple cursor hide function
    const hideCursor = () => {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
    };

    // Initial hide
    hideCursor();

    // Hide cursor on mouse move (throttled)
    let timeoutId;
    const handleMouseMove = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideCursor, 16); // ~60fps
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  // Custom cursor effect
  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    // Create custom cursor (minimal dot)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // Create trail circle
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Immediate cursor movement
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    };

    // Animation loop for trail
    const animateTrail = () => {
      // Slight delay for trail
      trailX += (mouseX - trailX) * 0.3;
      trailY += (mouseY - trailY) * 0.3;
      
      trail.style.left = trailX + 'px';
      trail.style.top = trailY + 'px';

      requestAnimationFrame(animateTrail);
    };

    // Start trail animation
    animateTrail();

    // Add event listener
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (cursor.parentNode) {
        cursor.parentNode.removeChild(cursor);
      }
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content" className="app">
        {/* First Screen - Loader */}
        <div className="screen-container">
        <div className="banner-container">
          <div className="red-banner" ref={loaderRef}></div>
        </div>
        
        <div className="text-container" ref={textContainerRef}>
          <div className="text-content">
            <div className="text-group">
              <div className="text-body-left" ref={hiThereRef}>
                Hi there,
              </div>
              <div className="text-title" ref={nameRef}>
                I'M PRATIK
              </div>
              <div className="text-body-right" ref={taglineRef}>
                and I create digital experiences
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Screen - About */}
      <div className="screen-container about-screen">
        <div className="about-header">
          <div className="about-intro" ref={aboutIntroRef}>
            Operating at the intersection of
          </div>
          <div className="about-title" ref={aboutTitleRef}>
            <div className="title-line">PSYCHOLOGY</div>
            <div className="title-line">DESIGN &</div>
            <div className="title-line">CODE</div>
          </div>
        </div>
        
        <div className="about-content">
          <div className="about-left">
            I take full ownership of my work—from initial problem identification to final implementation. Whether I'm debugging code at 2 AM or redesigning a flow for the fifth time, I'm driven by creating products that genuinely improve how people work and think.
          </div>
          <div className="about-right">
            <strong>What I bring:</strong> Deep problem-solving, cross-functional execution, and the rare ability to think simultaneously as a user, designer, developer, and business owner.
          </div>
        </div>
      </div>

      
      </div>
    </div>
  );
}

export default App;
