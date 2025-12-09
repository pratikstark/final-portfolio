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
        id: "cognixa-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      const trigger = ScrollTrigger.getById("cognixa-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `cognixa-image-trigger-${index}`;
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
          <h1 className="hero-title">Cognixa</h1>
          <p className="hero-subtitle">
            India's mental health market is projected to reach over USD 60 billion (₹5 lakh crore+) by 2032, growing at around 28% annually as awareness, insurance coverage and digital access expand. Within this, India's online mental health market is expected to grow from about USD 133 million (≈₹1,100 crore) in 2024 to roughly USD 450 million (≈₹3,700 crore) by 2033, driven by teletherapy, apps and AI‑enabled tools. Globally and in India, clinicians report high burnout linked to workload and administrative burden, reinforcing the need for tools that streamline therapist workflows rather than adding to their cognitive load.
          </p>
          <div className="hero-meta">
            <span className="meta-item">AI SaaS</span>
            <span className="meta-item">Mental Health</span>
            <span className="meta-item">Product Design</span>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Cognixa/Screenshot%202025-12-08%20at%202.33.58%E2%80%AFAM.png" 
            alt="Cognixa Market Context"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              It was not just about market size, but about the therapists behind those numbers. Many quietly add extra hours of documentation and coordination so they do not have to rush clients in session. Others have walked away from practice‑management software that felt more like monitoring and box‑ticking than genuine support for their clinical judgment.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Understanding the Problem</h2>
          <div className="section-content">
            <p className="body-base">
              I spent three months embedded in the therapeutic community before building anything. This was ethnographic research, not self validation. I was looking for new insights. Additionally, being a psychologist myself helped.
            </p>
            <p className="body-base">
              <strong>The research</strong>
            </p>
            <ul className="body-base" style={{ paddingLeft: '1.5em', marginTop: '0.5em' }}>
              <li>Interviewed 47 therapists across different modalities (CBT, DBT, psychodynamic, somatic)</li>
              <li>Analyzed existing practice management systems</li>
              <li>Surveyed mental health professionals about technology pain points</li>
            </ul>
            <p className="body-base">
              Therapists spent 2.3 hours daily on documentation. 68% reported administrative burden as their primary source of burnout. The deeper insight was emotional: they weren't frustrated by time loss. They had a problem with the emotional availability that paperwork stole.
            </p>
            <p className="body-base">
              Additionally, Therapists feared software would reduce therapy to data points. This was philosophical resistance to reductionism, not technophobia. Therapists also wanted adaptive tools but were horrified by client data being used for model training. HIPAA compliance was baseline. They needed guarantees that their clients' most vulnerable moments wouldn't become training data.
            </p>
            <p className="body-base">
              Many worry AI notes optimisation would make notes formulaic. "My notes are part of the therapeutic process. They're how I hold my clients in mind between sessions."
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Design as System Architecture</h2>
          <div className="section-content">
            <p className="body-base">
              The problem: how do you build AI aided software that enhances human judgment without replacing it?
            </p>
            <p className="body-base">
              The answer was selective automation. Instead of automating entire workflows, I identified micro-moments where AI could eliminate friction without inserting itself into the therapeutic process.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Cognixa/Screenshot%202025-12-08%20at%202.34.15%E2%80%AFAM.png" 
            alt="Cognixa Design System"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              The system offers gentle prompts based on therapeutic modality rather than generating full notes. It takes into account the modality the user prefers. Many Psychologists use varying formats of session notes. Most of them were added and there is also additional customisation to include and accept all modalities of treatment.
            </p>
            <p className="body-base">
              <strong>Zero-knowledge architecture:</strong>
            </p>
            <ul className="body-base" style={{ paddingLeft: '1.5em', marginTop: '0.5em' }}>
              <li>Session data encrypted at rest with keys controlled solely by the practitioner</li>
              <li>Automatic data expiration aligned with professional retention requirements (7 years)</li>
              <li>Session echo recalls previous themes without storing raw conversation data.</li>
            </ul>
            <p className="body-base">
              <strong>Interface Design:</strong> The interface needed to comply with the emotional weight of therapy. Peachy soft and warmer colours, high border radii, softer font triumphed. Dynamic background with a micro jiggle interaction warm the interface during evening documentation sessions.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Technical Implementation</h2>
          <div className="section-content">
            <p className="body-base">
              <strong>The stack:</strong>
            </p>
            <ul className="body-base" style={{ paddingLeft: '1.5em', marginTop: '0.5em' }}>
              <li>Frontend: React</li>
              <li>Backend: Node</li>
              <li>AI: Fine-tuned LLaMA Chain of Thought model fine-tuned on Ethically sourced Psychology Session Data.</li>
              <li>Database: PostgreSQL with row-level security for practice isolation</li>
            </ul>
            <p className="body-base">
              If the model can't do everything, design workflows where it only handles what adds value.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Iteration Through Feedback</h2>
          <div className="section-content">
            <p className="body-base">
              Every two weeks, I conducted feedback sessions with beta testing group users to understand evolving needs.
            </p>
            <p className="body-base">
              <strong>Key pivots:</strong>
            </p>
            <p className="body-base">
              <strong>September 2025:</strong> Completed the first pilot version and added 42 beta users to test. Conducted research and anticipated features.
            </p>
            <p className="body-base">
              <strong>October 2025:</strong> Learned and added AI features to help research, transcribe, support and experimentally handle internal webhooks to control user's data.
            </p>
            <p className="body-base">
              <strong>November 2025:</strong> Added organisational features so that any team of psychologists can also share clients, supervise and generate reports within the app
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Cognixa/Screenshot%202025-12-08%20at%202.34.41%E2%80%AFAM.png" 
            alt="Cognixa Iteration"
            className="project-image"
            loading="lazy"
            decoding="async"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">What building this taught me:</h2>
          <div className="section-content">
            <p className="body-base">
              Budget limitations meant achieving product-market fit before scaling. But with ethical product thinking, it was possible. Every privacy-preserving decision, every respectful interface choice, every transparent communication multiplied. Therapists don't just use tools they trust. They recommend them.
            </p>
            <p className="body-base">
              <strong>Domain expertise as advantage:</strong> My psychology background shaped every design decision. Competitors can copy features but not the understanding of therapeutic process. Speaking both technology and therapy creates sustainable differentiation.
            </p>
            <p className="body-base">
              <strong>Systems over features:</strong> The design system isn't separate from the product. Privacy architecture isn't a feature layer. Interface psychology isn't just visual. Everything is interconnected. Change one element and you understand how it affects the entire product.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">To Conclude,</h2>
          <div className="section-content">
            <p className="body-base">
              Building Cognixa taught me that product development is systems thinking. The best product decisions feel like therapeutic interventions. You listen more than you speak. You understand context before proposing solutions and you respect autonomy while offering support.
            </p>
            <p className="body-base">
              Success for Cognixa isn't measured in ARR alone. It's measured in therapy hours returned to actual therapy. It's also measured in therapists who would no longer dread documentation and in clients who receive more present, less burned-out healthcare.
            </p>
            <p className="body-base">
              That's not solely product thinking, but systems thinking applied to human problems.
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

export default CognixaProject;
