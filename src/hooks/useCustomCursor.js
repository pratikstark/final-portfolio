import { useEffect, useRef } from 'react';

export const useCustomCursor = () => {
  const cursorCreatedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple cursor creation
    if (cursorCreatedRef.current) {
      return;
    }
    
    let mouseX = window.innerWidth / 2;
    let mouseY = -50; // Position cursor at top center but out of sight
    let trailX = window.innerWidth / 2;
    let trailY = -50; // Position trail at top center but out of sight

    // Check if cursor elements already exist and remove them first
    const existingCursor = document.querySelector('.custom-cursor');
    const existingTrail = document.querySelector('.cursor-trail');
    
    if (existingCursor) {
      try {
        // Use modern DOM API instead of removeChild
        existingCursor.remove();
      } catch (error) {
        // Could not remove existing cursor
      }
    }
    if (existingTrail) {
      try {
        // Use modern DOM API instead of removeChild
        existingTrail.remove();
      } catch (error) {
        // Could not remove existing trail
      }
    }

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    document.body.appendChild(cursor);

    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = trailX + 'px';
    trail.style.top = trailY + 'px';
    document.body.appendChild(trail);
    
    // Mark cursor as created
    cursorCreatedRef.current = true;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    };

    const animateTrail = () => {
      // Only animate the trail if it's not locked to a project
      if (!trail.classList.contains('is-locked')) {
        trailX += (mouseX - trailX) * 0.3;
        trailY += (mouseY - trailY) * 0.3;
        trail.style.left = trailX + 'px';
        trail.style.top = trailY + 'px';
      }
      requestAnimationFrame(animateTrail);
    };

    animateTrail();
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      
      // Reset the cursor creation flag
      cursorCreatedRef.current = false;
      
      // Use a more defensive approach - just hide the elements instead of removing them
      const currentCursor = document.querySelector('.custom-cursor');
      const currentTrail = document.querySelector('.cursor-trail');
      
      if (currentCursor) {
        currentCursor.style.display = 'none';
        currentCursor.classList.remove('is-locked');
      }
      
      if (currentTrail) {
        currentTrail.style.display = 'none';
        currentTrail.classList.remove('is-locked');
      }
    };
  }, []);
};
