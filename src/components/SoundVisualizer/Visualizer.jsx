import React, { useEffect, useRef, useState } from 'react';
import { audioManager } from '../../audio/audioManager';

const VISUALIZER_MODES = ['bars', 'wave', 'circular', 'particles'];

export default function Visualizer({ isPlaying, fullWidth = false }) {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('bars');
  const particlesRef = useRef([]);
  const width = fullWidth ? 600 : 220;
  const height = fullWidth ? 80 : 52;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    // Set actual canvas resolution
    canvas.width = width * 2;
    canvas.height = height * 2;
    ctx.scale(2, 2);

    const freqData = new Uint8Array(128);
    const timeData = new Uint8Array(128);

    const render = () => {
      animationId = requestAnimationFrame(render);
      audioManager.getFrequencyData(freqData);
      audioManager.getTimeDomainData(timeData);

      ctx.clearRect(0, 0, width, height);

      switch (mode) {
        case 'bars':
          renderBars(ctx, freqData, width, height);
          break;
        case 'wave':
          renderWave(ctx, timeData, width, height);
          break;
        case 'circular':
          renderCircular(ctx, freqData, width, height);
          break;
        case 'particles':
          renderParticles(ctx, freqData, width, height, particlesRef);
          break;
      }
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [mode, width, height]);

  return (
    <div className="visualizer-wrapper">
      <canvas 
        ref={canvasRef} 
        className="visualizer-canvas"
        style={{ width, height }}
      />
      <div className="visualizer-mode-selector">
        {VISUALIZER_MODES.map(m => (
          <button
            key={m}
            className={`visualizer-mode-btn ${mode === m ? 'active' : ''}`}
            onClick={() => setMode(m)}
            title={m.charAt(0).toUpperCase() + m.slice(1)}
          >
            {m === 'bars' ? '▐▐' : m === 'wave' ? '∿' : m === 'circular' ? '◎' : '✦'}
          </button>
        ))}
      </div>
    </div>
  );
}

function renderBars(ctx, freqData, width, height) {
  const barCount = 32;
  const barWidth = (width / barCount) * 0.75;
  const gap = (width / barCount) * 0.25;

  for (let i = 0; i < barCount; i++) {
    let barHeight = (freqData[i] / 255) * height;
    if (barHeight < 2) {
      barHeight = 1.5 + Math.sin(Date.now() * 0.004 + i * 0.4) * 1;
    }

    const x = i * (barWidth + gap);
    const hue = 240 + (i / barCount) * 80;

    const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
    gradient.addColorStop(0, `hsla(${hue}, 80%, 60%, 0.9)`);
    gradient.addColorStop(1, `hsla(${hue + 40}, 80%, 70%, 0.9)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(x, height - barHeight, barWidth, barHeight, [3, 3, 0, 0]);
    ctx.fill();
  }
}

function renderWave(ctx, timeData, width, height) {
  ctx.lineWidth = 2;
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  gradient.addColorStop(0, '#6366f1');
  gradient.addColorStop(0.5, '#a855f7');
  gradient.addColorStop(1, '#ec4899');
  ctx.strokeStyle = gradient;

  ctx.beginPath();
  const sliceWidth = width / timeData.length;
  let x = 0;

  for (let i = 0; i < timeData.length; i++) {
    const v = timeData[i] / 128.0;
    const y = v * (height / 2);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }

  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // Glow effect
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#a855f7';
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function renderCircular(ctx, freqData, width, height) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(cx, cy) * 0.55;
  const barCount = 32;

  for (let i = 0; i < barCount; i++) {
    const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
    let barLen = (freqData[i] / 255) * radius;
    if (barLen < 2) barLen = 1 + Math.sin(Date.now() * 0.003 + i * 0.5) * 1;

    const x1 = cx + Math.cos(angle) * radius * 0.5;
    const y1 = cy + Math.sin(angle) * radius * 0.5;
    const x2 = cx + Math.cos(angle) * (radius * 0.5 + barLen);
    const y2 = cy + Math.sin(angle) * (radius * 0.5 + barLen);

    const hue = (i / barCount) * 360;
    ctx.strokeStyle = `hsla(${hue}, 80%, 65%, 0.85)`;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  // Center circle
  ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function renderParticles(ctx, freqData, width, height, particlesRef) {
  const particles = particlesRef.current;

  // Calculate average amplitude
  let sum = 0;
  for (let i = 0; i < freqData.length; i++) sum += freqData[i];
  const avg = sum / freqData.length;

  // Spawn particles based on audio energy
  if (avg > 30) {
    for (let i = 0; i < Math.floor(avg / 40); i++) {
      particles.push({
        x: Math.random() * width,
        y: height,
        vx: (Math.random() - 0.5) * 2,
        vy: -(1 + Math.random() * 3),
        size: 1 + Math.random() * 3,
        hue: 240 + Math.random() * 120,
        life: 1
      });
    }
  }

  // Update and draw particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.02; // slight gravity
    p.life -= 0.015;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.life})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    ctx.fill();
  }

  // Keep array bounded
  if (particles.length > 200) {
    particles.splice(0, particles.length - 200);
  }
}
