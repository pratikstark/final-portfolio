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
  const containerRef = useRef(null);
  const scrollTriggersRef = useRef([]);

  useEffect(() => {
    // Check if component is inside an overlay - use setTimeout to ensure ref is set
    let isInOverlay = false;
    const checkOverlay = () => {
      isInOverlay = containerRef.current?.closest('.project-overlay') !== null || 
                    document.querySelector('.project-overlay') !== null;
    };
    
    // Check immediately and after a small delay
    checkOverlay();
    setTimeout(checkOverlay, 0);
    
    // Only kill all triggers if NOT in overlay (navigating to page directly)
    // When in overlay, we don't want to interfere with main page triggers
    if (!isInOverlay) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }

    // Only reset window scroll if NOT in overlay (i.e., navigating to page directly)
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

    // Store references to triggers we create so we can clean them up properly
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
        id: "prism-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      // Get the trigger using the id
      const trigger = ScrollTrigger.getById("prism-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `prism-image-trigger-${index}`;
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
        
        // Get the trigger using the id
        const trigger = ScrollTrigger.getById(triggerId);
        if (trigger) createdTriggers.push(trigger);
      }
    });

    // Store triggers for cleanup
    scrollTriggersRef.current = createdTriggers;

    return () => {
      // Only kill the triggers we created, not all triggers on the page
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
          <div className="hero-badge">Mini Project</div>
          <h1 className="hero-title">Prism</h1>
          <p className="hero-subtitle">
            A Figma plugin that builds perceptually balanced, sRGB-safe OKLCH color systems with real-time accessibility checks. Designers get cleaner palettes, and developers get synced variables across CSS, Tailwind, React and tokens.
          </p>
          <div className="hero-meta">
            <span className="meta-item">Figma Plugin</span>
            <span className="meta-item">Color Systems</span>
            <span className="meta-item">Design Tools</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <a 
              href="https://www.figma.com/community/plugin/1560632211514322267" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#111', textDecoration: 'underline', fontSize: '16px', fontFamily: 'var(--font-body)' }}
            >
              Click here to view the plugin on the Figma Marketplace
            </a>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <section className="content-section">
          <h2 className="section-title">The OKLCH Perfection</h2>
          <div className="section-content">
            <p className="body-base">
              For a long time, designers worked with color systems built for computers, not human eyes. RGB came from how monitors mix light, hex codes were just RGB in another format (#RRGGBB), and HSL arrived later as an attempt to make color more intuitive by organizing it into hue, saturation, and lightness. It felt like progress because you could finally adjust brightness/ lightness without completely changing a color's hue.
            </p>
            <p className="body-base">
              But HSL has a fundamental problem: its lightness value measures monitor output, not how bright something actually appears to your eye. Human vision doesn't work linearly. A color at 50% HSL lightness doesn't look halfway between black and white, it may look radically different in a colour like red (low luminosity) and yellow (high luminosity).
            </p>
            <p className="body-base">
              Let's say you create a red palette from 100 to 900 using HSL, spacing the lightness values evenly. Now do the same with yellow. If you convert both to grayscale, the red scale looks relatively balanced, but the yellow scale is a mess. Yellow 500 might look almost as bright as yellow 300, while yellow 700 and 800 are barely distinguishable.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Prism/Prism%20Image%201.png" alt="HSL Color Scale Comparison" className="project-image" />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              OKLCH solves this by organizing color around perception instead of physics. The L in OKLCH represents perceptual lightness, sometimes called luminosity, which measures how bright something appears to human vision. A value of 50 genuinely looks halfway between black and white. When you create a scale from 0 to 100 in OKLCH, every step appears equally distant regardless of which hue you're working with. Your reds, yellows, blues, and greens all have consistent visual spacing at the same lightness values.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Prism/Prism%20Image%202.png" alt="OKLCH Color Scale Comparison" className="project-image" />
        </div>

        <section className="content-section">
          <h2 className="section-title">The sRGB Compatibility Problem with OKLCH</h2>
          <div className="section-content">
            <p className="body-base">
              Here's where things get problematic. OKLCH can describe colors that don't exist in sRGB, the color space that's been the web standard since the 90s and still covers most displays. When you create a highly saturated color in OKLCH, there's a good chance it falls outside what an sRGB display can actually show.
            </p>
            <p className="body-base">
              OKLCH enthusiasts will tell you to embrace Display P3, the wider gamut that modern iPhones, MacBooks and some Adobe displays support, and they're not wrong because P3 colors can be genuinely stunning. But most of the web is still on sRGB, and when a P3 color gets displayed on an sRGB screen, browsers clip or desaturate it, so your vibrant blue might render as something completely different.
            </p>
            <p className="body-base">
              This made me wonder if there's a middle ground. What if you could get OKLCH's perceptual uniformity without gambling on display compatibility? That's what Prism does. Instead of generating colors across OKLCH's full range, I constrained it to the sRGB display boundaries and then divided that space using OKLCH's perceptual lightness scale. Every color Prism generates works on any display, but the spacing between tones is calculated for human perception.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Prism/Prism%20Image%203.png" alt="sRGB Compatibility Solution" className="project-image" />
        </div>

        <section className="content-section">
          <h2 className="section-title">Simple UI - For Designers, Coders and Project Managers</h2>
          <div className="section-content">
            <p className="body-base">
              I built Prism to feel straightforward. The first screen is just color selection where you pick your primary, secondary, and tertiary colors, and the plugin immediately generates complete scales plus a neutral palette subtly tinted with your primary. The second screen lets you fine-tune curves and settings if you want, but the defaults work well so you can skip it entirely. The third screen is export with every format you might need.
            </p>
            <p className="body-base">
              While you work, contrast ratios update in real time and Prism checks every color combination against WCAG 2.2 and APCA standards automatically. If a pairing fails accessibility requirements, you see it immediately with suggested alternatives, so there are no surprises during handoff or QA.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[3] = el}>
          <img src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Prism/Prism%20Image%204.png" alt="Prism UI Interface" className="project-image" />
        </div>

        <section className="content-section">
          <h2 className="section-title">Multi-format exports</h2>
          <div className="section-content">
            <p className="body-base">
              The typical workflow has designers maintaining colors in Figma while developers maintain a separate system in code, and they drift apart over time. Prism fixes this by exporting the same palette in formats for both. Designers get Figma Variables with semantic naming and automatic light/dark modes, plus a visual moodboard if you prefer seeing everything on canvas. Developers get CSS Variables, Tailwind configs, React theme objects, and W3C Design Tokens in JSON. Same colors, different formats, so everyone works from a single source of colours and the production colors match the designs exactly.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[4] = el}>
          <img src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Prism/Prism%20Image%205.png" alt="Multi-format Export Options" className="project-image" />
        </div>
      </main>

      <footer className="project-footer">
        <Link to="/" className="footer-link">← Back to Portfolio</Link>
      </footer>
    </div>
  );
};

export default AnimationLibraryProject;
