import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const AIChatProject = () => {
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
          <h1 className="hero-title">AI Chat Interface</h1>
          <p className="hero-subtitle">
            Conversational UI experiments exploring the intersection of AI and human-centered design
          </p>
          <div className="hero-meta">
            <span className="meta-item">2023</span>
            <span className="meta-item">Personal Project</span>
            <span className="meta-item">AI/UX Design</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="project-content" ref={contentRef}>
        {/* Introduction */}
        <section className="content-section">
          <h2 className="section-title">The Exploration</h2>
          <div className="section-content">
            <p className="body-large">
              AI chat interfaces represent a new frontier in user experience design. 
              Unlike traditional interfaces with predictable interactions, AI conversations 
              require designing for uncertainty, context, and natural language understanding.
            </p>
            <p className="body-base">
              This project explores how to create intuitive, helpful, and trustworthy 
              AI interfaces that feel natural while maintaining user control and transparency 
              about the AI's capabilities and limitations.
            </p>
          </div>
        </section>

        {/* Hero Image */}
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="AI Chat Interface"
            className="project-image"
          />
          <div className="image-caption">
            Conversational interface showing natural language interaction and contextual responses
          </div>
        </div>

        {/* Design Principles */}
        <section className="content-section">
          <h2 className="section-title">Design Principles</h2>
          <div className="section-content">
            <p className="body-base">
              AI interfaces require a different set of design principles than traditional 
              applications. The focus shifts from task completion to conversation flow, 
              from predictability to adaptability.
            </p>
            
            <div className="principles-grid">
              <div className="principle-item">
                <h3 className="heading-6">Transparency</h3>
                <p className="body-small">
                  Making AI capabilities and limitations clear to users, 
                  including when the AI is uncertain or needs clarification.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Control</h3>
                <p className="body-small">
                  Giving users control over the conversation flow, 
                  allowing them to redirect, clarify, or stop interactions.
                </p>
              </div>
              <div className="principle-item">
                <h3 className="heading-6">Context Awareness</h3>
                <p className="body-small">
                  Designing interfaces that understand and respond to 
                  conversation context and user intent.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Conversation Design */}
        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="Conversation Flow Design"
            className="project-image"
          />
          <div className="image-caption">
            Conversation flow diagrams showing different interaction patterns and user paths
          </div>
        </div>

        {/* Interface Components */}
        <section className="content-section">
          <h2 className="section-title">Interface Components</h2>
          <div className="section-content">
            <p className="body-base">
              Building effective AI chat interfaces requires specialized components 
              that handle the unique aspects of conversational interaction, including 
              typing indicators, message states, and contextual suggestions.
            </p>
            
            <div className="components-list">
              <div className="component-item">
                <h3 className="heading-6">Message Bubbles</h3>
                <p className="body-small">Distinct visual treatment for user and AI messages with proper spacing and alignment</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Typing Indicators</h3>
                <p className="body-small">Animated indicators showing when the AI is processing or generating responses</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Quick Actions</h3>
                <p className="body-small">Contextual buttons and suggestions to help users navigate conversations</p>
              </div>
              <div className="component-item">
                <h3 className="heading-6">Error States</h3>
                <p className="body-small">Graceful handling of AI errors with clear messaging and recovery options</p>
              </div>
            </div>
          </div>
        </section>

        {/* User Experience Patterns */}
        <section className="content-section">
          <h2 className="section-title">User Experience Patterns</h2>
          <div className="section-content">
            <p className="body-base">
              AI chat interfaces introduce new UX patterns that don't exist in 
              traditional applications. Understanding these patterns is crucial 
              for creating intuitive conversational experiences.
            </p>
            
            <div className="tech-features">
              <div className="feature-item">
                <h3 className="heading-6">Progressive Disclosure</h3>
                <p className="body-small">
                  Revealing AI capabilities gradually as users become more 
                  comfortable with the interface and conversation flow.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Contextual Help</h3>
                <p className="body-small">
                  Providing help and suggestions based on conversation context 
                  and user behavior patterns.
                </p>
              </div>
              <div className="feature-item">
                <h3 className="heading-6">Fallback Strategies</h3>
                <p className="body-small">
                  Designing graceful fallbacks when AI can't understand or 
                  respond appropriately to user input.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Implementation */}
        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80" 
            alt="AI Integration Architecture"
            className="project-image"
          />
          <div className="image-caption">
            Technical architecture showing AI integration and real-time communication setup
          </div>
        </div>

        {/* Results */}
        <section className="content-section">
          <h2 className="section-title">Results & Insights</h2>
          <div className="section-content">
            <p className="body-base">
              The AI chat interface project provided valuable insights into the 
              unique challenges and opportunities of conversational AI design. 
              It revealed the importance of balancing AI capabilities with user expectations.
            </p>
            
            <div className="usage-stats">
              <div className="stat-item">
                <h3 className="heading-6">User Trust</h3>
                <p className="body-small">85% user confidence in AI responses</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Engagement</h3>
                <p className="body-small">3x longer session duration vs traditional UI</p>
              </div>
              <div className="stat-item">
                <h3 className="heading-6">Satisfaction</h3>
                <p className="body-small">4.6/5 user satisfaction rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* Conclusion */}
        <section className="content-section">
          <h2 className="section-title">Key Learnings</h2>
          <div className="section-content">
            <p className="body-large">
              Designing AI interfaces taught me that the future of UX lies in 
              creating experiences that feel natural and human while leveraging 
              the power of artificial intelligence.
            </p>
            <p className="body-base">
              The most valuable lesson was learning to design for uncertainty. 
              Unlike traditional interfaces with predictable outcomes, AI interfaces 
              require designing for multiple possible responses and graceful 
              handling of unexpected situations. This project reinforced my belief 
              that great design is about creating trust and clarity in complex systems.
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

export default AIChatProject;
