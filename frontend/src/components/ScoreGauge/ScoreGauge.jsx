import { useEffect, useRef } from 'react';

const SCORE_COLORS = {
  Poor: '#ef4444',
  Fair: '#f97316',
  Good: '#f59e0b',
  'Very Good': '#22c55e',
  Excellent: '#4f8eff',
};

function getCategory(score) {
  if (score < 580) return 'Poor';
  if (score < 670) return 'Fair';
  if (score < 740) return 'Good';
  if (score < 800) return 'Very Good';
  return 'Excellent';
}

export default function ScoreGauge({ score, size = 220, animated = true }) {
  const canvasRef = useRef(null);
  const category = getCategory(score);
  const color = SCORE_COLORS[category];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2 + 20;
    const radius = size / 2 - 20;
    const startAngle = Math.PI * 0.75;
    const endAngle = Math.PI * 2.25;

    const pct = (score - 300) / (850 - 300);
    const targetAngle = startAngle + (endAngle - startAngle) * pct;

    let currentAngle = startAngle;
    const steps = animated ? 60 : 1;
    const increment = (targetAngle - startAngle) / steps;

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // Background arc
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.lineWidth = 16;
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineCap = 'round';
      ctx.stroke();

      // Gradient segments (poor → excellent)
      const gradient = ctx.createLinearGradient(0, 0, size, 0);
      gradient.addColorStop(0, '#ef4444');
      gradient.addColorStop(0.25, '#f97316');
      gradient.addColorStop(0.5, '#f59e0b');
      gradient.addColorStop(0.75, '#22c55e');
      gradient.addColorStop(1, '#4f8eff');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, currentAngle);
      ctx.lineWidth = 16;
      ctx.strokeStyle = gradient;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, currentAngle - 0.05, currentAngle);
      ctx.lineWidth = 18;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    if (animated) {
      let frame = 0;
      const animate = () => {
        if (frame < steps) {
          currentAngle += increment;
          draw();
          frame++;
          requestAnimationFrame(animate);
        } else {
          currentAngle = targetAngle;
          draw();
        }
      };
      animate();
    } else {
      currentAngle = targetAngle;
      draw();
    }
  }, [score, size, animated, color]);

  return (
    <div style={{ position: 'relative', width: size, height: size * 0.85, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, position: 'absolute', top: 0, left: 0 }}
      />
      <div style={{
        position: 'absolute',
        top: '52%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: size * 0.18,
          fontWeight: 800,
          color: color,
          lineHeight: 1,
          textShadow: `0 0 20px ${color}44`,
        }}>
          {score}
        </div>
        <div style={{ fontSize: size * 0.07, color: 'var(--text-secondary)', marginTop: 4 }}>
          of 850
        </div>
        <div style={{
          marginTop: 8,
          padding: '3px 10px',
          background: `${color}22`,
          border: `1px solid ${color}44`,
          borderRadius: 100,
          fontSize: size * 0.065,
          fontWeight: 700,
          color: color,
        }}>
          {category}
        </div>
      </div>
    </div>
  );
}
