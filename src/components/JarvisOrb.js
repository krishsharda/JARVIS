import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import './JarvisOrb.css';

const JarvisOrb = ({ state = 'idle' }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const initParticles = () => {
      const particles = [];
      // Reduce particles on mobile for better performance
      const isMobile = window.innerWidth < 768;
      const count = isMobile 
        ? (state === 'idle' ? 20 : state === 'listening' ? 40 : 30)
        : (state === 'idle' ? 40 : state === 'listening' ? 80 : 60);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 120;
        const speed = state === 'idle' ? 0.3 : state === 'listening' ? 1.5 : 0.8;

        particles.push({
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.3,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.3,
          size: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.6 + 0.4,
          color: Math.random() > 0.5 ? '#00d4ff' : '#ffffff',
        });
      }
      particlesRef.current = particles;
    };

    initParticles();

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const coreSize = state === 'idle' ? 35 : state === 'wake' ? 45 : 40;

      // Draw core glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize * 2);
      gradient.addColorStop(0, 'rgba(0, 212, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(0, 150, 200, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 100, 150, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw glowing rings
      if (state !== 'idle') {
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.4 + Math.sin(Date.now() / 500) * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize + 25, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(0, 150, 200, ${0.2 + Math.cos(Date.now() / 700) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, coreSize + 50, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw energy waves for listening
      if (state === 'listening') {
        const waveCount = 4;
        const now = Date.now() / 1000;
        for (let i = 0; i < waveCount; i++) {
          const radius = (now * 60 + i * 30) % 180;
          const alpha = Math.max(0, 1 - radius / 180);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.6})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (state === 'speaking') {
        const now = Date.now() / 300;
        const vibrationX = Math.sin(now) * 3;
        const vibrationY = Math.cos(now * 1.3) * 3;

        for (let i = 0; i < 3; i++) {
          const radius = 60 + i * 25;
          const alpha = 0.3 - i * 0.08;
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(centerX + vibrationX, centerY + vibrationY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 300) {
          const angle = Math.atan2(dy, dx);
          particle.x = centerX + Math.cos(angle) * 280;
          particle.y = centerY + Math.sin(angle) * 280;
        }

        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      // Draw core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, coreSize);
      coreGradient.addColorStop(0, '#ffffff');
      coreGradient.addColorStop(0.5, '#00d4ff');
      coreGradient.addColorStop(1, '#0096c8');
      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreSize, 0, Math.PI * 2);
      ctx.fill();

      // Core highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(centerX - coreSize * 0.3, centerY - coreSize * 0.3, coreSize * 0.4, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [state]);

  const orbScale = state === 'wake' ? 1.15 : 1;
  const orbGlow = state === 'idle' ? 'shadow-lg' : 'shadow-2xl';

  return (
    <div className="jarvis-orb-container">
      <canvas ref={canvasRef} className="jarvis-canvas" />
      
      <motion.div
        className={`jarvis-core-indicator ${orbGlow}`}
        animate={{
          scale: orbScale,
          opacity: state === 'idle' ? 0.8 : 1,
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      />

      {state === 'listening' && (
        <motion.div
          className="listening-ring"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {state === 'speaking' && (
        <motion.div
          className="speaking-indicator"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default JarvisOrb;
