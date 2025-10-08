import React from 'react';
import { 
  WelcomeExample, 
  LinesSplitExample, 
  WordsSplitExample, 
  StaggerDirectionsExample, 
  LongTextExample 
} from '../components/ui/vertical-cut-reveal-demo';

const VerticalCutRevealDemo = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ padding: '2rem' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>
          VerticalCutReveal Animation Demo
        </h1>
        
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Welcome Example</h2>
          <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <WelcomeExample />
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Lines Split Example</h2>
          <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <LinesSplitExample />
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Words Split Example</h2>
          <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <WordsSplitExample />
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Stagger Directions Example</h2>
          <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <StaggerDirectionsExample />
          </div>
        </div>

        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Long Text Example</h2>
          <div style={{ height: '400px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            <LongTextExample />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalCutRevealDemo;
