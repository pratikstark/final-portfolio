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
        id: "conscious-living-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      const trigger = ScrollTrigger.getById("conscious-living-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `conscious-living-image-trigger-${index}`;
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
          <h1 className="hero-title">Conscious Living</h1>
          <p className="hero-subtitle">
          A full Shopify build that connected product storytelling with clear navigation, optimized checkout, and sustainable product presentation
          </p>
          <div className="hero-meta">
            <span className="meta-item">E-Commerce</span>
            <span className="meta-item">Shopify</span>
            <span className="meta-item">UX Design</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <a 
              href="https://consciousliving.store/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#111', textDecoration: 'underline', fontSize: '16px', fontFamily: 'var(--font-body)' }}
            >
              Click here to view the store
            </a>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <section className="content-section">
          <div className="section-content">
          <p className="body-base">
            During my time as part of the core team at Conscious Living Store, I took on the responsibility of building and launching their e-commerce platform using Shopify, working toward a mission that went far beyond simply selling products online. The company exists to accelerate the world's adoption of conscious, everyday products that exist in harmony with nature, but what made this particularly challenging and interesting was the need to make that transition feel completely seamless for customers.
            </p>
            <p className="body-base">
              I approached the project by setting up the Shopify store from the ground up, which meant starting with fundamental decisions about how the site would look and function. I configured all the essential e-commerce functionality that makes online shopping possible, including the product catalog system, the shopping cart experience, and the checkout process that would ultimately convert browsers into buyers. I carefully configured shipping and tax to comply with various regulations, profitability and logistics while keeping the customer experience straightforward.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/CL/Screenshot%202025-12-04%20at%207.42.33%E2%80%AFAM.png" 
            alt="Conscious Living Store"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">The Architecture</h2>
          <div className="section-content">
            <p className="body-base">
              The site required thoughtful planning to ensure that customers could easily browse and discover products without feeling overwhelmed or lost in a sea of options. I developed intuitive navigation menus and category structures that would guide visitors naturally through the product range, set up collection pages that organized products in logical groupings that made sense for how people actually shop, and implemented search and a custom chatbot so customers could quickly find specific items they had in mind.
            </p>
            <p className="body-base">
              Building out the product presentation framework meant creating templates that would showcase each item in the best possible light while providing all the information a conscious consumer might want before making a purchase. The product pages for items like the neem wood comb featured comprehensive image galleries, detailed descriptions and clear pricing, configured variant options for items that came in different styles with individual assets or included packaging choices. I also added sections dedicated to sustainability information including maintenance instructions, upcycling potential, and proper disposal methods. This is something that accelerated the company's vision beyond their metrics and product catalogue.
            </p>
            <p className="body-base">
              I extensively tested and optimized the mobile shopping experience, adjusted layouts specifically for tablet and desktop views to take advantage of larger screens, and verified that the checkout process remained fully functional regardless of what device someone was using. The product pages needed to maintain their visual impact. I also connected various technical integrations to enhance the site's functionality, bringing together necessary Shopify apps that added features beyond the platform's core capabilities, setting up analytics tracking so the team could understand customer behavior and make data-driven decisions, configuring domain settings and ensuring the site was professional and secure, and focusing on site security and performance optimization to build trust with users.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/CL/Screenshot%202025-12-08%20at%2012.44.45%E2%80%AFAM.png" 
            alt="Conscious Living Architecture"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">Aesthetics vs. Functionality balance</h2>
          <div className="section-content">
            <p className="body-base">
              Throughout the project, I encountered meaningful challenges that pushed my problem-solving abilities and deepened my understanding of e-commerce development. Balancing aesthetic appeal with functionality became a constant consideration, as I wanted the site to feel beautiful and aligned with sustainable values without sacrificing the intuitive, accessible e-commerce features that make shopping online feel effortless. The warm, natural photography and earth-toned color palette needed to work alongside complementary calls-to-action and functional elements like quantity selectors and variant dropdowns.
            </p>
            <p className="body-base">
              The outcome of all this work was the successful launch of a functional, user-friendly e-commerce platform that enables Conscious Living Store to sell their products online and genuinely reach customers who are interested in sustainable living but might not know where to start. The clean, minimalist design with its focus on natural materials and honest product photography created an authentic brand experience that differentiated the store from conventional retailers while maintaining all the functionality customers expect from modern e-commerce.
            </p>
            <p className="body-base">
              The project strengthened my understanding of e-commerce platform architecture and best practices in ways that only hands-on experience can provide, taught me about the technical requirements of online retail including payment processing, inventory management, and order fulfillment that all need to work together seamlessly, deepened my appreciation for user experience considerations that are specific to online shopping and differ from other types of web experiences, and gave me practical knowledge of Shopify's ecosystem and capabilities that I can now apply to future projects.
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

export default AIChatProject;
