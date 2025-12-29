import React, { useEffect, useRef } from 'react';
import './JARVISLogo.css';

function JARVISLogo({ state }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 250);
    const height = (canvas.height = 250);
    const centerX = width / 2;
    const centerY = height / 2;

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 100; i++) {
        const angle = (Math.random() * Math.PI * 2);
        const velocity = 1 + Math.random() * 2;
        particlesRef.current.push({
          x: centerX,
          y: centerY,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          life: 1,
          decay: Math.random() * 0.01 + 0.005,
          size: Math.random() * 3 + 1,
          color: `hsl(${180 + Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`,
        });
      }
    };

    const animate = () => {
      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(10, 14, 39, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw main logo circle based on state
      ctx.save();

      // Draw glow effect
      const glowIntensity = state === 'listening' ? 0.8 : state === 'thinking' ? 0.6 : state === 'speaking' ? 0.7 : 0.4;
      ctx.shadowColor = state === 'listening' ? '#ff6b6b' : state === 'thinking' ? '#ffd93d' : state === 'speaking' ? '#6bcf7f' : '#00d4ff';
      ctx.shadowBlur = 30 * glowIntensity;

      // Main circle
      ctx.fillStyle = state === 'listening' ? '#ff6b6b' : state === 'thinking' ? '#ffd93d' : state === 'speaking' ? '#6bcf7f' : '#00d4ff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, Math.PI * 2);
      ctx.fill();

      // Inner circle
      ctx.fillStyle = state === 'listening' ? 'rgba(255, 107, 107, 0.3)' : state === 'thinking' ? 'rgba(255, 217, 61, 0.3)' : state === 'speaking' ? 'rgba(107, 207, 127, 0.3)' : 'rgba(0, 212, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fill();

      // Draw text "J"
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 40px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('J', centerX, centerY);

      ctx.restore();

      // Manage particles
      if (state !== 'idle' && particlesRef.current.length < 100) {
        if (Math.random() > 0.5) {
          const angle = Math.random() * Math.PI * 2;
          const velocity = 1 + Math.random() * 2;
          particlesRef.current.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            life: 1,
            decay: Math.random() * 0.01 + 0.005,
            size: Math.random() * 3 + 1,
            color: state === 'listening' ? '#ff6b6b' : state === 'thinking' ? '#ffd93d' : state === 'speaking' ? '#6bcf7f' : '#00d4ff',
          });
        }
      }

      // Draw and update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];

        // Remove fully decayed particles
        if (particle.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        // Integrate motion
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life = Math.max(0, particle.life - particle.decay);

        // Clamp radius to avoid negative values
        const radius = Math.max(0, particle.size * particle.life);
        if (radius <= 0) continue;

        // Draw particle with alpha based on life
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, particle.life));
        ctx.fillStyle = particle.color; // color is HSL string; alpha via globalAlpha
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Draw rotating ring based on state
      if (state !== 'idle') {
        ctx.strokeStyle = state === 'listening' ? '#ff6b6b' : state === 'thinking' ? '#ffd93d' : state === 'speaking' ? '#6bcf7f' : '#00d4ff';
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(centerX, centerY);
        const rotation = (Date.now() % 4000) / 4000 * Math.PI * 2;
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.arc(0, 0, 80, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state]);

  return (
    <div className="jarvis-logo-container">
      <canvas ref={canvasRef} className={`jarvis-canvas ${state}`}></canvas>
      <div className="logo-label">JARVIS</div>
    </div>
  );
}

export default JARVISLogo;
