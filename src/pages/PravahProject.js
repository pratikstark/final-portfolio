import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import './ProjectPage.css';

gsap.registerPlugin(ScrollTrigger);

const PravahProject = () => {
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
        id: "pravah-content-trigger"
      };
      
      const animation = gsap.fromTo(contentRef.current.children,
        { opacity: 0, y: 30 },
        { 
          opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out",
          scrollTrigger: scrollTriggerConfig
        }
      );
      
      const trigger = ScrollTrigger.getById("pravah-content-trigger");
      if (trigger) createdTriggers.push(trigger);
    }

    imagesRef.current.forEach((img, index) => {
      if (img) {
        const triggerId = `pravah-image-trigger-${index}`;
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
          <h1 className="hero-title">Pravah</h1>
          <p className="hero-subtitle">
            Pravah is a health AI app currently in development that tackles a problem most nutrition apps ignore: food waste. The goal isn't just tracking what you eat. It's understanding what you need, buying exactly that, and using it before it spoils. Optimizing nutrition while minimizing waste in the context of how people actually live.
          </p>
          <div className="hero-meta">
            <span className="meta-item">AI Health App</span>
            <span className="meta-item">Product Design</span>
            <span className="meta-item">In Development</span>
          </div>
        </div>
      </section>

      <main className="project-content" ref={contentRef}>
        <section className="content-section">
          <h2 className="section-title">The Problem</h2>
          <div className="section-content">
            <p className="body-base">
              Most nutrition apps fall into two camps. Either they're calorie counters that make you feel guilty, or they're meal planners that generate shopping lists you'll never follow. Both miss the connection between planning, shopping, and cooking. You buy ingredients for a recipe, use some part of it, and the rest rots in your fridge.
            </p>
            <p className="body-base">
              I conducted informal interviews with people about their meal planning habits over two weeks. 85% of them said they waste food regularly. Most of them said they buy groceries without a clear plan. The pattern was that people need a system that connects preferences, nutrition goals, shopping, and actual cooking in one flow.
            </p>
            <p className="body-base">
              The insight was that food waste isn't a shopping problem or a planning problem. It's a systems problem.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Design Principles</h2>
          <div className="section-content">
            <p className="body-base">
              The app learns what you like and how you cook instead of pushing generic meal plans. It figures out your constraints like time, budget, dietary stuff and works around them.
            </p>
            <p className="body-base">
              Shopping lists show exact amounts. You're not buying 2kg of paneer when you actually need 400g. The system looks at what you already have, what's expiring soon, and plans meals to use ingredients multiple times. Spinach on Monday means another spinach dish on Wednesday.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[0] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Pravah/Pravah%201.png" 
            alt="Pravah Design Principles"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <div className="section-content">
            <p className="body-base">
              Logging shouldn't feel like filling out forms. Quick buttons on the home screen, smart defaults, visual confirmation. No spreadsheet vibes.
            </p>
            <p className="body-base">
              I went with muted colors instead of the usual bright, aggressive stuff nutrition apps use. Green for logged meals, yellow for prepped, soft red for things that need attention. The dashboard rings feel like progress bars, not judgment meters.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">The Interface</h2>
          <div className="section-content">
            <p className="body-base">
              <strong>Dashboard:</strong> Home screen shows your health score in a ring with four segments—calories, protein, fat, carbs. Each segment fills up as you hit your targets. Below that, today's meals with status buttons. Breakfast shows "Log" in green, lunch shows "Prepped" in yellow, snack shows "Prepare" in red. You see everything without scrolling.
            </p>
            <p className="body-base">
              <strong>Meals:</strong> Week view with a date picker at the top. Each day shows your planned meals with their prep status. Same color coding—green, yellow, red. There's a "Regenerate New Plan" button if you want the AI to suggest something different. Below that, your grocery list with exact quantities. Paneer 500gm, Eggs 10pcs, Onions 1kg. The preferences section at the bottom lets you set dietary restrictions like "Vegetarian - Strictly."
            </p>
            <p className="body-base">
              <strong>Workout:</strong> Separate screen tracking exercise. Week's insights show calories burned and workouts completed in ring format. Upcoming workouts are cards with illustrations—"Upper Body" stretching with a continue button, "Shoulders" strength training with a start button. Completed workouts listed below with calorie counts. Different feature set but same visual language.
            </p>
            <p className="body-base">
              The whole thing runs on consistent states. Green always means done. Yellow means ready. Red means do this now. You don't relearn the interface on each screen.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">How It Connects</h2>
          <div className="section-content">
            <p className="body-base">
              Your preferences feed the meal planner. Meal plans generate shopping lists. Shopping lists track pantry items. Pantry inventory influences what the AI suggests next. When you log meals, it marks ingredients as used and updates your nutrition rings.
            </p>
            <p className="body-base">
              It's a closed loop. The more you use it, the better it gets at understanding your patterns. Meal prep on Sundays? It learns. Quick meals on weekdays? It adapts. Hate cilantro? Never shows up again.
            </p>
            <p className="body-base">
              The design backs this up. Those color states work across every screen. You build a mental model once and it applies everywhere.
            </p>
          </div>
        </section>

        <div className="image-container" ref={el => imagesRef.current[1] = el}>
          <img 
            src="https://cdn.pratiksinghal.in/Projects%20Aseets/Pravah/Pravah%202.png" 
            alt="Pravah Interface"
            className="project-image"
          />
        </div>

        <section className="content-section">
          <h2 className="section-title">Why This Matters</h2>
          <div className="section-content">
            <p className="body-base">
              The average household wastes 10-30% of the food they buy. That's money down the drain, environmental damage, and guilt every time you throw out wilted spinach. People want to eat better and waste less, but current apps make it too complicated.
            </p>
            <p className="body-base">
              Pravah simplifies it. Tell it what you like. It plans your meals. You buy exactly what's needed. You cook and log. That's it. The AI does the hard work of balancing nutrition, using ingredients efficiently, and respecting what you actually want to eat.
            </p>
            <p className="body-base">
              The interface makes this feel easy. You don't see the AI working. You just get meal suggestions that make sense, shopping lists that don't waste money, and nutrition progress that happens without thinking about it.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">What I Learned</h2>
          <div className="section-content">
            <p className="body-base">
              Making something feel simple means solving complicated problems where users can't see them. The grocery quantity feature alone needed logic for ingredient yields, recipe scaling, and how stuff is actually packaged in stores. Users just see "200gm Paneer" but that number represents a lot of backend thinking.
            </p>
            <p className="body-base">
              I could've built separate tools for meal planning, grocery shopping, and nutrition tracking. Instead I built one system where everything connects. That integration is what makes Pravah different. It's not three features sitting next to each other. It's one thing that works together.
            </p>
          </div>
        </section>

        <section className="content-section">
          <h2 className="section-title">Next Steps</h2>
          <div className="section-content">
            <p className="body-base">
              What I'm working on now:
            </p>
            <ul className="body-base" style={{ paddingLeft: '1.5em', marginTop: '0.5em' }}>
              <li>Making the AI suggest more variety so you're not eating the same ingredients all week</li>
              <li>Adding recipe instructions for when you're actually cooking</li>
              <li>Smart notifications—reminders to meal prep, warnings when something's about to expire</li>
              <li>Social features so people can share meal plans</li>
              <li>Support for households, not just individuals</li>
            </ul>
            <p className="body-base">
              The goal isn't to build every possible feature. It's to nail the core loop: set preferences, plan meals, buy groceries, cook, log, repeat. Everything else just supports that.
            </p>
            <p className="body-base">
              Pravah is early stage but the foundation works. Clear problem, systematic solution, interface that gets out of the way. That's what makes good product design—solving real problems so well people forget they're using an app.
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

export default PravahProject;

