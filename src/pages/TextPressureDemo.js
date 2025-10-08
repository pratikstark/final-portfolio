import React from 'react';
import { ThemeProvider } from '../components/ui/theme-provider.js';
import { Default } from '../components/ui/text-pressure-demo.js';

function TextPressureDemo() {
  return (
    <ThemeProvider>
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <h1 style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          Interactive Text Pressure Component Demo
        </h1>
        
        <div style={{ 
          background: 'rgba(255,255,255,0.1)', 
          padding: '2rem', 
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          width: '100%',
          maxWidth: '800px'
        }}>
          <h3 style={{ color: 'white', marginBottom: '1rem', textAlign: 'center' }}>Interactive Text Pressure</h3>
          <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Default />
          </div>
          <p style={{ color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: '1rem' }}>
            Move your mouse around to see the interactive effects!
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default TextPressureDemo;
