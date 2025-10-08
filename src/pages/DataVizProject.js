import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const DataVizProject = () => {
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
          <div className="hero-badge">Mini Project</div>
          <h1 className="hero-title">Data Visualization Tool</h1>
          <p className="hero-subtitle">
            Interactive charts for complex datasets with real-time filtering and dynamic updates
          </p>
          <div className="hero-meta">
            <span className="meta-item">2023</span>
            <span className="meta-item">Personal Project</span>
            <span className="meta-item">Data Visualization</span>
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
              Data visualization is about more than just making charts—it's about 
              making complex information accessible and actionable. This project 
              explores how interactive visualizations can transform raw data 
              into meaningful insights.
            </p>
            <p className="body-base">
              I wanted to create a tool that could handle large datasets while 
              maintaining smooth performance and providing intuitive ways for 
              users to explore and understand their data.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Data Visualization Dashboard"
            className="project-image"
          />
          <div className="image-caption">
            Interactive dashboard showing multiple chart types and real-time data filtering
          </div>
        </div>

        {/* Design Principles */}
        <section className="content-section">
          <h2 className="section-title">Design Principles</h2>
          <div className="section-content">
            <p className="body-base">
              Effective data visualization requires careful consideration of 
              color, typography, spacing, and interaction patterns. Each 
              design decision impacts how users interpret and interact with the data.
            </p>
            
            <div className="principles-grid">
              <div className="principle-item">
                <h3 className="heading-6">Clarity First</h3>
                <p className="body-small">
                  Prioritizing clear communication over visual complexity, 
                  ensuring data insights are immediately understandable.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Progressive Disclosure</h3>
                <p className="body-small">
                  Revealing information in layers, allowing users to drill 
                  down from high-level overviews to detailed analysis.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Responsive Design</h3>
                <p className="body-small">
                  Adapting visualizations to different screen sizes while 
                  maintaining readability and functionality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80" 
            alt="Chart Implementation Code"
            className="project-image"
          />
          <div className="image-caption">
            Code implementation showing chart configuration and data binding
          </div>
        </div>

        {/* Chart Types */}
        <section className="content-section">
          <h2 className="section-title">Chart Types & Features</h2>
          <div className="section-content">
            <p className="body-base">
              The tool supports multiple chart types, each optimized for 
              different data patterns and use cases. Interactive features 
              allow users to explore data dynamically.
            </p>
            
            <div className="components-list">
              <div className="component-item">
                <h3 className="heading-6">Line Charts</h3>
                <p className="body-small">Time-series data with zoom and pan functionality for detailed analysis</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Bar Charts</h3>
                <p className="body-small">Comparative data with sorting and filtering capabilities</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Scatter Plots</h3>
                <p className="body-small">Correlation analysis with interactive point selection and tooltips</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Heat Maps</h3>
                <p className="body-small">Matrix data visualization with color-coded intensity mapping</p>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Optimization */}
        <section className="content-section">
          <h2 className="section-title">Performance Optimization</h2>
          <div className="section-content">
            <p className="body-base">
              Handling large datasets requires careful optimization to maintain 
              smooth performance. The tool implements several techniques to ensure 
              responsive interactions even with thousands of data points.
            </p>
            
            <div className="tech-features">
              <div className="feature-item">
                <h3 className="heading-6">Data Virtualization</h3>
                <p className="body-small">
                  Rendering only visible data points to maintain performance 
                  with large datasets while preserving visual accuracy.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Canvas Rendering</h3>
                <p className="body-small">
                  Using HTML5 Canvas for high-performance chart rendering 
                  with smooth animations and interactions.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Lazy Loading</h3>
                <p className="body-small">
                  Loading chart components and data on-demand to reduce 
                  initial page load time and memory usage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Features */}
        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80" 
            alt="Interactive Chart Features"
            className="project-image"
          />
          <div className="image-caption">
            Interactive features including filtering, zooming, and real-time updates
          </div>
        </div>

        {/* Results */}
        <section className="content-section">
          <h2 className="section-title">Impact & Usage</h2>
          <div className="section-content">
            <p className="body-base">
              The data visualization tool has been used across multiple projects, 
              significantly improving how I present and analyze data. It's become 
              an essential part of my toolkit for data-driven decision making.
            </p>
            
            <div className="usage-stats">
              <div className="stat-item">
                <h3 className="heading-6">Performance</h3>
                <p className="body-small">Handles 10,000+ data points smoothly</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Accessibility</h3>
                <p className="body-small">WCAG 2.1 AA compliant visualizations</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Flexibility</h3>
                <p className="body-small">Supports multiple data formats and sources</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="content-section">
          <h2 className="section-title">Key Learnings</h2>
          <div className="section-content">
            <p className="body-large">
              This project taught me that great data visualization is about 
              balancing technical performance with user experience. The most 
              beautiful chart is useless if it doesn't help users understand their data.
            </p>
            <p className="body-base">
              The most valuable lesson was learning to think like a data analyst 
              while designing like a user experience professional. Every design 
              decision must serve the dual purpose of being both technically 
              sound and humanly understandable.
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

export default DataVizProject;
