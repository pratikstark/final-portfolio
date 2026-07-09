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
  const containerRef = useRef(null);
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    let isInOverlay = false;
    const checkOverlay = () => {
      isInOverlay = containerRef.current?.closest('.project-overlay') !== null || 
                    document.querySelector('.project-overlay') !== null;
    };
    
    checkOverlay();
    setTimeout(checkOverlay, 0);
    
    if (!isInOverlay) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

    if (!isInOverlay) {
      requestAnimationFrame(() => {
        try {
          window.scrollTo(0, 0);
          if (document && document.documentElement) {
            try { document.documentElement.scrollTop = 0; } catch (e) {}
          }
          if (document && document.body) {
            try { document.body.scrollTop = 0; } catch (e) {}
          }
        } catch (e) {}
      });
    }

    const createdTriggers = [];

    if (heroRef.current) {
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }
      );
    }

    if (contentRef.current && contentRef.current.children) {
      const scrollTriggerConfig = {
        trigger: contentRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        id: "settlin-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      const trigger = ScrollTrigger.getById("settlin-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `settlin-image-trigger-${index}`;
        const scrollTriggerConfig = {
          trigger: img,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse",
          id: triggerId
        };
        
        const animation = gsap.fromTo(img,
          { opacity: 0, scale: 1.1, y: 50 },
          {
            opacity: 1, scale: 1, y: 0, duration: 1, ease: "power2.out",
            scrollTrigger: scrollTriggerConfig
          }
        );
        
        const trigger = ScrollTrigger.getById(triggerId);
        if (trigger) createdTriggers.push(trigger);
      }
    });

    scrollTriggersRef.current = createdTriggers;

    return () => {
      scrollTriggersRef.current.forEach(trigger => {
        if (trigger && trigger.kill) {
          trigger.kill();
        }
      });
      scrollTriggersRef.current = [];
    };
  }, []);

  return (
    <div className="project-page" ref={containerRef}>
      <nav className="project-nav">
        <Link to="/" className="nav-link">← Back to Portfolio</Link>
      </nav>

      <section className="project-hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-badge">Project</div>
          <h1 className="hero-title">Settlin</h1>
          <p className="hero-subtitle">
            I came to Settlin from a psychology background, joined as a UI/UX designer, and gradually grew into product work. It was my first time working inside a large, complicated system, and most of what I know about how products get built started here.
          </p>
          <div className="hero-meta">
            <span className="meta-item">UI/UX Design</span>
            <span className="meta-item">Product Design</span>
            <span className="meta-item">Systems Thinking</span>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <section className="content-section">
          <h2 className="section-title">Fixing the Preferences Flow</h2>
          <div className="section-content">
            <p className="body-base">
              One of my first projects was the preferences flow, which users were abandoning partway through. The original version spread the process across too many screens and asked people to do complex ranking before they understood why.
            </p>
            <p className="body-base">
              I restructured it into five focused steps: categories, selection, ranking, exclusions, and confirmation. I used progressive disclosure so each screen asked for one decision at a time. In our test runs, completion improved noticeably. The main change was reducing how much users had to hold in their head at any one point.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Settlin/Scene.png" 
            alt="Settlin Preferences Flow"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">Building a Design System</h2>
          <div className="section-content">
            <p className="body-base">
              Settlin didn't have a design system when I joined. Components were recreated for each feature, styles drifted between the consumer app, the internal dashboard, and the website, and developers ended up writing duplicate code.
            </p>
            <p className="body-base">
              I introduced an atomic design structure, starting with base tokens like color and type and building reusable components from them. I documented the library with usage guidelines so it would hold up after I left. It made feature work faster and kept all three products visually consistent.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Settlin/Screenshot%202025-12-08%20at%206.19.01%E2%80%AFPM.png" 
            alt="Settlin Design System"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">From Design Opinions to Data</h2>
          <div className="section-content">
            <p className="body-base">
              I set up Mixpanel so we could see completion rates, drop-offs, and feature usage instead of debating from intuition. It didn't make decisions for us, but it made disagreements easier to settle and helped us catch problems earlier.
            </p>
            <p className="body-base">
              My psychology background was useful here too. Small things like progress indicators, clearer state changes, and auto-collapsing accordions cut down on confusion and on support questions about where selections had gone.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Learning the Whole Stack</h2>
          <div className="section-content">
            <p className="body-base">
              I picked up Flutter and React mostly so I could plan honestly, because it is hard to scope work you don't understand. Over time I contributed commits to both the mobile app and the dashboard. When our Flutter lead left, I helped cover part of the gap. I sat in on the handover, picked up development tickets, and shipped screens while the team rebuilt capacity. I wasn't replacing an engineer, but understanding the stack made me more useful in planning and in conversations with the team.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Settlin/Scene-1.png" 
            alt="Settlin Development"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              I also ran a few internal workshops for the design team on front-end basics, design tokens, and the atomic design workflow. Handoffs got smoother afterwards. There were fewer back-and-forths about spacing and states, and more components went from design to build without needing a meeting.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Alignment, Documentation, and Storytelling</h2>
          <div className="section-content">
            <p className="body-base">
              A lot of the job was alignment. I met weekly with the CEO, CTO, and product managers, translating between business goals, technical constraints, and what users were actually doing. I wrote PRDs that turned vague direction into concrete plans.
            </p>
            <p className="body-base">
              I also designed the investor pitch deck and supporting marketing assets, which meant understanding the business well enough to explain it in a few slides.
            </p>
            <p className="body-base">
              I documented decisions as we went, which paid off whenever priorities shifted or someone left.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">What I Took Away</h2>
          <div className="section-content">
            <p className="body-base">
              The real value of Settlin was learning to connect disciplines. Psychology helped me understand users, design gave me a way to frame problems, code let me build and estimate honestly, and data told us whether any of it worked.
            </p>
            <p className="body-base">
              None of those skills mattered much in isolation. The useful part was moving between them.
            </p>
          </div>
        </section>
      </main>

      <footer className="project-footer">
        <Link to="/" className="footer-link">← Back to Portfolio</Link>
      </footer>
    </div>
  );
};

export default SettlinProject;
