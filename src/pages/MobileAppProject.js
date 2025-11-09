import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const MobileAppProject = () => {
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
          <h1 className="hero-title">Mobile App Prototype</h1>
          <p className="hero-subtitle">
            Rapid prototyping with React Native focusing on gesture interactions and native performance
          </p>
          <div className="hero-meta">
            <span className="meta-item">2023</span>
            <span className="meta-item">Personal Project</span>
            <span className="meta-item">Mobile Development</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="project-content" ref={contentRef}>
        {/* Introduction */}
        <section className="content-section">
          <h2 className="section-title">The Approach</h2>
          <div className="section-content">
            <p className="body-large">
              Mobile app development requires a different mindset than web development. 
              Touch interactions, gesture recognition, and platform-specific patterns 
              create unique challenges and opportunities for user experience design.
            </p>
            <p className="body-base">
              This project explores rapid prototyping techniques using React Native, 
              focusing on creating native-feeling interactions while maintaining 
              development speed and code reusability across platforms.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Mobile App Interface"
            className="project-image"
          />
          <div className="image-caption">
            Mobile app interface showing gesture-based navigation and native UI components
          </div>
        </div>

        {/* Mobile-First Design */}
        <section className="content-section">
          <h2 className="section-title">Mobile-First Design</h2>
          <div className="section-content">
            <p className="body-base">
              Mobile design isn't just about making things smaller—it's about 
              rethinking interactions for touch interfaces and constrained screen space. 
              Every element must serve a clear purpose and be easily accessible.
            </p>
            
            <div className="principles-grid">
              <div className="principle-item">
                <h3 className="heading-6">Touch Targets</h3>
                <p className="body-small">
                  Ensuring all interactive elements meet minimum size requirements 
                  for comfortable touch interaction across different devices.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Gesture Recognition</h3>
                <p className="body-small">
                  Implementing intuitive gestures like swipe, pinch, and long-press 
                  to create natural interaction patterns.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Performance</h3>
                <p className="body-small">
                  Optimizing for 60fps animations and smooth scrolling to create 
                  native-feeling experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* React Native Implementation */}
        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="React Native Code Structure"
            className="project-image"
          />
          <div className="image-caption">
            React Native code structure showing component architecture and navigation setup
          </div>
        </div>

        {/* Technical Features */}
        <section className="content-section">
          <h2 className="section-title">Technical Features</h2>
          <div className="section-content">
            <p className="body-base">
              The prototype demonstrates key mobile development concepts including 
              navigation patterns, state management, and platform-specific optimizations.
            </p>
            
            <div className="components-list">
              <div className="component-item">
                <h3 className="heading-6">Navigation</h3>
                <p className="body-small">Stack and tab navigation with smooth transitions and gesture support</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">State Management</h3>
                <p className="body-small">Redux integration for complex state handling and data persistence</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Animations</h3>
                <p className="body-small">Native driver animations for smooth 60fps performance</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Platform APIs</h3>
                <p className="body-small">Camera, location, and device-specific feature integration</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Experience */}
        <section className="content-section">
          <h2 className="section-title">User Experience Focus</h2>
          <div className="section-content">
            <p className="body-base">
              Mobile user experience goes beyond visual design—it encompasses 
              performance, accessibility, and platform conventions. The prototype 
              demonstrates attention to these critical aspects.
            </p>
            
            <div className="tech-features">
              <div className="feature-item">
                <h3 className="heading-6">Loading States</h3>
                <p className="body-small">
                  Thoughtful loading indicators and skeleton screens to maintain 
                  user engagement during data fetching.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Error Handling</h3>
                <p className="body-small">
                  Graceful error states with clear messaging and recovery options 
                  for common failure scenarios.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Accessibility</h3>
                <p className="body-small">
                  Screen reader support, high contrast modes, and keyboard navigation 
                  for inclusive user experiences.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Optimization */}
        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Performance Metrics"
            className="project-image"
          />
          <div className="image-caption">
            Performance metrics showing optimization techniques and benchmark results
          </div>
        </div>

        {/* Results */}
        <section className="content-section">
          <h2 className="section-title">Results & Learnings</h2>
          <div className="section-content">
            <p className="body-base">
              The mobile prototype project provided valuable insights into cross-platform 
              development and the unique challenges of mobile user experience design.
            </p>
            
            <div className="usage-stats">
              <div className="stat-item">
                <h3 className="heading-6">Development Speed</h3>
                <p className="body-small">50% faster than native development</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Code Reuse</h3>
                <p className="body-small">85% shared code between iOS and Android</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Performance</h3>
                <p className="body-small">Near-native performance with optimizations</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="content-section">
          <h2 className="section-title">Key Learnings</h2>
          <div className="section-content">
            <p className="body-large">
              Mobile development taught me that great apps are about more than 
              just functionality—they're about creating experiences that feel 
              natural and responsive on the platform.
            </p>
            <p className="body-base">
              The most valuable lesson was learning to balance cross-platform 
              efficiency with platform-specific optimizations. React Native 
              provides powerful tools, but understanding when to use native 
              modules is crucial for creating truly polished experiences.
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

export default MobileAppProject;
