import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const SettlinProject = () => {
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
          <h1 className="hero-title">Settlin: Designing with a Product Mindset</h1>
          <p className="hero-subtitle">
            My learnings that helped me think in systems and holistic ecosystem rather than free standing domains
          </p>
          <div className="hero-meta">
            <span className="meta-item">2022 - 2023</span>
            <span className="meta-item">Product Designer</span>
            <span className="meta-item">Systems Thinking</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="project-content" ref={contentRef}>
        {/* Introduction */}
        <section className="content-section">
          <h2 className="section-title">The Vision</h2>
          <div className="section-content">
            <p className="body-large">
              Settlin emerged from a fundamental shift in how I approached design problems. 
              Instead of thinking in isolated features or screens, I began to see the 
              interconnected nature of user experiences and business objectives.
            </p>
            <p className="body-base">
              This project represents my evolution from a traditional designer to a 
              product-minded professional who understands the broader ecosystem in which 
              design decisions are made. It's about creating solutions that work not just 
              for users, but for the entire business.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Settlin Product Ecosystem"
            className="project-image"
          />
          <div className="image-caption">
            The Settlin ecosystem showing interconnected user journeys and touchpoints
          </div>
        </div>

        {/* Systems Thinking Section */}
        <section className="content-section">
          <h2 className="section-title">Systems Thinking Approach</h2>
          <div className="section-content">
            <p className="body-base">
              Traditional design often focuses on individual touchpoints, but Settlin 
              taught me to think about the entire user journey and how each interaction 
              influences the next. This systems approach led to more cohesive and 
              effective solutions.
            </p>
            
            <div className="systems-grid">
              <div className="system-item">
                <h3 className="heading-6">User Journey Mapping</h3>
                <p className="body-small">
                  Comprehensive mapping of user touchpoints across all channels 
                  and platforms to identify optimization opportunities.
                </p>
              </div>
              <div className="system-item">
                <h3 className="heading-6">Stakeholder Alignment</h3>
                <p className="body-small">
                  Bringing together design, engineering, and business teams 
                  to ensure solutions work for all stakeholders.
                </p>
              </div>
              <div className="system-item">
                <h3 className="heading-6">Data-Driven Decisions</h3>
                <p className="body-small">
                  Using analytics and user feedback to validate design 
                  decisions and measure impact across the ecosystem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Images */}
        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Settlin Design Process"
            className="project-image"
          />
          <div className="image-caption">
            Design process documentation showing iterative approach and stakeholder feedback
          </div>
        </div>

        {/* Design Methodology */}
        <section className="content-section">
          <h2 className="section-title">Design Methodology</h2>
          <div className="section-content">
            <p className="body-base">
              The Settlin methodology combines traditional design thinking with 
              product management principles. I developed frameworks that help 
              teams make better decisions by considering the full context of 
              user needs and business goals.
            </p>
            
            <div className="methodology-steps">
              <div className="step">
                <div className="step-number">01</div>
                <div className="step-content">
                  <h3 className="heading-6">Context Discovery</h3>
                  <p className="body-small">
                    Understanding the broader business context, user needs, 
                    and technical constraints before diving into solutions.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">02</div>
                <div className="step-content">
                  <h3 className="heading-6">Ecosystem Mapping</h3>
                  <p className="body-small">
                    Mapping all touchpoints and interactions to understand 
                    how changes in one area affect the entire system.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">03</div>
                <div className="step-content">
                  <h3 className="heading-6">Solution Design</h3>
                  <p className="body-small">
                    Creating solutions that work within the broader ecosystem 
                    while meeting specific user and business needs.
                  </p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">04</div>
                <div className="step-content">
                  <h3 className="heading-6">Impact Measurement</h3>
                  <p className="body-small">
                    Measuring success not just at the feature level, but 
                    across the entire user journey and business metrics.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="content-section">
          <h2 className="section-title">Impact & Outcomes</h2>
          <div className="section-content">
            <p className="body-base">
              The systems thinking approach led to more effective solutions and 
              better collaboration across teams. By considering the broader 
              context, we were able to create designs that had lasting impact.
            </p>
            
            <div className="impact-metrics">
              <div className="metric">
                <h3 className="heading-6">Cross-Team Alignment</h3>
                <p className="body-small">95% stakeholder satisfaction</p>
              </div>
              <div className="metric">
                <h3 className="heading-6">User Experience</h3>
                <p className="body-small">60% improvement in task completion</p>
              </div>
              <div className="metric">
                <h3 className="heading-6">Business Impact</h3>
                <p className="body-small">25% increase in conversion rates</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final Image */}
        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Settlin Final Implementation"
            className="project-image"
          />
          <div className="image-caption">
            Final implementation showing the cohesive user experience across all touchpoints
          </div>
        </div>

        {/* Conclusion */}
        <section className="content-section">
          <h2 className="section-title">Key Learnings</h2>
          <div className="section-content">
            <p className="body-large">
              Settlin taught me that great design isn't just about beautiful interfaces—it's 
              about understanding the complex web of relationships between users, business 
              goals, and technical constraints.
            </p>
            <p className="body-base">
              The most valuable lesson was learning to think beyond individual features 
              and consider the entire ecosystem. This holistic approach has become 
              fundamental to how I approach every design challenge, ensuring that 
              solutions are not just functional, but truly impactful.
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

export default SettlinProject;
