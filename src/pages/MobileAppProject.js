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
        id: "bloom-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      const trigger = ScrollTrigger.getById("bloom-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `bloom-image-trigger-${index}`;
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
          <div className="hero-badge">Mini Project</div>
          <h1 className="hero-title">Bloom Bakehouse</h1>
          <p className="hero-subtitle">
            Somewhere around 2018, every bakery started looking the same. A peachy palette and a serif font that was very standardised. Instagram turned bakeries into content studios that sold bread. The aesthetic worked until it was popularised. When everything signals premium through identical visual language, it loses it's essence.
          </p>
          <div className="hero-meta">
            <span className="meta-item">Branding</span>
            <span className="meta-item">Packaging Design</span>
            <span className="meta-item">Tier-3 Market</span>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              I watched this saturation happen in real-time across tier 1 cities like Mumbai, Bangalore, Delhi. By 2023, you could walk into any modern bakery in a tier-1 city, and know exactly what you'd see: pastel walls, marble counters and a specific shade of dusty rose on the packaging. The design had become a boring monotonous template.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">The Colour Palette</h2>
          <div className="section-content">
            <p className="body-base">
              My client wanted a bakery brand for a tier-3 city. They wanted to start a sourdough and cheesecake selling business in Jharkhand. Tier-3 cities have an interesting relationship with city aesthetics and they're simultaneously attracted to and skeptical of them. Copy the tier-1 playbook too well and you're the overpriced outsider. However, go too rustic or traditional, and you've failed to justify why your sourdough costs three times than that of a regular local bread. The design needed to balance the tension between these two extremes.
            </p>
            <p className="body-base">
              Every point of saturation carries cultural meaning, and in 2024, pastel based bakery branding was too common. I chose deep forest green as the primary color because it suggests seriousness with hospitality. Green in food contexts triggers associations with freshness, natural ingredients, and plants. It's the color of things that grow slowly and require patience. It was perfect for sourdough and for the nativity of the origin of the bakery. The mustard yellow is the Platonic ideal of baked goods as it associates with crust, butter, yolk, the Maillard reaction.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Bloom/iPad%20Pro%2012.9_%20-%202.png" 
            alt="Bloom Color Palette"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              Beige and blush functioned as the negative space. But these weren't pastels, rather they were stone colors, the palette of flour, linen and paper bags. This was intended to be materials that funnelled the crust and the freshness.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Branding with Recall</h2>
          <div className="section-content">
            <p className="body-base">
              Most bakeries use wheat symbols or generic minimalism. Neither creates recognition or meaning. I chose the sunflower because it does several things at once. It feels warm, looks handcrafted without feeling amateur, and it connects naturally to ideas of nourishment. It is also unique enough to work as a standalone mark, which is important in tier-3 markets where visual clutter is extremely high and memory recall is everything.
            </p>
            <p className="body-base">
              The identity gives customers permission to pay higher prices because it communicates quality without feeling exclusive. A good sourdough at a higher price feels fair when the design reflects the care behind the product. The same bread in generic packaging feels overpriced. The brand helps the business justify value honestly.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Bloom/iPad%20Pro%2012.9_%20-%204.png" 
            alt="Bloom Branding"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              I avoided the pastel, ultra-minimal bakery trend because it does not translate well outside large cities. It is expensive to execute, depends on a certain kind of visual literacy, and often feels copied rather than contextual. Bloom feels contemporary, but it also feels stable enough to last. This is important in tier-3 India where loyalty comes from repeat visits and word of mouth, not from aesthetic trends alone.
            </p>
            <p className="body-base">
              The packaging follows the same thinking. A kraft paper bag with two-color printing keeps production costs low but still feels intentional. Green for the logo, yellow for the sunflower, and the natural texture of kraft paper send a clear message. The brand is approachable, economical, environmentally aware, functionally efficient.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/Bloom/iPad%20Pro%2012.9_%20-%203.png" 
            alt="Bloom Packaging"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              Bloom's system can thus be capsuled as one clear icon with meaningful symbolism, a color framework tied to real product categories, packaging that complements genuine constraints, and design choices that are intentional at every level. It works because it is created for the context it lives in and not for design trends online.
            </p>
            <p className="body-base">
              Bloom isn't trying to be the best bakery brand in a tier-3 city. It is trying to invite curious customers in a category that doesn't exist and give the business a visual platform that can grow with it.
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

export default MobileAppProject;
