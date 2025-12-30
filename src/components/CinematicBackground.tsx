import React from 'react';
import './CinematicBackground.css';

const CinematicBackground: React.FC = () => {
  return (
    <div className="cinematic-background">
      {/* Deep space base */}
      <div className="space-base" />
      
      {/* Animated gradients */}
      <div className="gradient-1" />
      <div className="gradient-2" />
      <div className="gradient-3" />
      
      {/* Nebula fog */}
      <div className="nebula-layer" />
      
      {/* Subtle scanlines */}
      <div className="scanlines" />
      
      {/* Vignette */}
      <div className="vignette" />
    </div>
  );
};

export default CinematicBackground;
