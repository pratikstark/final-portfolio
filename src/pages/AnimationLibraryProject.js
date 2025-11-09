import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const AnimationLibraryProject = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    // Clean up any existing ScrollTriggers first
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    // Reset scroll position with proper null checks and timing
    requestAnimationFrame(() => {
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
        // Ignore scroll reset errors
      }
    });

    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.2, 
          ease: "power2.out" 
        }
      );
    }

    // Content animation
    if (contentRef.current && contentRef.current.children) {
      gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: contentRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Image entrance animations
    imagesRef.current.forEach((img, index) => {
      if (img) {
        gsap.fromTo(img,
          { opacity: 0, scale: 1.1, y: 50 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: img,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="project-page">
      {/* Navigation */}
      <nav className="project-nav">
        <Link to="/" className="nav-link">
          ← Back to Portfolio
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="project-hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-badge">Mini Project</div>
          <h1 className="hero-title">Quick Study: Animation Library</h1>
          <p className="hero-subtitle">
            Exploring motion design principles through code and creating reusable animation components
          </p>
          <div className="hero-meta">
            <span className="meta-item">2023</span>
            <span className="meta-item">Personal Project</span>
            <span className="meta-item">Motion Design</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="project-content" ref={contentRef}>
        {/* Introduction */}
        <section className="content-section">
          <h2 className="section-title">The Inspiration</h2>
          <div className="section-content">
            <p className="body-large">
              Motion design has always fascinated me. The way a well-crafted animation 
              can guide attention, provide feedback, and create emotional connections 
              with users is truly powerful.
            </p>
            <p className="body-base">
              This project started as a way to understand the principles behind 
              great motion design and evolved into a comprehensive library of 
              reusable animation components that I use across my projects.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80" 
            alt="Animation Library Interface"
            className="project-image"
          />
          <div className="image-caption">
            The animation library interface showing various motion components and their configurations
          </div>
        </div>

        {/* Motion Principles */}
        <section className="content-section">
          <h2 className="section-title">Motion Design Principles</h2>
          <div className="section-content">
            <p className="body-base">
              I studied the fundamental principles of motion design, focusing on 
              how timing, easing, and choreography can create meaningful user 
              experiences. Each animation in the library is built with these 
              principles in mind.
            </p>
            
            <div className="principles-grid">
              <div className="principle-item">
                <h3 className="heading-6">Timing & Duration</h3>
                <p className="body-small">
                  Understanding how duration affects perception and creating 
                  consistent timing scales across different interactions.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Easing Functions</h3>
                <p className="body-small">
                  Exploring different easing curves to create natural, 
                  physics-based motion that feels organic and responsive.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Choreography</h3>
                <p className="body-small">
                  Coordinating multiple elements to create cohesive 
                  animations that guide user attention effectively.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Code Examples */}
        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Animation Code Examples"
            className="project-image"
          />
          <div className="image-caption">
            Code examples showing the implementation of various animation components
          </div>
        </div>

        {/* Technical Implementation */}
        <section className="content-section">
          <h2 className="section-title">Technical Implementation</h2>
          <div className="section-content">
            <p className="body-base">
              The library is built using modern web technologies with performance 
              in mind. Each component is optimized for smooth 60fps animations 
              across different devices and browsers.
            </p>
            
            <div className="tech-features">
              <div className="feature-item">
                <h3 className="heading-6">GSAP Integration</h3>
                <p className="body-small">
                  Leveraging GSAP's powerful animation engine for smooth, 
                  performant animations with advanced easing and timeline controls.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">React Components</h3>
                <p className="body-small">
                  Creating reusable React components that can be easily 
                  integrated into any project with customizable props.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Performance Optimization</h3>
                <p className="body-small">
                  Using transform and opacity properties for hardware-accelerated 
                  animations and implementing proper cleanup to prevent memory leaks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Animation Showcase */}
        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Animation Showcase"
            className="project-image"
          />
          <div className="image-caption">
            Interactive showcase demonstrating various animation components in action
          </div>
        </div>

        {/* Library Components */}
        <section className="content-section">
          <h2 className="section-title">Library Components</h2>
          <div className="section-content">
            <p className="body-base">
              The library includes a comprehensive set of animation components 
              covering common UI patterns and interactions. Each component is 
              documented with examples and customization options.
            </p>
            
            <div className="components-list">
              <div className="component-item">
                <h3 className="heading-6">Fade Animations</h3>
                <p className="body-small">Smooth opacity transitions for content reveals and state changes</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Slide Animations</h3>
                <p className="body-small">Directional movement animations for navigation and content transitions</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Scale Animations</h3>
                <p className="body-small">Size-based animations for buttons, cards, and interactive elements</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Stagger Animations</h3>
                <p className="body-small">Sequential animations for lists, grids, and grouped content</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="content-section">
          <h2 className="section-title">Impact & Usage</h2>
          <div className="section-content">
            <p className="body-base">
              The animation library has become an essential tool in my development 
              workflow, significantly improving the quality and consistency of 
              animations across all my projects.
            </p>
            
            <div className="usage-stats">
              <div className="stat-item">
                <h3 className="heading-6">Development Speed</h3>
                <p className="body-small">70% faster animation implementation</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Consistency</h3>
                <p className="body-small">Unified animation language across projects</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Performance</h3>
                <p className="body-small">60fps animations on all target devices</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="content-section">
          <h2 className="section-title">Key Learnings</h2>
          <div className="section-content">
            <p className="body-large">
              This project deepened my understanding of motion design and its 
              impact on user experience. It taught me that great animations 
              aren't just decorative—they're functional tools that enhance usability.
            </p>
            <p className="body-base">
              The most valuable lesson was learning to balance creativity with 
              performance. Every animation decision must consider both the 
              emotional impact and the technical constraints of the platform. 
              This library represents that balance—beautiful, functional, and performant.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="project-footer">
        <Link to="/" className="footer-link">
          ← Back to Portfolio
        </Link>
      </footer>
    </div>
  );
};

export default AnimationLibraryProject;
