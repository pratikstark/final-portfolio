import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// Odometer-style animation function
export const createOdometerAnimation = (trigger, elements) => {
  return ScrollTrigger.create({
    trigger: trigger,
    start: 'top 80%',
    end: 'bottom 20%',
    markers: {
      startColor: "blue",
      endColor: "blue",
      indent: 200
    },
    onEnter: () => {
      const textAnimationTl = gsap.timeline();
      
      // First element - pops up from below like odometer
      if (elements.first) {
        textAnimationTl.fromTo(elements.first, 
          { 
            y: 30, 
            opacity: 0,
            rotationX: 90,
            transformOrigin: 'bottom'
          },
          { 
            y: 0, 
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
          }
        );
      }

      // Main element - sober, subtle entrance
      if (elements.main) {
        textAnimationTl.fromTo(elements.main, 
          { 
            y: 20, 
            opacity: 0,
            scale: 0.95
          },
          { 
            y: 0, 
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "power2.out"
          }, "-=0.4"
        );
      }

      // Last element - rolls down from above like odometer
      if (elements.last) {
        textAnimationTl.fromTo(elements.last, 
          { 
            y: -30, 
            opacity: 0,
            rotationX: -90,
            transformOrigin: 'top'
          },
          { 
            y: 0, 
            opacity: 1,
            rotationX: 0,
            duration: 0.8,
            ease: "back.out(1.7)"
          }, "-=0.6"
        );
      }
    }
  });
};

// Helper function to set initial hidden state
export const setInitialHiddenState = (elements) => {
  elements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      element.style.opacity = '0';
    }
  });
};
