import React, { useEffect, useRef } from 'react';
import './VoiceWaveAnimation.css';

function VoiceWaveAnimation({ isActive, isListening }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const waveDataRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 300);
    const height = (canvas.height = 120);
    const centerY = height / 2;
    const bars = 40;
    const barWidth = width / bars;

    // Initialize wave data
    waveDataRef.current = Array(bars).fill(0);

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
      ctx.fillRect(0, 0, width, height);

      if (isActive) {
        // Generate random wave data
        waveDataRef.current = waveDataRef.current.map(() => {
          return Math.random() * (isListening ? 0.8 : 0.6);
        });
      } else {
        // Decay to idle state
        waveDataRef.current = waveDataRef.current.map((val) => val * 0.9);
      }

      // Draw waves
      const color = isListening ? '#ff6b6b' : '#00d4ff';
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.8;

      waveDataRef.current.forEach((amplitude, i) => {
        const x = i * barWidth + barWidth / 2;
        const barHeight = amplitude * 80;
        const y = centerY - barHeight / 2;

        // Rounded rectangle for each bar
        const barRadius = 3;
        ctx.beginPath();
        ctx.moveTo(x + barWidth / 2 - 4 + barRadius, y);
        ctx.lineTo(x + barWidth / 2 + 4 - barRadius, y);
        ctx.quadraticCurveTo(x + barWidth / 2 + 4, y, x + barWidth / 2 + 4, y + barRadius);
        ctx.lineTo(x + barWidth / 2 + 4, y + barHeight - barRadius);
        ctx.quadraticCurveTo(
          x + barWidth / 2 + 4,
          y + barHeight,
          x + barWidth / 2 + 4 - barRadius,
          y + barHeight
        );
        ctx.lineTo(x + barWidth / 2 - 4 + barRadius, y + barHeight);
        ctx.quadraticCurveTo(
          x + barWidth / 2 - 4,
          y + barHeight,
          x + barWidth / 2 - 4,
          y + barHeight - barRadius
        );
        ctx.lineTo(x + barWidth / 2 - 4, y + barRadius);
        ctx.quadraticCurveTo(
          x + barWidth / 2 - 4,
          y,
          x + barWidth / 2 - 4 + barRadius,
          y
        );
        ctx.closePath();
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isListening]);

  return (
    <div className="voice-wave-container">
      <canvas ref={canvasRef} className="voice-wave-canvas"></canvas>
    </div>
  );
}

export default VoiceWaveAnimation;
