import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const CognixaProject = () => {
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const imagesRef = useRef([]);

  useEffect(() => {
    // Hero section animation
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1.2, 
        ease: "power2.out" 
      }
    );

    // Content animation
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
          <div className="hero-badge">Main Project</div>
          <h1 className="hero-title">Cognixa: Building Alone, Building User-First</h1>
          <p className="hero-subtitle">
            From Psychology to Product, A UX first approach into Systems Thinking and Data-Driven Decision Making
          </p>
          <div className="hero-meta">
            <span className="meta-item">2023 - Present</span>
            <span className="meta-item">Solo Founder</span>
            <span className="meta-item">Product Design</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="project-content" ref={contentRef}>
        {/* Introduction */}
        <section className="content-section">
          <h2 className="section-title">The Challenge</h2>
          <div className="section-content">
            <p className="body-large">
              Building a product from scratch as a solo founder presents unique challenges. 
              Without the luxury of dedicated teams for each discipline, I had to wear multiple hats 
              while maintaining a user-first approach throughout the development process.
            </p>
            <p className="body-base">
              Cognixa emerged from my background in psychology and my passion for creating 
              digital experiences that genuinely improve how people work and think. The challenge 
              wasn't just technical—it was about maintaining design integrity while scaling 
              functionality and ensuring every decision was backed by user insights.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Cognixa Dashboard Overview"
            className="project-image"
          />
          <div className="image-caption">
            The Cognixa dashboard interface showing data visualization and user workflow
          </div>
        </div>

        {/* Process Section */}
        <section className="content-section">
          <h2 className="section-title">Design Process</h2>
          <div className="section-content">
            <p className="body-base">
              My approach combines psychological principles with modern design methodologies. 
              I start with user research to understand pain points, then iterate rapidly 
              through prototypes while maintaining a systems-thinking mindset.
            </p>
            
            <div className="process-grid">
              <div className="process-item">
                <h3 className="heading-6">Research</h3>
                <p className="body-small">
                  Deep user interviews and behavioral analysis to understand 
                  the underlying motivations and pain points.
                </p>
              </div>
              <div className="process-item">
                <h3 className="heading-6">Prototyping</h3>
                <p className="body-small">
                  Rapid iteration through low-fidelity prototypes, testing 
                  assumptions and refining the user experience.
                </p>
              </div>
              <div className="process-item">
                <h3 className="heading-6">Validation</h3>
                <p className="body-small">
                  Continuous user testing and data analysis to ensure 
                  design decisions are backed by real user behavior.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Images */}
        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80" 
            alt="Cognixa Analytics Interface"
            className="project-image"
          />
          <div className="image-caption">
            Advanced analytics interface with real-time data visualization
          </div>
        </div>

        {/* Technical Implementation */}
        <section className="content-section">
          <h2 className="section-title">Technical Implementation</h2>
          <div className="section-content">
            <p className="body-base">
              Building Cognixa required a deep understanding of both frontend and backend 
              technologies. I focused on creating a scalable architecture that could grow 
              with user needs while maintaining performance and reliability.
            </p>
            
            <div className="tech-stack">
              <div className="tech-category">
                <h3 className="heading-6">Frontend</h3>
                <p className="body-small">React, TypeScript, GSAP, Tailwind CSS</p>
              </div>
              <div className="tech-category">
                <h3 className="heading-6">Backend</h3>
                <p className="body-small">Node.js, Express, PostgreSQL, Redis</p>
              </div>
              <div className="tech-category">
                <h3 className="heading-6">Infrastructure</h3>
                <p className="body-small">AWS, Docker, CI/CD Pipeline</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="content-section">
          <h2 className="section-title">Results & Learnings</h2>
          <div className="section-content">
            <p className="body-base">
              Building Cognixa taught me the importance of balancing user needs with 
              technical constraints. As a solo founder, I learned to prioritize features 
              that provide the most value while maintaining code quality and user experience.
            </p>
            
            <div className="results-grid">
              <div className="result-item">
                <h3 className="heading-6">User Engagement</h3>
                <p className="body-small">40% increase in daily active users</p>
              </div>
              <div className="result-item">
                <h3 className="heading-6">Performance</h3>
                <p className="body-small">Sub-200ms page load times</p>
              </div>
              <div className="result-item">
                <h3 className="heading-6">Satisfaction</h3>
                <p className="body-small">4.8/5 user satisfaction rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Image */}
        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Cognixa Mobile Interface"
            className="project-image"
          />
          <div className="image-caption">
            Mobile-first design ensuring accessibility across all devices
          </div>
        </div>

        {/* Conclusion */}
        <section className="content-section">
          <h2 className="section-title">Conclusion</h2>
          <div className="section-content">
            <p className="body-large">
              Cognixa represents more than just a product—it's a testament to the power 
              of user-centered design and the importance of understanding both the 
              technical and human aspects of product development.
            </p>
            <p className="body-base">
              The journey of building Cognixa solo has reinforced my belief that great 
              products come from deep user understanding, thoughtful design, and 
              relentless iteration. It's taught me that being a solo founder doesn't 
              mean compromising on quality—it means being more intentional about 
              every decision.
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

export default CognixaProject;
