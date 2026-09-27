import React, { useEffect, useRef } from 'react';
import { CATEGORY_COLORS } from '../../config/pianoConfig';

export default function ParticleCanvas({ triggeredKey }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animIdRef = useRef(null);

  // Resize canvas to match screen
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Spawn particle explosion when key is triggered
  useEffect(() => {
    if (!triggeredKey || !triggeredKey.keyConfig) return;

    const { keyConfig } = triggeredKey;
    const catColor = CATEGORY_COLORS[keyConfig.category] || CATEGORY_COLORS.Meme;
    const primaryColor = catColor.primary || '#6366f1';

    // Find key element coordinates on screen
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.7;

    const keyEl = document.querySelector(`[data-key-id="${keyConfig.id}"]`);
    if (keyEl) {
      const rect = keyEl.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height * 0.4;
    }

    const dpr = window.devicePixelRatio || 1;
    const cx = x * dpr;
    const cy = y * dpr;

    const newParticles = [];

    // 1. Neon Sparkles (25 particles)
    for (let i = 0; i < 28; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2 + Math.random() * 8) * dpr;
      newParticles.push({
        type: 'sparkle',
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3) * dpr,
        size: (3 + Math.random() * 5) * dpr,
        color: primaryColor,
        alpha: 1,
        life: 1,
        decay: 0.015 + Math.random() * 0.02,
        gravity: 0.12 * dpr
      });
    }

    // 2. Shockwave Ring (1-2 rings)
    newParticles.push({
      type: 'ring',
      x: cx,
      y: cy,
      radius: 10 * dpr,
      maxRadius: (60 + Math.random() * 40) * dpr,
      color: primaryColor,
      alpha: 0.9,
      decay: 0.03,
      lineWidth: 4 * dpr
    });

    // 3. Floating Sound Emoji
    newParticles.push({
      type: 'emoji',
      x: cx,
      y: cy - 20 * dpr,
      vx: (Math.random() - 0.5) * 2 * dpr,
      vy: -(3 + Math.random() * 2) * dpr,
      emoji: keyConfig.emoji || '🎵',
      size: (24 + Math.random() * 12) * dpr,
      alpha: 1,
      decay: 0.018,
      rotation: (Math.random() - 0.5) * 0.4,
      rotSpeed: (Math.random() - 0.5) * 0.05
    });

    // 4. Vertical Light Beam
    newParticles.push({
      type: 'beam',
      x: cx,
      width: (20 + Math.random() * 15) * dpr,
      height: cy,
      color: primaryColor,
      alpha: 0.7,
      decay: 0.05
    });

    particlesRef.current.push(...newParticles);

    // Start animation loop if not running
    if (!animIdRef.current) {
      startAnimation();
    }
  }, [triggeredKey]);

  // Main Render Loop
  const startAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      const particles = particlesRef.current;
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animIdRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);

        if (p.type === 'sparkle') {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.96;

          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (p.type === 'ring') {
          p.radius += (p.maxRadius - p.radius) * 0.15;

          ctx.strokeStyle = p.color;
          ctx.lineWidth = p.lineWidth * p.alpha;
          ctx.shadowBlur = 16;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (p.type === 'emoji') {
          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotSpeed;

          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.font = `${p.size}px Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fillText(p.emoji, 0, 0);
        }
        else if (p.type === 'beam') {
          const gradient = ctx.createLinearGradient(p.x, p.height, p.x, 0);
          gradient.addColorStop(0, p.color);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.fillRect(p.x - p.width / 2, 0, p.width, p.height);
        }

        ctx.restore();
      }

      animIdRef.current = requestAnimationFrame(animate);
    };

    animIdRef.current = requestAnimationFrame(animate);
  };

  return (
    <canvas 
      ref={canvasRef}
      className="particle-overlay-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}
