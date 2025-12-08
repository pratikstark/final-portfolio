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
            The path from psychology to product management isn't linear, but it makes sense. At Settlin, I learned that good product decisions happen where human understanding, systems thinking, and data meet. What started as UI/UX design became something deeper: understanding how products actually function. This was my first exposure to a vast complicated system.
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
              When I joined Settlin, the preferences flow was a mess. Users were abandoning it because the original designer had created too many screens with complex ranking systems. Completion rates sat at 34%, and the business couldn't work with those numbers.
            </p>
            <p className="body-base">
              I used cognitive load theory to fix it. Working memory handles 7±2 pieces of information at once, so I restructured everything into 5 focused screens: preference categories, selection, ranking, exclusions, and confirmation. Progressive disclosure meant showing information when needed, not all at once. Completion rates stabilized at 71% over the next mock tests. The flow worked with how people think, not against it.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Settlin/Scene.png" 
            alt="Settlin Preferences Flow"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">Building Systems That Scale</h2>
          <div className="section-content">
            <p className="body-base">
              Settlin had no design system. Every button looked different. Border radii changed randomly. Shadows appeared wherever. This cost us 3-4 extra days per feature because designers recreated components and developers wrote duplicate code.
            </p>
            <p className="body-base">
              I implemented Atomic Design: start with basic elements (colors, fonts, buttons), combine them into components, build from there. We had three products (consumer app, internal dashboard, website) and the design system meant one change updated everything. Feature development time dropped massively. I documented 247 components with usage guidelines so the system would survive without me. Good infrastructure gets out of the way and lets people build.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Settlin/Screenshot%202025-12-08%20at%206.19.01%E2%80%AFPM.png" 
            alt="Settlin Design System"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">From Design Opinions to Data</h2>
          <div className="section-content">
            <p className="body-base">
              Design without data is just guessing. I set up Mixpanel to track completion rates, drop-offs, feature usage, and time-on-task across all user flows. The data revealed what intuition can't and allowed us to make better, more informed decisions.
            </p>
            <p className="body-base">
              I also applied psychology beyond aesthetics. Progress bars leverage the goal gradient effect, and adding them increases completion rates. Auto-collapsing accordions satisfy our need for closure and reduced support tickets about "where did my selections go". These aren't design trends, they're behavioral principles that work because they match how cognition functions.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Learning the Whole Stack</h2>
          <div className="section-content">
            <p className="body-base">
              I learned Flutter and React to stop being a liability in planning. When you understand implementation, you make better decisions. You estimate honestly, design within constraints, communicate clearly with engineers. I pushed multiple commits to the mobile app and to the dashboard over 8 months. When our Flutter lead left, I sat for sprints, took KT and picked up development work and shipped major screens to keep momentum. The best product decisions happen when you understand the whole stack.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Settlin/Scene-1.png" 
            alt="Settlin Development"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              I ran workshops teaching designers about front-end development, design tokens, and atomic design workflows. Knowledge hoarding feels like job security but limits your career. The people who advance make everyone around them better. After the workshops, design-to-development handoff time dropped to same-day implementation for the majority of components.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Alignment, Documentation, and Storytelling</h2>
          <div className="section-content">
            <p className="body-base">
              Product work is making sure everyone builds the same thing. I met with the CEO, CTO, and product managers weekly, translating between business needs, technical constraints, and user reality. I wrote multiple PRDs over 9 months that turned vague strategy into actual plans.
            </p>
            <p className="body-base">
              I also designed the pitch deck and supporting graphic marketing assets. This meant understanding the business deeply enough to visualize it. Creating investor materials teaches you which metrics actually matter and how to connect product decisions to business outcomes. The deck went through multiple revisions, and designing it forced clarity about what we were actually building and why it mattered.
            </p>
            <p className="body-base">
              Good documentation is security. When people leave or priorities shift, you don't lose context. Your decisions outlive your memory of creating them.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">What Actually Matters</h2>
          <div className="section-content">
            <p className="body-base">
              The real takeaway was learning to connect the dots. Psychology helped me understand users. Design framed the problems. Tech let me build solutions. Data checked if they worked. Product thinking tied it all to real outcomes.
            </p>
            <p className="body-base">
              Every piece compounded: the design system sped up features and cut bugs. Analytics made decisions hypothesis-driven. Documentation saved time later. Workshops paid off as the team used what they learned.
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
