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
        id: "jarvis-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      const trigger = ScrollTrigger.getById("jarvis-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `jarvis-image-trigger-${index}`;
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
          <h1 className="hero-title">JARVIS</h1>
          <p className="hero-subtitle">
          A fully local AI assistant built with Whisper, Ollama, Piper and n8n running inside a Docker stack. It handles voice, automation, and system actions entirely on-device for total privacy and customisation.
          </p>
          <div className="hero-meta">
            <span className="meta-item">AI Assistant</span>
            <span className="meta-item">Self-Hosted</span>
            <span className="meta-item">Privacy-Focused</span>
          </div>
          <div style={{ marginTop: '24px' }}>
            <a 
              href="https://github.com/pratikstark/jarvis-ai-agent" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#111', textDecoration: 'underline', fontSize: '16px', fontFamily: 'var(--font-body)' }}
            >
              Click here to view the project on GitHub
            </a>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              Everyone knows by now that context drives AI quality. ChatGPT's memory features and user context layers prove that more background information yields better outputs. The equation is simple: regardless of which model or parameters you're running, richer context produces more useful results.
            </p>
            <p className="body-base">
              But context has two fundamental problems. First, privacy. I don't want my entire digital life - files, personal data, browser history or half-formed ideas stored on someone else's infrastructure. Second, depth and variety. Real personalization isn't just a feature but it's patterns, contradictions, the specific texture of how you think and work. Building that through prompts or memory APIs is expensive in tokens and always incomplete.
            </p>
            <p className="body-base">
              The technology for JARVIS-level AI assistants already exists. We're not waiting on better models but for better architecture. So as a non-commercial experiment and a tribute to what digital assistants should be, I built exactly what I wanted, which is a British digital butler with complete system access that processes everything locally. Your data never leaves your machine. The AI knows everything because it lives where your information already lives. Here's how I built this open source non commercial project.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">The Architecture</h2>
          <div className="section-content">
            <p className="body-base">
              The system runs as a Docker Compose stack with seven interconnected services, each handling a specific part of the assistant's functionality:
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/JARVIS/Screenshot%202025-12-06%20at%203.37.47%E2%80%AFPM.png" 
            alt="JARVIS Architecture Diagram"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              <strong>Whisper</strong> handles speech-to-text conversion, listening to voice input and transcribing it into text that the system can process. It's the first step in the pipeline, running on port 5004.
            </p>
            <p className="body-base">
              <strong>Ollama</strong> serves as the local LLM server on port 11434. This is the reasoning engine that is running Qwen but it can run any model locally, which means no cloud dependency and better privacy.
            </p>
            <p className="body-base">
              <strong>Piper</strong> takes care of text-to-speech on port 5002, converting the assistant's responses back into spoken audio.
            </p>
            <p className="body-base">
              The interesting part is how actions get executed. Audio input goes to a webhook that feeds into <strong>n8n</strong>, an automation engine running on port 5678. This is where the system becomes truly customizable—n8n acts as the coordination layer, allowing you to build workflows that connect the LLM's decisions to actual actions.
            </p>
            <p className="body-base">
              <strong>Home Assistant</strong> provides the smart home integration, enabling voice commands to control lights, routines, and other connected devices.
            </p>
            <p className="body-base">
              An <strong>MCP server</strong> (Model Context Protocol) runs on port 5003, exposing tools and capabilities to the LLM - essentially giving it hands to interact with the rest of my system.
            </p>
            <p className="body-base">
              Finally, an <strong>nginx frontend</strong> on port 8080 serves up the visual interface modelled after JARVIS.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">How It Works</h2>
          <div className="section-content">
            <p className="body-base">
              The flow is straightforward: you speak into a microphone, Whisper transcribes your words, the local LLM processes the request, n8n orchestrates the appropriate action (whether that's controlling a smart device through Home Assistant, executing code via MCP, or fetching information), and Piper speaks the response back to you. All of this happens locally, on your own hardware.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/JARVIS/Screenshot%202025-12-06%20at%203.41.50%E2%80%AFPM.png" 
            alt="JARVIS Workflow"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              The webhook-to-n8n approach is particularly customisable. Instead of hardcoding actions, you can visually design workflows in n8n's interface. Want your assistant to check your calendar, cross-reference the weather, and suggest what to wear? You can visually build that workflow.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">The Bigger Picture</h2>
          <div className="section-content">
            <p className="body-base">
              What's refreshing about this project is that it's genuinely modular. Each component can be swapped out or upgraded independently. If you don't like Qwen, you can switch to a different LLM. If you have a better GPU, use a better text to speech. The Docker containerization keeps everything clean and portable.
            </p>
            <p className="body-base">
              It's not trying to be Alexa or Google Assistant. It's a system you control completely, that runs on your hardware, and that you can modify to fit exactly how you work and live. The data stays local. The logic is transparent. The customization is limited only by what you can build in n8n.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[2] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Mini%20Project%20Assets/JARVIS/Screenshot%202025-12-06%20at%203.42.10%E2%80%AFPM.png" 
            alt="JARVIS Interface"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              There's room to grow, of course. Adding memory so the assistant remembers context across conversations, making the UI reactive to system events, building in proactive suggestions based on learned routines and these would all push the system further. But as a foundation, this is version one. It's the kind of project that proves you don't need cloud services and proprietary platforms to build something genuinely useful and private.
            </p>
            <p className="body-base">
              For anyone interested in personal AI, privacy-focused computing, or home automation, this architecture offers a closed loop system. It's not about recreating Tony Stark's AI from the movies but about building something practical that actually assists you without intervention and allowing access to a dozen third party cloud based services.
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

export default DataVizProject;
